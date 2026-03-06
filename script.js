'use strict';

/* ═══════════════════════════════════════════════════════
   COMMUNEST — app.js
   Communest Digital Estate Management Platform
   Author: Kipngeno Shammah Kiplangat
   Communest — Kenya Digital Estate Platform
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   1. USER ACCOUNTS  (simulates a backend database)
───────────────────────────────────────────────────── */
const USERS = [
  // Management — each manages one estate
  { id: 'mgr-1', name: 'James Mutua',       email: 'james@sunrise.ke',  password: 'mgr123', role: 'management', estateId: 1 },
  { id: 'mgr-2', name: 'Grace Akinyi',      email: 'grace@kilimani.ke', password: 'mgr123', role: 'management', estateId: 2 },
  { id: 'mgr-3', name: 'David Ochieng',     email: 'david@west.ke',     password: 'mgr123', role: 'management', estateId: 3 },

  // Tenants — connected to an estate once management approves them
  { id: 'ten-1', name: 'Shammah Kiplangat', email: 'shammah@email.com', password: 'ten123', role: 'tenant',
    estateId: 1, unit: '2A', rent: 28000, leaseStart: '1 Feb 2026', leaseEnd: '31 Jan 2027', phone: '+254 700 001 001' },
  { id: 'ten-2', name: 'Jane Wanjiru',      email: 'jane@email.com',    password: 'ten123', role: 'tenant',
    estateId: 1, unit: '3C', rent: 45000, leaseStart: '1 Jan 2026',  leaseEnd: '31 Dec 2026', phone: '+254 700 001 002' },
  { id: 'ten-3', name: 'Brian Odhiambo',    email: 'brian@email.com',   password: 'ten123', role: 'tenant',
    estateId: 2, unit: '5A', rent: 35000, leaseStart: '1 Mar 2026',  leaseEnd: '28 Feb 2027', phone: '+254 700 001 003' },
  // Unconnected tenant (pending approval)
  { id: 'ten-4', name: 'Sarah Otieno',      email: 'sarah@email.com',   password: 'ten123', role: 'tenant',
    estateId: null, unit: null, rent: null, leaseStart: null, leaseEnd: null, phone: '+254 700 001 004' },
];

// Currently signed-in user
let currentUser = null;

// Which estate page is currently open
let activeEstateId = null;

// Tracks which request is being resolved
let resolvingRequestId = null;


/* ─────────────────────────────────────────────────────
   2. ESTATE & HOUSE DATA
───────────────────────────────────────────────────── */
const ESTATES = [
  { id: 1, name: 'Sunrise Gardens',         emoji: '🏘️', location: 'Karen, Nairobi',       desc: 'A serene gated estate in Karen with lush landscaping, 24/7 security, and a vibrant community. Close to top schools and shopping centres.',  amenities: ['Swimming Pool','Gym','Parking','24/7 Security','Playground','Borehole','CCTV'],              phone: '+254 720 100 001', email: 'james@sunrise.ke',  managedBy: 'James Mutua'   },
  { id: 2, name: 'Kilimani Heights',         emoji: '🏢', location: 'Kilimani, Nairobi',    desc: 'Modern high-rise in Kilimani with stunning city views, fibre internet, and premium amenities. Minutes from Yaya Centre and Junction Mall.',  amenities: ['Gym','Parking','24/7 Security','CCTV','Fibre WiFi','Lift','Backup Generator'],                phone: '+254 720 100 002', email: 'grace@kilimani.ke', managedBy: 'Grace Akinyi'  },
  { id: 3, name: 'Westlands Park Estate',    emoji: '🌆', location: 'Westlands, Nairobi',   desc: 'Prime location in Westlands, minutes from the CBD and Sarit Centre. Well-maintained compound with an active residents community.',             amenities: ['Parking','24/7 Security','Borehole','Playground','CCTV','Backup Generator'],                   phone: '+254 720 100 003', email: 'david@west.ke',     managedBy: 'David Ochieng' },
  { id: 4, name: 'Ngong Valley Residences',  emoji: '🏠', location: 'Ngong Road, Nairobi',  desc: 'Affordable modern estate along Ngong Road. Perfect for young families and first-time renters looking for value.',                              amenities: ['Parking','24/7 Security','Borehole','Playground'],                                             phone: '+254 720 100 004', email: 'info@ngong.ke',     managedBy: 'Valley Homes'  },
  { id: 5, name: 'Lavington Court',          emoji: '🏰', location: 'Lavington, Nairobi',   desc: 'Exclusive gated community with luxury townhouses, concierge services, and resort-style amenities for discerning residents.',                   amenities: ['Swimming Pool','Gym','Parking','24/7 Security','CCTV','Fibre WiFi','Backup Generator','Lift'], phone: '+254 720 100 005', email: 'info@lav.ke',       managedBy: 'Premium Props' },
  { id: 6, name: 'Thika Road Meadows',       emoji: '🌇', location: 'Thika Road, Nairobi',  desc: 'Budget-friendly family estate close to schools, hospitals, and shopping malls. Well-connected by matatu routes.',                              amenities: ['Parking','Security','Playground','Borehole'],                                                  phone: '+254 720 100 006', email: 'info@thika.ke',     managedBy: 'Meadows Homes' },
];

// Houses keyed by estateId
const HOUSES = {
  1: [
    { id: 101, unit: '2A', block: 'Block A', type: '2 Bedrooms', price: 28000, floor: '2nd Floor',    feats: ['Parking','Security','Water','WiFi'],           status: 'Occupied',  emoji: '🏠', desc: 'Spacious 2-bedroom with large windows, modern kitchen, and tiled floors throughout.' },
    { id: 102, unit: '3C', block: 'Block C', type: '3 Bedrooms', price: 45000, floor: '3rd Floor',    feats: ['Parking','WiFi','Security','Water','Balcony'], status: 'Occupied',  emoji: '🏡', desc: 'Luxurious 3-bedroom with panoramic views, fully fitted kitchen, and two bathrooms.' },
    { id: 103, unit: '1B', block: 'Block B', type: '1 Bedroom',  price: 16000, floor: 'Ground Floor', feats: ['Security','Water'],                           status: 'Available', emoji: '🛏️', desc: 'Cosy 1-bedroom ideal for singles or couples. Easy ground floor access.' },
    { id: 104, unit: '5D', block: 'Block D', type: 'Bedsitter',  price: 9500,  floor: '5th Floor',    feats: ['Security'],                                   status: 'Available', emoji: '🚪', desc: 'Compact bedsitter with great city views. Perfect for a working professional.' },
  ],
  2: [
    { id: 201, unit: '5A', block: 'Block A', type: '2 Bedrooms', price: 35000, floor: '5th Floor',    feats: ['Gym','Parking','WiFi','Security'],   status: 'Occupied',  emoji: '🏢', desc: 'Modern 2-bedroom in the heart of Kilimani with access to the estate gym.' },
    { id: 202, unit: '2B', block: 'Block B', type: '1 Bedroom',  price: 22000, floor: '2nd Floor',    feats: ['Security','Water','Lift'],           status: 'Available', emoji: '🏠', desc: 'Bright 1-bedroom with lift access and great natural light.' },
    { id: 203, unit: '8C', block: 'Block C', type: 'Studio',     price: 18000, floor: '8th Floor',    feats: ['WiFi','Security','Lift'],            status: 'Available', emoji: '🏙️', desc: 'Stylish studio on a high floor with stunning city views.' },
  ],
  3: [
    { id: 301, unit: '4A', block: 'Block A', type: '2 Bedrooms', price: 30000, floor: '4th Floor',    feats: ['Parking','Security','Borehole'],     status: 'Available', emoji: '🏠', desc: 'Comfortable 2-bedroom in Westlands with parking and borehole water.' },
    { id: 302, unit: '1C', block: 'Block C', type: '1 Bedroom',  price: 18000, floor: 'Ground Floor', feats: ['Security','Water','Parking'],        status: 'Available', emoji: '🛏️', desc: 'Ground floor 1-bedroom with private garden access.' },
  ],
  4: [
    { id: 401, unit: '2A', block: 'Block A', type: '2 Bedrooms', price: 20000, floor: '2nd Floor',    feats: ['Parking','Security'],               status: 'Available', emoji: '🏠', desc: 'Affordable 2-bedroom unit on Ngong Road.' },
    { id: 402, unit: '1B', block: 'Block B', type: '1 Bedroom',  price: 13000, floor: 'Ground Floor', feats: ['Security','Borehole'],              status: 'Available', emoji: '🛏️', desc: 'Value 1-bedroom for young families.' },
  ],
  5: [
    { id: 501, unit: 'T1', block: 'Townhouse A', type: '3 Bedrooms', price: 120000, floor: 'Ground',  feats: ['Pool','Gym','Parking','WiFi','Security'], status: 'Available', emoji: '🏰', desc: 'Luxury townhouse with private garden and full amenity access.' },
  ],
  6: [
    { id: 601, unit: '3A', block: 'Block A', type: '2 Bedrooms', price: 15000, floor: '3rd Floor',    feats: ['Security','Parking'],               status: 'Available', emoji: '🌇', desc: 'Budget-friendly 2-bedroom on Thika Road.' },
    { id: 602, unit: '1B', block: 'Block B', type: 'Bedsitter',  price: 8000,  floor: 'Ground Floor', feats: ['Security'],                         status: 'Available', emoji: '🚪', desc: 'Affordable bedsitter close to Roysambu.' },
  ],
};

// Requests (complaints) keyed by estateId
const REQUESTS = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

// Announcements keyed by estateId
const ANNOUNCEMENTS = {
  1: [
    { id: 1001, title: 'Water Supply Interruption – 6th March 2026', category: 'Maintenance', message: 'Scheduled water interruption on 6th March from 8AM–12PM for tank maintenance. Please store water in advance.', date: '4 Mar 2026', by: 'Sunrise Gardens Management' },
    { id: 1002, title: 'Community Clean-Up – 15th March 2026',       category: 'Event',       message: 'Join our community clean-up on 15th March at 7AM. Refreshments and supplies provided. Let\'s keep our estate beautiful!', date: '2 Mar 2026', by: 'Sunrise Gardens Management' },
  ],
  2: [
    { id: 2001, title: 'Gym Maintenance – Closed 8th March', category: 'Maintenance', message: 'The gym will be closed on 8th March for equipment servicing and floor re-coating. We apologise for any inconvenience.', date: '5 Mar 2026', by: 'Kilimani Heights Management' },
  ],
  3: [
    { id: 3001, title: 'Gate Access Policy Reminder', category: 'Notice', message: 'All visitors must be registered at the gate before entry. Please pre-register your regular visitors with the security team.', date: '1 Mar 2026', by: 'Westlands Park Management' },
  ],
  4: [], 5: [], 6: [],
};

