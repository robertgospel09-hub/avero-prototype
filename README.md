# Avero prototype

Clickable, mobile-first prototype of the Avero medical records app. Built with Vite + React.
All data is demo data and stays in the tester's browser.

## Flow

Splash → Onboarding → Create Account → Verify Phone (any 6 digits) → Verify Identity → Home
Sign In (any email + password) → Home
Tabs: Home, Timeline, Records*, Sharing, Profile (editable, saves locally)
Settings: tap the avatar on Home. Notifications: the bell on Home.
Sharing tab: Privacy & Access, the 4-step share flow with PIN, Access Requests, Access History.
Emergency Profile: from the Emergency Contact card on Profile.

\* Records landing is a stand-in until its design is ready.

Restart the demo: open `#/reset` at the end of the link, or use "Restart demo" on desktop.

## Run locally

```
npm install
npm run dev
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (skip `node_modules`).
2. On vercel.com: Add New > Project > import the repo.
3. Framework: Vite. Build: `npm run build`. Output: `dist`. Click Deploy.
4. Every push to GitHub redeploys automatically.

## Where things live

- `src/screens/Auth.jsx`: splash, onboarding, sign up, OTP, identity, sign in
- `src/screens/Main.jsx`: home, profile, tab bar, placeholder screens
- `src/data.js`: demo user, timeline and appointments
- `src/styles.css`: all styling and design tokens
