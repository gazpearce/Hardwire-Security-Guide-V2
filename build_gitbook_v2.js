const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const v2Dir = __dirname;
const gitbookDir = path.join(__dirname, '..', 'mass_gen', 'output', 'GitBook');

if (!fs.existsSync(gitbookDir)) {
    console.error("❌ GitBook output folder not found.");
    process.exit(1);
}

// 1. Load the 80 topics
const topicsPath = path.join(v2Dir, 'topics_v2.json');
const rawTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

// 2. Classify posts
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
    
    return { id, title: topicStr, service: serviceName, index: idx };
});

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
        return `When implementing security or network architectures for **"${post.title}"**, the priority is verifying connections to British standards (NSI/SSAIB). Default credentials or weak mounts lead to vulnerabilities. For support, complete our online form.`;
    }

    const title = post.title.toLowerCase();
    if (title.includes("ethics") || title.includes("ethical") || title.includes("neighbour") || title.includes("privacy")) {
        return `**Controversial Verdict:** Yes, outdoor CCTV recording your neighbours' property is a flagrant breach of privacy expectations under ICO codes, regardless of the "crime prevention" excuse. Most domestic installers cross the line into illegal surveillance. Unless cameras are physically masked, you are open to civil harassment lawsuits.`;
    }
    if (title.includes("police") || title.includes("warrantless") || title.includes("ring doorbell")) {
        return `**Controversial Verdict:** Letting police access Ring or Nest footage without a warrant turns private neighbourhoods into involuntary state surveillance hubs. Tech companies providing backdoor access to police departments bypasses constitutional protections and violates citizen trust. You should refuse these data requests.`;
    }
    if (title.includes("landlord") || title.includes("tenants") || title.includes("communal")) {
        return `**Controversial Verdict:** Smart locks and hallway CCTV installed by landlords are frequently used as tools for tenant harassment, surveillance, and intimidation rather than "security." There is almost zero regulation preventing landlords from tracking tenant movement patterns in communal areas.`;
    }
    if (title.includes("cloud-based") || title.includes("subscription") || title.includes("local nvr")) {
        return `**Controversial Verdict:** Cloud-based security subscriptions (Ring, Nest, Arlo) are a massive financial drain and a privacy hazard. Homeowners are paying companies to store their private video on servers that are vulnerable to data leaks and employee spying. Local NVRs with VLAN isolation are infinitely superior and cost-free after purchase.`;
    }
    if (title.includes("wireless") || title.includes("jammed") || title.includes("deauthentication") || title.includes("simplisafe")) {
        return `**Controversial Verdict:** Wireless alarm and camera systems (like SimpliSafe) are inherently insecure and easily defeated by £20 RF jammers or deauthentication scripts run from a laptop. Relying on wireless signals for home defense is a technical joke compared to hardwired PoE configurations.`;
    }
    if (title.includes("facial recognition")) {
        return `**Controversial Verdict:** Using facial recognition on residential properties is completely illegal under GDPR and ICO rules in the UK. Private homeowners have no legal right to scan and build biometric databases of delivery drivers, visitors, or neighbours.`;
    }
    if (title.includes("license plate") || title.includes("alpr") || title.includes("trash-bag")) {
        return `**Controversial Verdict:** Automated license plate readers (ALPR) in residential areas are a dystopian tracking mechanism. The manual disabling of these devices (like the "trash-bag treatment") is a justified form of community self-defense against corporate and government tracking.`;
    }
    if (title.includes("mesh wifi") || title.includes("access points")) {
        return `**Controversial Verdict:** Mesh Wi-Fi is a lazy, unstable compromise that should never be used for security camera networks. Wireless backhauls are prone to drops, latency, and signal blocking from thick stone walls. True security requires dedicated Cat6 ethernet cabling.`;
    }
    if (title.includes("apps") || title.includes("sell") || title.includes("data")) {
        return `**Controversial Verdict:** Most smart home security apps are Trojan horses designed to harvest and monetize your daily behavioral data. Occupancy schedules, geolocation tracking, and video metadata are regularly packaged and sold to insurers and advertisers under vague privacy policies.`;
    }
    if (title.includes("cable") || title.includes("cutting") || title.includes("fiber")) {
        return `**Controversial Verdict:** A physical wire-cutter is the easiest bypass for any modern smart security system. If your fiber/coax line is exposed on the exterior wall of your home, a thief can disable your internet connection, cloud feeds, and remote alerts in two seconds.`;
    }
    if (title.includes("insurance") || title.includes("discount")) {
        return `**Controversial Verdict:** The "smart home insurance discount" is a scam. Insurers use these minor discounts to coerce homeowners into sharing real-time tracking data and telemetry, which is later used to deny claims or raise premiums if your system wasn't fully armed during an event.`;
    }
    if (title.includes("audio recording")) {
        return `**Controversial Verdict:** Audio recording on external home cameras is highly illegal and a massive breach of civil liberty. Recording the private conversations of passersby on the street or neighbours in their gardens violates the Wiretap Act and ICO regulations in the UK.`;
    }
    if (title.includes("solar power") || title.includes("winter")) {
        return `**Controversial Verdict:** Solar-powered security cameras are completely unreliable during UK winters. Low sunlight levels and cold temperatures render solar panels useless, leading to system failure exactly when winter nights are longest and crime rates peak.`;
    }
    if (title.includes("dummy")) {
        return `**Controversial Verdict:** Dummy security cameras do not deter professional burglars; they signal that the property owner is cheap and lacks actual security. Even worse, dummy cameras create civil liability if guests are led to believe they are being monitored and protected.`;
    }
    if (title.includes("fear-mongering") || title.includes("contracts")) {
        return `**Controversial Verdict:** The traditional home security industry relies on predatory fear-mongering and multi-year lock-in contracts. They sell cheap hardware at inflated rates and use aggressive sales tactics to exploit natural anxieties about home safety.`;
    }
    if (title.includes("pet detection") || title.includes("biometric")) {
        return `**Controversial Verdict:** AI pet detection features are a gateway to training massive biometric databases. Companies use your shared video feeds to refine their computer vision algorithms for free, violating standard user data ownership agreements.`;
    }
    if (title.includes("laser pointer") || title.includes("disable")) {
        return `**Controversial Verdict:** A cheap £5 green laser pointer can permanently blind a £500 4K security camera from 100 meters away by burning out the image sensor. Modern surveillance is highly fragile when faced with simple physical counter-measures.`;
    }
    if (title.includes("communal") || title.includes("shared") || title.includes("hallways")) {
        return `**Controversial Verdict:** Placing surveillance cameras in shared communal hallways or flats violates tenant privacy rights. Landlords use these feeds to monitor visitor counts, enforce arbitrary house rules, and gather evidence for wrongful evictions.`;
    }
    if (title.includes("radiation") || title.includes("rf")) {
        return `**Controversial Verdict:** Running dozens of high-power Wi-Fi IoT devices and wireless cameras in close proximity to home bedrooms creates constant, high-frequency electromagnetic radiation fields. The health implications of long-term exposure to these dense networks remain unstudied.`;
    }
    
    return `**Controversial Verdict:** Standard smart home security configurations prioritise corporate convenience over user privacy. By relying on default settings, unsegmented VLANs, and cloud storage, most homeowners are building a surveillance apparatus that is easily exploited by hackers, tech corporations, and law enforcement.`;
}

