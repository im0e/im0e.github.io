document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const terminal = document.getElementById('terminal');

    // --- Matrix Rain ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(drawMatrix, 30);

    // --- Interactive Terminal ---
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
                output.innerHTML += text.charAt(i);
                i++;
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(typingInterval);
                isTyping = false;
                if (callback) callback();
                processQueue();
            }
        }, 50);
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
        output.innerHTML += `> ${cmd}\n`;

        if (cmd === 'clear') {
            output.innerHTML = '';
            return;
        }

        const response = commands[cmd] || `Command not found: ${cmd}. Type 'help' for a list of commands.`;
        addToQueue(response + '\n');
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isTyping) return; // Don't accept commands while typing
            const command = input.textContent.trim();
            input.textContent = '';
            processCommand(command);
        }
    });

    // Welcome message
    addToQueue("Welcome to my portfolio. Type 'help' to see available commands.\n", () => {
        input.focus();
    });
});
