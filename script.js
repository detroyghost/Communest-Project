/* ═══════════════════════════════════════════════════════
   COMMUNEST — app.js (Vue 3 CDN)
   Author: Kipngeno Shammah Kiplangat
   Communest — Kenya Digital Estate Platform
═══════════════════════════════════════════════════════ */
'use strict';

const { createApp, ref, reactive, computed, watch, onMounted, nextTick } = Vue;

/* ─────────────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────────────── */
const USERS_SEED = [
  { id: 'mgr-1', name: 'James Mutua',       email: 'james@sunrise.ke',  password: 'mgr123', role: 'management', estateId: 1, phone: '+254 720 100 001' },
  { id: 'mgr-2', name: 'Grace Akinyi',      email: 'grace@kilimani.ke', password: 'mgr123', role: 'management', estateId: 2, phone: '+254 720 100 002' },
  { id: 'mgr-3', name: 'David Ochieng',     email: 'david@west.ke',     password: 'mgr123', role: 'management', estateId: 3, phone: '+254 720 100 003' },
  { id: 'ten-1', name: 'Shammah Kiplangat', email: 'shammah@email.com', password: 'ten123', role: 'tenant', estateId: 1, unit: '2A', rent: 28000, leaseStart: '1 Feb 2026', leaseEnd: '31 Jan 2027', phone: '+254 700 001 001' },
  { id: 'ten-2', name: 'Jane Wanjiru',      email: 'jane@email.com',    password: 'ten123', role: 'tenant', estateId: 1, unit: '3C', rent: 45000, leaseStart: '1 Jan 2026',  leaseEnd: '31 Dec 2026', phone: '+254 700 001 002' },
  { id: 'ten-3', name: 'Brian Odhiambo',    email: 'brian@email.com',   password: 'ten123', role: 'tenant', estateId: 2, unit: '5A', rent: 35000, leaseStart: '1 Mar 2026',  leaseEnd: '28 Feb 2027', phone: '+254 700 001 003' },
  { id: 'ten-4', name: 'Sarah Otieno',      email: 'sarah@email.com',   password: 'ten123', role: 'tenant', estateId: null, unit: null, rent: null, leaseStart: null, leaseEnd: null, phone: '+254 700 001 004' },
];

const ESTATES_SEED = [
  { id: 1, name: 'Sunrise Gardens',        emoji: '🏘️', location: 'Karen, Nairobi',      desc: 'A serene gated estate in Karen with lush landscaping, 24/7 security, and a vibrant community.', amenities: ['Swimming Pool','Gym','Parking','24/7 Security','Playground','Borehole','CCTV'], phone: '+254 720 100 001', email: 'james@sunrise.ke',  managedBy: 'James Mutua' },
  { id: 2, name: 'Kilimani Heights',        emoji: '🏢', location: 'Kilimani, Nairobi',   desc: 'Modern high-rise in Kilimani with stunning city views, fibre internet, and premium amenities.', amenities: ['Gym','Parking','24/7 Security','CCTV','Fibre WiFi','Lift','Backup Generator'], phone: '+254 720 100 002', email: 'grace@kilimani.ke', managedBy: 'Grace Akinyi' },
  { id: 3, name: 'Westlands Park Estate',   emoji: '🌆', location: 'Westlands, Nairobi',  desc: 'Prime location in Westlands, minutes from the CBD and Sarit Centre.', amenities: ['Parking','24/7 Security','Borehole','Playground','CCTV','Backup Generator'], phone: '+254 720 100 003', email: 'david@west.ke',     managedBy: 'David Ochieng' },
  { id: 4, name: 'Ngong Valley Residences', emoji: '🏠', location: 'Ngong Road, Nairobi', desc: 'Affordable modern estate along Ngong Road. Perfect for young families.', amenities: ['Parking','24/7 Security','Borehole','Playground'], phone: '+254 720 100 004', email: 'info@ngong.ke',     managedBy: 'Valley Homes' },
  { id: 5, name: 'Lavington Court',         emoji: '🏰', location: 'Lavington, Nairobi',  desc: 'Exclusive gated community with luxury townhouses and resort-style amenities.', amenities: ['Swimming Pool','Gym','Parking','24/7 Security','CCTV','Fibre WiFi','Backup Generator','Lift'], phone: '+254 720 100 005', email: 'info@lav.ke',       managedBy: 'Premium Props' },
  { id: 6, name: 'Thika Road Meadows',      emoji: '🌇', location: 'Thika Road, Nairobi', desc: 'Budget-friendly family estate close to schools, hospitals, and shopping malls.', amenities: ['Parking','Security','Playground','Borehole'], phone: '+254 720 100 006', email: 'info@thika.ke',     managedBy: 'Meadows Homes' },
];

const HOUSES_SEED = {
  1: [
    { id: 101, unit: '2A', block: 'Block A', type: '2 Bedrooms', price: 28000, floor: '2nd Floor',    feats: ['Parking','Security','Water','WiFi'],           status: 'Occupied',  emoji: '🏠', desc: 'Spacious 2-bedroom with large windows, modern kitchen, and tiled floors throughout.' },
    { id: 102, unit: '3C', block: 'Block C', type: '3 Bedrooms', price: 45000, floor: '3rd Floor',    feats: ['Parking','WiFi','Security','Water','Balcony'], status: 'Occupied',  emoji: '🏡', desc: 'Luxurious 3-bedroom with panoramic views, fully fitted kitchen, and two bathrooms.' },
    { id: 103, unit: '1B', block: 'Block B', type: '1 Bedroom',  price: 16000, floor: 'Ground Floor', feats: ['Security','Water'],                           status: 'Available', emoji: '🛏️', desc: 'Cosy 1-bedroom ideal for singles or couples.' },
    { id: 104, unit: '5D', block: 'Block D', type: 'Bedsitter',  price: 9500,  floor: '5th Floor',    feats: ['Security'],                                   status: 'Available', emoji: '🚪', desc: 'Compact bedsitter with great city views.' },
  ],
  2: [
    { id: 201, unit: '5A', block: 'Block A', type: '2 Bedrooms', price: 35000, floor: '5th Floor', feats: ['Gym','Parking','WiFi','Security'], status: 'Occupied',  emoji: '🏢', desc: 'Modern 2-bedroom in the heart of Kilimani.' },
    { id: 202, unit: '2B', block: 'Block B', type: '1 Bedroom',  price: 22000, floor: '2nd Floor', feats: ['Security','Water','Lift'],         status: 'Available', emoji: '🏠', desc: 'Bright 1-bedroom with lift access.' },
    { id: 203, unit: '8C', block: 'Block C', type: 'Studio',     price: 18000, floor: '8th Floor', feats: ['WiFi','Security','Lift'],          status: 'Available', emoji: '🏙️', desc: 'Stylish studio with city views.' },
  ],
  3: [
    { id: 301, unit: '4A', block: 'Block A', type: '2 Bedrooms', price: 30000, floor: '4th Floor',    feats: ['Parking','Security','Borehole'], status: 'Available', emoji: '🏠', desc: '2-bedroom in Westlands with parking.' },
    { id: 302, unit: '1C', block: 'Block C', type: '1 Bedroom',  price: 18000, floor: 'Ground Floor', feats: ['Security','Water','Parking'],    status: 'Available', emoji: '🛏️', desc: 'Ground floor 1-bedroom with garden access.' },
  ],
  4: [
    { id: 401, unit: '2A', block: 'Block A', type: '2 Bedrooms', price: 20000, floor: '2nd Floor',    feats: ['Parking','Security'], status: 'Available', emoji: '🏠', desc: 'Affordable 2-bedroom on Ngong Road.' },
    { id: 402, unit: '1B', block: 'Block B', type: '1 Bedroom',  price: 13000, floor: 'Ground Floor', feats: ['Security','Borehole'],status: 'Available', emoji: '🛏️', desc: 'Value 1-bedroom for young families.' },
  ],
  5: [
    { id: 501, unit: 'T1', block: 'Townhouse A', type: '3 Bedrooms', price: 120000, floor: 'Ground', feats: ['Pool','Gym','Parking','WiFi','Security'], status: 'Available', emoji: '🏰', desc: 'Luxury townhouse with private garden.' },
  ],
  6: [
    { id: 601, unit: '3A', block: 'Block A', type: '2 Bedrooms', price: 15000, floor: '3rd Floor',    feats: ['Security','Parking'], status: 'Available', emoji: '🌇', desc: 'Budget-friendly 2-bedroom on Thika Road.' },
    { id: 602, unit: '1B', block: 'Block B', type: 'Bedsitter',  price: 8000,  floor: 'Ground Floor', feats: ['Security'],           status: 'Available', emoji: '🚪', desc: 'Affordable bedsitter close to Roysambu.' },
  ],
};

const ANNOUNCEMENTS_SEED = {
  1: [
    { id: 1001, title: 'Water Supply Interruption – 6th March 2026', category: 'Maintenance', message: 'Scheduled water interruption on 6th March from 8AM–12PM for tank maintenance.', date: '4 Mar 2026', by: 'Sunrise Gardens Management' },
    { id: 1002, title: 'Community Clean-Up – 15th March 2026',       category: 'Event',       message: 'Join our community clean-up on 15th March at 7AM. Refreshments provided.',       date: '2 Mar 2026', by: 'Sunrise Gardens Management' },
  ],
  2: [{ id: 2001, title: 'Gym Maintenance – Closed 8th March', category: 'Maintenance', message: 'The gym will be closed on 8th March for equipment servicing.', date: '5 Mar 2026', by: 'Kilimani Heights Management' }],
  3: [{ id: 3001, title: 'Gate Access Policy Reminder', category: 'Notice', message: 'All visitors must be registered at the gate before entry.', date: '1 Mar 2026', by: 'Westlands Park Management' }],
  4: [], 5: [], 6: [],
};

const PAYMENTS_SEED = {
  'ten-1': [
    { month: 'March 2026',    amount: 28000, due: '1 Mar 2026',  paid: '28 Feb 2026', status: 'Paid' },
    { month: 'February 2026', amount: 28000, due: '1 Feb 2026',  paid: '30 Jan 2026', status: 'Paid' },
    { month: 'January 2026',  amount: 28000, due: '1 Jan 2026',  paid: '30 Dec 2025', status: 'Paid' },
  ],
  'ten-2': [
    { month: 'March 2026',    amount: 45000, due: '1 Mar 2026',  paid: '28 Feb 2026', status: 'Paid' },
    { month: 'February 2026', amount: 45000, due: '1 Feb 2026',  paid: '',            status: 'Overdue' },
  ],
  'ten-3': [
    { month: 'March 2026',    amount: 35000, due: '1 Mar 2026',  paid: '27 Feb 2026', status: 'Paid' },
  ],
};

