"""
DDoS Protection Backend — Supabase Edition
-------------------------------------------
All events are persisted to Supabase (no ngrok needed).
The Matrix Dashboard reads directly from Supabase Realtime.

Setup:
  1. Copy .env.example → .env and fill in your Supabase credentials
  2. Run the SQL schema in your Supabase SQL editor (see supabase_schema.sql)
  3. pip install -r requirements.txt
  4. python server.py

Endpoints:
  GET  /           → welcome page
  GET  /stats      → JSON stats
  GET  /health     → health check
  GET  /heavy      → CPU-heavy test endpoint
  POST /track      → click/interaction events from EduNexus
  GET  /matrix     → rich matrix data for dashboard
  GET  /blocked    → list of currently banned IPs
  POST /unban      → unban an IP  { "ip": "..." }
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime
from pathlib import Path
from collections import Counter, deque
import threading, json, time, os

# ── Load env ─────────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

import requests as _requests

SUPABASE_URL     = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY     = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

def _sb(table):
    return f"{SUPABASE_URL}/rest/v1/{table}"

def _insert(table, payload, silent=True):
    """Fire-and-forget insert to Supabase (runs in background thread)."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    def _do():
        try:
            _requests.post(_sb(table), headers=SUPABASE_HEADERS,
                           json=payload, timeout=5)
        except Exception as e:
            if not silent:
                print(f"[Supabase] insert error ({table}): {e}")
    threading.Thread(target=_do, daemon=True).start()

def _upsert_ban(ip, ban_until_iso, reason="auto-ban"):
    """Upsert a banned IP into Supabase."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    def _do():
        try:
            hdrs = {**SUPABASE_HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"}
            _requests.post(_sb("banned_ips"), headers=hdrs,
                           json={"ip": ip, "banned_until": ban_until_iso, "reason": reason},
                           timeout=5)
        except Exception as e:
            print(f"[Supabase] ban upsert error: {e}")
    threading.Thread(target=_do, daemon=True).start()

def _delete_ban(ip):
    """Remove a ban from Supabase."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    def _do():
        try:
            _requests.delete(f"{_sb('banned_ips')}?ip=eq.{ip}",
                             headers=SUPABASE_HEADERS, timeout=5)
        except Exception as e:
            print(f"[Supabase] delete ban error: {e}")
    threading.Thread(target=_do, daemon=True).start()

# ── Config ───────────────────────────────────────────────────────────────────
HOST            = "0.0.0.0"
PORT            = 8080
RATE_LIMIT      = 30        # max requests per IP per RATE_WINDOW seconds
RATE_WINDOW     = 10        # seconds
BAN_THRESHOLD   = 60        # requests before auto-ban
BAN_DURATION    = 300       # seconds to keep IP banned
MAX_LOG         = 2000      # max in-memory log entries
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

# ── In-memory state (fast; Supabase is the persistent store) ─────────────────
lock        = threading.Lock()
REQUEST_LOG = deque(maxlen=MAX_LOG)
CLICK_LOG   = deque(maxlen=5000)
ip_windows  = {}           # ip -> deque of timestamps
banned_ips  = {}           # ip -> ban_until (epoch float)
START_TIME  = time.time()

# ── Core helpers ─────────────────────────────────────────────────────────────
def is_banned(ip):
    with lock:
        if ip in banned_ips:
            if time.time() < banned_ips[ip]:
                return True
            else:
                del banned_ips[ip]
    return False

def check_rate_limit(ip):
    """Returns True if within limit. Returns False and bans if exceeded."""
    now = time.time()
    with lock:
        if ip not in ip_windows:
            ip_windows[ip] = deque()
        win = ip_windows[ip]
        while win and win[0] < now - RATE_WINDOW:
            win.popleft()
        win.append(now)
        count = len(win)
        if count >= BAN_THRESHOLD:
            ban_until = now + BAN_DURATION
            banned_ips[ip] = ban_until
            ban_iso = datetime.fromtimestamp(ban_until).isoformat()
            # Persist ban to Supabase
            _upsert_ban(ip, ban_iso)
            return False
        return count <= RATE_LIMIT

