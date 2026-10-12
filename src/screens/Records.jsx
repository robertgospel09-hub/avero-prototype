import { useState } from 'react';
import { Icon, Button, BackHeader, Pill } from '../components.jsx';
import { events, labs, pendingLabs, pastMeds, prescriptions, consultation, STATUS } from '../data.js';

const tone = (s) => STATUS[s] || STATUS.Completed;

/* ---------- Timeline ---------- */
const FILTERS = ['All', 'Consultations', 'Labs', 'Medications', 'Imaging'];

export function Timeline({ go, toast }) {
  const [q, setQ] = useState('');
  const [f, setF] = useState('All');
  const term = q.trim().toLowerCase();
  const list = events.filter((e) =>
    (f === 'All' || e.type === f) &&
    (!term || [e.title, e.place, e.doctor, e.type].join(' ').toLowerCase().includes(term)));

  return (
    <div className="pad16 timeline">
      <label className="search">
        <Icon name="search" size={22} color="#64748B" sw={2.2} />
        <input type="search" placeholder="Search medical timeline..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search medical timeline" />
      </label>
      <div className="filter-row" role="tablist" aria-label="Filter timeline">
        {FILTERS.map((x) => (
          <button key={x} type="button" role="tab" aria-selected={f === x} className={'fchip' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
        ))}
      </div>

      <ol className="rail">
        {list.map((e) => (
          <li key={e.title + e.date}>
            <span className="rail-dot"><Icon name={e.icon} size={18} color="#0F2342" sw={2.2} /></span>
            <button type="button" className="ev" onClick={() => (e.to ? go(e.to) : toast(`${e.title} report is coming soon`))}>
              <span className="ev-top"><b>{e.title}</b><small>{e.date}</small></span>
              <span className="ev-place">{e.place}</span>
              {e.doctor && <span className="ev-doc">{e.doctor}</span>}
              {e.pill && <Pill label={e.pill} tone={tone(e.pill)} />}
            </button>
          </li>
        ))}
      </ol>
      {!list.length && <p className="empty">No records match “{q || f}”.</p>}
    </div>
  );
}

/* ---------- Records hub (stand-in until the Records design arrives) ---------- */
export function RecordsHub({ go, user }) {
  const items = [
    { to: 'labs', icon: 'test', label: 'Laboratory Results', meta: `${labs.length} results · ${pendingLabs.length} pending` },
    { to: 'meds', icon: 'pill', label: 'Medications', meta: `${user.meds.length} active` },
    { to: 'rx', icon: 'bottle', label: 'Prescriptions', meta: '1 active' },
    { to: 'consult', icon: 'steth', label: 'Consultations', meta: 'Latest: Aug 5, 2026' },
  ];
  return (
    <div className="pad16 sub">
      <header className="bh"><h1>Records</h1></header>
      <div className="list">
        {items.map((it) => (
          <button key={it.to} type="button" className="lcard" onClick={() => go(it.to)}>
            <span className="tile lg"><Icon name={it.icon} size={22} color="#0F2342" /></span>
            <span className="lc-txt"><b>{it.label}</b><small>{it.meta}</small></span>
            <Icon name="chevron" size={20} color="#64748B" sw={2.2} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Laboratory results ---------- */
export function Labs({ go, toast }) {
  const [f, setF] = useState('All');
  const list = f === 'Pending' ? pendingLabs : f === 'Recent' ? labs.filter((l) => l.recent) : labs;
  return (
    <div className="pad16 sub">
      <BackHeader title="Laboratory Results" go={go} fallback="records" />
      <div className="filter-row" role="tablist" aria-label="Filter results">
        {['All', 'Recent', 'Pending'].map((x) => (
          <button key={x} type="button" role="tab" aria-selected={f === x} className={'fchip navy' + (f === x ? ' on' : '')} onClick={() => setF(x)}>{x}</button>
        ))}
      </div>
      <div className="list">
        {list.map((l) => (
          <button key={l.name} type="button" className="lcard" onClick={() => toast(`Full ${l.name} report is coming soon`)}>
            <span className="tile lg"><Icon name="test" size={22} color="#0F2342" /></span>
            <span className="lc-txt">
              <b>{l.name}</b>
              <small>{l.place} · {l.date}</small>
              <Pill label={l.status} tone={tone(l.status)} />
            </span>
            <Icon name="chevron" size={20} color="#64748B" sw={2.2} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Medications ---------- */
export function Medications({ go, user }) {
  const [tab, setTab] = useState('Current');
  const current = tab === 'Current';
  const list = current ? user.meds : pastMeds;
  return (
    <div className="pad16 sub">
      <BackHeader title="Medications" go={go} fallback="records" />
      <div className="seg" role="tablist" aria-label="Medication list">
        {['Current', 'Past'].map((x) => (
          <button key={x} type="button" role="tab" aria-selected={tab === x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>{x}</button>
        ))}
      </div>
      {current ? (
        <div className="banner ok">
          <Icon name="shield" size={24} color="#0B8A63" />
          <div><b>Interactions &amp; Allergies</b><p>No known interactions with current medications.</p></div>
        </div>
      ) : (
        <div className="banner">
          <Icon name="shield" size={24} color="#64748B" />
          <div><b>Past Medication Records</b><p>These medications are discontinued or completed. Consult your doctor before restarting any course.</p></div>
        </div>
      )}
      <div className="list">
        {list.map((m, i) => (
          <article key={m.name + i} className="mcard">
            <div className="mc-top">
              <span className={'mc-ic' + (current ? '' : ' past')}><Icon name="pill" size={22} color={current ? '#0B8A63' : '#64748B'} sw={2.2} /></span>
              <div><b>{m.name}</b><small>{m.sched || m.how}</small></div>
            </div>
            <div className="mc-bot">
              <span>{m.by || 'Added by you'}</span>
              {current ? (m.refill && <span className="refill">Refill due: {m.refill}</span>) : <Pill label={m.status} tone={tone(m.status)} />}
            </div>
          </article>
        ))}
        {!list.length && <p className="empty">No current medications.</p>}
      </div>
    </div>
  );
}

/* ---------- Prescriptions ---------- */
export function Prescriptions({ go, toast, user, setUser }) {
  const shared = user.rxShared;
  const [sharing, setSharing] = useState(false);
  const [active, done] = prescriptions;
  const share = () => {
    setSharing(true);
    setTimeout(() => { setUser({ ...user, rxShared: true }); go('rx-shared'); }, 1000);
  };
  return (
    <div className="pad16 sub">
      <BackHeader title="Prescriptions" go={go} fallback="records" />
      <article className="card rx">
        <div className="rx-top">
          <div><small className="rx-k">Prescription ID</small><b className="rx-id">{active.id}</b></div>
          <Pill label={active.status} tone={tone(active.status)} />
        </div>
        <hr />
        <small className="caps-sm">Prescribed by</small>
        <b className="rx-doc">{active.doctor}</b>
        <small className="rx-sub">{active.place} · {active.date}</small>
        <hr />
        <small className="caps-sm">Medications</small>
        {active.meds.map((m) => (
          <div key={m.name} className="rx-med">
            <b>{m.name}</b>
            <small>Qty: {m.qty}<i>·</i>{m.how}<i>·</i>{m.days} days</small>
          </div>
        ))}
        <Button className="mt20" loading={sharing} disabled={shared} onClick={share}>
          {shared ? 'Shared with Pharmacy' : 'Share with Pharmacy'}
        </Button>
      </article>
      <button type="button" className="card rx-done" onClick={() => toast('This prescription is completed')}>
        <span><b>{done.id}</b><small>{done.doctor} · {done.date}</small></span>
        <span className="rx-status">{done.status}</span>
      </button>
    </div>
  );
}

/* ---------- Consultation details ---------- */
export function Consultation({ go }) {
  const c = consultation;
  return (
    <div className="pad16 sub">
      <BackHeader title="Consultation Details" go={go} fallback="timeline" />
      <article className="card">
        <div className="cd-head">
          <span className="cd-ic"><Icon name="hospital" size={26} color="#0B8A63" /></span>
          <div><b>{c.place}</b><small>{c.doctor}</small></div>
        </div>
        <hr />
        <div className="grid2">
          <div><small className="caps-sm">Date</small><b>{c.date}</b></div>
          <div><small className="caps-sm">Type</small><b>{c.type}</b></div>
        </div>
        <span className="verified"><Icon name="shield" size={18} color="#0B8A63" sw={2.2} />Verified by Provider</span>
      </article>

      <article className="card">
        <small className="caps-md">Chief Complaint</small>
        <p className="cd-text">{c.complaint}</p>
        <hr />
        <small className="caps-md">Diagnosis</small>
        <b className="cd-dx">{c.diagnosis}</b>
        <small className="rx-sub">{c.icd}</small>
      </article>

      <article className="card">
        <small className="caps-md">Vitals</small>
        <div className="vitals">
          {c.vitals.map(([k, v]) => (
            <div key={k}><small>{k}</small><b>{v}</b></div>
          ))}
        </div>
      </article>

      <article className="card">
        <small className="caps-md">Treatment Plan</small>
        <p className="cd-text">{c.plan}</p>
      </article>
    </div>
  );
}
