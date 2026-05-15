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

// ── Sign Up ───────────────────────────────────────────────────
function authSignup({ name, age, email, password }) {
    const users = getUsers();
    if (users[email]) {
        return { success: false, error: 'An account with this email already exists.' };
    }
    if (!name || name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters.' };
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
        return { success: false, error: 'Please enter a valid age (5–120).' };
    }
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const hashed = btoa(unescape(encodeURIComponent(password)));
    users[email] = { name: name.trim(), age: ageNum, email, password: hashed, createdAt: Date.now() };
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    return { success: true, user: users[email] };
}

// ── Login ──────────────────────────────────────────────────────
function authLogin({ email, password }) {
    const users = getUsers();
    const user = users[email];
    if (!user) {
        return { success: false, error: 'No account found with that email.' };
    }
    const hashed = btoa(unescape(encodeURIComponent(password)));
    if (user.password !== hashed) {
        return { success: false, error: 'Incorrect password.' };
    }
    localStorage.setItem(SESSION_KEY, email);
    return { success: true, user };
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
window.Auth = {
    signup: authSignup,
    login: authLogin,
    logout: authLogout,
    getCurrentUser,
    getUserWatchlist,
    saveUserWatchlist
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