def record_request(ip, path, method, blocked=False):
    entry = {
        "time":    datetime.now().isoformat(timespec="seconds"),
        "ip":      ip,
        "path":    path,
        "method":  method,
        "blocked": blocked,
    }
    with lock:
        REQUEST_LOG.append(entry)
    # Async persist to Supabase
    _insert("request_log", {
        "ip":          ip,
        "path":        path,
        "method":      method,
        "blocked":     blocked,
        "status_code": 429 if blocked else 200,
    })

def record_click(data):
    entry = {"time": datetime.now().isoformat(timespec="milliseconds"), **data}
    with lock:
        CLICK_LOG.append(entry)
    # Async persist to Supabase
    _insert("click_events", {
        "page":       data.get("page", "unknown"),
        "element":    data.get("element", "unknown"),
        "event_type": data.get("event_type", "click"),
        "from_ip":    data.get("from_ip", ""),
        "meta":       json.dumps({k: v for k, v in data.items()
                                  if k not in ("page","element","event_type","from_ip")}),
    })

# ── Stats builders ────────────────────────────────────────────────────────────
def get_stats():
    with lock:
        logs   = list(REQUEST_LOG)
        clicks = list(CLICK_LOG)
        bans   = dict(banned_ips)

    total   = len(logs)
    blocked = sum(1 for r in logs if r.get("blocked"))
    uptime  = int(time.time() - START_TIME)

    ip_counts        = Counter(r["ip"]   for r in logs)
    path_counts      = Counter(r["path"] for r in logs)
    blocked_ip_counts = Counter(r["ip"]  for r in logs if r.get("blocked"))

    now    = datetime.now()
    recent = [r for r in logs
              if (now - datetime.fromisoformat(r["time"])).total_seconds() < 60]
    rps = round(len(recent) / 60, 2)

    click_targets = Counter(c.get("element", "unknown") for c in clicks)
    click_pages   = Counter(c.get("page",    "unknown") for c in clicks)

    return {
        "total_requests":    total,
        "allowed_requests":  total - blocked,
        "blocked_requests":  blocked,
        "unique_ips":        len(ip_counts),
        "banned_ips":        len(bans),
        "uptime_sec":        uptime,
        "req_per_sec":       rps,
        "top_ips":           dict(ip_counts.most_common(10)),
        "top_paths":         dict(path_counts.most_common(10)),
        "top_blocked_ips":   dict(blocked_ip_counts.most_common(5)),
        "recent_requests":   logs[-50:],
        "total_clicks":      len(clicks),
        "top_click_targets": dict(click_targets.most_common(15)),
        "top_click_pages":   dict(click_pages.most_common(10)),
        "recent_clicks":     clicks[-30:],
        "banned_list":       [
            {"ip": ip, "until": datetime.fromtimestamp(ts).isoformat()}
            for ip, ts in bans.items()
        ],
        "supabase_connected": bool(SUPABASE_URL and SUPABASE_KEY),
    }

