import { useEffect, useRef, useState } from 'react';
import { Logo, Icon, Field, Button } from '../components.jsx';

/* ---------- Splash ---------- */
export function Splash({ go }) {
  useEffect(() => {
    const t = setTimeout(() => go('onboarding', { replace: true }), 2200);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <button type="button" className="splash" onClick={() => go('onboarding', { replace: true })} aria-label="Continue">
      <Logo size={110} />
      <span className="e2e">
        <Icon name="xcircle" size={17} color="#10B981" sw={2.2} />
        END-TO-END ENCRYPTED
      </span>
    </button>
  );
}

/* ---------- Onboarding ---------- */
function OnbArt() {
  const line = { fill: 'none', stroke: '#5ECFB1', strokeWidth: 1.6, strokeLinecap: 'round' };
  const node = { fill: '#fff', stroke: '#E2E8F0' };
  const ink = { fill: 'none', stroke: '#0F2342', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 342 239" width="100%" role="img" aria-label="Hospital, lab and prescription records connected to one heart">
      <path {...line} d="M73.5 84 L73.5 172 Q73.5 187.5 89 187.5 L141 187.5" />
      <path {...line} d="M183.5 187.5 L269.5 187.5" />
      <path {...line} d="M192 71 L241 62.5" />
      <path {...line} d="M183 88 L202 106" />
      <circle cx="171" cy="120" r="32" fill="#0F2342" />
      <ellipse {...line} cx="171" cy="75" rx="22" ry="15" />
      <ellipse {...line} cx="214" cy="119.5" rx="22" ry="15" />
      <ellipse {...line} cx="138.5" cy="142.5" rx="22" ry="15" />
      <path {...line} d="M192.5 126 L160 136" />
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M171 131.5C162 125 158.5 120 158.5 115.5c0-4 3-7 6.5-7 2.8 0 4.8 1.5 6 3.5 1.2-2 3.2-3.5 6-3.5 3.5 0 6.5 3 6.5 7 0 4.5-3.5 9.5-12.5 16z" />
        <path d="M161 119.5h5l2.5-4 3.5 8.5 2.5-5.5h6.5" />
      </g>
      <circle {...node} cx="62" cy="61.5" r="21.5" />
      <g {...ink}>
        <rect x="56" y="51.5" width="12" height="19" rx="2" />
        <path d="M56 57.5h-3q-1 0-1 1v12h20v-12q0-1-1-1h-3M62 54.5v6M59 57.5h6M60 70.5V66q2-2 4 0v4.5" />
      </g>
      <circle {...node} cx="262" cy="71.5" r="21.5" />
      <path {...ink} d="M258.5 62h7M259.5 62v17q0 2.5 2.5 2.5t2.5-2.5V62" />
      <rect x="260.5" y="73" width="3" height="7.5" rx="1.5" fill="#0F2342" />
      <circle {...node} cx="162" cy="187.5" r="21.5" />
      <g transform="rotate(-45 162 187.5)" {...ink} strokeWidth="2.2">
        <rect x="150" y="182" width="24" height="11" rx="5.5" />
        <path d="M162 182v11" />
      </g>
    </svg>
  );
}

export function Onboarding({ go }) {
  return (
    <div className="pad onb">
      <div className="onb-card"><OnbArt /></div>
      <h1 className="h-onb">All your medical records, one place.</h1>
      <p className="lead">Access lab results, prescriptions, and visit history from every provider — securely connected.</p>
      <div className="dots" aria-label="Slide 1 of 3"><i className="on" /><i /><i /></div>
      <Button onClick={() => go('signup')}>Get Started</Button>
    </div>
  );
}

/* ---------- Sign up ---------- */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const maskDob = (digits) => {
  const d = digits.slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join(' / ');
};
const fmtDob = (v) => {
  const [d, m, y] = v.split(' / ').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export function SignUp({ go, user, setUser }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', dob: '', nid: '' });
  const [err, setErr] = useState({});

  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === 'dob') {
      let digits = v.replace(/\D/g, '');
      const prev = f.dob.replace(/\D/g, '');
      if (v.length < f.dob.length && digits === prev) digits = digits.slice(0, -1);
      v = maskDob(digits);
    }
    setF({ ...f, [k]: v });
    if (err[k]) setErr({ ...err, [k]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address';
    if (f.phone.replace(/\D/g, '').length < 7) er.phone = 'Enter a valid phone number';
    const [d, m] = f.dob.split(' / ').map(Number);
    if (!/^\d{2} \/ \d{2} \/ \d{4}$/.test(f.dob) || d < 1 || d > 31 || m < 1 || m > 12) er.dob = 'Use DD / MM / YYYY';
    setErr(er);
    if (Object.keys(er).length) return;
    setUser({ ...user, name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), dob: fmtDob(f.dob), nid: f.nid.trim() || user.nid, photo: false });
    go('verify');
  };

  return (
    <form className="pad auth" onSubmit={submit} noValidate>
      <div className="logo-sm"><Logo size={24} /></div>
      <h1 className="h1">Create your account</h1>
      <p className="sub">Enter your clinical details to get secure access.</p>
      <div className="fields">
        <Field label="Full Name" icon="user" placeholder="e.g. Chikamara Okafor" autoComplete="name" value={f.name} onChange={set('name')} error={err.name} />
        <Field label="Email Address" icon="mail" type="email" placeholder="chikamara@example.com" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} />
        <Field label="Phone Number" icon="phone" type="tel" placeholder="+234 803 123 4521" autoComplete="tel" value={f.phone} onChange={set('phone')} error={err.phone} />
        <Field label="Date of Birth" icon="calendar" inputMode="numeric" placeholder="DD / MM / YYYY" value={f.dob} onChange={set('dob')} error={err.dob} />
        <Field label="National ID / Healthcare No" icon="id" placeholder="AV-2026-0847" value={f.nid} onChange={set('nid')} />
      </div>
      <Button type="submit" className="mt28">Create Account</Button>
      <p className="foot">Already have an account? <button type="button" className="link" onClick={() => go('signin')}>Sign In</button></p>
    </form>
  );
}

