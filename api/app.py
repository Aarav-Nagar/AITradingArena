from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import TradeCheckRequest, TradeCheckResponse
from .scoring import score_trade_check

app = FastAPI(title="Options Risk Check API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8091", "http://localhost:8091", "http://localhost:8081", "http://127.0.0.1:8081"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/trade-check", response_model=TradeCheckResponse)
def trade_check(request: TradeCheckRequest) -> TradeCheckResponse:
    return score_trade_check(request)