def get_matrix():
    with lock:
        logs   = list(REQUEST_LOG)
        clicks = list(CLICK_LOG)
        bans   = dict(banned_ips)

    now = datetime.now()

    # Per-second timeline (last 60s)
    timeline = {}
    for r in logs:
        try:
            t   = datetime.fromisoformat(r["time"])
            sec = int((now - t).total_seconds())
            if 0 <= sec < 60:
                key = 60 - sec
                tl  = timeline.setdefault(key, {"allowed": 0, "blocked": 0})
                if r.get("blocked"):
                    tl["blocked"] += 1
                else:
                    tl["allowed"] += 1
        except Exception:
            pass

    timeline_arr = [
        {"sec": k, **timeline.get(k, {"allowed": 0, "blocked": 0})}
        for k in range(1, 61)
    ]

    # IP threat matrix
    ip_counts  = Counter(r["ip"] for r in logs)
    ip_blocked = Counter(r["ip"] for r in logs if r.get("blocked"))
    ip_matrix  = []
    for ip, total in ip_counts.most_common(20):
        blk    = ip_blocked.get(ip, 0)
        threat = ("critical" if ip in bans else
                  "high"     if blk > 10  else
                  "medium"   if blk > 0   else "low")
        ip_matrix.append({
            "ip": ip, "total": total,
            "blocked": blk, "allowed": total - blk,
            "threat": threat, "banned": ip in bans,
        })

    # Endpoint matrix
    path_counts  = Counter(r["path"] for r in logs)
    path_blocked = Counter(r["path"] for r in logs if r.get("blocked"))
    endpoint_matrix = [
        {
            "path": p, "total": c,
            "blocked": path_blocked.get(p, 0),
            "allowed": c - path_blocked.get(p, 0),
        }
        for p, c in path_counts.most_common(15)
    ]

    # Click matrix
    click_targets = Counter(c.get("element", "?") for c in clicks)
    click_pages   = Counter(c.get("page",    "?") for c in clicks)
    click_matrix  = [
        {"element": el, "count": cnt, "page": click_pages.get(el, "?")}
        for el, cnt in click_targets.most_common(30)
    ]

    return {
        "timestamp":       now.isoformat(),
        "timeline":        timeline_arr,
        "ip_matrix":       ip_matrix,
        "endpoint_matrix": endpoint_matrix,
        "click_matrix":    click_matrix,
        "summary": {
            "total":   len(logs),
            "blocked": sum(1 for r in logs if r.get("blocked")),
            "banned":  len(bans),
            "clicks":  len(clicks),
            "uptime":  int(time.time() - START_TIME),
        },
    }


# ── HTTP Handler ──────────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        ip = self.client_address[0]
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {ip}  {fmt % args}")

    def _cors_headers(self):
        origin = self.headers.get("Origin", "")
        self.send_header("Access-Control-Allow-Origin",  origin or "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With")
        self.send_header("Access-Control-Max-Age",       "86400")

    def _respond(self, code, content_type, body):
        if isinstance(body, str):
            body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type",   content_type)
        self.send_header("Content-Length", str(len(body)))
        self._cors_headers()
        self.send_header("X-Server", "DDoS-Shield/4.0-Supabase")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code, data):
        self._respond(code, "application/json", json.dumps(data, indent=2))

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def _gate(self):
        """Returns False and sends 429 if IP is blocked."""
        ip   = self.client_address[0]
        path = self.path.split("?")[0]
        if is_banned(ip):
            record_request(ip, path, "GET", blocked=True)
            self._json(429, {"error": "Too many requests — IP banned",
                             "retry_after": BAN_DURATION})
            return False
        if not check_rate_limit(ip):
            record_request(ip, path, "GET", blocked=True)
            self._json(429, {"error": "Rate limit exceeded",
                             "retry_after": RATE_WINDOW})
            return False
        return True

    def do_GET(self):
        ip   = self.client_address[0]
        path = self.path.split("?")[0]

        if not self._gate():
            return

        record_request(ip, path, "GET")

        if path in ("/", "/index.html"):
            self._respond(200, "text/html; charset=utf-8", WELCOME_HTML)

        elif path == "/stats":
            self._json(200, get_stats())

        elif path == "/matrix":
            self._json(200, get_matrix())

        elif path == "/blocked":
            with lock:
                bans = dict(banned_ips)
            self._json(200, {
                "banned": [
                    {
                        "ip":            ip,
                        "until":         datetime.fromtimestamp(ts).isoformat(),
                        "remaining_sec": max(0, int(ts - time.time())),
                    }
                    for ip, ts in bans.items()
                ]
            })

        elif path == "/health":
            self._respond(200, "text/plain", "OK")

        elif path == "/heavy":
            time.sleep(0.05)
            result = sum(i * i for i in range(100_000))
            self._json(200, {"status": "ok", "result": result})

        else:
            self._json(404, {"error": "Not found"})

    def do_POST(self):
        ip   = self.client_address[0]
        path = self.path.split("?")[0]

        if not self._gate():
            return

        length = int(self.headers.get("Content-Length", 0))
        raw    = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw)
        except Exception:
            body = {}

        record_request(ip, path, "POST")

        if path == "/track":
            body["from_ip"] = ip
            record_click(body)
            self._json(200, {"status": "recorded"})

        elif path == "/unban":
            target_ip = body.get("ip", "")
            with lock:
                removed = target_ip in banned_ips
                if removed:
                    del banned_ips[target_ip]
            _delete_ban(target_ip)
            self._json(200, {"status": "unbanned" if removed else "not_found",
                             "ip": target_ip})

        else:
            self._json(200, {"status": "received",
                             "bytes_in": length, "from_ip": ip})


