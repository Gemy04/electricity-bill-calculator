// Global variables
let currentMethod = 'exact';
let calculationHistory = [];
let lastCalculation = null;
let consumptionChart = null;
let currentLanguage = 'ar'; // Default language is Arabic

// Translations for multi-language support
const translations = {
    ar: {
        // General UI
        appTitle: 'حاسبة فاتورة الكهرباء',
        appSubtitle: 'احسب تكلفة استهلاك الكهرباء حسب أسعار أبريل 2024',
        lastUpdate: 'آخر تحديث للتعريفة',
        
        // Method selection
        exactMethod: 'الاستهلاك المحدد',
        exactMethodDesc: 'أدخل كمية الاستهلاك مباشرة',
        readingsMethod: 'القراءات',
        readingsMethodDesc: 'أدخل القراءة السابقة والحالية',
        
        // Form labels
        consumption: 'الاستهلاك (كيلو وات ساعة)',
        enterConsumption: 'أدخل كمية الاستهلاك',
        previousReading: 'القراءة السابقة',
        enterPreviousReading: 'أدخل القراءة السابقة',
        currentReading: 'القراءة الحالية',
        enterCurrentReading: 'أدخل القراءة الحالية',
        
        // Tips
        savingTips: 'نصائح لتوفير الكهرباء',
        tip1: 'استخدم مصابيح LED بدلاً من المصابيح العادية',
        tip2: 'اضبط المكيف على 24 درجة مئوية',
        tip3: 'افصل الأجهزة عند عدم الاستخدام',
        tip4: 'استخدم الغسالة بحمولة كاملة',
        
        // Buttons
        calculateBill: 'احسب الفاتورة',
        exportPDF: 'تصدير كملف PDF',
        calculateSavings: 'احسب التوفير',
        
        // Results
        calculationResult: 'نتيجة الحساب',
        totalCost: 'إجمالي تكلفة الاستهلاك',
        calculationDetails: 'تفاصيل الحساب',
        youAreIn: 'أنت في',
        kwhUniformRate: 'ك.و.س بسعر موحد',
        tier: 'شريحة',
        total: 'الإجمالي',
        price: 'السعر',
        cost: 'التكلفة',
        noData: 'لا توجد بيانات',
        
        // Environmental impact
        environmentalImpact: 'التأثير البيئي',
        co2Emissions: 'استهلاكك ينتج حوالي',
        treesNeeded: 'تحتاج إلى',
        kgOfCO2: 'كيلوجرام من انبعاثات CO2',
        trees: 'شجرة',
        toAbsorbEmissions: 'لامتصاص هذه الانبعاثات',
        
        // Savings calculator
        savingsCalculator: 'حاسبة التوفير',
        savingsDesc: 'كم ستوفر إذا قللت استهلاكك؟',
        targetReduction: 'نسبة التوفير المطلوبة (%)',
        newConsumption: 'الاستهلاك الجديد',
        newCost: 'التكلفة الجديدة',
        youWillSave: 'ستوفر',
        monthly: 'شهرياً',
        yearly: 'سنوياً',
        
        // History
        calculationHistory: 'سجل الحسابات السابقة',
        exportHistoryExcel: 'تصدير السجل (Excel)',
        exportHistoryPDF: 'تصدير السجل (PDF)',
        importHistory: 'استيراد السجل (Excel)',
        clearHistory: 'مسح السجل',
        noHistory: 'لا توجد حسابات سابقة',
        
        // PDF Export
        electricityBill: 'فاتورة الكهرباء',
        issueDate: 'تاريخ الإصدار',
        consumptionInfo: 'معلومات الاستهلاك',
        tier: 'الشريحة',
        notSpecified: 'غير محدد',
        accountDetails: 'تفاصيل الحساب',
        
        // Tiers
        tier1: 'الشريحة الأولى (0-50 ك.و.س)',
        tier2: 'الشريحة الثانية (51-100 ك.و.س)',
        tier3: 'الشريحة الثالثة (0-200 ك.و.س)',
        tier4: 'الشريحة الرابعة (201-350 ك.و.س)',
        tier5: 'الشريحة الخامسة (351-650 ك.و.س)',
        tier6: 'الشريحة السادسة (0-1000 ك.و.س)',
        tier7: 'الشريحة السابعة (أكثر من 1000 ك.و.س)',
        
        // History export
        historyRecord: 'سجل حسابات الكهرباء',
        period: 'الفترة',
        historySummary: 'ملخص السجل',
        recordCount: 'عدد الحسابات',
        avgConsumption: 'متوسط الاستهلاك',
        avgCost: 'متوسط التكلفة',
        totalCostSummary: 'إجمالي التكلفة',
        accounts: 'سجل الحسابات',
        date: 'التاريخ',
        time: 'الوقت',
        
        // Notifications
        calculationSaved: 'تم حفظ الحساب بنجاح! ✅',
        historyClearedSuccess: 'تم مسح السجل بنجاح! 🗑️',
        pdfExportSuccess: 'تم تصدير الفاتورة بنجاح! 📄',
        historyExportSuccess: 'تم تصدير السجل بنجاح! 📄',
        dataExportSuccess: 'تم تصدير البيانات بنجاح! 📤',
        dataImportSuccess: 'تم استيراد البيانات بنجاح! 📥',
        
        // Alerts
        pleaseEnterValidConsumption: 'يرجى إدخال قيم صحيحة للاستهلاك',
        currentMustBeGreater: 'القراءة الحالية يجب أن تكون أكبر من القراءة السابقة',
        calculateBillFirst: 'يرجى حساب الفاتورة أولاً',
        enterValidPercentage: 'يرجى إدخال نسبة توفير صحيحة بين 1 و 99',
        confirmClearHistory: 'هل أنت متأكد من مسح جميع الحسابات السابقة؟',
        noDataToExport: 'لا توجد بيانات للتصدير',
        pdfError: 'حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.',
        exportError: 'حدث خطأ أثناء تصدير البيانات.',
        importError: 'حدث خطأ أثناء استيراد البيانات. تأكد من أن الملف بالتنسيق الصحيح.',
        
        // Chart
        monthlyConsumption: 'الاستهلاك الشهري (ك.و.س)',
        consumption: 'الاستهلاك (ك.و.س)',
        
        // Misc
        generatedBy: 'تم إنشاء هذا التقرير بواسطة حاسبة فاتورة الكهرباء',
        mergeImportedData: 'هل تريد دمج البيانات المستوردة مع البيانات الحالية؟',
        currency: 'ج.م',
        kwhAbbr: 'ك.و.س',
        language: 'English'
    },
    en: {
        // General UI
        appTitle: 'Electricity Bill Calculator',
        appSubtitle: 'Calculate your electricity consumption cost based on April 2024 prices',
        lastUpdate: 'Last tariff update',
        
        // Method selection
        exactMethod: 'Exact Consumption',
        exactMethodDesc: 'Enter consumption amount directly',
        readingsMethod: 'Meter Readings',
        readingsMethodDesc: 'Enter previous and current readings',
        
        // Form labels
        consumption: 'Consumption (kWh)',
        enterConsumption: 'Enter consumption amount',
        previousReading: 'Previous Reading',
        enterPreviousReading: 'Enter previous reading',
        currentReading: 'Current Reading',
        enterCurrentReading: 'Enter current reading',
        
        // Tips
        savingTips: 'Electricity Saving Tips',
        tip1: 'Use LED bulbs instead of regular bulbs',
        tip2: 'Set your AC to 24°C',
        tip3: 'Unplug devices when not in use',
        tip4: 'Use washing machines with full loads',
        
        // Buttons
        calculateBill: 'Calculate Bill',
        exportPDF: 'Export as PDF',
        calculateSavings: 'Calculate Savings',
        
        // Results
        calculationResult: 'Calculation Result',
        totalCost: 'Total Consumption Cost',
        calculationDetails: 'Calculation Details',
        youAreIn: 'You are in',
        kwhUniformRate: 'kWh at uniform rate',
        tier: 'Tier',
        total: 'Total',
        price: 'Price',
        cost: 'Cost',
        noData: 'No data available',
        
        // Environmental impact
        environmentalImpact: 'Environmental Impact',
        co2Emissions: 'Your consumption produces about',
        treesNeeded: 'You need',
        kgOfCO2: 'kg of CO2 emissions',
        trees: 'trees',
        toAbsorbEmissions: 'to absorb these emissions',
        
        // Savings calculator
        savingsCalculator: 'Savings Calculator',
        savingsDesc: 'How much will you save if you reduce your consumption?',
        targetReduction: 'Target reduction percentage (%)',
        newConsumption: 'New Consumption',
        newCost: 'New Cost',
        youWillSave: 'You will save',
        monthly: 'monthly',
        yearly: 'yearly',
        
        // History
        calculationHistory: 'Calculation History',
        exportHistoryExcel: 'Export History (Excel)',
        exportHistoryPDF: 'Export History (PDF)',
        importHistory: 'Import History (Excel)',
        clearHistory: 'Clear History',
        noHistory: 'No previous calculations',
        
        // PDF Export
        electricityBill: 'Electricity Bill',
        issueDate: 'Issue Date',
        consumptionInfo: 'Consumption Information',
        tier: 'Tier',
        notSpecified: 'Not specified',
        accountDetails: 'Account Details',
        
        // Tiers
        tier1: 'First Tier (0-50 kWh)',
        tier2: 'Second Tier (51-100 kWh)',
        tier3: 'Third Tier (0-200 kWh)',
        tier4: 'Fourth Tier (201-350 kWh)',
        tier5: 'Fifth Tier (351-650 kWh)',
        tier6: 'Sixth Tier (0-1000 kWh)',
        tier7: 'Seventh Tier (more than 1000 kWh)',
        
        // History export
        historyRecord: 'Electricity Calculation History',
        period: 'Period',
        historySummary: 'History Summary',
        recordCount: 'Number of Records',
        avgConsumption: 'Average Consumption',
        avgCost: 'Average Cost',
        totalCostSummary: 'Total Cost',
        accounts: 'Calculation Records',
        date: 'Date',
        time: 'Time',
        
        // Notifications
        calculationSaved: 'Calculation saved successfully! ✅',
        historyClearedSuccess: 'History cleared successfully! 🗑️',
        pdfExportSuccess: 'Bill exported successfully! 📄',
        historyExportSuccess: 'History exported successfully! 📄',
        dataExportSuccess: 'Data exported successfully! 📤',
        dataImportSuccess: 'Data imported successfully! 📥',
        
        // Alerts
        pleaseEnterValidConsumption: 'Please enter valid consumption values',
        currentMustBeGreater: 'Current reading must be greater than previous reading',
        calculateBillFirst: 'Please calculate the bill first',
        enterValidPercentage: 'Please enter a valid percentage between 1 and 99',
        confirmClearHistory: 'Are you sure you want to clear all calculation history?',
        noDataToExport: 'No data to export',
        pdfError: 'Error generating PDF. Please try again.',
        exportError: 'Error exporting data.',
        importError: 'Error importing data. Make sure the file is in the correct format.',
        
        // Chart
        monthlyConsumption: 'Monthly Consumption (kWh)',
        consumption: 'Consumption (kWh)',
        
        // Misc
        generatedBy: 'This report was generated by Electricity Bill Calculator',
        mergeImportedData: 'Do you want to merge imported data with current data?',
        currency: 'EGP',
        kwhAbbr: 'kWh',
        language: 'العربية'
    }
};

