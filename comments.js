/* ============================================================
   OTAKU REALM — Firebase Comments Engine
   ============================================================ */

// ── Utils ──────────────────────────────────────────────────────
function escapeHtml(str) {
    if (!str) return '';
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
function getLoginPath() {
    return window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
}

// ── Render single comment card HTML ───────────────────────────
function renderCommentCard(c, isReply = false) {
    let avatarHtml = `<span class="comment-avatar-text">${escapeHtml(c.userName[0].toUpperCase())}</span>`;
    if (c.userAvatar) {
        if (c.userAvatar.startsWith('data:image')) {
            avatarHtml = `<img src="${c.userAvatar}" class="comment-avatar-img" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`;
        } else {
            avatarHtml = `<span class="comment-avatar-icon">${escapeHtml(c.userAvatar)}</span>`;
        }
    }

    const user = window.Auth ? window.Auth.getCurrentUser() : null;

    // Only allow replying to top-level comments to keep it 1-level deep
    let replyActionHtml = '';
    if (!isReply && user) {
        replyActionHtml = `<button class="reply-toggle-btn" onclick="window.Comments.toggleReplyBox('${c.id}')">REPLY</button>`;
    } else if (!isReply && !user) {
        replyActionHtml = `<a href="${getLoginPath()}" class="reply-toggle-btn" style="text-decoration:none;">LOGIN TO REPLY</a>`;
    }

    let replyBoxHtml = '';
    if (!isReply && user) {
        replyBoxHtml = `
            <div id="reply-box-${c.id}" class="reply-box-container" style="display:none; margin-top: 1rem; border-top: 2px dashed var(--gray-light); padding-top: 1rem;">
                <textarea id="reply-input-${c.id}" placeholder="Write a reply..." maxlength="500" rows="2" style="width:100%; border:2px solid var(--black); padding:0.5rem; font-family:var(--font-manga); font-size:0.9rem; resize:vertical;"></textarea>
                <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
                    <button class="btn btn-manga-alt" style="font-size:0.75rem; padding:0.2rem 0.8rem;" onclick="window.Comments.toggleReplyBox('${c.id}')">CANCEL</button>
                    <button class="btn btn-manga" style="font-size:0.75rem; padding:0.2rem 0.8rem;" onclick="window.Comments.submitReply('${c.id}', '${escapeHtml(c.pageId)}', '${escapeHtml(c.pageTitle)}')">POST REPLY</button>
                </div>
            </div>`;
    }

    return `
        <div class="comment-card ${isReply ? 'nested-reply-card' : ''}" id="c-${c.id}" style="${isReply ? 'border: 2px solid var(--gray-light); margin-bottom: 1rem; background: var(--bg-color);' : ''}">
            <div class="comment-header">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <div class="comment-avatar" style="width:28px; height:28px; border:2px solid var(--black); display:flex; align-items:center; justify-content:center; background:var(--black); color:var(--white); font-weight:900; font-size:0.85rem; flex-shrink:0;">
                        ${avatarHtml}
                    </div>
                    <span class="comment-author" style="background:none; color:var(--black); padding:0; border:none; letter-spacing:0.02em;">${escapeHtml(c.userName.toUpperCase())}</span>
                </div>
                <span class="comment-time">${formatTime(c.timestamp)}</span>
            </div>
            <p class="comment-text">${escapeHtml(c.text)}</p>
            <div class="comment-actions" style="margin-top: 0.5rem;">
                ${replyActionHtml}
            </div>
            ${replyBoxHtml}
        </div>`;
}

// ── Inject full comment section before <footer> ───────────────
function injectCommentSection(pageId, pageTitle) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const user = window.Auth ? window.Auth.getCurrentUser() : null;

    const inputArea = user
        ? `<div class="comment-form-wrap">
               <textarea id="comment-input" placeholder="SHARE YOUR THOUGHTS ON ${escapeHtml(pageTitle.toUpperCase())}..." maxlength="500" rows="4"></textarea>
               <div class="comment-form-footer">
                   <span id="comment-char-count" style="font-size:0.75rem;font-weight:700;opacity:0.6;">0 / 500</span>
                   <button id="comment-submit" class="btn btn-manga" style="font-size:0.8rem;padding:0.3rem 1rem;">POST COMMENT 💬</button>
               </div>
           </div>`
        : `<div class="comment-login-prompt">
               <a href="${getLoginPath()}" class="btn btn-manga">LOGIN TO COMMENT</a>
               <span style="font-size:0.85rem;font-weight:700;opacity:0.6;margin-left:1rem;">- Join the discussion!</span>
           </div>`;

    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'comments-section';
    section.style.borderTop = '4px solid var(--black)';
    section.innerHTML = `
        <div class="container">
            <div class="section-header manga-header" style="margin-bottom:2rem;">
                <h2 class="section-title">COMMENTS <span>&amp; DISCUSSION</span></h2>
                <div class="header-line"></div>
                <p id="comments-count" style="font-weight:700;opacity:0.6;font-size:0.85rem;margin-top:0.5rem;">Loading comments...</p>
            </div>
            ${inputArea}
            <div id="comments-list">
                <p style="text-align:center;padding:2rem;opacity:0.5;font-weight:800;">SYNCING WITH SERVER...</p>
            </div>
        </div>`;

    footer.parentNode.insertBefore(section, footer);

    // Set up Realtime Firebase Listener
    if (window.db) {
        window.db.collection('comments').where("pageId", "==", pageId)
            .onSnapshot((snapshot) => {
                const list = document.getElementById('comments-list');
                const countEl = document.getElementById('comments-count');
                
                if (snapshot.empty) {
                    list.innerHTML = '<p style="font-weight:700;opacity:0.5;text-align:center;padding:3rem 1rem;border:3px dashed var(--gray-light);">NO COMMENTS YET - BE THE FIRST! 💬</p>';
                    countEl.textContent = "0 comments on this page";
                    return;
                }

                const comments = [];
                snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
                
                // Separate into top-level and replies
                const topLevel = comments.filter(c => !c.parentId).sort((a, b) => b.timestamp - a.timestamp);
                const repliesByParent = {};
                comments.filter(c => c.parentId).forEach(c => {
                    if (!repliesByParent[c.parentId]) repliesByParent[c.parentId] = [];
                    repliesByParent[c.parentId].push(c);
                });

                let html = '';
                topLevel.forEach(c => {
                    html += renderCommentCard(c, false);
                    
                    const replies = repliesByParent[c.id] || [];
                    if (replies.length > 0) {
                        replies.sort((a, b) => a.timestamp - b.timestamp); // Oldest replies first
                        
                        html += `<button class="view-replies-btn" onclick="window.Comments.toggleReplies('${c.id}')" id="view-replies-btn-${c.id}">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:4px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    VIEW ${replies.length} REPL${replies.length === 1 ? 'Y' : 'IES'}
                                 </button>`;
                        html += `<div class="replies-container" id="replies-${c.id}" style="display:none; margin-left: 1.5rem; padding-left: 1rem; border-left: 3px solid var(--black); margin-top: 0.5rem; margin-bottom: 2rem;">`;
                        replies.forEach(r => {
                            html += renderCommentCard(r, true);
                        });
                        html += `</div>`;
                    }
                });

                list.innerHTML = html;
                countEl.textContent = `${comments.length} comment${comments.length !== 1 ? 's' : ''} on this page`;
            });
    } else {
        document.getElementById('comments-list').innerHTML = '<p style="text-align:center;padding:2rem;opacity:0.5;font-weight:800;">DATABASE CONNECTION ERROR</p>';
    }

    if (user) {
        const input     = document.getElementById('comment-input');
        const counter   = document.getElementById('comment-char-count');
        const submitBtn = document.getElementById('comment-submit');

        input.addEventListener('input', () => {
            counter.textContent = `${input.value.length} / 500`;
        });

        submitBtn.addEventListener('click', async () => {
            const text = input.value.trim();
            if (!text) {
                typeof showToast === 'function' && showToast('Comment cannot be empty.', 'error');
                return;
            }
            if (text.length > 500) {
                typeof showToast === 'function' && showToast('Comment is too long.', 'error');
                return;
            }

            const commentData = {
                userEmail: user.email,
                userName:  user.name,
                userAvatar: user.avatar || null,
                text:      text,
                timestamp: Date.now(),
                pageId,
                pageTitle,
                parentId: null
            };

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'POSTING...';

                await window.db.collection('comments').add(commentData);
                
                input.value = '';
                counter.textContent = '0 / 500';
                typeof showToast === 'function' && showToast('Comment posted globally! 🌍', 'success');
            } catch (err) {
                console.error("Firebase Error: ", err);
                typeof showToast === 'function' && showToast('Failed to post comment.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'POST COMMENT 💬';
            }
        });
    }
}

