import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Pill } from "../components/Pill";
import { Header, PrimaryButton, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function ProfileScreen({ user, onSignOut }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AT";

  return (
    <ScreenScroll>
      <Header kicker="7. PROFILE" title="Profile" subtitle="Manage your account and settings." />
      <Card style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={sharedText.mediumTitle}>{user?.name || "Alex Trader"}</Text>
          <Text style={sharedText.bodyText}>{user?.email || "alex@example.com"}</Text>
        </View>
        <Pill label="Demo Plan" tone="good" />
      </Card>
      <SettingsGroup title="Account" rows={[["Account Size", "$25,000"], ["Risk Budget", "5% ($1,250)"], ["Default Timeframe", "1-2 Weeks"]]} />
      <SettingsGroup title="Preferences" rows={[["Default Risk per Trade", "1.5%"], ["Notifications", "On"]]} />
      <SettingsGroup title="Legal & Privacy" rows={[["Disclaimer", "Educational only"], ["Privacy Policy", "View"], ["Data Settings", "Manage"]]} />
      <Card style={styles.takeaway}>
        <Text style={sharedText.mediumTitle}>Options Risk Check v1.0</Text>
        <Text style={sharedText.bodyText}>This is educational research software, not financial advice.</Text>
      </Card>
      <PrimaryButton label="Sign Out" onPress={onSignOut} style={styles.signOut} />
    </ScreenScroll>
  );
}

function SettingsGroup({ title, rows }) {
  return (
    <Card>
      <Text style={sharedText.sectionTitle}>{title}</Text>
      {rows.map(([label, value]) => (
        <View style={styles.settingsRow} key={label}>
          <Text style={sharedText.bodyText}>{label}</Text>
          <View style={styles.row}>
            <Text style={styles.settingsValue}>{value}</Text>
            <Text style={styles.chevron}>&gt;</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F2FAF3"
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DDF4E4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BCEAC9"
  },
  avatarText: {
    color: palette.green,
    fontWeight: "900",
    fontSize: 16
  },
  flex: {
    flex: 1
  },
  settingsRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  settingsValue: {
    color: palette.dark,
    fontSize: 12,
    fontWeight: "900"
  },
  chevron: {
    color: palette.muted,
    fontSize: 18
  },
  takeaway: {
    backgroundColor: "#FBFFFC"
  },
  signOut: {
    backgroundColor: palette.red,
    marginBottom: 12
  }
});
