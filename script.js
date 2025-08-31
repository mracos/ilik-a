// Initialize with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('baseDate').value = today;
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.unit-selector')) {
            document.getElementById('unitDropdown').classList.remove('show');
        }
    });
});

// Current selected unit
let currentUnit = 'days';

// Utility function to format date
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Set date input to today
function setToday(inputId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(inputId).value = today;
}

// Set date input to yesterday
function setYesterday(inputId) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    document.getElementById(inputId).value = yesterday.toISOString().split('T')[0];
}

// Set date input to end of current month
function setEndOfMonth(inputId) {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    document.getElementById(inputId).value = endOfMonth.toISOString().split('T')[0];
}

// Toggle unit dropdown
function toggleUnitDropdown() {
    const dropdown = document.getElementById('unitDropdown');
    dropdown.classList.toggle('show');
}

// Select unit
function selectUnit(unit, displayName) {
    currentUnit = unit;
    document.getElementById('unitButton').textContent = displayName;
    document.getElementById('unitDropdown').classList.remove('show');
}

// Calculate date with offset
function calculateDate() {
    const baseDateInput = document.getElementById('baseDate').value;
    const timeOffsetInput = document.getElementById('timeOffset').value;
    const resultDiv = document.getElementById('dateResult');
    
    if (!baseDateInput || !timeOffsetInput) {
        resultDiv.innerHTML = 'ENTER BASE DATE AND OFFSET';
        resultDiv.className = 'result';
        return;
    }
    
    const baseDate = new Date(baseDateInput);
    const timeOffset = parseInt(timeOffsetInput);
    
    const resultDate = new Date(baseDate);
    
    // Apply offset based on unit
    switch(currentUnit) {
        case 'hours':
            resultDate.setHours(baseDate.getHours() + timeOffset);
            break;
        case 'days':
            resultDate.setDate(baseDate.getDate() + timeOffset);
            break;
        case 'weeks':
            resultDate.setDate(baseDate.getDate() + (timeOffset * 7));
            break;
        case 'months':
            resultDate.setMonth(baseDate.getMonth() + timeOffset);
            break;
        case 'years':
            resultDate.setFullYear(baseDate.getFullYear() + timeOffset);
            break;
    }
    
    const unitWord = Math.abs(timeOffset) === 1 ? currentUnit.slice(0, -1) : currentUnit;
    const direction = timeOffset >= 0 ? 'AFTER' : 'BEFORE';
    const absOffset = Math.abs(timeOffset);
    
    let resultText = `${absOffset} ${unitWord.toUpperCase()} ${direction} ${formatDate(baseDate)}:<br>`;
    resultText += `${formatDate(resultDate)}<br>`;
    resultText += `${resultDate.toISOString().split('T')[0]}`;
    
    if (currentUnit === 'hours') {
        resultText += ` ${resultDate.toTimeString().split(' ')[0]}`;
    }
    
    resultDiv.innerHTML = resultText;
    resultDiv.className = 'result highlight';
}

// Calculate age
function calculateAge() {
    const birthDateInput = document.getElementById('birthDate').value;
    const resultDiv = document.getElementById('ageResult');
    
    if (!birthDateInput) {
        resultDiv.innerHTML = 'ENTER BIRTH DATE';
        resultDiv.className = 'result';
        return;
    }
    
    const birthDate = new Date(birthDateInput);
    const today = new Date();
    
    if (today < birthDate) {
        resultDiv.innerHTML = 'BIRTH DATE CANNOT BE IN THE FUTURE';
        resultDiv.className = 'result';
        return;
    }
    
    // Calculate age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days
    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Calculate total weeks
    const totalWeeks = Math.floor(totalDays / 7);
    
    // Calculate total months (approximate)
    const totalMonths = years * 12 + months;
    
    const ageText = years > 0 ? 
        `${years}Y ${months}M ${days}D` :
        months > 0 ?
        `${months}M ${days}D` :
        `${days}D`;
    
    resultDiv.innerHTML = `
        <div class="age-main">AGE TODAY: ${ageText}</div>
        <div class="age-breakdown">
            <h4>BREAKDOWN</h4>
            <div class="breakdown-item">
                <div class="breakdown-value">${totalDays.toLocaleString()}</div>
                <div class="breakdown-label">TOTAL DAYS</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-value">${totalWeeks.toLocaleString()}</div>
                <div class="breakdown-label">TOTAL WEEKS</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-value">${totalMonths}</div>
                <div class="breakdown-label">TOTAL MONTHS</div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-value">${(totalDays / 365.25).toFixed(2)}</div>
                <div class="breakdown-label">TOTAL YEARS</div>
            </div>
        </div>
    `;
    resultDiv.className = 'result highlight';
}

// Quick date calculations
function quickDate(offset, unit) {
    const baseDate = new Date(document.getElementById('baseDate').value || new Date());
    const resultDate = new Date(baseDate);
    
    // Apply offset based on unit
    switch(unit) {
        case 'hours':
            resultDate.setHours(baseDate.getHours() + offset);
            break;
        case 'days':
            resultDate.setDate(baseDate.getDate() + offset);
            break;
        case 'weeks':
            resultDate.setDate(baseDate.getDate() + (offset * 7));
            break;
        case 'months':
            resultDate.setMonth(baseDate.getMonth() + offset);
            break;
        case 'years':
            resultDate.setFullYear(baseDate.getFullYear() + offset);
            break;
    }
    
    const resultDiv = document.getElementById('dateResult');
    
    let description;
    if (offset === 1 && unit === 'days') description = 'TOMORROW';
    else if (offset === -1 && unit === 'days') description = 'YESTERDAY';
    else if (offset === 7 && unit === 'days') description = 'NEXT WEEK';
    else if (offset === -7 && unit === 'days') description = 'LAST WEEK';
    else if (offset === 1 && unit === 'months') description = 'NEXT MONTH';
    else if (offset === -1 && unit === 'months') description = 'LAST MONTH';
    
    resultDiv.innerHTML = `
        ${description}:<br>
        ${formatDate(resultDate)}<br>
        ${resultDate.toISOString().split('T')[0]}
    `;
    resultDiv.className = 'result highlight';
}

// Add enter key support for inputs
document.getElementById('timeOffset').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateDate();
    }
});

document.getElementById('birthDate').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateAge();
    }
});