# ── Welcome HTML ──────────────────────────────────────────────────────────────
WELCOME_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>DDoS Shield — Supabase Edition</title>
<style>
  body{font-family:monospace;background:#060608;color:#00ffa3;
       display:flex;align-items:center;justify-content:center;
       min-height:100vh;margin:0;}
  .box{border:1px solid #00ffa3;padding:2rem 3rem;text-align:center;
       box-shadow:0 0 30px rgba(0,255,163,.2);}
  h1{font-size:1.5rem;margin-bottom:1rem;}
  .badge{color:#7fefcd;font-size:.85rem;margin-bottom:1.2rem;}
  table{margin:1rem auto;border-collapse:collapse;}
  td{padding:.3rem 1rem;border-bottom:1px solid #1e2030;}
</style>
</head>
<body>
<div class="box">
  <h1>🛡 DDoS Shield Backend v4.0</h1>
  <div class="badge">⚡ Supabase Edition — no ngrok needed</div>
  <table>
    <tr><td>GET /stats</td><td>Full statistics JSON</td></tr>
    <tr><td>GET /matrix</td><td>Matrix dashboard data</td></tr>
    <tr><td>GET /blocked</td><td>Banned IP list</td></tr>
    <tr><td>GET /health</td><td>Health check</td></tr>
    <tr><td>GET /heavy</td><td>CPU-heavy test endpoint</td></tr>
    <tr><td>POST /track</td><td>Click tracking (EduNexus)</td></tr>
    <tr><td>POST /unban</td><td>Unban IP { "ip": "..." }</td></tr>
  </table>
</div>
</body>
</html>"""


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    sb_status = "✅ Connected" if (SUPABASE_URL and SUPABASE_KEY) else "⚠️  Not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in .env"

    print(f"""
╔══════════════════════════════════════════════════════╗
║     🛡  DDoS Shield Backend v4.0 (Supabase)          ║
╠══════════════════════════════════════════════════════╣
║  Dashboard  →  http://localhost:{PORT}                 ║
║  Stats API  →  http://localhost:{PORT}/stats           ║
║  Matrix     →  http://localhost:{PORT}/matrix          ║
║  Health     →  http://localhost:{PORT}/health          ║
╠══════════════════════════════════════════════════════╣
║  Rate limit : {RATE_LIMIT} req / {RATE_WINDOW}s per IP               ║
║  Auto-ban   : {BAN_THRESHOLD} req triggers {BAN_DURATION}s ban         ║
╠══════════════════════════════════════════════════════╣
║  Supabase   : {sb_status:<38}║
║                                                      ║
║  ► Events saved to Supabase → no ngrok needed        ║
║  ► Dashboard reads from Supabase Realtime            ║
╠══════════════════════════════════════════════════════╣
║  Connect EduNexus → http://localhost:5173            ║
║  Matrix Dashboard → open matrix_dashboard/index.html║
╚══════════════════════════════════════════════════════╝
""")

    server = HTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Server stopped.")
        server.server_close()
