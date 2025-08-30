// --- p5.js Sketch ---

let particles = [];
const PARTICLE_COUNT = 50;
const MAX_SPEED = 1;
const INTERACTION_RADIUS = 150;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();
    let particleColor = document.body.classList.contains('dark-mode') ? 255 : 0;

    particles.forEach(p => {
        p.update();
        p.draw(particleColor);
        p.checkInteraction(particles);
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.5, MAX_SPEED));
        this.acc = createVector(0, 0);
        this.size = 3;
        this.originalVel = this.vel.copy();
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Repel from mouse
        let mouse = createVector(mouseX, mouseY);
        let repulsion = this.repel(mouse);
        this.applyForce(repulsion);

        // Return to original velocity
        let steering = p5.Vector.sub(this.originalVel, this.vel);
        steering.limit(0.01);
        this.applyForce(steering);

        this.vel.add(this.acc);
        this.vel.limit(MAX_SPEED);
        this.pos.add(this.vel);
        this.acc.mult(0); // Reset acceleration
        this.edges();
    }

    draw(particleColor) {
        noStroke();
        fill(particleColor);
        circle(this.pos.x, this.pos.y, this.size);
    }

    edges() {
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
    }

    checkInteraction(otherParticles) {
        otherParticles.forEach(other => {
            if (this !== other) {
                let distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                if (distance < INTERACTION_RADIUS) {
                    let alpha = map(distance, 0, INTERACTION_RADIUS, 150, 0);
                    let particleColor = document.body.classList.contains('dark-mode') ? 255 : 0;
                    stroke(particleColor, alpha);
                    line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                }
            }
        });
    }

    repel(target) {
        let force = p5.Vector.sub(this.pos, target);
        let distance = force.mag();
        if (distance < INTERACTION_RADIUS) {
            let strength = map(distance, 0, INTERACTION_RADIUS, 1, 0);
            force.setMag(strength * 5); // Increase the multiplier for a stronger push
            return force;
        }
        return createVector(0, 0);
    }
}

// --- Core Website Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Switcher ---
    const lightModeBtn = document.getElementById('light-mode-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const body = document.body;

    body.classList.add('dark-mode'); // Default to dark mode

    lightModeBtn.addEventListener('click', () => {
        body.classList.remove('dark-mode');
    });

    darkModeBtn.addEventListener('click', () => {
        body.classList.add('dark-mode');
    });

    // --- Interactive Terminal ---
    const terminal = document.getElementById('terminal');
    const terminalToggleBtn = document.getElementById('terminal-toggle-btn');
    const terminalCloseBtn = document.getElementById('terminal-close-btn');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');

    const commands = {
        help: 'Available commands: help, about, timeline, contact, clear',
        about: 'I am a medical doctor turned AI Software Developer. I have a passion for learning and building new things.',
        timeline: `
My Journey:
- Medical Doctor: Graduated with an MBChB from Jabir bin Hayyan Medical University, College of Medicine.
- Hobbyist Programmer: Began my journey into the world of programming as a self-taught hobbyist.
- AI Software Developer: Currently working at Capsula.iq, building intelligent solutions.
        `,
        contact: 'You can reach me on GitHub: https://github.com/im0e',
    };

    let isTyping = false;
    const typeQueue = [];

    const typeWriter = (text, callback) => {
        isTyping = true;
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                terminalOutput.innerHTML += text.charAt(i);
                i++;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(typingInterval);
                isTyping = false;
                if (callback) callback();
                processQueue();
            }
        }, 20);
    };

    const processQueue = () => {
        if (typeQueue.length > 0 && !isTyping) {
            const nextMessage = typeQueue.shift();
            typeWriter(nextMessage.text, nextMessage.callback);
        }
    };

    const addToQueue = (text, callback) => {
        typeQueue.push({ text, callback });
        processQueue();
    };

    const processCommand = (cmd) => {
        terminalOutput.innerHTML += `> ${cmd}\n`;

        if (cmd === 'clear') {
            terminalOutput.innerHTML = '';
            return;
        }

        const response = commands[cmd] || `Command not found: ${cmd}. Type 'help' for a list of commands.`;
        addToQueue(response + '\n');
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isTyping) return;
            const command = terminalInput.textContent.trim();
            terminalInput.textContent = '';
            processCommand(command);
        }
    });

    const openTerminal = () => {
        terminal.classList.remove('hidden');
        terminalInput.focus();
        if (terminalOutput.innerHTML === '') {
            addToQueue("Welcome to the terminal. Type 'help' for a list of commands.\n");
        }
    };

    const closeTerminal = () => {
        terminal.classList.add('hidden');
    };

    terminalToggleBtn.addEventListener('click', openTerminal);
    terminalCloseBtn.addEventListener('click', closeTerminal);
});