// Generate unique 3-question FAQs
function generateFaqs(post, related) {
    if (post.index < 30) {
        return [
            {
                q: `What is the most critical technical consideration for "${post.title}"?`,
                a: `For "${post.title.toLowerCase()}", ensuring weatherproofing (IP67) and solid copper wiring is key to long-term reliability. To compare setups, read our guide on [${related[0].title}](${related[0].id}.md).`
            },
            {
                q: `How do standard certification guidelines impact installations?`,
                a: `Systems should be verified against NSI or SSAIB standards to remain fully compliant with insurance policies. Learn more about system compliance in our review: [${related[1].title}](${related[1].id}.md).`
            },
            {
                q: `Can I integrate this specific hardware setup with other security platforms?`,
                a: `Yes, you can integrate cameras and alarms using a local NVR or isolated switch setup. Check our networking layout guide: [${related[2].title}](${related[2].id}.md).`
            }
        ];
    }

    return [
        {
            q: `Is the mainstream approach to "${post.title}" fundamentally flawed?`,
            a: `Absolutely. Most commercial solutions prioritize cloud lock-in over physical and digital security. To understand how this fits into broader home network designs, review our guidelines on [${related[0].title}](${related[0].id}.md).`
        },
        {
            q: `What are the hidden privacy risks associated with this setup?`,
            a: `The risks range from silent data logging by IoT manufacturers to warrantless third-party access. We explore how to secure these connections in our report on [${related[1].title}](${related[1].id}.md).`
        },
        {
            q: `Are there more secure, local alternatives available?`,
            a: `Yes, replacing cloud devices with PoE cameras routed through a private VLAN is the recommended approach. Check our technical breakdown in [${related[2].title}](${related[2].id}.md).`
        }
    ];
}

