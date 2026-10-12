import { useEffect, useRef, useState } from 'react';
import { Icon, Button, BackHeader, Result } from '../components.jsx';
import { shareCategories, providers, accessHistory } from '../data.js';

/* Hand-off between a screen and the result screen it opens. */
export const flash = {};

export const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtDT = (d) => `${fmtDate(d)}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
const initials = (name) => name.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const inDays = (n) => new Date(Date.now() + n * 864e5);
const TONE = { g: '#E6F6F1', n: '#EEF2F6', r: '#FDECEF' };
const INK = { g: '#0B8A63', n: '#0F2342', r: '#E11D48' };

/* ---------- Share flow draft (kept between the four steps) ---------- */
const FRESH = { records: ['consult'], recipient: 'SA', manual: '', days: 30, range: 'All Time' };
const draft = { ...FRESH };
export const resetDraft = () => Object.assign(draft, FRESH, { records: [...FRESH.records] });
const recipient = () => (draft.manual
  ? { id: 'AV', name: draft.manual, place: 'Avero member' }
  : providers.find((p) => p.id === draft.recipient) || providers[0]);
const chosen = () => shareCategories.filter((c) => draft.records.includes(c.id));

function Steps({ n, label }) {
  return (
    <>
      <p className="step-l">Step {n} of 4 — {label}</p>
      <div className="progress steps"><i style={{ width: `${n * 25}%` }} /></div>
    </>
  );
}

/* Step 1: what to share */
const RANGES = ['All Time', 'Last 12 Months', 'Last 6 Months', 'Last 30 Days'];

export function ShareStep1({ go }) {
  const [sel, setSel] = useState(draft.records);
  const [range, setRange] = useState(draft.range);
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const next = () => { draft.records = sel; draft.range = range; go('share2'); };
  return (
    <div className="pad16 sub">
      <BackHeader title="Share Records" go={go} fallback="sharing" />
      <Steps n={1} label="Select Records" />
      <h2 className="lbl">What do you want to share?</h2>
      <div className="note ok"><Icon name="shield" size={22} color="#0B8A63" />Allergies &amp; Conditions (always shared for safety)</div>
      <div className="list tight">
        {shareCategories.map((c) => {
          const on = sel.includes(c.id);
          return (
            <button key={c.id} type="button" role="checkbox" aria-checked={on} className={'pick' + (on ? ' on' : '')} onClick={() => toggle(c.id)}>
              <span className="pick-txt"><b>{c.label}</b><small>{c.count} records</small></span>
              <span className="cbox">{on && <Icon name="check" size={14} color="#fff" sw={3} />}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="range" onClick={() => setRange(RANGES[(RANGES.indexOf(range) + 1) % RANGES.length])}>
        <Icon name="calendar" size={22} color="#0F2342" />
        <b>Select Date Range</b>
        <span>{range}</span>
      </button>
      <Button className="mt20" disabled={!sel.length} onClick={next}>Continue</Button>
    </div>
  );
}

/* Step 2: who to share with */
export function ShareStep2({ go, toast }) {
  const [q, setQ] = useState('');
  const [pick, setPick] = useState(draft.manual ? null : draft.recipient);
  const [manual, setManual] = useState(draft.manual);
  const [err, setErr] = useState('');
  const term = q.trim().toLowerCase();
  const list = providers.filter((p) => !term || `${p.name} ${p.place} ${p.id}`.toLowerCase().includes(term));

  const next = () => {
    if (manual.trim()) {
      if (!/^AVR-\d{4}-[A-Z]{3}$/i.test(manual.trim())) { setErr('Avero IDs look like AVR-8291-NGA'); return; }
      draft.manual = manual.trim().toUpperCase();
      draft.recipient = null;
    } else if (pick) {
      draft.recipient = pick;
      draft.manual = '';
    } else {
      toast('Choose who to share with');
      return;
    }
    go('share3');
  };

  return (
    <div className="pad16 sub">
      <BackHeader title="Share Records" go={go} fallback="sharing" />
      <Steps n={2} label="Select Recipient" />
      <h2 className="lbl">Search Recipient</h2>
      <label className="search">
        <Icon name="search" size={22} color="#64748B" sw={2.2} />
        <input type="search" placeholder="Search by name, hospital, or Avero ID" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search recipient" />
      </label>
      <h2 className="lbl">Recent Providers</h2>
      <div className="list tight" role="radiogroup" aria-label="Recent providers">
        {list.map((p) => {
          const on = pick === p.id;
          return (
            <button key={p.id} type="button" role="radio" aria-checked={on} className={'pick prov' + (on ? ' on' : '')}
              onClick={() => { setPick(p.id); setManual(''); setErr(''); }}>
              <span className={'ini' + (on ? ' on' : '')}>{p.id}</span>
              <span className="pick-txt"><b>{p.name}</b><small>{p.place}</small></span>
              <span className={'radio' + (on ? ' on' : '')} />
            </button>
          );
        })}
        {!list.length && <p className="empty sm">No providers match. Try their Avero ID below.</p>}
      </div>
      <h2 className="lbl">Or enter Avero ID manually</h2>
      <span className={'input' + (err ? ' err' : '')}>
        <input placeholder="e.g. AVR-8291-NGA" value={manual} aria-label="Avero ID"
          onChange={(e) => { setManual(e.target.value); if (e.target.value) setPick(null); setErr(''); }} />
      </span>
      {err && <p className="field-err mt6">{err}</p>}
      <Button className="mt20" onClick={next}>Continue</Button>
    </div>
  );
}

/* Step 3: review and duration */
export function ShareStep3({ go }) {
  const r = recipient();
  const [days, setDays] = useState(draft.days);
  const [custom, setCustom] = useState(![7, 14, 30, 90].includes(draft.days));
  return (
    <div className="pad16 sub">
      <BackHeader title="Share Records" go={go} fallback="sharing" />
      <Steps n={3} label="Review & Set Duration" />
      <article className="card mt20">
        <small className="caps-md">Sharing Summary</small>
        <small className="k mt14">Recipient</small>
        <b className="v">{r.name}</b>
        <small className="rx-sub">{r.place}</small>
        <hr />
        <small className="k">Selected Records</small>
        <ul className="checks">
          {chosen().map((c) => <li key={c.id}><Icon name="check" size={14} color="#10B386" sw={3} />{c.label} ({c.count})</li>)}
        </ul>
        <hr />
        <div className="kv"><span><Icon name="calendar" size={20} color="#0F2342" />Date Range</span><b>{draft.range}</b></div>
      </article>
      <h2 className="lbl">Set Access Duration</h2>
      <div className="dchips">
        {[7, 14, 30, 90].map((d) => (
          <button key={d} type="button" className={'dchip' + (!custom && days === d ? ' on' : '')} onClick={() => { setCustom(false); setDays(d); }}>{d} Days</button>
        ))}
        <button type="button" className={'dchip' + (custom ? ' on' : '')} onClick={() => setCustom(true)}>Custom</button>
      </div>
      {custom && (
        <label className="custom-days">
          <span>Number of days</span>
          <input type="number" min="1" max="365" inputMode="numeric" value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} />
        </label>
      )}
      <div className="note info"><Icon name="info" size={20} color="#64748B" /><p>The recipient will only be able to view the selected records during this period. You can revoke access at any time.</p></div>
      <Button className="mt20" onClick={() => { draft.days = days; go('share4'); }}>Continue</Button>
    </div>
  );
}

/* Step 4: confirm */
export function ShareStep4({ go }) {
  const r = recipient();
  return (
    <div className="pad16 sub">
      <BackHeader title="Share Records" go={go} fallback="sharing" />
      <Steps n={4} label="Confirm & Share" />
      <article className="card mt20">
        <small className="caps-md">Confirmation Summary</small>
        <div className="who"><span className="ini on lg">{r.id}</span><div><b>{r.name}</b><small>{r.place}</small></div></div>
        <hr />
        <small className="k">Records Being Shared</small>
        <b className="v">{chosen().map((c) => `${c.label} (${c.count} records)`).join(', ')}</b>
        <hr />
        <small className="k">Access Duration</small>
        <b className="v">{draft.days} Days (Expires {fmtDate(inDays(draft.days))})</b>
        <hr />
        <div className="kv"><small className="k">Date Range</small><b>{draft.range}</b></div>
      </article>
      <div className="note ok big"><Icon name="shield" size={24} color="#0B8A63" /><p>Your records will be shared securely using end-to-end encryption. The recipient will be notified when access is granted.</p></div>
      <button type="button" className="card confirm-id" onClick={() => go('pin')}>
        <b>Confirm Identity</b>
        <span className="ci-row"><span className="fp"><Icon name="fingerprint" size={24} color="#0B8A63" /></span>Enter your PIN or use biometrics to confirm</span>
      </button>
      <Button className="mt20" onClick={() => go('pin')}>Share Records</Button>
    </div>
  );
}

/* PIN */
export function Pin({ go, user, setUser }) {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(false);
  const refs = useRef([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const setAt = (i, raw) => {
    const d = raw.replace(/\D/g, '');
    const n = [...code];
    if (d.length > 1) {
      d.slice(0, 4 - i).split('').forEach((c, j) => { n[i + j] = c; });
      setCode(n);
      refs.current[Math.min(i + d.length, 3)]?.focus();
      return;
    }
    n[i] = d;
    setCode(n);
    if (d && i < 3) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      const n = [...code]; n[i - 1] = ''; setCode(n); refs.current[i - 1]?.focus();
    }
  };

  const finish = () => {
    setLoading(true);
    setTimeout(() => {
      const r = recipient();
      const a = user.access;
      const grant = {
        id: r.id, name: r.name, place: r.place,
        scope: chosen().map((c) => c.short).join(' + '),
        granted: fmtDate(new Date()), expires: fmtDate(inDays(draft.days)),
      };
      setUser({
        ...user,
        access: {
          ...a,
          active: [grant, ...a.active.filter((g) => g.name !== r.name)],
          previous: a.previous.filter((g) => g.name !== r.name),
          log: [{ icon: 'share', tone: 'n', title: `You shared records with ${r.name}`, sub: `Outgoing share · ${fmtDT(new Date())}` }, ...(a.log || [])],
        },
      });
      flash.shared = r;
      go('shared', { replace: true });
    }, 900);
  };
  const biometrics = () => { setBio(true); setTimeout(finish, 1100); };

  return (
    <div className="pad16 sub pin">
      <BackHeader title="Confirm Identity" go={go} fallback="share4" />
      <h1 className="h1 mt36">Enter your PIN</h1>
      <p className="sub">Enter your 4-digit PIN to authorize sharing your medical records securely.</p>
      <div className="otp pin-boxes" role="group" aria-label="4-digit PIN">
        {code.map((c, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} className={c ? 'filled' : ''} value={c} type="password"
            inputMode="numeric" placeholder="•" aria-label={`PIN digit ${i + 1}`}
            onChange={(e) => setAt(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onFocus={(e) => e.target.select()} />
        ))}
      </div>
      <p className="hint">Demo: any 4 digits</p>
      <button type="button" className="bio" onClick={biometrics} disabled={bio}>
        <Icon name="fingerprint" size={24} color="#0B8A63" />{bio ? 'Scanning…' : 'Use Biometrics Instead'}
      </button>
      <div className="pin-foot">
        <Button disabled={!code.every(Boolean)} loading={loading && !bio} onClick={finish}>Confirm &amp; Share</Button>
        <p className="tiny">Your records will be shared securely via end-to-end encryption.</p>
      </div>
    </div>
  );
}

export function Shared({ go }) {
  const r = flash.shared || recipient();
  return (
    <Result
      art={<span className="art soft"><Icon name="shield" size={40} color="#0B8A63" sw={2} /></span>}
      title="Records Shared Successfully"
      text={`${r.name} at ${r.place} now has access to your selected records.`}
      cta="Back to Sharing" onCta={() => go('sharing', { replace: true })} />
  );
}

/* ---------- Privacy & Access (Sharing tab) ---------- */
export function PrivacyAccess({ go, user, setUser }) {
  const [tab, setTab] = useState('active');
  const a = user.access;
  const n = a.active.length;

  const revoke = (g) => {
    setUser({
      ...user,
      access: {
        ...a,
        active: a.active.filter((x) => x.name !== g.name),
        previous: [{ ...g, ended: `Revoked ${fmtDate(new Date())}` }, ...a.previous],
        log: [{ icon: 'xcircle', tone: 'r', title: `You revoked ${g.name}'s access`, sub: `Revocation complete · ${fmtDT(new Date())}` }, ...(a.log || [])],
      },
    });
    flash.revoked = g;
    go('revoked');
  };

  const list = tab === 'active' ? a.active : a.previous;
  return (
    <div className="pad16 sub">
      <BackHeader title="Privacy & Access" sub="Manage healthcare provider permissions" go={go} fallback="home" />
      <div className="note ok outline mt20">
        <Icon name="shieldOnly" size={24} color="#0B8A63" sw={2.2} />
        <p>{n === 0 ? 'No providers currently have access to your records.' : `${n} provider${n === 1 ? ' currently has' : 's currently have'} access to your records.`}</p>
      </div>
      <div className="filter-row" role="tablist" aria-label="Access list">
        <button type="button" role="tab" aria-selected={tab === 'active'} className={'fchip navy big' + (tab === 'active' ? ' on' : '')} onClick={() => setTab('active')}>Active Access ({n})</button>
        <button type="button" role="tab" aria-selected={tab === 'previous'} className={'fchip navy big' + (tab === 'previous' ? ' on' : '')} onClick={() => setTab('previous')}>Previous Access</button>
      </div>
      <div className="list">
        {list.map((g) => (
          <article key={g.name} className="card acc">
            <div className="who">
              <span className="who-ic"><Icon name="user" size={22} color="#0F2342" /></span>
              <div><b>{g.name}</b><small>{g.place}</small></div>
            </div>
            <hr />
            <dl className="acc-dl">
              <dt>Scope:</dt><dd><b>{g.scope}</b></dd>
              <dt>Granted:</dt><dd>{g.granted}</dd>
              {g.ended ? <><dt>Ended:</dt><dd>{g.ended.replace('Revoked ', '')}</dd></> : <><dt>Expires:</dt><dd>{g.expires}</dd></>}
            </dl>
            <hr />
            {tab === 'active'
              ? <button type="button" className="revoke" onClick={() => revoke(g)}>Revoke Access</button>
              : <span className="ended">{g.ended}</span>}
          </article>
        ))}
        {!list.length && <p className="empty">{tab === 'active' ? 'Nobody has access right now.' : 'No previous access yet.'}</p>}
      </div>
      <Button className="mt20" onClick={() => { resetDraft(); go('share1'); }}>Share Records</Button>
      <div className="quick">
        <button type="button" onClick={() => go('requests')}>
          Access Requests{a.requests.length > 0 && <span className="count">{a.requests.length}</span>}
          <Icon name="chevron" size={18} color="#64748B" sw={2.2} />
        </button>
        <button type="button" onClick={() => go('history')}>
          Access History<Icon name="chevron" size={18} color="#64748B" sw={2.2} />
        </button>
      </div>
    </div>
  );
}

