# Options Risk Check API

Small FastAPI backend for the mobile demo.

This API intentionally returns educational risk-review JSON. It does not execute trades and does not return buy/sell instructions.

## Run

```bash
pip install -r api/requirements.txt
uvicorn api.app:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints

- `GET /health`
- `POST /trade-check`