// Applications keyed by estateId
const APPLICATIONS = {
  1: [{ id: 'app-101', name: 'Lucy Mwangi',  email: 'lucy@email.com',  phone: '+254700000001', houseId: 103, occupation: 'Teacher',  message: 'Looking forward to moving in.', date: '28 Feb 2026', status: 'Pending' }],
  2: [{ id: 'app-201', name: 'Kevin Otieno', email: 'kevin@email.com', phone: '+254700000002', houseId: 202, occupation: 'Engineer', message: 'Ready to move immediately.',      date: '1 Mar 2026',  status: 'Pending' }],
  3: [], 4: [], 5: [], 6: [],
};

// Estate-level photos (common areas, facilities) keyed by estateId
const ESTATE_PHOTOS = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

// Public inquiries keyed by estateId
const INQUIRIES = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

// House photos keyed by houseId  (simulate with placeholder images by default)
const HOUSE_PHOTOS = {
  101: ['🏠','🛋️','🍳','🚿','🌿'],
  102: ['🏡','🛋️','🍳','🛁','🏙️'],
  103: ['🛏️','🛋️','🍳','🚿'],
  104: ['🚪','🛋️','🌆'],
  201: ['🏢','🛋️','💪','🌃'],
  202: ['🏠','🛋️','🚿'],
  203: ['🏙️','🛋️','🌆'],
  301: ['🏠','🛋️','🍳'],
  302: ['🛏️','🌿','🍳'],
};

// Gallery state
let galleryHouseId   = null;
let galleryEstateId  = null;
let galleryActiveIdx = 0;

// Payments keyed by userId
const PAYMENTS = {
  'ten-1': [
    { month: 'February 2026', amount: 28000, due: '1 Feb 2026', paid: '31 Jan 2026', status: 'Paid' },
    { month: 'March 2026',    amount: 28000, due: '1 Mar 2026', paid: '28 Feb 2026', status: 'Paid' },
    { month: 'April 2026',    amount: 28000, due: '1 Apr 2026', paid: null,          status: 'Upcoming' },
  ],
  'ten-2': [
    { month: 'March 2026',    amount: 45000, due: '1 Mar 2026', paid: '1 Mar 2026',  status: 'Paid' },
    { month: 'April 2026',    amount: 45000, due: '1 Apr 2026', paid: null,          status: 'Upcoming' },
  ],
  'ten-3': [
    { month: 'March 2026',    amount: 35000, due: '1 Mar 2026', paid: null,          status: 'Overdue' },
    { month: 'April 2026',    amount: 35000, due: '1 Apr 2026', paid: null,          status: 'Upcoming' },
  ],
  'ten-4': [],
};


/* ─────────────────────────────────────────────────────
   3. THEME — Dark only, no toggle
───────────────────────────────────────────────────── */
const htmlEl = document.documentElement;
htmlEl.setAttribute('data-theme', 'dark');
htmlEl.style.colorScheme = 'dark';


/* ─────────────────────────────────────────────────────
   4. PAGE NAVIGATION
───────────────────────────────────────────────────── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + pageId);
  if (t) t.classList.add('active');
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  document.getElementById('navLinks').classList.remove('mobile-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link[data-page]').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); showPage(l.dataset.page); });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('mobile-open');
});


/* ─────────────────────────────────────────────────────
   5. MODAL SYSTEM
───────────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  // If opening auth modal, show which estate the user is signing into
  if (id === 'authModal') {
    const eid = window._signingIntoEstateId;
    const estate = eid ? ESTATES.find(e => e.id === eid) : null;
    const tag = document.getElementById('authEstateBadge');
    if (tag) {
      if (estate) {
        tag.innerHTML = '<div class="auth-estate-badge">🏘️ Signing into <strong>' + estate.name + '</strong> · ' + estate.location + '</div>';
        tag.style.display = 'block';
      } else {
        tag.style.display = 'none';
      }
    }
  }
}
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }

document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
});

function authTab(tab) {
  document.querySelectorAll('.atab').forEach((b, i) => b.classList.toggle('active', (i === 0) === (tab === 'signin')));
  document.getElementById('signinForm').classList.toggle('active', tab === 'signin');
  document.getElementById('signupForm').classList.toggle('active', tab === 'signup');
}


/* ─────────────────────────────────────────────────────
   6. AUTHENTICATION
───────────────────────────────────────────────────── */

// Estate Auth Modal — auto-detects estate from email as user types
function openEstateAuthModal() {
  openModal('estateAuthModal');
  // Reset state
  document.getElementById('eaEmail').value = '';
  document.getElementById('eaPassword').value = '';
  document.getElementById('eaEstateBadge').style.display = 'none';
  document.getElementById('eaPasswordWrap').style.display = 'none';
  document.getElementById('eaSubmitBtn').style.display = 'none';
  document.getElementById('eaEmailHint').textContent = '';
  setTimeout(() => document.getElementById('eaEmail').focus(), 200);
}

function onEstateEmailInput() {
  const email = document.getElementById('eaEmail').value.trim().toLowerCase();
  const badge = document.getElementById('eaEstateBadge');
  const passWrap = document.getElementById('eaPasswordWrap');
  const submitBtn = document.getElementById('eaSubmitBtn');
  const hint = document.getElementById('eaEmailHint');

  // Look up user by email
  const user = USERS.find(u => u.email.toLowerCase() === email);

  if (!user) {
    // Hide estate badge and password while typing / unrecognised
    badge.style.display = 'none';
    passWrap.style.display = 'none';
    submitBtn.style.display = 'none';
    hint.textContent = email.includes('@') && email.includes('.') ? 'No account found for this email.' : '';
    hint.style.color = 'var(--text-3)';
    return;
  }

  // User found — show their estate
  const estate = user.estateId ? ESTATES.find(e => e.id === user.estateId) : null;
  if (estate) {
    badge.style.display = 'flex';
    badge.innerHTML =
      '<span class="estate-auth-emoji">' + estate.emoji + '</span>' +
      '<div><div class="estate-auth-chosen-name">' + estate.name + '</div>' +
      '<div class="estate-auth-chosen-loc">📍 ' + estate.location + ' &nbsp;·&nbsp; ' +
      (user.role === 'management' ? '🔧 Manager' : '🏠 ' + (user.unit ? 'Unit ' + user.unit : 'Tenant')) +
      '</div></div>';
    hint.textContent = '';
  } else {
    badge.style.display = 'none';
    hint.textContent = 'Account found — not yet connected to an estate.';
    hint.style.color = 'var(--sky)';
  }

  passWrap.style.display = 'block';
  submitBtn.style.display = 'block';
  setTimeout(() => document.getElementById('eaPassword').focus(), 80);
}