/* ---------- Verify phone ---------- */
export function VerifyPhone({ go, user, toast }) {
  const [code, setCode] = useState(Array(6).fill(''));
  const [t, setT] = useState(45);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);

  const setAt = (i, raw) => {
    const d = raw.replace(/\D/g, '');
    const n = [...code];
    if (d.length > 1) {
      d.slice(0, 6 - i).split('').forEach((c, j) => { n[i + j] = c; });
      setCode(n);
      refs.current[Math.min(i + d.length, 5)]?.focus();
      return;
    }
    n[i] = d;
    setCode(n);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      const n = [...code];
      n[i - 1] = '';
      setCode(n);
      refs.current[i - 1]?.focus();
    }
  };

  const full = code.every(Boolean);
  const digits = user.phone.replace(/\D/g, '');
  const cc = user.phone.trim().startsWith('+') ? user.phone.trim().split(/\s+/)[0] : '+234';
  const verify = () => {
    setLoading(true);
    setTimeout(() => go('identity', { replace: true }), 900);
  };

  return (
    <div className="pad auth">
      <span className="badge"><Icon name="xcircle" size={16} sw={2.2} />2-STEP VERIFICATION</span>
      <h1 className="h1 h-verify">Verify your phone number</h1>
      <p className="sub">We've sent an SMS authentication code to <b>{cc} *** *** {digits.slice(-4) || '4521'}</b></p>
      <div className="otp" role="group" aria-label="6-digit code">
        {code.map((c, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} className={c ? 'filled' : ''} value={c}
            inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} placeholder="•" aria-label={`Digit ${i + 1}`}
            onChange={(e) => setAt(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onFocus={(e) => e.target.select()} />
        ))}
      </div>
      <p className="hint">Demo: enter any 6 digits</p>
      <Button disabled={!full} loading={loading} onClick={verify}>Verify</Button>
      <p className="foot">
        {t > 0
          ? <>Resend code in <span className="green">0:{String(t).padStart(2, '0')}</span></>
          : <button type="button" className="link" onClick={() => { setT(45); toast('New code sent'); }}>Resend code</button>}
      </p>
    </div>
  );
}

