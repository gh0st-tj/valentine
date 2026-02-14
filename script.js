/* ========================================
   Valentine's Day Website for Maya 💙
   ======================================== */

// ────────── Scene Management ──────────
function showScene(id) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ────────── Utilities ──────────
const delay = ms => new Promise(r => setTimeout(r, ms));
const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const introOpenTexts = [
    'Open',
    'Open The Magic',
    'Tap For Surprise',
    'Unseal The Cute',
    'Press For Whimsy'
];

const celebrationSubtitles = [
    'I made a little game for you...',
    'Tiny game. Big feelings. 💙',
    'Warning: this game is 94% cute chaos.',
    'Ready for some romantic mischief?',
    'Level unlocked: adorable challenge.'
];

const gameWarmupMessages = [
    'Memorize the cards... we start in 3, 2, cute.',
    'Quick peek time. Pretend this is serious.',
    'Study mode: activated.',
    'All right, memory genius, lock these in.'
];

const gamePlayMessages = [
    'Find all the matching pairs!',
    'Match the cuteness before time catches you!',
    'Flirt with fate. Find the pairs.',
    'Go go go, chaos memory mode!'
];

const noTauntBubbles = [
    'nyoooom 💨',
    'too slow 😜',
    'try again, brave soul',
    'hahaha nope',
    'mission failed successfully',
    'caught me? impossible',
    'plot twist: still no'
];

const comboReactions = [
    [],
    [],
    ['Cute combo! 💫', 'Double trouble 😎', 'Okayyy smooth.'],
    ['Triple combo! 🔥', 'Someone call the memory police.', 'You are cooking.'],
    ['Combo x4! 👑', 'Illegal levels of charm.', 'Main character energy.'],
    ['Combo chaos! ✨', 'Legend mode unlocked.', 'You broke the cute meter.']
];

let comboBadgeTimer = null;
let trailTick = 0;
let lastNoEscapeAt = 0;

function getWhimsyLayer() {
    return document.getElementById('whimsy-layer');
}

function addWhimsyBubble(x, y, text) {
    const layer = getWhimsyLayer();
    if (!layer) return;

    const bubble = document.createElement('div');
    bubble.className = 'whimsy-bubble';
    bubble.textContent = text;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    layer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1500);
}

function addEmojiBurst(x, y, count = 8) {
    if (prefersReducedMotion) return;
    const layer = getWhimsyLayer();
    if (!layer) return;

    const icons = ['💙', '✨', '🩵', '💫', '🌟', '😄'];
    for (let i = 0; i < count; i++) {
        const token = document.createElement('div');
        token.className = 'whimsy-emoji';
        token.textContent = icons[Math.floor(Math.random() * icons.length)];
        token.style.left = `${x}px`;
        token.style.top = `${y}px`;
        token.style.fontSize = `${Math.random() * 9 + 13}px`;

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const distance = 28 + Math.random() * 48;
        token.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        token.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        token.style.setProperty('--tr', `${(Math.random() - 0.5) * 60}deg`);

        layer.appendChild(token);
        setTimeout(() => token.remove(), 900);
    }
}

function addTrailEmoji(x, y) {
    if (prefersReducedMotion) return;

    const now = performance.now();
    if (now - trailTick < 90) return;
    trailTick = now;

    const layer = getWhimsyLayer();
    if (!layer) return;

    const trail = document.createElement('div');
    trail.className = 'whimsy-trail';
    trail.textContent = randomItem(['✨', '💙', '🩵']);
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    trail.style.setProperty('--dx', `${(Math.random() - 0.5) * 16}px`);

    layer.appendChild(trail);
    setTimeout(() => trail.remove(), 700);
}

function setupWhimsyPointerEffects() {
    document.addEventListener('pointerdown', e => {
        addEmojiBurst(e.clientX, e.clientY, 6);
    });

    document.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        addTrailEmoji(e.clientX, e.clientY);
    });
}

