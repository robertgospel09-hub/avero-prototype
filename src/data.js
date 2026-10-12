// Demo data only. Nothing here leaves the tester's browser.
export const defaultUser = {
  name: 'Chikamara Okafor',
  photo: true,
  email: 'chikamara@example.com',
  phone: '+234 803 123 4521',
  dob: '14 Oct 1994',
  gender: 'Female',
  blood: 'O+',
  nid: 'AV-2026-0847',
  allergies: [
    { name: 'Penicillin', sev: 'Severe' },
    { name: 'Latex', sev: 'Moderate' },
  ],
  meds: [
    { name: 'Metformin 500mg', how: 'twice daily with meals', sched: 'Twice daily, with meals', by: 'Dr. Sarah Adeyemi, Jul 28, 2026', refill: 'Sep 28' },
    { name: 'Lisinopril 10mg', how: 'once daily in the morning', sched: 'Once daily, morning', by: 'Dr. Sarah Adeyemi, Jul 28, 2026', refill: 'Sep 28' },
    { name: 'Vitamin D3 1000IU', how: 'once daily', sched: 'Once daily', by: 'Dr. Eze, Mar 10, 2026' },
  ],
  emergency: { name: 'Chidi Okafor', rel: 'Brother', phone: '+234 802 991 3827' },
  notif: { push: true, email: false, sms: true },
  readNotifs: [],
  rxShared: false,
  access: {
    active: [
      { id: 'SA', name: 'Dr. Sarah Adeyemi', place: 'Lagos General Hospital', scope: 'Laboratory + Medication Records', granted: 'Aug 5, 2026', expires: 'Sep 5, 2026' },
      { id: 'EN', name: 'Dr. Emeka Nwosu', place: 'University Teaching Hospital', scope: 'Lab Results + Medication History', granted: 'Aug 10, 2026', expires: 'Sep 10, 2026' },
    ],
    previous: [
      { id: 'DB', name: 'Dr. Bello', place: 'Lagos Island Clinic', scope: 'All Records', granted: 'Mar 2, 2026', ended: 'Revoked Jun 15, 2026' },
    ],
    requests: [
      { id: 'r1', short: 'Dr. Emeka', name: 'Dr. Emeka Nwosu', place: 'University Teaching Hospital', scope: ['Laboratory Results', 'Medication History'], reason: 'Referral follow-up consultation.', days: 30, when: 'New Request', isNew: true },
      { id: 'r2', short: 'Dr. Funke', name: 'Dr. Funke Obi', place: 'CarePoint Clinic', scope: ['All Records'], reason: 'New patient registration.', days: 90, when: 'Aug 9' },
    ],
    prevRequests: [
      { name: 'PathCare Laboratory', place: 'Lab results upload', status: 'Approved', when: 'Aug 2, 2026' },
    ],
    log: [],
  },
  conditions: [
    { name: 'Type 2 Diabetes', year: 2021 },
    { name: 'Hypertension', year: 2023 },
  ],
};

export const timeline = [
  { icon: 'test', title: 'Blood Test', place: 'PathCare Lab', date: 'Aug 8', to: 'labs' },
  { icon: 'ambulance', title: 'Consultation', place: 'Lagos General', date: 'Aug 5', to: 'consult' },
];

// Full timeline (Timeline tab). type drives the filter chips.
export const events = [
  { type: 'Labs', icon: 'tube', title: 'Blood Test', place: 'PathCare Laboratory', date: 'Aug 8', pill: 'Results Ready', to: 'labs' },
  { type: 'Consultations', icon: 'steth', title: 'Consultation', place: 'Lagos General Hospital', doctor: 'Dr. Sarah Adeyemi', date: 'Aug 5', to: 'consult' },
  { type: 'Medications', icon: 'xcircle', title: 'Prescription', place: 'Metformin 500mg', doctor: 'Dr. Sarah Adeyemi', date: 'Jul 28', to: 'rx' },
  { type: 'Medications', icon: 'bottle', title: 'Medication Dispensed', place: 'HealthPlus Pharmacy', date: 'Jul 28', to: 'meds' },
  { type: 'Consultations', icon: 'ambulance', title: 'Follow-up Consultation', place: 'Lagos General Hospital', date: 'Jul 15', to: 'consult' },
  { type: 'Imaging', icon: 'xcircle', title: 'X-Ray — Chest', place: 'Radiology Partners', date: 'Jul 2' },
];