// 3. Clean existing files in GitBook directory (except .git)
fs.readdirSync(gitbookDir).forEach(file => {
    if (file === '.git') return;
    const fullPath = path.join(gitbookDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
        fs.unlinkSync(fullPath);
    }
});

// 4. Create infographics folder in GitBook
const gitbookInfoDir = path.join(gitbookDir, 'infographics');
fs.mkdirSync(gitbookInfoDir, { recursive: true });

// Copy all 80 SVGs
posts.forEach(post => {
    const srcSvg = path.join(v2Dir, 'infographics', `${post.id}.svg`);
    const destSvg = path.join(gitbookInfoDir, `${post.id}.svg`);
    if (fs.existsSync(srcSvg)) {
        fs.copyFileSync(srcSvg, destSvg);
    }
});

// 5. Generate 80 Markdown posts in GitBook directory
posts.forEach(post => {
    const related = getRelatedPosts(post, posts);
    const faqs = generateFaqs(post, related);
    const directAnswer = getDirectAnswer(post);

    const mdContent = `# ${post.title}

> **Verdict:** ${directAnswer}

## Technical Specifications & Implementation
Property owners across Northern England should adopt structured solid-copper cabling and secure VLAN partitions. Ambient conditions like salt air and coastal damp demand IP67 weather-rated housings.

## Technical Architecture Diagram
![${post.title} Infographic](infographics/${post.id}.svg)

*Diagram illustrating data paths, wiring specification, or physical configuration for this setup.*

## Frequently Asked Questions

${faqs.map(faq => `### Q: ${faq.q}
**A:** ${faq.a}`).join('\n\n')}

---

*Created by Gary Pearce Home Services.*
`;

    // Write file
    fs.writeFileSync(path.join(gitbookDir, `${post.id}.md`), mdContent, 'utf8');
});

// 6. Generate SUMMARY.md
let summaryContent = `# Table of contents

* [Introduction](README.md)
`;

// Group posts by service/category in SUMMARY.md
const categories = ["CCTV Security", "WiFi & Networking", "Data Cabling", "TV Wall Mounting"];
categories.forEach(cat => {
    summaryContent += `\n## ${cat}\n`;
    posts.filter(p => p.service === cat).forEach(post => {
        summaryContent += `* [${post.title}](${post.id}.md)\n`;
    });
});

fs.writeFileSync(path.join(gitbookDir, 'SUMMARY.md'), summaryContent, 'utf8');

// 7. Generate README.md
const readmeContent = `# Home Security Guide v2

Welcome to the official technical documentation and guides.

To use our interactive checklist and dynamic score calculator dashboard, visit the live GitHub Pages app:
👉 [Home Security Guide v2 Dashboard](https://gazpearce.github.io/Hardwire-Security-Guide-V2/)

## Categories Covered
- CCTV & Surveillance Setup
- WiFi, Mesh & Network Isolation
- Structured Data Cabling
- Professional TV Wall Mounting

*This guide contains authoritative regional specifications compiled by Gary Pearce Home Services.*
`;
fs.writeFileSync(path.join(gitbookDir, 'README.md'), readmeContent, 'utf8');

// 8. Commit and Push to GitBook Satellite Repo
try {
    process.chdir(gitbookDir);
    execSync('git add .');
    execSync('git commit -m "Update GitBook documentation to v2 containing 80 posts and infographics"');
    execSync('git push origin main --force');
    console.log("🎉 Successfully compiled and pushed 80 Markdown posts, infographics, and SUMMARY.md to GitBook satellite repo!");
} catch (err) {
    console.error("❌ Git push failed:", err.message);
}
