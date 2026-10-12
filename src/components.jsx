import { useId } from 'react';
import avatarImg from './assets/avatar.png';

const ICONS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5l8.5 6 8.5-6" /></>,
  phone: <><path d="M5.2 4h3l1.5 4-2 1.4a11 11 0 005 5l1.4-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013.2 6a2 2 0 012-2z" /><path d="M15 3.5A5.5 5.5 0 0120.5 9M15 7a2 2 0 012 2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  id: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 15.5c.6-1.4 1.7-2 3-2s2.4.6 3 2M14.5 10H18M14.5 13.5H18" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  xcircle: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
  home: <><path d="M4 10.5L12 4l8 6.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2z" /><path d="M9.5 21v-6h5v6" /></>,
  timeline: <path d="M4 4v16h16M8 8h8M8 12h5M8 16h9" />,
  folder: <><path d="M3 7a2 2 0 012-2h4l2 2.5h8a2 2 0 012 2V18a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M3 11h18" /></>,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" /><path d="M8.8 12.2l2.2 2.2 4.2-4.4" /></>,
  profile: <><circle cx="10" cy="8" r="4" /><path d="M3 21c0-4 3.1-7 7-7 1.3 0 2.5.3 3.5.9M15.5 19l2 2 3.5-4" /></>,
  pill: <><rect x="2.8" y="8.5" width="18.4" height="7" rx="3.5" transform="rotate(-45 12 12)" /><path d="M8.5 8.5l7 7" /></>,
  drop: <path d="M12 3.5s6 6.4 6 10.5a6 6 0 01-12 0c0-4.1 6-10.5 6-10.5z" />,
  alert: <><path d="M12 2.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.9 1 2.9-2.5 1.7-.9 2.9-3-.2-2.4 1.8-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.9-1-2.9 2.5-1.7.9-2.9 3 .2z" /><path d="M12 8v4.5M12 16h.01" /></>,
  chevron: <path d="M9 6l6 6-6 6" />,
  back: <path d="M15 6l-6 6 6 6" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4" /><path d="M10.5 12.5L20 3M16 7l3 3M14 9l2 2" /></>,
  bell: <><path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 004 0" /></>,
  flask: <><path d="M9 3h6M10 3v5L5 18a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-10V3" /><path d="M7.5 14h9" /></>,
  file: <><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6M9 9h1" /></>,
  triangle: <><path d="M10.3 4.3L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z" /><path d="M12 9.5v4.5M12 17.5h.01" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z" />,
  trash: <><path d="M4 7h16M10 3.5h4M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" /><path d="M10 11v6M14 11v6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  alertc: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13M12 16.5h.01" /></>,
  chevDown: <path d="M6 9l6 6 6-6" />,
  shieldOnly: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" />,
  userCheck: <><circle cx="10" cy="8" r="4" /><path d="M3 21c0-4 3.1-7 7-7 1.3 0 2.5.3 3.5.9M15.5 19l2 2 3.5-4" /></>,
  fingerprint: <path d="M12 11v2.5c0 2.5-.7 4.8-2 6.7M8.4 9.2A4.5 4.5 0 0116.5 12v1.5c0 1.6-.2 3.1-.7 4.5M7.5 12c0 1.9-.4 3.6-1.2 5.1M12 7a5 5 0 012.3.6M4.5 15c.6-1.3.9-2.8.9-4.3a6.6 6.6 0 0110-5.7M19.4 14c.1-.7.1-1.4.1-2.1 0-1.4-.3-2.7-.9-3.9M14 13c0 2.9-.7 5.6-2 8" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></>,
  tube: <><path d="M9 3h6M10 3v15a2 2 0 004 0V3" /><path d="M10 12h4" /></>,
  steth: <><path d="M6 3H5v5a4 4 0 008 0V3h-1" /><path d="M9 12v2.5a5 5 0 0010 0V12" /><circle cx="19" cy="10" r="2" /></>,
  bottle: <><rect x="5.5" y="3" width="13" height="4" rx="1" /><path d="M7 7v12a2 2 0 002 2h6a2 2 0 002-2V7" /><rect x="10" y="11" width="7" height="5" rx="1" /></>,
  hospital: <><rect x="7" y="3" width="10" height="18" rx="1.5" /><path d="M7 9H4.5a1 1 0 00-1 1v11h17V10a1 1 0 00-1-1H17M12 5.5v5M9.5 8h5M10 21v-4h4v4" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  logout: <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 16l-4-4 4-4M6 12h10" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pen: <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16zM13.5 6.5l4 4M14 20h6" />,
  test: <path d="M14.5 3.5l6 6M16.5 5.5l-10 10a2.3 2.3 0 003.2 3.2l10-10M9.5 12.5l3 3M4 20l2.3-2.3" />,
  ambulance: <><path d="M2.5 6.5h11V17h-11zM13.5 9.5h4l3 3.5V17h-7" /><circle cx="6.5" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /><path d="M8 8.8v4.4M5.8 11h4.4" /></>,
  fileScan: <><path d="M13 3H7a2 2 0 00-2 2v14a2 2 0 002 2h4M13 3l5 5M13 3v5h5v3" /><rect x="14" y="14" width="7" height="7" rx="1.6" strokeDasharray="2.6 2" /></>,
  camera: <><path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" /><circle cx="12" cy="13" r="3.5" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />,
};

