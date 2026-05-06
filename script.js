// Data for Table 6.2.1-1: UE Power Class
// Including standard n1 supporting Class 3=24dBm and Class 2=26dBm as requested by user
const bandSupportData = {
    "n1": [
        { class_level: 3, power: "24 dBm" },
        { class_level: 2, power: "26 dBm" }
    ],
    "n2": [ { class_level: 3, power: "24 dBm" } ],
    "n3": [ { class_level: 3, power: "24 dBm" } ],
    "n5": [ { class_level: 3, power: "24 dBm" } ],
    "n7": [ { class_level: 3, power: "24 dBm" } ],
    "n8": [ { class_level: 3, power: "24 dBm" } ],
    "n20": [ { class_level: 3, power: "24 dBm" } ],
    "n28": [ { class_level: 3, power: "24 dBm" } ],
    "n38": [ { class_level: 3, power: "24 dBm" } ],
    "n40": [ { class_level: 3, power: "24 dBm" } ],
    "n41": [
        { class_level: 3, power: "24 dBm" },
        { class_level: 2, power: "26 dBm" }
    ],
    "n66": [ { class_level: 3, power: "24 dBm" } ],
    "n71": [ { class_level: 3, power: "24 dBm" } ],
    "n77": [
        { class_level: 3, power: "24 dBm" },
        { class_level: 2, power: "26 dBm" }
    ],
    "n78": [
        { class_level: 3, power: "24 dBm" },
        { class_level: 2, power: "26 dBm" }
    ],
    "n79": [
        { class_level: 3, power: "24 dBm" },
        { class_level: 2, power: "26 dBm" }
    ],
    "n257": [ { class_level: 1, power: "31 dBm" }, { class_level: 3, power: "24 dBm" } ],
    "n258": [ { class_level: 1, power: "31 dBm" }, { class_level: 3, power: "24 dBm" } ]
};

// MPR Rules mapping from Table 6.2.2-1 (Class 3) and 6.2.2-2 (Class 2)
const mprRules = {
    3: {
        "DFT-s-OFDM": {
            "Pi/2 BPSK": { "Edge": "≤ 3.5", "Outer": "≤ 1.2", "Inner": "≤ 0.2" },
            "QPSK": { "Edge": "≤ 1", "Outer": "≤ 1", "Inner": "0" },
            "16 QAM": { "Edge": "≤ 2", "Outer": "≤ 2", "Inner": "≤ 1" },
            "64 QAM": { "Edge": "≤ 2.5", "Outer": "≤ 2.5", "Inner": "≤ 2.5" },
            "256 QAM": { "Edge": "≤ 4.5", "Outer": "≤ 4.5", "Inner": "≤ 4.5" }
        },
        "CP-OFDM": {
            "QPSK": { "Edge": "≤ 3", "Outer": "≤ 3", "Inner": "≤ 1.5" },
            "16 QAM": { "Edge": "≤ 3", "Outer": "≤ 3", "Inner": "≤ 2" },
            "64 QAM": { "Edge": "≤ 3.5", "Outer": "≤ 3.5", "Inner": "≤ 3.5" },
            "256 QAM": { "Edge": "≤ 6.5", "Outer": "≤ 6.5", "Inner": "≤ 6.5" }
        }
    },
    2: {
        "DFT-s-OFDM": {
            "Pi/2 BPSK": { "Edge": "≤ 3.5", "Outer": "≤ 0.5", "Inner": "0" },
            "QPSK": { "Edge": "≤ 3.5", "Outer": "≤ 1", "Inner": "0" },
            "16 QAM": { "Edge": "≤ 3.5", "Outer": "≤ 2", "Inner": "≤ 1" },
            "64 QAM": { "Edge": "≤ 3.5", "Outer": "≤ 2.5", "Inner": "≤ 2.5" },
            "256 QAM": { "Edge": "≤ 4.5", "Outer": "≤ 4.5", "Inner": "≤ 4.5" }
        },
        "CP-OFDM": {
            "QPSK": { "Edge": "≤ 3.5", "Outer": "≤ 3", "Inner": "≤ 1.5" },
            "16 QAM": { "Edge": "≤ 3.5", "Outer": "≤ 3", "Inner": "≤ 2" },
            "64 QAM": { "Edge": "≤ 3.5", "Outer": "≤ 3.5", "Inner": "≤ 3.5" },
            "256 QAM": { "Edge": "≤ 6.5", "Outer": "≤ 6.5", "Inner": "≤ 6.5" }
        }
    }
};

// DOM Elements
const bandInput = document.getElementById('band-input');
const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const resultBandName = document.getElementById('result-band-name');
const classesContainer = document.getElementById('classes-container');
const errorMsg = document.getElementById('error-msg');

const waveformSelect = document.getElementById('waveform-select');
const modSelect = document.getElementById('mod-select');
const rbSelect = document.getElementById('rb-select');

function formatBandInput(input) {
    let clean = input.trim().toLowerCase();
    // if users just input '1' instead of 'n1', we add 'n'
    if (clean && !clean.startsWith('n')) {
        clean = 'n' + clean;
    }
    return clean;
}

function getMprValue(classLevel) {
    const wave = waveformSelect.value;
    const mod = modSelect.value;
    const rb = rbSelect.value;
    
    if (!mprRules[classLevel] || !mprRules[classLevel][wave] || !mprRules[classLevel][wave][mod]) {
        return "N/A";
    }
    return mprRules[classLevel][wave][mod][rb] || "N/A";
}

function handleSearch(isUpdate = false) {
    const rawVal = bandInput.value;
    if (!rawVal) return;
    
    const bandName = formatBandInput(rawVal);
    
    // Reset state only if it's a new search
    if (!isUpdate) {
        errorMsg.classList.add('hidden');
        resultContainer.classList.remove('show');
        resultContainer.classList.add('hidden'); // ensure it's hidden before animation
    }
    
    // Check if we have data for this band
    const data = bandSupportData[bandName];
    
    if (data) {
        // Render Result
        resultBandName.textContent = `Band ${bandName.toUpperCase()}`;
        classesContainer.innerHTML = '';
        
        data.forEach(item => {
            const classCard = document.createElement('div');
            classCard.className = `class-item pc${item.class_level}`;
            const powerVal = item.power.split(' ')[0];
            const powerUnit = item.power.split(' ')[1];
            
            const mprHtml = (item.class_level === 2 || item.class_level === 3) 
                ? `<div class="mpr-data">MPR: <strong>${getMprValue(item.class_level)} dB</strong></div>` 
                : `<div class="mpr-data">MPR: <strong>N/A</strong></div>`;
            
            classCard.innerHTML = `
                <div class="class-name">Class ${item.class_level}</div>
                <div class="power-value">${powerVal}</div>
                <div class="power-unit">${powerUnit}</div>
                ${mprHtml}
            `;
            
            classesContainer.appendChild(classCard);
        });
        
        if (!isUpdate) {
            setTimeout(() => {
                resultContainer.classList.remove('hidden');
                resultContainer.classList.add('show');
            }, 50);
        }
        
    } else {
        // Default behavior for other valid 5G bands not explicitly in the dictionary
        if (bandName.match(/^n[1-9][0-9]{0,2}$/)) {
            resultBandName.textContent = `Band ${bandName.toUpperCase()} (Default)`;
            const defaultMprHtml = `<div class="mpr-data">MPR: <strong>${getMprValue(3)} dB</strong></div>`;
            
            classesContainer.innerHTML = `
                <div class="class-item pc3">
                    <div class="class-name">Class 3</div>
                    <div class="power-value">24</div>
                    <div class="power-unit">dBm</div>
                    ${defaultMprHtml}
                </div>
            `;
            if (!isUpdate) {
                setTimeout(() => {
                    resultContainer.classList.remove('hidden');
                    resultContainer.classList.add('show');
                }, 50);
            }
        } else {
            if (!isUpdate) errorMsg.classList.remove('hidden');
        }
    }
}

function updateBasedOnSelect() {
    // If CP-OFDM and Pi/2 BPSK are conflicting, auto-correct since CP-OFDM has no Pi/2 BPSK
    if (waveformSelect.value === 'CP-OFDM' && modSelect.value === 'Pi/2 BPSK') {
        modSelect.value = 'QPSK';
    }
    
    if (!resultContainer.classList.contains('hidden')) {
        handleSearch(true); // isUpdate = true to prevent flicker
    }
}

// Event Listeners
waveformSelect.addEventListener('change', updateBasedOnSelect);
modSelect.addEventListener('change', () => {
    if (waveformSelect.value === 'CP-OFDM' && modSelect.value === 'Pi/2 BPSK') {
        waveformSelect.value = 'DFT-s-OFDM'; // Auto-correct the waveform instead
    }
    updateBasedOnSelect();
});
rbSelect.addEventListener('change', updateBasedOnSelect);

searchBtn.addEventListener('click', () => handleSearch(false));

// Sidebar Tab Navigation
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove active from all navs
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add active to clicked nav
        item.classList.add('active');
        
        // Hide all tabs
        tabContents.forEach(tab => {
            tab.classList.remove('active');
            tab.classList.add('hidden');
        });
        
        // Show target tab
        const targetId = item.getAttribute('data-target');
        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.remove('hidden');
            targetTab.classList.add('active');
        }
    });
});

bandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// ============================================
// EVM Module (Table 6.4.2.1-1)
// ============================================

const evmData = {
    "Pi/2-BPSK": 30, // %
    "QPSK": 17.5,
    "16 QAM": 12.5,
    "64 QAM": 8,
    "256 QAM": 3.5
};

const evmModSelect = document.getElementById('evm-mod-select');
const evmLimitValue = document.getElementById('evm-limit-value');
const canvas = document.getElementById('constellation-canvas');
let ctx = null;
if (canvas) {
    ctx = canvas.getContext('2d');
}
let evmAnimationId = null;

