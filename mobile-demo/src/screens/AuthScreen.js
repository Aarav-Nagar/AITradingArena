import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Field, PrimaryButton, SecondaryButton, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

const purposeOptions = ["Learning options", "Checking risk", "Journaling trades", "Paper trading", "Reviewing decisions"];
const tradeFocusOptions = ["Options", "Stocks", "Both", "Still learning"];
const experienceOptions = ["Beginner", "Some experience", "Active trader", "Advanced/research-focused"];
const accountSizes = ["1000", "5000", "10000", "25000", "50000"];
const riskOptions = ["0.5", "1", "2", "5"];
const riskStyles = ["Very conservative", "Balanced", "Aggressive learning"];
const struggleOptions = ["Entering too early", "Holding too long", "Taking profits too soon", "Oversizing", "FOMO", "Not journaling"];
const reminderOptions = ["Position size", "Risk/reward", "Volatility", "Trade plan", "Discipline", "Exit plan"];
const sectorOptions = [
  "Technology",
  "Healthcare",
  "Financials",
  "Energy",
  "Consumer discretionary",
  "Consumer staples",
  "Industrials",
  "Communication services",
  "Utilities",
  "Real estate",
  "Materials",
  "Broad market ETFs"
];
const capOptions = ["Mega cap", "Large cap", "Mid cap", "Small cap", "High-growth", "High-volatility", "Index ETFs", "Not sure yet"];
const eventOptions = ["Earnings", "Product launches", "FDA/healthcare catalysts", "Macro/news", "Sector rotation", "Unusual volume", "None yet"];

const steps = ["Account", "Purpose", "Risk", "Market", "Safety"];

export function AuthScreen({ onCreateAccount, onSignIn, loading, error }) {
  const [mode, setMode] = useState("home");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "Alex Trader",
    email: "alex@example.com",
    password: "demo123",
    purpose: ["Checking risk"],
    tradeFocus: ["Options"],
    experienceLevel: "Some experience",
    accountSize: "25000",
    riskBudgetPercent: "2",
    riskStyle: "Balanced",
    struggles: ["FOMO"],
    reminders: ["Position size"],
    sectors: ["Technology", "Broad market ETFs"],
    marketCaps: ["Mega cap", "Large cap"],
    events: ["Earnings"],
    safetyAccepted: false
  });

  const title = mode === "signup" ? "Set up your account" : mode === "signin" ? "Welcome back" : "Options Risk Check";
  const subtitle =
    mode === "home"
      ? "A calm green-and-white workspace for checking options risk before decisions."
      : mode === "signup"
        ? "A few quick questions help personalize risk budgets, reminders, and market focus."
        : "Sign in to continue your local demo journal.";

  function submitSignIn() {
    onSignIn(form);
  }

  function nextStep() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onCreateAccount(form);
    }
  }

  return (
    <ScrollView style={styles.authWrap} contentContainerStyle={styles.authContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Options Risk Check</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {mode === "home" ? (
        <>
          <Card style={styles.valueCard}>
            <Text style={sharedText.sectionTitle}>Before the trade, check the risk.</Text>
            <Text style={sharedText.bodyText}>
              Build a profile, review options risk, save checks, and learn from your decision history.
            </Text>
          </Card>
          <PrimaryButton label="Create Account" onPress={() => setMode("signup")} />
          <SecondaryButton label="Sign In" onPress={() => setMode("signin")} />
        </>
      ) : mode === "signin" ? (
        <Card>
          <Field label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} />
          <Field label="Password" value={form.password} onChangeText={(password) => setForm({ ...form, password })} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton label={loading ? "Signing In..." : "Sign In"} onPress={submitSignIn} disabled={loading} />
          <SecondaryButton label="Back" onPress={() => setMode("home")} />
        </Card>
      ) : (
        <Card>
          <StepHeader step={step} />
          {step === 0 ? <AccountStep form={form} setForm={setForm} /> : null}
          {step === 1 ? <PurposeStep form={form} setForm={setForm} /> : null}
          {step === 2 ? <RiskStep form={form} setForm={setForm} /> : null}
          {step === 3 ? <MarketStep form={form} setForm={setForm} /> : null}
          {step === 4 ? <SafetyStep form={form} setForm={setForm} /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            label={loading ? "Working..." : step === steps.length - 1 ? "Start App" : "Continue"}
            onPress={nextStep}
            disabled={loading || (step === 4 && !form.safetyAccepted)}
          />
          <SecondaryButton label={step === 0 ? "Back" : "Previous"} onPress={() => (step === 0 ? setMode("home") : setStep(step - 1))} />
        </Card>
      )}

      <Card style={styles.disclaimer}>
        <Text style={sharedText.mediumTitle}>Prototype account note</Text>
        <Text style={sharedText.bodyText}>
          Accounts and profile answers are stored locally for now. Later this can move to Clerk and a real database.
        </Text>
      </Card>
    </ScrollView>
  );
}

function StepHeader({ step }) {
  return (
    <View style={styles.stepHeader}>
      <Text style={styles.stepText}>{steps[step]}</Text>
      <Text style={styles.stepCount}>{step + 1} / {steps.length}</Text>
    </View>
  );
}

function AccountStep({ form, setForm }) {
  return (
    <>
      <Field label="Name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
      <Field label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} />
      <Field label="Password" value={form.password} onChangeText={(password) => setForm({ ...form, password })} />
    </>
  );
}

