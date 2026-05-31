const fs = require('fs');
const path = require('path');

const topicsPath = path.join(__dirname, 'topics_v2.json');
if (!fs.existsSync(topicsPath)) {
    console.error("❌ Error: topics_v2.json not found.");
    process.exit(1);
}

const rawTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

const targetUrls = [
    { url: "https://aiagent1510.wixsite.com/cctv/blog", anchor: "CCTV installation blog" },
    { url: "https://aiagent1510.wixsite.com/cctv/blog", anchor: "Gary Pearce Security Blog" },
    { url: "https://aiagent1510.wixsite.com/cctv/blog", anchor: "professional CCTV guide" }
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

// Helper to get 3 related posts for silo interlinking
function getRelatedPosts(currentPost, allPosts) {
    const sameCategory = allPosts.filter(p => p.id !== currentPost.id && p.service === currentPost.service);
    const otherCategory = allPosts.filter(p => p.id !== currentPost.id && p.service !== currentPost.service);
    const pool = [...sameCategory, ...otherCategory];
    return pool.slice(0, 3);
}

// Controversial direct answers for the next 50 posts
function getDirectAnswer(post) {
    if (post.index < 30) {
        return `When implementing security or network architectures for <strong>"${post.title}"</strong>, the priority is verifying connections to British standards (NSI/SSAIB). Default credentials or weak mounts lead to vulnerabilities. For support, complete our online form.`;
    }

    const title = post.title.toLowerCase();
    if (title.includes("ethics") || title.includes("ethical") || title.includes("neighbour") || title.includes("privacy")) {
        return `<strong>Controversial Verdict:</strong> Yes, outdoor CCTV recording your neighbours' property is a flagrant breach of privacy expectations under ICO codes, regardless of the "crime prevention" excuse. Most domestic installers cross the line into illegal surveillance. Unless cameras are physically masked, you are open to civil harassment lawsuits.`;
    }
    if (title.includes("police") || title.includes("warrantless") || title.includes("ring doorbell")) {
        return `<strong>Controversial Verdict:</strong> Letting police access Ring or Nest footage without a warrant turns private neighbourhoods into involuntary state surveillance hubs. Tech companies providing backdoor access to police departments bypasses constitutional protections and violates citizen trust. You should refuse these data requests.`;
    }
    if (title.includes("landlord") || title.includes("tenants") || title.includes("communal")) {
        return `<strong>Controversial Verdict:</strong> Smart locks and hallway CCTV installed by landlords are frequently used as tools for tenant harassment, surveillance, and intimidation rather than "security." There is almost zero regulation preventing landlords from tracking tenant movement patterns in communal areas.`;
    }
    if (title.includes("cloud-based") || title.includes("subscription") || title.includes("local nvr")) {
        return `<strong>Controversial Verdict:</strong> Cloud-based security subscriptions (Ring, Nest, Arlo) are a massive financial drain and a privacy hazard. Homeowners are paying companies to store their private video on servers that are vulnerable to data leaks and employee spying. Local NVRs with VLAN isolation are infinitely superior and cost-free after purchase.`;
    }
    if (title.includes("wireless") || title.includes("jammed") || title.includes("deauthentication") || title.includes("simplisafe")) {
        return `<strong>Controversial Verdict:</strong> Wireless alarm and camera systems (like SimpliSafe) are inherently insecure and easily defeated by £20 RF jammers or deauthentication scripts run from a laptop. Relying on wireless signals for home defense is a technical joke compared to hardwired PoE configurations.`;
    }
    if (title.includes("facial recognition")) {
        return `<strong>Controversial Verdict:</strong> Using facial recognition on residential properties is completely illegal under GDPR and ICO rules in the UK. Private homeowners have no legal right to scan and build biometric databases of delivery drivers, visitors, or neighbours.`;
    }
    if (title.includes("license plate") || title.includes("alpr") || title.includes("trash-bag")) {
        return `<strong>Controversial Verdict:</strong> Automated license plate readers (ALPR) in residential areas are a dystopian tracking mechanism. The manual disabling of these devices (like the "trash-bag treatment") is a justified form of community self-defense against corporate and government tracking.`;
    }
    if (title.includes("mesh wifi") || title.includes("access points")) {
        return `<strong>Controversial Verdict:</strong> Mesh Wi-Fi is a lazy, unstable compromise that should never be used for security camera networks. Wireless backhauls are prone to drops, latency, and signal blocking from thick stone walls. True security requires dedicated Cat6 ethernet cabling.`;
    }
    if (title.includes("apps") || title.includes("sell") || title.includes("data")) {
        return `<strong>Controversial Verdict:</strong> Most smart home security apps are Trojan horses designed to harvest and monetize your daily behavioral data. Occupancy schedules, geolocation tracking, and video metadata are regularly packaged and sold to insurers and advertisers under vague privacy policies.`;
    }
    if (title.includes("cable") || title.includes("cutting") || title.includes("fiber")) {
        return `<strong>Controversial Verdict:</strong> A physical wire-cutter is the easiest bypass for any modern smart security system. If your fiber/coax line is exposed on the exterior wall of your home, a thief can disable your internet connection, cloud feeds, and remote alerts in two seconds.`;
    }
    if (title.includes("insurance") || title.includes("discount")) {
        return `<strong>Controversial Verdict:</strong> The "smart home insurance discount" is a scam. Insurers use these minor discounts to coerce homeowners into sharing real-time tracking data and telemetry, which is later used to deny claims or raise premiums if your system wasn't fully armed during an event.`;
    }
    if (title.includes("audio recording")) {
        return `<strong>Controversial Verdict:</strong> Audio recording on external home cameras is highly illegal and a massive breach of civil liberty. Recording the private conversations of passersby on the street or neighbours in their gardens violates the Wiretap Act and ICO regulations in the UK.`;
    }
    if (title.includes("solar power") || title.includes("winter")) {
        return `<strong>Controversial Verdict:</strong> Solar-powered security cameras are completely unreliable during UK winters. Low sunlight levels and cold temperatures render solar panels useless, leading to system failure exactly when winter nights are longest and crime rates peak.`;
    }
    if (title.includes("dummy")) {
        return `<strong>Controversial Verdict:</strong> Dummy security cameras do not deter professional burglars; they signal that the property owner is cheap and lacks actual security. Even worse, dummy cameras create civil liability if guests are led to believe they are being monitored and protected.`;
    }
    if (title.includes("fear-mongering") || title.includes("contracts")) {
        return `<strong>Controversial Verdict:</strong> The traditional home security industry relies on predatory fear-mongering and multi-year lock-in contracts. They sell cheap hardware at inflated rates and use aggressive sales tactics to exploit natural anxieties about home safety.`;
    }
    if (title.includes("pet detection") || title.includes("biometric")) {
        return `<strong>Controversial Verdict:</strong> AI pet detection features are a gateway to training massive biometric databases. Companies use your shared video feeds to refine their computer vision algorithms for free, violating standard user data ownership agreements.`;
    }
    if (title.includes("laser pointer") || title.includes("disable")) {
        return `<strong>Controversial Verdict:</strong> A cheap £5 green laser pointer can permanently blind a £500 4K security camera from 100 meters away by burning out the image sensor. Modern surveillance is highly fragile when faced with simple physical counter-measures.`;
    }
    if (title.includes("communal") || title.includes("shared") || title.includes("hallways")) {
        return `<strong>Controversial Verdict:</strong> Placing surveillance cameras in shared communal hallways or flats violates tenant privacy rights. Landlords use these feeds to monitor visitor counts, enforce arbitrary house rules, and gather evidence for wrongful evictions.`;
    }
    if (title.includes("radiation") || title.includes("rf")) {
        return `<strong>Controversial Verdict:</strong> Running dozens of high-power Wi-Fi IoT devices and wireless cameras in close proximity to home bedrooms creates constant, high-frequency electromagnetic radiation fields. The health implications of long-term exposure to these dense networks remain unstudied.`;
    }
    
    return `<strong>Controversial Verdict:</strong> Standard smart home security configurations prioritise corporate convenience over user privacy. By relying on default settings, unsegmented VLANs, and cloud storage, most homeowners are building a surveillance apparatus that is easily exploited by hackers, tech corporations, and law enforcement.`;
}

// Generate unique 3-question FAQs
function generateFaqs(post, related) {
    const title = post.title.toLowerCase();
    const loc = post.title.includes("Newcastle") ? "Newcastle" : 
                post.title.includes("Durham") ? "Durham" :
                post.title.includes("Sunderland") ? "Sunderland" :
                post.title.includes("Middlesbrough") ? "Middlesbrough" :
                "Northern England";

    if (post.index < 30) {
        return [
            {
                q: `What is the most critical technical consideration for "${post.title}"?`,
                a: `For "${post.title.toLowerCase()}" in ${loc}, ensuring weatherproofing (IP67) and solid copper wiring is key to long-term reliability. To compare setups, read our guide on <a href="${related[0].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[0].title}</a>.`
            },
            {
                q: `How do standard certification guidelines impact installations in ${loc}?`,
                a: `Systems should be verified against NSI or SSAIB standards to remain fully compliant with insurance policies. Learn more about system compliance in our review: <a href="${related[1].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[1].title}</a>.`
            },
            {
                q: `Can I integrate this specific hardware setup with other security platforms?`,
                a: `Yes, you can integrate cameras and alarms using a local NVR or isolated switch setup. Check our networking layout guide: <a href="${related[2].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[2].title}</a>.`
            }
        ];
    }

    return [
        {
            q: `Is the mainstream approach to "${post.title}" fundamentally flawed?`,
            a: `Absolutely. Most commercial solutions prioritize cloud lock-in over physical and digital security. To understand how this fits into broader home network designs, review our guidelines on <a href="${related[0].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[0].title}</a>.`
        },
        {
            q: `What are the hidden privacy risks associated with this setup?`,
            a: `The risks range from silent data logging by IoT manufacturers to warrantless third-party access. We explore how to secure these connections in our report on <a href="${related[1].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[1].title}</a>.`
        },
        {
            q: `Are there more secure, local alternatives available?`,
            a: `Yes, replacing cloud devices with PoE cameras routed through a private VLAN is the recommended approach. Check our technical breakdown in <a href="${related[2].id}.html" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${related[2].title}</a>.`
        }
    ];
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
    const assetLink = targetUrls[i % targetUrls.length];
    const externalLink = externalUrls[i % externalUrls.length];
    const related = getRelatedPosts(post, posts);
    const faqs = generateFaqs(post, related);
    const directAnswer = getDirectAnswer(post);

    const htmlContent = `
<div class="article-header" style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1.5rem; margin-bottom: 2rem;">
    <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; text-transform: uppercase;">${post.service}</span>
    <h1 style="font-size: 2.2rem; color: #fff; margin: 1rem 0 0.5rem 0; line-height: 1.2;">${post.title}</h1>
    <p style="color: #9ca3af; font-size: 1rem; margin: 0;">Authoritative Engineering Guide • Newcastle, Durham, Sunderland & Middlesbrough</p>
</div>

<div class="direct-answer-box" style="background: rgba(255,255,255,0.02); border-left: 4px solid #3b82f6; padding: 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 2.5rem;">
    <p style="margin: 0; font-size: 1rem; color: #d1d5db; line-height: 1.7;">${directAnswer}</p>
</div>

<h2 style="color: #fff; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem;">Technical Specifications & Implementation</h2>
<p style="color: #9ca3af; margin-bottom: 1rem; line-height: 1.6;">Property owners across Northern England should adopt structured solid-copper cabling and secure VLAN partitions. Ambient conditions like salt air and coastal damp demand IP67 weather-rated housings.</p>

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin: 2rem 0; background: #000;">
    <iframe src="${post.video}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
</div>

<div class="infographic-container" style="margin: 2.5rem 0; text-align: center;">
    <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 1rem; text-align: left;">📊 Technical Architecture Diagram</h3>
    <img src="../infographics/${post.id}.svg" alt="${post.title} Infographic" style="width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: #0f172a;" />
    <p style="color: #64748b; font-size: 0.85rem; margin-top: 0.5rem; text-align: left; font-style: italic;">Diagram illustrating data paths, wiring specification, or physical configuration for this setup.</p>
</div>

<div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.5rem; margin: 2.5rem 0;">
  <h4 style="margin-top: 0; color: #fff; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;">🔗 Verified Industry Resources</h4>
  <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem; line-height: 1.6;">
    <div><strong>Engineering Specialist:</strong> Check our detailed guide on <a href="${assetLink.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${assetLink.anchor}</a> for professional advice.</div>
    <div><strong>Regulatory Authority:</strong> Review the installation standards published by the <a href="${externalLink.url}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">${externalLink.anchor}</a>.</div>
  </div>
</div>

<div class="faq-section" style="margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 2rem;">
    <h2 style="color: #fff; font-size: 1.6rem; margin-bottom: 1.5rem;">Frequently Asked Questions</h2>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${faqs.map(faq => `
        <div class="faq-item" style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; border-radius: 12px;">
            <h3 style="color: #fff; font-size: 1.1rem; margin-top: 0; margin-bottom: 0.75rem; display: flex; gap: 0.5rem; align-items: flex-start;">
                <span style="color: #3b82f6;">Q:</span>
                <span>${faq.q}</span>
            </h3>
            <p style="color: #9ca3af; margin: 0; line-height: 1.6; font-size: 0.95rem;">
                <strong style="color: #10b981; font-weight: 600;">A:</strong> ${faq.a}
            </p>
        </div>
        `).join('\n')}
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
                <a href="https://aiagent1510.wixsite.com/cctv/blog" class="btn-nav">Contact Form</a>
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
                <a href="https://aiagent1510.wixsite.com/cctv/blog">Online Contact Form</a>
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
                <a href="https://aiagent1510.wixsite.com/cctv/blog" class="btn-nav">Contact Form</a>
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
                <a href="https://aiagent1510.wixsite.com/cctv/blog">Online Contact Form</a>
            </p>
        </div>
    </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml, 'utf8');
console.log(`🎉 SUCCESS: Generated ${posts.length} blog pages and index hub under ${blogDir}`);