function drawConstellation(mod, evmLimit) {
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear with slight trailing effect for realism
    ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw crosshair axes
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); // I axis
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); // Q axis
    ctx.stroke();
    
    // Draw outer reference square (fits QAM grids better)
    const maxRadius = 110;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.rect(centerX - maxRadius, centerY - maxRadius, maxRadius * 2, maxRadius * 2);
    ctx.stroke();
    
    // Determine ideal constellation points
    let idealPoints = [];
    
    if (mod === "Pi/2-BPSK") {
        idealPoints.push({x: maxRadius, y: 0});
        idealPoints.push({x: -maxRadius, y: 0});
        idealPoints.push({x: 0, y: maxRadius});
        idealPoints.push({x: 0, y: -maxRadius});
    } else {
        let gridDim = 0;
        if (mod === "QPSK") gridDim = 2;
        else if (mod === "16 QAM") gridDim = 4;
        else if (mod === "64 QAM") gridDim = 8;
        else if (mod === "256 QAM") gridDim = 16;
        
        const cornerCoord = gridDim - 1;
        
        for (let i = 0; i < gridDim; i++) {
            for (let j = 0; j < gridDim; j++) {
                // map to -1 to +1 range based on coordinates
                const xNorm = ((i * 2) - cornerCoord) / cornerCoord;
                const yNorm = ((j * 2) - cornerCoord) / cornerCoord;
                
                idealPoints.push({
                    x: xNorm * maxRadius,
                    y: yNorm * maxRadius
                });
            }
        }
    }
    
    // Calculate noise spread (standard deviation) based on SIMULATED EVM
    const stdDev = (evmLimit / 100) * maxRadius * 0.8; 
    const dotsPerSymbol = mod === "256 QAM" ? 2 : (mod === "64 QAM" ? 4 : 10);
    
    idealPoints.forEach(p => {
        // Draw ideal symbol marker (faintly)
        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY - p.y, mod === "256 QAM" ? 0.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();
        
        // Scatter noise dots around ideal point (Gaussian Box-Muller transform)
        // If EVM is extremely high, points just scatter everywhere making it look like pure noise
        ctx.fillStyle = "rgba(34, 211, 238, 0.9)"; // Bright neon cyan
        
        for(let n=0; n<dotsPerSymbol; n++){
            let u1 = Math.random();
            let u2 = Math.random();
            // prevent log(0)
            u1 = u1 < 1e-10 ? 1e-10 : u1;
            
            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
            
            let nx = p.x + z0 * stdDev;
            let ny = p.y + z1 * stdDev;
            
            ctx.beginPath();
            ctx.arc(centerX + nx, (centerY - ny), mod === "256 QAM" ? 0.8 : 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    evmAnimationId = requestAnimationFrame(() => drawConstellation(mod, evmLimit));
}

function updateEVM() {
    const mod = evmModSelect.value;
    const limit = evmData[mod];
    
    const snrSlider = document.getElementById('snr-slider');
    const snrDisplayVal = document.getElementById('snr-display-val');
    const evmSimValue = document.getElementById('evm-sim-value');
    const evmPassFail = document.getElementById('evm-pass-fail');
    
    const snrDb = parseFloat(snrSlider.value);
    snrDisplayVal.textContent = snrDb.toFixed(1) + ' dB';
    
    // EVM_rms ≈ 1 / sqrt(10^(SNR/10))
    const snrLinear = Math.pow(10, snrDb / 10);
    const simEvmLinear = 1 / Math.sqrt(snrLinear);
    const simEvmPercent = simEvmLinear * 100;
    
    // Update numeric limit
    evmLimitValue.textContent = limit;
    
    if (simEvmPercent > 999) {
        evmSimValue.textContent = ">999";
    } else {
        evmSimValue.textContent = simEvmPercent.toFixed(1);
    }
    
    // Check Pass/Fail
    if (simEvmPercent <= limit) {
        evmPassFail.textContent = '✅ PASS';
        evmPassFail.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        evmPassFail.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        evmPassFail.style.color = '#10b981';
        evmSimValue.style.color = '#10b981';
        evmSimValue.style.textShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
    } else {
        evmPassFail.textContent = '❌ FAIL - EVM Limit Exceeded';
        evmPassFail.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        evmPassFail.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        evmPassFail.style.color = '#ef4444';
        evmSimValue.style.color = '#ef4444';
        evmSimValue.style.textShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
    }
    
    // Update live simulator
    if (evmAnimationId) cancelAnimationFrame(evmAnimationId);
    
    // Initial clear to reset trails
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    drawConstellation(mod, simEvmPercent);
}

if (evmModSelect) {
    evmModSelect.addEventListener('change', updateEVM);
    const snrSlider = document.getElementById('snr-slider');
    if (snrSlider) {
        snrSlider.addEventListener('input', updateEVM);
    }
    
    // Setting a slight timeout to ensure canvas is ready
    setTimeout(updateEVM, 100);
}

// ============================================
// ACLR Module (Table 6.5.2.4.1)
// ============================================

const aclrLimits = {
    "1": 37,
    "1.5": 31,
    "2": 31,
    "3": 30
};

const aclrBwSelect = document.getElementById('aclr-bw-select');
const aclrPcSelect = document.getElementById('aclr-pc-select');
const aclrLimitValue = document.getElementById('aclr-limit-value');
const aclrCanvas = document.getElementById('aclr-canvas');
const aclrPaOut = document.getElementById('aclr-pa-out');
const aclrPaP1db = document.getElementById('aclr-pa-p1db');
const aclrStatusBanner = document.getElementById('aclr-status-banner');
let aclrCtx = null;
if (aclrCanvas) {
    aclrCtx = aclrCanvas.getContext('2d');
}

let aclrAnimationId = null;
let spectrumPhase = 0;

function drawACLR(bw, limit, isFail) {
    if (!aclrCtx) return;
    
    const cw = aclrCanvas.width;
    const ch = aclrCanvas.height;
    
    // Slight trail clear for animation smoothness
    aclrCtx.fillStyle = "rgba(15, 23, 42, 0.4)";
    aclrCtx.fillRect(0, 0, cw, ch);
    
    // Draw background grid
    aclrCtx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    aclrCtx.lineWidth = 1;
    aclrCtx.beginPath();
    
    for(let y=40; y<ch; y+=40) {
        aclrCtx.moveTo(0, y); aclrCtx.lineTo(cw, y);
    }
    for(let x=0; x<=cw; x+=cw/6) {
        aclrCtx.moveTo(x, 0); aclrCtx.lineTo(x, ch);
    }
    aclrCtx.stroke();
    
    // Axes labels
    aclrCtx.fillStyle = "rgba(148, 163, 184, 0.6)";
    aclrCtx.font = "12px sans-serif";
    aclrCtx.fillText("Power", 10, 20);
    aclrCtx.fillText("Frequency", cw - 70, ch - 10);
    
    // Coordinate mapping
    const centerX = cw / 2;
    const peakY = 60; // top main channel
    const noiseFloorY = ch - 40; // bottom baseline noise
    
    // ACLR limit drop visually
    // Let's say visually 4 px = 1 dB. So limitDrop = limit * 4.
    const limitDrop = limit * 4;
    const limitY = peakY + limitDrop;
    
    // Calculate drawn channel width based on bandwidth (Max BW is 100MHz)
    const pixelBw = Math.max(40, bw * 1.5);
    const spacing = 15; // frequency spacing between channels
    
    // Draw horizontal reference limit line
    aclrCtx.strokeStyle = "rgba(244, 63, 94, 0.5)"; // red dashed
    aclrCtx.setLineDash([5, 5]);
    aclrCtx.beginPath();
    aclrCtx.moveTo(0, limitY); aclrCtx.lineTo(cw, limitY);
    aclrCtx.stroke();
    aclrCtx.setLineDash([]);
    
    aclrCtx.fillStyle = "rgba(244, 63, 94, 0.8)";
    aclrCtx.fillText(`-${limit} dB Limit`, 10, limitY - 5);
    
    // Helper function to draw OFDM spectrum block
    function drawChannel(x, width, peak, isMain, label) {
        aclrCtx.beginPath();
        aclrCtx.moveTo(x - width/2 - 20, noiseFloorY);
        
        // Left side skirt
        aclrCtx.quadraticCurveTo(x - width/2, noiseFloorY, x - width/2 + 5, peak);
        
        // Flat top (add simulated spectrum noise)
        for(let i = x - width/2 + 5; i <= x + width/2 - 5; i+=4) {
            let n = (Math.sin(spectrumPhase + i) * 3) + (Math.random() * 6 - 3);
            aclrCtx.lineTo(i, peak + n);
        }
        
        // Right side skirt
        aclrCtx.quadraticCurveTo(x + width/2, noiseFloorY, x + width/2 + 20, noiseFloorY);
        
        // Gradient fill
        const gradient = aclrCtx.createLinearGradient(0, peak, 0, noiseFloorY);
        if (isMain) {
            gradient.addColorStop(0, "rgba(56, 189, 248, 0.7)");
            gradient.addColorStop(1, "rgba(56, 189, 248, 0.1)");
            aclrCtx.strokeStyle = "rgba(56, 189, 248, 0.9)";
        } else {
            gradient.addColorStop(0, "rgba(244, 63, 94, 0.7)");
            gradient.addColorStop(1, "rgba(244, 63, 94, 0.1)");
            aclrCtx.strokeStyle = "rgba(244, 63, 94, 0.9)";
        }
        
        aclrCtx.fillStyle = gradient;
        aclrCtx.fill();
        aclrCtx.lineWidth = 1.5;
        aclrCtx.stroke();
        
        // Optional Label
        if (label) {
            aclrCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
            aclrCtx.textAlign = "center";
            aclrCtx.font = "13px sans-serif";
            aclrCtx.fillText(label, x, noiseFloorY + 25);
            aclrCtx.textAlign = "left"; // reset
        }
    }
    
    // Main Channel (Carrier)
    drawChannel(centerX, pixelBw, peakY, true, `${bw} MHz`);
    
    // Adjacent Channels
    let adjNoise = Math.sin(spectrumPhase * 0.5) * 5; 
    let adjPeakY;
    
    if (isFail) {
        // Non-linear Spectral Regrowth: Adjacent channel power shoots up above the limit
        adjPeakY = limitY - 25 + adjNoise * 2; // visually jumps above limit line (smaller Y is higher)
    } else {
        adjPeakY = limitY + 10 + adjNoise; // passing result
    }
    
    drawChannel(centerX - pixelBw - spacing*2, pixelBw, adjPeakY, false, "Adj L");
    drawChannel(centerX + pixelBw + spacing*2, pixelBw, adjPeakY, false, "Adj R");
    
    // Base thermal noise floor
    aclrCtx.beginPath();
    aclrCtx.moveTo(0, noiseFloorY);
    for(let x=0; x<=cw; x+=2) {
        let nf = noiseFloorY + (Math.random() * 4 - 2);
        aclrCtx.lineTo(x, nf);
    }
    aclrCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    aclrCtx.stroke();
    
    spectrumPhase += 0.3;
    aclrAnimationId = requestAnimationFrame(() => drawACLR(bw, limit, isFail));
}

function updateACLR() {
    if (!aclrPcSelect) return;
    const pc = aclrPcSelect.value;
    const bw = parseFloat(aclrBwSelect.value);
    const limit = aclrLimits[pc];
    const pOut = aclrPaOut ? parseFloat(aclrPaOut.value) : 24;
    const p1db = aclrPaP1db ? parseFloat(aclrPaP1db.value) : 26;
    
    aclrLimitValue.textContent = limit;
    
    let isFail = false;
    if (pOut >= p1db) {
        isFail = true;
        if (aclrStatusBanner) {
            aclrStatusBanner.textContent = '❌ ACLR Exceeded (PA Deep Compression)';
            aclrStatusBanner.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            aclrStatusBanner.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            aclrStatusBanner.style.color = '#ef4444';
        }
    } else {
        if (aclrStatusBanner) {
            aclrStatusBanner.textContent = '✅ ACLR Pass (Linear Region)';
            aclrStatusBanner.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            aclrStatusBanner.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            aclrStatusBanner.style.color = '#10b981';
        }
    }
    
    if (aclrAnimationId) cancelAnimationFrame(aclrAnimationId);
    
    if (aclrCtx) {
        aclrCtx.clearRect(0, 0, aclrCanvas.width, aclrCanvas.height);
    }
    
    // Trigger redraw
    drawACLR(bw, limit, isFail);
}

if (aclrPcSelect) {
    aclrPcSelect.addEventListener('change', updateACLR);
    aclrBwSelect.addEventListener('change', updateACLR);
    if (aclrPaOut) aclrPaOut.addEventListener('input', updateACLR);
    if (aclrPaP1db) aclrPaP1db.addEventListener('input', updateACLR);
    
    // Tab event listener modification to initialize animations only when visible
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'aclr') {
                setTimeout(updateACLR, 10);
            }
        });
    });
    
    setTimeout(updateACLR, 100);
}

