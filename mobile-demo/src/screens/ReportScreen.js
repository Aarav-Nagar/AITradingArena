import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Pill } from "../components/Pill";
import { RiskGauge, ScoreRing } from "../components/ScoreRing";
import { AiCard, Header, PrimaryButton, ScreenScroll, SecondaryButton, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function ReportScreen({ report, onSave, saved }) {
  if (!report) {
    return (
      <ScreenScroll>
        <Header kicker="2. REPORT" title="No report yet" subtitle="Run a check first to generate a trade report." />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <Header kicker="2. REPORT" title={report.title} subtitle={report.subtitle} right={<Pill label={report.badge} tone="good" />} />
      <View style={styles.methodology}>
        <Text style={styles.methodologyText}>{report.methodologyLabel || "Educational risk review"} - not financial advice</Text>
      </View>

      <Card>
        <View style={styles.reportGrid}>
          <ScoreRing score={report.setupScore} label="Setup Quality" />
          <View style={styles.checkList}>
            {report.checks.map(([label, tone]) => (
              <View style={styles.checkRow} key={label}>
                <Text style={[styles.checkMark, tone === "warn" && styles.warningText]}>{tone === "warn" ? "!" : "OK"}</Text>
                <Text style={styles.checkLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>

      <Card>
        <Text style={sharedText.cardLabel}>Risk Score</Text>
        <View style={styles.reportGrid}>
          <RiskGauge value={report.riskScore} />
          <View style={styles.flex}>
            <Text style={sharedText.mediumTitle}>Moderate Risk</Text>
            <Text style={sharedText.bodyText}>This estimate summarizes sizing, volatility, and setup quality. It does not predict profit or recommend action.</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.rowBetween}>
          <Text style={sharedText.sectionTitle}>Agent Agreement</Text>
          <Text style={styles.bigPercent}>{report.agentAgreement}%</Text>
        </View>
        {report.agents.map(([name, value, tone]) => (
          <BarRow key={name} name={name} value={value} color={tone === "risk" ? palette.red : palette.green} />
        ))}
      </Card>

      <AiCard text={report.insight} compact />

      <Card>
        <View style={styles.rowBetween}>
          <Text style={sharedText.sectionTitle}>What-if Scenarios</Text>
          <Text style={styles.linkText}>View All</Text>
        </View>
        <View style={styles.scenarioRow}>
          {report.scenarios.map(([name, pct, dollars, tone]) => (
            <View style={styles.scenario} key={name}>
              <Text style={sharedText.cardLabel}>{name}</Text>
              <Text style={[styles.scenarioPct, tone === "risk" && styles.riskText]}>{pct}</Text>
              <Text style={[styles.scenarioDollars, tone === "risk" && styles.riskText]}>{dollars}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.actionRow}>
        <SecondaryButton label={saved ? "Saved" : "Save to Journal"} onPress={onSave} />
        <PrimaryButton label="I Understand Risk" onPress={onSave} style={styles.actionGrow} />
      </View>
    </ScreenScroll>
  );
}

function BarRow({ name, value, color }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barName}>{name}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reportGrid: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center"
  },
  checkList: {
    flex: 1,
    gap: 11
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  checkMark: {
    color: palette.green,
    fontWeight: "900",
    width: 22
  },
  warningText: {
    color: palette.amber
  },
  checkLabel: {
    color: palette.dark,
    fontSize: 12,
    fontWeight: "800"
  },
  flex: {
    flex: 1
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  bigPercent: {
    color: palette.green,
    fontSize: 28,
    fontWeight: "900"
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 10
  },
  barName: {
    width: 98,
    color: palette.dark,
    fontSize: 12,
    fontWeight: "800"
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ECF0ED",
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: 999
  },
  barValue: {
    width: 34,
    color: palette.dark,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "right"
  },
  scenarioRow: {
    flexDirection: "row",
    gap: 10
  },
  scenario: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    padding: 10,
    backgroundColor: "#FCFDFC",
    alignItems: "center"
  },
  scenarioPct: {
    color: palette.green,
    fontWeight: "900",
    fontSize: 16
  },
  scenarioDollars: {
    color: palette.green,
    fontWeight: "800",
    fontSize: 12
  },
  riskText: {
    color: palette.red
  },
  linkText: {
    color: palette.green,
    fontWeight: "900",
    fontSize: 12
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  actionGrow: {
    flex: 1
  },
  methodology: {
    backgroundColor: "#FFFDF7",
    borderColor: "#FDE7B5",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  methodologyText: {
    color: "#92400E",
    fontSize: 11,
    fontWeight: "800"
  }
});
