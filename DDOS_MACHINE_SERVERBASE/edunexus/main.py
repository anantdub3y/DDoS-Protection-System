from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3, time, os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "requests.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric TEXT NOT NULL,
            ip TEXT,
            user_agent TEXT,
            timestamp TEXT NOT NULL,
            unix_ts REAL NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.post("/api/track/{metric}")
async def track(metric: str, request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host)
    ua = request.headers.get("user-agent", "unknown")
    now = datetime.utcnow().isoformat()
    ts = time.time()

    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO requests (metric, ip, user_agent, timestamp, unix_ts) VALUES (?, ?, ?, ?, ?)",
        (metric, ip, ua, now, ts)
    )
    conn.commit()
    conn.close()

    return {"status": "ok", "metric": metric}

@app.get("/api/stats")
async def stats():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT metric, COUNT(*) as count
        FROM requests
        GROUP BY metric
        ORDER BY count DESC
    """).fetchall()
    conn.close()
    return {"stats": [{"metric": r[0], "count": r[1]} for r in rows]}

@app.get("/api/stats/{metric}")
async def metric_stats(metric: str):
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT timestamp, ip FROM requests
        WHERE metric = ?
        ORDER BY unix_ts DESC
        LIMIT 100
    """, (metric,)).fetchall()
    total = conn.execute("SELECT COUNT(*) FROM requests WHERE metric=?", (metric,)).fetchone()[0]
    conn.close()
    return {"metric": metric, "total": total, "recent": [{"timestamp": r[0], "ip": r[1]} for r in rows]}

@app.get("/health")
async def health():
    return {"status": "alive"}