// ============================================
// SEM Module (Table 6.5.2.2-1)
// ============================================

const semBwSelect = document.getElementById('sem-bw-select');
const semTableBody = document.getElementById('sem-table-body');
const semCanvas = document.getElementById('sem-canvas');
let semCtx = null;
if (semCanvas) {
    semCtx = semCanvas.getContext('2d');
}

let semAnimationId = null;
let semSpectrumPhase = 0;

function getSemMask(bw) {
    if (bw === 3) {
        return [
            { start: 0, end: 1, limit: -13 },
            { start: 1, end: 5, limit: -10 },
            { start: 5, end: 6, limit: -25 }
        ];
    } else if (bw === 5) {
        return [
            { start: 0, end: 1, limit: -13 },
            { start: 1, end: 5, limit: -10 },
            { start: 5, end: 6, limit: -13 },
            { start: 6, end: 10, limit: -25 }
        ];
    } else if (bw >= 10 && bw < 50) {
        return [
            { start: 0, end: 1, limit: -13 },
            { start: 1, end: 5, limit: -10 },
            { start: 5, end: bw, limit: -13 },
            { start: bw, end: bw + 5, limit: -25 }
        ];
    } else if (bw >= 50) {
        return [
            { start: 0, end: 1, limit: -24 },
            { start: 1, end: 5, limit: -10 },
            { start: 5, end: bw, limit: -13 },
            { start: bw, end: bw + 5, limit: -25 }
        ];
    }
    return [];
}

function updateSemTable(maskData) {
    if (!semTableBody) return;
    semTableBody.innerHTML = '';
    maskData.forEach(m => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        tr.innerHTML = `
            <td style="padding: 0.5rem;">± ${m.start} ~ ${m.end}</td>
            <td style="padding: 0.5rem; color: #f43f5e; font-weight: bold;">${m.limit}</td>
        `;
        semTableBody.appendChild(tr);
    });
}

function drawSEM(bw, maskData) {
    if (!semCtx) return;
    
    const cw = semCanvas.width;
    const ch = semCanvas.height;
    
    // Clear trail
    semCtx.fillStyle = "rgba(15, 23, 42, 0.4)";
    semCtx.fillRect(0, 0, cw, ch);
    
    // Grid
    semCtx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    semCtx.lineWidth = 1;
    semCtx.beginPath();
    for(let y=40; y<ch; y+=40) { semCtx.moveTo(0, y); semCtx.lineTo(cw, y); }
    for(let x=0; x<=cw; x+=cw/8) { semCtx.moveTo(x, 0); semCtx.lineTo(x, ch); }
    semCtx.stroke();
    
    semCtx.fillStyle = "rgba(148, 163, 184, 0.6)";
    semCtx.font = "12px sans-serif";
    semCtx.fillText("Power (dBm)", 10, 20);
    semCtx.fillText("f_offset (MHz)", cw - 80, ch - 10);
    
    const centerX = cw / 2;
    // Map Power: Let's map +30dBm to Y=50, and -40dBm to Y=ch-50
    const maxPwr = 30;
    const minPwr = -50;
    const rangePwr = maxPwr - minPwr;
    const drawHeight = ch - 100;
    
    function mapY(dbm) {
        return Math.max(20, 50 + ((maxPwr - dbm) / rangePwr) * drawHeight);
    }
    
    // Map Frequency: Max offset = bw/2 + bw + 5
    const maxOffset = (bw / 2) + bw + 10;
    function mapX(freqOffset) {
        return centerX + (freqOffset / maxOffset) * (cw / 2 - 20);
    }
    
    // 1. Draw Simulated Signal (Green/Blue gradient with noise)
    semCtx.beginPath();
    semCtx.moveTo(0, ch);
    
    let px, py;
    for (let f = -maxOffset; f <= maxOffset; f += (maxOffset/150)) {
        px = mapX(f);
        let currentPwr = -45 + (Math.random() * 4 - 2); // deep thermal noise floor
        
        let abso = Math.abs(f) - bw/2; // offset from channel edge
        if (f >= -bw/2 && f <= bw/2) {
            // Main channel
            let edgeDist = (bw/2) - Math.abs(f);
            if (edgeDist < bw*0.05) {
               currentPwr = maxPwr - ((bw*0.05 - edgeDist)/(bw*0.05)) * 60;
            } else {
               currentPwr = 25 - (Math.abs(f)/(bw/2))*2 + (Math.sin(semSpectrumPhase + f*5) * 1.5) + (Math.random()*3 - 1.5);
            }
        } else {
            // Mask limits leakage simulation
            let targetMask = -40;
            for (let m of maskData) {
                if (abso >= m.start && abso < m.end) {
                    targetMask = m.limit - 5 - Math.random()*5; // 5dB safety margin
                    break;
                }
            }
            // Leakage roll-off
            let distFromEdge = abso;
            let organicSlope = Math.max(0, 15 - distFromEdge*2); // exponential-ish roll off before hitting noise floor
            currentPwr = Math.min(targetMask, -20 - distFromEdge*1.5) + organicSlope + (Math.random()*4 - 2);
            
            // Re-restrict if organic slope went above mask (very unlikely with Math.min, but just in case)
            if (currentPwr > targetMask) currentPwr = targetMask - Math.random()*2;
        }
        
        semCtx.lineTo(px, mapY(currentPwr));
    }
    semCtx.lineTo(cw, ch);
    
    const grad = semCtx.createLinearGradient(0, 50, 0, ch-50);
    grad.addColorStop(0, "rgba(52, 211, 153, 0.6)"); // Emerald
    grad.addColorStop(1, "rgba(52, 211, 153, 0.05)");
    semCtx.fillStyle = grad;
    semCtx.fill();
    semCtx.strokeStyle = "rgba(52, 211, 153, 0.9)";
    semCtx.lineWidth = 1.5;
    semCtx.stroke();
    
    // 2. Draw SEM Mask (Red limit lines)
    semCtx.beginPath();
    semCtx.strokeStyle = "rgba(244, 63, 94, 0.9)"; // Rose red
    semCtx.lineWidth = 3;
    
    // Left Mask
    let first = true;
    for(let i=maskData.length-1; i>=0; i--) {
        let m = maskData[i];
        let x1 = mapX(-(bw/2 + m.end));
        let x2 = mapX(-(bw/2 + m.start));
        let y = mapY(m.limit);
        if (first) { semCtx.moveTo(x1, y); first = false;}
        else { semCtx.lineTo(x1, y); }
        semCtx.lineTo(x2, y);
    }
    
    semCtx.lineTo(mapX(-bw/2), mapY(25));
    // Right Mask
    semCtx.moveTo(mapX(bw/2), mapY(25));
    for(let i=0; i<maskData.length; i++) {
        let m = maskData[i];
        let x1 = mapX(bw/2 + m.start);
        let x2 = mapX(bw/2 + m.end);
        let y = mapY(m.limit);
        semCtx.lineTo(x1, y);
        semCtx.lineTo(x2, y);
    }
    semCtx.stroke();
    
    // Reference edge dashed lines
    semCtx.setLineDash([3, 3]);
    semCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    semCtx.beginPath();
    semCtx.moveTo(mapX(-bw/2), 40); semCtx.lineTo(mapX(-bw/2), ch);
    semCtx.moveTo(mapX(bw/2), 40); semCtx.lineTo(mapX(bw/2), ch);
    semCtx.stroke();
    semCtx.setLineDash([]);
    
    // Edge Labels
    semCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
    semCtx.textAlign = "center";
    semCtx.fillText(`-BW/2`, mapX(-bw/2), ch - 30);
    semCtx.fillText(`+BW/2`, mapX(bw/2), ch - 30);
    semCtx.textAlign = "left";
    
    semSpectrumPhase += 0.3;
    semAnimationId = requestAnimationFrame(() => drawSEM(bw, maskData));
}

function updateSEM() {
    if (!semBwSelect) return;
    const bw = parseFloat(semBwSelect.value);
    const maskData = getSemMask(bw);
    
    updateSemTable(maskData);
    
    if (semAnimationId) cancelAnimationFrame(semAnimationId);
    
    if (semCtx) {
        semCtx.clearRect(0, 0, semCanvas.width, semCanvas.height);
    }
    drawSEM(bw, maskData);
}

