import { useState } from 'react';
import { Icon, Button, Avatar } from '../components.jsx';
import { timeline, appointments, SEVERITY } from '../data.js';
import { unreadCount } from './More.jsx';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
};

/* ---------- Home ---------- */
export function Home({ go, user }) {
  const stats = [
    { icon: 'drop', bg: '#E3F1FB', fg: '#0E8A8A', label: 'Blood Group', value: user.blood, to: 'profile' },
    { icon: 'alert', bg: '#FDECEF', fg: '#E11D48', label: 'Allergies', value: user.allergies.length, to: 'profile' },
    { icon: 'pill', bg: '#E6F6F1', fg: '#0BB386', label: 'Medications', value: `${user.meds.length} Active`, to: 'meds' },
  ];
  return (
    <div className="pad16 home">
      <header className="hello">
        <div>
          <p>{greeting()}</p>
          <h1>{user.name}</h1>
        </div>
        <div className="hello-act">
          <button type="button" className="bell" onClick={() => go('notifications')} aria-label={`Notifications${unreadCount(user) ? `, ${unreadCount(user)} unread` : ''}`}>
            <Icon name="bell" size={22} color="#0F2342" sw={2} />
            {unreadCount(user) > 0 && <i />}
          </button>
          <button type="button" className="avatar-btn" onClick={() => go('settings')} aria-label="Open settings">
            <Avatar user={user} size={44} />
          </button>
        </div>
      </header>

      <div className="stats">
        {stats.map((s) => (
          <button type="button" key={s.label} className="stat" onClick={() => go(s.to, { replace: s.to === 'profile' })}>
            <span className="stat-ic" style={{ background: s.bg }}><Icon name={s.icon} size={18} color={s.fg} sw={2.2} /></span>
            <small>{s.label}</small>
            <b>{s.value}</b>
          </button>
        ))}
      </div>

      <section className="card tl">
        <div className="card-h">
          <h2 className="t16">Medical Timeline</h2>
          <button type="button" className="link sm" onClick={() => go('timeline', { replace: true })}>View All</button>
        </div>
        {timeline.map((t) => (
          <button type="button" key={t.title} className="tl-row" onClick={() => go(t.to)}>
            <span className="tile"><Icon name={t.icon} size={20} color="#0F2342" /></span>
            <span className="tl-txt"><b>{t.title}</b><small>{t.place} · {t.date}</small></span>
            <Icon name="chevron" size={18} color="#64748B" />
          </button>
        ))}
      </section>

      <h2 className="sec-h">Upcoming Appointments</h2>
      {appointments.map((a) => (
        <article key={a.title} className="appt">
          <div className="appt-top">
            <span className="tile dark"><Icon name="calendar" size={20} color="#fff" /></span>
            <div><b>{a.title}</b><small>{a.doctor}</small></div>
          </div>
          <div className="appt-bot">
            <span><Icon name="clock" size={17} color="#10B386" sw={2.2} />{a.time}</span>
            <span className="green">{a.place}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------- Profile ---------- */
export function Profile({ go, user, setUser, toast }) {
  const [d, setD] = useState(user);
  const [edit, setEdit] = useState({});
  const [newA, setNewA] = useState({ name: '', sev: 'Moderate' });
  const [newM, setNewM] = useState({ name: '', how: '' });
  const toggle = (k) => setEdit({ ...edit, [k]: !edit[k] });
  const dirty = JSON.stringify(d) !== JSON.stringify(user);

  const addAllergy = () => {
    if (!newA.name.trim()) return;
    setD({ ...d, allergies: [...d.allergies, { name: newA.name.trim(), sev: newA.sev }] });
    setNewA({ name: '', sev: 'Moderate' });
  };
  const addMed = () => {
    if (!newM.name.trim()) return;
    setD({ ...d, meds: [...d.meds, { name: newM.name.trim(), how: newM.how.trim() }] });
    setNewM({ name: '', how: '' });
  };
  const save = () => {
    setUser(d);
    setEdit({});
    if (dirty) go('profile-saved', { replace: true });
    else toast('No changes to save');
  };

  const EditBtn = ({ k, label }) => (
    <button type="button" className="icon-btn" onClick={() => toggle(k)} aria-label={edit[k] ? `Done editing ${label}` : `Edit ${label}`}>
      <Icon name={edit[k] ? 'check' : 'pen'} size={24} color="#0BB386" sw={2} />
    </button>
  );

  return (
    <div className="pad16 profile">
      <header className="p-head">
        <Avatar user={d} size={64} />
        <div>
          <h1>{d.name}</h1>
          <p><Icon name="profile" size={17} color="#10B386" sw={2.2} />{d.nid}</p>
        </div>
      </header>

      <section className="card">
        <div className="card-h"><h2 className="caps">Personal Info</h2><EditBtn k="info" label="personal info" /></div>
        {edit.info ? (
          <div className="grid3 editing">
            <label><small>DOB</small><input value={d.dob} onChange={(e) => setD({ ...d, dob: e.target.value })} /></label>
            <label><small>Gender</small>
              <select value={d.gender} onChange={(e) => setD({ ...d, gender: e.target.value })}>
                {['Female', 'Male', 'Other'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label><small>Blood Group</small>
              <select value={d.blood} onChange={(e) => setD({ ...d, blood: e.target.value })}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
          </div>
        ) : (
          <div className="grid3">
            <div><small>DOB</small><b>{d.dob}</b></div>
            <div><small>Gender</small><b>{d.gender}</b></div>
            <div><small>Blood Group</small><b>{d.blood}</b></div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-h"><h2 className="caps">Allergies</h2><EditBtn k="allergies" label="allergies" /></div>
        <div className="tags">
          {d.allergies.map((a, i) => {
            const c = SEVERITY[a.sev] || SEVERITY.Mild;
            return (
              <span key={a.name + i} className="tag" style={{ background: c.bg, color: c.fg }}>
                <b>{a.name}</b><small>{a.sev.toUpperCase()}</small>
                {edit.allergies && (
                  <button type="button" aria-label={`Remove ${a.name}`} onClick={() => setD({ ...d, allergies: d.allergies.filter((_, j) => j !== i) })}>
                    <Icon name="x" size={14} color={c.fg} sw={2.6} />
                  </button>
                )}
              </span>
            );
          })}
          {!d.allergies.length && <p className="muted">No allergies recorded</p>}
        </div>
        {edit.allergies && (
          <div className="add-row">
            <input placeholder="Add allergy" aria-label="Allergy name" value={newA.name} onChange={(e) => setNewA({ ...newA, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addAllergy()} />
            <select aria-label="Severity" value={newA.sev} onChange={(e) => setNewA({ ...newA, sev: e.target.value })}>
              {Object.keys(SEVERITY).map((s) => <option key={s}>{s}</option>)}
            </select>
            <button type="button" className="add-btn" onClick={addAllergy} aria-label="Add allergy"><Icon name="plus" size={18} color="#fff" sw={2.6} /></button>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-h"><h2 className="caps">Current Medications</h2><EditBtn k="meds" label="medications" /></div>
        <div className="meds">
          {d.meds.map((m, i) => (
            <div key={m.name + i} className="med">
              <Icon name="pill" size={22} color="#0BB386" sw={2.2} />
              <div><b>{m.name}</b><small>{m.how}</small></div>
              {edit.meds && (
                <button type="button" className="icon-btn" aria-label={`Remove ${m.name}`} onClick={() => setD({ ...d, meds: d.meds.filter((_, j) => j !== i) })}>
                  <Icon name="x" size={18} color="#E11D48" sw={2.4} />
                </button>
              )}
            </div>
          ))}
          {!d.meds.length && <p className="muted">No active medications</p>}
        </div>
        {edit.meds && (
          <div className="add-row col">
            <input placeholder="Medication and dose" aria-label="Medication name" value={newM.name} onChange={(e) => setNewM({ ...newM, name: e.target.value })} />
            <div className="add-row tight">
              <input placeholder="How often" aria-label="How often" value={newM.how} onChange={(e) => setNewM({ ...newM, how: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addMed()} />
              <button type="button" className="add-btn" onClick={addMed} aria-label="Add medication"><Icon name="plus" size={18} color="#fff" sw={2.6} /></button>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-h">
          <small className="caps-sm">Emergency Contact</small>
          <button type="button" className="link sm" onClick={() => go('emergency')}>Emergency Profile</button>
        </div>
        <p className="line"><b>{d.emergency.name}</b> <span className="muted">({d.emergency.rel})</span></p>
        <a className="green phone" href={`tel:${d.emergency.phone.replace(/\s/g, '')}`}>{d.emergency.phone}</a>
        <hr />
        <small className="caps-sm">Existing Conditions</small>
        {d.conditions.map((c) => (
          <p key={c.name} className="line"><b>{c.name}</b> <span className="muted">(Diagnosed {c.year})</span></p>
        ))}
      </section>

      <Button onClick={save} className="mb8">Save Changes</Button>
    </div>
  );
}

/* ---------- Settings ---------- */
function Row({ label, badge, badgeTone, onClick, children }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className="s-row" onClick={onClick}>
      <span className="s-label">{label}</span>
      {badge && <span className={'s-badge ' + (badgeTone || '')}>{badge}</span>}
      {children || <Icon name="chevron" size={20} color="#64748B" sw={2.2} />}
    </Tag>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={'switch' + (on ? ' on' : '')} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

export function Settings({ go, user, setUser, toast }) {
  const n = user.notif || { push: true, email: false, sms: true };
  const setN = (k, v) => {
    setUser({ ...user, notif: { ...n, [k]: v } });
    toast(`${{ push: 'Push notifications', email: 'Email notifications', sms: 'SMS alerts' }[k]} ${v ? 'on' : 'off'}`);
  };
  const soon = (what) => () => toast(`${what} is coming soon`);
  const back = () => (window.history.length > 1 ? window.history.back() : go('home', { replace: true }));

  return (
    <div className="pad16 settings">
      <header className="s-top">
        <button type="button" className="back-btn" onClick={back} aria-label="Back"><Icon name="back" size={20} color="#0F2342" sw={2.6} /></button>
        <div>
          <h1>Settings</h1>
          <p>Manage your preferences and security</p>
        </div>
      </header>

      <div className="s-profile">
        <Avatar user={user} size={48} />
        <div className="s-id">
          <b>{user.name}</b>
          <small>ID: {user.nid}</small>
        </div>
        <button type="button" className="s-edit" onClick={() => go('profile', { replace: true })}>Edit Profile</button>
      </div>

      <h2 className="s-sec">Account</h2>
      <div className="s-group">
        <Row label="Personal Information" onClick={() => go('profile', { replace: true })} />
        <Row label="Security & Authentication" badge="MFA Enabled" badgeTone="ok" onClick={soon('Security settings')} />
        <Row label="Connected Providers" badge="3 providers" onClick={soon('Connected providers')} />
      </div>

      <h2 className="s-sec">Privacy</h2>
      <div className="s-group">
        <Row label="Consent Preferences" onClick={() => go('requests')} />
        <Row label="Data Sharing Settings" onClick={() => go('sharing', { replace: true })} />
        <Row label="Download My Data" onClick={() => toast('Your data export is being prepared (demo)')} />
      </div>

      <h2 className="s-sec">Notifications</h2>
      <div className="s-group">
        <Row label="Push Notifications"><Toggle on={n.push} label="Push notifications" onChange={(v) => setN('push', v)} /></Row>
        <Row label="Email Notifications"><Toggle on={n.email} label="Email notifications" onChange={(v) => setN('email', v)} /></Row>
        <Row label="SMS Alerts"><Toggle on={n.sms} label="SMS alerts" onChange={(v) => setN('sms', v)} /></Row>
      </div>

      <h2 className="s-sec">Support</h2>
      <div className="s-group">
        <Row label="Help Center" onClick={soon('Help Center')} />
        <Row label="Contact Support" onClick={soon('Contact Support')} />
        <Row label="Terms of Service" onClick={soon('Terms of Service')} />
        <Row label="Privacy Policy" onClick={soon('Privacy Policy')} />
      </div>

      <h2 className="s-sec">App</h2>
      <div className="s-group">
        <Row label="Language" badge="English" onClick={soon('More languages')} />
        <Row label="App Version" badge="1.0.0" onClick={() => toast("You're on the latest version")} />
      </div>

      <button type="button" className="signout" onClick={() => { go('signin', { replace: true }); toast('Signed out'); }}>
        Sign Out
      </button>
    </div>
  );
}


/* ---------- Tab bar ---------- */
const PARENT = {
  settings: 'profile', emergency: 'profile', 'emergency-edit': 'profile',
  labs: 'records', meds: 'records', rx: 'records', consult: 'records',
  share1: 'sharing', share2: 'sharing', share3: 'sharing', share4: 'sharing', requests: 'sharing', history: 'sharing',
  notifications: 'home',
};

const TABS = [
  ['home', 'Home', 'home'],
  ['timeline', 'Timeline', 'timeline'],
  ['records', 'Records', 'folder'],
  ['sharing', 'Sharing', 'shield'],
  ['profile', 'Profile', 'profile'],
];

export function TabBar({ route, go }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(([r, label, ic]) => {
        const active = (PARENT[route] || route) === r;
        return (
        <button type="button" key={r} className={active ? 'on' : ''} aria-current={active ? 'page' : undefined}
          onClick={() => go(r, { replace: true })}>
          <Icon name={ic} size={26} sw={1.8} />
          <span>{label}</span>
        </button>
        );
      })}
    </nav>
  );
}
