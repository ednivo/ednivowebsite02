/* ════════════════════════════════════════════════
   Ednivo Auth System — auth.js
   Handles: OTP email sending, user registration,
   login recording via Google Apps Script
════════════════════════════════════════════════ */

// Paste your NEW Google Apps Script /exec URL here.
// This single URL handles OTP, login, registration AND bookings.
// Deploy Code.gs from google-apps-script/Code.gs → get the URL → paste below.
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzES3-7gsMZEHcypqnYpIYp6897rw6Kz4XCVH_8yts40NPFXP-fZ2v31S9YOxASeMbi/exec'; // ← UPDATE THIS

/* ── SEND OTP EMAIL ─────────────────────────────
   Calls Apps Script which uses GmailApp to send
   the OTP to the user's email address
─────────────────────────────────────────────── */
function sendOTPEmail(email, name, otp) {
  return new Promise(function(resolve, reject) {
    var fd = new FormData();
    
  // Backend email configuration: route operational notifications through Ednivo.
  fd.append('sender_email', 'ednivo.education@gmail.com');
  fd.append('from_email', 'ednivo.education@gmail.com');
  fd.append('reply_to', 'ednivo.education@gmail.com');
  fd.append('notification_email', 'ednivo.education@gmail.com');
fd.append('sheetTarget', 'sendOTP');
    fd.append('email',  email);
    fd.append('name',   name);
    fd.append('otp',    otp);
    fd.append('expiry', new Date(Date.now() + 10*60*1000).toLocaleString());

    fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd })
      .then(function() { resolve(); })
      .catch(function(err) { reject(err); });
  });
}

/* ── SAVE NEW USER TO SHEET ─────────────────────
   Writes to "Users" tab in Google Sheet
─────────────────────────────────────────────── */
function saveUserToSheet(userData) {
  return new Promise(function(resolve, reject) {
    var fd = new FormData();
    
  // Backend email configuration: route operational notifications through Ednivo.
  fd.append('sender_email', 'ednivo.education@gmail.com');
  fd.append('from_email', 'ednivo.education@gmail.com');
  fd.append('reply_to', 'ednivo.education@gmail.com');
  fd.append('notification_email', 'ednivo.education@gmail.com');
fd.append('sheetTarget',  'newUser');
    fd.append('role',         userData.role       || '');
    fd.append('name',         userData.name       || '');
    fd.append('email',        userData.email      || '');
    fd.append('phone',        userData.phone      || '');
    fd.append('grade',        userData.grade      || '');
    fd.append('country',      userData.country    || '');
    fd.append('childName',    userData.childName  || '');
    fd.append('childGrade',   userData.childGrade || '');
    fd.append('signupDate',   new Date().toLocaleString());

    fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd })
      .then(function() { resolve(); })
      .catch(function(err) { reject(err); });
  });
}

/* ── LOG LOGIN ATTEMPT ──────────────────────────
   Writes to "Logins" tab in Google Sheet
─────────────────────────────────────────────── */
function recordLogin(email, name, role) {
  return new Promise(function(resolve, reject) {
    var fd = new FormData();
    
  // Backend email configuration: route operational notifications through Ednivo.
  fd.append('sender_email', 'ednivo.education@gmail.com');
  fd.append('from_email', 'ednivo.education@gmail.com');
  fd.append('reply_to', 'ednivo.education@gmail.com');
  fd.append('notification_email', 'ednivo.education@gmail.com');
fd.append('sheetTarget', 'loginRecord');
    fd.append('email',       email);
    fd.append('name',        name  || '');
    fd.append('role',        role  || '');
    fd.append('loginDate',   new Date().toLocaleString());
    fd.append('device',      navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop');
    fd.append('timezone',    Intl.DateTimeFormat().resolvedOptions().timeZone || '');

    fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd })
      .then(function() { resolve(); })
      .catch(function(err) { reject(err); });
  });
}

/* ── LOG LOGIN ATTEMPT (pre-OTP) ────────────────
   Tracks when someone initiates a login
─────────────────────────────────────────────── */
function logLoginAttempt(email) {
  var fd = new FormData();
  
  // Backend email configuration: route operational notifications through Ednivo.
  fd.append('sender_email', 'ednivo.education@gmail.com');
  fd.append('from_email', 'ednivo.education@gmail.com');
  fd.append('reply_to', 'ednivo.education@gmail.com');
  fd.append('notification_email', 'ednivo.education@gmail.com');
fd.append('sheetTarget', 'loginAttempt');
  fd.append('email',       email);
  fd.append('date',        new Date().toLocaleString());
  fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd }).catch(function(){});
}


