from pydantic import BaseModel, Field


class TradeCheckRequest(BaseModel):
    ticker: str = Field(min_length=1, max_length=12)
    trade_type: str
    strike: float = Field(ge=0)
    expiration: str
    amount_at_risk: float = Field(gt=0)
    timeframe: str
    account_size: float = Field(gt=0)


class TradeCheckResponse(BaseModel):
    id: str
    ticker: str
    trade_type: str
    title: str
    subtitle: str
    badge: str
    setup_score: int
    risk_score: float
    agent_agreement: int
    methodology_label: str
    insight: str
    strike: float
    expiration: str
    amount_at_risk: float
    timeframe: str
    checks: list[list[str]]
    agents: list[list[object]]
    scenarios: list[list[str]]

