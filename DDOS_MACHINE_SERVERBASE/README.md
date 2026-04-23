# DDoS Protection System — Integrated Project

## Architecture

```
┌──────────────────────┐     HTTP clicks/requests     ┌─────────────────────────┐
│   EduNexus (React)   │ ──────────────────────────► │   DDoS Backend Server   │
│   localhost:5173     │ ◄────────────────────────── │   localhost:8080        │
└──────────────────────┘     rate-limited responses   └─────────────────────────┘
                                                               │
                                                        /matrix API
                                                               │
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │  Matrix Dashboard       │
                                                  │  (open index.html)      │
                                                  └─────────────────────────┘
```

## Folder Structure

```
ddos_integrated/
├── backend/
│   ├── server.py         ← Enhanced DDoS protection backend
│   └── attacker.py       ← DDoS attack simulator (testing only)
│
├── edunexus/             ← Main site (React + Vite)
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useClickTracker.js   ← Sends click events to backend
│   │   ├── pages/        ← All pages wired with click tracking
│   │   └── ...
│   ├── .env              ← VITE_BACKEND_URL=http://localhost:8080
│   └── package.json
│
└── matrix_dashboard/
    └── index.html        ← Open directly in browser (no build needed)
```

## Quick Start

### Step 1 — Start the Backend

```bash
cd backend
python server.py
```

The backend runs on **http://localhost:8080**

Endpoints:
| Endpoint   | Description                             |
|------------|-----------------------------------------|
| `GET /`    | Backend info page                       |
| `GET /stats` | Full statistics JSON                  |
| `GET /matrix` | Rich matrix data for the dashboard   |
| `GET /health` | Health check → `OK`                  |
| `GET /heavy`  | CPU-heavy test endpoint (attack target)|
| `POST /track` | Click/interaction events from EduNexus|
| `GET /blocked`| Currently banned IPs                  |
| `POST /unban` | Unban an IP `{ "ip": "1.2.3.4" }`    |

### Step 2 — Start EduNexus

```bash
cd edunexus
npm install
npm run dev
```

EduNexus opens at **http://localhost:5173**

Every button, link, and nav item click is automatically sent to the backend's `/track` endpoint and appears in the Matrix Dashboard.

### Step 3 — Open the Matrix Dashboard

Open **`matrix_dashboard/index.html`** directly in your browser.
No server needed — it polls the backend via its REST API.

The dashboard shows:
- 📈 **Traffic Timeline** — last 60 seconds of requests (allowed vs blocked)
- 🌐 **IP Threat Matrix** — per-IP request counts, threat level, ban status
- 🔗 **Endpoint Hit Matrix** — which URLs are being hit most
- 🖱 **Click Element Matrix** — every clickable element from EduNexus with hit counts
- ⚡ **Live Request Feed** — real-time stream of incoming requests
- 🖱 **Live Click Feed** — real-time stream of EduNexus user interactions

### Step 4 (Optional) — Run the Attack Simulator

```bash
cd backend
python attacker.py --url http://localhost:8080 --threads 30 --duration 30
```

Watch the Matrix Dashboard update in real-time as the DDoS protection kicks in.

## DDoS Protection Config

Edit the top of `backend/server.py` to tune:

```python
RATE_LIMIT    = 30    # max requests per IP per RATE_WINDOW seconds
RATE_WINDOW   = 10    # seconds
BAN_THRESHOLD = 60    # requests before auto-ban
BAN_DURATION  = 300   # seconds to keep IP banned
```

## How EduNexus Connects to Backend

The `useClickTracker` hook (in `edunexus/src/hooks/useClickTracker.js`) attaches a global click listener to the document. Every click on a button, link, or interactive element is POSTed to:

```
POST http://localhost:8080/track
{ "page": "Home", "element": "Student Login", "event": "click" }
```

The backend records it and the Matrix Dashboard displays it in the click matrix.

The backend URL is configured via `.env`:
```
VITE_BACKEND_URL=http://localhost:8080
```