function PurposeStep({ form, setForm }) {
  return (
    <>
      <Text style={sharedText.sectionTitle}>What are you using this for?</Text>
      <MultiSelect options={purposeOptions} values={form.purpose} onChange={(purpose) => setForm({ ...form, purpose })} />
      <Text style={sharedText.sectionTitle}>What do you trade or study?</Text>
      <MultiSelect options={tradeFocusOptions} values={form.tradeFocus} onChange={(tradeFocus) => setForm({ ...form, tradeFocus })} />
      <Text style={sharedText.sectionTitle}>Experience level</Text>
      <SingleSelect options={experienceOptions} value={form.experienceLevel} onChange={(experienceLevel) => setForm({ ...form, experienceLevel })} />
    </>
  );
}

function RiskStep({ form, setForm }) {
  return (
    <>
      <Text style={sharedText.sectionTitle}>Demo account size</Text>
      <SingleSelect options={accountSizes.map((size) => `$${Number(size).toLocaleString()}`)} value={`$${Number(form.accountSize).toLocaleString()}`} onChange={(label) => setForm({ ...form, accountSize: label.replace(/[^0-9]/g, "") })} />
      <Text style={sharedText.sectionTitle}>Default max risk per trade</Text>
      <SingleSelect options={riskOptions.map((risk) => `${risk}%`)} value={`${form.riskBudgetPercent}%`} onChange={(label) => setForm({ ...form, riskBudgetPercent: label.replace("%", "") })} />
      <Text style={sharedText.sectionTitle}>How conservative should checks be?</Text>
      <SingleSelect options={riskStyles} value={form.riskStyle} onChange={(riskStyle) => setForm({ ...form, riskStyle })} />
      <Text style={sharedText.sectionTitle}>What do you struggle with?</Text>
      <MultiSelect options={struggleOptions} values={form.struggles} onChange={(struggles) => setForm({ ...form, struggles })} />
      <Text style={sharedText.sectionTitle}>What reminders help most?</Text>
      <MultiSelect options={reminderOptions} values={form.reminders} onChange={(reminders) => setForm({ ...form, reminders })} />
    </>
  );
}

function MarketStep({ form, setForm }) {
  return (
    <>
      <Text style={sharedText.sectionTitle}>Sector focus</Text>
      <MultiSelect options={sectorOptions} values={form.sectors} onChange={(sectors) => setForm({ ...form, sectors })} />
      <Text style={sharedText.sectionTitle}>Market-cap focus</Text>
      <MultiSelect options={capOptions} values={form.marketCaps} onChange={(marketCaps) => setForm({ ...form, marketCaps })} />
      <Text style={sharedText.sectionTitle}>Event focus</Text>
      <MultiSelect options={eventOptions} values={form.events} onChange={(events) => setForm({ ...form, events })} />
    </>
  );
}

function SafetyStep({ form, setForm }) {
  return (
    <>
      <Card style={styles.safetyCard}>
        <Text style={sharedText.mediumTitle}>Educational use only</Text>
        <Text style={sharedText.bodyText}>
          This app does not execute trades, connect brokerage accounts, or provide financial advice. It helps organize risk
          checks and journaling.
        </Text>
      </Card>
      <Pressable style={[styles.checkBoxRow, form.safetyAccepted && styles.checkBoxRowActive]} onPress={() => setForm({ ...form, safetyAccepted: !form.safetyAccepted })}>
        <View style={[styles.checkBox, form.safetyAccepted && styles.checkBoxActive]}>
          <Text style={styles.checkMark}>{form.safetyAccepted ? "OK" : ""}</Text>
        </View>
        <Text style={styles.checkBoxText}>I understand this is educational and not financial advice.</Text>
      </Pressable>
    </>
  );
}

function MultiSelect({ options, values, onChange }) {
  function toggle(option) {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option));
    } else {
      onChange([...values, option]);
    }
  }

  return (
    <View style={styles.optionGrid}>
      {options.map((option) => (
        <Pressable key={option} style={[styles.choice, values.includes(option) && styles.choiceActive]} onPress={() => toggle(option)}>
          <Text style={[styles.choiceText, values.includes(option) && styles.choiceTextActive]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SingleSelect({ options, value, onChange }) {
  return (
    <View style={styles.optionGrid}>
      {options.map((option) => (
        <Pressable key={option} style={[styles.choice, value === option && styles.choiceActive]} onPress={() => onChange(option)}>
          <Text style={[styles.choiceText, value === option && styles.choiceTextActive]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  authWrap: {
    flex: 1,
    paddingHorizontal: 18
  },
  authContent: {
    justifyContent: "center",
    minHeight: "100%",
    paddingVertical: 18
  },
  hero: {
    marginBottom: 18
  },
  brand: {
    color: palette.green,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10
  },
  title: {
    color: palette.dark,
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center"
  },
  subtitle: {
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8
  },
  valueCard: {
    backgroundColor: "#FBFFFC"
  },
  disclaimer: {
    marginTop: 12,
    backgroundColor: "#F6FFF8",
    borderColor: "#CFEFD8"
  },
  error: {
    color: palette.red,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  stepText: {
    color: palette.dark,
    fontSize: 18,
    fontWeight: "900"
  },
  stepCount: {
    color: palette.green,
    fontSize: 12,
    fontWeight: "900"
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14
  },
  choice: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#FFFFFF"
  },
  choiceActive: {
    backgroundColor: palette.greenSoft,
    borderColor: palette.green
  },
  choiceText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  choiceTextActive: {
    color: palette.green
  },
  safetyCard: {
    backgroundColor: "#F6FFF8",
    borderColor: "#CFEFD8"
  },
  checkBoxRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12
  },
  checkBoxRowActive: {
    borderColor: palette.green,
    backgroundColor: palette.greenSoft
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF"
  },
  checkBoxActive: {
    backgroundColor: palette.green,
    borderColor: palette.green
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900"
  },
  checkBoxText: {
    flex: 1,
    color: palette.dark,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17
  }
});

