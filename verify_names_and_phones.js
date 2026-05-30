const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let success = true;

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(baseDir, filePath);

    // Count name occurrences
    const nameMatches = content.match(/Gary\s+Pearce/gi) || [];
    if (nameMatches.length !== 1) {
        console.error(`❌ Error in ${relPath}: 'Gary Pearce' found ${nameMatches.length} times (expected exactly 1).`);
        success = false;
    }

    // Check for phone numbers
    const phonePattern = /07830\s*638337|\+44\s*7830\s*638337|07830-638337/g;
    if (phonePattern.test(content)) {
        console.error(`❌ Error in ${relPath}: Found forbidden phone number!`);
        success = false;
    }
}

function scanDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.html')) {
            checkFile(fullPath);
        }
    });
}

console.log("🔍 Scanning HTML files for name count and phone number compliance...");
scanDir(baseDir);

if (success) {
    console.log("🎉 ALL TESTS PASSED! Every page contains 'Gary Pearce' exactly 1 time and has zero phone numbers.");
} else {
    console.error("❌ Auditing failed. Please correct the errors above.");
    process.exit(1);
}