export const labs = [
  { name: 'Complete Blood Count', place: 'PathCare Laboratory', date: 'Aug 8, 2026', status: 'Normal', recent: true },
  { name: 'HbA1c Test', place: 'PathCare Laboratory', date: 'Aug 8, 2026', status: 'Elevated', recent: true },
  { name: 'Lipid Panel', place: 'MedLab Diagnostics', date: 'Jul 15, 2026', status: 'Normal' },
  { name: 'Fasting Blood Glucose', place: 'PathCare Laboratory', date: 'Jul 2, 2026', status: 'High', recent: true },
];

export const pendingLabs = [
  { name: 'Thyroid Function Panel', place: 'MedLab Diagnostics', date: 'Ordered Aug 12, 2026', status: 'Processing' },
  { name: 'Vitamin D Level', place: 'PathCare Laboratory', date: 'Ordered Aug 10, 2026', status: 'Sample Collected' },
  { name: 'Urinalysis', place: 'Lagos General Hospital', date: 'Ordered Aug 14, 2026', status: 'Awaiting Sample' },
];

export const STATUS = {
  Normal: { bg: '#E8F7F2', fg: '#0B8A63' },
  Elevated: { bg: '#FEF3C7', fg: '#D97706' },
  High: { bg: '#FDECEF', fg: '#E11D48' },
  Processing: { bg: '#E9F4F6', fg: '#1D63E8' },
  'Sample Collected': { bg: '#FEF3C7', fg: '#0B8A63' },
  'Awaiting Sample': { bg: '#E8F7F2', fg: '#5B7A73' },
  Completed: { bg: '#EEF2F6', fg: '#64748B' },
  Discontinued: { bg: '#FEF3C7', fg: '#D97706' },
  'Course ended': { bg: '#EEF2F6', fg: '#64748B' },
  Active: { bg: '#E8F7F2', fg: '#0B8A63' },
  'Results Ready': { bg: '#E8F7F2', fg: '#0B8A63' },
};

export const pastMeds = [
  { name: 'Amoxicillin 500mg', sched: 'Three times daily, with food', by: 'Dr. Sarah Adeyemi, Jan 15, 2026', status: 'Completed' },
  { name: 'Ibuprofen 400mg', sched: 'As needed for pain', by: 'Dr. Eze, Nov 3, 2025', status: 'Discontinued' },
  { name: 'Cetirizine 10mg', sched: 'Once daily', by: 'Dr. Sarah Adeyemi, Aug 20, 2025', status: 'Completed' },
  { name: 'Prednisolone 5mg', sched: 'Twice daily, tapering dose', by: 'Dr. Funke Obi, Jun 12, 2025', status: 'Course ended' },
];

export const prescriptions = [
  {
    id: 'RX-2026-0341', status: 'Active', doctor: 'Dr. Sarah Adeyemi', place: 'Lagos General Hospital', date: 'July 28, 2026',
    meds: [
      { name: 'Metformin 500mg', qty: 60, how: 'Twice daily with meals', days: 30 },
      { name: 'Lisinopril 10mg', qty: 30, how: 'Once daily', days: 30 },
    ],
  },
  { id: 'RX-2026-0012', status: 'Completed', doctor: 'Dr. Eze', date: 'March 10, 2026' },
];

export const consultation = {
  place: 'Lagos General Hospital', doctor: 'Dr. Sarah Adeyemi', date: 'Aug 5, 2026', type: 'General Consultation',
  complaint: 'Persistent fatigue and increased thirst for 3 weeks',
  diagnosis: 'Type 2 Diabetes Mellitus', icd: 'ICD-10: E11.9',
  vitals: [['Blood Pressure', '140/90 mmHg'], ['Heart Rate', '78 bpm'], ['Temperature', '36.8°C'], ['Weight', '72 kg']],
  plan: 'Lifestyle modification. Metformin 500mg twice daily with meals. Follow-up in 4 weeks to review blood sugar.',
};

export const appointments = [
  { title: 'Cardiology Follow-up', doctor: 'Dr. Sarah Adeyemi', time: '10:30 AM', place: 'Lagos General Hospital' },
  { title: 'Lab Results Review', doctor: 'Dr. Funke Obi', time: '2:15 PM', place: 'CarePoint Clinic' },
];

export const SEVERITY = {
  Severe: { bg: '#FDECEF', fg: '#E11D48' },
  Moderate: { bg: '#FEF3C7', fg: '#D97706' },
  Mild: { bg: '#E6F6F1', fg: '#0B8A63' },
};

// ---------- Sharing ----------
export const shareCategories = [
  { id: 'consult', label: 'Consultation Notes', short: 'Consultations', count: 12 },
  { id: 'labs', label: 'Laboratory Results', short: 'Laboratory', count: 8 },
  { id: 'rx', label: 'Prescriptions', short: 'Prescriptions', count: 4 },
  { id: 'imaging', label: 'Imaging Reports', short: 'Imaging', count: 2 },
  { id: 'vax', label: 'Vaccination Records', short: 'Vaccinations', count: 3 },
];