/* ─────────────────────────────────────────────────────
   GLOBAL REACTIVE STATE (Pinia-like using reactive)
───────────────────────────────────────────────────── */
const store = reactive({
  users:         JSON.parse(JSON.stringify(USERS_SEED)),
  estates:       JSON.parse(JSON.stringify(ESTATES_SEED)),
  houses:        JSON.parse(JSON.stringify(HOUSES_SEED)),
  announcements: JSON.parse(JSON.stringify(ANNOUNCEMENTS_SEED)),
  requests:      { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  applications:  {
    1: [{ id: 'app-101', name: 'Lucy Mwangi',  email: 'lucy@email.com',  phone: '+254700000001', houseId: 103, occupation: 'Teacher',  message: 'Looking forward to moving in.', date: '28 Feb 2026', status: 'Pending' }],
    2: [{ id: 'app-201', name: 'Kevin Otieno', email: 'kevin@email.com', phone: '+254700000002', houseId: 202, occupation: 'Engineer', message: 'Ready to move immediately.',      date: '1 Mar 2026',  status: 'Pending' }],
    3: [], 4: [], 5: [], 6: [],
  },
  estatePhotos:  { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  housePhotos:   { 101: ['🏠','🛋️','🍳','🚿','🌿'], 102: ['🏡','🛋️','🍳','🛁','🏙️'], 103: ['🛏️','🛋️','🍳','🚿'], 104: ['🚪','🛋️','🌆'], 201: ['🏢','🛋️','💪','🌃'], 202: ['🏠','🛋️','🚿'], 203: ['🏙️','🛋️','🌆'], 301: ['🏠','🛋️','🍳'], 302: ['🛏️','🌿','🍳'] },
  inquiries:     { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  profilePhotos: {},

  currentUser:    null,
  activeEstateId: null,
  currentPage:    'home',
  activePanelId:  'ep-houses',
  sidebarOpen:    false,

  // Auth modal
  authModalOpen:     false,
  authTab:           'signin',
  authEmail:         '',
  authPassword:      '',
  authName:          '',
  authError:         '',
  signingIntoEstate: null,

  // Estate auth modal
  estateAuthOpen:    false,
  estateAuthEmail:   '',
  estateAuthPass:    '',
  estateAuthError:   '',
  detectedEstate:    null,
  showEstatePass:    false,

  // Directory filters
  dirFilter:    'all',
  dirLoc:       '',
  searchQuery:  '',

  // Gallery
  galleryOpen:     false,
  galleryHouseId:  null,
  galleryEstateId: null,
  galleryIdx:      0,

  // Modals
  listEstateOpen:    false,
  requestModalOpen:  false,
  resolveModalOpen:  false,
  applyModalOpen:    false,
  assignModalOpen:   false,
  profileModalOpen:  false,
  addHouseModalOpen: false,

  // Form fields
  reqIssue: '', reqCat: 'Plumbing', reqPriority: 'Medium',
  resolveNote: '', resolvingReqId: null,
  inqName: '', inqPhone: '', inqEmail: '', inqSubject: 'General Inquiry', inqMessage: '', inqSent: false,
  annTitle: '', annCat: 'Maintenance', annDate: '', annMsg: '',
  applyName: '', applyEmail: '', applyPhone: '', applyOccupation: '', applyMessage: '', applyHouseId: null, applyEstateId: null, applySent: false,
  assignAppId: null, assignUnit: '', assignEstateId: null,
  ahUnit: '', ahBlock: '', ahType: '1 Bedroom', ahFloor: '', ahPrice: '', ahFeats: '', ahDesc: '',
  leFields: { name:'', location:'', desc:'', units:'', year:'', titleDeed:'', amenities:'', mgrName:'', mgrEmail:'', mgrPhone:'', mgrPassword:'' },

  // Profile edit
  profileName: '', profileEmail: '', profilePhone: '', profileCurrPwd: '', profileNewPwd: '', profileConfPwd: '',
  profileError: '', profileSuccess: false,

  // Chatbot
  chatbotOpen: false,
  chatMessages: [],
  chatInput: '',

  // Mobile nav
  mobileNavOpen: false,
});

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */
function statusClass(s) {
  if (s === 'Available' || s === 'Paid' || s === 'Resolved' || s === 'Approved') return 'chip chip-green';
  if (s === 'Occupied'  || s === 'Pending') return 'chip chip-orange';
  if (s === 'Overdue'   || s === 'Rejected') return 'chip chip-orange';
  return 'chip chip-blue';
}

function formatKSh(n) { return 'KSh ' + Number(n).toLocaleString(); }

function availableCount(estateId) {
  return (store.houses[estateId] || []).filter(h => h.status === 'Available').length;
}

function totalAvailable() {
  return Object.values(store.houses).flat().filter(h => h.status === 'Available').length;
}

function getInitials(name) {
  return (name || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
}

/* ─────────────────────────────────────────────────────
   CHATBOT LOGIC
───────────────────────────────────────────────────── */
const CHAT_INTENTS = [
  { patterns: ['find','house','available','browse','rent'],    reply: 'Go to the <b>Estates</b> tab, click any estate, and browse available houses. You can filter by location or availability.' },
  { patterns: ['sign in','signin','login','my estate','access'], reply: 'Click <b>Sign In to My Estate</b> on the home page, or use the 🔑 button in any estate\'s sidebar. Enter your estate email and password.' },
  { patterns: ['inquiry','inquir','contact','question','viewing'], reply: 'Open any estate page and click <b>Send Inquiry</b> in the sidebar. Fill in your details and message — it goes directly to management.' },
  { patterns: ['request','complaint','report','issue','broken'], reply: 'Sign in as a tenant, go to your estate page, and select <b>My Requests</b> to submit a new maintenance request.' },
  { patterns: ['announcement','notice','news','update'],       reply: 'Announcements are posted by your estate management. Find them under <b>Announcements</b> in your estate sidebar after signing in.' },
  { patterns: ['rent','payment','lease','pay'],                reply: 'Signed-in tenants can view rent history and lease details under <b>Rent & Payments</b> and <b>My Lease</b> in the sidebar.' },
  { patterns: ['list','register estate','add estate','new estate'], reply: 'Go to the Estates directory and click <b>List Your Estate</b> in the sidebar. Fill in your estate details to get started.' },
  { patterns: ['communest','about','platform','what is'],      reply: 'Communest is a Kenya-based digital estate management platform founded in 2026. We connect tenants and estate managers in a single seamless platform.' },
  { patterns: ['hello','hi','hey','good'],                     reply: 'Hello! 👋 I\'m the Communest Assistant. Ask me anything about finding a home, signing in, submitting requests, or managing your estate.' },
];

function getChatReply(msg) {
  const lower = msg.toLowerCase();
  for (const intent of CHAT_INTENTS) {
    if (intent.patterns.some(p => lower.includes(p))) return intent.reply;
  }
  return 'I\'m not sure about that yet. Try asking about <b>finding a house</b>, <b>signing in</b>, <b>submitting a request</b>, or <b>listing your estate</b>.';
}

function sendChat() {
  const txt = store.chatInput.trim();
  if (!txt) return;
  store.chatMessages.push({ from: 'user', text: txt });
  store.chatInput = '';
  setTimeout(() => {
    store.chatMessages.push({ from: 'bot', text: getChatReply(txt) });
  }, 600);
}

function quickChat(txt) {
  store.chatMessages.push({ from: 'user', text: txt });
  setTimeout(() => {
    store.chatMessages.push({ from: 'bot', text: getChatReply(txt) });
  }, 600);
}

/* ─────────────────────────────────────────────────────
   AUTH LOGIC
───────────────────────────────────────────────────── */
function doLogin() {
  store.authError = '';
  const u = store.users.find(u => u.email.toLowerCase() === store.authEmail.toLowerCase() && u.password === store.authPassword);
  if (!u) { store.authError = 'Invalid email or password.'; return; }
  store.currentUser = u;
  store.authModalOpen = false;
  store.authEmail = ''; store.authPassword = '';
  if (u.estateId) {
    store.activeEstateId = u.estateId;
    store.currentPage = 'estate';
    store.activePanelId = u.role === 'management' ? 'ep-mgmt-overview' : 'ep-overview';
  }
}

function doSignup() {
  store.authError = '';
  const { authName: name, authEmail: email, authPassword: password } = store;
  if (!name || !email || !password) { store.authError = 'Please fill in all fields.'; return; }
  if (password.length < 5) { store.authError = 'Password must be at least 5 characters.'; return; }
  if (store.users.find(u => u.email.toLowerCase() === email.toLowerCase())) { store.authError = 'Email already registered. Please sign in.'; return; }
  const newUser = { id: 'ten-' + Date.now(), name, email: email.toLowerCase(), password, role: 'tenant', estateId: null, unit: null, rent: null, leaseStart: null, leaseEnd: null, phone: '' };
  store.users.push(newUser);
  store.currentUser = newUser;
  store.authModalOpen = false;
  store.authName = ''; store.authEmail = ''; store.authPassword = '';
  store.currentPage = 'estates';
}

function doEstateLogin() {
  store.estateAuthError = '';
  const u = store.users.find(u => u.email.toLowerCase() === store.estateAuthEmail.toLowerCase() && u.password === store.estateAuthPass);
  if (!u) { store.estateAuthError = 'Incorrect email or password.'; return; }
  store.currentUser = u;
  store.estateAuthOpen = false;
  store.estateAuthEmail = ''; store.estateAuthPass = '';
  if (u.estateId) {
    store.activeEstateId = u.estateId;
    store.currentPage = 'estate';
    store.activePanelId = u.role === 'management' ? 'ep-mgmt-overview' : 'ep-overview';
  } else {
    store.currentPage = 'estates';
  }
}

function onEstateEmailInput() {
  const email = store.estateAuthEmail.toLowerCase();
  const u = store.users.find(u => u.email.toLowerCase() === email);
  if (u && u.estateId) {
    store.detectedEstate = store.estates.find(e => e.id === u.estateId) || null;
    store.showEstatePass = true;
  } else {
    store.detectedEstate = null;
    store.showEstatePass = email.includes('@') && email.includes('.');
  }
}

function doSignout() {
  store.currentUser = null;
  store.currentPage = 'home';
  store.activeEstateId = null;
  store.activePanelId = 'ep-houses';
  store.sidebarOpen = false;
}

/* ─────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────── */
function showPage(page) {
  store.currentPage = page;
  store.mobileNavOpen = false;
  store.sidebarOpen = window.innerWidth > 768;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openEstatePage(estateId, panel) {
  store.activeEstateId = estateId;
  store.activePanelId = panel || 'ep-houses';
  store.currentPage = 'estate';
  store.sidebarOpen = window.innerWidth > 768;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectPanel(panelId) {
  store.activePanelId = panelId;
  if (window.innerWidth <= 768) store.sidebarOpen = false;
}

function toggleSidebar() {
  store.sidebarOpen = !store.sidebarOpen;
}

/* ─────────────────────────────────────────────────────
   DIRECTORY FILTERS
───────────────────────────────────────────────────── */
function setDirFilter(filter, loc) {
  store.dirFilter = filter;
  store.dirLoc = loc || '';
  if (window.innerWidth <= 768) store.sidebarOpen = false;
}

/* ─────────────────────────────────────────────────────
   REQUESTS
───────────────────────────────────────────────────── */
function submitRequest() {
  if (!store.currentUser || !store.activeEstateId) return;
  if (!store.reqIssue.trim()) { alert('Please describe the issue.'); return; }
  const eid = store.activeEstateId;
  if (!store.requests[eid]) store.requests[eid] = [];
  store.requests[eid].push({
    id: Date.now(),
    tenantId: store.currentUser.id,
    tenant: store.currentUser.name,
    unit: store.currentUser.unit,
    issue: store.reqIssue,
    category: store.reqCat,
    priority: store.reqPriority,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Pending',
    response: '',
  });
  store.reqIssue = ''; store.reqCat = 'Plumbing'; store.reqPriority = 'Medium';
  store.requestModalOpen = false;
}

function resolveRequest() {
  const eid = store.activeEstateId;
  const req = (store.requests[eid] || []).find(r => r.id === store.resolvingReqId);
  if (!req) return;
  req.status = 'Resolved';
  req.response = store.resolveNote;
  store.resolveNote = ''; store.resolvingReqId = null;
  store.resolveModalOpen = false;
}

/* ─────────────────────────────────────────────────────
   ANNOUNCEMENTS
───────────────────────────────────────────────────── */
function submitAnnouncement() {
  const eid = store.activeEstateId;
  if (!store.annTitle.trim() || !store.annMsg.trim()) { alert('Please fill in title and message.'); return; }
  if (!store.announcements[eid]) store.announcements[eid] = [];
  const estate = store.estates.find(e => e.id === eid);
  store.announcements[eid].unshift({
    id: Date.now(),
    title: store.annTitle,
    category: store.annCat,
    message: store.annMsg,
    date: store.annDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    by: estate ? estate.name + ' Management' : 'Management',
  });
  store.annTitle = ''; store.annMsg = ''; store.annDate = '';
}

/* ─────────────────────────────────────────────────────
   APPLICATIONS
───────────────────────────────────────────────────── */
function submitApplication() {
  const eid = store.applyEstateId;
  if (!store.applyName || !store.applyEmail || !store.applyPhone) { alert('Please fill in required fields.'); return; }
  if (!store.applications[eid]) store.applications[eid] = [];
  store.applications[eid].push({
    id: 'app-' + Date.now(),
    name: store.applyName, email: store.applyEmail, phone: store.applyPhone,
    houseId: store.applyHouseId, occupation: store.applyOccupation,
    message: store.applyMessage,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Pending',
  });
  store.applySent = true;
}

function approveApplication(appId, estateId) {
  const app = (store.applications[estateId] || []).find(a => a.id === appId);
  if (app) app.status = 'Approved';
}

function rejectApplication(appId, estateId) {
  const app = (store.applications[estateId] || []).find(a => a.id === appId);
  if (app) app.status = 'Rejected';
}

/* ─────────────────────────────────────────────────────
   HOUSES
───────────────────────────────────────────────────── */
function toggleHouseStatus(houseId, estateId) {
  const house = (store.houses[estateId] || []).find(h => h.id === houseId);
  if (house) house.status = house.status === 'Available' ? 'Occupied' : 'Available';
}

function submitNewHouse() {
  const eid = store.activeEstateId;
  if (!store.ahUnit || !store.ahPrice) { alert('Unit number and price are required.'); return; }
  const newId = Date.now();
  if (!store.houses[eid]) store.houses[eid] = [];
  store.houses[eid].push({
    id: newId, unit: store.ahUnit, block: store.ahBlock || 'Block A',
    type: store.ahType, price: Number(store.ahPrice), floor: store.ahFloor || 'Ground Floor',
    feats: store.ahFeats.split(',').map(f => f.trim()).filter(Boolean),
    status: 'Available', emoji: '🏠', desc: store.ahDesc,
  });
  store.housePhotos[newId] = ['🏠'];
  store.ahUnit = ''; store.ahBlock = ''; store.ahPrice = ''; store.ahFloor = ''; store.ahFeats = ''; store.ahDesc = '';
  store.addHouseModalOpen = false;
}

/* ─────────────────────────────────────────────────────
   INQUIRY
───────────────────────────────────────────────────── */
function submitInquiry() {
  const eid = store.activeEstateId;
  if (!store.inqName || !store.inqEmail || !store.inqMessage) { alert('Please fill in required fields.'); return; }
  if (!store.inquiries[eid]) store.inquiries[eid] = [];
  store.inquiries[eid].push({
    id: Date.now(), name: store.inqName, phone: store.inqPhone,
    email: store.inqEmail, subject: store.inqSubject, message: store.inqMessage,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'New',
  });
  store.inqSent = true;
}

/* ─────────────────────────────────────────────────────
   LIST ESTATE
───────────────────────────────────────────────────── */
function submitListEstate() {
  const f = store.leFields;
  if (!f.name || !f.location || !f.desc || !f.mgrName || !f.mgrEmail || !f.mgrPassword) { alert('Please fill in all required fields.'); return; }
  if (store.users.find(u => u.email.toLowerCase() === f.mgrEmail.toLowerCase())) { alert('That email is already registered.'); return; }
  const newId = store.estates.length + 1;
  store.estates.push({
    id: newId, name: f.name, emoji: '🏘️', location: f.location, desc: f.desc,
    amenities: f.amenities.split(',').map(a => a.trim()).filter(Boolean),
    phone: f.mgrPhone, email: f.mgrEmail, managedBy: f.mgrName,
    titleDeed: f.titleDeed || '',
  });
  store.houses[newId]        = [];
  store.requests[newId]      = [];
  store.announcements[newId] = [];
  store.applications[newId]  = [];
  store.estatePhotos[newId]  = [];
  store.inquiries[newId]     = [];
  const newMgr = { id: 'mgr-' + Date.now(), name: f.mgrName, email: f.mgrEmail.toLowerCase(), password: f.mgrPassword, role: 'management', estateId: newId, phone: f.mgrPhone };
  store.users.push(newMgr);
  store.currentUser = newMgr;
  Object.keys(f).forEach(k => f[k] = '');
  store.listEstateOpen = false;
  openEstatePage(newId, 'ep-mgmt-overview');
}

/* ─────────────────────────────────────────────────────
   PROFILE
───────────────────────────────────────────────────── */
function openProfileModal() {
  if (!store.currentUser) return;
  store.profileName    = store.currentUser.name;
  store.profileEmail   = store.currentUser.email;
  store.profilePhone   = store.currentUser.phone || '';
  store.profileCurrPwd = ''; store.profileNewPwd = ''; store.profileConfPwd = '';
  store.profileError   = ''; store.profileSuccess = false;
  store.profileModalOpen = true;
}

function saveProfile() {
  store.profileError = ''; store.profileSuccess = false;
  const { profileName: name, profileEmail: email, profilePhone: phone, profileCurrPwd, profileNewPwd, profileConfPwd } = store;
  if (!name)  { store.profileError = 'Name cannot be empty.'; return; }
  if (!email) { store.profileError = 'Email cannot be empty.'; return; }
  const emailTaken = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== store.currentUser.id);
  if (emailTaken) { store.profileError = 'Email already used by another account.'; return; }
  if (profileNewPwd || profileConfPwd || profileCurrPwd) {
    if (!profileCurrPwd) { store.profileError = 'Enter your current password.'; return; }
    if (profileCurrPwd !== store.currentUser.password) { store.profileError = 'Current password is incorrect.'; return; }
    if (!profileNewPwd) { store.profileError = 'Enter a new password.'; return; }
    if (profileNewPwd.length < 5) { store.profileError = 'Password must be at least 5 characters.'; return; }
    if (profileNewPwd !== profileConfPwd) { store.profileError = 'Passwords do not match.'; return; }
    store.currentUser.password = profileNewPwd;
    const u = store.users.find(u => u.id === store.currentUser.id);
    if (u) u.password = profileNewPwd;
  }
  store.currentUser.name  = name;
  store.currentUser.email = email.toLowerCase();
  store.currentUser.phone = phone;
  const u = store.users.find(u => u.id === store.currentUser.id);
  if (u) { u.name = name; u.email = email.toLowerCase(); u.phone = phone; }
  store.profileSuccess = true;
  store.profileCurrPwd = ''; store.profileNewPwd = ''; store.profileConfPwd = '';
  setTimeout(() => { store.profileSuccess = false; }, 3000);
}

function handleProfilePhoto(e) {
  const file = e.target.files[0];
  if (!file || !store.currentUser) return;
  const reader = new FileReader();
  reader.onload = ev => { store.profilePhotos[store.currentUser.id] = ev.target.result; };
  reader.readAsDataURL(file);
}

/* ─────────────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────────────── */
function openGallery(houseId, estateId) {
  store.galleryHouseId = houseId;
  store.galleryEstateId = estateId;
  store.galleryIdx = 0;
  store.galleryOpen = true;
}

function handlePhotoUpload(e) {
  const files = Array.from(e.target.files);
  const hid = store.galleryHouseId;
  if (!hid || !files.length) return;
  if (!store.housePhotos[hid]) store.housePhotos[hid] = [];
  store.housePhotos[hid] = store.housePhotos[hid].filter(p => typeof p === 'string' && (p.startsWith('data:') || p.startsWith('http')));
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      store.housePhotos[hid].push(ev.target.result);
      store.galleryIdx = store.housePhotos[hid].length - 1;
    };
    reader.readAsDataURL(file);
  });
}

function handleEstatePhotoUpload(e) {
  const files = Array.from(e.target.files);
  const eid = store.activeEstateId;
  if (!eid || !files.length) return;
  if (!store.estatePhotos[eid]) store.estatePhotos[eid] = [];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => store.estatePhotos[eid].push(ev.target.result);
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────────────────────────
   VUE APP
───────────────────────────────────────────────────── */
const App = {
  setup() {
    const s = store;

    // Computed: current estate object
    const currentEstate = computed(() => s.estates.find(e => e.id === s.activeEstateId));
    const currentHouses = computed(() => s.houses[s.activeEstateId] || []);
    const isTenant      = computed(() => s.currentUser?.role === 'tenant' && s.currentUser?.estateId === s.activeEstateId);
    const isManager     = computed(() => s.currentUser?.role === 'management' && s.currentUser?.estateId === s.activeEstateId);
    const currentAnnouncements = computed(() => s.announcements[s.activeEstateId] || []);
    const currentRequests      = computed(() => s.requests[s.activeEstateId] || []);
    const myRequests           = computed(() => currentRequests.value.filter(r => r.tenantId === s.currentUser?.id));
    const currentApplications  = computed(() => s.applications[s.activeEstateId] || []);
    const currentInquiries     = computed(() => s.inquiries[s.activeEstateId] || []);
    const myPayments           = computed(() => s.payments?.[s.currentUser?.id] || PAYMENTS_SEED[s.currentUser?.id] || []);
    const myHouse              = computed(() => currentHouses.value.find(h => h.unit === s.currentUser?.unit));
    const galleryPhotos        = computed(() => s.housePhotos[s.galleryHouseId] || ['🏠']);
    const profilePhoto         = computed(() => s.currentUser ? s.profilePhotos[s.currentUser.id] : null);
    const navInitials          = computed(() => s.currentUser ? getInitials(s.currentUser.name) : '');
    const totalAvail           = computed(() => totalAvailable());

    const filteredEstates = computed(() => {
      let list = s.estates;
      const q = s.searchQuery.toLowerCase();
      if (q) list = list.filter(e => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.amenities.some(a => a.toLowerCase().includes(q)));
      if (s.dirFilter === 'available') list = list.filter(e => availableCount(e.id) > 0);
      if (s.dirFilter === 'new') list = list.slice(-3);
      if (s.dirLoc) list = list.filter(e => e.location.toLowerCase().includes(s.dirLoc.toLowerCase()));
      return list;
    });

    // Auto-open sidebar on desktop when page changes
    watch(() => s.currentPage, () => {
      s.sidebarOpen = window.innerWidth > 768;
    });

    onMounted(() => {
      s.sidebarOpen = window.innerWidth > 768;
    });

    return {
      s, currentEstate, currentHouses, isTenant, isManager,
      currentAnnouncements, currentRequests, myRequests, currentApplications,
      currentInquiries, myPayments, myHouse, galleryPhotos, profilePhoto,
      navInitials, totalAvail, filteredEstates,
      statusClass, formatKSh, availableCount, getInitials,
      showPage, openEstatePage, selectPanel, toggleSidebar, setDirFilter,
      doLogin, doSignup, doSignout, doEstateLogin, onEstateEmailInput,
      submitRequest, resolveRequest, submitAnnouncement, submitApplication,
      approveApplication, rejectApplication, toggleHouseStatus, submitNewHouse,
      submitInquiry, submitListEstate, openProfileModal, saveProfile,
      handleProfilePhoto, openGallery, handlePhotoUpload, handleEstatePhotoUpload,
      sendChat, quickChat, openProfileModal,
    };
  },

  template: `
<div>
  <!-- ═══════════ NAVBAR ═══════════ -->
  <nav id="navbar">
    <div class="nav-container">
      <a class="nav-logo" href="#" @click.prevent="showPage('home')">
        <div class="logo-mark"></div>
        <strong>Communest</strong>
      </a>
      <div class="nav-links" :class="{ 'mobile-open': s.mobileNavOpen }">
        <a class="nav-link" :class="{ active: s.currentPage==='home' }"   @click.prevent="showPage('home')"   href="#">Home</a>
        <a class="nav-link" :class="{ active: s.currentPage==='estates' }"@click.prevent="showPage('estates')"href="#">Estates</a>
        <a class="nav-link" :class="{ active: s.currentPage==='about' }"  @click.prevent="showPage('about')"  href="#">About</a>
      </div>
      <div class="nav-actions">
        <button v-if="!s.currentUser" class="btn btn-sm nav-cta" @click="s.authModalOpen=true; s.authTab='signup'">Register</button>
        <button v-else class="btn btn-sm nav-cta" style="border-radius:50%;width:36px;height:36px;padding:0;overflow:hidden;" @click="openProfileModal()">
          <img v-if="profilePhoto" :src="profilePhoto" style="width:36px;height:36px;object-fit:cover;border-radius:50%;display:block;" />
          <span v-else>{{ navInitials }}</span>
        </button>
        <button class="hamburger" id="hamburger" @click="s.mobileNavOpen=!s.mobileNavOpen"><span></span><span></span><span></span></button>
      </div>
    </div>
  </nav>

  <!-- ═══════════ HOME PAGE ═══════════ -->
  <section v-show="s.currentPage==='home'" class="page active">
    <div class="hero">
      <div class="hero-shapes"><div class="hs hs-1"></div><div class="hs hs-2"></div><div class="hs hs-3"></div></div>
      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-badge"><div class="badge-pulse"></div> Kenya's Estate Platform</div>
          <h1>Find Your <em>Perfect Home</em> in Any Estate</h1>
          <p>Browse listed estates, view available houses, and apply online. Once you're a resident, access your estate's private dashboard.</p>
          <div class="hero-btns">
            <button class="btn btn-primary btn-lg" @click="showPage('estates')">Browse Estates →</button>
            <button class="btn btn-outline btn-lg" @click="s.estateAuthOpen=true">Sign In to My Estate</button>
          </div>
          <div class="hero-stats">
            <div class="hstat"><span class="hstat-num">{{ s.estates.length }}</span><span class="hstat-lbl">Listed Estates</span></div>
            <div class="hstat"><span class="hstat-num">{{ totalAvail }}</span><span class="hstat-lbl">Available Houses</span></div>
            <div class="hstat"><span class="hstat-num">100%</span><span class="hstat-lbl">Free to Browse</span></div>
          </div>
        </div>
        <div class="hero-cards">
          <div class="fcard fcard-1"><div class="fcard-row"><div class="fcard-icon">🏘️</div><div class="fcard-info"><b>Sunrise Gardens</b><span>Karen, Nairobi · 96 units</span></div></div><p>2 houses available from KSh 9,500/mo</p></div>
          <div class="fcard fcard-2"><div class="fcard-row"><div class="fcard-icon">🔧</div><div class="fcard-info"><b>Submit Requests</b><span>Direct to your estate management</span></div></div><p>Complaints reach your manager instantly</p></div>
          <div class="fcard fcard-3"><div class="fcard-row"><div class="fcard-icon">📢</div><div class="fcard-info"><b>Estate Announcements</b><span>Water supply update · 4 Mar 2026</span></div></div><p>Stay up to date with your estate</p></div>
        </div>
      </div>
    </div>
    <div class="features-band">
      <div class="features-band-inner">
        <div class="feat-item"><span>🏙️</span><div><h4>Browse Estates</h4><p>Explore listed estates with amenities, photos, and available units.</p></div></div>
        <div class="feat-item"><span>🏠</span><div><h4>View & Apply</h4><p>See all houses with real photos uploaded by management.</p></div></div>
        <div class="feat-item"><span>💬</span><div><h4>Send Inquiries</h4><p>Ask questions or request a viewing — direct to management.</p></div></div>
        <div class="feat-item"><span>📢</span><div><h4>Stay Updated</h4><p>Management posts announcements to their estate's tenants.</p></div></div>
      </div>
    </div>
    <div class="wrap">
      <div class="pg-hdr">
        <div class="pg-tag">Featured Estates</div>
        <h2>Find Your Next Home</h2>
        <p>A selection of estates on Communest. Click any estate to explore its houses.</p>
      </div>
      <div class="houses-grid">
        <div v-for="estate in s.estates.slice(0,3)" :key="estate.id" class="house-card estate-dir-card" style="cursor:pointer" @click="openEstatePage(estate.id)">
          <div class="hc-top"><div class="hc-emoji">{{ estate.emoji }}</div><div class="hc-badge" :class="availableCount(estate.id)>0?'hc-badge-avail':'hc-badge-occ'">{{ availableCount(estate.id) > 0 ? availableCount(estate.id)+' available' : 'Fully occupied' }}</div></div>
          <div class="hc-body"><div class="hc-name">{{ estate.name }}</div><div class="hc-loc">📍 {{ estate.location }}</div><p class="hc-desc">{{ estate.desc }}</p></div>
          <div class="hc-feats"><span v-for="a in estate.amenities.slice(0,3)" :key="a" class="hc-feat">{{ a }}</span></div>
          <button class="btn btn-outline" style="width:100%;margin-top:14px">Explore Estate →</button>
        </div>
      </div>
      <div style="text-align:center;margin-top:36px"><button class="btn btn-outline btn-lg" @click="showPage('estates')">View All Estates →</button></div>
    </div>
    <footer class="site-footer">© 2026 Communest</footer>
  </section>

  <!-- ═══════════ ESTATES DIRECTORY ═══════════ -->
  <section v-show="s.currentPage==='estates'" class="page page-dash active">
    <div class="dash-layout" :class="{ 'sb-open': s.sidebarOpen }">
      <aside class="dash-sidebar">
        <!-- Signed out -->
        <div v-if="!s.currentUser">
          <div class="sb-brand"><div class="sb-logo">Estates</div><div class="sb-role">Directory</div></div>
          <nav class="sb-nav">
            <span class="sb-lbl">BROWSE</span>
            <button class="si" :class="{ active: s.dirFilter==='all' && !s.dirLoc }" @click="setDirFilter('all','')">🏙️ All Estates</button>
            <button class="si" :class="{ active: s.dirFilter==='available' }" @click="setDirFilter('available','')">✅ Has Availability</button>
            <button class="si" :class="{ active: s.dirFilter==='new' }" @click="setDirFilter('new','')">🆕 Newly Listed</button>
            <span class="sb-lbl">BY LOCATION</span>
            <button v-for="loc in ['Karen','Kilimani','Westlands','Ngong Road','Lavington','Thika Road']" :key="loc" class="si" :class="{ active: s.dirLoc===loc }" @click="setDirFilter('',loc)">📍 {{ loc }}</button>
            <span class="sb-lbl">MANAGE</span>
            <button class="si" @click="s.listEstateOpen=true">➕ List Your Estate</button>
            <button class="si si-back" @click="showPage('home')" style="margin-top:8px">← Home</button>
          </nav>
        </div>
        <!-- Signed in -->
        <div v-else>
          <div class="sb-brand">
            <div class="sb-logo">{{ s.estates.find(e=>e.id===s.currentUser.estateId)?.name || 'My Account' }}</div>
            <div class="sb-role">{{ s.currentUser.role==='management' ? 'Management' : s.currentUser.unit ? 'Tenant · Unit '+s.currentUser.unit : 'Tenant' }}</div>
          </div>
          <nav class="sb-nav">
            <template v-if="s.currentUser.estateId">
              <span class="sb-lbl">EXPLORE</span>
              <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-houses')">🏠 Available Houses</button>
              <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-about')">ℹ️ About This Estate</button>
              <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-inquire')">💬 Send Inquiry</button>
              <template v-if="s.currentUser.role==='management'">
                <span class="sb-lbl">MANAGEMENT</span>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-overview')">📊 Overview</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-requests')">🔧 Tenant Requests</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-announcements')">📢 Announcements</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-tenants')">👥 My Tenants</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-applications')">📋 Applications</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-houses')">🏠 Manage Houses</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-photos')">🖼️ Estate Photos</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-mgmt-inquiries')">💬 Inquiries</button>
              </template>
              <template v-else>
                <span class="sb-lbl">MY ESTATE</span>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-overview')">📊 Overview</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-requests')">🔧 My Requests</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-announcements')">📢 Announcements</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-rent')">💳 Rent & Payments</button>
                <button class="si" @click="openEstatePage(s.currentUser.estateId,'ep-lease')">📄 My Lease</button>
              </template>
            </template>
            <span class="sb-lbl">ACCOUNT</span>
            <button class="si" @click="openProfileModal()" style="opacity:1">👤 {{ s.currentUser.name }}</button>
            <button class="si si-back" @click="doSignout()">← Sign Out</button>
          </nav>
        </div>
      </aside>

      <div class="dash-main">
        <div class="dp-hdr" style="margin-bottom:20px">
          <div style="display:flex;align-items:center;gap:12px">
            <button class="sb-toggle-btn" @click="toggleSidebar()">☰</button>
            <div style="flex:1">
              <h2>{{ s.dirLoc ? s.dirLoc+' Estates' : s.dirFilter==='available'?'Estates with Availability':s.dirFilter==='new'?'Newly Listed':'All Listed Estates' }}</h2>
              <div style="font-size:.83rem;color:var(--text-3);margin-top:3px">Browse and click any estate to explore</div>
            </div>
          </div>
        </div>
        <!-- Search -->
        <div class="estate-search-bar">
          <div class="estate-search-inner">
            <svg class="estate-search-icon" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input class="estate-search-input" v-model="s.searchQuery" placeholder="Search by estate name or location…" autocomplete="off" />
            <button v-if="s.searchQuery" class="estate-search-clear" @click="s.searchQuery=''">
              <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div v-if="s.searchQuery" class="estate-search-meta" style="display:block">{{ filteredEstates.length }} estate{{ filteredEstates.length!==1?'s':'' }} found</div>
        </div>
        <!-- Grid -->
        <div class="houses-grid">
          <div v-for="estate in filteredEstates" :key="estate.id" class="house-card estate-dir-card" style="cursor:pointer" @click="openEstatePage(estate.id)">
            <div class="hc-top"><div class="hc-emoji">{{ estate.emoji }}</div><div class="hc-badge" :class="availableCount(estate.id)>0?'hc-badge-avail':'hc-badge-occ'">{{ availableCount(estate.id) > 0 ? availableCount(estate.id)+' available' : 'Fully occupied' }}</div></div>
            <div class="hc-body"><div class="hc-name">{{ estate.name }}</div><div class="hc-loc">📍 {{ estate.location }}</div><p class="hc-desc">{{ estate.desc }}</p></div>
            <div class="hc-feats"><span v-for="a in estate.amenities.slice(0,3)" :key="a" class="hc-feat">{{ a }}</span><span v-if="estate.amenities.length>3" class="hc-feat">+{{ estate.amenities.length-3 }} more</span></div>
            <button class="btn btn-outline" style="width:100%;margin-top:14px">Explore Estate →</button>
          </div>
          <div v-if="filteredEstates.length===0" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-3)">
            <div style="font-size:3rem;margin-bottom:16px">🔍</div>
            <h3>No estates found</h3>
            <p>Try a different search term or filter.</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="s.sidebarOpen" class="sb-overlay" @click="s.sidebarOpen=false"></div>
    <footer class="site-footer">© 2026 Communest</footer>
  </section>

  <!-- ═══════════ ESTATE PAGE ═══════════ -->
  <section v-show="s.currentPage==='estate' && currentEstate" class="page page-dash active">
    <div class="dash-layout" :class="{ 'sb-open': s.sidebarOpen }">
      <aside class="dash-sidebar">
        <div class="sb-brand">
          <div class="sb-logo">{{ currentEstate?.name }}</div>
          <div class="sb-role">{{ isManager ? 'Management' : isTenant ? 'Tenant · Unit '+s.currentUser?.unit : 'Public View' }}</div>
        </div>
        <nav class="sb-nav">
          <span class="sb-lbl">EXPLORE</span>
          <button class="si" :class="{active:s.activePanelId==='ep-houses'}"  @click="selectPanel('ep-houses')">🏠 Available Houses</button>
          <button class="si" :class="{active:s.activePanelId==='ep-about'}"   @click="selectPanel('ep-about')">ℹ️ About This Estate</button>
          <button class="si" :class="{active:s.activePanelId==='ep-inquire'}" @click="selectPanel('ep-inquire')">💬 Send Inquiry</button>

          <template v-if="isTenant">
            <span class="sb-lbl">MY ESTATE</span>
            <button class="si" :class="{active:s.activePanelId==='ep-overview'}"      @click="selectPanel('ep-overview')">📊 Overview</button>
            <button class="si" :class="{active:s.activePanelId==='ep-requests'}"      @click="selectPanel('ep-requests')">🔧 My Requests</button>
            <button class="si" :class="{active:s.activePanelId==='ep-announcements'}" @click="selectPanel('ep-announcements')">📢 Announcements</button>
            <button class="si" :class="{active:s.activePanelId==='ep-rent'}"          @click="selectPanel('ep-rent')">💳 Rent & Payments</button>
            <button class="si" :class="{active:s.activePanelId==='ep-lease'}"         @click="selectPanel('ep-lease')">📄 My Lease</button>
          </template>

          <template v-if="isManager">
            <span class="sb-lbl">MANAGEMENT</span>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-overview'}"       @click="selectPanel('ep-mgmt-overview')">📊 Overview</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-requests'}"       @click="selectPanel('ep-mgmt-requests')">🔧 Tenant Requests</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-announcements'}"  @click="selectPanel('ep-mgmt-announcements')">📢 Announcements</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-tenants'}"        @click="selectPanel('ep-mgmt-tenants')">👥 My Tenants</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-applications'}"   @click="selectPanel('ep-mgmt-applications')">📋 Applications</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-houses'}"         @click="selectPanel('ep-mgmt-houses')">🏠 Manage Houses</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-photos'}"         @click="selectPanel('ep-mgmt-photos')">🖼️ Estate Photos</button>
            <button class="si" :class="{active:s.activePanelId==='ep-mgmt-inquiries'}"      @click="selectPanel('ep-mgmt-inquiries')">💬 Inquiries</button>
          </template>

          <span class="sb-lbl">ACCOUNT</span>
          <div v-if="!s.currentUser">
            <button class="si" @click="s.estateAuthOpen=true">🔑 Sign In to My Estate</button>
          </div>
          <div v-else>
            <button class="si" @click="openProfileModal()" style="opacity:1">👤 {{ s.currentUser.name.split(' ')[0] }}</button>
            <button class="si si-back" @click="doSignout()">← Sign Out</button>
          </div>
          <button class="si si-back" @click="showPage('estates')" style="margin-top:8px">← Back to Estates</button>
        </nav>
      </aside>

      <div class="dash-main">

        <!-- AVAILABLE HOUSES -->
        <div v-show="s.activePanelId==='ep-houses'" class="dp active">
          <div class="dp-hdr">
            <div style="display:flex;align-items:center;gap:12px">
              <button class="sb-toggle-btn" @click="toggleSidebar()">☰</button>
              <div><h2>Available Houses</h2><div style="font-size:.83rem;color:var(--text-3);margin-top:3px">{{ currentEstate?.name }}</div></div>
            </div>
          </div>
          <div class="houses-grid">
            <div v-for="house in currentHouses" :key="house.id" class="house-card">
              <div class="hc-top">
                <div class="hc-emoji" style="cursor:pointer" @click="openGallery(house.id, s.activeEstateId)">{{ house.emoji }}</div>
                <div class="hc-badge" :class="house.status==='Available'?'hc-badge-avail':'hc-badge-occ'">{{ house.status }}</div>
              </div>
              <div class="hc-body">
                <div class="hc-name">Unit {{ house.unit }} · {{ house.type }}</div>
                <div class="hc-loc">{{ house.block }} · {{ house.floor }}</div>
                <p class="hc-desc">{{ house.desc }}</p>
                <div class="hc-price">{{ formatKSh(house.price) }}<span>/month</span></div>
              </div>
              <div class="hc-feats"><span v-for="f in house.feats" :key="f" class="hc-feat">{{ f }}</span></div>
              <div style="display:flex;gap:8px;margin-top:14px">
                <button class="btn btn-outline btn-sm" @click="openGallery(house.id, s.activeEstateId)">📷 Photos</button>
                <button v-if="house.status==='Available'" class="btn btn-primary btn-sm" style="flex:1" @click="s.applyHouseId=house.id;s.applyEstateId=s.activeEstateId;s.applySent=false;s.applyModalOpen=true">Apply →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ABOUT ESTATE -->
        <div v-show="s.activePanelId==='ep-about'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>About This Estate</h2></div></div>
          <div v-if="currentEstate">
            <div class="estate-about-hero" style="background:linear-gradient(135deg,#0A1828,#0D1E2E);border-radius:16px;padding:32px;margin-bottom:24px">
              <div style="font-size:4rem;margin-bottom:12px">{{ currentEstate.emoji }}</div>
              <h3 style="margin-bottom:6px">{{ currentEstate.name }}</h3>
              <div style="color:var(--text-3);margin-bottom:16px">📍 {{ currentEstate.location }}</div>
              <p style="color:var(--text-2);line-height:1.75">{{ currentEstate.desc }}</p>
            </div>
            <div class="form-row" style="margin-bottom:24px">
              <div class="contact-form-card"><b style="color:var(--sky)">📞 Phone</b><div style="margin-top:6px">{{ currentEstate.phone }}</div></div>
              <div class="contact-form-card"><b style="color:var(--sky)">✉️ Email</b><div style="margin-top:6px">{{ currentEstate.email }}</div></div>
            </div>
            <div><div class="dp-section-lbl">Amenities</div><div class="chip-row" style="margin-top:10px"><span v-for="a in currentEstate.amenities" :key="a" class="chip chip-blue">{{ a }}</span></div></div>
            <div v-if="currentEstate.titleDeed" style="margin-top:20px"><div class="dp-section-lbl">Title Deed Reference</div><div style="margin-top:6px;color:var(--text-2)">{{ currentEstate.titleDeed }}</div></div>
          </div>
        </div>

        <!-- SEND INQUIRY -->
        <div v-show="s.activePanelId==='ep-inquire'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Send an Inquiry</h2></div></div>
          <div v-if="!s.inqSent" class="contact-form-card" style="max-width:560px">
            <div class="form-row"><div class="form-group"><label>Your Name</label><input class="input" v-model="s.inqName" placeholder="Full name" /></div><div class="form-group"><label>Phone</label><input class="input" v-model="s.inqPhone" placeholder="+254 7XX XXX XXX" /></div></div>
            <div class="form-group"><label>Email</label><input class="input" v-model="s.inqEmail" type="email" placeholder="your@email.com" /></div>
            <div class="form-group"><label>Subject</label><select class="select" v-model="s.inqSubject"><option>General Inquiry</option><option>Request a Viewing</option><option>Ask About Availability</option><option>Ask About Rent / Pricing</option><option>Other</option></select></div>
            <div class="form-group"><label>Message</label><textarea class="textarea" v-model="s.inqMessage" rows="5" placeholder="Write your message here…"></textarea></div>
            <button class="btn btn-primary btn-full" @click="submitInquiry()">Send to Management →</button>
          </div>
          <div v-else class="inq-success"><span>✅</span><div><strong>Inquiry sent!</strong><p>The management team will respond within 24 hours.</p></div></div>
        </div>

        <!-- TENANT: OVERVIEW -->
        <div v-show="s.activePanelId==='ep-overview'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><div><h2>Welcome back, {{ s.currentUser?.name?.split(' ')[0] }} 👋</h2><div style="font-size:.83rem;color:var(--text-3);margin-top:3px">{{ currentEstate?.name }} · Unit {{ s.currentUser?.unit }}</div></div></div><span class="chip chip-green">Active Tenant</span></div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">🏠</div><div class="stat-body"><div class="stat-num">{{ myRequests.filter(r=>r.status==='Pending').length }}</div><div class="stat-lbl">Open Requests</div></div></div>
            <div class="stat-card"><div class="stat-icon">📢</div><div class="stat-body"><div class="stat-num">{{ currentAnnouncements.length }}</div><div class="stat-lbl">Announcements</div></div></div>
            <div class="stat-card"><div class="stat-icon">💳</div><div class="stat-body"><div class="stat-num">{{ formatKSh(s.currentUser?.rent||0) }}</div><div class="stat-lbl">Monthly Rent</div></div></div>
          </div>
          <div class="dp-section-lbl" style="margin-top:24px">Latest Announcements</div>
          <div class="ann-list">
            <div v-for="ann in currentAnnouncements.slice(0,3)" :key="ann.id" class="ann-item">
              <div class="ann-hdr"><span class="chip chip-blue">{{ ann.category }}</span><span style="font-size:.75rem;color:var(--text-3)">{{ ann.date }}</span></div>
              <div class="ann-title">{{ ann.title }}</div>
              <p class="ann-body">{{ ann.message }}</p>
            </div>
            <div v-if="currentAnnouncements.length===0" style="color:var(--text-3);text-align:center;padding:24px">No announcements yet.</div>
          </div>
        </div>

        <!-- TENANT: REQUESTS -->
        <div v-show="s.activePanelId==='ep-requests'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>My Requests</h2></div><button class="btn btn-primary btn-sm" @click="s.requestModalOpen=true">+ New Request</button></div>
          <div class="table-wrap"><table><thead><tr><th>#</th><th>Issue</th><th>Category</th><th>Priority</th><th>Date</th><th>Status</th><th>Response</th></tr></thead><tbody>
            <tr v-for="r in myRequests" :key="r.id"><td>{{ r.id }}</td><td>{{ r.issue }}</td><td>{{ r.category }}</td><td>{{ r.priority }}</td><td>{{ r.date }}</td><td><span :class="statusClass(r.status)">{{ r.status }}</span></td><td style="font-size:.82rem;color:var(--text-3)">{{ r.response || '—' }}</td></tr>
            <tr v-if="myRequests.length===0"><td colspan="7" style="text-align:center;color:var(--text-3);padding:24px">No requests submitted yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- TENANT: ANNOUNCEMENTS -->
        <div v-show="s.activePanelId==='ep-announcements'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Estate Announcements</h2></div></div>
          <div class="ann-list">
            <div v-for="ann in currentAnnouncements" :key="ann.id" class="ann-item">
              <div class="ann-hdr"><span class="chip chip-blue">{{ ann.category }}</span><span style="font-size:.75rem;color:var(--text-3)">{{ ann.date }}</span></div>
              <div class="ann-title">{{ ann.title }}</div><p class="ann-body">{{ ann.message }}</p>
            </div>
            <div v-if="currentAnnouncements.length===0" style="color:var(--text-3);text-align:center;padding:24px">No announcements yet.</div>
          </div>
        </div>

        <!-- TENANT: RENT -->
        <div v-show="s.activePanelId==='ep-rent'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Rent & Payments 💳</h2></div></div>
          <div class="rent-summary-card" style="margin-bottom:24px">
            <div class="rent-amount">{{ formatKSh(s.currentUser?.rent||0) }}<span>/month</span></div>
            <div class="rent-detail">Unit {{ s.currentUser?.unit }} · {{ currentEstate?.name }}</div>
          </div>
          <div class="dp-section-lbl">Payment History</div>
          <div class="table-wrap"><table><thead><tr><th>Month</th><th>Amount</th><th>Due Date</th><th>Paid On</th><th>Status</th></tr></thead><tbody>
            <tr v-for="p in myPayments" :key="p.month"><td>{{ p.month }}</td><td>{{ formatKSh(p.amount) }}</td><td>{{ p.due }}</td><td>{{ p.paid||'—' }}</td><td><span :class="statusClass(p.status)">{{ p.status }}</span></td></tr>
            <tr v-if="myPayments.length===0"><td colspan="5" style="text-align:center;color:var(--text-3);padding:24px">No payment records yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- TENANT: LEASE -->
        <div v-show="s.activePanelId==='ep-lease'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>My Lease 📄</h2></div></div>
          <div v-if="myHouse" class="lease-card">
            <div class="lease-unit">{{ myHouse.type }} — Unit {{ s.currentUser?.unit }}</div>
            <table style="width:100%;margin-top:16px"><tbody>
              <tr><td class="lease-lbl">Tenant</td><td>{{ s.currentUser?.name }}</td></tr>
              <tr><td class="lease-lbl">Unit</td><td>{{ s.currentUser?.unit }}</td></tr>
              <tr><td class="lease-lbl">Estate</td><td>{{ currentEstate?.name }}</td></tr>
              <tr><td class="lease-lbl">Monthly Rent</td><td>{{ formatKSh(s.currentUser?.rent) }}</td></tr>
              <tr><td class="lease-lbl">Lease Start</td><td>{{ s.currentUser?.leaseStart }}</td></tr>
              <tr><td class="lease-lbl">Lease End</td><td>{{ s.currentUser?.leaseEnd }}</td></tr>
            </tbody></table>
          </div>
          <div v-else style="color:var(--text-3);text-align:center;padding:40px">No lease information found.</div>
        </div>

        <!-- MANAGEMENT: OVERVIEW -->
        <div v-show="s.activePanelId==='ep-mgmt-overview'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><div><h2>Management Overview</h2><div style="font-size:.83rem;color:var(--text-3);margin-top:3px">{{ currentEstate?.name }}</div></div></div></div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">🏠</div><div class="stat-body"><div class="stat-num">{{ currentHouses.filter(h=>h.status==='Available').length }}</div><div class="stat-lbl">Available Units</div></div></div>
            <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-body"><div class="stat-num">{{ s.users.filter(u=>u.role==='tenant'&&u.estateId===s.activeEstateId).length }}</div><div class="stat-lbl">Tenants</div></div></div>
            <div class="stat-card"><div class="stat-icon">🔧</div><div class="stat-body"><div class="stat-num">{{ currentRequests.filter(r=>r.status==='Pending').length }}</div><div class="stat-lbl">Open Requests</div></div></div>
            <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-body"><div class="stat-num">{{ currentApplications.filter(a=>a.status==='Pending').length }}</div><div class="stat-lbl">Pending Applications</div></div></div>
          </div>
          <div class="dp-section-lbl" style="margin-top:24px">Recent Requests</div>
          <div class="table-wrap"><table><thead><tr><th>Tenant</th><th>Unit</th><th>Issue</th><th>Status</th></tr></thead><tbody>
            <tr v-for="r in currentRequests.slice(0,5)" :key="r.id"><td>{{ r.tenant }}</td><td>{{ r.unit }}</td><td>{{ r.issue }}</td><td><span :class="statusClass(r.status)">{{ r.status }}</span></td></tr>
            <tr v-if="currentRequests.length===0"><td colspan="4" style="text-align:center;color:var(--text-3);padding:24px">No requests yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- MANAGEMENT: REQUESTS -->
        <div v-show="s.activePanelId==='ep-mgmt-requests'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Tenant Requests</h2></div></div>
          <div class="table-wrap"><table><thead><tr><th>#</th><th>Tenant</th><th>Unit</th><th>Issue</th><th>Category</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>
            <tr v-for="r in currentRequests" :key="r.id">
              <td>{{ r.id }}</td><td>{{ r.tenant }}</td><td>{{ r.unit }}</td><td>{{ r.issue }}</td><td>{{ r.category }}</td><td>{{ r.date }}</td>
              <td><span :class="statusClass(r.status)">{{ r.status }}</span></td>
              <td><button v-if="r.status==='Pending'" class="btn btn-primary btn-sm" @click="s.resolvingReqId=r.id;s.resolveNote='';s.resolveModalOpen=true">Resolve</button></td>
            </tr>
            <tr v-if="currentRequests.length===0"><td colspan="8" style="text-align:center;color:var(--text-3);padding:24px">No requests yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- MANAGEMENT: ANNOUNCEMENTS -->
        <div v-show="s.activePanelId==='ep-mgmt-announcements'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Post Announcement</h2></div></div>
          <div class="contact-form-card" style="max-width:600px;margin-bottom:32px">
            <div class="form-group"><label>Title</label><input class="input" v-model="s.annTitle" placeholder="e.g. Water supply interruption on 6th March" /></div>
            <div class="form-row">
              <div class="form-group"><label>Category</label><select class="select" v-model="s.annCat"><option>Maintenance</option><option>Notice</option><option>Event</option><option>Security</option><option>Urgent</option></select></div>
              <div class="form-group"><label>Date</label><input class="input" v-model="s.annDate" type="date" /></div>
            </div>
            <div class="form-group"><label>Message</label><textarea class="textarea" v-model="s.annMsg" rows="5" placeholder="Full announcement details…"></textarea></div>
            <button class="btn btn-primary" @click="submitAnnouncement()">Post to All Tenants →</button>
          </div>
          <div class="dp-section-lbl">Previously Posted</div>
          <div class="ann-list">
            <div v-for="ann in currentAnnouncements" :key="ann.id" class="ann-item">
              <div class="ann-hdr"><span class="chip chip-blue">{{ ann.category }}</span><span style="font-size:.75rem;color:var(--text-3)">{{ ann.date }}</span></div>
              <div class="ann-title">{{ ann.title }}</div><p class="ann-body">{{ ann.message }}</p>
            </div>
          </div>
        </div>

        <!-- MANAGEMENT: TENANTS -->
        <div v-show="s.activePanelId==='ep-mgmt-tenants'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>My Tenants</h2></div><span class="chip chip-blue">{{ s.users.filter(u=>u.role==='tenant'&&u.estateId===s.activeEstateId).length }} tenants</span></div>
          <div class="table-wrap"><table><thead><tr><th>Name</th><th>Unit</th><th>Email</th><th>Phone</th><th>Rent/mo</th><th>Lease End</th></tr></thead><tbody>
            <tr v-for="t in s.users.filter(u=>u.role==='tenant'&&u.estateId===s.activeEstateId)" :key="t.id">
              <td>{{ t.name }}</td><td>{{ t.unit }}</td><td>{{ t.email }}</td><td>{{ t.phone||'—' }}</td><td>{{ t.rent?formatKSh(t.rent):'—' }}</td><td>{{ t.leaseEnd||'—' }}</td>
            </tr>
            <tr v-if="s.users.filter(u=>u.role==='tenant'&&u.estateId===s.activeEstateId).length===0"><td colspan="6" style="text-align:center;color:var(--text-3);padding:24px">No tenants yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- MANAGEMENT: APPLICATIONS -->
        <div v-show="s.activePanelId==='ep-mgmt-applications'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Rental Applications</h2></div></div>
          <div class="table-wrap"><table><thead><tr><th>Applicant</th><th>Email</th><th>Phone</th><th>Unit</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>
            <tr v-for="app in currentApplications" :key="app.id">
              <td>{{ app.name }}</td><td>{{ app.email }}</td><td>{{ app.phone }}</td>
              <td>{{ (s.houses[s.activeEstateId]||[]).find(h=>h.id===app.houseId)?.unit || '—' }}</td>
              <td>{{ app.date }}</td><td><span :class="statusClass(app.status)">{{ app.status }}</span></td>
              <td v-if="app.status==='Pending'" style="display:flex;gap:6px">
                <button class="btn btn-primary btn-sm" @click="approveApplication(app.id,s.activeEstateId)">Approve</button>
                <button class="btn btn-outline btn-sm" @click="rejectApplication(app.id,s.activeEstateId)">Reject</button>
              </td>
              <td v-else>—</td>
            </tr>
            <tr v-if="currentApplications.length===0"><td colspan="7" style="text-align:center;color:var(--text-3);padding:24px">No applications yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- MANAGEMENT: HOUSES -->
        <div v-show="s.activePanelId==='ep-mgmt-houses'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Manage Houses</h2></div><button class="btn btn-primary btn-sm" @click="s.addHouseModalOpen=true">+ Add House</button></div>
          <div class="table-wrap"><table><thead><tr><th>Unit</th><th>Type</th><th>Rent</th><th>Block</th><th>Floor</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            <tr v-for="h in currentHouses" :key="h.id">
              <td>{{ h.unit }}</td><td>{{ h.type }}</td><td>{{ formatKSh(h.price) }}</td><td>{{ h.block }}</td><td>{{ h.floor }}</td>
              <td><span :class="statusClass(h.status)">{{ h.status }}</span></td>
              <td style="display:flex;gap:6px">
                <button class="btn btn-outline btn-sm" @click="openGallery(h.id,s.activeEstateId)">📷</button>
                <button class="btn btn-outline btn-sm" @click="toggleHouseStatus(h.id,s.activeEstateId)">{{ h.status==='Available'?'Mark Occupied':'Mark Available' }}</button>
              </td>
            </tr>
            <tr v-if="currentHouses.length===0"><td colspan="7" style="text-align:center;color:var(--text-3);padding:24px">No houses added yet.</td></tr>
          </tbody></table></div>
        </div>

        <!-- MANAGEMENT: ESTATE PHOTOS -->
        <div v-show="s.activePanelId==='ep-mgmt-photos'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Estate Photos 🖼️</h2></div></div>
          <div class="gallery-upload-area" style="max-width:600px;margin-bottom:28px" @click="$refs.estPhotoInput.click()">
            <div class="gua-icon">🖼️</div>
            <div class="gua-text"><strong>Click to upload estate photos</strong><span>Gate, parking, gym, pool, gardens · JPG, PNG, WEBP</span></div>
            <input type="file" ref="estPhotoInput" accept="image/*" multiple style="display:none" @change="handleEstatePhotoUpload($event)" />
          </div>
          <div class="dp-section-lbl">Uploaded Photos ({{ (s.estatePhotos[s.activeEstateId]||[]).length }})</div>
          <div class="estate-photos-grid">
            <div v-for="(photo,i) in s.estatePhotos[s.activeEstateId]||[]" :key="i" class="gallery-thumb">
              <img :src="photo" style="width:100%;height:140px;object-fit:cover;border-radius:10px;" />
            </div>
          </div>
        </div>

        <!-- MANAGEMENT: INQUIRIES -->
        <div v-show="s.activePanelId==='ep-mgmt-inquiries'" class="dp active">
          <div class="dp-hdr"><div style="display:flex;align-items:center;gap:12px"><button class="sb-toggle-btn" @click="toggleSidebar()">☰</button><h2>Public Inquiries</h2></div><span class="chip chip-blue">{{ currentInquiries.length }} inquiries</span></div>
          <div class="table-wrap"><table><thead><tr><th>From</th><th>Phone</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead><tbody>
            <tr v-for="inq in currentInquiries" :key="inq.id">
              <td>{{ inq.name }}</td><td>{{ inq.phone||'—' }}</td><td>{{ inq.email }}</td><td>{{ inq.subject }}</td><td style="max-width:200px;font-size:.82rem">{{ inq.message }}</td><td>{{ inq.date }}</td>
            </tr>
            <tr v-if="currentInquiries.length===0"><td colspan="6" style="text-align:center;color:var(--text-3);padding:24px">No inquiries yet.</td></tr>
          </tbody></table></div>
        </div>

      </div><!-- /dash-main -->
    </div><!-- /dash-layout -->
    <div v-if="s.sidebarOpen" class="sb-overlay" @click="s.sidebarOpen=false"></div>
    <footer class="site-footer">© 2026 Communest</footer>
  </section>

  <!-- ═══════════ ABOUT PAGE ═══════════ -->
  <section v-show="s.currentPage==='about'" class="page active">
    <div style="background:var(--hero-grad);padding:80px 40px 60px">
      <div style="max-width:900px;margin:0 auto" class="about-hero-grid">
        <div>
          <div class="pg-tag">About Communest</div>
          <h1>Built for Kenyan <em style="color:var(--sky);font-style:normal">Estates</em></h1>
          <p style="font-size:1rem;line-height:1.8;margin-bottom:28px">Communest is a digital platform bridging the gap between estate management and residents in Kenya. We provide a transparent, efficient space for listing estates, managing tenants, and resolving issues — all in one place.</p>
          <div class="hero-btns">
            <button class="btn btn-primary btn-lg" @click="showPage('estates')">Browse Estates →</button>
            <button class="btn btn-outline btn-lg" @click="s.listEstateOpen=true">List Your Estate</button>
          </div>
        </div>
        <div class="about-panel">
          <div class="abox">
            <span class="abox-lbl">Platform Stats</span>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
              <div class="abox-stat"><div class="abox-num">{{ s.estates.length }}</div><div class="abox-lbl2">Listed Estates</div></div>
              <div class="abox-stat"><div class="abox-num">{{ totalAvail }}</div><div class="abox-lbl2">Available Houses</div></div>
              <div class="abox-stat"><div class="abox-num">2026</div><div class="abox-lbl2">Founded</div></div>
              <div class="abox-stat"><div class="abox-num">100%</div><div class="abox-lbl2">Kenya-Based</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="site-footer" style="margin-top:40px">© 2026 Communest</footer>
  </section>

  <!-- ═══════════ MODALS ═══════════ -->

  <!-- Auth Modal -->
  <div class="overlay" :class="{ open: s.authModalOpen }" @click.self="s.authModalOpen=false">
    <div class="modal" style="max-width:420px">
      <div class="modal-hdr"><h3>{{ s.authTab==='signin' ? 'Sign In' : 'Create Account' }}</h3><button class="modal-x" @click="s.authModalOpen=false">✕</button></div>
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: s.authTab==='signin' }"  @click="s.authTab='signin'">Sign In</button>
        <button class="auth-tab" :class="{ active: s.authTab==='signup' }" @click="s.authTab='signup'">Sign Up</button>
      </div>
      <div v-if="s.authTab==='signup'" class="form-group"><label>Full Name</label><input class="input" v-model="s.authName" placeholder="Your full name" /></div>
      <div class="form-group"><label>Email</label><input class="input" v-model="s.authEmail" type="email" placeholder="your@email.com" /></div>
      <div class="form-group"><label>Password</label><input class="input" v-model="s.authPassword" type="password" placeholder="Password" /></div>
      <div v-if="s.authError" style="color:#f87171;font-size:.82rem;margin-bottom:10px">{{ s.authError }}</div>
      <button class="btn btn-primary btn-full" @click="s.authTab==='signin' ? doLogin() : doSignup()">{{ s.authTab==='signin' ? 'Sign In' : 'Create Account' }}</button>
    </div>
  </div>

  <!-- Estate Auth Modal -->
  <div class="overlay" :class="{ open: s.estateAuthOpen }" @click.self="s.estateAuthOpen=false">
    <div class="modal estate-auth-modal">
      <div class="modal-hdr"><h3>Sign In to My Estate</h3><button class="modal-x" @click="s.estateAuthOpen=false">✕</button></div>
      <div v-if="s.detectedEstate" class="estate-auth-chosen" style="margin-bottom:16px">
        <div class="estate-auth-emoji">{{ s.detectedEstate.emoji }}</div>
        <div><div class="estate-auth-chosen-name">{{ s.detectedEstate.name }}</div><div class="estate-auth-chosen-loc">📍 {{ s.detectedEstate.location }}</div></div>
      </div>
      <div class="form-group"><label>Estate Email</label><input class="input" v-model="s.estateAuthEmail" type="email" placeholder="yourname@estate.ke" @input="onEstateEmailInput()" /></div>
      <div v-if="s.showEstatePass" class="form-group"><label>Password</label><input class="input" v-model="s.estateAuthPass" type="password" placeholder="Your password" @keydown.enter="doEstateLogin()" /></div>
      <div v-if="s.estateAuthError" style="color:#f87171;font-size:.82rem;margin-bottom:10px">{{ s.estateAuthError }}</div>
      <button class="btn btn-primary btn-full" @click="doEstateLogin()">Sign In →</button>
    </div>
  </div>

  <!-- Profile Modal -->
  <div class="overlay" :class="{ open: s.profileModalOpen }" @click.self="s.profileModalOpen=false">
    <div class="modal" style="max-width:480px">
      <div class="modal-hdr"><h3>My Profile</h3><button class="modal-x" @click="s.profileModalOpen=false">✕</button></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:24px">
        <div style="position:relative;cursor:pointer" @click="$refs.profPhotoInput.click()">
          <div style="width:82px;height:82px;border-radius:50%;background:var(--sky-light);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:var(--sky);overflow:hidden;border:3px solid var(--border)">
            <img v-if="profilePhoto" :src="profilePhoto" style="width:100%;height:100%;object-fit:cover;" />
            <span v-else>{{ s.currentUser ? getInitials(s.currentUser.name) : '' }}</span>
          </div>
          <div style="position:absolute;bottom:2px;right:2px;width:24px;height:24px;background:var(--sky);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;border:2px solid var(--bg-card)">📷</div>
        </div>
        <input type="file" ref="profPhotoInput" accept="image/*" style="display:none" @change="handleProfilePhoto($event)" />
        <span style="font-size:.75rem;color:var(--text-3)">Click photo to change</span>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Full Name</label><input class="input" v-model="s.profileName" placeholder="Your full name" /></div>
        <div class="form-group"><label>Phone</label><input class="input" v-model="s.profilePhone" placeholder="+254 7XX XXX XXX" /></div>
      </div>
      <div class="form-group"><label>Email</label><input class="input" v-model="s.profileEmail" type="email" placeholder="your@email.com" /></div>
      <hr style="border:none;border-top:1px solid var(--border);margin:18px 0" />
      <p style="font-size:.8rem;font-weight:700;color:var(--text-2);margin-bottom:14px">Change Password <span style="font-size:.73rem;font-weight:400;color:var(--text-3)">(leave blank to keep current)</span></p>
      <div class="form-group"><label>Current Password</label><input class="input" v-model="s.profileCurrPwd" type="password" placeholder="Enter current password" /></div>
      <div class="form-row">
        <div class="form-group"><label>New Password</label><input class="input" v-model="s.profileNewPwd" type="password" placeholder="New password" /></div>
        <div class="form-group"><label>Confirm New Password</label><input class="input" v-model="s.profileConfPwd" type="password" placeholder="Confirm password" /></div>
      </div>
      <div v-if="s.profileError" style="color:#f87171;font-size:.82rem;margin-bottom:10px;padding:8px 12px;background:rgba(248,113,113,.1);border-radius:8px">⚠️ {{ s.profileError }}</div>
      <div v-if="s.profileSuccess" style="color:#4ade80;font-size:.82rem;margin-bottom:10px;padding:8px 12px;background:rgba(74,222,128,.1);border-radius:8px">✅ Profile updated successfully!</div>
      <button class="btn btn-primary btn-full" @click="saveProfile()">Save Changes</button>
    </div>
  </div>

  <!-- Request Modal -->
  <div class="overlay" :class="{ open: s.requestModalOpen }" @click.self="s.requestModalOpen=false">
    <div class="modal" style="max-width:440px">
      <div class="modal-hdr"><h3>Submit a Request</h3><button class="modal-x" @click="s.requestModalOpen=false">✕</button></div>
      <div class="form-group"><label>Issue Description</label><textarea class="textarea" v-model="s.reqIssue" rows="4" placeholder="Describe the problem clearly…"></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>Category</label><select class="select" v-model="s.reqCat"><option>Plumbing</option><option>Electrical</option><option>Security</option><option>Cleaning</option><option>Noise</option><option>Other</option></select></div>
        <div class="form-group"><label>Priority</label><select class="select" v-model="s.reqPriority"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
      </div>
      <div class="modal-actions"><button class="btn btn-outline" @click="s.requestModalOpen=false">Cancel</button><button class="btn btn-primary" @click="submitRequest()">Submit →</button></div>
    </div>
  </div>

  <!-- Resolve Modal -->
  <div class="overlay" :class="{ open: s.resolveModalOpen }" @click.self="s.resolveModalOpen=false">
    <div class="modal" style="max-width:440px">
      <div class="modal-hdr"><h3>Resolve Request</h3><button class="modal-x" @click="s.resolveModalOpen=false">✕</button></div>
      <div class="form-group"><label>Resolution Note</label><textarea class="textarea" v-model="s.resolveNote" rows="4" placeholder="Describe what was done to resolve this…"></textarea></div>
      <div class="modal-actions"><button class="btn btn-outline" @click="s.resolveModalOpen=false">Cancel</button><button class="btn btn-primary" @click="resolveRequest()">Mark Resolved →</button></div>
    </div>
  </div>

  <!-- Apply Modal -->
  <div class="overlay" :class="{ open: s.applyModalOpen }" @click.self="s.applyModalOpen=false">
    <div class="modal" style="max-width:500px">
      <div class="modal-hdr"><h3>Apply for this House</h3><button class="modal-x" @click="s.applyModalOpen=false">✕</button></div>
      <div v-if="!s.applySent">
        <div class="form-row"><div class="form-group"><label>Full Name *</label><input class="input" v-model="s.applyName" placeholder="Your full name" /></div><div class="form-group"><label>Phone *</label><input class="input" v-model="s.applyPhone" placeholder="+254 7XX XXX XXX" /></div></div>
        <div class="form-group"><label>Email *</label><input class="input" v-model="s.applyEmail" type="email" /></div>
        <div class="form-group"><label>Occupation</label><input class="input" v-model="s.applyOccupation" placeholder="e.g. Teacher, Engineer" /></div>
        <div class="form-group"><label>Message</label><textarea class="textarea" v-model="s.applyMessage" rows="3" placeholder="Tell management about yourself…"></textarea></div>
        <div class="modal-actions"><button class="btn btn-outline" @click="s.applyModalOpen=false">Cancel</button><button class="btn btn-primary" @click="submitApplication()">Submit Application →</button></div>
      </div>
      <div v-else style="text-align:center;padding:24px">
        <div style="font-size:3rem;margin-bottom:12px">✅</div>
        <h3>Application Submitted!</h3>
        <p style="margin-top:8px;margin-bottom:24px">The estate management will review and contact you.</p>
        <button class="btn btn-primary" @click="s.applyModalOpen=false">Done</button>
      </div>
    </div>
  </div>

  <!-- Add House Modal -->
  <div class="overlay" :class="{ open: s.addHouseModalOpen }" @click.self="s.addHouseModalOpen=false">
    <div class="modal">
      <div class="modal-hdr"><h3>Add New House</h3><button class="modal-x" @click="s.addHouseModalOpen=false">✕</button></div>
      <div class="form-row"><div class="form-group"><label>Unit Number</label><input class="input" v-model="s.ahUnit" placeholder="e.g. 3A" /></div><div class="form-group"><label>Block</label><input class="input" v-model="s.ahBlock" placeholder="e.g. Block A" /></div></div>
      <div class="form-row">
        <div class="form-group"><label>Type</label><select class="select" v-model="s.ahType"><option>Bedsitter</option><option>Studio</option><option>1 Bedroom</option><option>2 Bedrooms</option><option>3 Bedrooms</option></select></div>
        <div class="form-group"><label>Floor</label><input class="input" v-model="s.ahFloor" placeholder="e.g. 2nd Floor" /></div>
      </div>
      <div class="form-group"><label>Monthly Rent (KSh)</label><input class="input" v-model="s.ahPrice" type="number" /></div>
      <div class="form-group"><label>Features (comma separated)</label><input class="input" v-model="s.ahFeats" placeholder="Parking, WiFi, Security" /></div>
      <div class="form-group"><label>Description</label><textarea class="textarea" v-model="s.ahDesc" rows="3"></textarea></div>
      <div class="modal-actions"><button class="btn btn-outline" @click="s.addHouseModalOpen=false">Cancel</button><button class="btn btn-primary" @click="submitNewHouse()">Add House →</button></div>
    </div>
  </div>

  <!-- List Estate Modal -->
  <div class="overlay" :class="{ open: s.listEstateOpen }" @click.self="s.listEstateOpen=false">
    <div class="modal" style="max-width:600px">
      <div class="modal-hdr"><h3>List Your Estate on Communest</h3><button class="modal-x" @click="s.listEstateOpen=false">✕</button></div>
      <div class="form-row"><div class="form-group"><label>Estate Name *</label><input class="input" v-model="s.leFields.name" placeholder="e.g. Sunrise Gardens" /></div><div class="form-group"><label>Location *</label><input class="input" v-model="s.leFields.location" placeholder="e.g. Karen, Nairobi" /></div></div>
      <div class="form-group"><label>Description *</label><textarea class="textarea" v-model="s.leFields.desc" rows="3" placeholder="Describe your estate…"></textarea></div>
      <div class="form-row"><div class="form-group"><label>Total Units</label><input class="input" v-model="s.leFields.units" type="number" /></div><div class="form-group"><label>Year Built</label><input class="input" v-model="s.leFields.year" placeholder="e.g. 2018" /></div></div>
      <div class="form-group"><label>Title Deed Reference</label><input class="input" v-model="s.leFields.titleDeed" placeholder="e.g. IR 12345/1" /></div>
      <div class="form-group"><label>Amenities (comma separated)</label><input class="input" v-model="s.leFields.amenities" placeholder="Parking, Pool, Gym…" /></div>
      <hr style="border:none;border-top:1px solid var(--border);margin:20px 0" />
      <p style="font-size:.82rem;font-weight:700;color:var(--text-2);margin-bottom:14px">Management Contact</p>
      <div class="form-row"><div class="form-group"><label>Manager Name *</label><input class="input" v-model="s.leFields.mgrName" placeholder="Full name" /></div><div class="form-group"><label>Email *</label><input class="input" v-model="s.leFields.mgrEmail" type="email" /></div></div>
      <div class="form-row"><div class="form-group"><label>Phone</label><input class="input" v-model="s.leFields.mgrPhone" placeholder="+254 7XX XXX XXX" /></div><div class="form-group"><label>Password *</label><input class="input" v-model="s.leFields.mgrPassword" type="password" /></div></div>
      <div class="modal-actions"><button class="btn btn-outline" @click="s.listEstateOpen=false">Cancel</button><button class="btn btn-primary" @click="submitListEstate()">List My Estate →</button></div>
    </div>
  </div>

  <!-- Gallery Modal -->
  <div class="overlay" :class="{ open: s.galleryOpen }" @click.self="s.galleryOpen=false">
    <div class="modal" style="max-width:680px">
      <div class="modal-hdr">
        <div><h3>{{ (s.houses[s.galleryEstateId]||[]).find(h=>h.id===s.galleryHouseId)?.unit || 'Unit' }} Photos</h3></div>
        <button class="modal-x" @click="s.galleryOpen=false">✕</button>
      </div>
      <div class="gallery-main">
        <div v-if="galleryPhotos[s.galleryIdx]" style="text-align:center;min-height:220px;display:flex;align-items:center;justify-content:center;font-size:7rem;">
          <img v-if="galleryPhotos[s.galleryIdx].startsWith('data:')" :src="galleryPhotos[s.galleryIdx]" style="max-height:320px;max-width:100%;border-radius:12px;object-fit:cover;" />
          <span v-else>{{ galleryPhotos[s.galleryIdx] }}</span>
        </div>
      </div>
      <div class="gallery-thumbs" style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        <div v-for="(p,i) in galleryPhotos" :key="i" class="gallery-thumb" :class="{ active: i===s.galleryIdx }" @click="s.galleryIdx=i" style="cursor:pointer;width:52px;height:52px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:2px solid transparent;" :style="i===s.galleryIdx?'border-color:var(--sky)':''">
          <img v-if="p.startsWith('data:')" :src="p" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />
          <span v-else>{{ p }}</span>
        </div>
      </div>
      <div v-if="isManager" style="margin-top:16px">
        <div class="gallery-upload-area" @click="$refs.housePhotoInput.click()" style="padding:16px">
          <div class="gua-icon" style="font-size:1.5rem">📷</div>
          <div class="gua-text"><strong>Click to upload photos</strong><span>JPG, PNG, WEBP</span></div>
          <input type="file" ref="housePhotoInput" accept="image/*" multiple style="display:none" @change="handlePhotoUpload($event)" />
        </div>
      </div>
      <div class="modal-actions" style="margin-top:12px">
        <button class="btn btn-outline" @click="s.galleryOpen=false">Close</button>
        <button v-if="(s.houses[s.galleryEstateId]||[]).find(h=>h.id===s.galleryHouseId)?.status==='Available'" class="btn btn-primary" @click="s.applyHouseId=s.galleryHouseId;s.applyEstateId=s.galleryEstateId;s.applySent=false;s.galleryOpen=false;s.applyModalOpen=true">Apply for This House →</button>
      </div>
    </div>
  </div>

  <!-- ═══════════ CHATBOT ═══════════ -->
  <div id="chatbotWidget" class="chatbot-widget" :class="{ open: s.chatbotOpen }">
    <div class="cw-corner cw-tl"></div><div class="cw-corner cw-tr"></div>
    <div class="chatbot-header">
      <div class="chatbot-header-left">
        <div class="chatbot-avatar">
          <svg class="bot-face-svg" viewBox="0 0 48 48" fill="none">
            <line x1="24" y1="4" x2="24" y2="10" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round"/>
            <circle cx="24" cy="3" r="2.5" fill="#38BDF8"/>
            <rect x="8" y="10" width="32" height="26" rx="7" fill="url(#botGrad)"/>
            <rect x="13" y="18" width="8" height="8" rx="3" fill="#0EA5E9" opacity=".9"/>
            <rect x="27" y="18" width="8" height="8" rx="3" fill="#0EA5E9" opacity=".9"/>
            <rect x="14.5" y="19.5" width="2.5" height="2.5" rx="1.2" fill="white" opacity=".7"/>
            <rect x="28.5" y="19.5" width="2.5" height="2.5" rx="1.2" fill="white" opacity=".7"/>
            <path d="M17 30 Q24 34.5 31 30" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" fill="none"/>
            <rect x="3" y="16" width="5" height="9" rx="2.5" fill="#0D3A5C"/>
            <rect x="40" y="16" width="5" height="9" rx="2.5" fill="#0D3A5C"/>
            <defs><linearGradient id="botGrad" x1="8" y1="10" x2="40" y2="36" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0D3A5C"/><stop offset="100%" stop-color="#0A2240"/></linearGradient></defs>
          </svg>
          <div class="avatar-ring"></div>
        </div>
        <div class="chatbot-title-wrap">
          <div class="chatbot-title">Communest Assistant</div>
          <div class="chatbot-status"><span class="chatbot-status-dot"></span>Always online</div>
        </div>
      </div>
      <button class="chatbot-close" @click="s.chatbotOpen=false">
        <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="cw-scan-line"></div>
    <div class="chatbot-body">
      <div class="chatbot-msgs" ref="chatMsgs">
        <div v-for="(msg,i) in s.chatMessages" :key="i" class="chat-bubble" :class="msg.from==='user'?'chat-bubble-user':'chat-bubble-bot'">
          <span v-html="msg.text"></span>
        </div>
      </div>
      <div class="chatbot-suggestions" v-if="s.chatMessages.length===0">
        <button class="chat-suggestion" @click="quickChat('How do I find a house?')">🏠 Find a house</button>
        <button class="chat-suggestion" @click="quickChat('How do I sign in?')">🔑 Sign in</button>
        <button class="chat-suggestion" @click="quickChat('How do I send an inquiry?')">💬 Inquiry</button>
        <button class="chat-suggestion" @click="quickChat('What is Communest?')">ℹ️ About</button>
      </div>
      <div class="chatbot-input-row">
        <input class="chatbot-input" v-model="s.chatInput" placeholder="Ask me anything…" @keydown.enter="sendChat()" autocomplete="off" />
        <button class="chatbot-send" @click="sendChat()">
          <svg viewBox="0 0 20 20" fill="none"><path d="M18 2L9 11" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M18 2L12.5 18L9 11L2 7.5L18 2Z" fill="white" opacity=".9"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- FAB -->
  <button class="chatbot-fab" :class="{ hidden: s.chatbotOpen }" @click="s.chatbotOpen=!s.chatbotOpen">
    <svg class="fab-bot-svg" viewBox="0 0 48 48" fill="none">
      <line x1="24" y1="5" x2="24" y2="11" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="24" cy="4" r="3" fill="white" opacity=".9"/>
      <rect x="8" y="11" width="32" height="26" rx="7" fill="white" opacity=".93"/>
      <rect x="13" y="19" width="8" height="8" rx="3" fill="#0288D1"/>
      <rect x="27" y="19" width="8" height="8" rx="3" fill="#0288D1"/>
      <path d="M17 31 Q24 35.5 31 31" stroke="#0288D1" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  </button>

</div>
  `,
};

createApp(App).mount('#app');