/* ── LOCAL USER HELPERS ─────────────────────────
   Keeps each browser profile keyed by email so logging in with a
   different email cannot inherit another user's name or role.
─────────────────────────────────────────────── */
function getUserDirectory() {
  try {
    var users = JSON.parse(localStorage.getItem('ednivo_users') || '{}');
    return users && typeof users === 'object' ? users : {};
  } catch (e) { return {}; }
}

function saveUserDirectoryEntry(user) {
  if (!user || !user.email) return;
  var users = getUserDirectory();
  users[String(user.email).trim().toLowerCase()] = {
    name: user.name || '',
    email: String(user.email).trim().toLowerCase(),
    role: user.role || 'student'
  };
  localStorage.setItem('ednivo_users', JSON.stringify(users));
}

function getUserByEmail(email) {
  var key = String(email || '').trim().toLowerCase();
  if (!key) return null;
  var users = getUserDirectory();
  if (users[key]) return users[key];

  // Backward compatibility with accounts created before the directory existed.
  var legacy = getCurrentUser();
  if (legacy && legacy.email && String(legacy.email).trim().toLowerCase() === key) {
    saveUserDirectoryEntry(legacy);
    return { name: legacy.name || '', email: key, role: legacy.role || 'student' };
  }
  return null;
}

function getSafeRedirect() {
  try {
    var redirect = new URLSearchParams(window.location.search).get('redirect');
    if (!redirect) return '';
    var url = new URL(redirect, window.location.href);
    return url.origin === window.location.origin ? url.href : '';
  } catch (e) { return ''; }
}

/* ── GET CURRENT USER ───────────────────────── */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('pw_user') || '{}');
  } catch(e) {
    return {};
  }
}

/* ── IS LOGGED IN ───────────────────────────── */
function isLoggedIn() {
  var u = getCurrentUser();
  return u && u.loggedIn === true;
}

/* ── LOGOUT ─────────────────────────────────── */
function logout() {
  localStorage.removeItem('pw_user');
  try{sessionStorage.removeItem('ednivo_otp_verified_email');}catch(e){}
  window.location.href = 'login.html';
}

/* ── AUTH GUARD ─────────────────────────────────
   Call this on protected pages to redirect
   unauthenticated users to login
─────────────────────────────────────────────── */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
  }
}

/* ── UPDATE NAV FOR LOGGED IN STATE ────────────
   Call this on index.html to show user state
─────────────────────────────────────────────── */
function updateNavAuth() {
  var u = getCurrentUser();
  var navCta = document.querySelector('.student-login-link');
  if (!navCta) return;
  if (u && u.loggedIn) {
    var first=(u.name||'Student').split(' ')[0];
    navCta.textContent='◉ '+first;
    navCta.href='student-dashboard.html';
    navCta.style.background='var(--teal)';
    navCta.style.color='#fff';
    navCta.style.borderRadius='10px';
    navCta.style.padding='9px 12px';
  }
}

// Auto-update nav on every page
document.addEventListener('DOMContentLoaded', function() {
  updateNavAuth();
});

/* ── Supabase auth bridge (optional, free tier) ─────────────── */
async function ednivoSignUp(credentials, profile){
  if(!window.EDNIVO_DB || !window.EDNIVO_DB.configured) {
    saveUserDirectoryEntry({...profile,email:credentials.email});
    localStorage.setItem('pw_user', JSON.stringify({...profile,email:credentials.email,loggedIn:true}));
    return {local:true};
  }
  await window.EDNIVO_DB.ready;
  var {data,error}=await window.ednivoSupabase.auth.signUp({email:credentials.email,password:credentials.password,options:{data:{name:profile.name,role:profile.role||'student'}}});
  if(error) throw error;
  if(data.user){
    await window.EDNIVO_DB.saveProfile({id:data.user.id,role:profile.role||'student',name:profile.name,email:credentials.email,phone:profile.phone||'',country:profile.country||'',curriculum:profile.curriculum||'',grade:profile.grade||'',target_score:profile.target_score||null});
    localStorage.setItem('pw_user',JSON.stringify({id:data.user.id,name:profile.name,email:credentials.email,role:profile.role||'student',loggedIn:!!data.session}));
  }
  return data;
}
async function ednivoSignIn(email,password){
  if(!window.EDNIVO_DB || !window.EDNIVO_DB.configured) return null;
  await window.EDNIVO_DB.ready;
  var {data,error}=await window.ednivoSupabase.auth.signInWithPassword({email,password});
  if(error) throw error;
  var p=await window.EDNIVO_DB.getProfile(data.user.id);
  var user={id:data.user.id,name:p?.name||data.user.user_metadata?.name||'',email:data.user.email,role:p?.role||'student',loggedIn:true};
  localStorage.setItem('pw_user',JSON.stringify(user));
  return user;
}
async function ednivoSignOut(){
  if(window.EDNIVO_DB?.configured && window.ednivoSupabase) await window.ednivoSupabase.auth.signOut();
  logout();
}
