document.addEventListener('DOMContentLoaded', () => {
    const checks = document.querySelectorAll('.security-check');
    const gaugeVal = document.getElementById('gauge-val');
    const gaugeLabel = document.getElementById('gauge-label');
    const progressCircle = document.querySelector('.gauge-progress');
    
    // Total gauge circumference (2 * PI * r) where r = 85 -> ~534
    const totalCircumference = 534;

    function updateScore() {
        let checkedCount = 0;
        checks.forEach(chk => {
            if (chk.checked) checkedCount++;
            localStorage.setItem(chk.id, chk.checked ? 'true' : 'false');
        });

        const totalChecks = checks.length;
        const percentage = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

        // Update Text
        gaugeVal.textContent = percentage;

        // Update Circle Stroke Dash Offset
        const offset = totalCircumference - (percentage / 100) * totalCircumference;
        progressCircle.style.strokeDashoffset = offset;

        // Update Rating Status Text & Color
        if (percentage < 35) {
            gaugeLabel.textContent = 'Vulnerable';
            gaugeLabel.style.color = '#ef4444'; // Red
            progressCircle.style.stroke = '#ef4444';
        } else if (percentage < 75) {
            gaugeLabel.textContent = 'Moderate';
            gaugeLabel.style.color = '#f59e0b'; // Amber
            progressCircle.style.stroke = '#f59e0b';
        } else {
            gaugeLabel.textContent = 'Secured';
            gaugeLabel.style.color = '#10b981'; // Green
            progressCircle.style.stroke = '#10b981';
        }
    }

    // Load state from local storage
    checks.forEach(chk => {
        const val = localStorage.getItem(chk.id);
        if (val === 'true') {
            chk.checked = true;
        } else if (val === 'false') {
            chk.checked = false;
        }
        
        chk.addEventListener('change', updateScore);
    });

    // Initial calculation
    updateScore();
});