function doEstateLogin() {
  const email = document.getElementById('eaEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('eaPassword').value;
  const user  = USERS.find(u => u.email.toLowerCase() === email && u.password === pass);

  if (!user) {
    const hint = document.getElementById('eaEmailHint');
    hint.textContent = '❌ Wrong password. Please try again.';
    hint.style.color = '#F87171';
    document.getElementById('eaPassword').focus();
    return;
  }

  currentUser = user;
  closeModal('estateAuthModal');
  updateDirSidebar();

  // Update nav button to initials
  const navBtn = document.getElementById('navSignInBtn');
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  navBtn.textContent = initials;
  navBtn.style.cssText = 'border-radius:50%;width:34px;padding:0;height:34px;';
  navBtn.onclick = () => { if (confirm('Sign out?')) doSignout(); };

  // Route to their estate
  if (user.role === 'management') {
    openEstatePage(user.estateId, 'ep-mgmt-overview');
  } else if (user.role === 'tenant' && user.estateId) {
    openEstatePage(user.estateId, 'ep-overview');
  } else {
    showPage('estates');
    alert('Welcome, ' + user.name.split(' ')[0] + '! Your account is not yet linked to an estate. Browse and apply for a house.');
  }
}

function doLogin() {
  const email = document.getElementById('siEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('siPassword').value;
  const user  = USERS.find(u => u.email.toLowerCase() === email && u.password === pass);

  if (!user) {
    alert('❌ Invalid email or password.\n\nDemo accounts:\n• shammah@email.com / ten123  (tenant)\n• sarah@email.com / ten123    (unconnected tenant)\n• james@sunrise.ke / mgr123  (Sunrise Gardens manager)\n• grace@kilimani.ke / mgr123 (Kilimani Heights manager)');
    return;
  }

  currentUser = user;
  closeModal('authModal');
  updateDirSidebar();

  // Update nav button to show initials
  const navBtn = document.getElementById('navSignInBtn');
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  navBtn.textContent = initials;
  navBtn.style.cssText = 'border-radius:50%;width:34px;padding:0;height:34px;';
  navBtn.onclick = () => { if (confirm('Sign out?')) doSignout(); };

  // Route to their estate
  if (user.role === 'management') {
    openEstatePage(user.estateId, 'ep-mgmt-overview');
  } else if (user.role === 'tenant' && user.estateId) {
    openEstatePage(user.estateId, 'ep-overview');
  } else {
    // Unconnected tenant — go to estates to browse
    showPage('estates');
    alert(`Welcome, ${user.name.split(' ')[0]}! 👋\n\nYour account is not yet connected to an estate. Browse estates, find a house you like, and submit an application. Management will approve and connect you.`);
  }
}

function doSignup() {
  const first = document.getElementById('suFirst').value.trim();
  const last  = document.getElementById('suLast').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const pass  = document.getElementById('suPass').value;

  if (!first || !email || !pass) { alert('Please fill in your name, email, and password.'); return; }
  if (USERS.find(u => u.email.toLowerCase() === email.toLowerCase())) { alert('An account with this email already exists. Please sign in.'); return; }

  const newUser = {
    id: 'ten-' + Date.now(), name: first + ' ' + last, email, password: pass,
    role: 'tenant', phone, estateId: null, unit: null, rent: null, leaseStart: null, leaseEnd: null,
  };
  USERS.push(newUser);
  PAYMENTS[newUser.id] = [];
  closeModal('authModal');
  alert(`✅ Account created! Welcome, ${first}.\n\nBrowse estates, find a house, and submit an application. Management will connect your account once approved.`);
  showPage('estates');
}

function doSignout() {
  currentUser = null;
  updateDirSidebar();
  const navBtn = document.getElementById('navSignInBtn');
  navBtn.textContent = 'Register';
  navBtn.style.cssText = '';
  navBtn.onclick = () => { window._signingIntoEstateId = null; openModal('authModal'); authTab('signup'); };
  // Reset estate sidebar
  document.getElementById('tenantNav').style.display = 'none';
  document.getElementById('mgmtNav').style.display   = 'none';
  document.getElementById('sidebarSignIn').style.display = 'block';
  document.getElementById('sidebarUser').style.display   = 'none';
  document.getElementById('estateSidebarRole').textContent = 'Public View';
  showPage('home');
}


/* ─────────────────────────────────────────────────────
   7. ESTATE PAGE — open & render
───────────────────────────────────────────────────── */
function openEstatePage(estateId, panelToOpen) {
  activeEstateId = estateId;
  const estate = ESTATES.find(e => e.id === estateId);
  if (!estate) return;

  showPage('estate');

  // Sidebar labels
  document.getElementById('estateSidebarName').textContent = estate.name;

  // Show/hide nav sections based on role
  const isTenantHere = currentUser && currentUser.role === 'tenant' && currentUser.estateId === estateId;
  const isMgrHere    = currentUser && currentUser.role === 'management' && currentUser.estateId === estateId;

  document.getElementById('tenantNav').style.display = isTenantHere ? 'block' : 'none';
  document.getElementById('mgmtNav').style.display   = isMgrHere    ? 'block' : 'none';
  document.getElementById('sidebarSignIn').style.display = currentUser ? 'none'  : 'block';
  // Store current estate context so auth modal can show estate name
  window._signingIntoEstateId = estateId;
  document.getElementById('sidebarUser').style.display   = currentUser ? 'block' : 'none';

  if (currentUser) {
    document.getElementById('sidebarUserName').textContent = '👤 ' + currentUser.name.split(' ')[0];
    document.getElementById('estateSidebarRole').textContent =
      isMgrHere ? 'Management' : isTenantHere ? 'Tenant · Unit ' + currentUser.unit : 'Signed In';
  } else {
    document.getElementById('estateSidebarRole').textContent = 'Public View';
  }

  // Wire up sidebar panel buttons
  document.querySelectorAll('#page-estate .si[data-panel]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#page-estate .si').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('#page-estate .dp').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(btn.dataset.panel);
      if (panel) panel.classList.add('active');
    };
  });

  // Open the requested panel
  document.querySelectorAll('#page-estate .si').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#page-estate .dp').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById(panelToOpen || 'ep-houses');
  if (targetPanel) targetPanel.classList.add('active');
  const matchingBtn = document.querySelector(`#page-estate .si[data-panel="${panelToOpen || 'ep-houses'}"]`);
  if (matchingBtn) matchingBtn.classList.add('active');

  // Render all data for this estate
  renderEstateHouses(estateId);
  renderEstateAbout(estate);
  renderInquiryContactInfo(estate);
  if (isTenantHere) renderTenantPanels();
  if (isMgrHere)    renderMgmtPanels();
}


/* ─────────────────────────────────────────────────────
   8. ESTATE HOUSES (public)
───────────────────────────────────────────────────── */
function renderEstateHouses(estateId) {
  const grid = document.getElementById('estateHousesGrid');
  if (!grid) return;
  const estate  = ESTATES.find(e => e.id === estateId);
  const houses  = (HOUSES[estateId] || []);
  const available = houses.filter(h => h.status === 'Available');

  const sub = document.getElementById('epHousesSubtitle');
  if (sub) sub.textContent = `${estate ? estate.name + ' · ' : ''}${available.length} of ${houses.length} units available`;

  if (!houses.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-3)"><div style="font-size:2.5rem;margin-bottom:10px">🏚️</div><p>No houses listed yet for this estate.</p></div>`;
    return;
  }

  grid.innerHTML = houses.map(h => `
    <div class="house-card">
      <div class="hc-img">
        ${h.emoji}
        <div class="hc-badge"><span class="chip ${h.status === 'Available' ? 'chip-green' : 'chip-orange'}">${h.status}</span></div>
      </div>
      <div class="hc-body">
        <div class="hc-price">KSh ${h.price.toLocaleString()}<span> / month</span></div>
        <div class="hc-name">${h.type} — Unit ${h.unit}</div>
        <div class="hc-meta"><span>📍 ${h.block}</span><span>🏢 ${h.floor}</span></div>
        <div class="hc-tags">${h.feats.map(f => `<span>${f}</span>`).join('')}</div>
        <div class="hc-desc">${h.desc}</div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-outline" style="flex:1" onclick="openHouseGallery(${h.id}, ${estateId}, event)">📷 Photos</button>
          ${h.status === 'Available'
            ? `<button class="btn btn-primary" style="flex:2" onclick="openApplyModal(${h.id}, ${estateId})">Apply Now →</button>`
            : `<button class="btn btn-outline" style="flex:2;opacity:.5" disabled>Not Available</button>`}
        </div>
      </div>
    </div>`).join('');
}


/* ─────────────────────────────────────────────────────
   9. ESTATE ABOUT (public)
───────────────────────────────────────────────────── */
function renderEstateAbout(estate) {
  const el = document.getElementById('epAboutContent');
  if (!el) return;
  el.innerHTML = `
    <div class="about-layout" style="gap:40px">
      <div>
        <div style="font-size:4rem;margin-bottom:16px">${estate.emoji}</div>
        <h3 style="margin-bottom:8px">${estate.name}</h3>
        <p style="font-size:.95rem;line-height:1.75;margin-bottom:24px">${estate.desc}</p>
        <div class="about-feats">
          <div class="af"><div class="af-icon">📍</div><div><h4>Location</h4><p>${estate.location}</p></div></div>
          <div class="af"><div class="af-icon">👤</div><div><h4>Managed By</h4><p>${estate.managedBy}</p></div></div>
          <div class="af"><div class="af-icon">📞</div><div><h4>Phone</h4><p>${estate.phone}</p></div></div>
          <div class="af"><div class="af-icon">📧</div><div><h4>Email</h4><p>${estate.email}</p></div></div>
          ${estate.titleDeed ? '<div class="af"><div class="af-icon">📜</div><div><h4>Title Deed Ref.</h4><p>' + estate.titleDeed + ' <span style=\"font-size:.72rem;color:var(--text-3)\">· Verifiable at Kenya Lands Registry</span></p></div></div>' : ''}
        </div>
      </div>
      <div class="about-panel">
        <div class="abox"><span class="abox-lbl">Amenities</span>
          <div class="chip-row" style="margin-top:4px">${estate.amenities.map(a => `<span class="chip chip-blue">${a}</span>`).join('')}</div>
        </div>
        <div class="abox abox-sky">
          <span class="abox-lbl">Interested in living here?</span>
          <p style="color:#fff;font-size:.88rem;margin-bottom:14px">Browse available houses and apply directly. Management will review your application.</p>
          <button class="btn" style="background:#fff;color:var(--sky-dark);font-weight:700" onclick="document.querySelector('[data-panel=ep-houses]').click()">View Available Houses →</button>
        </div>
      </div>
    </div>`;
}