// Function to toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    
    // Save language preference to localStorage
    try {
        localStorage.setItem('language', currentLanguage);
    } catch (e) {
        console.log('Could not save language preference');
    }
    
    // Update language direction
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Update UI text
    updateUILanguage();
    
    // Update the last update date with proper formatting for the new language
    const today = new Date();
    const formattedDate = currentLanguage === 'ar' 
        ? today.toLocaleDateString('ar-EG') 
        : today.toLocaleDateString('en-US');
    document.getElementById('update-date').textContent = formattedDate;
    
    // Reinitialize chart with new language
    if (consumptionChart) {
        consumptionChart.destroy();
        initializeChart();
        updateChart();
    }
    
    showNotification(currentLanguage === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
}

// Function to update UI text based on selected language
function updateUILanguage() {
    const t = translations[currentLanguage];
    
    // Update page title
    document.title = t.appTitle;
    
    // Update header
    document.querySelector('.header h1').textContent = t.appTitle;
    document.querySelector('.header p').textContent = t.appSubtitle;
    document.querySelector('.last-update').firstChild.textContent = t.lastUpdate + ': ';
    
    // Update method cards
    const methodCards = document.querySelectorAll('.method-card');
    methodCards[0].querySelector('h3').textContent = t.exactMethod;
    methodCards[0].querySelector('p').textContent = t.exactMethodDesc;
    methodCards[1].querySelector('h3').textContent = t.readingsMethod;
    methodCards[1].querySelector('p').textContent = t.readingsMethodDesc;
    
    // Update form labels
    document.querySelector('label[for="exact-usage"]').textContent = t.consumption;
    document.getElementById('exact-usage').placeholder = t.enterConsumption;
    document.querySelector('label[for="previous-reading"]').textContent = t.previousReading;
    document.getElementById('previous-reading').placeholder = t.enterPreviousReading;
    document.querySelector('label[for="current-reading"]').textContent = t.currentReading;
    document.getElementById('current-reading').placeholder = t.enterCurrentReading;
    
    // Update tips
    document.querySelector('.consumption-tips h4').textContent = `💡 ${t.savingTips}`;
    const tipItems = document.querySelectorAll('.tips-list li');
    tipItems[0].textContent = t.tip1;
    tipItems[1].textContent = t.tip2;
    tipItems[2].textContent = t.tip3;
    tipItems[3].textContent = t.tip4;
    
    // Update buttons
    document.querySelector('.calculate-btn').textContent = t.calculateBill;
    document.querySelector('.export-btn').innerHTML = `<span class="export-icon">📄</span> ${t.exportPDF}`;
    document.querySelector('.savings-btn').textContent = t.calculateSavings;
    
    // Update result section
    document.querySelector('#result h3').textContent = t.calculationResult;
    document.querySelector('#result p').textContent = t.totalCost;
    
    // Update environmental impact section
    document.querySelector('.environmental-impact h4').textContent = `🌍 ${t.environmentalImpact}`;
    
    // Update savings calculator
    document.querySelector('.savings-calculator h4').textContent = `💰 ${t.savingsCalculator}`;
    document.querySelector('.savings-calculator p').textContent = t.savingsDesc;
    document.getElementById('target-reduction').placeholder = t.targetReduction;
    
    // Update history section
    document.querySelector('.history h3').textContent = t.calculationHistory;
    const historyButtons = document.querySelectorAll('.history-actions button, .history-actions label');
    historyButtons[0].innerHTML = `<span class="history-btn-icon">📤</span> ${t.exportHistoryExcel}`;
    historyButtons[1].innerHTML = `<span class="history-btn-icon">📄</span> ${t.exportHistoryPDF}`;
    historyButtons[2].innerHTML = `<span class="history-btn-icon">📥</span> ${t.importHistory}`;
    historyButtons[3].innerHTML = `<span class="history-btn-icon">🗑️</span> ${t.clearHistory}`;
    
    // Update language button
    document.getElementById('language-text').textContent = t.language;
    
    // Update any visible dynamic content
    if (lastCalculation) {
        displayResult(lastCalculation);
    }
    
    updateHistoryDisplay();
}