function setupMagneticButtons() {
    if (prefersReducedMotion) return;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) return;

    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        const reset = () => {
            btn.style.translate = '0 0';
            btn.classList.remove('magnetic-active');
        };

        btn.addEventListener('pointermove', e => {
            const rect = btn.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            const tx = px * 14;
            const ty = py * 10;

            btn.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
            btn.classList.add('magnetic-active');
        });

        btn.addEventListener('pointerleave', reset);
        btn.addEventListener('blur', reset);
    });
}

function refreshMicrocopy() {
    const openText = document.querySelector('.open-btn-text');
    if (openText) openText.textContent = randomItem(introOpenTexts);

    const celebrateSubtitle = document.querySelector('.celebrate-subtitle');
    if (celebrateSubtitle) celebrateSubtitle.textContent = randomItem(celebrationSubtitles);
}

function clearComboBadge() {
    const badge = document.getElementById('combo-badge');
    if (!badge) return;

    badge.classList.remove('show');
    badge.textContent = '';
    if (comboBadgeTimer) {
        clearTimeout(comboBadgeTimer);
        comboBadgeTimer = null;
    }
}

function showComboBadge() {
    if (streak < 2) return;

    const badge = document.getElementById('combo-badge');
    if (!badge) return;

    const tier = Math.min(streak, comboReactions.length - 1);
    const reaction = randomItem(comboReactions[tier]);
    badge.textContent = `Combo x${streak} · ${reaction}`;
    badge.classList.remove('show');
    void badge.offsetWidth;
    badge.classList.add('show');

    if (comboBadgeTimer) clearTimeout(comboBadgeTimer);
    comboBadgeTimer = setTimeout(() => badge.classList.remove('show'), 1450);
}

// ========================================
//  SCENE 1 — INTRO
// ========================================
const introLines = [
    { el: 'line1', text: 'Hey Maya...',                  speed: 95  },
    { el: 'line2', text: 'I made something for you...', speed: 70  }
];

function typeWriter(elementId, text, speed) {
    return new Promise(resolve => {
        const el = document.getElementById(elementId);
        el.innerHTML = '<span class="cursor"></span>';
        let i = 0;

        (function type() {
            if (i < text.length) {
                el.innerHTML = text.substring(0, ++i) + '<span class="cursor"></span>';
                setTimeout(type, speed);
            } else {
                setTimeout(() => { el.textContent = text; resolve(); }, 500);
            }
        })();
    });
}

function createStars() {
    const box = document.getElementById('stars');
    const n   = window.innerWidth < 600 ? 70 : 140;

    for (let i = 0; i < n; i++) {
        const s   = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2.5 + 0.8;
        Object.assign(s.style, {
            left:   Math.random() * 100 + '%',
            top:    Math.random() * 100 + '%',
            width:  size + 'px',
            height: size + 'px'
        });
        s.style.setProperty('--dur',   (Math.random() * 3 + 2) + 's');
        s.style.setProperty('--delay', (Math.random() * 5) + 's');
        box.appendChild(s);
    }
}

async function startIntro() {
    refreshMicrocopy();
    createStars();
    await delay(700);
    await typeWriter(introLines[0].el, introLines[0].text, introLines[0].speed);
    await delay(500);
    await typeWriter(introLines[1].el, introLines[1].text, introLines[1].speed);
    await delay(400);
    document.getElementById('open-btn').classList.add('visible');
}

function goToQuestion() {
    showScene('scene-question');
    createPetals();
}

// ========================================
//  SCENE 2 — THE QUESTION
// ========================================
const noTexts = [
    'No',
    'Are you sure?',
    'Really sure?? 🤨',
    'Maya please... 🥺',
    "Don't do this to me!",
    'I\'m gonna cry... 😢',
    'You\'re breaking my heart!',
    'Pretty pretty please? 🙏',
    'I won\'t give up! 😤',
    'The button is scared of you!',
    'MAYA PLEEEEASE 😭',
    'OK fine, I\'ll just be here... alone... in the dark... 🥲',
    'Just kidding — SAY YES!!'
];

const subtitleTexts = [
    'Maya, I have something important to ask you...',
    'Think about it... 🤔',
    'Come onnnn you know you want to! 😏',
    'Your heart is saying yes... 💙',
    'I promise to make you smile every single day!',
    'Just one tiny little yes...',
    "I'll keep asking forever you know!",
    'The yes button is RIGHT THERE 👉',
    '*gives you puppy eyes* 🥺',
    'You + Me = 💙',
    'THE YES BUTTON DEMANDS YOUR ATTENTION',
    "OK the button won't stop growing now...",
    "LAST CHANCE (just kidding, I'll never stop) 😤💙"
];

