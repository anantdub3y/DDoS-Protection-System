# DDoS Simulation and ML Detection System

A complete hackathon project for simulating DDoS attacks and detecting them using machine learning.

## Quick Start

```batch
run.bat
```

## Components

| File | Description |
|------|-------------|
| `app.py` | Flask target application |
| `simulate_traffic.py` | Locust traffic generator (70% normal, 30% bot) |
| `features.py` | Feature engineering (10-second windows) |
| `train_model.py` | Trains Isolation Forest + Random Forest |
| `detect.py` | Real-time detection |
| `dashboard.py` | Streamlit dashboard |
| `run.bat` | Windows orchestration script |

## Manual Execution

```batch
pip install -r requirements.txt
python app.py &
python simulate_traffic.py
python features.py
python train_model.py
python detect.py &
streamlit run dashboard.py
```

## Output Files

- `traffic_log.csv` - Raw request logs
- `features.csv` - Engineered features
- `*.pkl` - Trained models
- `blocked_ips.txt` - Blocked IPs

  ## integration of interactive captcha in the system to avoid large traffic
  <img width="518" height="473" alt="{9F3DD3BE-30AC-454C-85EC-60587EE3774B}" src="https://github.com/user-attachments/assets/0c583672-88d7-4bef-bc5d-364db11d9afa" />
  

