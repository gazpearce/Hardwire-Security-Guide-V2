const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, '..', 'mass_gen', 'topics.json');
if (!fs.existsSync(topicsPath)) {
    console.error("❌ Error: topics.json not found in mass_gen folder.");
    process.exit(1);
}

const rawTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8')).slice(0, 30);

const targetUrls = [
    { url: "https://garypearce.co.uk/", anchor: "GP Home Services" },
    { url: "https://garypearce.co.uk/cctv-installation/", anchor: "professional CCTV installation guide" },
    { url: "https://garypearce.co.uk/wifi-networking/", anchor: "home network design guide" },
    { url: "https://garypearce.co.uk/data-cabling/", anchor: "structured data cabling services" },
    { url: "https://garypearce.co.uk/tv-mounting/", anchor: "TV wall mounting support" },
    { url: "https://cctvsmartsystems.co.uk/", anchor: "CCTV Smart Systems" },
    { url: "https://cctvsmartsystems.co.uk/cctv-installation-newcastle/", anchor: "CCTV installation Newcastle" },
    { url: "https://cctvsmartsystems.co.uk/cctv-installation-durham/", anchor: "CCTV installation Durham" },
    { url: "https://cctvsmartsystems.co.uk/cctv-installation-sunderland/", anchor: "CCTV installer Sunderland" },
    { url: "https://cctvsmartsystems.co.uk/cctv-installation-middlesbrough/", anchor: "security camera setup Middlesbrough" },
    { url: "https://cctv.services/", anchor: "CCTV commercial services" },
    { url: "https://adicommunications.co.uk/", anchor: "ADI Communications" },
    { url: "https://adicommunications.co.uk/cctv-installation/", anchor: "commercial surveillance setup" },
    { url: "https://adicommunications.co.uk/wifi-networking/", anchor: "business wireless networks" },
    { url: "https://adicommunications.co.uk/data-cabling/", anchor: "fibre and data wiring" }
];

const externalUrls = [
    { url: "https://www.nsi.org.uk/", anchor: "National Security Inspectorate (NSI)" },
    { url: "https://www.ssaib.org/", anchor: "SSAIB Certification Standards" },
    { url: "https://www.ico.org.uk/", anchor: "ICO CCTV Code of Practice" },
    { url: "https://www.vesa.org/", anchor: "VESA Mounting Standards Association" },
    { url: "https://www.fia-online.co.uk/", anchor: "Fibreoptic Industry Association (FIA)" },
    { url: "https://www.beama.org.uk/", anchor: "BEAMA Electrical Installation Guide" },
    { url: "https://www.cai.org.uk/", anchor: "Confederation of Aerial Industries (CAI)" }
];

const serviceVideos = {
    "CCTV Security": "https://www.youtube.com/embed/gFbIXc_gmMc",
    "WiFi & Networking": "https://www.youtube.com/embed/hgl70F12h9Y",
    "Data Cabling": "https://www.youtube.com/embed/s32eO8U-660",
    "TV Wall Mounting": "https://www.youtube.com/embed/T4N14W6S7Sg"
};

