(function() {
    // ========== MATRIX RAIN BACKGROUND ==========
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let w, h;
    function setCanvasDimensions() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const columns = Math.floor(w / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.floor(Math.random() * -h);
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 5, 0, 0.045)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = 'bold 16px "Share Tech Mono", monospace';
        ctx.shadowColor = '#1fff8e';
        ctx.shadowBlur = 6;
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 22;
            ctx.fillStyle = `rgba(50, 255, 100, ${Math.random()*0.5+0.3})`;
            ctx.fillText(char, x, drops[i]);
            if (drops[i] > h || Math.random() > 0.995) drops[i] = -20;
            else drops[i] += 16;
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // ========== REAL-TIME CLOCK ==========
    function updateClock() {
        const now = new Date();
        document.getElementById('largeClock').innerText = now.toLocaleTimeString('en-GB');
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ========== INTERACTIVE FILE SYSTEM ==========
    const fs = {
        name: 'root',
        type: 'folder',
        children: [
            { 
                name: 'socials', 
                type: 'folder', 
                children: [
                    { name: 'tiktok.link', type: 'file', content: 'https://www.tiktok.com/@espdefeator' },
                    { name: 'youtube.cfg', type: 'file', content: 'https://youtube.com/@espdefeator' },
                    { name: 'instagram.ini', type: 'file', content: 'https://instagram.com/espdefeator' },
                    { name: 'hub.dev', type: 'file', content: 'https://github.com/creeperrick' }
                ]
            },
            { 
                name: 'matrix', 
                type: 'folder', 
                children: [
                    { name: 'rain.sh', type: 'file', content: 'echo "system_override --green"' },
                    { name: 'glitch.conf', type: 'file', content: 'level=high' }
                ]
            },
            { name: 'README.md', type: 'file', content: 'Welcome to ESPdefeator OS v1.0' }
        ]
    };

    let currentFolder = fs.children[0]; // Start in socials folder
    let pathStack = [fs, fs.children[0]];

    const fileTreeEl = document.getElementById('fileTree');
    const folderIndicator = document.getElementById('folderIndicator');
    const currentPathEl = document.getElementById('currentPath');

    function renderTree(folder) {
        fileTreeEl.innerHTML = '';
        
        // Back Button
        if (folder !== fs) {
            const back = document.createElement('div');
            back.className = 'tree-item folder-open';
            back.textContent = '..';
            back.onclick = goUp;
            fileTreeEl.appendChild(back);
        }

        folder.children.forEach(child => {
            const isLink = child.type === 'file' && child.content.startsWith('http');
            const item = document.createElement(isLink ? 'a' : 'div');
            
            item.className = `tree-item ${child.type === 'folder' ? 'folder-open' : 'file'}`;
            item.textContent = child.name;
            if(isLink) {
                item.href = child.content;
                item.target = "_blank";
                item.style.textDecoration = "none";
                item.style.display = "block";
                item.style.color = "inherit";
            }

            item.onclick = (e) => {
                document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                
                if (child.type === 'folder') {
                    openFolder(child);
                } else {
                    addTerminalLine(`> executing: ${child.name}`);
                    if(!isLink) addTerminalLine(`> ${child.content}`);
                }
            };
            fileTreeEl.appendChild(item);
        });

        const pathNames = pathStack.map(f => f.name === 'root' ? '' : f.name).join('/');
        const displayPath = (pathNames || '/') + '/';
        folderIndicator.innerText = displayPath;
        currentPathEl.innerText = `⚡ ${displayPath}`;
    }

    function openFolder(folder) {
        pathStack.push(folder);
        renderTree(folder);
        addTerminalLine(`> cd ./${folder.name}`);
    }

    function goUp() {
        if (pathStack.length > 1) {
            pathStack.pop();
            renderTree(pathStack[pathStack.length - 1]);
            addTerminalLine(`> cd ..`);
        }
    }

    // ========== TERMINAL LOGIC ==========
    const terminalContent = document.getElementById('terminalContent');
    const hiddenInput = document.getElementById('hiddenTerminalInput');
    const terminalInputDisplay = document.getElementById('terminalInputDisplay');

    function addTerminalLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">>></span> ${text}`;
        terminalContent.insertBefore(line, document.getElementById('dynamicTerminalLine'));
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    hiddenInput.addEventListener('input', () => {
        terminalInputDisplay.innerText = hiddenInput.value + '_';
    });

    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTerminalLine(hiddenInput.value);
            hiddenInput.value = '';
            terminalInputDisplay.innerText = '_';
        }
    });

    // Start
    renderTree(currentFolder);
    addTerminalLine("System Initialized. Explorer Linked.");
})();