if (semBwSelect) {
    semBwSelect.addEventListener('change', updateSEM);
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'sem') {
                setTimeout(updateSEM, 10);
            }
        });
    });
    
    setTimeout(updateSEM, 100);
}

// ============================================
// In-band Emission Module (Table 6.4.2.3-1)
// ============================================

const inbandPoutInput = document.getElementById('inband-pout');
const inbandRbPosSelect = document.getElementById('inband-rb-pos');
const inbandCarrierLimitText = document.getElementById('inband-carrier-limit');
const inbandImageLimitText = document.getElementById('inband-image-limit');
const inbandCanvas = document.getElementById('inband-canvas');

let inbandCtx = null;
if (inbandCanvas) {
    inbandCtx = inbandCanvas.getContext('2d');
}

let inbandAnimationId = null;
let inbandPhase = 0;

function getCarrierLeakageLimit(pOut) {
    if (pOut > 10) return -28;
    if (pOut >= 0 && pOut <= 10) return -25;
    if (pOut >= -30 && pOut < 0) return -20;
    return -10;
}

function getIqImageLimit(pOut) {
    if (pOut > 10) return -28;
    return -25;
}

function drawInbandEmission(pOut, rbPos) {
    if (!inbandCtx) return;
    
    const cw = inbandCanvas.width;
    const ch = inbandCanvas.height;
    
    // Limits
    const carrierLim = getCarrierLeakageLimit(pOut);
    const iqLim = getIqImageLimit(pOut);
    
    // Update texts
    if (inbandCarrierLimitText) inbandCarrierLimitText.textContent = carrierLim;
    if (inbandImageLimitText) inbandImageLimitText.textContent = iqLim;
    
    // Clear
    inbandCtx.fillStyle = "rgba(15, 23, 42, 0.4)";
    inbandCtx.fillRect(0, 0, cw, ch);
    
    // Grid
    inbandCtx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    inbandCtx.lineWidth = 1;
    inbandCtx.beginPath();
    for(let y=40; y<ch; y+=40) { inbandCtx.moveTo(0, y); inbandCtx.lineTo(cw, y); }
    for(let x=0; x<=cw; x+=cw/8) { inbandCtx.moveTo(x, 0); inbandCtx.lineTo(x, ch); }
    inbandCtx.stroke();
    
    inbandCtx.fillStyle = "rgba(148, 163, 184, 0.6)";
    inbandCtx.font = "12px sans-serif";
    inbandCtx.fillText("Power (dBc)", 10, 20);
    inbandCtx.fillText(rbPos === 'left' ? "-BW/2" : (rbPos === 'right' ? "-BW/2" : "-BW/2"), 10, ch - 10);
    inbandCtx.fillText("DC (LO)", cw/2 - 20, ch - 10);
    
    const centerX = cw / 2;
    // Let's assume Carrier is 0 dBc. So limits are negative values.
    // Map max 10 dBc, min -50 dBc
    const maxDbc = 10;
    const minDbc = -50;
    const rangeDbc = maxDbc - minDbc;
    
    function mapY(dbc) {
        return Math.max(20, 50 + ((maxDbc - dbc) / rangeDbc) * (ch - 100));
    }
    
    const signalWidth = cw * 0.25; // 25% of visual width
    let sigStartX, sigEndX;
    let imgStartX, imgEndX;
    
    if (rbPos === 'left') {
        sigStartX = centerX - signalWidth - 40;
        sigEndX = centerX - 40;
        // Image is mirrored
        imgStartX = centerX + 40;
        imgEndX = centerX + signalWidth + 40;
    } else if (rbPos === 'right') {
        sigStartX = centerX + 40;
        sigEndX = centerX + signalWidth + 40;
        imgStartX = centerX - signalWidth - 40;
        imgEndX = centerX - 40;
    } else {
        // center
        sigStartX = centerX - signalWidth/2;
        sigEndX = centerX + signalWidth/2;
        imgStartX = sigStartX;
        imgEndX = sigEndX;
    }
    
    // Draw Thermal Noise Floor
    inbandCtx.beginPath();
    inbandCtx.moveTo(0, mapY(-45));
    for (let x=0; x<=cw; x+=2) {
        let nf = -46 + (Math.random() * 3 - 1.5);
        inbandCtx.lineTo(x, mapY(nf));
    }
    inbandCtx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    inbandCtx.stroke();
    
    function drawBlock(startX, endX, levelDbc, colorParams, doNoise, label) {
        inbandCtx.beginPath();
        let mid = (startX + endX) / 2;
        let w = endX - startX;
        
        inbandCtx.moveTo(startX - 10, mapY(-45));
        inbandCtx.lineTo(startX, mapY(levelDbc));
        
        for(let i=startX; i<=endX; i+=3) {
            let n = doNoise ? (Math.sin(inbandPhase*2 + i)*1.5 + (Math.random()*4 - 2)) : 0;
            inbandCtx.lineTo(i, mapY(levelDbc + n));
        }
        
        inbandCtx.lineTo(endX + 10, mapY(-45));
        
        const grad = inbandCtx.createLinearGradient(0, mapY(levelDbc), 0, mapY(-45));
        grad.addColorStop(0, colorParams[0]);
        grad.addColorStop(1, colorParams[1]);
        
        inbandCtx.fillStyle = grad;
        inbandCtx.fill();
        inbandCtx.strokeStyle = colorParams[2];
        inbandCtx.lineWidth = 2;
        inbandCtx.stroke();
        
        if (label) {
            inbandCtx.fillStyle = "rgba(255,255,255,0.8)";
            inbandCtx.textAlign = "center";
            inbandCtx.fillText(label, mid, mapY(-45) + 20);
            inbandCtx.textAlign = "left";
        }
    }
    
    // 1. Draw Main Signal (0 dBc reference)
    drawBlock(sigStartX, sigEndX, 0, ["rgba(56, 189, 248, 0.7)", "rgba(56, 189, 248, 0.1)", "rgba(56, 189, 248, 1)"], true, "Main Signal");
    
    // 2. Draw IQ Image Limit Line and Block
    if (rbPos !== 'center') {
        const limY = mapY(iqLim);
        inbandCtx.strokeStyle = "rgba(234, 179, 8, 0.6)";
        inbandCtx.setLineDash([4,4]);
        inbandCtx.beginPath();
        inbandCtx.moveTo(imgStartX-20, limY); inbandCtx.lineTo(imgEndX+20, limY);
        inbandCtx.stroke();
        inbandCtx.setLineDash([]);
        
        inbandCtx.fillStyle = "rgba(234, 179, 8, 0.8)";
        inbandCtx.fillText(`IQ Lim ${iqLim}dBc`, imgStartX, limY - 8);
        
        // Draw the physical image bouncing below the limit
        drawBlock(imgStartX, imgEndX, iqLim - 2 + Math.sin(inbandPhase)*1.5, ["rgba(234, 179, 8, 0.4)", "rgba(234, 179, 8, 0.05)", "rgba(234, 179, 8, 0.8)"], true, "IQ Image");
    }
    
    // 3. Draw Carrier Leakage Line and Spike
    const cLimY = mapY(carrierLim);
    inbandCtx.strokeStyle = "rgba(244, 63, 94, 0.6)";
    inbandCtx.setLineDash([4,4]);
    inbandCtx.beginPath();
    inbandCtx.moveTo(centerX - 30, cLimY); inbandCtx.lineTo(centerX + 30, cLimY);
    inbandCtx.stroke();
    inbandCtx.setLineDash([]);
    inbandCtx.fillStyle = "rgba(244, 63, 94, 0.8)";
    inbandCtx.fillText(`LO Lim ${carrierLim}dBc`, centerX - 30, cLimY - 8);
    
    // Spike for LO leakage
    let spikeH = carrierLim - 1 + Math.random()*2;
    // If it's center allocation, it sits ON TOP of main signal.
    if (rbPos === 'center' && spikeH < 0) {
        spikeH = 5; // Pop it above the main signal visually just to see it exists (0dBc)
    }
    
    inbandCtx.beginPath();
    inbandCtx.moveTo(centerX - 5, mapY(-45));
    inbandCtx.lineTo(centerX, mapY(spikeH));
    inbandCtx.lineTo(centerX + 5, mapY(-45));
    inbandCtx.fillStyle = "rgba(244, 63, 94, 0.7)";
    inbandCtx.fill();
    inbandCtx.strokeStyle = "#f43f5e";
    inbandCtx.lineWidth = 2;
    inbandCtx.stroke();
    inbandCtx.fillStyle = "rgba(255,255,255,0.8)";
    inbandCtx.textAlign = "center";
    inbandCtx.fillText("LO Leak", centerX, mapY(-45) + 35);
    inbandCtx.textAlign = "left";
    
    inbandPhase += 0.2;
    inbandAnimationId = requestAnimationFrame(() => drawInbandEmission(pOut, rbPos));
}

function updateInband() {
    if (!inbandPoutInput || !inbandRbPosSelect) return;
    const pOut = parseFloat(inbandPoutInput.value) || 0;
    const rbPos = inbandRbPosSelect.value;
    
    if (inbandAnimationId) cancelAnimationFrame(inbandAnimationId);
    drawInbandEmission(pOut, rbPos);
}

if (inbandPoutInput) {
    inbandPoutInput.addEventListener('input', updateInband);
    inbandRbPosSelect.addEventListener('change', updateInband);
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'inband') {
                setTimeout(updateInband, 10);
            }
        });
    });
    
    setTimeout(updateInband, 100);
}

// ============================================
// Power Control Module (6.3.4)
// ============================================

const tpcPatternType = document.getElementById('tpc-pattern-type');
const paSwitchSlider = document.getElementById('pa-switch-slider');
const paSwitchVal = document.getElementById('pa-switch-val');
const gainErrorSlider = document.getElementById('gain-error-slider');
const gainErrorVal = document.getElementById('gain-error-val');
const timingSkewSlider = document.getElementById('timing-skew-slider');
const timingSkewVal = document.getElementById('timing-skew-val');
const tpcTransType = document.getElementById('tpc-trans-type');

const tpcLog = document.getElementById('tpc-log');
const tpcPwrCanvas = document.getElementById('tpc-pwr-canvas');
const tpcStartBtn = document.getElementById('tpc-start-btn');
const tpcResetBtn = document.getElementById('tpc-reset-btn');

let tpcCtx = null;
if (tpcPwrCanvas) {
    tpcCtx = tpcPwrCanvas.getContext('2d');
}

