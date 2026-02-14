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

    const btn = document.getElementById('btn-no');
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const bw  = btn.offsetWidth;
    const bh  = btn.offsetHeight;
    const m   = 25;

    // Random position within viewport
    const nx = Math.random() * (vw - bw - m * 2) + m;
    const ny = Math.random() * (vh - bh - m * 2) + m;

    btn.classList.add('escaped');
    btn.style.left = nx + 'px';
    btn.style.top  = ny + 'px';

    // Update counter & texts
    noCount++;
    const idx = Math.min(noCount, noTexts.length - 1);
    btn.textContent = noTexts[idx];
    document.getElementById('subtitle').textContent =
        subtitleTexts[Math.min(noCount, subtitleTexts.length - 1)];
    document.getElementById('emoji-display').textContent =
        emojis[Math.min(noCount, emojis.length - 1)];

    // Grow the Yes button
    const yes   = document.getElementById('btn-yes');
    const cur   = parseFloat(getComputedStyle(yes).fontSize);
    const newSz = Math.min(cur * 1.14, 58);
    yes.style.fontSize = newSz + 'px';

    const padV = parseFloat(getComputedStyle(yes).paddingTop);
    const padH = parseFloat(getComputedStyle(yes).paddingLeft);
    yes.style.padding = `${Math.min(padV * 1.1, 32)}px ${Math.min(padH * 1.1, 65)}px`;
}

function setupNoButton() {
    const btn = document.getElementById('btn-no');
    btn.addEventListener('mouseenter',  moveNoButton);
    btn.addEventListener('touchstart',  moveNoButton, { passive: false });
    btn.addEventListener('click',       moveNoButton);
}

function handleYes() {
    showScene('scene-celebrate');
    startCelebration();
}

// ========================================
//  SCENE 3 — CELEBRATION
// ========================================
function startCelebration() {
    buildFlower();
    launchConfetti();
    spawnFloatingHearts();
    // Second wave of hearts
    setTimeout(spawnFloatingHearts, 5000);
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
//  INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    setupNoButton();
    startIntro();
});
