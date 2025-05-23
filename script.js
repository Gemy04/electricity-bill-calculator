// Global variables
let currentMethod = 'exact';
let calculationHistory = [];
let lastCalculation = null;

// Electricity pricing tiers (in piasters) based on the provided document
const pricingTiers = [
    { min: 0, max: 50, price: 68, condition: 'consumption <= 100' },
    { min: 51, max: 100, price: 78, condition: 'consumption <= 100' },
    { min: 0, max: 200, price: 95, condition: 'consumption >= 101 && consumption <= 1000' },
    { min: 201, max: 350, price: 155, condition: 'consumption >= 101 && consumption <= 1000' },
    { min: 351, max: 650, price: 195, condition: 'consumption >= 101 && consumption <= 1000' },
    { min: 0, max: 1000, price: 210, condition: 'consumption > 650 && consumption <= 1000' },
    { min: 0, max: Infinity, price: 223, condition: 'consumption > 1000' }
];

// Main calculation function
function calculateBill() {
    let consumption = 0;

    if (currentMethod === 'exact') {
        consumption = parseFloat(document.getElementById('exact-usage').value) || 0;
    } else {
        const previousReading = parseFloat(document.getElementById('previous-reading').value) || 0;
        const currentReading = parseFloat(document.getElementById('current-reading').value) || 0;
        
        if (currentReading <= previousReading) {
            alert('القراءة الحالية يجب أن تكون أكبر من القراءة السابقة');
            return;
        }
        
        consumption = currentReading - previousReading;
        
        // Save current reading to localStorage to use as previous reading next time
        try {
            localStorage.setItem('lastCurrentReading', currentReading.toString());
        } catch (e) {
            console.log('Could not save current reading');
        }
    }

    if (consumption <= 0) {
        alert('يرجى إدخال قيم صحيحة للاستهلاك');
        return;
    }

    const result = calculateElectricityBill(consumption);
    displayResult(result);
    saveToHistory(consumption, result.totalCost);
    updateHistoryDisplay();
}

// Method selection function
function selectMethod(method) {
    currentMethod = method;
    
    // Update UI
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[onclick="selectMethod('${method}')"]`).classList.add('active');

    // Show/hide method forms
    if (method === 'exact') {
        document.getElementById('exact-method').classList.remove('hidden');
        document.getElementById('readings-method').classList.add('hidden');
    } else {
        document.getElementById('exact-method').classList.add('hidden');
        document.getElementById('readings-method').classList.remove('hidden');
        
        // Load previous reading from localStorage if available
        try {
            const savedReading = localStorage.getItem('lastCurrentReading');
            if (savedReading) {
                document.getElementById('previous-reading').value = savedReading;
            }
        } catch (e) {
            console.log('Could not load previous reading');
        }
    }

    // Hide result
    document.getElementById('result').classList.remove('show');
}

// Calculate savings function
function calculateSavings() {
    if (!lastCalculation) {
        alert('يرجى حساب الفاتورة أولاً');
        return;
    }

    const reductionPercent = parseFloat(document.getElementById('target-reduction').value) || 0;
    
    if (reductionPercent <= 0 || reductionPercent >= 100) {
        alert('يرجى إدخال نسبة توفير صحيحة بين 1 و 99');
        return;
    }

    const newConsumption = lastCalculation.consumption * (1 - reductionPercent / 100);
    const newResult = calculateElectricityBill(newConsumption);
    const savings = lastCalculation.totalCost - newResult.totalCost;

    const savingsResultEl = document.getElementById('savings-result');
    savingsResultEl.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>الاستهلاك الجديد:</strong> ${newConsumption.toFixed(0)} ك.و.س
        </div>
        <div style="margin-bottom: 10px;">
            <strong>التكلفة الجديدة:</strong> ${newResult.totalCost.toFixed(2)} ج.م
        </div>
        <div style="color: #22543d; font-size: 1.2rem;">
            <strong>💰 ستوفر: ${savings.toFixed(2)} ج.م شهرياً</strong>
        </div>
        <div style="color: #4a5568; margin-top: 5px;">
            (${(savings * 12).toFixed(2)} ج.م سنوياً)
        </div>
    `;
    savingsResultEl.style.display = 'block';
}

// Clear history function
function clearHistory() {
    if (confirm('هل أنت متأكد من مسح جميع الحسابات السابقة؟')) {
        calculationHistory = [];
        try {
            localStorage.removeItem('electricityHistory');
        } catch (e) {
            console.log('Could not clear localStorage');
        }
        updateHistoryDisplay();
        showNotification('تم مسح السجل بنجاح! 🗑️');
    }
}

