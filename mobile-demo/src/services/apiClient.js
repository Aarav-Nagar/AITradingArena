import { baseReport, mockGrowthStats } from "../data/mockData";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function generateTradeCheck(draft) {
  try {
    const response = await fetch(`${API_BASE_URL}/trade-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: draft.ticker,
        trade_type: draft.tradeType,
        strike: Number(draft.strike || 0),
        expiration: draft.expiration,
        amount_at_risk: Number(draft.amountAtRisk || 0),
        timeframe: draft.timeframe,
        account_size: Number(draft.accountSize || 0)
      })
    });
    if (response.ok) {
      const data = await response.json();
      return normalizeBackendReport(data, draft);
    }
  } catch (err) {
    // Local demo fallback: keep the app usable when FastAPI is not running.
  }

  return generateMockTradeCheck(draft);
}

async function generateMockTradeCheck(draft) {
  await delay(350);

  const amount = Number(draft.amountAtRisk || 0);
  if (!draft.ticker || amount <= 0) {
    throw new Error("Missing ticker or risk amount.");
  }

  const riskPercent = (amount / Number(draft.accountSize || 1)) * 100;
  const riskPenalty = riskPercent > 2 ? Math.min(12, Math.round((riskPercent - 2) * 4)) : 0;
  const setupScore = Math.max(50, baseReport.setupScore - riskPenalty);
  const riskScore = Math.min(8.5, Number((3.2 + riskPercent / 2).toFixed(1)));

  return {
    id: `check-${Date.now()}`,
    ...baseReport,
    title: `${draft.ticker.toUpperCase()} ${draft.tradeType}`,
    subtitle: `$${draft.strike} Strike - ${draft.expiration} - ${draft.timeframe}`,
    ticker: draft.ticker.toUpperCase(),
    tradeType: draft.tradeType,
    strike: draft.strike,
    expiration: draft.expiration,
    amountAtRisk: amount,
    timeframe: draft.timeframe,
    setupScore,
    riskScore,
    agentAgreement: Math.max(55, baseReport.agentAgreement - Math.round(riskPenalty * 1.5)),
    methodologyLabel: "Educational demo score",
    insight:
      riskPercent > 2
        ? "This check shows elevated sizing risk relative to the demo account. The setup may still be worth studying, but the risk budget should be reviewed before any real decision."
        : "This check has constructive technical context, but it is not a forecast. Treat the score as a structured risk review, not a trade instruction."
  };
}

function normalizeBackendReport(data, draft) {
  return {
    id: data.id || `check-${Date.now()}`,
    ...baseReport,
    title: data.title || `${draft.ticker.toUpperCase()} ${draft.tradeType}`,
    subtitle: data.subtitle || `$${draft.strike} Strike - ${draft.expiration} - ${draft.timeframe}`,
    ticker: data.ticker || draft.ticker.toUpperCase(),
    tradeType: data.trade_type || draft.tradeType,
    strike: String(data.strike || draft.strike),
    expiration: data.expiration || draft.expiration,
    amountAtRisk: data.amount_at_risk || Number(draft.amountAtRisk || 0),
    timeframe: data.timeframe || draft.timeframe,
    badge: data.badge || baseReport.badge,
    setupScore: data.setup_score ?? baseReport.setupScore,
    riskScore: data.risk_score ?? baseReport.riskScore,
    agentAgreement: data.agent_agreement ?? baseReport.agentAgreement,
    checks: data.checks || baseReport.checks,
    agents: data.agents || baseReport.agents,
    scenarios: data.scenarios || baseReport.scenarios,
    methodologyLabel: data.methodology_label || "Backend educational score",
    insight: data.insight || baseReport.insight
  };
}

export async function saveJournalEntry(report) {
  await delay(150);
  return {
    id: `journal-${Date.now()}`,
    ticker: report.ticker,
    title: `${report.ticker} ${report.tradeType.replace(" Option", "")}`,
    meta: `$${report.strike} - ${report.expiration}`,
    status: "Open Check",
    entry: "Today",
    exit: "Open",
    pl: "$0",
    pct: "0.0%",
    tags: ["Planned", report.setupScore >= 70 ? "Confident" : "Watchlist"],
    note: "Saved from risk check. Outcome not entered yet."
  };
}

export function summarizeGrowth(entries) {
  const completed = entries.filter((entry) => entry.pl.startsWith("+") || entry.pl.startsWith("-"));
  if (completed.length === 0) {
    return mockGrowthStats;
  }

  const values = completed.map((entry) => Number(entry.pl.replace(/[^0-9.-]/g, "")));
  const wins = values.filter((value) => value > 0);
  const losses = values.filter((value) => value < 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const avgWin = wins.length ? wins.reduce((sum, value) => sum + value, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((sum, value) => sum + value, 0) / losses.length : 0;
  const profitFactor =
    losses.length && avgLoss !== 0
      ? Math.abs(wins.reduce((sum, value) => sum + value, 0) / losses.reduce((sum, value) => sum + value, 0))
      : wins.length
        ? 2.0
        : 1.0;

  return {
    value: `$${(25000 + total).toLocaleString()}`,
    return: `${total >= 0 ? "+" : ""}${((total / 25000) * 100).toFixed(1)}%`,
    winRate: `${Math.round((wins.length / completed.length) * 100)}%`,
    avgWin: `${avgWin >= 0 ? "+" : "-"}$${Math.abs(Math.round(avgWin))}`,
    avgLoss: `${avgLoss >= 0 ? "+" : "-"}$${Math.abs(Math.round(avgLoss))}`,
    profitFactor: profitFactor.toFixed(2),
    maxDrawdown: mockGrowthStats.maxDrawdown,
    disciplineScore: Math.min(94, 70 + entries.filter((entry) => entry.tags.includes("Patient")).length * 3),
    curve: mockGrowthStats.curve.map((point, index) => point + (total / 400) * (index / mockGrowthStats.curve.length))
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
