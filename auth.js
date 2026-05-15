/* ============================================================
   OTAKU REALM — Authentication System (localStorage-based)
   Supports: signup (name, age, email, password) + login
   Watchlists are stored per-user under key: watchlist-{email}
   ============================================================ */

const AUTH_KEY = 'otaku-users';
const SESSION_KEY = 'otaku-session';

// ── Helpers ────────────────────────────────────────────────────
function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const users = getUsers();
    return users[email] || null;
}

function watchlistKey(email) {
    return 'watchlist-' + email;
}

// ── Sign Up ──
async function authSignup({ name, age, email, password }) {
    if (!window.db) return { success: false, error: 'Database connection error. Try again later.' };

    const users = getUsers();
    
    // Check Firebase for existing email
    const usersRef = window.db.collection('users');
    const q = await usersRef.where('email', '==', email).get();
    if (!q.empty || users[email]) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    if (!name || name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters.' };
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
        return { success: false, error: 'Please enter a valid age (5-120).' };
    }
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
    }
    
    const hashed = btoa(unescape(encodeURIComponent(password)));
    const userData = { name: name.trim(), age: ageNum, email: email, password: hashed, createdAt: Date.now() };
    
    try {
        // Save to Firebase
        await usersRef.add(userData);
        
        // Save to Local Cache for synchronous reads across the site
        users[email] = userData;
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, email);
        
        return { success: true, user: userData };
    } catch (e) {
        console.error("Firebase Auth Error:", e);
        return { success: false, error: 'Failed to create account in the cloud.' };
    }
}

// ── Login ──
async function authLogin({ email, password }) {
    if (!window.db) return { success: false, error: 'Database connection error. Try again later.' };

    try {
        const usersRef = window.db.collection('users');
        const q = await usersRef.where('email', '==', email).get();
        
        if (q.empty) {
            return { success: false, error: 'No account found with that email.' };
        }
        
        const userDoc = q.docs[0];
        const user = userDoc.data();
        
        const hashed = btoa(unescape(encodeURIComponent(password)));
        if (user.password !== hashed) {
            return { success: false, error: 'Incorrect password.' };
        }
        
        // Save to Local Cache
        const users = getUsers();
        users[email] = user;
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, email);
        
        return { success: true, user };
    } catch (e) {
        console.error("Firebase Auth Error:", e);
        return { success: false, error: 'Failed to verify account with the cloud.' };
    }
}

// ── Logout ─────────────────────────────────────────────────────
function authLogout() {
    localStorage.removeItem(SESSION_KEY);
}

// ── Watchlist (per-user) ────────────────────────────────────────
function getUserWatchlist() {
    const user = getCurrentUser();
    if (!user) return JSON.parse(localStorage.getItem('anime-watchlist') || '[]');
    return JSON.parse(localStorage.getItem(watchlistKey(user.email)) || '[]');
}

function saveUserWatchlist(list) {
    const user = getCurrentUser();
    if (!user) {
        localStorage.setItem('anime-watchlist', JSON.stringify(list));
        return;
    }
    localStorage.setItem(watchlistKey(user.email), JSON.stringify(list));
}

// ── Expose globally ────────────────────────────────────────────
// ── Update Avatar ──────────────────────────────────────────────
function updateUserAvatar(avatarBase64) {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return { success: false, error: 'Not logged in.' };
    
    const users = getUsers();
    if (users[email]) {
        users[email].avatar = avatarBase64;
        saveUsers(users);
        return { success: true, user: users[email] };
    }
    return { success: false, error: 'User not found in db.' };
}

window.Auth = {
    signup: authSignup,
    login: authLogin,
    logout: authLogout,
    getCurrentUser,
    getUserWatchlist,
    saveUserWatchlist,
    updateUserAvatar
};

// ── Nav path helper ────────────────────────────────────────────
function getLoginPagePath() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
}

// ── Update nav to reflect login state ─────────────────────────
function updateNavAuth() {
    const user = getCurrentUser();
    const container = document.getElementById('nav-auth-btn');
    if (!container) return;

    if (user) {
        container.innerHTML = `
            <div class="nav-user-menu" id="nav-user-menu">
                <button class="btn btn-manga-alt nav-user-btn" id="nav-user-trigger"
                    style="font-size:0.8rem; padding:0.2rem 0.7rem; white-space:nowrap;">
                    ⚡ ${user.name.toUpperCase().split(' ')[0]} ▾
                </button>
                <div class="nav-user-dropdown" id="nav-user-dropdown">
                    <a href="${getLoginPagePath()}profile.html" class="dropdown-item">👤 MY PROFILE</a>
                    <a href="${getLoginPagePath()}watchlist.html" class="dropdown-item">📋 MY WATCHLIST</a>
                    <button class="dropdown-item" id="nav-logout-btn">🚪 LOGOUT</button>
                </div>
            </div>`;

        const trigger = document.getElementById('nav-user-trigger');
        const dd      = document.getElementById('nav-user-dropdown');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dd.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('nav-user-menu');
            if (menu && !menu.contains(e.target)) {
                const d = document.getElementById('nav-user-dropdown');
                if (d) d.classList.remove('open');
            }
        });
        document.getElementById('nav-logout-btn').addEventListener('click', () => {
            authLogout();
            typeof showToast === 'function' && showToast('Logged out. See you next time! 👋', 'info');
            setTimeout(() => window.location.reload(), 800);
        });

    } else {
        const loginPath = getLoginPagePath() + 'login.html';
        container.innerHTML = `<a href="${loginPath}" class="btn btn-manga"
            style="font-size:0.8rem; padding:0.2rem 0.8rem; text-decoration:none; white-space:nowrap;">
            LOGIN / SIGN UP</a>`;
    }
}

document.addEventListener('DOMContentLoaded', updateNavAuth);