// Initialize history from memory
function initializeHistory() {
    try {
        const saved = localStorage.getItem('electricityHistory');
        if (saved) {
            calculationHistory = JSON.parse(saved);
        }
    } catch (e) {
        calculationHistory = [];
    }
    updateHistoryDisplay();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function calculateElectricityBill(consumption) {
    let totalCost = 0;
    let breakdown = [];
    let tierCategory = '';
    let tierNumber = 0;

    // Determine which tier system applies based on consumption
    if (consumption <= 50) {
        // Tier 1: 0-50 kWh at 68 piasters
        tierNumber = 1;
        tierCategory = 'الشريحة الأولى (0-50 ك.و.س)';
        totalCost = consumption * 0.68;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: '0.68 ج.م',
            cost: totalCost.toFixed(2)
        });
    } else if (consumption <= 100) {
        // Tiers 1-2: Progressive calculation for 51-100 kWh
        tierNumber = 2;
        tierCategory = 'الشريحة الثانية (51-100 ك.و.س)';
        
        // First 50 kWh at 68 piasters
        const tier1Cost = 50 * 0.68;
        breakdown.push({
            range: '0 - 50',
            kwh: 50,
            rate: '0.68 ج.م',
            cost: tier1Cost.toFixed(2)
        });
        
        // Remaining kWh at 78 piasters
        const tier2Consumption = consumption - 50;
        const tier2Cost = tier2Consumption * 0.78;
        breakdown.push({
            range: `51 - ${consumption}`,
            kwh: tier2Consumption,
            rate: '0.78 ج.م',
            cost: tier2Cost.toFixed(2)
        });
        
        totalCost = tier1Cost + tier2Cost;
    } else if (consumption <= 200) {
        // Tier 3: All consumption at 95 piasters
        tierNumber = 3;
        tierCategory = 'الشريحة الثالثة (0-200 ك.و.س)';
        totalCost = consumption * 0.95;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: '0.95 ج.م',
            cost: totalCost.toFixed(2)
        });
    } else if (consumption <= 350) {
        // Tier 4: First 200 at 95 piasters, remaining at 155 piasters
        tierNumber = 4;
        tierCategory = 'الشريحة الرابعة (201-350 ك.و.س)';
        
        // First 200 kWh at 95 piasters
        const tier3Cost = 200 * 0.95;
        breakdown.push({
            range: '0 - 200',
            kwh: 200,
            rate: '0.95 ج.م',
            cost: tier3Cost.toFixed(2)
        });
        
        // Remaining at 155 piasters
        const tier4Consumption = consumption - 200;
        const tier4Cost = tier4Consumption * 1.55;
        breakdown.push({
            range: `201 - ${consumption}`,
            kwh: tier4Consumption,
            rate: '1.55 ج.م',
            cost: tier4Cost.toFixed(2)
        });
        
        totalCost = tier3Cost + tier4Cost;
    } else if (consumption <= 650) {
        // Tier 5: First 200 at 95, next 150 at 155, remaining at 195
        tierNumber = 5;
        tierCategory = 'الشريحة الخامسة (351-650 ك.و.س)';
        
        // First 200 kWh at 95 piasters
        const tier3Cost = 200 * 0.95;
        breakdown.push({
            range: '0 - 200',
            kwh: 200,
            rate: '0.95 ج.م',
            cost: tier3Cost.toFixed(2)
        });
        
        // Next 150 kWh (201-350) at 155 piasters
        const tier4Cost = 150 * 1.55;
        breakdown.push({
            range: '201 - 350',
            kwh: 150,
            rate: '1.55 ج.م',
            cost: tier4Cost.toFixed(2)
        });
        
        // Remaining at 195 piasters
        const tier5Consumption = consumption - 350;
        const tier5Cost = tier5Consumption * 1.95;
        breakdown.push({
            range: `351 - ${consumption}`,
            kwh: tier5Consumption,
            rate: '1.95 ج.م',
            cost: tier5Cost.toFixed(2)
        });
        
        totalCost = tier3Cost + tier4Cost + tier5Cost;
    } else if (consumption <= 1000) {
        // Tier 6: All consumption at 210 piasters
        tierNumber = 6;
        tierCategory = 'الشريحة السادسة (0-1000 ك.و.س)';
        totalCost = consumption * 2.10;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: '2.10 ج.م',
            cost: totalCost.toFixed(2)
        });
    } else {
        // Tier 7: All consumption at 223 piasters
        tierNumber = 7;
        tierCategory = 'الشريحة السابعة (أكثر من 1000 ك.و.س)';
        totalCost = consumption * 2.23;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: '2.23 ج.م',
            cost: totalCost.toFixed(2)
        });
    }

    return {
        consumption,
        totalCost,
        breakdown,
        tierCategory,
        tierNumber
    };
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const totalCostEl = document.getElementById('total-cost');
    const breakdownEl = document.getElementById('breakdown');

    // Display total cost
    totalCostEl.textContent = `${result.totalCost.toFixed(2)} ج.م`;

    // Display breakdown with correct tier information
    let breakdownHTML = `
        <h4>تفاصيل الحساب</h4>
        <div class="tier-info">
            <span class="tier-icon">📊</span>
            أنت في: ${result.tierCategory}
        </div>
    `;

    // Show detailed breakdown
    if (result.breakdown.length === 1) {
        // Single tier (flat rate)
        breakdownHTML += `
            <div class="tier">
                <span>${result.consumption} ك.و.س بسعر موحد</span>
                <span>${result.breakdown[0].rate} للكيلو وات</span>
            </div>
        `;
    } else {
        // Multiple tiers (progressive)
        for (const tier of result.breakdown) {
            breakdownHTML += `
                <div class="tier">
                    <span>شريحة ${tier.range} ك.و.س</span>
                    <span>${tier.kwh} × ${tier.rate} = ${tier.cost} ج.م</span>
                </div>
            `;
        }
    }

    breakdownHTML += `
        <div class="tier">
            <span><strong>الإجمالي</strong></span>
            <span><strong>${result.totalCost.toFixed(2)} ج.م</strong></span>
        </div>
    `;

    breakdownEl.innerHTML = breakdownHTML;

    // Show environmental impact
    showEnvironmentalImpact(result.consumption);

    // Show result with animation
    resultDiv.classList.add('show');
    lastCalculation = result;
}

