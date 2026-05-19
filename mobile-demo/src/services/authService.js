import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "options-risk-check:users";
const SESSION_KEY = "options-risk-check:current-user";

export async function restoreSession() {
  const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
  return sessionJson ? JSON.parse(sessionJson) : null;
}

export async function createAccount(profile) {
  const { name, email, password } = profile;
  const cleanEmail = email.trim().toLowerCase();
  const users = await getUsers();
  if (users.some((user) => user.email === cleanEmail)) {
    throw new Error("An account with this email already exists.");
  }
  if (!name.trim() || !cleanEmail || password.length < 6) {
    throw new Error("Use a name, valid email, and password with at least 6 characters.");
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    accountSize: Number(profile.accountSize || 25000),
    riskBudgetPercent: Number(profile.riskBudgetPercent || 2),
    purpose: profile.purpose || [],
    tradeFocus: profile.tradeFocus || [],
    experienceLevel: profile.experienceLevel || "Still learning",
    riskStyle: profile.riskStyle || "Balanced",
    struggles: profile.struggles || [],
    reminders: profile.reminders || [],
    sectors: profile.sectors || [],
    marketCaps: profile.marketCaps || [],
    events: profile.events || [],
    safetyAccepted: Boolean(profile.safetyAccepted),
    createdAt: new Date().toISOString()
  };

  const nextUsers = [...users, { ...user, password }];
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function signIn({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const users = await getUsers();
  const record = users.find((user) => user.email === cleanEmail && user.password === password);
  if (!record) {
    throw new Error("Email or password did not match a demo account.");
  }
  const { password: _password, ...user } = record;
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function signOut() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function getUsers() {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}