export function Revoked({ go }) {
  const g = flash.revoked || { name: 'The provider' };
  return (
    <Result
      art={<span className="art revoked"><span className="ar-in"><Icon name="shieldOnly" size={40} color="#E11D48" sw={2.2} /><span className="ar-badge"><Icon name="x" size={11} color="#fff" sw={3.4} /></span></span></span>}
      title="Access Revoked"
      text={`${g.name}'s permission to view your records has been successfully removed. They can no longer view your laboratory, medication, or medical timelines.`}
      cta="Back to Privacy & Access" onCta={() => go('sharing', { replace: true })}
      foot="Permissions updated instantly across all systems" />
  );
}

/* ---------- Access requests ---------- */
const scopeText = (scope) => scope.map((s, i) => (
  <span key={s}>{i > 0 && (i === scope.length - 1 ? ' and ' : ', ')}<b>{s}</b></span>
));

export function Requests({ go, user, setUser }) {
  const a = user.access;
  const act = (req, ok) => {
    const now = new Date();
    let { active } = a;
    let log = a.log || [];
    if (ok) {
      active = [{ id: initials(req.name), name: req.name, place: req.place, scope: req.scope.join(' + '), granted: fmtDate(now), expires: fmtDate(inDays(req.days)) },
        ...active.filter((g) => g.name !== req.name)];
      log = [{ icon: 'key', tone: 'g', title: `${req.name} was granted access`, sub: `Access granted · ${fmtDT(now)}` }, ...log];
    } else {
      log = [{ icon: 'xcircle', tone: 'r', title: `You declined ${req.short}'s request`, sub: `Request declined · ${fmtDT(now)}` }, ...log];
    }
    setUser({
      ...user,
      access: {
        ...a, active, log,
        requests: a.requests.filter((x) => x.id !== req.id),
        prevRequests: [{ name: req.name, place: req.place, status: ok ? 'Approved' : 'Declined', when: fmtDate(now) }, ...a.prevRequests],
      },
    });
    flash.req = req;
    go(ok ? 'approved' : 'declined');
  };

  return (
    <div className="pad16 sub">
      <BackHeader title="Access Requests" go={go} fallback="sharing" />
      <div className="list mt28">
        {a.requests.map((r) => (
          <article key={r.id} className={'card req' + (r.isNew ? ' new' : '')}>
            <div className="req-h">
              <span className={'req-ic' + (r.isNew ? ' new' : '')}><Icon name={r.isNew ? 'userCheck' : 'user'} size={20} color={r.isNew ? '#0B8A63' : '#0F2342'} sw={2.2} /></span>
              <b>{r.short}</b>
              <small>{r.when}</small>
            </div>
            <p className="req-txt">{r.short} from {r.place} requests access to {r.scope[0] === 'All Records' ? '' : 'your '}{scopeText(r.scope)}.</p>
            <div className="reason"><small>Reason:</small><p>{r.reason}</p></div>
            <p className="dur">Duration: <b>{r.days} days</b></p>
            <div className="req-act">
              <button type="button" className="decline" onClick={() => act(r, false)}>Decline</button>
              <button type="button" className="approve" onClick={() => act(r, true)}>Approve</button>
            </div>
          </article>
        ))}
        {!a.requests.length && <p className="empty">No pending requests. You're all caught up.</p>}
      </div>
      <h2 className="sec-h">Previous Requests</h2>
      <div className="list mt0">
        {a.prevRequests.map((p, i) => (
          <div key={p.name + i} className="card prev-req">
            <span><b>{p.name}</b><small>{p.place} · {p.when}</small></span>
            <span className="pill" style={p.status === 'Approved' ? { background: '#E8F7F2', color: '#0B8A63' } : { background: '#FDECEF', color: '#E11D48' }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Approved({ go }) {
  const r = flash.req || { short: 'Dr. Emeka', place: 'University Teaching Hospital', scope: ['Laboratory Results', 'Medication History'], days: 30 };
  const what = r.scope.length > 1 ? `${r.scope.slice(0, -1).join(', ')} and ${r.scope.at(-1)}` : r.scope[0];
  return (
    <Result
      art={<span className="art soft xl"><Icon name="check" size={52} color="#10B386" sw={2.6} /></span>}
      title="Access Approved"
      text={`${r.short} and ${r.place} now have secure access to your ${what}.`}
      cta="Back to Requests" ctaClass="solid-green" onCta={() => go('requests', { replace: true })}>
      <div className="res-card">
        <span className="rc-ic" style={{ background: '#E6F6F1' }}><Icon name="shieldOnly" size={20} color="#0B8A63" sw={2.2} /></span>
        <div><small>Access Period</small><b>Active for the next {r.days} days</b></div>
      </div>
    </Result>
  );
}

export function Declined({ go }) {
  const r = flash.req || { short: 'Dr. Funke', scope: ['All Records'] };
  const what = r.scope[0] === 'All Records' ? 'Medical Records' : r.scope.join(' and ');
  return (
    <Result
      art={<span className="art soft xl red"><Icon name="x" size={52} color="#EF4444" sw={2.6} /></span>}
      title="Request Declined"
      text={`${r.short}'s request to access your ${what} has been declined. No information was shared.`}
      cta="Back to Requests" onCta={() => go('requests', { replace: true })}>
      <div className="res-card">
        <span className="rc-ic" style={{ background: '#FDE2E2' }}><Icon name="lock" size={20} color="#EF4444" sw={2.2} /></span>
        <div><small>Data Safe</small><b>Your privacy remains protected</b></div>
      </div>
    </Result>
  );
}

/* ---------- Access history ---------- */
export function History({ go, user }) {
  const [f, setF] = useState('This Month');
  const list = [...(user.access.log || []), ...accessHistory[f]];
  return (
    <div className="pad16 sub">
      <BackHeader title="Access History" sub="Audit log of your medical records" go={go} fallback="sharing" />
      <div className="filter-row mt20" role="tablist" aria-label="Time range">
        {Object.keys(accessHistory).map((x) => (
          <button key={x} type="button" role="tab" aria-selected={f === x} className={'fchip navy big' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
        ))}
      </div>
      <div className="list">
        {list.map((e, i) => (
          <div key={e.title + i} className="card log">
            <span className="log-ic" style={{ background: TONE[e.tone] }}><Icon name={e.icon} size={20} color={e.tone === 'g' ? '#10B386' : INK[e.tone]} sw={2.2} /></span>
            <div><b>{e.title}</b><small>{e.sub}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}
