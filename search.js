// ===== INTERNAL BLOG SEARCH =====

const blogTopics = [
    // Watch Orders
    { title: "Naruto Watch Order (No Filler)", url: "pages/watch-orders.html#naruto", type: "Guide" },
    { title: "Fate Series Watch Order Guide", url: "pages/watch-orders.html#fate", type: "Guide" },
    { title: "Monogatari Series Release Order", url: "pages/watch-orders.html#monogatari", type: "Guide" },
    { title: "Evangelion: Series vs Rebuilds", url: "pages/watch-orders.html#eva", type: "Guide" },
    { title: "Dragon Ball Complete Order", url: "pages/watch-orders.html#dbz", type: "Guide" },
    { title: "Bleach Watch Order Guide", url: "pages/watch-orders.html#bleach", type: "Guide" },
    { title: "Gintama: How to Watch", url: "pages/watch-orders.html#gintama", type: "Guide" },

    // Explainers
    { title: "Isekai Genre Explained", url: "pages/explainers.html#isekai", type: "Explainer" },
    { title: "Dere Types Guide (Tsundere, etc)", url: "pages/explainers.html#dere", type: "Explainer" },
    { title: "Anime Filler: Why it Exists", url: "pages/explainers.html#filler", type: "Explainer" },
    { title: "Anime Cours and Seasons Explained", url: "pages/explainers.html#cours", type: "Explainer" },
    { title: "Source Material: Manga vs LN vs VN", url: "pages/explainers.html#source", type: "Explainer" },
    { title: "Production Committees: The Business", url: "pages/explainers.html#business", type: "Explainer" },
    { title: "Mecha History: Super vs Real", url: "pages/explainers.html#mecha", type: "Explainer" },
    { title: "Anime Original Endings (AOE)", url: "pages/explainers.html#aoe", type: "Explainer" },

    // Top Lists
    { title: "Top 10 Best Anime Openings", url: "pages/top-lists.html#openings", type: "List" },
    { title: "Top 10 Hype Fight Scenes", url: "pages/top-lists.html#fights", type: "List" },
    { title: "Top 10 Power Systems Ranked", url: "pages/top-lists.html#power", type: "List" },
    { title: "Saddest Anime to Watch", url: "pages/top-lists.html#sad", type: "List" },
    { title: "Top 10 Best Isekai Anime", url: "pages/top-lists.html#isekai-top", type: "List" },

    // Character Dives
    { title: "Eren Yeager: Hero to Villain", url: "pages/character-dives.html#eren", type: "Character Dive" },
    { title: "Gojo Satoru: The Strongest", url: "pages/character-dives.html#gojo", type: "Character Dive" },
    { title: "Itachi Uchiha: Noble Sacrifice", url: "pages/character-dives.html#itachi", type: "Character Dive" },
    { title: "Lelouch vi Britannia: Anti-Hero", url: "pages/character-dives.html#lelouch", type: "Character Dive" },
    { title: "Guts: The Struggler Analysis", url: "pages/character-dives.html#guts", type: "Character Dive" },
    { title: "Light Yagami: God Complex", url: "pages/character-dives.html#light", type: "Character Dive" },
    { title: "Thorfinn: Redemption Arc", url: "pages/character-dives.html#thorfinn", type: "Character Dive" },
    { title: "Mob: Power vs Kindness", url: "pages/character-dives.html#mob", type: "Character Dive" },
    { title: "Griffith: The Cost of a Dream", url: "pages/character-dives.html#griffith", type: "Character Dive" },
    { title: "Johan Liebert: Nihilism Analysis", url: "pages/character-dives.html#johan", type: "Character Dive" },
    { title: "Violet Evergarden: Emotional Healing", url: "pages/character-dives.html#violet", type: "Character Dive" },
    { title: "Spike Spiegel: Living in a Dream", url: "pages/character-dives.html#spike", type: "Character Dive" },
    { title: "Ken Kaneki: Tragedy Analysis", url: "pages/character-dives.html#kaneki", type: "Character Dive" },
    { title: "Shinji Ikari: Hedgehog's Dilemma", url: "pages/character-dives.html#shinji", type: "Character Dive" },
    { title: "Meruem: Evolution of a King", url: "pages/character-dives.html#meruem", type: "Character Dive" },
    { title: "Alucard: Boredom of Eternity", url: "pages/character-dives.html#alucard", type: "Character Dive" },
    { title: "Madara Uchiha: Messiah Complex", url: "pages/character-dives.html#madara", type: "Character Dive" },
    { title: "Hisoka: Chaos and Pursuit", url: "pages/character-dives.html#hisoka", type: "Character Dive" },
    { title: "Revy: Nihilism of the Gun", url: "pages/character-dives.html#revy", type: "Character Dive" },
    { title: "Asuka Langley: Superiority Mask", url: "pages/character-dives.html#asuka", type: "Character Dive" },
    { title: "Ichigo Kurosaki: The Protector", url: "pages/character-dives.html#ichigo", type: "Character Dive" },
    { title: "Monkey D. Luffy: Absolute Freedom", url: "pages/character-dives.html#luffy", type: "Character Dive" },
    { title: "Roronoa Zoro: The Iron Will", url: "pages/character-dives.html#zoro", type: "Character Dive" },
    { title: "Killua Zoldyck: Breaking Chains", url: "pages/character-dives.html#killua", type: "Character Dive" },
    { title: "Saitama: Curse of Strength", url: "pages/character-dives.html#saitama", type: "Character Dive" },
    { title: "Makima: Necessity of Control", url: "pages/character-dives.html#makima", type: "Character Dive" },
    { title: "Denji: Hunger for Normalcy", url: "pages/character-dives.html#denji", type: "Character Dive" },
    { title: "Ryomen Sukuna: Pure Hedonism", url: "pages/character-dives.html#sukuna", type: "Character Dive" },
    { title: "Toji Fushiguro: Sorcerer Killer", url: "pages/character-dives.html#toji", type: "Character Dive" },
    { title: "Erwin Smith: The Gambler", url: "pages/character-dives.html#erwin", type: "Character Dive" },
    { title: "Levi Ackerman: The Survivor", url: "pages/character-dives.html#levi", type: "Character Dive" },
    { title: "Edward Elric: Human Alchemist", url: "pages/character-dives.html#edward", type: "Character Dive" },
    { title: "Roy Mustang: Flame Alchemist", url: "pages/character-dives.html#mustang", type: "Character Dive" },

    // Manga vs Anime
    { title: "Attack on Titan Ending Comparison", url: "pages/manga-vs-anime.html#aot", type: "Comparison" },
    { title: "One Piece: Manga vs Anime Pacing", url: "pages/manga-vs-anime.html#op", type: "Comparison" },
    { title: "Tokyo Ghoul Adaptation Analysis", url: "pages/manga-vs-anime.html#tg", type: "Comparison" },
    { title: "Demon Slayer: Visual Elevation", url: "pages/manga-vs-anime.html#ds", type: "Comparison" },
    { title: "Berserk: The Unadaptable Art", url: "pages/manga-vs-anime.html#berserk", type: "Comparison" },
    { title: "FMA: 2003 vs Brotherhood", url: "pages/manga-vs-anime.html#fma", type: "Comparison" },
    { title: "Hunter x Hunter: 1999 vs 2011", url: "pages/manga-vs-anime.html#hxh", type: "Comparison" },
    { title: "Promised Neverland Season 2 Fail", url: "pages/manga-vs-anime.html#tpn", type: "Comparison" },
    { title: "Bleach TYBW: Manga Fixes", url: "pages/manga-vs-anime.html#bleach-comp", type: "Comparison" },
    { title: "Blue Lock: Art vs Animation", url: "pages/manga-vs-anime.html#bl", type: "Comparison" },
    { title: "One Punch Man Season 1 vs 2", url: "pages/manga-vs-anime.html#opm", type: "Comparison" },
    { title: "Akame ga Kill: Original Endings", url: "pages/manga-vs-anime.html#akame", type: "Comparison" },
    { title: "Soul Eater: Manga Conclusion", url: "pages/manga-vs-anime.html#soul", type: "Comparison" },
    { title: "JoJo: Capturing the Aesthetic", url: "pages/manga-vs-anime.html#jojo", type: "Comparison" }
];

