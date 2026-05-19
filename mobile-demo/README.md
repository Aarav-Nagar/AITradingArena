# Options Risk Check Mobile Demo

Clickable Expo React Native prototype for the Options Risk Check app.

This version is still a local demo, but it is structured like a real app. The screens use mock-backed service functions today, so the FastAPI backend can be connected screen by screen later.

## Run

```bash
npm install
npm run web
```

Open the Expo web URL in a browser. The app renders inside a phone-sized frame so the layout can be reviewed from a laptop.

To use the local API-backed trade check:

```bash
cd ..
pip install -r api/requirements.txt
uvicorn api.app:app --host 127.0.0.1 --port 8000
```

## Screens

- Check
- Report
- Journal
- Growth
- Arena
- Learn
- Profile

## Current behavior

- First open starts at an account home page instead of the trading workflow.
- Users can create a local demo account, sign in, persist a session, and sign out from Profile.
- Demo accounts are stored locally on the device/browser for prototype review.
- Check form values are editable.
- Check This Trade generates a report from the current form state.
- Trade checks call the local FastAPI endpoint when it is running and fall back to demo scoring when it is offline.
- Save to Journal adds the current report to the journal for this session.
- Journal entries persist locally across refreshes.
- Growth reads from journal entries and falls back to sample metrics when needed.
- Arena shows the options-agent replay as an educational experiment.
- The first-run disclaimer frames the app as educational risk review only.

## Structure

```text
src/
  App.js
  components/
  data/
  screens/
  services/
  theme/
```

## Notes

- No backend is required for this prototype.
- No trade execution is included.
- Language is framed as educational risk/context, not financial advice.