function showEnvironmentalImpact(consumption) {
    const environmentalDiv = document.getElementById('environmental-impact');
    const co2InfoEl = document.getElementById('co2-info');
    const progressFillEl = document.getElementById('progress-fill');

    // Approximate CO2 emissions: 0.5 kg per kWh (Egypt's electricity grid)
    const co2Emissions = (consumption * 0.5).toFixed(1);
    const treesNeeded = Math.ceil(consumption * 0.02); // Approximate trees needed to offset

    co2InfoEl.innerHTML = `
        استهلاكك ينتج حوالي <strong>${co2Emissions} كيلوجرام</strong> من انبعاثات CO2<br>
        🌳 تحتاج إلى <strong>${treesNeeded} شجرة</strong> لامتصاص هذه الانبعاثات
    `;

    // Progress bar animation
    const maxConsumption = 1000;
    const progressPercent = Math.min((consumption / maxConsumption) * 100, 100);
    progressFillEl.style.width = `${progressPercent}%`;

    environmentalDiv.style.display = 'block';
}

function saveToHistory(consumption, cost) {
    const now = new Date();
    const historyItem = {
        date: now.toLocaleDateString('ar-EG'),
        time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        consumption: consumption,
        cost: cost.toFixed(2)
    };

    calculationHistory.unshift(historyItem);
    
    // Keep only last 10 calculations
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }

    // Save to localStorage
    try {
        localStorage.setItem('electricityHistory', JSON.stringify(calculationHistory));
        showNotification('تم حفظ الحساب بنجاح! ✅');
    } catch (e) {
        console.log('Could not save to localStorage');
    }
}

function updateHistoryDisplay() {
    const historyListEl = document.getElementById('history-list');
    
    if (calculationHistory.length === 0) {
        historyListEl.innerHTML = '<p style="text-align: center; color: #666;">لا توجد حسابات سابقة</p>';
        return;
    }

    let historyHTML = '';
    for (const item of calculationHistory) {
        historyHTML += `
            <div class="history-item">
                <div>
                    <strong>${item.consumption} ك.و.س</strong><br>
                    <small>${item.date} - ${item.time}</small>
                </div>
                <div style="text-align: left;">
                    <strong>${item.cost} ج.م</strong>
                </div>
            </div>
        `;
    }
    historyListEl.innerHTML = historyHTML;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeHistory();
    
    // Load the previous reading if readings method is active
    if (currentMethod === 'readings') {
        try {
            const savedReading = localStorage.getItem('lastCurrentReading');
            if (savedReading) {
                document.getElementById('previous-reading').value = savedReading;
            }
        } catch (e) {
            console.log('Could not load previous reading');
        }
    }
    
    // Add enter key support for inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBill();
            }
        });
    });

    // Add input validation
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // Set the current date for the last update
    const updateDateElement = document.getElementById('update-date');
    if (updateDateElement) {
        const now = new Date();
        
        // Array of Arabic month names
        const arabicMonths = [
            "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ];
        
        // Format the date as "Day Month Year" in Arabic
        const day = now.getDate();
        const month = arabicMonths[now.getMonth()];
        const year = now.getFullYear();
        
        updateDateElement.textContent = `${day} ${month} ${year}`;
    }
});

// Add some interactive features
function addSparkleEffect(element) {
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.top = '50%';
    sparkle.style.left = '50%';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = 'white';
    sparkle.style.borderRadius = '50%';
    sparkle.style.transform = 'translate(-50%, -50%)';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    
    element.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 600);
}

// Add sparkle animation CSS
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Add sparkle effect to calculate button
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.addEventListener('click', function() {
        addSparkleEffect(this);
    });
});
