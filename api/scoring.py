from __future__ import annotations

from datetime import datetime, timezone

from .models import TradeCheckRequest, TradeCheckResponse


def score_trade_check(request: TradeCheckRequest) -> TradeCheckResponse:
    ticker = request.ticker.upper().strip()
    risk_percent = request.amount_at_risk / request.account_size * 100
    option_risk = 1.0 if "Option" in request.trade_type else 0.4
    timeframe_adjustment = {
        "Intraday": 0.9,
        "1-3 Days": 0.7,
        "1-2 Weeks": 0.45,
        "1 Month+": 0.35,
    }.get(request.timeframe, 0.55)

    risk_score = min(9.2, round(2.4 + risk_percent * 0.75 + option_risk + timeframe_adjustment, 1))
    setup_score = max(48, min(84, round(76 - max(0, risk_percent - 1.5) * 5 - timeframe_adjustment * 3)))
    agent_agreement = max(52, min(88, round(setup_score + 8 - risk_score * 2.2)))

    if risk_percent > 3:
        badge = "High Risk"
        insight = (
            "The planned risk is large relative to the demo account. This review suggests reducing size or waiting for a "
            "cleaner setup before making any real-world decision."
        )
    elif setup_score >= 70 and risk_score <= 5.5:
        badge = "Constructive Setup"
        insight = (
            "The check has constructive technical context and controlled sizing. Treat this as a structured risk review, "
            "not a directional prediction."
        )
    else:
        badge = "Needs Review"
        insight = (
            "The setup has mixed evidence. The app would flag this for more review rather than treating it as a high-quality setup."
        )

    return TradeCheckResponse(
        id=f"api-{int(datetime.now(timezone.utc).timestamp())}",
        ticker=ticker,
        trade_type=request.trade_type,
        title=f"{ticker} {request.trade_type}",
        subtitle=f"${request.strike:g} Strike - {request.expiration} - {request.timeframe}",
        badge=badge,
        setup_score=setup_score,
        risk_score=risk_score,
        agent_agreement=agent_agreement,
        methodology_label="Backend educational score",
        insight=insight,
        strike=request.strike,
        expiration=request.expiration,
        amount_at_risk=request.amount_at_risk,
        timeframe=request.timeframe,
        checks=[
            ["Trend Context", "good" if setup_score >= 65 else "warn"],
            ["Volatility Context", "good" if risk_score <= 6 else "warn"],
            ["Sizing Discipline", "good" if risk_percent <= 2 else "warn"],
            ["Risk Review", "warn" if risk_percent > 2 else "good"],
        ],
        agents=[
            ["Risk-Managed", min(92, agent_agreement + 10), "good"],
            ["Neutral", agent_agreement, "good"],
            ["Aggressive", max(45, agent_agreement - 18), "risk"],
        ],
        scenarios=[
            ["Bear Case", "-50%", f"-${request.amount_at_risk * 0.5:.0f}", "risk"],
            ["Base Case", "+15%", f"+${request.amount_at_risk * 0.15:.0f}", "good"],
            ["Bull Case", "+75%", f"+${request.amount_at_risk * 0.75:.0f}", "good"],
        ],
    )