/* ─────────────────────────────────────────────────────
   10. TENANT PANELS
───────────────────────────────────────────────────── */
function renderTenantPanels() {
  if (!currentUser || currentUser.role !== 'tenant') return;
  const eid    = currentUser.estateId;
  const estate = ESTATES.find(e => e.id === eid);
  const myReqs = (REQUESTS[eid] || []).filter(r => r.tenantId === currentUser.id);
  const myPay  = PAYMENTS[currentUser.id] || [];
  const anns   = ANNOUNCEMENTS[eid] || [];

  // Welcome
  const firstName = currentUser.name.split(' ')[0];
  setText('tenantWelcome', `Welcome back, ${firstName} 👋`);
  setText('tenantUnitTag', `${estate.emoji} ${estate.name} · Unit ${currentUser.unit}`);

  // Stats
  const overdue  = myPay.find(p => p.status === 'Overdue');
  const upcoming = myPay.find(p => p.status === 'Upcoming');
  setHTML('tenantStats', [
    { icon: '🔧', num: myReqs.length,                                         lbl: 'My Requests' },
    { icon: '✅', num: myReqs.filter(r => r.status === 'Resolved').length,    lbl: 'Resolved' },
    { icon: '📢', num: anns.length,                                            lbl: 'Announcements' },
    { icon: overdue ? '⚠️' : '💳',
      num: overdue ? 'OVERDUE' : (upcoming ? `KSh ${upcoming.amount.toLocaleString()}` : 'Paid ✓'),
      lbl: overdue ? 'Rent Overdue!' : 'Next Rent Due',
      warn: !!overdue },
  ].map(s => `
    <div class="stat-card ${s.warn ? 'stat-card-warning' : ''}">
      <div class="sc-icon">${s.icon}</div>
      <div class="sc-num" style="${s.warn ? 'color:var(--warning)' : ''}">${s.num}</div>
      <div class="sc-lbl">${s.lbl}</div>
    </div>`).join(''));

  // Announcements preview (latest 2)
  const annHTML = buildAnnHTML(anns.slice(0, 2), estate.name);
  setHTML('tenantAnnPreview', annHTML);
  setHTML('tenantAnnFull',    buildAnnHTML(anns, estate.name));

  // Requests table
  setHTML('tenantRequestsTable', myReqs.length
    ? myReqs.map(r => `<tr>
        <td>#${r.id}</td>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td><span class="chip ${r.priority==='Urgent'?'chip-orange':'chip-blue'}">${r.priority}</span></td>
        <td>${r.date}</td>
        <td><span class="chip ${statusClass(r.status)}">${r.status}</span></td>
        <td style="font-size:.8rem;color:var(--text-3)">${r.response || '—'}</td>
      </tr>`).join('')
    : `<tr><td colspan="7"><div class="empty-row"><div class="empty-icon">✅</div><p>No requests submitted yet. Use the button above to submit one.</p></div></td></tr>`);

  // Rent summary
  setHTML('tenantRentSummary', `
    <div class="rent-card ${overdue ? 'rent-card-danger' : ''}">
      <div class="rent-amount">KSh ${(currentUser.rent || 0).toLocaleString()}<span>/month</span></div>
      <div class="rent-detail">Unit ${currentUser.unit} · ${estate.name}</div>
      ${overdue ? `<div class="rent-overdue-badge">⚠️ Overdue payment for ${overdue.month}</div>` : ''}
      ${upcoming ? `<div class="rent-next">Next due: <strong>${upcoming.due}</strong></div>` : ''}
    </div>`);

  // Payments table
  setHTML('tenantPaymentsTable', myPay.length
    ? myPay.map(p => `<tr>
        <td>${p.month}</td>
        <td>KSh ${p.amount.toLocaleString()}</td>
        <td>${p.due}</td>
        <td>${p.paid || '—'}</td>
        <td><span class="chip ${p.status==='Paid'?'chip-green':p.status==='Overdue'?'chip-red':'chip-blue'}">${p.status}</span></td>
      </tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-3)">No payment records yet.</td></tr>`);

  // Lease
  const house = (HOUSES[eid] || []).find(h => h.unit === currentUser.unit);
  setHTML('tenantLeaseContent', `
    <div class="lease-card">
      <div class="lease-header">
        <div class="lease-icon">${house ? house.emoji : '🏠'}</div>
        <div>
          <div class="lease-unit">${house ? house.type : 'Unit'} — Unit ${currentUser.unit}</div>
          <div class="lease-estate">${estate.name} · ${house ? house.block + ' · ' + house.floor : ''}</div>
        </div>
      </div>
      <div class="lease-grid">
        ${[
          ['Tenant', currentUser.name],
          ['Unit', currentUser.unit],
          ['Monthly Rent', `KSh ${(currentUser.rent||0).toLocaleString()}`],
          ['Lease Start', currentUser.leaseStart || '—'],
          ['Lease End', currentUser.leaseEnd || '—'],
          ['Estate', estate.name],
          ['Management Phone', estate.phone],
          ['Status', '<span class="chip chip-green">Active</span>'],
        ].map(([lbl, val]) => `
          <div class="lease-field">
            <span class="lf-label">${lbl}</span>
            <span class="lf-val">${val}</span>
          </div>`).join('')}
      </div>
      ${house ? `<div style="margin-top:16px"><div class="dp-section-lbl">Unit Features</div>
        <div class="chip-row">${house.feats.map(f=>`<span class="chip chip-blue">${f}</span>`).join('')}</div></div>` : ''}
    </div>`);
}


/* ─────────────────────────────────────────────────────
   11. MANAGEMENT PANELS
───────────────────────────────────────────────────── */
function renderMgmtPanels() {
  if (!currentUser || currentUser.role !== 'management') return;
  const eid      = currentUser.estateId;
  const estate   = ESTATES.find(e => e.id === eid);
  const houses   = HOUSES[eid] || [];
  const tenants  = USERS.filter(u => u.role === 'tenant' && u.estateId === eid);
  const requests = REQUESTS[eid] || [];
  const apps     = APPLICATIONS[eid] || [];
  const anns     = ANNOUNCEMENTS[eid] || [];

  // Welcome
  setText('mgmtWelcome', `${currentUser.name.split(' ')[0]}'s Dashboard 👋`);
  setText('mgmtEstateTag', `${estate.emoji} ${estate.name} — Management Portal`);

  // Stats
  const available = houses.filter(h => h.status === 'Available').length;
  const openReqs  = requests.filter(r => r.status === 'Open').length;
  const pending   = apps.filter(a => a.status === 'Pending').length;
  setHTML('mgmtStats', [
    { icon: '👥', num: tenants.length,  lbl: 'My Tenants' },
    { icon: '🏠', num: available,       lbl: 'Available Units' },
    { icon: '🔧', num: openReqs,        lbl: 'Open Requests' },
    { icon: '📋', num: pending,         lbl: 'Pending Applications' },
  ].map(s => `
    <div class="stat-card">
      <div class="sc-icon">${s.icon}</div>
      <div class="sc-num">${s.num}</div>
      <div class="sc-lbl">${s.lbl}</div>
    </div>`).join(''));

  // Recent requests (overview)
  setHTML('mgmtRecentRequests', requests.length
    ? requests.slice(0, 5).map(r => `<tr>
        <td>${r.tenant}</td><td>${r.unit}</td>
        <td>${r.title}</td>
        <td><span class="chip ${statusClass(r.status)}">${r.status}</span></td>
      </tr>`).join('')
    : `<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-3)">No requests yet</td></tr>`);

  // Full requests table
  setHTML('mgmtRequestsTable', requests.length
    ? requests.map(r => `<tr>
        <td>#${r.id}</td>
        <td>${r.tenant}</td>
        <td>${r.unit}</td>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td>${r.date}</td>
        <td><span class="chip ${statusClass(r.status)}">${r.status}</span></td>
        <td>${r.status !== 'Resolved'
          ? `<button class="btn btn-outline btn-sm" onclick="openResolveModal(${r.id})">Resolve</button>`
          : `<span style="color:var(--success);font-weight:700;font-size:.8rem">✓ Done</span>`}</td>
      </tr>`).join('')
    : `<tr><td colspan="8"><div class="empty-row"><div class="empty-icon">✅</div><p>No requests from tenants yet.</p></div></td></tr>`);

  // Announcements
  setHTML('mgmtAnnList', buildAnnHTML(anns, estate.name));
  // Set default date to today
  const annDateEl = document.getElementById('annDate');
  if (annDateEl && !annDateEl.value) annDateEl.value = new Date().toISOString().split('T')[0];

  // Tenants
  const countEl = document.getElementById('mgmtTenantCount');
  if (countEl) countEl.textContent = `${tenants.length} tenant${tenants.length !== 1 ? 's' : ''}`;
  setHTML('mgmtTenantsTable', tenants.length
    ? tenants.map(t => `<tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.unit}</td>
        <td>${t.email}</td>
        <td>${t.phone || '—'}</td>
        <td>KSh ${(t.rent||0).toLocaleString()}</td>
        <td>${t.leaseEnd || '—'}</td>
        <td><span class="chip chip-green">Active</span></td>
      </tr>`).join('')
    : `<tr><td colspan="7"><div class="empty-row"><div class="empty-icon">👥</div><p>No tenants connected yet. Approve applications to connect tenants.</p></div></td></tr>`);

  // Applications
  setHTML('mgmtApplicationsTable', apps.length
    ? apps.map(a => {
        const house = houses.find(h => h.id === a.houseId);
        return `<tr>
          <td><strong>${a.name}</strong></td>
          <td>${a.email}</td>
          <td>${house ? `Unit ${house.unit} (${house.type})` : '—'}</td>
          <td>${a.date}</td>
          <td><span class="chip ${statusClass(a.status)}">${a.status}</span></td>
          <td>${a.status === 'Pending'
            ? `<button class="btn btn-primary btn-sm" onclick="openAssignModal('${a.id}', ${eid})">Approve & Assign</button>`
            : `<span style="color:var(--success);font-weight:700;font-size:.8rem">✓ Approved</span>`}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="6"><div class="empty-row"><div class="empty-icon">📋</div><p>No applications yet.</p></div></td></tr>`);

  // Estate photos panel
  const estPhotos = ESTATE_PHOTOS[eid] || [];
  const photoCount = document.getElementById('estatePhotoCount');
  if (photoCount) photoCount.textContent = estPhotos.length;
  const photosGrid = document.getElementById('estatePhotosGrid');
  if (photosGrid) {
    const isUrl = p => p.startsWith('data:') || p.startsWith('http');
    photosGrid.innerHTML = estPhotos.length
      ? estPhotos.map((p, i) => `
          <div class="estate-photo-item">
            ${isUrl(p)
              ? `<img src="${p}" alt="Estate photo ${i+1}" class="estate-photo-img" />`
              : `<div class="estate-photo-emoji">${p}</div>`}
            <button class="estate-photo-del" onclick="deleteEstatePhoto(${i}, ${eid})" title="Delete">✕</button>
          </div>`).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-3)"><div style="font-size:2.5rem;margin-bottom:8px">🖼️</div><p>No photos uploaded yet. Upload estate photos so prospective tenants can see what to expect.</p></div>`;
  }

  // Inquiries panel
  const inqs = INQUIRIES[eid] || [];
  const inqCount = document.getElementById('mgmtInqCount');
  if (inqCount) inqCount.textContent = `${inqs.length} inquir${inqs.length !== 1 ? 'ies' : 'y'}`;
  setHTML('mgmtInquiriesTable', inqs.length
    ? inqs.map(i => `<tr>
        <td><strong>${i.name}</strong></td>
        <td>${i.phone || '—'}</td>
        <td>${i.email}</td>
        <td><span class="chip chip-blue">${i.subject}</span></td>
        <td style="max-width:200px;font-size:.8rem;color:var(--text-3)">${i.message.slice(0,80)}${i.message.length>80?'…':''}</td>
        <td>${i.date}</td>
        <td><span class="chip ${i.read ? 'chip-green' : 'chip-orange'}">${i.read ? 'Read' : 'New'}</span></td>
        <td><button class="btn btn-outline btn-sm" onclick="markInquiryRead(${i.id}, ${eid})">Mark Read</button></td>
      </tr>`).join('')
    : `<tr><td colspan="8"><div class="empty-row"><div class="empty-icon">💬</div><p>No public inquiries yet for this estate.</p></div></td></tr>`);

  // Houses table
  setHTML('mgmtHousesTable', houses.map(h => `<tr>
    <td><strong>${h.unit}</strong></td>
    <td>${h.type}</td>
    <td>KSh ${h.price.toLocaleString()}</td>
    <td>${h.block}</td>
    <td>${h.floor}</td>
    <td><span class="chip ${h.status === 'Available' ? 'chip-green' : 'chip-orange'}">${h.status}</span></td>
    <td><button class="btn btn-outline btn-sm" onclick="toggleHouseStatus(${h.id}, ${eid})">
      ${h.status === 'Available' ? 'Mark Occupied' : 'Mark Available'}
    </button></td>
  </tr>`).join(''));
}


/* ─────────────────────────────────────────────────────
   12. APPLICATIONS
───────────────────────────────────────────────────── */
function openApplyModal(houseId, estateId) {
  const house = (HOUSES[estateId] || []).find(h => h.id === houseId);
  if (!house) return;
  document.getElementById('applyModal').dataset.houseId   = houseId;
  document.getElementById('applyModal').dataset.estateId  = estateId;
  setHTML('applyInfo', `<strong>${house.emoji} ${house.type} — Unit ${house.unit}</strong><br>KSh ${house.price.toLocaleString()} / month`);

  // Pre-fill if signed in
  if (currentUser) {
    const parts = currentUser.name.split(' ');
    setValue('apFirst', parts[0] || '');
    setValue('apLast',  parts.slice(1).join(' ') || '');
    setValue('apEmail', currentUser.email);
    setValue('apPhone', currentUser.phone || '');
  }
  openModal('applyModal');
}

function submitApplication() {
  const houseId  = parseInt(document.getElementById('applyModal').dataset.houseId);
  const estateId = parseInt(document.getElementById('applyModal').dataset.estateId);
  const first    = document.getElementById('apFirst').value.trim();
  const last     = document.getElementById('apLast').value.trim();
  const email    = document.getElementById('apEmail').value.trim();
  const phone    = document.getElementById('apPhone').value.trim();
  const occ      = document.getElementById('apOcc').value.trim();
  const msg      = document.getElementById('apMsg').value.trim();

  if (!first || !email) { alert('Please enter your name and email.'); return; }

  if (!APPLICATIONS[estateId]) APPLICATIONS[estateId] = [];
  APPLICATIONS[estateId].push({
    id:         'app-' + Date.now(),
    name:       first + ' ' + last,
    email, phone,
    houseId,
    occupation: occ,
    message:    msg,
    date:       formatDate(new Date()),
    status:     'Pending',
  });

  closeModal('applyModal');
  ['apFirst','apLast','apEmail','apPhone','apOcc','apMsg'].forEach(id => setValue(id, ''));
  alert(`✅ Application submitted!\n\nThe management of ${ESTATES.find(e=>e.id===estateId)?.name} will review and contact you within 48 hours.`);
}

function openAssignModal(appId, estateId) {
  const app    = (APPLICATIONS[estateId] || []).find(a => a.id === appId);
  if (!app) return;
  const avail  = (HOUSES[estateId] || []).filter(h => h.status === 'Available');

  setHTML('assignInfo', `<strong>Applicant:</strong> ${app.name} · ${app.email}<br><strong>Applied for:</strong> Unit ${(HOUSES[estateId]||[]).find(h=>h.id===app.houseId)?.unit || '—'}`);
  setHTML('assignUnit', avail.map(h => `<option value="${h.id}" ${h.id===app.houseId?'selected':''}>${`Unit ${h.unit} — ${h.type} · KSh ${h.price.toLocaleString()}/mo`}</option>`).join('') || '<option>No available units</option>');

  const h = (HOUSES[estateId]||[]).find(x => x.id === app.houseId);
  setValue('assignRent', h ? h.price : '');
  setValue('assignStart', new Date().toISOString().split('T')[0]);

  document.getElementById('assignModal').dataset.appId    = appId;
  document.getElementById('assignModal').dataset.estateId = estateId;
  document.getElementById('assignModal').dataset.appName  = app.name;
  document.getElementById('assignModal').dataset.appEmail = app.email;
  document.getElementById('assignModal').dataset.appPhone = app.phone || '';
  openModal('assignModal');
}

function confirmAssignment() {
  const modal    = document.getElementById('assignModal');
  const appId    = modal.dataset.appId;
  const estateId = parseInt(modal.dataset.estateId);
  const appName  = modal.dataset.appName;
  const appEmail = modal.dataset.appEmail;
  const appPhone = modal.dataset.appPhone;
  const houseId  = parseInt(document.getElementById('assignUnit').value);
  const rent     = parseInt(document.getElementById('assignRent').value) || 0;
  const start    = document.getElementById('assignStart').value;
  const end      = document.getElementById('assignEnd').value;

  if (!houseId || !rent || !start || !end) { alert('Please fill in all fields.'); return; }

  // Mark application approved
  const app = (APPLICATIONS[estateId] || []).find(a => a.id === appId);
  if (app) app.status = 'Approved';

  // Mark house occupied
  const house = (HOUSES[estateId] || []).find(h => h.id === houseId);
  if (house) house.status = 'Occupied';

  // Find or create tenant user
  let tenant = USERS.find(u => u.email.toLowerCase() === appEmail.toLowerCase() && u.role === 'tenant');
  if (!tenant) {
    tenant = { id: 'ten-' + Date.now(), name: appName, email: appEmail, password: 'ten123', role: 'tenant', phone: appPhone, estateId: null, unit: null, rent: null, leaseStart: null, leaseEnd: null };
    USERS.push(tenant);
    PAYMENTS[tenant.id] = [];
  }

  // Connect tenant
  tenant.estateId   = estateId;
  tenant.unit       = house ? house.unit : '—';
  tenant.rent       = rent;
  tenant.leaseStart = start;
  tenant.leaseEnd   = end;

  // Seed first payment
  if (!PAYMENTS[tenant.id]) PAYMENTS[tenant.id] = [];
  PAYMENTS[tenant.id].push({ month: 'April 2026', amount: rent, due: '1 Apr 2026', paid: null, status: 'Upcoming' });

  closeModal('assignModal');
  renderMgmtPanels();
  renderEstateHouses(estateId);
  alert(`✅ ${appName} approved and connected to ${ESTATES.find(e=>e.id===estateId)?.name}!\n\nUnit: ${house?.unit} · KSh ${rent.toLocaleString()}/mo\nLease: ${start} → ${end}\n\nThey can now sign in and access their tenant dashboard.`);
}


/* ─────────────────────────────────────────────────────
   13. REQUESTS
───────────────────────────────────────────────────── */
function submitRequest() {
  if (!currentUser || !currentUser.estateId) { alert('You must be signed in and connected to an estate to submit a request.'); return; }
  const title = document.getElementById('reqTitle').value.trim();
  if (!title) { alert('Please enter a title for your request.'); return; }

  const eid = currentUser.estateId;
  if (!REQUESTS[eid]) REQUESTS[eid] = [];
  REQUESTS[eid].push({
    id:       REQUESTS[eid].length + 1,
    title,
    category: document.getElementById('reqCat').value,
    priority: document.getElementById('reqPriority').value,
    desc:     document.getElementById('reqDesc').value.trim(),
    date:     formatDate(new Date()),
    status:   'Open',
    tenantId: currentUser.id,
    tenant:   currentUser.name,
    unit:     currentUser.unit,
    response: null,
  });

  ['reqTitle','reqDesc'].forEach(id => setValue(id, ''));
  closeModal('requestModal');
  renderTenantPanels();
  alert(`✅ Request submitted to ${ESTATES.find(e=>e.id===eid)?.name} management!`);
}

function openResolveModal(requestId) {
  const eid = currentUser?.estateId;
  const req = (REQUESTS[eid] || []).find(r => r.id === requestId);
  if (!req) return;
  resolvingRequestId = requestId;
  setHTML('resolveInfo', `<strong>Request #${req.id}:</strong> ${req.title}<br><strong>From:</strong> ${req.tenant} · Unit ${req.unit}`);
  setValue('resolveNote', '');
  openModal('resolveModal');
}

function confirmResolve() {
  const eid  = currentUser?.estateId;
  const note = document.getElementById('resolveNote').value.trim();
  const req  = (REQUESTS[eid] || []).find(r => r.id === resolvingRequestId);
  if (req) {
    req.status   = 'Resolved';
    req.response = note || 'Resolved by management.';
  }
  closeModal('resolveModal');
  renderMgmtPanels();
  alert('✅ Request marked as resolved. The tenant will see your response.');
}


/* ─────────────────────────────────────────────────────
   14. ANNOUNCEMENTS
───────────────────────────────────────────────────── */
function submitAnnouncement() {
  if (!currentUser || currentUser.role !== 'management') return;
  const title = document.getElementById('annTitle').value.trim();
  if (!title) { alert('Please enter an announcement title.'); return; }

  const eid = currentUser.estateId;
  if (!ANNOUNCEMENTS[eid]) ANNOUNCEMENTS[eid] = [];
  ANNOUNCEMENTS[eid].unshift({
    id:       Date.now(),
    title,
    category: document.getElementById('annCat').value,
    message:  document.getElementById('annMsg').value.trim(),
    date:     document.getElementById('annDate').value || formatDate(new Date()),
    by:       currentUser.name + ' — ' + ESTATES.find(e=>e.id===eid)?.name,
  });

  setValue('annTitle', ''); setValue('annMsg', '');
  renderMgmtPanels();
  alert(`✅ Announcement posted to all tenants of ${ESTATES.find(e=>e.id===eid)?.name}!`);
}


/* ─────────────────────────────────────────────────────
   15. HOUSES MANAGEMENT
───────────────────────────────────────────────────── */
function toggleHouseStatus(houseId, estateId) {
  const h = (HOUSES[estateId] || []).find(x => x.id === houseId);
  if (h) {
    h.status = h.status === 'Available' ? 'Occupied' : 'Available';
    renderMgmtPanels();
    renderEstateHouses(estateId);
  }
}

function submitNewHouse() {
  const eid  = currentUser?.estateId;
  const unit = document.getElementById('ahUnit').value.trim();
  if (!unit) { alert('Please enter the unit number.'); return; }
  if (!HOUSES[eid]) HOUSES[eid] = [];
  const newHouseId = eid * 1000 + HOUSES[eid].length + 1;
  HOUSES[eid].push({
    id:    newHouseId,
    unit,
    block: document.getElementById('ahBlock').value.trim() || 'Block A',
    type:  document.getElementById('ahType').value,
    price: parseInt(document.getElementById('ahPrice').value) || 0,
    floor: document.getElementById('ahFloor').value.trim() || 'Ground Floor',
    feats: document.getElementById('ahFeats').value.split(',').map(f => f.trim()).filter(Boolean),
    desc:  document.getElementById('ahDesc').value.trim() || 'No description provided.',
    status: 'Available',
    emoji:  '🏠',
  });
  if (!HOUSE_PHOTOS[newHouseId]) HOUSE_PHOTOS[newHouseId] = ['🏠'];
  closeModal('addHouseModal');
  renderMgmtPanels();
  renderEstateHouses(eid);
  alert('✅ House added successfully!');
}


/* ─────────────────────────────────────────────────────
   16. HOME & DIRECTORY RENDERERS
───────────────────────────────────────────────────── */
function estateCardHTML(estate) {
  const houses    = HOUSES[estate.id] || [];
  const available = houses.filter(h => h.status === 'Available').length;
  const minPrice  = houses.length ? Math.min(...houses.map(h => h.price)) : 0;

  return `
    <div class="house-card estate-dir-card" style="cursor:pointer" onclick="openEstatePage(${estate.id})">
      <div class="hc-img" style="background:linear-gradient(135deg,var(--sky-light),var(--border));font-size:3.5rem">
        ${estate.emoji}
        <div class="hc-badge"><span class="chip ${available > 0 ? 'chip-green' : 'chip-orange'}">${available} Available</span></div>
      </div>
      <div class="hc-body">
        <div class="hc-name" style="font-size:1rem;font-weight:700">${estate.name}</div>
        <div class="hc-meta"><span>📍 ${estate.location}</span></div>
        <div class="hc-desc">${estate.desc.slice(0, 100)}…</div>
        <div class="hc-tags">${estate.amenities.slice(0, 4).map(a => `<span>${a}</span>`).join('')}${estate.amenities.length > 4 ? `<span>+${estate.amenities.length - 4} more</span>` : ''}</div>
        ${available > 0 ? `<div style="font-size:.83rem;color:var(--text-3);margin-bottom:10px">From KSh ${minPrice.toLocaleString()}/mo</div>` : ''}
        <button class="btn btn-primary" style="width:100%">View Estate →</button>
      </div>
    </div>`;
}

function renderHomeEstates() {
  const grid = document.getElementById('homeEstatesGrid');
  if (grid) grid.innerHTML = ESTATES.slice(0, 3).map(estateCardHTML).join('');

  const totalAvail = Object.values(HOUSES).flat().filter(h => h.status === 'Available').length;
  setText('heroHouseCount',  totalAvail);
  setText('heroEstateCount', ESTATES.length);
  setText('aboutEstCount',   ESTATES.length);
  setText('aboutHouseCount', totalAvail);
}

// Active filter state for estates directory sidebar
let estDirFilter = 'all';
let estDirLoc    = '';

function setEstDirFilter(filter, loc) {
  estDirFilter = filter || 'all';
  estDirLoc    = loc    || '';

  // Update sidebar active state
  document.querySelectorAll('#page-estates .si[data-estates-filter]').forEach(b => {
    b.classList.toggle('active', b.dataset.estatesFilter === estDirFilter && !estDirLoc);
  });
  document.querySelectorAll('#page-estates .si[data-estates-loc]').forEach(b => {
    b.classList.toggle('active', b.dataset.estatesLoc === estDirLoc);
  });

  // Update title
  const titles = { all:'All Listed Estates', available:'Estates with Availability', new:'Newly Listed Estates' };
  setText('estDirTitle', estDirLoc ? `Estates in ${estDirLoc}` : (titles[estDirFilter] || 'All Listed Estates'));
  setText('estDirSubtitle', `${ESTATES.length} estate${ESTATES.length !== 1 ? 's' : ''} on Communest`);

  renderEstatesDirectory();
}

function renderEstatesDirectory() {
  const grid      = document.getElementById('estatesDirectoryGrid');
  const searchEl  = document.getElementById('estateSearch');
  const clearBtn  = document.getElementById('estateSearchClear');
  const metaEl    = document.getElementById('estateSearchMeta');
  const search    = (searchEl?.value || '').toLowerCase().trim();
  if (!grid) return;

  // Show/hide clear button
  if (clearBtn) clearBtn.style.display = search ? 'flex' : 'none';

  let filtered = ESTATES.filter(e => {
    if (search) {
      const inName     = e.name.toLowerCase().includes(search);
      const inLocation = e.location.toLowerCase().includes(search);
      const inAmenity  = (e.amenities || []).some(a => a.toLowerCase().includes(search));
      if (!inName && !inLocation && !inAmenity) return false;
    }
    if (estDirLoc && !e.location.includes(estDirLoc)) return false;
    if (estDirFilter === 'available') {
      const avail = (HOUSES[e.id] || []).filter(h => h.status === 'Available').length;
      if (!avail) return false;
    }
    if (estDirFilter === 'new') {
      if (e.id <= 6) return false;
    }
    return true;
  });

  // Update result meta
  if (metaEl) {
    if (search) {
      metaEl.textContent = filtered.length
        ? filtered.length + ' estate' + (filtered.length !== 1 ? 's' : '') + ' found for "' + searchEl.value.trim() + '"'
        : '';
      metaEl.style.display = 'block';
    } else {
      metaEl.style.display = 'none';
    }
  }

  grid.innerHTML = filtered.length
    ? filtered.map(estateCardHTML).join('')
    : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-3)">'
      + '<div style="font-size:2.5rem;margin-bottom:10px">🔍</div>'
      + '<p>No estates match <strong>' + (searchEl?.value.trim() || 'your search') + '</strong>.</p>'
      + '<button class="btn btn-outline" style="margin-top:16px" onclick="clearEstateSearch()">Clear search</button>'
      + '</div>';
}

function clearEstateSearch() {
  const el = document.getElementById('estateSearch');
  if (el) { el.value = ''; el.focus(); }
  renderEstatesDirectory();
}


/* ─────────────────────────────────────────────────────
   17. HELPERS
───────────────────────────────────────────────────── */
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setHTML(id, val) { const el = document.getElementById(id); if (el) el.innerHTML  = val; }
function setValue(id, val){ const el = document.getElementById(id); if (el) el.value      = val; }

function statusClass(s) {
  return s === 'Resolved' ? 'chip-green' : s === 'Open' ? 'chip-orange' : s === 'Pending' ? 'chip-blue' : 'chip-blue';
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildAnnHTML(anns, estateName) {
  if (!anns || !anns.length) return `<div class="empty-row"><div class="empty-icon">📢</div><p>No announcements posted yet from ${estateName}.</p></div>`;
  return anns.map(a => `
    <div class="ann-card">
      <div class="ann-card-top"><span class="chip chip-blue">${a.category}</span></div>
      <h4>${a.title}</h4>
      <p>${a.message}</p>
      <div class="ann-meta">📅 ${a.date} &nbsp;·&nbsp; ${a.by}</div>
    </div>`).join('');
}


/* ─────────────────────────────────────────────────────
   18. DIRECTORY SIDEBAR — swaps content based on auth
───────────────────────────────────────────────────── */
function updateDirSidebar() {
  const signedOut = document.getElementById('dirSignedOut');
  const signedIn  = document.getElementById('dirSignedIn');
  if (!signedOut || !signedIn) return;

  if (!currentUser) {
    signedOut.style.display = 'block';
    signedIn.style.display  = 'none';
    return;
  }

  // Signed in — show estate nav, hide directory filters
  signedOut.style.display = 'none';
  signedIn.style.display  = 'block';

  const estate = currentUser.estateId ? ESTATES.find(e => e.id === currentUser.estateId) : null;
  const isMgr  = currentUser.role === 'management';
  const eid    = estate ? estate.id : null;

  setText('dirSidebarName', estate ? estate.name : 'My Account');
  setText('dirSidebarRole', isMgr
    ? 'Management'
    : currentUser.unit ? 'Tenant · Unit ' + currentUser.unit : 'Tenant');

  // EXPLORE
  const exploreNav = document.getElementById('dirExploreNav');
  if (exploreNav) {
    exploreNav.innerHTML = estate
      ? '<span class="sb-lbl">EXPLORE</span>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-houses\')">🏠 Available Houses</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-about\')">ℹ️ About This Estate</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-inquire\')">💬 Send Inquiry</button>'
      : '';
  }

  // MANAGEMENT or MY ESTATE
  const roleNav = document.getElementById('dirRoleNav');
  if (roleNav) {
    if (isMgr && estate) {
      roleNav.innerHTML =
        '<span class="sb-lbl">MANAGEMENT</span>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-overview\')">📊 Overview</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-requests\')">🔧 Tenant Requests</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-announcements\')">📢 Announcements</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-tenants\')">👥 My Tenants</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-applications\')">📋 Applications</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-houses\')">🏠 Manage Houses</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-photos\')">🖼️ Estate Photos</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-mgmt-inquiries\')">💬 Inquiries</button>';
    } else if (estate) {
      roleNav.innerHTML =
        '<span class="sb-lbl">MY ESTATE</span>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-overview\')">📊 Overview</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-requests\')">🔧 My Requests</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-announcements\')">📢 Announcements</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-rent\')">💳 Rent &amp; Payments</button>' +
        '<button class="si" onclick="openEstatePage(' + eid + ',\'ep-lease\')">📄 My Lease</button>';
    } else {
      roleNav.innerHTML = '<p style="font-size:.78rem;color:var(--text-3);padding:6px 4px">Not yet connected to an estate.</p>';
    }
  }

  // ACCOUNT
  const accountNav = document.getElementById('dirAccountNav');
  if (accountNav) {
    const backPanel = isMgr ? 'ep-mgmt-overview' : 'ep-overview';
    accountNav.innerHTML =
      '<span class="sb-lbl">ACCOUNT</span>' +
      '<button class="si" style="cursor:default;opacity:.65;pointer-events:none">👤 ' + currentUser.name + '</button>' +
      (estate ? '<button class="si si-back" onclick="openEstatePage(' + eid + ',\'' + backPanel + '\')">🏘️ Back to Estate</button>' : '') +
      '<button class="si si-back" onclick="doSignout()">← Sign Out</button>';
  }
}

/* ─────────────────────────────────────────────────────
   18. INIT
───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeEstates();
  setEstDirFilter('all', '');

  // Wire estates directory sidebar filter buttons
  document.querySelectorAll('#page-estates .si[data-estates-filter]').forEach(btn => {
    btn.addEventListener('click', () => setEstDirFilter(btn.dataset.estatesFilter, ''));
  });
  document.querySelectorAll('#page-estates .si[data-estates-loc]').forEach(btn => {
    btn.addEventListener('click', () => setEstDirFilter('', btn.dataset.estatesLoc));
  });

  // Update about page live stats
  const totalAvail = Object.values(HOUSES).flat().filter(h => h.status === 'Available').length;
  setText('aboutEstCount', ESTATES.length);
  setText('aboutHouseCount', totalAvail);
  setText('heroEstateCount', ESTATES.length);
});

/* ═══════════════════════════════════════════════════════
   FEATURE: LIST A NEW ESTATE
═══════════════════════════════════════════════════════ */
function submitListEstate() {
  const name     = document.getElementById('leEstateName').value.trim();
  const location = document.getElementById('leLocation').value.trim();
  const desc     = document.getElementById('leDesc').value.trim();
  const mgrName  = document.getElementById('leMgrName').value.trim();
  const mgrEmail = document.getElementById('leMgrEmail').value.trim();
  const mgrPhone = document.getElementById('leMgrPhone').value.trim();
  const mgrPass  = document.getElementById('leMgrPass').value;
  const amenStr   = document.getElementById('leAmenities').value.trim();
  const units     = parseInt(document.getElementById('leUnits').value) || 0;
  const titleDeed = document.getElementById('leTitleDeed').value.trim();

  if (!name || !location || !desc || !mgrName || !mgrEmail || !mgrPhone) {
    alert('Please fill in all required fields (marked with *).'); return;
  }
  if (USERS.find(u => u.email.toLowerCase() === mgrEmail.toLowerCase())) {
    alert('A management account with this email already exists. Please sign in instead.'); return;
  }

  // Create new estate
  const newId = Math.max(...ESTATES.map(e => e.id)) + 1;
  const emojis = ['🏘️','🏢','🌆','🏠','🏰','🌇','🏙️','🏡'];
  const emoji  = emojis[newId % emojis.length];

  ESTATES.push({
    id: newId, name, emoji, location, desc,
    amenities: amenStr ? amenStr.split(',').map(a => a.trim()).filter(Boolean) : [],
    phone: mgrPhone, email: mgrEmail, managedBy: mgrName,
    totalUnits: units,
    titleDeed: titleDeed || null,
  });

  // Initialise empty data stores for this estate
  HOUSES[newId]        = [];
  REQUESTS[newId]      = [];
  ANNOUNCEMENTS[newId] = [];
  APPLICATIONS[newId]  = [];
  INQUIRIES[newId]     = [];
  ESTATE_PHOTOS[newId] = [];

  // Create management account
  const newMgr = {
    id: 'mgr-' + Date.now(), name: mgrName, email: mgrEmail,
    password: mgrPass || 'mgr123', role: 'management', estateId: newId,
  };
  USERS.push(newMgr);

  closeModal('listEstateModal');

  // Clear form
  ['leEstateName','leLocation','leDesc','leTitleDeed','leAmenities','leUnits','leYear',
   'leMgrName','leMgrEmail','leMgrPhone','leMgrPass'].forEach(id => setValue(id, ''));

  // Refresh directory
  renderEstatesDirectory();
  renderHomeEstates();

  // Update location filter options
  refreshLocationFilter();

  alert(`🎉 "${name}" is now listed on Communest!\n\nYour estate has its own page. Sign in with:\nEmail: ${mgrEmail}\nPassword: ${mgrPass || 'mgr123'}\n\nFrom your management dashboard you can add houses, post announcements, and manage tenants.`);

  // Auto sign in as the new manager and open their estate page
  currentUser = newMgr;
  const navBtn = document.getElementById('navSignInBtn');
  const initials = mgrName.split(' ').map(n => n[0]).join('').slice(0, 2);
  navBtn.textContent = initials;
  navBtn.style.cssText = 'border-radius:50%;width:34px;padding:0;height:34px;';
  navBtn.onclick = () => { if (confirm('Sign out?')) doSignout(); };
  openEstatePage(newId, 'ep-mgmt-overview');
}

function refreshLocationFilter() {
  const sel = document.getElementById('estateLocFilter');
  if (!sel) return;
  const existing = Array.from(sel.options).map(o => o.value);
  ESTATES.forEach(e => {
    const city = e.location.split(',')[0].trim();
    if (!existing.includes(city)) {
      const opt = document.createElement('option');
      opt.value = opt.textContent = city;
      sel.appendChild(opt);
    }
  });
}


/* ═══════════════════════════════════════════════════════
   FEATURE: HOUSE PHOTO GALLERY
═══════════════════════════════════════════════════════ */
function openHouseGallery(houseId, estateId, evt) {
  if (evt) evt.stopPropagation();  // don't trigger estate card click

  // Find house across all estates
  let house = null;
  for (const houses of Object.values(HOUSES)) {
    house = houses.find(h => h.id === houseId);
    if (house) break;
  }
  if (!house) return;

  galleryHouseId  = houseId;
  galleryEstateId = estateId;
  galleryActiveIdx = 0;

  document.getElementById('galleryHouseName').textContent = `${house.type} — Unit ${house.unit}`;
  document.getElementById('galleryHouseMeta').textContent =
    `${house.block} · ${house.floor} · KSh ${house.price.toLocaleString()}/month · ${house.status}`;

  // Show upload zone only for management of this estate
  const isMgr = currentUser && currentUser.role === 'management' && currentUser.estateId === estateId;
  document.getElementById('galleryUploadZone').style.display = isMgr ? 'block' : 'none';

  // Show apply button for available houses (non-tenants)
  const applyBtn = document.getElementById('galleryApplyBtn');
  if (house.status === 'Available' && (!currentUser || currentUser.role !== 'management')) {
    applyBtn.style.display = 'inline-flex';
    applyBtn.onclick = () => { closeModal('houseGalleryModal'); openApplyModal(houseId, estateId); };
  } else {
    applyBtn.style.display = 'none';
  }

  renderGallery(houseId);
  openModal('houseGalleryModal');
}

function renderGallery(houseId) {
  const photos = HOUSE_PHOTOS[houseId] || ['🏠'];
  const mainEl  = document.getElementById('galleryMain');
  const thumbEl = document.getElementById('galleryThumbs');
  if (!mainEl || !thumbEl) return;

  const activePhoto = photos[galleryActiveIdx] || photos[0];

  // Check if it's a real image URL or an emoji placeholder
  const isUrl = p => p.startsWith('data:') || p.startsWith('http') || p.startsWith('blob:');

  mainEl.innerHTML = isUrl(activePhoto)
    ? `<img src="${activePhoto}" alt="House photo" class="gallery-main-img" />`
    : `<div class="gallery-main-emoji">${activePhoto}<div class="gallery-placeholder-text">No photo uploaded yet</div></div>`;

  thumbEl.innerHTML = photos.map((p, i) => `
    <div class="gallery-thumb ${i === galleryActiveIdx ? 'active' : ''}" onclick="setGalleryPhoto(${i})">
      ${isUrl(p)
        ? `<img src="${p}" alt="Photo ${i+1}" />`
        : `<div class="gallery-thumb-emoji">${p}</div>`}
    </div>`).join('');
}

function setGalleryPhoto(idx) {
  galleryActiveIdx = idx;
  renderGallery(galleryHouseId);
}

function handlePhotoUpload(evt) {
  const files = Array.from(evt.target.files);
  if (!files.length) return;

  if (!HOUSE_PHOTOS[galleryHouseId]) HOUSE_PHOTOS[galleryHouseId] = [];

  // Remove all emoji placeholders when real photos are added
  HOUSE_PHOTOS[galleryHouseId] = HOUSE_PHOTOS[galleryHouseId].filter(p => p.startsWith('data:') || p.startsWith('http'));

  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      HOUSE_PHOTOS[galleryHouseId].push(e.target.result);
      loaded++;
      if (loaded === files.length) {
        galleryActiveIdx = HOUSE_PHOTOS[galleryHouseId].length - files.length;
        renderGallery(galleryHouseId);
      }
    };
    reader.readAsDataURL(file);
  });
  evt.target.value = ''; // reset input
}