const emojis = ['💙','🥺','😢','😭','😭','🥺','😭','💔','😭','🥺','😭','😭','💙'];

let noCount = 0;

function createPetals() {
    const box = document.getElementById('petals-bg');
    const n   = window.innerWidth < 600 ? 18 : 30;
    const blues = ['#7ec8e3','#4fc3f7','#4a90d9','#aedff7','#5dade2','#81d4fa'];

    for (let i = 0; i < n; i++) {
        const p    = document.createElement('div');
        p.className = 'petal';
        const size = Math.random() * 12 + 8;
        const drift = (Math.random() - 0.5) * 160;

        Object.assign(p.style, {
            left:      Math.random() * 100 + '%',
            width:     size + 'px',
            height:    size + 'px',
            background: blues[Math.floor(Math.random() * blues.length)],
            animationDuration: (Math.random() * 7 + 7) + 's',
            animationDelay:    (Math.random() * 10) + 's'
        });
        p.style.setProperty('--o',     (Math.random() * 0.25 + 0.12).toFixed(2));
        p.style.setProperty('--drift', drift + 'px');
        box.appendChild(p);
    }
}

function moveNoButton(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const now = performance.now();
    if (now - lastNoEscapeAt < 320) return;
    lastNoEscapeAt = now;

    const btn = document.getElementById('btn-no');
    const previousRect = btn.getBoundingClientRect();
    const wrapper = document.getElementById('buttons-wrapper');
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    
    // Use larger margin on mobile for better UX
    const isMobile = vw < 600;
    const m = isMobile ? 40 : 25;
    
    // Calculate safe bounds
    const maxX = vw - bw - m;
    const maxY = vh - bh - m;
    
    let nx, ny;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Try to find a position that's not too close to the wrapper
    do {
        nx = Math.random() * (maxX - m) + m;
        ny = Math.random() * (maxY - m) + m;
        attempts++;
        
        // On mobile, ensure button doesn't overlap with question area
        if (isMobile) {
            const minY = wrapperRect.bottom + 20;
            const maxSafeY = vh - bh - m;
            if (ny < minY && maxSafeY > minY) {
                ny = Math.random() * (maxSafeY - minY) + minY;
            }
        }
    } while (attempts < maxAttempts && 
             nx > wrapperRect.left - 50 && nx < wrapperRect.right + 50 &&
             ny > wrapperRect.top - 50 && ny < wrapperRect.bottom + 50);

    btn.classList.add('escaped');
    btn.style.left = nx + 'px';
    btn.style.top = ny + 'px';

    // Add shake animation to button
    btn.style.animation = 'shake 0.3s ease';
    setTimeout(() => { btn.style.animation = ''; }, 300);

    // Update counter & texts
    noCount++;
    const idx = Math.min(noCount, noTexts.length - 1);
    btn.textContent = noTexts[idx];
    document.getElementById('subtitle').textContent =
        subtitleTexts[Math.min(noCount, subtitleTexts.length - 1)];
    document.getElementById('emoji-display').textContent =
        emojis[Math.min(noCount, emojis.length - 1)];

    // Grow the Yes button
    const yes = document.getElementById('btn-yes');
    const cur = parseFloat(getComputedStyle(yes).fontSize);
    const newSz = Math.min(cur * 1.14, isMobile ? 48 : 58);
    yes.style.fontSize = newSz + 'px';

    const padV = parseFloat(getComputedStyle(yes).paddingTop);
    const padH = parseFloat(getComputedStyle(yes).paddingLeft);
    yes.style.padding = `${Math.min(padV * 1.1, isMobile ? 28 : 32)}px ${Math.min(padH * 1.1, isMobile ? 55 : 65)}px`;

    const bubbleText = noCount <= noTauntBubbles.length
        ? noTauntBubbles[noCount - 1]
        : randomItem(noTauntBubbles);
    addWhimsyBubble(
        previousRect.left + previousRect.width / 2,
        previousRect.top - 8,
        bubbleText
    );

    if (noCount % 2 === 0) {
        addEmojiBurst(previousRect.left + previousRect.width / 2, previousRect.top + previousRect.height / 2, 6);
    }
}