let tpcAnimationId = null;
let tpcCurrentStep = 0;
let tpcChartData = [];
let tpcIsAnimating = false;

function getTpcTolerance(stepDeltaP, transType) {
    let absDp = Math.abs(stepDeltaP);
    if (absDp < 2) {
        if (transType === 'pusch') return 2.0;
        if (transType === 'srs') return 2.5;
        if (transType === 'prach') return 2.0;
    } else if (absDp >= 2 && absDp < 3) {
        if (transType === 'pusch') return 2.5;
        if (transType === 'srs') return 3.5;
        if (transType === 'prach') return 2.5;
    } else if (absDp >= 3 && absDp < 4) {
        if (transType === 'pusch') return 3.0;
        if (transType === 'srs') return 4.5;
        if (transType === 'prach') return 3.0;
    } else if (absDp >= 4 && absDp <= 10) {
        if (transType === 'pusch') return 3.5;
        if (transType === 'srs') return 5.5;
        if (transType === 'prach') return 3.5;
    } else if (absDp > 10 && absDp < 15) {
        if (transType === 'pusch') return 4.0;
        if (transType === 'srs') return 7.0;
        if (transType === 'prach') return 4.0;
    } else { // >= 15
        if (transType === 'pusch') return 5.0;
        if (transType === 'srs') return 8.0;
        if (transType === 'prach') return 5.0;
    }
    return 2.0;
}

function generateTpcSequence() {
    const pattern = tpcPatternType.value;
    const paSwitchPoint = parseFloat(paSwitchSlider.value);
    const gainError = parseFloat(gainErrorSlider.value);
    const transType = tpcTransType.value;
    
    let isDown = pattern.startsWith('down_');
    let isAlt = pattern === 'alternating';
    
    // According to 3GPP, start at exactly Pmax (26) for Down, and Pmin (-40) for Up
    let startPower = isDown ? 26 : -40;
    if (isAlt) startPower = 20; // Alternating high
    
    // Pattern A & Continuous use 2dB steps, Pattern B & C use 1dB steps
    let baseStep = isDown ? -2 : 2;
    if (pattern.includes('pattern_b') || pattern.includes('pattern_c')) {
        baseStep = isDown ? -1 : 1;
    }
    
    let rbJump = isDown ? -10 : 10;
    
    let rbChangeSf = -1;
    if (pattern.includes('pattern_a')) rbChangeSf = 15;
    if (pattern.includes('pattern_b')) rbChangeSf = 25;
    if (pattern.includes('pattern_c')) rbChangeSf = 35;
    
    let totalSteps = isAlt ? 10 : 50;
    let altStep = -15; // 20 -> 5 -> 20 -> 5
    
    let p_actual = [startPower]; 
    let p_ideal = [startPower];
    let data = [];
    
    data.push({
        sf: 0, 
        ideal: startPower, 
        actual: startPower, 
        idealDelta: 0,
        tol: 0, 
        isSwitch: false, 
        fail: false,
        msg: `[Init] Sub-frame 0: Starting Power = ${startPower} dBm`
    });
    
    for (let i = 1; i < totalSteps; i++) {
        let idealStep = baseStep;
        if (isAlt) {
            idealStep = altStep;
            altStep = -altStep; // Flip direction
        } else if (i === rbChangeSf) {
            idealStep = rbJump;
        }
        
        let ideal = p_actual[i-1] + idealStep;
        
        // Apply 3GPP limits to ideal power
        if (ideal > 26) ideal = 26;
        if (ideal < -40) ideal = -40;
        
        p_ideal.push(ideal);
        
        let actual = ideal;
        let isSwitch = false;
        
        let crossedThreshold = false;
        if (isAlt) {
            if (p_actual[i-1] < paSwitchPoint && ideal >= paSwitchPoint) crossedThreshold = true;
            if (p_actual[i-1] > paSwitchPoint && ideal <= paSwitchPoint) crossedThreshold = true;
        } else {
            if (!isDown && p_actual[i-1] < paSwitchPoint && ideal >= paSwitchPoint) crossedThreshold = true;
            if (isDown && p_actual[i-1] > paSwitchPoint && ideal <= paSwitchPoint) crossedThreshold = true;
        }
        
        if (crossedThreshold) {
            actual = ideal + gainError;
            isSwitch = true;
        }
        
        // Apply 3GPP limits to actual power
        if (actual > 26) actual = 26;
        if (actual < -40) actual = -40;
        
        p_actual.push(actual);
        
        let tol = getTpcTolerance(idealStep, transType);
        
        let actualStep = actual - p_actual[i-1];
        let clampedIdealStep = ideal - p_actual[i-1];
        let diff = Math.abs(actual - ideal); 
        let isFail = diff > tol;
        
        let passStr = isFail ? '<span style="color:#ef4444;font-weight:bold;">[FAIL]</span>' : '<span style="color:#10b981;font-weight:bold;">[PASS]</span>';
        let msg = `${passStr} Sub-frame ${i}: Measured ΔP = ${actualStep.toFixed(1)} dB, Allowed = ±${tol.toFixed(1)} dB`;
        if (isSwitch) {
            msg += `<br>&nbsp;&nbsp;&nbsp;&nbsp;→ <span style="color:#f59e0b;">Violation @ PA Switch Point (Threshold ${paSwitchPoint} dBm crossed)</span>`;
            if (isFail) {
                 msg += `<br>&nbsp;&nbsp;&nbsp;&nbsp;→ <span style="color:#ef4444;">Gain Error ${gainError} dB exceeds tolerance.</span>`;
            }
        }
        
        data.push({
            sf: i,
            ideal: ideal,
            actual: actual,
            idealDelta: idealStep,
            tol: tol,
            isSwitch: isSwitch,
            fail: isFail,
            msg: msg
        });
    }
    return data;
}

function updateSliders() {
    if (paSwitchVal) paSwitchVal.textContent = `${paSwitchSlider.value} dBm`;
    if (gainErrorVal) gainErrorVal.textContent = `${gainErrorSlider.value} dB`;
    if (timingSkewVal) timingSkewVal.textContent = `${timingSkewSlider.value} us`;
}

function getTpcYScale() {
    let minP = 100, maxP = -100;
    if (tpcChartData && tpcChartData.length > 0) {
        tpcChartData.forEach(d => {
            if (d.ideal < minP) minP = d.ideal;
            if (d.actual < minP) minP = d.actual;
            if (d.ideal > maxP) maxP = d.ideal;
            if (d.actual > maxP) maxP = d.actual;
        });
    } else {
        minP = -5; maxP = 35;
    }
    let range = maxP - minP;
    if (range < 10) range = 10;
    // ensure PA Switch Point is visible
    let threshold = parseFloat(paSwitchSlider.value);
    if (threshold < minP) minP = threshold;
    if (threshold > maxP) maxP = threshold;
    range = maxP - minP;
    
    return { minP: minP - range * 0.1, maxP: maxP + range * 0.2 };
}

function drawTpcBackground(cw, ch) {
    tpcCtx.fillStyle = "rgba(15, 23, 42, 1)";
    tpcCtx.fillRect(0, 0, cw, ch);
    
    let {minP, maxP} = getTpcYScale();
    
    function mapY(val) { return ch - 40 - ((val - minP) / (maxP - minP)) * (ch - 80); }
    let totalSteps = tpcChartData && tpcChartData.length > 0 ? tpcChartData.length : 50;
    function mapX(sf) { return 40 + (sf / totalSteps) * (cw - 60); }
    
    // Grid & Axes
    tpcCtx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    tpcCtx.lineWidth = 1;
    tpcCtx.beginPath();
    
    // Draw radio frames
    let numRF = Math.ceil(totalSteps / 10);
    for(let rf=0; rf<=numRF; rf++) {
        let x = mapX(rf * 10);
        tpcCtx.moveTo(x, 20); tpcCtx.lineTo(x, ch-40);
        if (rf < numRF) {
            tpcCtx.fillStyle = "rgba(148, 163, 184, 0.8)";
            tpcCtx.font = "11px sans-serif";
            tpcCtx.textAlign = "center";
            if (totalSteps === 10) {
                tpcCtx.fillText(`SF 0..9`, x + (mapX(10)-mapX(0))/2, ch - 20);
            } else {
                tpcCtx.fillText(`RF ${rf}`, x + (mapX(10)-mapX(0))/2, ch - 20);
            }
        }
    }
    
    // Draw threshold line
    let thresholdY = mapY(parseFloat(paSwitchSlider.value));
    tpcCtx.moveTo(40, thresholdY); tpcCtx.lineTo(cw-20, thresholdY);
    
    // Draw horizontal grids
    for(let y=Math.floor(minP/10)*10; y<=Math.ceil(maxP/10)*10; y+=10) {
        let yPos = mapY(y);
        tpcCtx.moveTo(40, yPos); tpcCtx.lineTo(cw-20, yPos);
        tpcCtx.fillStyle = "rgba(148, 163, 184, 0.8)";
        tpcCtx.textAlign = "right";
        tpcCtx.fillText(`${y}`, 35, yPos + 4);
    }
    tpcCtx.stroke();
    
    tpcCtx.textAlign = "left";
    tpcCtx.fillText("dBm", 10, 15);
    
    // Draw Ideal Target Staircase (Faint)
    if (!tpcChartData || tpcChartData.length === 0) return;
    
    tpcCtx.beginPath();
    tpcCtx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    tpcCtx.lineWidth = 2;
    tpcCtx.setLineDash([4, 4]);
    
    for(let i=0; i<totalSteps; i++) {
        let d = tpcChartData[i];
        let xStart = mapX(i);
        let xEnd = mapX(i+1);
        let y = mapY(d.ideal);
        
        if (i===0) tpcCtx.moveTo(xStart, y);
        else {
            tpcCtx.lineTo(xStart, y); // Vertical rise
        }
        tpcCtx.lineTo(xEnd, y); // Horizontal flat
    }
    tpcCtx.stroke();
    tpcCtx.setLineDash([]);
}