function applyFromGallery() {
  closeModal('houseGalleryModal');
  openApplyModal(galleryHouseId, galleryEstateId);
}


/* ═══════════════════════════════════════════════════════
   FEATURE: PUBLIC INQUIRIES
═══════════════════════════════════════════════════════ */
function renderInquiryContactInfo(estate) {
  const el = document.getElementById('epInquireContactInfo');
  if (!el) return;
  el.innerHTML = `
    <div class="about-panel" style="height:fit-content">
      <div class="abox">
        <span class="abox-lbl">Contact Information</span>
        <div class="about-feats" style="margin-top:8px">
          <div class="af"><div class="af-icon">👤</div><div><h4>Manager</h4><p>${estate.managedBy}</p></div></div>
          <div class="af"><div class="af-icon">📞</div><div><h4>Phone</h4><p>${estate.phone}</p></div></div>
          <div class="af"><div class="af-icon">📧</div><div><h4>Email</h4><p>${estate.email}</p></div></div>
          <div class="af"><div class="af-icon">📍</div><div><h4>Location</h4><p>${estate.location}</p></div></div>
        </div>
      </div>
      <div class="abox abox-sky">
        <span class="abox-lbl">Response Time</span>
        <p style="color:#fff;font-size:.87rem">Management typically responds within <strong>24 hours</strong>. For urgent matters, call directly.</p>
      </div>
    </div>`;
}