let localAnimeDb = [];

// Pre-load local database for instant fallback
async function preloadLocalDb() {
    try {
        const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : './';
        const [resObj, resArr] = await Promise.all([
            fetch(`${pathPrefix}anime-db.json`).catch(() => null),
            fetch(`${pathPrefix}data/anime-db.json`).catch(() => null)
        ]);

        let dbFromObj = [];
        if (resObj && resObj.ok) {
            const data = await resObj.json();
            dbFromObj = Object.entries(data).map(([id, info]) => ({ ...info, id }));
        }

        let dbFromArr = [];
        if (resArr && resArr.ok) {
            dbFromArr = await resArr.json();
        }

        // Merge and deduplicate by ID
        const mergedMap = new Map();
        [...dbFromArr, ...dbFromObj].forEach(item => {
            if (item.id) mergedMap.set(String(item.id), item);
        });
        
        localAnimeDb = Array.from(mergedMap.values());
        console.log(`[OtakuRealm] Search DB loaded: ${localAnimeDb.length} items.`);
    } catch (e) {
        console.warn("[OtakuRealm] Local DB preload failed:", e);
    }
}

preloadLocalDb();

async function initNavSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    const isSubfolder = window.location.pathname.includes('/pages/');
    const basePath = isSubfolder ? '../' : '';

    let searchTimeout = null;

    input.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const q = input.value.trim().toLowerCase();
        
        if (q.length < 2) { 
            results.innerHTML = ''; 
            results.classList.remove('active'); 
            return; 
        }

        results.innerHTML = '<div class="search-result-item"><h4>SEARCHING...</h4></div>';
        results.classList.add('active');

        searchTimeout = setTimeout(async () => {
            let html = '';
            const seenIds = new Set();
            const seenTitles = new Set();
            
            // 1. Search Local DB first (Instant)
            const localMatches = localAnimeDb.filter(a => 
                (a.title && a.title.toLowerCase().includes(q)) || 
                (a.name && a.name.toLowerCase().includes(q))
            ).slice(0, 3);

            if (localMatches.length > 0) {
                // Enrich local matches with Jikan data if image is missing
                const enrichedLocalMatches = await Promise.all(localMatches.map(async anime => {
                    if (!anime.image || !anime.desc) {
                        try {
                            const res = await fetch(`https://api.jikan.moe/v4/anime?q=${anime.title || anime.name}&limit=1`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data.data && data.data[0]) {
                                    const a = data.data[0];
                                    anime.image = anime.image || a.images.jpg.large_image_url;
                                    anime.desc = anime.desc || a.synopsis;
                                }
                            }
                        } catch(e) {}
                    }
                    return anime;
                }));

                html += enrichedLocalMatches.map(anime => {
                    const title = anime.title || anime.name;
                    seenIds.add(String(anime.id));
                    seenTitles.add(title.toLowerCase().trim());
                    return renderSearchCard(anime, basePath, 'local');
                }).join('');
            }

            results.innerHTML = html || '<div class="search-result-item"><h4>SEARCHING GLOBAL DB...</h4></div>';

            // 2. Live Jikan API Search (MAL)
            try {
                const apiRes = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=5&sfw=true`);
                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data.data && data.data.length > 0) {
                        // Deduplicate: Filter out what we already showed from local DB (ID or Title)
                        const uniqueApiResults = data.data.filter(anime => {
                            const isSeenId = seenIds.has(String(anime.mal_id));
                            const isSeenTitle = seenTitles.has(anime.title.toLowerCase().trim());
                            return !isSeenId && !isSeenTitle;
                        });
                        
                        html += uniqueApiResults.map(anime => {
                            const mapped = {
                                id: anime.mal_id,
                                title: anime.title,
                                rating: anime.score ? `${anime.score.toFixed(1)}/10` : 'N/A',
                                score: anime.score,
                                status: anime.status,
                                year: anime.year,
                                image: anime.images.jpg.image_url,
                                synopsis: anime.synopsis
                            };
                            return renderSearchCard(mapped, basePath, 'jikan');
                        }).join('');
                    }
                }
            } catch (e) {
                console.error("[OtakuRealm] API Error:", e);
                if (!html) html = '<div class="search-result-item"><h4>CONNECTION ERROR</h4><p>Check your internet or try later.</p></div>';
            }

            if (!html) {
                html = '<div class="search-result-item" style="padding: 2rem; text-align: center;"><h4>NO RESULTS FOUND</h4><p>Try a different keyword.</p></div>';
            }
            results.innerHTML = html;
        }, 500);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-bar')) {
            results.classList.remove('active');
        }
    });
}

function renderSearchCard(anime, basePath, source) {
    const watchlist = typeof window.getWatchlist === 'function' ? window.getWatchlist() : [];
    const isSaved = watchlist.some(item => String(item.id) === String(anime.id));
    
    const scoreNum = anime.score || 0;
    let verdict = "A DECENT WATCH.";
    if (scoreNum > 8.5) verdict = "A MUST-WATCH MASTERPIECE!";
    else if (scoreNum > 7.5) verdict = "HIGHLY RECOMMENDED!";
    else if (scoreNum < 6) verdict = "SKIP THIS ONE.";

    const animeData = {
        id: anime.id,
        title: anime.title || anime.name,
        image: anime.image,
        rating: anime.rating
    };

    return `
        <div class="search-result-item" style="padding: 1.5rem 1rem; border-bottom: 4px solid var(--black); background: var(--white); color: var(--black);">
            <div style="display:flex; gap:15px; align-items:flex-start; margin-bottom: 12px;">
                <a href="${basePath}pages/anime-detail.html?id=${anime.id}&source=${source}" style="display:flex; gap:15px; align-items:flex-start; text-decoration: none; color: inherit; flex: 1;">
                    <img src="${anime.image}" alt="${anime.title}" style="width: 70px; height: 100px; object-fit: cover; border: 3px solid var(--black); flex-shrink: 0; box-shadow: 4px 4px 0 var(--black);">
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 4px; font-size: 1.2rem; line-height: 1.1; font-weight: 900; text-transform: uppercase; color: var(--black);">${anime.title || anime.name}</h4>
                        <div style="font-size:0.7rem; color:var(--black); font-weight: 900; text-transform: uppercase; margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 8px;">
                            <span style="background: var(--black); color: var(--white); padding: 2px 6px;">${anime.rating || 'N/A'}</span>
                            <span style="border: 2px solid var(--black); padding: 2px 6px;">${(anime.status || 'Finished').toUpperCase()}</span>
                            <span>${anime.year || 'N/A'}</span>
                        </div>
                        <p style="font-size:0.8rem; color:var(--black); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; font-weight: 500; margin-bottom: 8px;">
                            ${anime.synopsis || anime.desc || 'No description available.'}
                        </p>
                        <div style="font-size: 0.75rem; font-weight: 900; border-left: 4px solid var(--black); padding-left: 10px; font-style: italic;">
                            VERDICT: ${anime.verdict || verdict}
                        </div>
                    </div>
                </a>
            </div>
            <button class="watchlist-quick-btn" 
                    onclick="event.preventDefault(); window.toggleWatchlist(${JSON.stringify(animeData).replace(/"/g, '&quot;')}); const saved = window.getWatchlist().some(i => String(i.id) === String('${anime.id}')); this.innerHTML = saved ? '★ ON WATCHLIST' : '☆ ADD TO WATCHLIST'; this.style.background = saved ? 'var(--white)' : 'var(--black)'; this.style.color = saved ? 'var(--black)' : 'var(--white)';"
                    style="width: 100%; padding: 0.8rem; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 900; cursor: pointer; border: 3px solid var(--black); transition: all 0.2s; background: ${isSaved ? 'var(--white)' : 'var(--black)'}; color: ${isSaved ? 'var(--black)' : 'var(--white)'}; text-transform: uppercase; letter-spacing: 1px;">
                ${isSaved ? '★ ON WATCHLIST' : '☆ ADD TO WATCHLIST'}
            </button>
        </div>
    `;
}

// ===== THEME TOGGLE (NIGHT MODE) =====
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    if (localStorage.getItem('manga-theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ DAY MODE';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('manga-theme', 'dark');
            themeToggle.textContent = '☀️ DAY MODE';
        } else {
            localStorage.setItem('manga-theme', 'light');
            themeToggle.textContent = '🌙 NIGHT MODE';
        }
    });
}

document.addEventListener('DOMContentLoaded', initNavSearch);