function animateTpcStep() {
    let totalSteps = tpcChartData ? tpcChartData.length : 50;
    if (!tpcIsAnimating || tpcCurrentStep >= totalSteps) {
        tpcIsAnimating = false;
        tpcStartBtn.textContent = "▶ Start Animation";
        return;
    }
    
    const cw = tpcPwrCanvas.width;
    const ch = tpcPwrCanvas.height;
    
    let {minP, maxP} = getTpcYScale();
    function mapY(val) { return ch - 40 - ((val - minP) / (maxP - minP)) * (ch - 80); }
    function mapX(sf) { return 40 + (sf / totalSteps) * (cw - 60); }
    
    let sf = tpcCurrentStep;
    let d = tpcChartData[sf];
    
    let xStart = mapX(sf);
    let xEnd = mapX(sf+1);
    
    // 1. Draw dynamic tolerance box
    if (sf > 0) {
        let yIdeal = mapY(d.ideal);
        let tolPx = (d.tol / (maxP - minP)) * (ch - 80);
        
        tpcCtx.fillStyle = d.fail ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)";
        tpcCtx.fillRect(xStart, yIdeal - tolPx, xEnd - xStart, tolPx * 2);
        
        tpcCtx.strokeStyle = d.fail ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)";
        tpcCtx.lineWidth = 1;
        tpcCtx.beginPath();
        tpcCtx.moveTo(xStart, yIdeal - tolPx); tpcCtx.lineTo(xEnd, yIdeal - tolPx);
        tpcCtx.moveTo(xStart, yIdeal + tolPx); tpcCtx.lineTo(xEnd, yIdeal + tolPx);
        tpcCtx.stroke();
    }
    
    // 2. Draw Actual Power staircase segment
    tpcCtx.beginPath();
    tpcCtx.strokeStyle = d.fail ? "#ef4444" : "#60a5fa";
    tpcCtx.lineWidth = 3;
    
    let yActual = mapY(d.actual);
    
    if (sf === 0) {
        tpcCtx.moveTo(xStart, yActual);
        tpcCtx.lineTo(xEnd, yActual);
        tpcCtx.stroke();
    } else {
        let prevY = mapY(tpcChartData[sf-1].actual);
        
        tpcCtx.moveTo(xStart, prevY);
        
        if (d.isSwitch) {
            // Glitch simulation
            let skew = parseFloat(timingSkewSlider.value); // 0 to 5 us
            // Note: slot is narrower visually now (1/50 of width). 
            let skewWidthPx = (skew / 5.0) * ((xEnd - xStart) * 0.8); // allow wider glitch up to 80% of step
            let gainErr = parseFloat(gainErrorSlider.value);
            
            // Peak Y mapping
            let peakY = mapY(tpcChartData[sf-1].actual + d.idealDelta + (gainErr * 1.5));
            
            if (skewWidthPx > 0) {
                tpcCtx.lineTo(xStart + skewWidthPx/2, peakY);
                tpcCtx.lineTo(xStart + skewWidthPx, yActual);
            } else {
                tpcCtx.lineTo(xStart, yActual);
            }
            
            tpcCtx.lineTo(xEnd, yActual); 
            tpcCtx.stroke();
            
            // Glitch Marker
            tpcCtx.fillStyle = "#f59e0b";
            tpcCtx.beginPath();
            tpcCtx.arc(xStart + skewWidthPx/2, peakY, 3, 0, Math.PI*2);
            tpcCtx.fill();
        } else {
            tpcCtx.lineTo(xStart, yActual);
            tpcCtx.lineTo(xEnd, yActual);
            tpcCtx.stroke();
        }
    }
    
    // Append Log
    tpcLog.innerHTML += `<div style="margin-bottom: 8px;">${d.msg}</div>`;
    tpcLog.scrollTop = tpcLog.scrollHeight;
    
    tpcCurrentStep++;
    
    let speed = tpcChartData.length === 10 ? 300 : 50;
    setTimeout(animateTpcStep, speed);
}

function startTpcAnimation() {
    if (tpcIsAnimating) return;
    updateSliders();
    
    tpcChartData = generateTpcSequence();
    tpcCurrentStep = 0;
    tpcLog.innerHTML = "";
    
    if (tpcCtx) {
        const cw = tpcPwrCanvas.width;
        const ch = tpcPwrCanvas.height;
        drawTpcBackground(cw, ch);
    }
    
    tpcIsAnimating = true;
    tpcStartBtn.textContent = "⏳ Animating...";
    animateTpcStep();
}

function resetTpc() {
    tpcIsAnimating = false;
    tpcStartBtn.textContent = "▶ Start Animation";
    tpcCurrentStep = 0;
    tpcLog.innerHTML = `<div style="color: rgba(255,255,255,0.3); text-align: center; margin-top: 150px;">Waiting to start...</div>`;
    
    tpcChartData = generateTpcSequence();
    
    if (tpcCtx) {
        tpcCtx.clearRect(0, 0, tpcPwrCanvas.width, tpcPwrCanvas.height);
        drawTpcBackground(tpcPwrCanvas.width, tpcPwrCanvas.height);
    }
}

function onTpcInputChange() {
    updateSliders();
    if (!tpcIsAnimating) {
        resetTpc();
    }
}

if (tpcPatternType) {
    tpcPatternType.addEventListener('change', onTpcInputChange);
    paSwitchSlider.addEventListener('input', onTpcInputChange);
    gainErrorSlider.addEventListener('input', onTpcInputChange);
    timingSkewSlider.addEventListener('input', onTpcInputChange);
    tpcTransType.addEventListener('change', onTpcInputChange);
    
    tpcStartBtn.addEventListener('click', startTpcAnimation);
    tpcResetBtn.addEventListener('click', resetTpc);
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'power-ctrl') {
                setTimeout(() => {
                    if (!tpcIsAnimating && tpcCurrentStep === 0) onTpcInputChange();
                }, 50);
            }
        });
    });
    
    setTimeout(onTpcInputChange, 100);
}

// ============================================
// Reference Sensitivity Module (7.3)
// ============================================

const refSensBandInput = document.getElementById('refsens-band');
const refSensScsSelect = document.getElementById('refsens-scs');
const refSensBwSelect = document.getElementById('refsens-bw');
const refSens2MimoDisplay = document.getElementById('refsens-2mimo');
const refSens4MimoDisplay = document.getElementById('refsens-4mimo');
const refSens1MimoDisplay = document.getElementById('refsens-1mimo');

// N_RB values for Bandwidth mapping
const nrbTable = {
    "15": { 5: 25, 10: 52, 15: 79, 20: 106, 25: 133, 30: 160, 40: 216, 50: 270 },
    "30": { 5: 11, 10: 24, 15: 38, 20: 51, 25: 65, 30: 78, 40: 106, 50: 133, 60: 162, 80: 217, 100: 273 },
    "60": { 10: 11, 15: 18, 20: 24, 25: 31, 30: 38, 40: 51, 50: 65, 60: 79, 80: 107, 100: 135 }
};
const refNrbTable = { "15": 25, "30": 24, "60": 11 };

// Base Sensitivity [scs_15, scs_30, scs_60]
const refSensBases = {
    // FDD
    "1":  [-100.0, -97.1, -97.5],
    "2":  [-98.0,  -95.1, -95.5],
    "3":  [-97.0,  -94.1, -94.5],
    "5":  [-98.0,  -95.1, null],
    "7":  [-98.0,  -95.1, -95.5],
    "8":  [-97.0,  -94.1, null],
    "12": [-97.0,  -94.1, null],
    "13": [-97.0,  -94.1, null],
    "14": [-97.0,  -94.1, null],
    "20": [-97.0,  -94.1, null],
    "24": [-100.0, -97.1, -97.5],
    "25": [-96.5,  -93.6, -94.0],
    "26": [-97.5,  -94.8, null],
    "28": [-98.5,  -95.6, null],
    "30": [-99.0,  -96.1, null],
    "65": [-99.5,  -96.6, -97.0],
    "66": [-99.5,  -96.6, -97.0],
    "70": [-100.0, -97.1, -97.5],
    "71": [-97.2,  -94.3, null],
    "74": [-99.5,  -96.6, -97.0],
    "85": [-97.0,  -94.1, null],
    "100": [-100.0, -97.1, -97.5],
    "106": [-99.2,  -96.3, -96.7],
    // TDD
    "34": [-100.0, -97.1, -97.5],
    "38": [-100.0, -97.1, -97.5],
    "39": [-100.0, -97.1, -97.5],
    "40": [-100.0, -97.1, null],
    "41": [-94.8,  -95.1, -95.5],
    "48": [-99.0,  -96.1, -96.5],
    "50": [-100.0, -97.1, -97.5],
    "51": [-100.0, null, null],
    "53": [-100.0, -97.1, -97.5],
    "75": [-100.0, -97.1, -97.5],
    "76": [-100.0, null, null],
    "77": [-95.3,  -95.6, -96.0],
    "78": [-95.8,  -96.1, -96.5],
    "79": [-95.8,  -96.1, -96.5],
    "91": [-100.0, null, null],
    "92": [-100.0, -97.1, null],
    "93": [-100.0, null, null],
    "94": [-100.0, -97.1, null],
    "101": [-100.0, -97.1, null]
};

function updateRefSensBwOptions() {
    if (!refSensBwSelect || !refSensScsSelect) return;
    const scs = refSensScsSelect.value;
    const bwOptions = Object.keys(nrbTable[scs]).map(Number).sort((a,b)=>a-b);
    
    const prevVal = refSensBwSelect.value;
    
    refSensBwSelect.innerHTML = '';
    bwOptions.forEach(bw => {
        const opt = document.createElement('option');
        opt.value = bw;
        opt.textContent = `${bw} MHz`;
        refSensBwSelect.appendChild(opt);
    });
    
    if (bwOptions.includes(Number(prevVal))) {
        refSensBwSelect.value = prevVal;
    } else {
        refSensBwSelect.selectedIndex = 0;
    }
    calculateRefSens();
}

