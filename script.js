// Three.js Scene Setup
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
camera.position.z = 5;

// Create 3D Objects
const objects = [];

// Birthday Cake
const cakeGeometry = new THREE.ConeGeometry(2, 2, 32);
const cakeMaterial = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
cake.position.set(-3, 0, 0);
objects.push({ mesh: cake, rotationSpeed: { x: 0.01, y: 0.02, z: 0 } });
scene.add(cake);

// Balloons
const createBalloon = (x, y, color) => {
    const balloonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const balloonMaterial = new THREE.MeshPhongMaterial({ color: color });
    const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
    balloon.position.set(x, y, 0);
    objects.push({ mesh: balloon, rotationSpeed: { x: 0.01, y: 0.01, z: 0.01 }, floatSpeed: 0.01 });
    scene.add(balloon);
};

const balloonColors = [0xff6b9d, 0xc44569, 0xf8b739, 0x30b0c0, 0x6c5ce7];
balloonColors.forEach((color, i) => {
    createBalloon(2 + i * 1.5, -1 + (i % 2) * 2, color);
});

// Stars
const starGeometry = new THREE.OctahedronGeometry(0.3, 0);
const starMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
for (let i = 0; i < 5; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
    );
    objects.push({ mesh: star, rotationSpeed: { x: 0.02, y: 0.03, z: 0.01 } });
    scene.add(star);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff69b4, 1, 100);
pointLight.position.set(-3, 2, 2);
scene.add(pointLight);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    objects.forEach(obj => {
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;

        if (obj.floatSpeed) {
            obj.mesh.position.y += Math.sin(Date.now() * 0.001 + obj.mesh.position.x) * obj.floatSpeed;
        }
    });

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Countdown Timer
let countdown = 10;
const counterEl = document.getElementById('counter');

function updateCountdown() {
    if (countdown > 0) {
        countdown--;
        counterEl.textContent = countdown;
        counterEl.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            counterEl.style.animation = 'pulse 1s infinite';
        }, 500);
        setTimeout(updateCountdown, 1000);
    } else {
        counterEl.textContent = '✨ Make a Wish! ✨';
        playAudio();
        createConfetti();
    }
}

updateCountdown();

// Confetti Animation
function createConfetti() {
    const confettiEmojis = ['🎉', '🎊', '🎈', '🎁', '⭐', '✨', '💝', '🌟'];

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight / 2 + 'px';
        particle.style.--tx = (Math.random() - 0.5) * 200 + 'px';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 3000);
    }
}

// Start Animation Button
function startAnimation() {
    createConfetti();
    playAudio();
    
    // Animate objects
    objects.forEach(obj => {
        obj.rotationSpeed.x *= 3;
        obj.rotationSpeed.y *= 3;
        obj.rotationSpeed.z *= 3;
    });

    setTimeout(() => {
        objects.forEach(obj => {
            obj.rotationSpeed.x /= 3;
            obj.rotationSpeed.y /= 3;
            obj.rotationSpeed.z /= 3;
        });
    }, 1500);
}

// Sound Control
let soundEnabled = true;
const soundBtn = document.getElementById('soundBtn');

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    soundBtn.style.background = soundEnabled 
        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        : 'linear-gradient(135deg, #a8a8a8 0%, #7a7a7a 100%)';
}

function playAudio() {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00]; // C D E F G

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.5);
    });
}

// Particle Effects on Mouse Move
document.addEventListener('mousemove', (e) => {
    const randomEmoji = ['✨', '💫', '⭐'];
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = randomEmoji[Math.floor(Math.random() * randomEmoji.length)];
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.fontSize = '1rem';
    particle.style.opacity = '0.7';
    particle.style.pointerEvents = 'none';
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
});

// Click anywhere to create burst effect
document.addEventListener('click', (e) => {
    const confettiEmojis = ['🎉', '🎊', '💖', '✨'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        const angle = (i / 20) * Math.PI * 2;
        particle.style.setProperty('--tx', Math.cos(angle) * 100 + 'px');
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 3000);
    }
});