export function Icon({ name, size = 22, color, sw = 2, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" style={{ color, flex: 'none', ...style }} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function Mark({ size = 110 }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g1 = 'mk' + uid;
  const g2 = 'cr' + uid;
  return (
    <svg width={size} height={(size * 190) / 220} viewBox="280 690 220 190" aria-hidden="true">
      <defs>
        <linearGradient id={g1} x1="285" y1="0" x2="495" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1D63E8" />
          <stop offset=".45" stopColor="#0C79D6" />
          <stop offset="1" stopColor="#14B49A" />
        </linearGradient>
        <linearGradient id={g2} x1="364" y1="772" x2="416" y2="822" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1A6BE0" />
          <stop offset="1" stopColor="#0DA0A8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g1})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M311 841 L373 716 Q390 688 407 716 L469 841" />
        <circle cx="304" cy="855" r="14" />
        <circle cx="476" cy="855" r="14" />
        <path d="M318 856 L362 856 L373 834 L392 873 L403 846 L411 856 L462 856" />
      </g>
      <rect x="381" y="772" width="18" height="50" rx="4.5" fill={`url(#${g2})`} />
      <rect x="365" y="788" width="50" height="18" rx="4.5" fill={`url(#${g2})`} />
    </svg>
  );
}

export function Logo({ size = 110 }) {
  return (
    <div className="logo" role="img" aria-label="Avero">
      <Mark size={size} />
      <div className="wordmark" style={{ fontSize: size * 0.55, marginTop: -size * 0.08 }}>
        <span style={{ color: '#0B2550' }}>av</span>
        <span className="wm-e">e</span>
        <span style={{ color: '#12B39C' }}>ro</span>
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="sb" aria-hidden="true">
      <span>9:41</span>
      <svg width="81" height="14" viewBox="0 0 81 14">
        <g fill="#1B2A22">
          <rect x="0" y="9" width="3.2" height="4.5" rx="1" />
          <rect x="5.2" y="6.2" width="3.2" height="7.3" rx="1" />
          <rect x="10.4" y="3.2" width="3.2" height="10.3" rx="1" />
          <rect x="15.6" y="0.3" width="3.2" height="13.2" rx="1" />
        </g>
        <g fill="none" stroke="#1B2A22" strokeWidth="2.3" strokeLinecap="round">
          <path d="M26.6 4.9a12 12 0 0 1 16.8 0" />
          <path d="M29.6 8a7.6 7.6 0 0 1 10.8 0" />
        </g>
        <circle cx="35" cy="11.6" r="1.9" fill="#1B2A22" />
        <rect x="52.5" y="0.8" width="24.5" height="12.4" rx="3.8" fill="none" stroke="#1B2A22" strokeWidth="1.4" />
        <rect x="54.6" y="2.9" width="20.3" height="8.2" rx="2.2" fill="#1B2A22" />
        <rect x="78.2" y="4.8" width="1.6" height="4.4" rx=".8" fill="#1B2A22" />
      </svg>
    </div>
  );
}

export function Field({ label, icon, error, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={'input' + (error ? ' err' : '')}>
        <Icon name={icon} size={22} color="#64748B" />
        <input {...props} />
      </span>
      {error && <span className="field-err">{error}</span>}
    </label>
  );
}

export function Button({ children, loading, disabled, className = '', ...p }) {
  return (
    <button type="button" className={'btn ' + className} disabled={loading || disabled} {...p}>
      {loading ? <span className="spin" aria-label="Loading" /> : children}
    </button>
  );
}

export function BackHeader({ title, sub, go, fallback = 'home' }) {
  const back = () => (window.history.length > 1 ? window.history.back() : go(fallback, { replace: true }));
  return (
    <header className={'bh' + (sub ? ' has-sub' : '')}>
      <button type="button" className="back-btn lg" onClick={back} aria-label="Back">
        <Icon name="back" size={20} color="#0F2342" sw={2.6} />
      </button>
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </header>
  );
}

export function Result({ art, title, text, children, cta, onCta, ctaClass = '', foot }) {
  return (
    <div className="result">
      <div className="res-body">
        {art}
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
      <div className="res-foot">
        <Button className={ctaClass} onClick={onCta}>{cta}</Button>
        {foot && <small>{foot}</small>}
      </div>
    </div>
  );
}

export function Pill({ label, tone }) {
  return <span className="pill" style={{ background: tone.bg, color: tone.fg }}>{label}</span>;
}

export function Avatar({ user, size = 44 }) {
  if (user.photo) {
    return <img className="avatar" src={avatarImg} alt="" width={size} height={size} />;
  }
  const initials = user.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="avatar initials" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}