const blogDir = path.join(__dirname, 'blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// Generate Individual FAQ posts
const posts = rawTopics.map((topicStr, idx) => {
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
    
    const videoUrl = serviceVideos[serviceName] || serviceVideos["CCTV Security"];
    return { id, title: topicStr, service: serviceName, video: videoUrl, index: idx };
});

posts.forEach((post, i) => {
    // Pick unique asset link & external link round-robin
    const assetLink = targetUrls[i % targetUrls.length];
    const externalLink = externalUrls[i % externalUrls.length];

    const htmlContent = `
<div class="article-header" style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
    <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; text-transform: uppercase;">${post.service}</span>
    <h1 style="font-size: 2.2rem; color: #fff; margin: 1rem 0 0.5rem 0; line-height: 1.2;">${post.title}</h1>
    <p style="color: #9ca3af; font-size: 1rem; margin: 0;">Authoritative Engineering Guide • Newcastle, Durham, Sunderland & Middlesbrough</p>
</div>

<div class="direct-answer-box" style="background: rgba(255,255,255,0.02); border-left: 4px solid #3b82f6; padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2.5rem;">
    <p style="margin: 0; font-size: 1rem; color: #d1d5db; line-height: 1.7;">When implementing security or network architectures for <strong>"${post.title}"</strong>, the priority is verifying connections to British standards (NSI/SSAIB). Default credentials or weak mounts lead to vulnerabilities. For support, complete our online form.</p>
</div>

<h2 style="color: #fff; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem;">Technical Specifications & Implementation</h2>
<p style="color: #9ca3af; margin-bottom: 1rem; line-height: 1.6;">Property owners across Northern England should adopt structured solid-copper cabling and secure VLAN partitions. Ambient conditions like salt air and coastal damp demand IP67 weather-rated housings.</p>

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin: 2rem 0; background: #000;">
    <iframe src="${post.video}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
</div>

<div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.5rem; margin: 2.5rem 0;">
  <h4 style="margin-top: 0; color: #fff; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;">🔗 Verified Industry Resources</h4>
  <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem; line-height: 1.6;">
    <div><strong>Engineering Specialist:</strong> Check our detailed guide on <a href="${assetLink.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${assetLink.anchor}</a> for professional advice.</div>
    <div><strong>Regulatory Authority:</strong> Review the installation standards published by the <a href="${externalLink.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${externalLink.anchor}</a>.</div>
  </div>
</div>
    `;

    // Page Template wrapper
    // IMPORTANT: Gary Pearce name is included EXACTLY 1 time, inside the footer copyright!
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | Technical Security Guides</title>
    <meta name="description" content="Read our professional engineering review on ${post.title.toLowerCase()} inside Northern England.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Security Guide v2</span>
            </a>
            <nav class="nav-links">
                <a href="../index.html">Audit Dashboard</a>
                <a href="index.html" class="active">Technical Guides</a>
                <a href="https://aiagent1510.github.io/Websites/" class="btn-nav">Contact Form</a>
            </nav>
        </div>
    </header>

    <main class="dashboard-layout" style="grid-template-columns: 1fr; max-width: 900px;">
        <article class="card">
            ${htmlContent}
        </article>
    </main>

    <footer>
        <div class="footer-container">
            <p>&copy; 2026 Gary Pearce Home Services. All rights reserved.</p>
            <p class="footer-links">
                <a href="https://aiagent1510.github.io/Websites/">Online Contact Form</a>
            </p>
        </div>
    </footer>
</body>
</html>
`;

    fs.writeFileSync(path.join(blogDir, `${post.id}.html`), pageHtml, 'utf8');
});

// Generate Master Blog Index Feed
const linksHtml = posts.map(post => `
<div class="faq-list-item" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.2rem; transition: border-color 0.2s ease;">
    <span style="background: rgba(59,130,246,0.1); color: #3b82f6; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; display: inline-block;">${post.service}</span>
    <h3 style="margin: 0.5rem 0 0.5rem 0; font-size: 1.2rem;"><a href="${post.id}.html" style="color: #fff; text-decoration: none; font-weight: 700;">${post.title}</a></h3>
    <p style="color: #9ca3af; font-size: 0.9rem; margin: 0 0 1rem 0;">Read expert engineering guidelines and verification steps for ${post.title.toLowerCase()} in Northern England.</p>
    <a href="${post.id}.html" style="color: #3b82f6; font-weight: 600; font-size: 0.85rem; text-decoration: none; display: inline-block;">View Guide →</a>
</div>
`).join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Security Guides Directory | V2</title>
    <meta name="description" content="Explore our library of technical FAQs, security specifications, and home connection guides.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Security Guide v2</span>
            </a>
            <nav class="nav-links">
                <a href="../index.html">Audit Dashboard</a>
                <a href="index.html" class="active">Technical Guides</a>
                <a href="https://aiagent1510.github.io/Websites/" class="btn-nav">Contact Form</a>
            </nav>
        </div>
    </header>

    <main class="dashboard-layout" style="grid-template-columns: 1fr; max-width: 900px;">
        <section class="card">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 2.2rem; color: #fff;">Technical Guide Directory</h2>
                <p style="color: #9ca3af; font-size: 0.95rem; margin-top: 0.5rem;">Explore detailed guides covering home CCTV, alarms, structured cabling, and smart configurations.</p>
            </div>
            <div class="faq-grid">
                ${linksHtml}
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-container">
            <p>&copy; 2026 Gary Pearce Home Services. All rights reserved.</p>
            <p class="footer-links">
                <a href="https://aiagent1510.github.io/Websites/">Online Contact Form</a>
            </p>
        </div>
    </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml, 'utf8');
console.log(`🎉 SUCCESS: Generated 30 blog pages and index hub under ${blogDir}`);
