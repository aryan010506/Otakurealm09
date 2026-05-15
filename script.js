const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        
        // Back to Top Visibility
        const btt = document.getElementById('back-to-top');
        if (btt) {
            if (window.scrollY > 300) {
                btt.classList.add('visible');
            } else {
                btt.classList.remove('visible');
            }
        }
    });
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const btt = document.createElement('button');
    btt.id = 'back-to-top';
    btt.innerHTML = '↑';
    btt.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btt);
    
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== MOBILE NAV HAMBURGER =====
function initMobileNav() {
    const hamburger = document.getElementById('nav-toggle');
    const navLinks  = document.querySelector('.nav-links');
    const searchBar = document.querySelector('.search-bar');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);

        // Show/hide search bar alongside menu
        if (searchBar) {
            searchBar.classList.toggle('nav-open', isOpen);
        }
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            if (searchBar) searchBar.classList.remove('nav-open');
        });
    });

    // Close menu when clicking outside nav
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.manga-nav')) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            if (searchBar) searchBar.classList.remove('nav-open');
        }
    });
}

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
            a.classList.remove('active');
            if (href === '#' + current) a.classList.add('active');
        }
    });
});

// ===== STAT COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');
let statAnimated = false;
function animateStats() {
    if (statAnimated) return;
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        statAnimated = true;
        statNums.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const start = performance.now();
            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
}
window.addEventListener('scroll', animateStats);
animateStats();

// ===== INTERSECTION OBSERVER FOR CARDS =====
const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.rank-panel, .genre-panel, .summary-block, .feature, .cat-panel, .article-card, .info-card, .top-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ===== API HELPER =====
async function apiPost(url, data) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        return { error: 'Network error. Please try again.' };
    }
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        const btn = newsletterForm.querySelector('button');
        btn.textContent = 'Subscribing...';
        const result = await apiPost('/api/newsletter', { email });
        if (result.success) {
            showToast(result.message, 'success');
            btn.textContent = 'Subscribed! ✓';
            newsletterForm.querySelector('input').value = '';
            setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
        } else {
            showToast(result.error || 'Failed to subscribe', 'error');
            btn.textContent = 'Subscribe';
        }
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('contact-submit');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        const data = {
            name:    document.getElementById('contact-name').value,
            email:   document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };
        const result = await apiPost('/api/contact', data);
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        if (result.success) {
            showToast('Message sent successfully! ✅', 'success');
            contactForm.style.display = 'none';
            document.getElementById('contact-success').style.display = 'block';
        } else {
            showToast(result.error || 'Failed to send message', 'error');
        }
    });
}

// ===== WATCHLIST SYSTEM =====
function initWatchlist() {
    // Shared state
    window.getWatchlist = () => JSON.parse(localStorage.getItem('anime-watchlist') || '[]');
    
    window.toggleWatchlist = (anime) => {
        let watchlist = window.getWatchlist();
        const index = watchlist.findIndex(a => String(a.id) === String(anime.id));
        
        if (index > -1) {
            watchlist.splice(index, 1);
            showToast('Removed from Watchlist 🗑️', 'info');
        } else {
            watchlist.push(anime);
            showToast('Added to Watchlist! ★', 'success');
        }
        localStorage.setItem('anime-watchlist', JSON.stringify(watchlist));
        
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { animeId: anime.id } }));
    };
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initWatchlist();
    initPageTransitions();
    initBackToTop();
});