// ── Global Actions for Replies ─────────────────────────────
window.Comments = {
    toggleReplyBox: function(commentId) {
        const box = document.getElementById(`reply-box-${commentId}`);
        if (box) {
            box.style.display = box.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    toggleReplies: function(commentId) {
        const container = document.getElementById(`replies-${commentId}`);
        const btn = document.getElementById(`view-replies-btn-${commentId}`);
        if (container && btn) {
            if (container.style.display === 'none') {
                container.style.display = 'block';
                btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:4px;"><polyline points="18 15 12 9 6 15"></polyline></svg> HIDE REPLIES`;
            } else {
                container.style.display = 'none';
                const count = container.children.length;
                btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:4px;"><polyline points="6 9 12 15 18 9"></polyline></svg> VIEW ${count} REPL${count === 1 ? 'Y' : 'IES'}`;
            }
        }
    },

    submitReply: async function(parentId, pageId, pageTitle) {
        const user = window.Auth ? window.Auth.getCurrentUser() : null;
        if (!user) return;

        const input = document.getElementById(`reply-input-${parentId}`);
        if (!input) return;

        const text = input.value.trim();
        if (!text) {
            typeof showToast === 'function' && showToast('Reply cannot be empty.', 'error');
            return;
        }
        if (text.length > 500) {
            typeof showToast === 'function' && showToast('Reply is too long.', 'error');
            return;
        }

        const commentData = {
            userEmail: user.email,
            userName:  user.name,
            userAvatar: user.avatar || null,
            text:      text,
            timestamp: Date.now(),
            pageId,
            pageTitle,
            parentId: parentId
        };

        try {
            await window.db.collection('comments').add(commentData);
            input.value = '';
            window.Comments.toggleReplyBox(parentId); // Close box
            
            // Auto-open replies if they were hidden
            const repliesContainer = document.getElementById(`replies-${parentId}`);
            if (repliesContainer && repliesContainer.style.display === 'none') {
                window.Comments.toggleReplies(parentId);
            }
            
            typeof showToast === 'function' && showToast('Reply posted! 🌍', 'success');
        } catch (err) {
            console.error("Firebase Error: ", err);
            typeof showToast === 'function' && showToast('Failed to post reply.', 'error');
        }
    },

    getAllUserComments: async function(email) {
        if (!window.db) return [];
        try {
            const snapshot = await window.db.collection('comments').where('userEmail', '==', email).get();
            const comments = [];
            snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
            return comments.sort((a, b) => b.timestamp - a.timestamp);
        } catch (e) {
            console.error("Error fetching user comments:", e);
            return [];
        }
    }
};

// ── Auto-detect page on DOMContentLoaded ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const path = window.location.pathname;

        const pageMap = {
            'reviews':         'Reviews & Recommendations',
            'character-dives': 'Character Deep Dives',
            'watch-orders':    'Watch Orders',
            'top-lists':       'Top Lists',
            'manga-vs-anime':  'Manga vs Anime',
            'explainers':      'Anime Explainers'
        };

        if (path === '/' || path.includes('index.html')) { injectCommentSection('index', 'Otaku Realm Homepage'); return; }

        for (const [key, title] of Object.entries(pageMap)) {
            if (path.includes(key)) {
                injectCommentSection(key, title);
                return;
            }
        }

        if (path.includes('anime-detail')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                const pageTitle = document.title || 'Anime Discussion';
                injectCommentSection(`anime-${id}`, pageTitle);
            }
        }
    }, 200); // Give Firebase a moment to init
});
