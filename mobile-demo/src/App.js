import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppShell } from "./components/AppShell";
import { Card } from "./components/Card";
import { PrimaryButton, sharedText } from "./components/Shared";
import { arena, lessons, starterJournal, tradeDraft } from "./data/mockData";
import { ArenaScreen } from "./screens/ArenaScreen";
import { CheckScreen } from "./screens/CheckScreen";
import { GrowthScreen } from "./screens/GrowthScreen";
import { JournalScreen } from "./screens/JournalScreen";
import { LearnScreen } from "./screens/LearnScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { generateTradeCheck, saveJournalEntry, summarizeGrowth } from "./services/apiClient";
import { palette } from "./theme/theme";

const JOURNAL_STORAGE_KEY = "options-risk-check:journal";
const ONBOARDING_STORAGE_KEY = "options-risk-check:onboarding-seen";

export default function App() {
  const [activeTab, setActiveTab] = useState("Check");
  const [draft, setDraft] = useState(tradeDraft);
  const [currentReport, setCurrentReport] = useState(null);
  const [journalEntries, setJournalEntries] = useState(starterJournal);
  const [savedReportIds, setSavedReportIds] = useState([]);
  const [savedNotice, setSavedNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const growthStats = useMemo(() => summarizeGrowth(journalEntries), [journalEntries]);
  const reportSaved = currentReport ? savedReportIds.includes(currentReport.id) : false;

  useEffect(() => {
    let mounted = true;
    async function restoreState() {
      try {
        const [journalJson, onboardingSeen] = await Promise.all([
          AsyncStorage.getItem(JOURNAL_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
        ]);
        if (!mounted) {
          return;
        }
        if (journalJson) {
          setJournalEntries(JSON.parse(journalJson));
        }
        setShowOnboarding(onboardingSeen !== "true");
      } catch (err) {
        setShowOnboarding(true);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }
    restoreState();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journalEntries));
    }
  }, [journalEntries, ready]);

  async function handleTradeCheck() {
    setLoading(true);
    setError("");
    setSavedNotice("");
    try {
      const nextReport = await generateTradeCheck(draft);
      setCurrentReport(nextReport);
      setActiveTab("Report");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReport() {
    if (!currentReport) {
      return;
    }
    if (savedReportIds.includes(currentReport.id)) {
      setSavedNotice("Already saved to Journal");
      setActiveTab("Journal");
      return;
    }
    const entry = await saveJournalEntry(currentReport);
    setJournalEntries((entries) => [entry, ...entries]);
    setSavedReportIds((ids) => [...ids, currentReport.id]);
    setSavedNotice("Saved to Journal");
    setActiveTab("Journal");
  }

  async function dismissOnboarding() {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setShowOnboarding(false);
  }

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab} disabledTabs={currentReport ? [] : ["Report"]}>
      {showOnboarding ? <OnboardingNotice onDismiss={dismissOnboarding} /> : null}
      {activeTab === "Check" && (
        <CheckScreen draft={draft} setDraft={setDraft} onCheck={handleTradeCheck} loading={loading} error={error} />
      )}
      {activeTab === "Report" && <ReportScreen report={currentReport} onSave={handleSaveReport} saved={reportSaved} />}
      {activeTab === "Journal" && (
        <JournalScreen entries={journalEntries} savedNotice={savedNotice} onNewCheck={() => setActiveTab("Check")} />
      )}
      {activeTab === "Growth" && <GrowthScreen stats={growthStats} />}
      {activeTab === "Arena" && <ArenaScreen arena={arena} />}
      {activeTab === "Learn" && <LearnScreen lessons={lessons} />}
      {activeTab === "Profile" && <ProfileScreen />}
    </AppShell>
  );
}

function OnboardingNotice({ onDismiss }) {
  return (
    <View style={styles.onboardingOverlay}>
      <Card style={styles.onboardingCard}>
        <Text style={sharedText.sectionTitle}>Educational risk checks only</Text>
        <Text style={sharedText.bodyText}>
          This demo helps structure options risk, journal decisions, and study agent experiments. It does not execute trades,
          give financial advice, or tell you what to buy or sell.
        </Text>
        <PrimaryButton label="I Understand" onPress={onDismiss} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingOverlay: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 74,
    backgroundColor: "rgba(247,249,247,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  onboardingCard: {
    borderColor: "#BCEAC9",
    backgroundColor: "#FBFFFC"
  }
});