function submitInquiry() {
  const eid     = activeEstateId;
  const name    = document.getElementById('inqName').value.trim();
  const phone   = document.getElementById('inqPhone').value.trim();
  const email   = document.getElementById('inqEmail').value.trim();
  const subject = document.getElementById('inqSubject').value;
  const message = document.getElementById('inqMessage').value.trim();

  if (!name || !email || !message) {
    alert('Please enter your name, email, and message.'); return;
  }

  if (!INQUIRIES[eid]) INQUIRIES[eid] = [];
  INQUIRIES[eid].push({
    id:      INQUIRIES[eid].length + 1,
    name, phone, email, subject, message,
    date:    formatDate(new Date()),
    read:    false,
  });

  // Clear form and show success
  ['inqName','inqPhone','inqEmail','inqMessage'].forEach(id => setValue(id, ''));
  const banner = document.getElementById('inqSuccessBanner');
  if (banner) { banner.style.display = 'flex'; setTimeout(() => banner.style.display = 'none', 6000); }

  // If management is viewing, refresh their inquiries panel live
  if (currentUser && currentUser.role === 'management' && currentUser.estateId === eid) {
    renderMgmtPanels();
  }
}

function markInquiryRead(inqId, estateId) {
  const inq = (INQUIRIES[estateId] || []).find(i => i.id === inqId);
  if (inq) { inq.read = true; renderMgmtPanels(); }
}



