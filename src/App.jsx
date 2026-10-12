import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar } from './components.jsx';
import { Splash, Onboarding, SignUp, VerifyPhone, VerifyIdentity, SignIn } from './screens/Auth.jsx';
import { Home, Profile, Settings, TabBar } from './screens/Main.jsx';
import { Timeline, RecordsHub, Labs, Medications, Prescriptions, Consultation } from './screens/Records.jsx';
import { ShareStep1, ShareStep2, ShareStep3, ShareStep4, Pin, Shared, PrivacyAccess, Revoked, Requests, Approved, Declined, History } from './screens/Sharing.jsx';
import { Notifications, Emergency, EditEmergency, EmergencySaved, ProfileSaved, RxShared } from './screens/More.jsx';
import { defaultUser } from './data.js';

const KEY = 'avero-demo-v4';
const TAB_ROUTES = ['home', 'timeline', 'records', 'sharing', 'profile', 'settings', 'labs', 'meds', 'rx', 'consult',
  'share1', 'share2', 'share3', 'share4', 'requests', 'history', 'notifications', 'emergency', 'emergency-edit'];
const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'splash';

const loadUser = () => {
  try {
    const s = localStorage.getItem(KEY);
    return s ? { ...defaultUser, ...JSON.parse(s) } : defaultUser;
  } catch {
    return defaultUser;
  }
};

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [user, setUserState] = useState(loadUser);
  const [msg, setMsg] = useState(null);
  const timer = useRef();

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((to, { replace } = {}) => {
    if (replace) window.location.replace('#/' + to);
    else window.location.hash = '/' + to;
    setRoute(to);
  }, []);

  const setUser = useCallback((u) => {
    setUserState(u);
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* storage unavailable */ }
  }, []);

  const toast = useCallback((m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2200);
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setUserState(defaultUser);
    go('splash', { replace: true });
  }, [go]);

  useEffect(() => { if (route === 'reset') reset(); }, [route, reset]);

  const p = { go, user, setUser, toast };
  const screens = {
    splash: <Splash {...p} />,
    onboarding: <Onboarding {...p} />,
    signup: <SignUp {...p} />,
    verify: <VerifyPhone {...p} />,
    identity: <VerifyIdentity {...p} />,
    signin: <SignIn {...p} />,
    home: <Home {...p} />,
    profile: <Profile {...p} />,
    settings: <Settings {...p} />,
    timeline: <Timeline {...p} />,
    records: <RecordsHub {...p} />,
    labs: <Labs {...p} />,
    meds: <Medications {...p} />,
    rx: <Prescriptions {...p} />,
    consult: <Consultation {...p} />,
    sharing: <PrivacyAccess {...p} />,
    share1: <ShareStep1 {...p} />,
    share2: <ShareStep2 {...p} />,
    share3: <ShareStep3 {...p} />,
    share4: <ShareStep4 {...p} />,
    pin: <Pin {...p} />,
    shared: <Shared {...p} />,
    revoked: <Revoked {...p} />,
    requests: <Requests {...p} />,
    approved: <Approved {...p} />,
    declined: <Declined {...p} />,
    history: <History {...p} />,
    notifications: <Notifications {...p} />,
    emergency: <Emergency {...p} />,
    'emergency-edit': <EditEmergency {...p} />,
    'emergency-saved': <EmergencySaved {...p} />,
    'profile-saved': <ProfileSaved {...p} />,
    'rx-shared': <RxShared {...p} />,
  };
  const current = screens[route] ? route : 'splash';
  const isTab = TAB_ROUTES.includes(current);

  return (
    <div className="stage">
      <div className={'device' + (current === 'splash' ? ' is-splash' : '')}>
        <StatusBar />
        <main className="screen" key={current}>{screens[current]}</main>
        {isTab && <TabBar route={current} go={go} />}
        <div className="homebar" aria-hidden="true" />
        {msg && <div className="toast" role="status">{msg}</div>}
      </div>
      <aside className="side">
        <p className="side-k">Avero prototype</p>
        <p>Tap through it like a real app. All data is demo data and stays in this browser.</p>
        <button type="button" className="side-btn" onClick={reset}>Restart demo</button>
      </aside>
    </div>
  );
}