function setupNoButton() {
    const btn = document.getElementById('btn-no');
    btn.addEventListener('mouseenter',  moveNoButton);
    btn.addEventListener('touchstart',  moveNoButton, { passive: false });
    btn.addEventListener('click', e => {
        // Keep keyboard activation playful without double-triggering mouse clicks.
        if (e.detail === 0) moveNoButton(e);
    });
}

function addSparkles(x, y) {
    const colors = ['#4fc3f7', '#7ec8e3', '#aedff7', '#ffd700'];
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 30 + Math.random() * 20;
        sparkle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        sparkle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
    }
}

function handleYes() {
    const btn = document.getElementById('btn-yes');
    const rect = btn.getBoundingClientRect();
    addSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    setTimeout(() => {
        showScene('scene-celebrate');
        startCelebration();
    }, 300);
}

// ========================================
//  SCENE 3 — CELEBRATION
// ========================================
function startCelebration() {
    refreshMicrocopy();
    buildFlower();
    launchConfetti();
    spawnFloatingHearts();
    // Second wave of hearts
    setTimeout(spawnFloatingHearts, 5000);
    
    // Make flower interactive
    setTimeout(() => {
        const flower = document.getElementById('flower');
        flower.addEventListener('click', () => {
            const rect = flower.getBoundingClientRect();
            addSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            spawnFloatingHearts();
        });
    }, 3000);
}

/* ----- Flower ----- */
function buildFlower() {
    const f = document.getElementById('flower');
    f.innerHTML = '';

    const outerColors = [
        '#4a90d9','#5196dd','#4ba8e0','#5dade2',
        '#4fc3f7','#5ab8e6','#4a90d9','#5dade2'
    ];

    // 8 outer petals
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'flower-petal';
        p.style.setProperty('--r', (i * 45) + 'deg');
        p.style.setProperty('--d', (0.8 + i * 0.1) + 's');
        p.style.background = `linear-gradient(to top, ${outerColors[i]}, ${outerColors[i]}cc)`;
        f.appendChild(p);
    }

    // 8 inner petals (smaller, lighter, offset 22.5°)
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'flower-petal-inner';
        p.style.setProperty('--r', (i * 45 + 22.5) + 'deg');
        p.style.setProperty('--d', (1.1 + i * 0.08) + 's');
        p.style.background = 'linear-gradient(to top, #aedff7, #ddf2ff)';
        f.appendChild(p);
    }

    // Center
    const c = document.createElement('div');
    c.className = 'flower-center';
    c.style.animationDelay = '1.8s';
    f.appendChild(c);

    // Stem + leaves
    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    stem.style.animationDelay = '2.1s';

    const ll = document.createElement('div');
    ll.className = 'flower-leaf left';
    ll.style.setProperty('--ld', '2.7s');

    const lr = document.createElement('div');
    lr.className = 'flower-leaf right';
    lr.style.setProperty('--ld', '2.9s');

    stem.appendChild(ll);
    stem.appendChild(lr);
    f.appendChild(stem);
}