/* ═══════════════════════════════════════════════════════
   ESTATE-LEVEL PHOTO UPLOAD (management)
═══════════════════════════════════════════════════════ */
function handleEstatePhotoUpload(evt) {
  const eid   = currentUser?.estateId;
  const files = Array.from(evt.target.files);
  if (!files.length || !eid) return;
  if (!ESTATE_PHOTOS[eid]) ESTATE_PHOTOS[eid] = [];

  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      ESTATE_PHOTOS[eid].push(e.target.result);
      loaded++;
      if (loaded === files.length) renderMgmtPanels();
    };
    reader.readAsDataURL(file);
  });
  evt.target.value = '';
}

function deleteEstatePhoto(idx, eid) {
  if (!ESTATE_PHOTOS[eid]) return;
  ESTATE_PHOTOS[eid].splice(idx, 1);
  renderMgmtPanels();
}



/* ═══════════════════════════════════════════════════════
   CHATBOT — Communest Navigation Assistant
═══════════════════════════════════════════════════════ */
let chatbotOpen = false;

const CHAT_KNOWLEDGE = {
  greet: ['hi','hello','hey','good morning','good afternoon','good evening','sup'],
  browse: ['browse','estates','find home','find a home','explore','listings','list'],
  apply: ['apply','application','how to apply','house','available','rent','pricing','price','how much'],
  signin: ['sign in','login','log in','account','password','forgot','credentials','demo'],
  register: ['register','sign up','create account','new account','join'],
  tenant: ['tenant','dashboard','my estate','requests','announcements','rent','payments','lease'],
  management: ['management','manager','manage','manage houses','add house','post announcement','applications'],
  inquiry: ['inquiry','inquire','question','contact','viewing','visit'],
  about: ['about','history','developer','communest','platform','founder','team'],
  photos: ['photos','gallery','pictures','images','upload','photo'],
  dark: ['dark mode','theme','dark','light mode'],
  help: ['help','what can you do','options','menu','navigate','navigation'],
};

