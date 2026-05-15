/* ============================================================
   OTAKU REALM ? Comment System (localStorage-based)
   Auto-injects a comment section on all article & anime pages.
   Comments stored per-page; linked to authenticated users.
   ============================================================ */

const COMMENT_PREFIX = 'otaku-comments-';

// -- Storage helpers --------------------------------------------
function getPageComments(pageId) {
    return JSON.parse(localStorage.getItem(COMMENT_PREFIX + pageId) || '[]');
}
function savePageComments(pageId, comments) {
    localStorage.setItem(COMMENT_PREFIX + pageId, JSON.stringify(comments));
}

// -- Add a comment ----------------------------------------------
function addComment(pageId, pageTitle, text) {
    if (!window.Auth) return { success: false, error: 'Auth not loaded.' };
    const user = window.Auth.getCurrentUser();
    if (!user) return { success: false, error: 'LOGIN_REQUIRED' };
    const trimmed = text ? text.trim() : '';
    if (trimmed.length < 2)  return { success: false, error: 'Comment is too short.' };
    if (trimmed.length > 500) return { success: false, error: 'Max 500 characters allowed.' };

    const comments = getPageComments(pageId);
    const comment = {
        id:        Date.now().toString(36) + Math.random().toString(36).slice(2),
        userEmail: user.email,
        userName:  user.name,
        text:      trimmed,
        timestamp: Date.now(),
        pageId,
        pageTitle
    };
    comments.push(comment);
    savePageComments(pageId, comments);
    return { success: true, comment };
}

// -- Get ALL comments by a specific user (across all pages) ----
function getAllUserComments(email) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(COMMENT_PREFIX));
    const results = [];
    keys.forEach(key => {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.filter(c => c.userEmail === email).forEach(c => results.push(c));
    });
    return results.sort((a, b) => b.timestamp - a.timestamp);
}

// -- Utils ------------------------------------------------------
function escapeHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
         + ' at '
         + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

// -- Render single comment card HTML ---------------------------
function renderCommentCard(c) {
    return `
        <div class="comment-card" id="c-${c.id}">
            <div class="comment-header">
                <span class="comment-author">? ${escapeHtml(c.userName.toUpperCase())}</span>
                <span class="comment-time">${formatTime(c.timestamp)}</span>
            </div>
            <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>`;
}

// -- Get path to login page -------------------------------------
function getLoginPath() {
    return window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
}

// -- Inject full comment section before <footer> ---------------
function injectCommentSection(pageId, pageTitle) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const user     = window.Auth ? window.Auth.getCurrentUser() : null;
    const comments = getPageComments(pageId);

    const inputArea = user
        ? `<div class="comment-form-wrap">
               <textarea id="comment-input" placeholder="SHARE YOUR THOUGHTS ON ${escapeHtml(pageTitle.toUpperCase())}..." maxlength="500" rows="4"></textarea>
               <div class="comment-form-footer">
                   <span id="comment-char-count" style="font-size:0.75rem;font-weight:700;opacity:0.6;">0 / 500</span>
                   <button id="comment-submit" class="btn btn-manga" style="font-size:0.8rem;padding:0.3rem 1rem;">POST COMMENT ??</button>
               </div>
           </div>`
        : `<div class="comment-login-prompt">
               <a href="${getLoginPath()}" class="btn btn-manga">LOGIN TO COMMENT</a>
               <span style="font-size:0.85rem;font-weight:700;opacity:0.6;margin-left:1rem;">? Join the discussion!</span>
           </div>`;

    const commentsHtml = comments.length === 0
        ? '<p style="font-weight:700;opacity:0.5;text-align:center;padding:3rem 1rem;border:3px dashed var(--gray-light);">NO COMMENTS YET ? BE THE FIRST! ??</p>'
        : comments.map(renderCommentCard).join('');

    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'comments-section';
    section.style.borderTop = '4px solid var(--black)';
    section.innerHTML = `
        <div class="container">
            <div class="section-header manga-header" style="margin-bottom:2rem;">
                <h2 class="section-title">COMMENTS <span>&amp; DISCUSSION</span></h2>
                <div class="header-line"></div>
                <p style="font-weight:700;opacity:0.6;font-size:0.85rem;margin-top:0.5rem;">${comments.length} comment${comments.length !== 1 ? 's' : ''} on this page</p>
            </div>
            ${inputArea}
            <div id="comments-list">
                ${commentsHtml}
            </div>
        </div>`;

    footer.parentNode.insertBefore(section, footer);

    // -- Bind submit handler ------------------------------------
    if (user) {
        const input     = document.getElementById('comment-input');
        const counter   = document.getElementById('comment-char-count');
        const submitBtn = document.getElementById('comment-submit');

        input.addEventListener('input', () => {
            counter.textContent = `${input.value.length} / 500`;
        });

        submitBtn.addEventListener('click', () => {
            const result = addComment(pageId, pageTitle, input.value);
            if (result.success) {
                const list = document.getElementById('comments-list');
                // Remove empty-state message if present
                const emptyMsg = list.querySelector('p');
                if (emptyMsg) list.innerHTML = '';
                list.insertAdjacentHTML('afterbegin', renderCommentCard(result.comment));
                input.value = '';
                counter.textContent = '0 / 500';
                // Update comment count
                const countEl = section.querySelector('.section-header p');
                const newCount = getPageComments(pageId).length;
                if (countEl) countEl.textContent = `${newCount} comment${newCount !== 1 ? 's' : ''} on this page`;
                typeof showToast === 'function' && showToast('Comment posted! ??', 'success');
            } else if (result.error === 'LOGIN_REQUIRED') {
                typeof showToast === 'function' && showToast('Please log in to comment.', 'error');
            } else {
                typeof showToast === 'function' && showToast(result.error, 'error');
            }
        });
    }
}

// -- Auto-detect page on DOMContentLoaded ---------------------
document.addEventListener('DOMContentLoaded', () => {
    // Wait a tick so auth.js finishes
    setTimeout(() => {
        const path = window.location.pathname;

        const pageMap = {
                        'index.html':      'Otaku Realm Homepage',
            'reviews':         'Reviews & Recommendations',
            'character-dives': 'Character Deep Dives',
            'watch-orders':    'Watch Orders',
            'top-lists':       'Top Lists',
            'manga-vs-anime':  'Manga vs Anime',
            'explainers':      'Anime Explainers'
        };

        if (path === '/' || path === '/index.html') { injectCommentSection('index', 'Otaku Realm Homepage'); return; }

        for (const [key, title] of Object.entries(pageMap)) {
            if (path.includes(key)) {
                injectCommentSection(key, title);
                return;
            }
        }

        // Anime detail page ? use MAL ID as key
        if (path.includes('anime-detail')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                const pageTitle = document.title || 'Anime Discussion';
                injectCommentSection(`anime-${id}`, pageTitle);
            }
        }
    }, 100);
});

// -- Expose globally --------------------------------------------
window.Comments = {
    getPageComments,
    getAllUserComments,
    addComment
};
