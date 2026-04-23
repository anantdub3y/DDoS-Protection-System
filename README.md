# ML DDoS Shield & Protection System

<p align="center">
  <em>A machine-learning powered DDoS detection and mitigation system that uses behavioral analytics, anomaly detection, a game-based CAPTCHA, and an IP honeypot trap to neutralize malicious traffic — without disrupting real users.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-teal" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-blue" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React%20%2B%20Vite-coral" alt="React" />
  <img src="https://img.shields.io/badge/Redis-amber" alt="Redis" />
</p>

---

## 📑 Table of Contents
* [System Architecture](#system-architecture)
* [Folder Structure](#folder-structure)
* [Complete Tool Stack](#complete-tool-stack)
* [Getting Started / Setup](#getting-started--setup)
* [Behavioral Feature Table](#behavioral-feature-table)

---

## 🏗 System Architecture

The project consists of multiple interacting modules designed to protect applications from DDoS attacks:

1. **Frontend Metric Collector**: A passive script (`tracker.js`) attaches to every user interaction, computing behavioral features (entropy, variance, velocity) and posting them to the ML backend.
2. **FastAPI ML Backend**: Every session goes through three checks (Redis cache, ML scorer IsolationForest + RandomForest, AbuseIPDB lookup). The decision engine allows, challenges, or drops the request.
3. **Game CAPTCHA**: Suspicious traffic is challenged with a Dino Run game. Passing issues an HMAC-signed session token.
4. **Honeypot Server**: Confirmed bots are silently redirected to a mirror server to tar-pit them without alerting the attacker.
5. **EduNexus Integrated Showcase**: A mock education app wired with the full protection suite.

---

## 📂 Folder Structure

The repository has been organized into clear, dedicated folders for each module:

* **`DDOS_MACHINE_SERVERBASE/`** — The overarching integrated project featuring the "EduNexus" mock app and the Matrix Dashboard for viewing live attack traffic.
* **`DDOS_MACHINE_BACKEND/`** — The FastAPI ML scoring backend, honeypot app, and traffic simulator.
* **`DDOS_MACHINE_FRONTEND/`** — The frontend dashboard and configuration for the protection UI.
* **`DDOS_CAPTCHA_SYSTEM/`** — The standalone Game CAPTCHA implementation using Redis and advanced human-behavior detection logic.

---

## 🛠 Complete Tool Stack

* **Backend ML Engine**: Python, FastAPI, scikit-learn (IsolationForest, RandomForest), Numpy, Pandas.
* **Frontend**: React 18, Vite.
* **Infrastructure**: Docker Desktop (Redis), ngrok (Public tunneling).
* **Simulation & Traffic**: Locust (Simulator), Faker, Flask (Target App).

---

## 🚀 Getting Started / Setup

### 1. The Integrated EduNexus Project
To run the full integrated show-case, navigate to the `DDOS_MACHINE_SERVERBASE` directory.

**Start the Backend:**
```bash
cd DDOS_MACHINE_SERVERBASE/backend
python server.py
# Runs on http://localhost:8080
```

**Start EduNexus (The Target App):**
```bash
cd DDOS_MACHINE_SERVERBASE/edunexus
npm install
npm run dev
# Opens at http://localhost:5173
```
*Tip: Open `DDOS_MACHINE_SERVERBASE/matrix_dashboard/index.html` directly in your browser to watch live real-time metrics!*

### 2. Standalone ML Engine & Dataset Generation
To train models and run the FastAPI backend directly, use the `DDOS_MACHINE_BACKEND` directory.

```bash
cd DDOS_MACHINE_BACKEND
pip install fastapi uvicorn scikit-learn numpy pandas redis

# Generate synthetic humans/bots and train the models
python generate_dataset.py
python ml_model.py
```

### 3. Running the Attack Simulator
You can simulate an attack pattern locally and view the system's responsive actions:
```bash
cd DDOS_MACHINE_SERVERBASE/backend
python attacker.py --url http://localhost:8080 --threads 30 --duration 30
```
*Watch the Matrix Dashboard update in real-time as the DDoS protection kicks in and flags the malicious traffic.*

---

## 📊 Behavioral Feature Table

Every session is scored on 8 primary signals computed over a 10-second rolling window per IP.

| Feature | Human Range | Bot Signature | Why it Matters |
| --- | --- | --- | --- |
| `click_count` | 3–20 | 50–300+ | Bots click far more per window |
| `avg_click_interval` | 400–2000ms | < 100ms | Inhuman speed is the clearest tell |
| `click_interval_variance`| 50k–350k | < 200 | Humans have natural timing jitter |
| `click_interval_entropy` | 2.0–4.0 bits | < 0.5 | Bot timing patterns have near-zero entropy |
| `mouse_velocity_variance`| 0.2–1.5 | ~0 | No mouse movement = no browser / mobile tap |
| `max_element_click_rate` | 0.1–4.0/s | 10–60/s | Hammering one endpoint is a DDoS signature |
| `scroll_events` | 2–15 | 0 or 1000+ | Real pages get scrolled; raw HTTP calls don't |
| `keystroke_count` | 5–80 | 0 or uniform | Zero keys = no interaction; uniform = paste bot |