const CHAT_RESPONSES = {
  greet: () => `Hi there! 👋 I'm the Communest Assistant. I can help you navigate the platform.\n\nTry asking me:\n• "How do I find a house?"\n• "How do I sign in?"\n• "What is Communest?"\n• "How do I send an inquiry?"`,
  browse: () => { const avail = Object.values(HOUSES).flat().filter(h=>h.status==='Available').length; return `We currently have **${ESTATES.length} estates** listed with **${avail} available houses**.\n\nClick **Estates** in the navbar or tap the button below to browse all estates. Use the sidebar to filter by location or availability.`; },
  apply: () => `To apply for a house:\n1. Go to **Estates** and click any estate\n2. Browse the **Available Houses**\n3. Click **📷 Photos** to view the unit\n4. Click **Apply for This House** and fill in your details\n5. Management will review and connect your account once approved.`,
  signin: () => `To sign in:\n1. Click **Sign In / Register** in the top right\n2. Enter your email and password\n3. You'll be taken straight to your estate dashboard\n\nDemo accounts:\n• Tenant: shammah@email.com / ten123\n• Manager: james@sunrise.ke / mgr123`,
  register: () => `To create an account:\n1. Click **Sign In / Register** in the top navbar\n2. Switch to the **Register** tab\n3. Fill in your name, email, phone, and password\n4. After registering, browse estates and apply for a house — management will connect you once approved.`,
  tenant: () => `As a tenant, your dashboard gives you:\n• 📊 **Overview** — quick summary of your estate\n• 🔧 **My Requests** — submit and track maintenance issues\n• 📢 **Announcements** — estate notices from management\n• 💳 **Rent & Payments** — payment history\n• 📄 **My Lease** — your lease details and dates\n\nSign in with your estate credentials to access these.`,
  management: () => `As a manager, your dashboard includes:\n• 📊 Overview & stats\n• 🔧 Tenant requests\n• 📢 Post announcements\n• 👥 Manage tenants\n• 📋 Review applications\n• 🏠 Add / manage houses\n• 🖼️ Upload estate photos\n• 💬 View public inquiries`,
  inquiry: () => `To send an inquiry to an estate:\n1. Go to **Estates** and click the estate you're interested in\n2. Click **💬 Send Inquiry** in the sidebar\n3. Fill in your name, email, phone, subject and message\n4. Management will respond within 24 hours.`,
  about: () => `Communest was founded in 2026 by **Kipngeno Shammah Kiplangat**, a Nairobi-based developer.\n\nIt's a digital estate management platform built to serve landlords and tenants across Kenya.\n\nClick **About** in the navbar to read the full story.`,
  photos: () => `Each house listing has a photo gallery. Click the **📷 Photos** button on any house card to view uploaded photos.\n\nIf you're a manager, you can:\n• Upload house photos via the gallery in **Manage Houses**\n• Upload estate-wide photos in **🖼️ Estate Photos** panel`,
  dark: () => `The platform uses a dark theme throughout for a comfortable experience on all devices.`,
  help: () => `I can help you with:\n• 🏙️ Browsing estates\n• 🏠 Finding & applying for houses\n• 🔑 Signing in or registering\n• 💬 Sending inquiries\n• 📊 Using your tenant or management dashboard\n• ℹ️ Learning about Communest\n\nJust type your question!`,
};

function matchChatIntent(msg) {
  const m = msg.toLowerCase();
  for (const [intent, keywords] of Object.entries(CHAT_KNOWLEDGE)) {
    if (keywords.some(kw => m.includes(kw))) return intent;
  }
  return null;
}

function chatBubble(text, from) {
  const msgs = document.getElementById('chatbotMsgs');
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg-wrap' + (from === 'user' ? ' user' : '');

  if (from === 'bot') {
    const av = document.createElement('div');
    av.className = 'chat-msg-mini-avatar';
    av.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="18" height="13" rx="3" fill="#4FC3F7" opacity=".85"/><rect x="7" y="11" width="3" height="3" rx="1.5" fill="#071422"/><rect x="14" y="11" width="3" height="3" rx="1.5" fill="#071422"/><rect x="11" y="4" width="2" height="4" rx="1" fill="#4FC3F7" opacity=".6"/><circle cx="12" cy="3.5" r="1.5" fill="#4FC3F7"/></svg>';
    wrap.appendChild(av);
  }

  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg-' + from;
  div.innerHTML = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  wrap.appendChild(div);
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;

  // Hide suggestions once conversation starts
  const sugg = document.getElementById('chatbotSuggestions');
  if (sugg && msgs.children.length > 2) sugg.style.display = 'none';
}

function chatTyping() {
  const msgs = document.getElementById('chatbotMsgs');
  const wrap = document.createElement('div');
  wrap.className = 'chat-typing-wrap';
  wrap.id = 'chatTyping';

  const av = document.createElement('div');
  av.className = 'chat-msg-mini-avatar';
  av.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="18" height="13" rx="3" fill="#4FC3F7" opacity=".85"/><rect x="7" y="11" width="3" height="3" rx="1.5" fill="#071422"/><rect x="14" y="11" width="3" height="3" rx="1.5" fill="#071422"/><rect x="11" y="4" width="2" height="4" rx="1" fill="#4FC3F7" opacity=".6"/><circle cx="12" cy="3.5" r="1.5" fill="#4FC3F7"/></svg>';
  wrap.appendChild(av);

  const dots = document.createElement('div');
  dots.className = 'chat-typing';
  dots.innerHTML = '<span></span><span></span><span></span>';
  wrap.appendChild(dots);

  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendChatMsg() {
  const input = document.getElementById('chatbotInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  chatBubble(msg, 'user');
  chatTyping();
  setTimeout(() => {
    document.getElementById('chatTyping')?.remove();
    const intent = matchChatIntent(msg);
    const reply = intent
      ? CHAT_RESPONSES[intent]()
      : `I'm not sure about that, but here's what I can help with:\n• Browse estates → click "Estates" in the navbar\n• Find a house → go to any estate and view Available Houses\n• Sign in → click "Sign In / Register" top right\n• Send inquiry → open an estate and click "💬 Send Inquiry"\n\nType "help" for a full list of topics!`;
    chatBubble(reply, 'bot');
  }, 800);
}

function quickChat(msg) {
  document.getElementById('chatbotInput').value = msg;
  sendChatMsg();
}

function toggleChatbot() {
  chatbotOpen = !chatbotOpen;
  const widget = document.getElementById('chatbotWidget');
  const fab    = document.getElementById('chatbotFab');
  widget.classList.toggle('open', chatbotOpen);
  fab.classList.toggle('hidden', chatbotOpen);
  if (chatbotOpen && document.getElementById('chatbotMsgs').children.length === 0) {
    setTimeout(() => chatBubble(CHAT_RESPONSES.greet(), 'bot'), 300);
  }
  if (chatbotOpen) setTimeout(() => document.getElementById('chatbotInput')?.focus(), 350);
}


/* ═══════════════════════════════════════════════════════
   MOBILE SIDEBAR TOGGLE — Estates Directory
═══════════════════════════════════════════════════════ */
let estatesSidebarOpen = false;

/* ── Sidebar open/close toggles ───────────────────────────────── */
function toggleDirSidebar() {
  const layout  = document.querySelector('#page-estates .dash-layout');
  const overlay = document.getElementById('dirSbOverlay');
  if (!layout) return;
  const opening = !layout.classList.contains('sb-open');
  layout.classList.toggle('sb-open', opening);
  if (overlay) overlay.classList.toggle('visible', opening && window.innerWidth <= 768);
}

function toggleEstateSidebar() {
  const layout  = document.querySelector('#page-estate .dash-layout');
  const overlay = document.getElementById('estateSbOverlay');
  if (!layout) return;
  const opening = !layout.classList.contains('sb-open');
  layout.classList.toggle('sb-open', opening);
  if (overlay) overlay.classList.toggle('visible', opening && window.innerWidth <= 768);
}

// Open sidebars by default on desktop when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) {
    const dirLayout    = document.querySelector('#page-estates .dash-layout');
    const estateLayout = document.querySelector('#page-estate .dash-layout');
    if (dirLayout)    dirLayout.classList.add('sb-open');
    if (estateLayout) estateLayout.classList.add('sb-open');
  }
});