export const providers = [
  { id: 'SA', name: 'Dr. Sarah Adeyemi', place: 'Lagos General Hospital' },
  { id: 'EN', name: 'Dr. Emeka Nwosu', place: 'University Teaching Hospital' },
  { id: 'FO', name: 'Dr. Funke Obi', place: 'CarePoint Clinic' },
];

export const accessHistory = {
  'This Week': [
    { icon: 'eye', tone: 'g', title: 'Dr. Sarah Adeyemi viewed your Laboratory Results', sub: 'Lagos General Hospital · Aug 18, 2026, 9:15 AM' },
    { icon: 'eye', tone: 'g', title: 'Dr. Emeka Nwosu viewed your Lab Results', sub: 'University Teaching Hospital · Aug 17, 2026, 2:30 PM' },
  ],
  'This Month': [
    { icon: 'eye', tone: 'g', title: 'Dr. Sarah Adeyemi viewed your Laboratory Results', sub: 'Lagos General Hospital · Aug 11, 2026, 10:42 AM' },
    { icon: 'eye', tone: 'g', title: 'Dr. Sarah Adeyemi viewed your Medication History', sub: 'Lagos General Hospital · Aug 11, 2026, 10:38 AM' },
    { icon: 'eye', tone: 'g', title: 'Dr. Emeka Nwosu viewed your Lab Results', sub: 'University Teaching Hospital · Aug 10, 2026, 3:15 PM' },
    { icon: 'share', tone: 'n', title: 'You shared records with Dr. Emeka', sub: 'Outgoing share · Aug 10, 2026, 2:00 PM' },
    { icon: 'key', tone: 'g', title: 'Dr. Sarah Adeyemi was granted access', sub: 'Access granted · Aug 5, 2026, 11:20 AM' },
  ],
  'All Time': [
    { icon: 'eye', tone: 'g', title: 'Dr. Sarah Adeyemi viewed your Laboratory Results', sub: 'Lagos General Hospital · Aug 11, 2026, 10:42 AM' },
    { icon: 'share', tone: 'n', title: 'You shared records with Dr. Emeka', sub: 'Outgoing share · Aug 10, 2026, 2:00 PM' },
    { icon: 'key', tone: 'g', title: 'Dr. Sarah Adeyemi was granted access', sub: 'Access granted · Aug 5, 2026, 11:20 AM' },
    { icon: 'key', tone: 'g', title: 'Dr. Funke requested access to All Records', sub: 'Access requested · Jul 22, 2026, 4:15 PM' },
    { icon: 'xcircle', tone: 'r', title: "You revoked Dr. Bello's access", sub: 'Revocation complete · Jun 15, 2026, 1:10 PM' },
    { icon: 'eye', tone: 'g', title: 'Dr. Sarah Adeyemi viewed your Medication History', sub: 'Lagos General Hospital · May 30, 2026, 8:45 AM' },
  ],
};

// ---------- Notifications ----------
export const notifications = [
  { id: 'n1', sec: 'Today', icon: 'flask', tone: 'g', title: 'New Lab Result Available', text: 'Your Complete Blood Count results from PathCare Laboratory are ready.', when: '2 hours ago', to: 'labs' },
  { id: 'n2', sec: 'Today', icon: 'shieldOnly', tone: 'n', title: 'Access Request', text: 'Dr. Emeka from University Teaching Hospital has requested access to your records.', when: '5 hours ago', to: 'requests' },
  { id: 'n3', sec: 'Yesterday', icon: 'pill', tone: 'g', title: 'Prescription Ready', text: 'Your prescription RX-2026-0341 has been filled at HealthPlus Pharmacy.', when: '1 day ago', to: 'rx', read: true },
  { id: 'n4', sec: 'Yesterday', icon: 'file', tone: 'n', title: 'Referral Update', text: 'Your referral to University Teaching Hospital has been accepted.', when: '1 day ago', read: true },
  { id: 'n5', sec: 'Earlier', icon: 'triangle', tone: 'r', title: 'Security Alert', text: 'New login detected from Lagos, Nigeria.', when: '3 days ago', to: 'settings', read: true },
];

export const BLOOD_NAME = {
  'O+': 'O Positive', 'O-': 'O Negative', 'A+': 'A Positive', 'A-': 'A Negative',
  'B+': 'B Positive', 'B-': 'B Negative', 'AB+': 'AB Positive', 'AB-': 'AB Negative',
};
