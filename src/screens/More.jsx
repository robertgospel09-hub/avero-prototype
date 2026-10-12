import { useState } from 'react';
import { Icon, Button, BackHeader, Result } from '../components.jsx';
import { notifications, BLOOD_NAME, SEVERITY } from '../data.js';

const TONE = { g: '#E6F6F1', n: '#EEF2F6', r: '#FDECEF' };
const INK = { g: '#0B8A63', n: '#0F2342', r: '#E11D48' };

export const unreadCount = (user) => notifications.filter((n) => !n.read && !(user.readNotifs || []).includes(n.id)).length;

/* ---------- Notifications ---------- */
export function Notifications({ go, user, setUser, toast }) {
  const read = user.readNotifs || [];
  const open = (n) => {
    if (!read.includes(n.id)) setUser({ ...user, readNotifs: [...read, n.id] });
    if (n.to) go(n.to);
    else toast(`${n.title} details are coming soon`);
  };
  const sections = ['Today', 'Yesterday', 'Earlier'];
  return (
    <div className="pad16 sub">
      <BackHeader title="Notifications" sub="Stay updated on your healthcare journey" go={go} fallback="home" />
      {sections.map((s) => (
        <section key={s}>
          <h2 className="s-sec lg">{s}</h2>
          <div className="list mt0">
            {notifications.filter((n) => n.sec === s).map((n) => {
              const unread = !n.read && !read.includes(n.id);
              return (
                <button key={n.id} type="button" className={'card notif' + (unread ? ' unread' : '')} onClick={() => open(n)}>
                  <span className="log-ic" style={{ background: TONE[n.tone] }}><Icon name={n.icon} size={22} color={INK[n.tone]} sw={2.2} /></span>
                  <span className="nt-txt">
                    <b>{n.title}</b>
                    <span>{n.text}</span>
                    <small>{n.when}</small>
                  </span>
                  {unread && <i className="dot" aria-label="Unread" />}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- Emergency profile ---------- */
const bloodLabel = (b) => (b === 'O-' ? 'Universal Donor (O Negative)' : b === 'AB+' ? 'Universal Recipient (AB Positive)' : BLOOD_NAME[b] || b);
const freq = (m) => (m.sched ? m.sched.split(',')[0] : m.how);

export function Emergency({ go, user }) {
  const e = user.emergency;
  return (
    <div className="pad16 sub">
      <BackHeader title="Emergency Profile" sub="Critical information for first responders" go={go} fallback="profile" />
      <div className="alert-red mt20"><Icon name="alertc" size={24} color="#E11D48" sw={2.2} /><b>This information can be accessed even when your phone is locked in emergencies.</b></div>

      <article className="card em-blood">
        <span className="bg-badge">{user.blood}</span>
        <div><small className="caps-md">Blood Group</small><b>{bloodLabel(user.blood)}</b></div>
      </article>

      <article className="card">
        <small className="caps-md">Allergies</small>
        <div className="tags mt14">
          {user.allergies.map((a) => {
            const c = SEVERITY[a.sev] || SEVERITY.Mild;
            return <span key={a.name} className="tag em" style={{ background: c.bg, color: c.fg }}>{a.name} ({a.sev})</span>;
          })}
          {!user.allergies.length && <p className="muted">No known allergies</p>}
        </div>
      </article>

      <article className="card">
        <small className="caps-md">Current Medications</small>
        <ul className="em-meds">
          {user.meds.map((m) => (
            <li key={m.name}><Icon name="pill" size={22} color="#0BB386" sw={2.2} /><b>{m.name}</b><span>· {freq(m)}</span></li>
          ))}
        </ul>
      </article>

      <article className="card">
        <small className="caps-md">Major Conditions</small>
        <ul className="em-cond">{user.conditions.map((c) => <li key={c.name}>· {c.name}</li>)}</ul>
      </article>

      <article className="card em-contact">
        <div>
          <small className="caps-md">Emergency Contact</small>
          <p className="line mt14"><b>{e.name}</b> <span className="muted">({e.rel})</span></p>
          <span className="green phone">{e.phone}</span>
        </div>
        <a className="call" href={`tel:${e.phone.replace(/\s/g, '')}`} aria-label={`Call ${e.name}`}><Icon name="phone" size={22} color="#0B8A63" sw={2.2} /></a>
      </article>

      <button type="button" className="btn navy mt20" onClick={() => go('emergency-edit')}>Edit Emergency Profile</button>
    </div>
  );
}

export function EditEmergency({ go, user, setUser }) {
  const [d, setD] = useState({
    blood: user.blood, allergies: user.allergies, meds: user.meds, conditions: user.conditions, emergency: user.emergency,
  });
  const [adding, setAdding] = useState(null);
  const [nA, setNA] = useState({ name: '', sev: 'Moderate' });
  const [nM, setNM] = useState({ name: '', how: '' });
  const [nC, setNC] = useState('');
  const setE = (k) => (ev) => setD({ ...d, emergency: { ...d.emergency, [k]: ev.target.value } });

  const addAllergy = () => {
    if (!nA.name.trim()) return;
    setD({ ...d, allergies: [...d.allergies, { name: nA.name.trim(), sev: nA.sev }] });
    setNA({ name: '', sev: 'Moderate' }); setAdding(null);
  };
  const addMed = () => {
    if (!nM.name.trim()) return;
    const how = nM.how.trim() || 'As directed';
    setD({ ...d, meds: [...d.meds, { name: nM.name.trim(), how: how.toLowerCase(), sched: how, by: 'Added by you' }] });
    setNM({ name: '', how: '' }); setAdding(null);
  };
  const addCond = () => {
    if (!nC.trim()) return;
    setD({ ...d, conditions: [...d.conditions, { name: nC.trim(), year: new Date().getFullYear() }] });
    setNC(''); setAdding(null);
  };
  const save = () => {
    setUser({ ...user, ...d });
    go('emergency-saved', { replace: true });
  };

  const AddLink = ({ k, label }) => (
    <button type="button" className="add-link" onClick={() => setAdding(adding === k ? null : k)}>
      <Icon name={adding === k ? 'x' : 'plus'} size={18} color="#0BB386" sw={2.6} />{adding === k ? 'Cancel' : label}
    </button>
  );

  return (
    <div className="pad16 sub">
      <BackHeader title="Edit Emergency Profile" sub="Update critical responder information" go={go} fallback="emergency" />

      <article className="card mt20">
        <small className="caps-md">Blood Group</small>
        <label className="select-box mt14">
          <span className="bg-badge sm">{d.blood}</span>
          <span className="sb-txt">{BLOOD_NAME[d.blood]}</span>
          <Icon name="chevDown" size={20} color="#64748B" sw={2.2} />
          <select value={d.blood} onChange={(e) => setD({ ...d, blood: e.target.value })} aria-label="Blood group">
            {Object.entries(BLOOD_NAME).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </article>

      <article className="card">
        <div className="card-h"><small className="caps-md">Allergies</small><AddLink k="a" label="Add Allergy" /></div>
        <div className="tags mt14">
          {d.allergies.map((a, i) => {
            const c = SEVERITY[a.sev] || SEVERITY.Mild;
            return (
              <span key={a.name + i} className="tag em edit" style={{ background: c.bg, color: c.fg, borderColor: c.fg }}>
                {a.name} ({a.sev})
                <button type="button" aria-label={`Remove ${a.name}`} onClick={() => setD({ ...d, allergies: d.allergies.filter((_, j) => j !== i) })}>
                  <Icon name="xcircle" size={18} color={c.fg} sw={2.2} />
                </button>
              </span>
            );
          })}
        </div>
        {adding === 'a' && (
          <div className="add-row">
            <input placeholder="Allergy" aria-label="Allergy name" value={nA.name} onChange={(e) => setNA({ ...nA, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addAllergy()} autoFocus />
            <select aria-label="Severity" value={nA.sev} onChange={(e) => setNA({ ...nA, sev: e.target.value })}>
              {Object.keys(SEVERITY).map((s) => <option key={s}>{s}</option>)}
            </select>
            <button type="button" className="add-btn" onClick={addAllergy} aria-label="Add allergy"><Icon name="plus" size={18} color="#fff" sw={2.6} /></button>
          </div>
        )}
      </article>

      <article className="card">
        <div className="card-h"><small className="caps-md">Current Medications</small><AddLink k="m" label="Add Medication" /></div>
        <div className="rows">
          {d.meds.map((m, i) => (
            <div key={m.name + i} className="erow">
              <Icon name="pill" size={22} color="#0BB386" sw={2.2} />
              <span>{m.name} - {freq(m)}</span>
              <button type="button" aria-label={`Remove ${m.name}`} onClick={() => setD({ ...d, meds: d.meds.filter((_, j) => j !== i) })}><Icon name="trash" size={20} color="#64748B" sw={2} /></button>
            </div>
          ))}
        </div>
        {adding === 'm' && (
          <div className="add-row">
            <input placeholder="Medication and dose" aria-label="Medication" value={nM.name} onChange={(e) => setNM({ ...nM, name: e.target.value })} autoFocus />
            <input placeholder="How often" aria-label="How often" value={nM.how} onChange={(e) => setNM({ ...nM, how: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addMed()} />
            <button type="button" className="add-btn" onClick={addMed} aria-label="Add medication"><Icon name="plus" size={18} color="#fff" sw={2.6} /></button>
          </div>
        )}
      </article>

      <article className="card">
        <div className="card-h"><small className="caps-md">Major Conditions</small><AddLink k="c" label="Add Condition" /></div>
        <div className="rows">
          {d.conditions.map((c, i) => (
            <div key={c.name + i} className="erow">
              <span>{c.name}</span>
              <button type="button" aria-label={`Remove ${c.name}`} onClick={() => setD({ ...d, conditions: d.conditions.filter((_, j) => j !== i) })}><Icon name="trash" size={20} color="#64748B" sw={2} /></button>
            </div>
          ))}
        </div>
        {adding === 'c' && (
          <div className="add-row">
            <input placeholder="Condition" aria-label="Condition" value={nC} onChange={(e) => setNC(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCond()} autoFocus />
            <button type="button" className="add-btn" onClick={addCond} aria-label="Add condition"><Icon name="plus" size={18} color="#fff" sw={2.6} /></button>
          </div>
        )}
      </article>

      <article className="card">
        <small className="caps-md">Emergency Contact</small>
        <div className="fields sm">
          <label className="field"><span className="caps-md">Contact Name</span><span className="input"><Icon name="user" size={20} color="#64748B" /><input value={d.emergency.name} onChange={setE('name')} /></span></label>
          <label className="field"><span className="caps-md">Relationship</span><span className="input"><Icon name="heart" size={20} color="#64748B" /><input value={d.emergency.rel} onChange={setE('rel')} /></span></label>
          <label className="field"><span className="caps-md">Phone Number</span><span className="input"><Icon name="phone" size={20} color="#64748B" /><input type="tel" value={d.emergency.phone} onChange={setE('phone')} /></span></label>
        </div>
      </article>

      <Button className="mt20" onClick={save}>Save Changes</Button>
    </div>
  );
}

/* ---------- Result screens ---------- */
export function EmergencySaved({ go }) {
  return (
    <Result
      art={<span className="art ring"><span><Icon name="check" size={36} color="#10B386" sw={2.4} /></span></span>}
      title="Emergency Profile Updated"
      text="Your emergency profile has been updated successfully and is accessible to first responders."
      cta="Back to Emergency Profile" onCta={() => go('emergency', { replace: true })}>
      <div className="alert-red"><Icon name="alertc" size={24} color="#E11D48" sw={2.2} /><b>Critical details remain accessible even from a locked device.</b></div>
    </Result>
  );
}

export function ProfileSaved({ go }) {
  return (
    <Result
      art={<span className="art solid"><Icon name="check" size={34} color="#fff" sw={2.6} /></span>}
      title="Profile Updated Successfully"
      text="Your health profile changes have been saved securely."
      cta="Back to Home" onCta={() => go('home', { replace: true })} />
  );
}

export function RxShared({ go }) {
  return (
    <Result
      art={<span className="art soft"><Icon name="shield" size={40} color="#0B8A63" sw={2} /></span>}
      title="Prescription Shared Successfully"
      text="Your prescription for Metformin 500mg has been securely shared with HealthPlus Pharmacy."
      cta="Back to Prescriptions" onCta={() => go('rx', { replace: true })} />
  );
}