function calculateRefSens() {
    if (!refSensBandInput || !refSensScsSelect || !refSensBwSelect) return;
    
    let rawBand = refSensBandInput.value.trim().toLowerCase();
    let bandNum = rawBand.replace(/^n/, '');
    let scs = refSensScsSelect.value;
    let bw = refSensBwSelect.value;
    
    let baseSens = -100.0;
    let scsIdx = scs === "15" ? 0 : (scs === "30" ? 1 : 2);
    
    if (refSensBases[bandNum]) {
        let specializedBase = refSensBases[bandNum][scsIdx];
        if (specializedBase !== null) {
            baseSens = specializedBase;
        }
    }
    
    let nRb = nrbTable[scs][bw];
    let refNRb = refNrbTable[scs];
    
    if (!nRb) {
        refSens2MimoDisplay.textContent = "N/A";
        refSens4MimoDisplay.textContent = "N/A";
        if (refSens1MimoDisplay) refSens1MimoDisplay.textContent = "N/A";
        return;
    }
    
    // REFSENS = Base + 10 * log10(NRB / ref_NRB)
    let sens2Mimo = baseSens + 10 * Math.log10(nRb / refNRb);
    let sens4Mimo = sens2Mimo - 3.0; // 4 MIMO implies 3dB gain
    let sens1Mimo = sens2Mimo + 3.0; // 1 MIMO implies 3dB loss
    
    refSens2MimoDisplay.textContent = sens2Mimo.toFixed(1);
    refSens4MimoDisplay.textContent = sens4Mimo.toFixed(1);
    if (refSens1MimoDisplay) refSens1MimoDisplay.textContent = sens1Mimo.toFixed(1);
}

if (refSensBandInput) {
    refSensBandInput.addEventListener('input', calculateRefSens);
    refSensScsSelect.addEventListener('change', updateRefSensBwOptions);
    refSensBwSelect.addEventListener('change', calculateRefSens);
    
    updateRefSensBwOptions();
}

// ============================================
// Maximum Input Level Module (7.4)
// ============================================

const maxInputSlider = document.getElementById('max-input-slider');
const maxInputValDisplay = document.getElementById('max-input-val-display');
const maxInputTput = document.getElementById('max-input-tput');
const maxInputStatus = document.getElementById('max-input-status');
const maxInputCanvas = document.getElementById('max-input-canvas');

let maxInputCtx = null;
if (maxInputCanvas) {
    maxInputCtx = maxInputCanvas.getContext('2d');
}

let maxInputAnimId = null;

function drawMaxInput() {
    if (!maxInputCtx || !maxInputSlider) return;
    
    const cw = maxInputCanvas.width;
    const ch = maxInputCanvas.height;
    const rssi = parseFloat(maxInputSlider.value);
    
    // Clear
    maxInputCtx.fillStyle = "rgba(15, 23, 42, 1)";
    maxInputCtx.fillRect(0, 0, cw, ch);
    
    // Grid
    maxInputCtx.strokeStyle = "rgba(148, 163, 184, 0.1)";
    maxInputCtx.lineWidth = 1;
    maxInputCtx.beginPath();
    maxInputCtx.moveTo(0, ch/2); maxInputCtx.lineTo(cw, ch/2);
    maxInputCtx.moveTo(cw/2, 0); maxInputCtx.lineTo(cw/2, ch);
    for(let i=0; i<=cw; i+=cw/8) {
        maxInputCtx.moveTo(i, 0); maxInputCtx.lineTo(i, ch);
        maxInputCtx.moveTo(0, i); maxInputCtx.lineTo(cw, i);
    }
    maxInputCtx.stroke();

    // 64-QAM (8x8)
    let levels = [-7, -5, -3, -1, 1, 3, 5, 7];
    let scale = (cw * 0.4) / 8; 
    
    const maxInputLnaGain = document.getElementById('max-input-lna-gain');
    const maxInputP1db = document.getElementById('max-input-p1db');
    let lnaGain = maxInputLnaGain ? parseFloat(maxInputLnaGain.value || 0) : 20;
    let p1db = maxInputP1db ? parseFloat(maxInputP1db.value || 10) : 5;
    
    let rxPower = rssi + lnaGain;
    let isFailing = rxPower > p1db;
    
    let tput = 100.0;
    
    if (!isFailing) {
        // Constellation is perfectly normal, Data rate strictly 100.0%
        tput = 100.0;
    } else {
        // Exceeds P1dB completely
        let over = rxPower - p1db;
        tput = 100.0 - (over * 8.0); // E.g. at rxPower=p1db+10, tput drops to 20%
    }
    
    if (tput < 0) tput = 0;
    if (tput > 100) tput = 100.0;
    
    // Update DOM
    if (maxInputValDisplay) maxInputValDisplay.textContent = `${rssi} dBm`;
    if (maxInputTput) {
        maxInputTput.textContent = tput.toFixed(1);
        if (tput >= 95.0) {
            maxInputTput.style.color = '#10b981';
            maxInputTput.style.textShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            maxInputStatus.textContent = '✅ Rx Operating Linearly (Throughput ≥ 95%)';
            maxInputStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            maxInputStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            maxInputStatus.style.color = '#10b981';
        } else {
            maxInputTput.style.color = '#ef4444';
            maxInputTput.style.textShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
            maxInputStatus.textContent = '❌ Receiver Saturated (Throughput < 95%)';
            maxInputStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            maxInputStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            maxInputStatus.style.color = '#ef4444';
        }
    }
    
    // EVM & SNR penalty based on RSSI saturation
    let snr = 30; // base clean SNR
    if (isFailing) {
        snr = 30 - ((rxPower - p1db) * 2.5);
        if (snr < 5) snr = 5;
    }
    let noiseVar = 1 / Math.pow(10, snr / 10);
    
    maxInputCtx.fillStyle = isFailing ? "rgba(239, 68, 68, 0.7)" : "rgba(96, 165, 250, 0.8)";
    maxInputCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    
    for(let i=0; i<64; i++) {
        let idealI = levels[i % 8];
        let idealQ = levels[Math.floor(i / 8)];
        
        let pAmp = Math.sqrt(idealI*idealI + idealQ*idealQ);
        
        // Non-linear AM-AM compression model for saturation
        let amScale = 1.0;
        if (isFailing) {
           let rIn = pAmp * Math.pow(10, rxPower/20);
           let pSat = Math.pow(10, p1db/20) * 8; 
           let compressed = rIn / Math.sqrt(1 + Math.pow(rIn/pSat, 4));
           amScale = compressed / rIn;
        }
        
        for(let dot=0; dot<10; dot++) {
            let nI = (Math.random() - 0.5 + (Math.random() - 0.5)) * noiseVar * 40;
            let nQ = (Math.random() - 0.5 + (Math.random() - 0.5)) * noiseVar * 40;
            
            let finalI = idealI * amScale + nI;
            let finalQ = idealQ * amScale + nQ;
            
            let x = cw/2 + finalI * scale;
            let y = ch/2 - finalQ * scale;
            
            maxInputCtx.beginPath();
            maxInputCtx.arc(x, y, 1.5, 0, Math.PI * 2);
            maxInputCtx.fill();
        }
    }
    
    maxInputAnimId = requestAnimationFrame(drawMaxInput);
}

function updateMaxInput() {
    if (maxInputAnimId) cancelAnimationFrame(maxInputAnimId);
    drawMaxInput();
}

if (maxInputSlider) {
    maxInputSlider.addEventListener('input', updateMaxInput);
    
    if (document.getElementById('max-input-lna-gain')) {
        document.getElementById('max-input-lna-gain').addEventListener('input', updateMaxInput);
        document.getElementById('max-input-p1db').addEventListener('input', updateMaxInput);
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'max-input') {
                setTimeout(updateMaxInput, 10);
            }
        });
    });
    
    setTimeout(updateMaxInput, 100);
}

// ============================================
// Adjacent Channel Selectivity Module (7.5)
// ============================================

const acsFreqRange = document.getElementById('acs-freq-range');
const acsChannelBw = document.getElementById('acs-channel-bw');
const acsRefsensSlider = document.getElementById('acs-refsens-slider');
const acsRefsensVal = document.getElementById('acs-refsens-val');
const acsP1dbSlider = document.getElementById('acs-p1db-slider');
const acsP1dbVal = document.getElementById('acs-p1db-val');
const acsRejectionSlider = document.getElementById('acs-rejection-slider');
const acsRejectionVal = document.getElementById('acs-rejection-val');

const acsCalcWanted = document.getElementById('acs-calc-wanted');
const acsCalcInterferer = document.getElementById('acs-calc-interferer');
const acsCalcTarget = document.getElementById('acs-calc-target');

const acsLnaStatus = document.getElementById('acs-lna-status');
const acsResidualVal = document.getElementById('acs-residual-val');
const acsTputVal = document.getElementById('acs-tput-val');
const acsPassFail = document.getElementById('acs-pass-fail');
const acsCanvas = document.getElementById('acs-canvas');

function calculate3gppAcs(range, bw, refsens) {
    let wanted = refsens + 14;
    let target = 0;
    let interferer = 0;
    let offset = 0;
    
    // For both Low Band and High Band we use the exact same formulas 
    // unless specified otherwise.
    if (bw === 3) {
        target = 33;
        interferer = refsens + 45.5;
        offset = 3;
    } else if (bw === 5 || bw === 10) {
        target = 33;
        interferer = refsens + 45.5;
        offset = bw / 2 + 2.5;
    } else if (bw === 15) {
        target = 30;
        interferer = refsens + 42.5;
        offset = bw / 2 + 2.5;
    } else {
        target = Math.ceil((27 - 10 * Math.log10(bw / 20)) * 2) / 2;
        interferer = refsens + Math.ceil((39.5 - 10 * Math.log10(bw / 20)) * 2) / 2;
        offset = bw / 2 + 2.5;
    }
    
    return { wanted, target, interferer, offset };
}

let acsCtx = null;
if (acsCanvas) {
    acsCtx = acsCanvas.getContext('2d');
}

let acsAnimId = null;
let acsPhase = 0; // for animated components if any