/* ----- Canvas Confetti ----- */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx    = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const colors = [
        '#4a90d9','#5dade2','#4fc3f7','#7ec8e3','#aedff7',
        '#ffd700','#ffffff','#f0c4d4','#81d4fa','#b3e5fc'
    ];

    const particles = [];
    for (let i = 0; i < 180; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            w: Math.random() * 8 + 3,
            h: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 2.5 + 1,
            vx: (Math.random() - 0.5) * 2,
            a:  Math.random() * Math.PI * 2,
            va: (Math.random() - 0.5) * 0.15,
            shape: ['rect','circle','heart'][Math.floor(Math.random() * 3)],
            alpha: 1
        });
    }

    let frame = 0;
    const MAX = 480;

    function drawHeart(x, y, s, col, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = col;
        ctx.beginPath();
        const hs = s * 0.5;
        ctx.moveTo(x, y + hs * 0.25);
        ctx.bezierCurveTo(x, y - hs * 0.5, x - hs, y - hs * 0.5, x - hs, y + hs * 0.25);
        ctx.bezierCurveTo(x - hs, y + hs, x, y + hs * 1.3, x, y + hs * 1.5);
        ctx.bezierCurveTo(x, y + hs * 1.3, x + hs, y + hs, x + hs, y + hs * 0.25);
        ctx.bezierCurveTo(x + hs, y - hs * 0.5, x, y - hs * 0.5, x, y + hs * 0.25);
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
        frame++;

        const fading = frame > MAX - 120;

        particles.forEach(p => {
            p.y += p.vy;
            p.x += Math.sin(p.a) * p.vx;
            p.a += p.va;

            if (fading) p.alpha = Math.max(0, p.alpha - 0.008);

            if (p.shape === 'heart') {
                drawHeart(p.x, p.y, p.w, p.color, p.alpha);
            } else if (p.shape === 'circle') {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle   = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.w * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle   = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.a);
                ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
                ctx.restore();
            }

            // Recycle particles until fading begins
            if (p.y > H + 20 && !fading) {
                p.y = -20;
                p.x = Math.random() * W;
            }
        });

        if (frame < MAX) requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
}

/* ----- Floating Hearts ----- */
function spawnFloatingHearts() {
    const box    = document.getElementById('floating-hearts');
    const icons  = ['💙','🤍','💎','✨','🦋','💙','🩵','💙'];

    for (let i = 0; i < 22; i++) {
        const h = document.createElement('div');
        h.className = 'floating-heart';
        h.textContent = icons[Math.floor(Math.random() * icons.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.fontSize = (Math.random() * 18 + 14) + 'px';
        h.style.setProperty('--dur',   (Math.random() * 5 + 5) + 's');
        h.style.setProperty('--delay', (Math.random() * 8 + 0.5) + 's');
        box.appendChild(h);
    }
}

// ========================================
//  SCENE 4 — MEMORY GAME
// ========================================
let gameMoves    = 0;
let matchedPairs = 0;
let flippedCards = [];
let canFlip      = false;
let streak       = 0;
let gameStarted  = false;
let gameSeconds  = 0;
let timerInterval = null;

const cardEmojis = ['💙', '🌹', '🦋', '💌', '✨', '💎', '🌙', '💐'];

const streakMessages = [
    '', '',
    'Nice match! 🔥',
    'On fire! 🔥🔥',
    'Unstoppable! 🔥🔥🔥',
    'INCREDIBLE! 🔥🔥🔥🔥',
    'LEGENDARY!! ✨🔥✨'
];

// ── Start / Reset ──
function startGame() {
    showScene('scene-game');
    resetGame();
    createMemoryCards();
    // Brief preview: show all cards face-up, then flip back
    setTimeout(previewCards, 500);
}

function resetGame() {
    gameMoves    = 0;
    matchedPairs = 0;
    flippedCards  = [];
    canFlip      = false;
    streak       = 0;
    gameStarted  = false;
    gameSeconds  = 0;

    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

    document.getElementById('game-moves').textContent  = '0';
    document.getElementById('game-pairs').textContent  = '0';
    document.getElementById('game-timer').textContent   = '0:00';
    document.getElementById('game-message').textContent = randomItem(gameWarmupMessages);
    document.getElementById('streak-message').textContent = '';
    clearComboBadge();

    const overlay = document.getElementById('game-win-overlay');
    if (overlay) overlay.classList.remove('visible');
}

// ── Build Cards ──
function createMemoryCards() {
    const area = document.getElementById('game-area');
    area.innerHTML = '';

    const deck = [...cardEmojis, ...cardEmojis];
    shuffleArray(deck);

    deck.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.style.setProperty('--entry-delay', (i * 0.04) + 's');

        const front = document.createElement('div');
        front.className = 'card-front';
        front.innerHTML = '<span class="card-front-icon">?</span>';

        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = emoji;

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', () => flipCard(card));
        area.appendChild(card);
    });
}

