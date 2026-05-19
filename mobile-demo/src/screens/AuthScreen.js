import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Field, PrimaryButton, SecondaryButton, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function AuthScreen({ onCreateAccount, onSignIn, loading, error }) {
  const [mode, setMode] = useState("home");
  const [form, setForm] = useState({
    name: "Alex Trader",
    email: "alex@example.com",
    password: "demo123"
  });

  const title = mode === "signup" ? "Create your account" : mode === "signin" ? "Welcome back" : "Options Risk Check";
  const subtitle =
    mode === "home"
      ? "A calm place to review risky options ideas before they become real decisions."
      : "Your demo account saves journal entries, growth stats, and risk checks on this device.";

  function submit() {
    if (mode === "signup") {
      onCreateAccount(form);
    } else if (mode === "signin") {
      onSignIn(form);
    }
  }

  return (
    <View style={styles.authWrap}>
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
              Review position size, technical context, agent agreement, and what-if scenarios. Then save the check to your
              journal and learn from the outcome.
            </Text>
          </Card>
          <PrimaryButton label="Create Account" onPress={() => setMode("signup")} />
          <SecondaryButton label="Sign In" onPress={() => setMode("signin")} />
        </>
      ) : (
        <Card>
          {mode === "signup" ? (
            <Field label="Name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
          ) : null}
          <Field label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} />
          <Field label="Password" value={form.password} onChangeText={(password) => setForm({ ...form, password })} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton label={loading ? "Working..." : mode === "signup" ? "Create Account" : "Sign In"} onPress={submit} disabled={loading} />
          <SecondaryButton label="Back" onPress={() => setMode("home")} />
        </Card>
      )}

      <Card style={styles.disclaimer}>
        <Text style={sharedText.mediumTitle}>Demo account note</Text>
        <Text style={sharedText.bodyText}>
          Accounts are stored locally on this device for the prototype. This is not production authentication yet.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  authWrap: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center"
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
    backgroundColor: "#FFFDF7",
    borderColor: "#FDE7B5"
  },
  error: {
    color: palette.red,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10
  }
});

