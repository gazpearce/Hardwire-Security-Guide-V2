const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, 'topics_v2.json');
if (!fs.existsSync(topicsPath)) {
    console.error("topics_v2.json not found.");
    process.exit(1);
}

const rawTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
const infoDir = path.join(__dirname, 'infographics');
if (!fs.existsSync(infoDir)) {
    fs.mkdirSync(infoDir, { recursive: true });
}

function getSvgTemplate(title, type, index) {
    // Custom SVGs based on category type
    if (type === 'CCTV Security') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
            <defs>
                <linearGradient id="cctv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#cctv-grad)" rx="16"/>
            <grid stroke="#334155" stroke-width="0.5" />
            <text x="40" y="50" fill="#3b82f6" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" letter-spacing="1">CCTV COMPLIANCE & ENGINEERING DIAGRAM</text>
            <text x="40" y="80" fill="#fff" font-family="'Outfit', sans-serif" font-size="20" font-weight="bold">${title}</text>
            
            <!-- Diagram Nodes -->
            <rect x="60" y="180" width="160" height="80" rx="8" fill="url(#accent-grad)" />
            <text x="140" y="220" fill="#fff" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">IP Camera Input</text>
            <text x="140" y="240" fill="#93c5fd" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">PoE (IEEE 802.3af)</text>

            <path d="M 220 220 L 340 220" stroke="#3b82f6" stroke-width="3" fill="none" />
            
            <rect x="340" y="150" width="180" height="140" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
            <text x="430" y="190" fill="#fff" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" text-anchor="middle">Local Network Router</text>
            <text x="430" y="215" fill="#10b981" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">VLAN 10 isolated</text>
            <line x1="360" y1="235" x2="500" y2="235" stroke="#334155" stroke-width="1" />
            <text x="430" y="260" fill="#9ca3af" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Subnet Mask: 255.255.255.0</text>

            <path d="M 520 220 L 640 220" stroke="#10b981" stroke-width="3" stroke-dasharray="5,5" fill="none" />

            <circle cx="680" cy="220" r="40" fill="#10b981" />
            <text x="680" y="225" fill="#fff" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Secure NVR</text>
            
            <!-- Caption -->
            <text x="400" y="360" fill="#64748b" font-family="'Outfit', sans-serif" font-size="12" text-anchor="middle">Figure ${index}.1: Isolation and firewall configuration schema representing secure Northern England setup.</text>
        </svg>`;
    } else if (type === 'WiFi & Networking') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
            <defs>
                <linearGradient id="wifi-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="wifi-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#be185d;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#wifi-grad)" rx="16"/>
            <text x="40" y="50" fill="#ec4899" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" letter-spacing="1">WIRELESS TOPOLOGY & DISTRIBUTION</text>
            <text x="40" y="80" fill="#fff" font-family="'Outfit', sans-serif" font-weight="bold" font-size="20">${title}</text>
            
            <rect x="60" y="180" width="160" height="80" rx="8" fill="url(#wifi-accent)" />
            <text x="140" y="220" fill="#fff" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Starlink/Fibre Router</text>
            <text x="140" y="240" fill="#fbcfe8" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">IP Passthrough Mode</text>

            <path d="M 220 220 C 280 160, 300 160, 360 220" stroke="#ec4899" stroke-width="3" fill="none" />
            
            <circle cx="400" cy="220" r="45" fill="#1e1b4b" stroke="#ec4899" stroke-width="2" />
            <text x="400" y="225" fill="#fff" font-family="'Outfit', sans-serif" font-weight="bold" font-size="12" text-anchor="middle">Mesh Node</text>

            <path d="M 440 220 C 500 280, 520 280, 580 220" stroke="#ec4899" stroke-width="3" fill="none" />

            <rect x="600" y="180" width="140" height="80" rx="8" fill="#1e1b4b" stroke="#be185d" stroke-width="2" />
            <text x="670" y="220" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Access Point</text>
            <text x="670" y="240" fill="#9ca3af" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Guest Network Isolated</text>

            <text x="400" y="360" fill="#64748b" font-family="'Outfit', sans-serif" font-size="12" text-anchor="middle">Figure ${index}.1: Distribution of wireless backhaul connection points in stone/insulated structures.</text>
        </svg>`;
    } else if (type === 'Data Cabling') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
            <defs>
                <linearGradient id="cable-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#052e16;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#022c22;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#cable-grad)" rx="16"/>
            <text x="40" y="50" fill="#10b981" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" letter-spacing="1">STRUCTURED CAT6 WIRING SPECIFICATION</text>
            <text x="40" y="80" fill="#fff" font-family="'Outfit', sans-serif" font-weight="bold" font-size="20">${title}</text>
            
            <rect x="60" y="170" width="150" height="90" rx="8" fill="#115e59" />
            <text x="135" y="210" fill="#fff" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">Patch Panel (T568B)</text>
            <text x="135" y="235" fill="#a7f3d0" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Solid Copper Shielded</text>

            <path d="M 210 215 L 360 215" stroke="#10b981" stroke-width="4" fill="none" />
            <text x="285" y="200" fill="#10b981" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">305m Spool Cat6a</text>

            <rect x="360" y="170" width="160" height="90" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2" />
            <text x="440" y="210" fill="#fff" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">RJ45 Keystone Jack</text>
            <text x="440" y="235" fill="#9ca3af" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">UTP Terminal Box</text>

            <path d="M 520 215 L 640 215" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3" fill="none" />

            <circle cx="680" cy="215" r="35" fill="#115e59" />
            <text x="680" y="220" fill="#fff" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Client PC</text>

            <text x="400" y="360" fill="#64748b" font-family="'Outfit', sans-serif" font-size="12" text-anchor="middle">Figure ${index}.1: Standard termination and signal distribution for Gigabit local infrastructure.</text>
        </svg>`;
    } else {
        // TV Wall Mounting
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
            <defs>
                <linearGradient id="tv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#311042;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#tv-grad)" rx="16"/>
            <text x="40" y="50" fill="#a855f7" font-family="'Outfit', sans-serif" font-size="14" font-weight="bold" letter-spacing="1">TV WALL MOUNTING & LOAD LOAD SPECIFICATIONS</text>
            <text x="40" y="80" fill="#fff" font-family="'Outfit', sans-serif" font-weight="bold" font-size="20">${title}</text>
            
            <rect x="80" y="160" width="120" height="110" rx="8" fill="#581c87" />
            <text x="140" y="210" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">Plasterboard Wall</text>
            <text x="140" y="235" fill="#f3e8ff" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Cavity Anchors</text>

            <line x1="200" y1="215" x2="360" y2="215" stroke="#a855f7" stroke-width="4" />

            <rect x="360" y="160" width="160" height="110" rx="8" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
            <text x="440" y="210" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">VESA Mounting Bracket</text>
            <text x="440" y="235" fill="#9ca3af" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Heavy Duty steel</text>

            <line x1="520" y1="215" x2="640" y2="215" stroke="#10b981" stroke-width="4" />

            <rect x="640" y="160" width="100" height="110" rx="8" fill="#10b981" />
            <text x="690" y="210" fill="#fff" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" text-anchor="middle">OLED Panel</text>
            <text x="690" y="235" fill="#fff" font-family="'Outfit', sans-serif" font-size="11" text-anchor="middle">Max 40KG Load</text>

            <text x="400" y="360" fill="#64748b" font-family="'Outfit', sans-serif" font-size="12" text-anchor="middle">Figure ${index}.1: Bracket shear-stress distribution and structural anchoring reference guide.</text>
        </svg>`;
    }
}

rawTopics.forEach((topicStr, idx) => {
    const id = topicStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let serviceName = "CCTV Security";
    const topicLower = topicStr.toLowerCase();
    
    if (topicLower.includes('starlink')) {
        serviceName = "WiFi & Networking";
    } else if (topicLower.includes('wifi') || topicLower.includes('mesh') || topicLower.includes('network')) {
        serviceName = "WiFi & Networking";
    } else if (topicLower.includes('cable') || topicLower.includes('cabling') || topicLower.includes('ethernet')) {
        serviceName = "Data Cabling";
    } else if (topicLower.includes('mount') || topicLower.includes('bracket') || topicLower.includes('wall')) {
        serviceName = "TV Wall Mounting";
    }

    const svg = getSvgTemplate(topicStr, serviceName, idx + 1);
    fs.writeFileSync(path.join(infoDir, `${id}.svg`), svg, 'utf8');
});

console.log(`🎉 Successfully generated ${rawTopics.length} unique SVG technical diagrams inside the infographics/ folder!`);