// ── Preview ──
function previewCards() {
    const cards = document.querySelectorAll('.memory-card');
    // Wait for entry animation to finish, then flip all face-up
    const entryTime = cards.length * 40 + 400;

    setTimeout(() => {
        cards.forEach(c => c.classList.add('flipped'));

        // After 2 seconds, flip back and enable play
        setTimeout(() => {
            cards.forEach(c => c.classList.remove('flipped'));
            canFlip = true;
            document.getElementById('game-message').textContent = randomItem(gamePlayMessages);
        }, 2000);
    }, entryTime);
}

// ── Timer ──
function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
        gameSeconds++;
        const m = Math.floor(gameSeconds / 60);
        const s = gameSeconds % 60;
        document.getElementById('game-timer').textContent =
            `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
}

// ── Card Interaction ──
function flipCard(card) {
    if (!canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    startTimer();

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        gameMoves++;
        document.getElementById('game-moves').textContent = gameMoves;
        checkMatch();
    }
}

function checkMatch() {
    canFlip = false;
    const [c1, c2] = flippedCards;

    if (c1.dataset.emoji === c2.dataset.emoji) {
        // ── MATCH ──
        streak++;
        setTimeout(() => {
            c1.classList.add('matched');
            c2.classList.add('matched');

            matchedPairs++;
            document.getElementById('game-pairs').textContent = matchedPairs;

            // Sparkles on both cards
            const r1 = c1.getBoundingClientRect();
            const r2 = c2.getBoundingClientRect();
            addSparkles(r1.left + r1.width / 2, r1.top + r1.height / 2);
            addSparkles(r2.left + r2.width / 2, r2.top + r2.height / 2);
            addEmojiBurst(r1.left + r1.width / 2, r1.top + r1.height / 2, 6);
            addEmojiBurst(r2.left + r2.width / 2, r2.top + r2.height / 2, 6);

            showStreakMessage();
            showComboBadge();

            flippedCards = [];
            canFlip = true;

            if (matchedPairs === 8) endGame();
        }, 400);
    } else {
        // ── MISMATCH ──
        streak = 0;
        document.getElementById('streak-message').textContent = '';
        clearComboBadge();

        setTimeout(() => {
            c1.classList.add('mismatch');
            c2.classList.add('mismatch');

            setTimeout(() => {
                c1.classList.remove('flipped', 'mismatch');
                c2.classList.remove('flipped', 'mismatch');
                flippedCards = [];
                canFlip = true;
            }, 500);
        }, 600);
    }
}

// ── Streak ──
function showStreakMessage() {
    const el  = document.getElementById('streak-message');
    const idx = Math.min(streak, streakMessages.length - 1);
    const msg = streakMessages[idx];

    if (msg) {
        el.textContent = msg;
        el.classList.remove('pop');
        void el.offsetWidth;          // force reflow for re-trigger
        el.classList.add('pop');
    } else {
        el.textContent = '';
    }
}

// ── End Game ──
function endGame() {
    if (timerInterval) clearInterval(timerInterval);
    canFlip = false;

    const m = Math.floor(gameSeconds / 60);
    const s = gameSeconds % 60;
    const timeStr = m > 0 ? `${m}m ${s}s` : `${s}s`;

    let rating;
    if (gameMoves <= 12)       rating = "Perfect memory! You're amazing! ✨";
    else if (gameMoves <= 18)  rating = 'Great job, Maya! 🌟';
    else if (gameMoves <= 25)  rating = 'Well done! 💙';
    else                       rating = 'You never give up — I love that! 😊';

    document.getElementById('win-stats').innerHTML =
        `${gameMoves} moves &middot; ${timeStr}<br><span class="win-rating">${rating}</span>`;

    // Show win overlay after a short dramatic pause
    setTimeout(() => {
        document.getElementById('game-win-overlay').classList.add('visible');
    }, 800);
}

// ── Nav ──
function backToCelebration() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('game-win-overlay').classList.remove('visible');
    clearComboBadge();
    showScene('scene-celebrate');
}

// ========================================
//  INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    refreshMicrocopy();
    setupMagneticButtons();
    setupWhimsyPointerEffects();
    setupNoButton();
    startIntro();
});
