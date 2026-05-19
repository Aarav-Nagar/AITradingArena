import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Metric } from "../components/Metric";
import { AiCard, ErrorCard, Field, Header, money, PrimaryButton, ScreenScroll, SelectLike, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

const tradeTypes = ["Call Option (Long)", "Put Option (Long)", "Stock Position (Long)", "Watchlist Only"];
const timeframes = ["Intraday", "1-3 Days", "1-2 Weeks", "1 Month+"];

export function CheckScreen({ draft, setDraft, onCheck, loading, error }) {
  const riskPercent = ((Number(draft.amountAtRisk || 0) / Number(draft.accountSize || 1)) * 100).toFixed(1);

  return (
    <ScreenScroll>
      <Header
        kicker="1. CHECK"
        title={`Good morning, ${draft.user}`}
        subtitle="Let's make smarter trade decisions."
        right={<Text style={styles.bell}>!</Text>}
      />

      <Card style={styles.snapshot}>
        <View style={styles.rowBetween}>
          <Text style={sharedText.cardLabel}>Account Snapshot</Text>
          <View style={styles.glowDot}>
            <Text style={styles.glowText}>OK</Text>
          </View>
        </View>
        <View style={styles.twoCols}>
          <Metric label="Account Size" value={money(draft.accountSize)} />
          <Metric label="Risk Budget" value={`${money(draft.riskBudget)} (5%)`} />
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(Number(riskPercent) * 24, 100)}%` }]} />
        </View>
        <Text style={sharedText.microcopy}>{riskPercent}% of account planned for this check</Text>
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>What trade are you checking?</Text>
        <Field label="Ticker" value={draft.ticker} onChangeText={(ticker) => setDraft({ ...draft, ticker })} suffix="." />
        <SelectLike
          label="Trade Type"
          value={draft.tradeType}
          options={tradeTypes}
          onSelect={(tradeType) => setDraft({ ...draft, tradeType })}
        />
        <View style={styles.inputRow}>
          <Field label="Strike Price" value={draft.strike} onChangeText={(strike) => setDraft({ ...draft, strike })} />
          <Field label="Expiration" value={draft.expiration} onChangeText={(expiration) => setDraft({ ...draft, expiration })} suffix="cal" />
        </View>
        <Field
          label="Amount at Risk"
          value={`$${draft.amountAtRisk}`}
          onChangeText={(amount) => setDraft({ ...draft, amountAtRisk: amount.replace(/[^0-9]/g, "") })}
          suffix={`${riskPercent}%`}
        />
        <SelectLike
          label="Timeframe"
          value={draft.timeframe}
          options={timeframes}
          onSelect={(timeframe) => setDraft({ ...draft, timeframe })}
        />
        <PrimaryButton label={loading ? "Checking..." : "Check This Trade"} onPress={onCheck} disabled={loading} />
      </Card>

      {error ? <ErrorCard message="Could not generate this check. Try again." /> : null}
      <AiCard text="I'll analyze this trade across setup quality, volatility, position sizing, and agent agreement." />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  snapshot: {
    backgroundColor: "#FEFFFE"
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  twoCols: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12
  },
  progressTrack: {
    height: 9,
    backgroundColor: "#EEF2EF",
    borderRadius: 999,
    marginTop: 14,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: palette.green,
    borderRadius: 999
  },
  glowDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  glowText: {
    color: palette.green,
    fontWeight: "900",
    fontSize: 10
  },
  inputRow: {
    flexDirection: "row",
    gap: 12
  },
  bell: {
    color: palette.dark,
    fontSize: 20,
    fontWeight: "900"
  }
});