function drawAcsSpectrum(wantedPwr, interfererPwr, rejection, lnaNoiseFloor, residualInterferer, bw, offset) {
    if (!acsCtx) return;
    const cw = acsCanvas.width;
    const ch = acsCanvas.height;
    
    // Clear
    acsCtx.fillStyle = "rgba(15, 23, 42, 1)";
    acsCtx.fillRect(0, 0, cw, ch);
    
    // Y-axis: -120 dBm to 0 dBm
    const minY = -120;
    const maxY = 0;
    function mapY(dbm) {
        let val = Math.max(minY, Math.min(maxY, dbm));
        return ch - 30 - ((val - minY) / (maxY - minY)) * (ch - 60);
    }
    
    // X-axis: dynamically scale based on BW and offset
    // Want to show slightly to the left of the wanted signal, up to slightly past the interferer
    const minX = -bw;
    const maxX = offset + bw; 
    function mapX(mhz) {
        return 40 + ((mhz - minX) / (maxX - minX)) * (cw - 60);
    }
    
    // Grid
    acsCtx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    acsCtx.lineWidth = 1;
    acsCtx.beginPath();
    
    // Determine a reasonable grid step based on max frequency
    let xStep = maxX > 50 ? 20 : (maxX > 20 ? 10 : 5);
    
    for (let x = 0; x <= maxX; x += xStep) {
        let px = mapX(x);
        acsCtx.moveTo(px, 30); acsCtx.lineTo(px, ch - 30);
        acsCtx.fillStyle = "rgba(148, 163, 184, 0.8)";
        acsCtx.font = "11px sans-serif";
        acsCtx.textAlign = "center";
        acsCtx.fillText(x === 0 ? "0 (Wanted)" : `+${x} MHz`, px, ch - 10);
    }
    for (let y = -120; y <= 0; y += 20) {
        let py = mapY(y);
        acsCtx.moveTo(40, py); acsCtx.lineTo(cw - 20, py);
        acsCtx.textAlign = "right";
        acsCtx.fillText(`${y}`, 35, py + 4);
    }
    acsCtx.stroke();
    
    // Noise Floor
    let floorY = mapY(lnaNoiseFloor);
    acsCtx.fillStyle = lnaNoiseFloor > -100 ? "rgba(239, 68, 68, 0.2)" : "rgba(148, 163, 184, 0.1)";
    acsCtx.fillRect(40, floorY, cw - 60, ch - 30 - floorY);
    
    if (lnaNoiseFloor > -100) {
        acsCtx.fillStyle = "rgba(239, 68, 68, 0.8)";
        acsCtx.textAlign = "right";
        acsCtx.fillText("Noise Floor Rise", cw - 30, floorY - 5);
    }
    
    // TRx Filter Profile (Dotted Line)
    let filterEdge = bw / 2;
    acsCtx.beginPath();
    acsCtx.strokeStyle = "rgba(168, 85, 247, 0.8)";
    acsCtx.lineWidth = 2;
    acsCtx.setLineDash([5, 5]);
    acsCtx.moveTo(mapX(minX), mapY(0));
    acsCtx.lineTo(mapX(filterEdge), mapY(0));
    acsCtx.lineTo(mapX(filterEdge + 1), mapY(-rejection)); // steep rolloff
    acsCtx.lineTo(mapX(maxX), mapY(-rejection));
    acsCtx.stroke();
    acsCtx.setLineDash([]);
    
    // Signal widths: slightly smaller than BW to leave a visual gap
    let wWidth = bw * 0.95 / 2;
    let iWidth = bw * 0.95 / 2;
    
    // Wanted Signal Area (Green)
    acsCtx.fillStyle = "rgba(16, 185, 129, 0.6)";
    acsCtx.strokeStyle = "#10b981";
    acsCtx.beginPath();
    acsCtx.moveTo(mapX(-wWidth), mapY(minY));
    acsCtx.lineTo(mapX(-wWidth), mapY(wantedPwr));
    acsCtx.lineTo(mapX(wWidth), mapY(wantedPwr));
    acsCtx.lineTo(mapX(wWidth), mapY(minY));
    acsCtx.fill();
    acsCtx.stroke();
    
    // Residual Interferer Area (Orange)
    acsCtx.fillStyle = "rgba(249, 115, 22, 0.6)";
    acsCtx.strokeStyle = "#f97316";
    acsCtx.beginPath();
    acsCtx.moveTo(mapX(offset - iWidth), mapY(minY));
    acsCtx.lineTo(mapX(offset - iWidth), mapY(residualInterferer));
    acsCtx.lineTo(mapX(offset + iWidth), mapY(residualInterferer));
    acsCtx.lineTo(mapX(offset + iWidth), mapY(minY));
    acsCtx.fill();
    acsCtx.stroke();
    
    // Pre-Filter Raw Interferer (faint outline)
    acsCtx.beginPath();
    acsCtx.strokeStyle = "rgba(249, 115, 22, 0.2)";
    acsCtx.setLineDash([2, 2]);
    acsCtx.moveTo(mapX(offset - iWidth), mapY(minY));
    acsCtx.lineTo(mapX(offset - iWidth), mapY(interfererPwr));
    acsCtx.lineTo(mapX(offset + iWidth), mapY(interfererPwr));
    acsCtx.lineTo(mapX(offset + iWidth), mapY(minY));
    acsCtx.stroke();
    acsCtx.setLineDash([]);
    
    // Animation for RF energy
    acsPhase += 0.5;
    let modW = (acsPhase % (wWidth * 2)) - wWidth;
    acsCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    acsCtx.beginPath();
    acsCtx.moveTo(mapX(modW), mapY(minY));
    acsCtx.lineTo(mapX(modW), mapY(wantedPwr));
    acsCtx.stroke();
    
    let modI = (acsPhase % (iWidth * 2)) - iWidth;
    acsCtx.beginPath();
    acsCtx.moveTo(mapX(offset + modI), mapY(minY));
    acsCtx.lineTo(mapX(offset + modI), mapY(residualInterferer));
    acsCtx.stroke();
    
    // Label
    acsCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
    acsCtx.textAlign = "left";
    acsCtx.fillText("TRx Baseband Selectivity Filter", mapX(filterEdge + 2), mapY(-rejection) - 10);
    
    acsAnimId = requestAnimationFrame(() => drawAcsSpectrum(wantedPwr, interfererPwr, rejection, lnaNoiseFloor, residualInterferer, bw, offset));
}

function updateAcs() {
    if (!acsFreqRange) return;
    
    const range = acsFreqRange.value;
    let bw = parseFloat(acsChannelBw.value);
    
    // Enforce high band rules (>10 MHz)
    if (range === 'high' && bw < 10) {
        bw = 10;
        acsChannelBw.value = "10";
    }
    
    // Hide/Disable bw options < 10 for High Band
    Array.from(acsChannelBw.options).forEach(opt => {
        if (parseFloat(opt.value) < 10) {
            opt.disabled = (range === 'high');
            if (range === 'high') opt.style.display = 'none';
            else opt.style.display = '';
        }
    });
    
    const refsens = parseFloat(acsRefsensSlider.value);
    const p1db = parseFloat(acsP1dbSlider.value);
    const rejection = parseFloat(acsRejectionSlider.value);
    
    const { wanted: wantedPwr, target: acsTarget, interferer: interfererPwr, offset: offset } = calculate3gppAcs(range, bw, refsens);
    
    // UI Update
    acsRefsensVal.textContent = `${refsens.toFixed(1)} dBm`;
    acsP1dbVal.textContent = `${p1db} dBm`;
    acsRejectionVal.textContent = `${rejection} dB`;
    
    acsCalcWanted.textContent = `${wantedPwr.toFixed(1)} dBm`;
    acsCalcInterferer.textContent = `${interfererPwr.toFixed(1)} dBm`;
    acsCalcTarget.textContent = `+${offset} MHz / ${acsTarget} dB`;
    
    // Math Logic
    let totalPwr = interfererPwr; // Dominated by interferer
    let isSaturated = totalPwr > p1db;
    
    let lnaNoiseFloor = -100;
    let lnaStatusText = "正常";
    let lnaStatusColor = "var(--text-secondary)"; 
    
    if (isSaturated) {
        let compression = totalPwr - p1db;
        lnaNoiseFloor = -100 + (compression * 2.5); 
        lnaStatusText = "飽和壓迫中";
        lnaStatusColor = "#ef4444"; 
    }
    
    acsLnaStatus.textContent = lnaStatusText;
    acsLnaStatus.style.color = lnaStatusColor;
    
    let residualInterferer = interfererPwr - rejection;
    acsResidualVal.textContent = `${residualInterferer.toFixed(1)} dBm`;
    
    // Summing interference powers in linear domain
    let noiseMw = Math.pow(10, lnaNoiseFloor / 10);
    let resMw = Math.pow(10, residualInterferer / 10);
    let effectiveInterference = 10 * Math.log10(noiseMw + resMw);
    let basebandSnr = wantedPwr - effectiveInterference;
    
    let tput = 100.0;
    if (basebandSnr >= 2.0) {
        tput = 100.0;
    } else if (basebandSnr >= -1.0) {
        // interpolate smoothly between 95% and 100%
        tput = 95.0 + ((basebandSnr + 1.0) / 3.0) * 5.0;
    } else if (basebandSnr > -3.0) {
        // interpolate steeply between 0% and 95%
        tput = ((basebandSnr + 3.0) / 2.0) * 95.0;
    } else {
        tput = 0.0;
    }
    
    if (tput < 0) tput = 0;
    if (tput > 100) tput = 100.0;
    
    let failReason = "";
    if (tput < 95.0) {
        if (residualInterferer > lnaNoiseFloor + 3) {
            failReason = "內部 Filter 抑制力不足導致干擾";
        } else if (lnaNoiseFloor > residualInterferer + 3) {
            failReason = "LNA 飽和導致感度劣化";
        } else {
            failReason = "LNA 飽和與 Filter 抑制雙重失效";
        }
    }
    
    // Update Throughput UI
    acsTputVal.textContent = `${tput.toFixed(1)}%`;
    if (tput >= 95.0) {
        acsTputVal.style.color = "#10b981";
        acsPassFail.textContent = "[PASS] 符合 3GPP ACS 規範";
        acsPassFail.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
        acsPassFail.style.borderColor = "rgba(16, 185, 129, 0.3)";
        acsPassFail.style.color = "#10b981";
    } else {
        acsTputVal.style.color = "#ef4444";
        acsPassFail.innerHTML = `[FAIL] <span style="font-size: 1rem; margin-left: 10px;">${failReason}</span>`;
        acsPassFail.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        acsPassFail.style.borderColor = "rgba(239, 68, 68, 0.3)";
        acsPassFail.style.color = "#ef4444";
    }
    
    if (acsAnimId) cancelAnimationFrame(acsAnimId);
    drawAcsSpectrum(wantedPwr, interfererPwr, rejection, lnaNoiseFloor, residualInterferer, bw, offset);
}

if (acsFreqRange) {
    acsFreqRange.addEventListener('change', updateAcs);
    acsChannelBw.addEventListener('change', updateAcs);
    acsRefsensSlider.addEventListener('input', updateAcs);
    acsP1dbSlider.addEventListener('input', updateAcs);
    acsRejectionSlider.addEventListener('input', updateAcs);
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(targetId === 'acs') {
                setTimeout(updateAcs, 10);
            }
        });
    });
    
    setTimeout(updateAcs, 100);
}