/* ---------- Verify identity ---------- */
const DOCS = [
  { id: 'national', label: 'National ID', noun: 'ID Card' },
  { id: 'license', label: "Driver's License", noun: "Driver's License" },
  { id: 'passport', label: 'Passport', noun: 'Passport' },
];

export function VerifyIdentity({ go, user, setUser, toast }) {
  const [doc, setDoc] = useState('national');
  const [captured, setCaptured] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const d = DOCS.find((x) => x.id === doc);

  const capture = () => {
    if (scanning) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setCaptured(true); }, 1200);
  };
  const complete = () => {
    if (!captured) { toast(`Take a photo of your ${d.noun} first`); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ ...user, verified: true });
      go('home', { replace: true });
      toast('Identity verified');
    }, 1100);
  };

  return (
    <div className="pad auth">
      <div className="progress-row"><span className="green">STEP 3 OF 3: IDENTITY</span><span>100%</span></div>
      <div className="progress"><i /></div>
      <h1 className="h1 mt36">Verify your identity</h1>
      <p className="sub">Upload a government-issued document to unlock secure biometric health trace linking.</p>
      <h2 className="h-label">Select Document Type</h2>
      <div className="chips" role="radiogroup" aria-label="Document type">
        {DOCS.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={doc === x.id} className={'chip' + (doc === x.id ? ' on' : '')}
            onClick={() => { setDoc(x.id); setCaptured(false); }}>{x.label}</button>
        ))}
      </div>
      <button type="button" className={'drop' + (captured ? ' done' : '')} onClick={capture}>
        <span className="drop-ic">
          {scanning ? <span className="spin dark" /> : <Icon name={captured ? 'check' : 'fileScan'} size={26} color="#0B7A5C" sw={captured ? 2.6 : 2} />}
        </span>
        <b>{scanning ? 'Scanning…' : captured ? `${d.noun} captured` : `Take a photo of your ${d.noun}`}</b>
        <small>{captured ? 'Tap to retake. Demo only, no photo is stored.' : 'Ensure document details are clear and legible.'}</small>
      </button>
      <Button loading={loading} onClick={complete} className="mt28">Complete Verification</Button>
    </div>
  );
}

/* ---------- Sign in ---------- */
export function SignIn({ go, toast }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const enter = () => {
    setLoading(true);
    setTimeout(() => go('home', { replace: true }), 800);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !pw) { toast('Enter your email and password'); return; }
    enter();
  };

  return (
    <form className="pad auth" onSubmit={submit} noValidate>
      <div className="logo-sm"><Logo size={24} /></div>
      <h1 className="h1">Welcome back</h1>
      <p className="sub">Enter your credentials to access your health records.</p>
      <div className="fields">
        <Field label="Email Address" icon="mail" type="email" placeholder="chikamara@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" icon="lock" type="password" placeholder="••••••••" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>
      <div className="remember">
        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span className="box"><Icon name="check" size={14} color="#fff" sw={3} /></span>
          Remember me
        </label>
        <button type="button" className="link" onClick={() => toast('Reset link sent (demo)')}>Forgot Password?</button>
      </div>
      <Button type="submit" loading={loading}>Sign In</Button>
      <div className="divider"><span>OR CONTINUE WITH</span></div>
      <div className="social">
        <button type="button" onClick={enter}>Google</button>
        <button type="button" onClick={enter}>Apple</button>
      </div>
      <p className="foot">Don't have an account? <button type="button" className="link" onClick={() => go('signup')}>Sign Up</button></p>
    </form>
  );
}
