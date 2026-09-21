// البيانات الافتراضية للفرص التطوعية
const initialOpportunities = [
    {
        id: 1,
        title: "حملة تشجير وتنظيف الغابات الوطنية",
        org: "جمعية حماية البيئة",
        category: "بيئي",
        location: "الجزائر العاصمة",
        hours: 6,
        desc: "نهدف لغرس 500 شجرة وتنظيف المسارات السياحية لحماية التنوع البيولوجي.",
        applied: false
    },
    {
        id: 2,
        title: "قافلة طبية للكشف المبكر والإسعافات",
        org: "الهلال الأحمر / الهيئة الطبية",
        category: "صحي",
        location: "وهران",
        hours: 8,
        desc: "مطلوب متطوعين ومسعفين لتنظيم الصفوف والمساعدة في الفحوصات الأولية.",
        applied: false
    },
    {
        id: 3,
        title: "ورشة تعليم أساسيات البرمجة للشباب",
        org: "نادي التكنولوجيا والابتكار",
        category: "تعليمي",
        location: "قسنطينة",
        hours: 4,
        desc: "تقديم دروس مبسطة في تطوير الويب لطلاب المدارس وتوجيههم تقنياً.",
        applied: false
    }
];

// تحميل البيانات أو استخدام الافتراضية
let opportunities = JSON.parse(localStorage.getItem('vol_opps')) || initialOpportunities;
let userHours = parseInt(localStorage.getItem('vol_hours')) || 48;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    saveData();
    renderOpportunities();
    updateStats();
});

// حفظ البيانات في LocalStorage
function saveData() {
    localStorage.setItem('vol_opps', JSON.stringify(opportunities));
    localStorage.setItem('vol_hours', userHours);
}

// التنقل بين الشاشات
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.remove('hidden');

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// عرض الفرص التطوعية
function renderOpportunities() {
    const recentContainer = document.getElementById('recent-opportunities-list');
    const allContainer = document.getElementById('all-opportunities-list');

    if (!recentContainer || !allContainer) return;

    recentContainer.innerHTML = '';
    allContainer.innerHTML = '';

    opportunities.forEach(opp => {
        const card = createOpportunityCard(opp);
        allContainer.appendChild(card);
    });

    // عرض أول 3 عناصر في الصفحة الرئيسية
    opportunities.slice(0, 3).forEach(opp => {
        const card = createOpportunityCard(opp);
        recentContainer.appendChild(card);
    });
}

// إنشاء عنصر الكارت للفرصة
function createOpportunityCard(opp) {
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4";
    
    let badgeColor = "bg-emerald-100 text-emerald-700";
    if (opp.category === "صحي") badgeColor = "bg-red-100 text-red-700";
    if (opp.category === "تعليمي") badgeColor = "bg-blue-100 text-blue-700";
    if (opp.category === "بيئي") badgeColor = "bg-green-100 text-green-700";

    card.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-start gap-2">
                <span class="text-xs px-3 py-1 rounded-full font-bold ${badgeColor}">${opp.category}</span>
                <span class="text-xs text-gray-500 flex items-center gap-1">
                    <i class="fa-solid fa-clock text-emerald-600"></i> ${opp.hours} ساعات
                </span>
            </div>
            <h3 class="font-bold text-gray-900 text-lg leading-snug">${opp.title}</h3>
            <p class="text-xs text-gray-500 font-medium">${opp.org} &bull; ${opp.location}</p>
            <p class="text-sm text-gray-600 line-clamp-2">${opp.desc}</p>
        </div>
        <button onclick="toggleApply(${opp.id})" class="w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            opp.applied 
            ? "bg-gray-100 text-emerald-700 border border-emerald-200" 
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }">
            ${opp.applied ? '<i class="fa-solid fa-circle-check"></i> تم التقديم' : 'التقديم الآن'}
        </button>
    `;
    return card;
}

// التقديم على فرصة
function toggleApply(id) {
    opportunities = opportunities.map(opp => {
        if (opp.id === id) {
            const nextState = !opp.applied;
            if (nextState) {
                alert(`تم تقديم طلبك بنجاح للفرصة: "${opp.title}"`);
            }
            return { ...opp, applied: nextState };
        }
        return opp;
    });
    saveData();
    renderOpportunities();
}

// التصفية والبحث
function filterOpportunities() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const allContainer = document.getElementById('all-opportunities-list');

    allContainer.innerHTML = '';

    const filtered = opportunities.filter(opp => {
        const matchesQuery = opp.title.toLowerCase().includes(query) || 
                             opp.location.toLowerCase().includes(query) || 
                             opp.org.toLowerCase().includes(query);
        const matchesCategory = category === 'ALL' || opp.category === category;
        return matchesQuery && matchesCategory;
    });

    if (filtered.length === 0) {
        allContainer.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">لا توجد نتائج تطابق بحثك.</div>`;
        return;
    }

    filtered.forEach(opp => {
        allContainer.appendChild(createOpportunityCard(opp));
    });
}

// إضافة فرصة جديدة
function handleCreateOpportunity(e) {
    e.preventDefault();
    const title = document.getElementById('opp-title').value;
    const org = document.getElementById('opp-org').value;
    const category = document.getElementById('opp-category').value;
    const location = document.getElementById('opp-location').value;
    const hours = parseInt(document.getElementById('opp-hours').value);
    const desc = document.getElementById('opp-desc').value;

    const newOpp = {
        id: Date.now(),
        title,
        org,
        category,
        location,
        hours,
        desc,
        applied: false
    };

    opportunities.unshift(newOpp);
    saveData();
    renderOpportunities();
    document.getElementById('add-opportunity-form').reset();
    alert('تم نشر الفرصة التطوعية بنجاح!');
    showTab('opportunities');
}

// تسجيل الحضور اليدوي
function handleManualCheckin(e) {
    e.preventDefault();
    const code = document.getElementById('attendance-code').value.trim();
    if (code) {
        userHours += 4;
        saveData();
        updateStats();
        alert(`تم اعتماد الحضور بنجاح بإستخدام الرمز (${code})! تمت إضافة 4 ساعات تطوعية لحسابك.`);
        document.getElementById('attendance-code').value = '';
        showTab('profile');
    }
}

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('stat-hours').innerText = userHours;
    document.getElementById('profile-hours').innerText = userHours;
}