// Initialize language from localStorage
function initializeLanguage() {
    try {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            currentLanguage = savedLanguage;
            document.documentElement.lang = currentLanguage;
            document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        }
    } catch (e) {
        console.log('Could not load language preference');
    }
}

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
    const t = translations[currentLanguage];

    if (currentMethod === 'exact') {
        consumption = parseFloat(document.getElementById('exact-usage').value) || 0;
    } else {
        const previousReading = parseFloat(document.getElementById('previous-reading').value) || 0;
        const currentReading = parseFloat(document.getElementById('current-reading').value) || 0;
        
        if (currentReading <= previousReading) {
            alert(t.currentMustBeGreater);
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
        alert(t.pleaseEnterValidConsumption);
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
    const t = translations[currentLanguage];
    
    if (!lastCalculation) {
        alert(t.calculateBillFirst);
        return;
    }

    const reductionPercent = parseFloat(document.getElementById('target-reduction').value) || 0;
    
    if (reductionPercent <= 0 || reductionPercent >= 100) {
        alert(t.enterValidPercentage);
        return;
    }

    const newConsumption = lastCalculation.consumption * (1 - reductionPercent / 100);
    const newResult = calculateElectricityBill(newConsumption);
    const savings = lastCalculation.totalCost - newResult.totalCost;

    const savingsResultEl = document.getElementById('savings-result');
    savingsResultEl.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>${t.newConsumption}:</strong> ${newConsumption.toFixed(0)} ${t.kwhAbbr}
        </div>
        <div style="margin-bottom: 10px;">
            <strong>${t.newCost}:</strong> ${newResult.totalCost.toFixed(2)} ${t.currency}
        </div>
        <div style="color: #22543d; font-size: 1.2rem;">
            <strong>💰 ${t.youWillSave}: ${savings.toFixed(2)} ${t.currency} ${t.monthly}</strong>
        </div>
        <div style="color: #4a5568; margin-top: 5px;">
            (${(savings * 12).toFixed(2)} ${t.currency} ${t.yearly})
        </div>
    `;
    savingsResultEl.style.display = 'block';
}

// Clear history function
function clearHistory() {
    const t = translations[currentLanguage];
    
    if (confirm(t.confirmClearHistory)) {
        calculationHistory = [];
        try {
            localStorage.removeItem('electricityHistory');
        } catch (e) {
            console.log('Could not clear localStorage');
        }
        updateHistoryDisplay();
        showNotification(t.historyClearedSuccess);
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
    const t = translations[currentLanguage];

    // Determine which tier system applies based on consumption
    if (consumption <= 50) {
        // Tier 1: 0-50 kWh at 68 piasters
        tierNumber = 1;
        tierCategory = t.tier1;
        totalCost = consumption * 0.68;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: `0.68 ${t.currency}`,
            cost: totalCost.toFixed(2)
        });
    } else if (consumption <= 100) {
        // Tiers 1-2: Progressive calculation for 51-100 kWh
        tierNumber = 2;
        tierCategory = t.tier2;
        
        // First 50 kWh at 68 piasters
        const tier1Cost = 50 * 0.68;
        breakdown.push({
            range: '0 - 50',
            kwh: 50,
            rate: `0.68 ${t.currency}`,
            cost: tier1Cost.toFixed(2)
        });
        
        // Remaining kWh at 78 piasters
        const tier2Consumption = consumption - 50;
        const tier2Cost = tier2Consumption * 0.78;
        breakdown.push({
            range: `51 - ${consumption}`,
            kwh: tier2Consumption,
            rate: `0.78 ${t.currency}`,
            cost: tier2Cost.toFixed(2)
        });
        
        totalCost = tier1Cost + tier2Cost;
    } else if (consumption <= 200) {
        // Tier 3: All consumption at 95 piasters
        tierNumber = 3;
        tierCategory = t.tier3;
        totalCost = consumption * 0.95;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: `0.95 ${t.currency}`,
            cost: totalCost.toFixed(2)
        });
    } else if (consumption <= 350) {
        // Tier 4: First 200 at 95 piasters, remaining at 155 piasters
        tierNumber = 4;
        tierCategory = t.tier4;
        
        // First 200 kWh at 95 piasters
        const tier3Cost = 200 * 0.95;
        breakdown.push({
            range: '0 - 200',
            kwh: 200,
            rate: `0.95 ${t.currency}`,
            cost: tier3Cost.toFixed(2)
        });
        
        // Remaining at 155 piasters
        const tier4Consumption = consumption - 200;
        const tier4Cost = tier4Consumption * 1.55;
        breakdown.push({
            range: `201 - ${consumption}`,
            kwh: tier4Consumption,
            rate: `1.55 ${t.currency}`,
            cost: tier4Cost.toFixed(2)
        });
        
        totalCost = tier3Cost + tier4Cost;
    } else if (consumption <= 650) {
        // Tier 5: First 200 at 95, next 150 at 155, remaining at 195
        tierNumber = 5;
        tierCategory = t.tier5;
        
        // First 200 kWh at 95 piasters
        const tier3Cost = 200 * 0.95;
        breakdown.push({
            range: '0 - 200',
            kwh: 200,
            rate: `0.95 ${t.currency}`,
            cost: tier3Cost.toFixed(2)
        });
        
        // Next 150 kWh (201-350) at 155 piasters
        const tier4Cost = 150 * 1.55;
        breakdown.push({
            range: '201 - 350',
            kwh: 150,
            rate: `1.55 ${t.currency}`,
            cost: tier4Cost.toFixed(2)
        });
        
        // Remaining at 195 piasters
        const tier5Consumption = consumption - 350;
        const tier5Cost = tier5Consumption * 1.95;
        breakdown.push({
            range: `351 - ${consumption}`,
            kwh: tier5Consumption,
            rate: `1.95 ${t.currency}`,
            cost: tier5Cost.toFixed(2)
        });
        
        totalCost = tier3Cost + tier4Cost + tier5Cost;
    } else if (consumption <= 1000) {
        // Tier 6: All consumption at 210 piasters
        tierNumber = 6;
        tierCategory = t.tier6;
        totalCost = consumption * 2.10;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: `2.10 ${t.currency}`,
            cost: totalCost.toFixed(2)
        });
    } else {
        // Tier 7: All consumption at 223 piasters
        tierNumber = 7;
        tierCategory = t.tier7;
        totalCost = consumption * 2.23;
        breakdown.push({
            range: `0 - ${consumption}`,
            kwh: consumption,
            rate: `2.23 ${t.currency}`,
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
    const t = translations[currentLanguage];

    // Display total cost
    totalCostEl.textContent = `${result.totalCost.toFixed(2)} ${t.currency}`;

    // Display breakdown with correct tier information
    let breakdownHTML = `
        <h4>${t.calculationDetails}</h4>
        <div class="tier-info">
            <span class="tier-icon">📊</span>
            ${t.youAreIn}: ${result.tierCategory}
        </div>
    `;

    // Show detailed breakdown
    if (result.breakdown.length === 1) {
        // Single tier (flat rate)
        breakdownHTML += `
            <div class="tier">
                <span>${result.consumption} ${t.kwhUniformRate}</span>
                <span>${result.breakdown[0].rate} </span>
            </div>
        `;
    } else {
        // Multiple tiers (progressive)
        for (const tier of result.breakdown) {
            breakdownHTML += `
                <div class="tier">
                    <span>${t.tier} ${tier.range} ${t.kwhAbbr}</span>
                    <span>${tier.kwh} × ${tier.rate} = ${tier.cost} ${t.currency}</span>
                </div>
            `;
        }
    }

    breakdownHTML += `
        <div class="tier">
            <span><strong>${t.total}</strong></span>
            <span><strong>${result.totalCost.toFixed(2)} ${t.currency}</strong></span>
        </div>
    `;

    breakdownEl.innerHTML = breakdownHTML;

    // Show environmental impact
    showEnvironmentalImpact(result.consumption);

    // Show result with animation
    resultDiv.classList.add('show');
    resultDiv.style.display = 'block'; // Ensure the container is visible
    lastCalculation = result;
}

function showEnvironmentalImpact(consumption) {
    const environmentalDiv = document.getElementById('environmental-impact');
    const co2InfoEl = document.getElementById('co2-info');
    const progressFillEl = document.getElementById('progress-fill');
    const t = translations[currentLanguage];

    // Approximate CO2 emissions: 0.5 kg per kWh (Egypt's electricity grid)
    const co2Emissions = (consumption * 0.5).toFixed(1);
    const treesNeeded = Math.ceil(consumption * 0.02); // Approximate trees needed to offset

    co2InfoEl.innerHTML = `
        ${t.co2Emissions} <strong>${co2Emissions} ${t.kgOfCO2}</strong><br>
        🌳 ${t.treesNeeded} <strong>${treesNeeded} ${t.trees}</strong> ${t.toAbsorbEmissions}
    `;

    // Progress bar animation
    const maxConsumption = 1000;
    const progressPercent = Math.min((consumption / maxConsumption) * 100, 100);
    progressFillEl.style.width = `${progressPercent}%`;

    environmentalDiv.style.display = 'block';
}

function saveToHistory(consumption, cost) {
    const t = translations[currentLanguage];
    
    const calculation = {
        date: new Date().toISOString(),
        consumption: consumption,
        cost: cost
    };
    
    calculationHistory.push(calculation);
    if (calculationHistory.length > 12) {
        calculationHistory.shift();
    }
    
    try {
        localStorage.setItem('electricityHistory', JSON.stringify(calculationHistory));
    } catch (e) {
        console.log('Could not save to localStorage');
    }
    
    updateHistoryDisplay();
    updateChart();
    showNotification(t.calculationSaved);
}

function updateHistoryDisplay() {
    const historyListEl = document.getElementById('history-list');
    const t = translations[currentLanguage];
    
    if (calculationHistory.length === 0) {
        historyListEl.innerHTML = `<p style="text-align: center; color: #666;">${t.noHistory}</p>`;
        return;
    }

    let historyHTML = '';
    for (const item of calculationHistory) {
        const date = new Date(item.date);
        historyHTML += `
            <div class="history-item">
                <div>
                    <strong>${item.consumption} ${t.kwhAbbr}</strong><br>
                    <small>${date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</small>
                </div>
                <div style="text-align: ${currentLanguage === 'ar' ? 'left' : 'right'};">
                    <strong>${item.cost} ${t.currency}</strong>
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

// Theme handling
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        themeIcon.textContent = '🌞';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
    
    // Reinitialize chart with new theme
    if (consumptionChart) {
        consumptionChart.destroy();
        initializeChart();
        updateChart();
    }
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-icon').textContent = '🌙';
    }
}

// Add initialization functions to window load
window.addEventListener('load', () => {
    initializeHistory();
    initializeLanguage();
    initializeTheme();
    updateUILanguage();
    initializeChart();
    updateChart();
    
    // Set today's date for the last update with proper formatting
    const today = new Date();
    const formattedDate = currentLanguage === 'ar' 
        ? today.toLocaleDateString('ar-EG') 
        : today.toLocaleDateString('en-US');
    document.getElementById('update-date').textContent = formattedDate;
});

// Simple PDF Export function
function exportToPDF() {
    const t = translations[currentLanguage];
    
    if (!lastCalculation) {
        alert(t.calculateBillFirst);
        // Show the calculate button with a highlight effect to guide the user
        const calculateBtn = document.querySelector('.calculate-btn');
        calculateBtn.classList.add('highlight-btn');
        setTimeout(() => {
            calculateBtn.classList.remove('highlight-btn');
        }, 1500);
        return;
    }
    
    try {
        // Create PDF content using HTML2Canvas
        const printContent = document.createElement('div');
        printContent.style.width = '800px';
        printContent.style.padding = '20px';
        printContent.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        printContent.style.textAlign = currentLanguage === 'ar' ? 'right' : 'left';
        printContent.style.backgroundColor = 'white';
        printContent.style.position = 'fixed';
        printContent.style.top = '-9999px';
        printContent.style.left = '0';
        printContent.style.fontFamily = 'Arial, sans-serif';
        printContent.style.color = 'black';
        printContent.style.fontSize = '14px';
        
        // Debug data
        console.log("Last calculation data:", lastCalculation);
        
        // Generate PDF content with explicit data
        const htmlContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 24px; color: #3867d6; margin-bottom: 10px; font-family: Arial, sans-serif;">${t.electricityBill}</h1>
                <p style="color: #555; font-size: 14px; font-family: Arial, sans-serif;">${t.issueDate}: ${new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</p>
            </div>
            
            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background-color: #f8f9fa; border-radius: 5px; font-family: Arial, sans-serif;">
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #3867d6;">${t.consumptionInfo}</h2>
                <p style="margin-bottom: 10px;"><strong>${t.consumption}:</strong> ${lastCalculation.consumption || 0} ${t.kwhAbbr}</p>
                <p style="margin-bottom: 10px;"><strong>${t.tier}:</strong> ${lastCalculation.tierCategory || t.notSpecified}</p>
                <p style="margin-bottom: 10px; font-size: 18px; color: #3867d6;"><strong>${t.totalCost}:</strong> ${lastCalculation.totalCost ? lastCalculation.totalCost.toFixed(2) : '0.00'} ${t.currency}</p>
            </div>
            
            <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #3867d6;">${t.calculationDetails}</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #3867d6; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.tier}</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.consumption} (${t.kwhAbbr})</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.price}</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.cost} (${t.currency})</th>
                    </tr>
                    ${lastCalculation.breakdown && Array.isArray(lastCalculation.breakdown) ? 
                        lastCalculation.breakdown.map(tier => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${tier.range || ''}</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${tier.kwh || 0}</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${tier.rate || ''}</td>
                                <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${tier.cost || ''}</td>
                            </tr>
                        `).join('') : 
                        `<tr><td colspan="4" style="padding: 10px; border: 1px solid #ddd; text-align: center;">${t.noData}</td></tr>`
                    }
                    <tr style="background-color: #f8f9fa; font-weight: bold;">
                        <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.total}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${lastCalculation.totalCost ? lastCalculation.totalCost.toFixed(2) : '0.00'} ${t.currency}</td>
                    </tr>
                </table>
            </div>
            
            <div style="border: 1px solid #4cd137; padding: 15px; margin-bottom: 20px; background-color: #f0fff0; border-radius: 5px; font-family: Arial, sans-serif;">
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #4cd137;">${t.environmentalImpact}</h2>
                <p style="margin-bottom: 10px;"><strong>${t.co2Emissions}:</strong> ${lastCalculation.consumption ? (lastCalculation.consumption * 0.5).toFixed(1) : '0'} ${t.kgOfCO2}</p>
                <p style="margin-bottom: 10px;"><strong>${t.treesNeeded}:</strong> ${lastCalculation.consumption ? Math.ceil(lastCalculation.consumption * 0.02) : '0'} ${t.trees}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #aaa; font-size: 12px; font-family: Arial, sans-serif;">
                ${t.generatedBy}
            </div>
        `;
        
        printContent.innerHTML = htmlContent;
        
        // Add to document and make sure it's visible (but off-screen)
        document.body.appendChild(printContent);
        
        // Delay slightly to ensure content is fully rendered
        setTimeout(() => {
            // Convert to image with html2canvas
            html2canvas(printContent, {
                scale: 2,
                logging: true, // Enable logging to debug issues
                useCORS: true,
                allowTaint: true,
                backgroundColor: 'white'
            }).then(canvas => {
                try {
                    // Create PDF
                    const { jsPDF } = window.jspdf;
                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    // Add image to PDF
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
                    
                    // If the image height exceeds the page height, add more pages
                    if (imgHeight > pageHeight) {
                        let heightLeft = imgHeight - pageHeight;
                        let position = -pageHeight;
                        
                        while (heightLeft > 0) {
                            position = position - pageHeight;
                            pdf.addPage();
                            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }
                    }
                    
                    // Generate a unique filename with current date and time
                    const now = new Date();
                    const dateStr = now.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US').replace(/\//g, '-');
                    const timeStr = now.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
                    const filename = `electricity-bill_${dateStr}_${timeStr}.pdf`;
                    
                    // Save PDF
                    pdf.save(filename);
                    showNotification(t.pdfExportSuccess);
                } catch (err) {
                    console.error('PDF generation error:', err);
                    alert(t.pdfError);
                }
                
                // Clean up
                document.body.removeChild(printContent);
            }).catch(error => {
                console.error('HTML2Canvas error:', error);
                document.body.removeChild(printContent);
                alert(t.pdfError);
            });
        }, 500); // Small delay to ensure rendering
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(t.pdfError);
    }
}

// Export history as Excel file
function exportHistory() {
    const t = translations[currentLanguage];
    
    if (calculationHistory.length === 0) {
        alert(t.noDataToExport);
        return;
    }
    
    try {
        // Prepare data for Excel
        const excelData = calculationHistory.map(item => {
            const date = new Date(item.date);
            return {
                [t.date]: date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US'),
                [t.time]: date.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US'),
                [`${t.consumption} (${t.kwhAbbr})`]: item.consumption,
                [`${t.cost} (${t.currency})`]: typeof item.cost === 'number' ? item.cost.toFixed(2) : item.cost
            };
        });
        
        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData, { 
            header: [t.date, t.time, `${t.consumption} (${t.kwhAbbr})`, `${t.cost} (${t.currency})`] 
        });
        
        // Set RTL direction
        worksheet['!cols'] = [
            { wch: 15 }, // Date width
            { wch: 15 }, // Time width
            { wch: 15 }, // Consumption width
            { wch: 15 }  // Cost width
        ];
        
        // Create a workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, t.calculationHistory);
        
        // Generate filename with current date and time
        const now = new Date();
        const dateStr = now.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US').replace(/\//g, '-');
        const timeStr = now.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
        const filename = `electricity-history_${dateStr}_${timeStr}.xlsx`;
        
        // Generate Excel file
        XLSX.writeFile(workbook, filename);
        
        showNotification(t.dataExportSuccess);
    } catch (error) {
        console.error('Error exporting history:', error);
        alert(t.exportError);
    }
}

// Import history from Excel file
function importHistory(event) {
    const t = translations[currentLanguage];
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Parse Excel data
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const importedData = XLSX.utils.sheet_to_json(worksheet);
            
            if (importedData.length === 0) {
                throw new Error(t.noDataToExport);
            }
            
            // Convert imported data to our format
            const formattedData = importedData.map(row => {
                // Try to extract data regardless of column names
                const dateStr = row[t.date] || row['التاريخ'] || row['تاريخ'] || row['Date'] || '';
                const consumption = parseFloat(row[`${t.consumption} (${t.kwhAbbr})`] || row['الاستهلاك (ك.و.س)'] || row['الاستهلاك'] || row['Consumption'] || 0);
                const cost = parseFloat(row[`${t.cost} (${t.currency})`] || row['التكلفة (ج.م)'] || row['التكلفة'] || row['Cost'] || 0);
                
                // Create date object
                let date;
                try {
                    // Try to parse the date, or use current date if not valid
                    date = dateStr ? new Date(dateStr) : new Date();
                    if (isNaN(date.getTime())) date = new Date();
                } catch (e) {
                    date = new Date();
                }
                
                return {
                    date: date.toISOString(),
                    consumption: consumption,
                    cost: cost
                };
            });
            
            // Merge with existing data or replace
            if (calculationHistory.length > 0 && confirm(t.mergeImportedData)) {
                calculationHistory = [...calculationHistory, ...formattedData];
                // Limit to last 50 records if too many
                if (calculationHistory.length > 50) {
                    calculationHistory = calculationHistory.slice(-50);
                }
            } else {
                calculationHistory = formattedData;
            }
            
            // Save to localStorage
            try {
                localStorage.setItem('electricityHistory', JSON.stringify(calculationHistory));
            } catch (e) {
                console.log('Could not save to localStorage');
            }
            
            // Update UI
            updateHistoryDisplay();
            updateChart();
            showNotification(t.dataImportSuccess);
        } catch (error) {
            console.error('Error importing history:', error);
            alert(t.importError);
        }
    };
    
    reader.readAsArrayBuffer(file);
    // Reset the file input to allow reimporting the same file
    event.target.value = '';
}

function initializeChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const t = translations[currentLanguage];
    
    const textColor = isDarkMode ? '#ffffff' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    consumptionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: t.monthlyConsumption,
                data: [],
                borderColor: isDarkMode ? '#8b5cf6' : '#667eea',
                backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(102, 126, 234, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Cairo'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: t.consumption,
                        color: textColor,
                        font: {
                            family: 'Cairo'
                        }
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    },
                    title: {
                        display: true,
                        text: t.date,
                        color: textColor,
                        font: {
                            family: 'Cairo'
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!consumptionChart) return;

    const last6Months = calculationHistory.slice(-6).reverse();
    const labels = last6Months.map(item => new Date(item.date).toLocaleDateString('ar-EG', { month: 'short' }));
    const data = last6Months.map(item => item.consumption);

    consumptionChart.data.labels = labels;
    consumptionChart.data.datasets[0].data = data;
    consumptionChart.update();
}

// Export history as PDF
function exportHistoryToPDF() {
    const t = translations[currentLanguage];
    
    if (calculationHistory.length === 0) {
        alert(t.noDataToExport);
        return;
    }
    
    try {
        // Create PDF content using HTML2Canvas
        const printContent = document.createElement('div');
        printContent.style.width = '800px';
        printContent.style.padding = '20px';
        printContent.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
        printContent.style.textAlign = currentLanguage === 'ar' ? 'right' : 'left';
        printContent.style.backgroundColor = 'white';
        printContent.style.position = 'fixed';
        printContent.style.top = '-9999px';
        printContent.style.left = '0';
        printContent.style.fontFamily = 'Arial, sans-serif';
        printContent.style.color = 'black';
        printContent.style.fontSize = '14px';
        
        // Sort history by date (newest first)
        const sortedHistory = [...calculationHistory].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Get first and last dates for the header
        const firstDate = sortedHistory.length > 0 ? new Date(sortedHistory[sortedHistory.length - 1].date) : new Date();
        const lastDate = sortedHistory.length > 0 ? new Date(sortedHistory[0].date) : new Date();
        const dateRange = `${firstDate.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')} - ${lastDate.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}`;
        
        // Generate table rows from history data
        const historyRows = sortedHistory.map((item, index) => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
            const formattedTime = date.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
            
            return `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${formattedDate}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${formattedTime}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${item.consumption || 0}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${typeof item.cost === 'number' ? item.cost.toFixed(2) : item.cost}</td>
                </tr>
            `;
        }).join('');
        
        // Generate statistics
        let totalConsumption = 0;
        let totalCost = 0;
        let maxConsumption = 0;
        let minConsumption = sortedHistory.length > 0 ? sortedHistory[0].consumption : 0;
        
        sortedHistory.forEach(item => {
            const consumption = parseFloat(item.consumption) || 0;
            const cost = parseFloat(item.cost) || 0;
            
            totalConsumption += consumption;
            totalCost += cost;
            
            if (consumption > maxConsumption) {
                maxConsumption = consumption;
            }
            
            if (consumption < minConsumption && consumption > 0) {
                minConsumption = consumption;
            }
        });
        
        const avgConsumption = sortedHistory.length > 0 ? (totalConsumption / sortedHistory.length).toFixed(2) : 0;
        const avgCost = sortedHistory.length > 0 ? (totalCost / sortedHistory.length).toFixed(2) : 0;
        
        // Generate HTML content
        const htmlContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 24px; color: #3867d6; margin-bottom: 10px; font-family: Arial, sans-serif;">${t.historyRecord}</h1>
                <p style="color: #555; font-size: 14px; font-family: Arial, sans-serif;">${t.issueDate}: ${new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</p>
                <p style="color: #555; font-size: 14px; font-family: Arial, sans-serif; background-color: #f0f4ff; padding: 5px 10px; border-radius: 5px; display: inline-block;">
                    <strong>${t.period}:</strong> ${dateRange}
                </p>
            </div>
            
            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background-color: #f8f9fa; border-radius: 5px; font-family: Arial, sans-serif;">
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #3867d6;">${t.historySummary}</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between;">
                    <div style="flex: 1; min-width: 200px;">
                        <p style="margin-bottom: 10px;"><strong>${t.recordCount}:</strong> ${sortedHistory.length}</p>
                        <p style="margin-bottom: 10px;"><strong>${t.avgConsumption}:</strong> ${avgConsumption} ${t.kwhAbbr}</p>
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <p style="margin-bottom: 10px;"><strong>${t.avgCost}:</strong> ${avgCost} ${t.currency}</p>
                        <p style="margin-bottom: 10px;"><strong>${t.totalCostSummary}:</strong> ${totalCost.toFixed(2)} ${t.currency}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
                <h2 style="font-size: 18px; margin-bottom: 15px; color: #3867d6;">${t.accounts}</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #3867d6; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">#</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.date}</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.time}</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.consumption} (${t.kwhAbbr})</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: ${currentLanguage === 'ar' ? 'right' : 'left'};">${t.cost} (${t.currency})</th>
                    </tr>
                    ${historyRows}
                </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #aaa; font-size: 12px; font-family: Arial, sans-serif;">
                ${t.generatedBy}
            </div>
        `;
        
        printContent.innerHTML = htmlContent;
        
        // Add to document and make sure it's visible (but off-screen)
        document.body.appendChild(printContent);
        
        // Delay slightly to ensure content is fully rendered
        setTimeout(() => {
            // Convert to image with html2canvas
            html2canvas(printContent, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: 'white'
            }).then(canvas => {
                try {
                    // Create PDF
                    const { jsPDF } = window.jspdf;
                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    // Add image to PDF
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
                    
                    // If the image height exceeds the page height, add more pages
                    if (imgHeight > pageHeight) {
                        let heightLeft = imgHeight - pageHeight;
                        let position = -pageHeight;
                        
                        while (heightLeft > 0) {
                            position = position - pageHeight;
                            pdf.addPage();
                            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }
                    }
                    
                    // Generate a unique filename with date range and current date-time
                    const now = new Date();
                    const dateStr = now.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US').replace(/\//g, '-');
                    const timeStr = now.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
                    const filename = `electricity-history_${dateRange.replace(/\//g, '-')}_${dateStr}_${timeStr}.pdf`;
                    
                    // Save PDF
                    pdf.save(filename);
                    showNotification(t.historyExportSuccess);
                } catch (err) {
                    console.error('PDF generation error:', err);
                    alert(t.pdfError);
                }
                
                // Clean up
                document.body.removeChild(printContent);
            }).catch(error => {
                console.error('HTML2Canvas error:', error);
                document.body.removeChild(printContent);
                alert(t.pdfError);
            });
        }, 500); // Small delay to ensure rendering
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(t.pdfError);
    }
}
