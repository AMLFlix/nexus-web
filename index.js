// ==========================================
// 1. Initialize Third-party Libraries
// ==========================================
AOS.init({
    once: true,
    offset: 50,
});

// ==========================================
// 2. DOMContentLoaded Events (Page loaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Initialize App Downloads
    setupDownloadButtons();

    // Fetch API Data for Payment Methods
    fetchPaymentMethods();
});

// ==========================================
// 3. Mobile Menu UI Interactions
// ==========================================
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileBtn && mobileMenu) {
    const icon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        
        if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fa-solid fa-bars';
        } else {
            icon.className = 'fa-solid fa-xmark';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            icon.className = 'fa-solid fa-bars';
        });
    });
}

// ==========================================
// 4. Scroll Effect & Toast Notification
// ==========================================

// Nav Bar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    
    // Add glass panel background on scroll
    if (window.scrollY > 20) {
        nav.classList.add('glass-panel', 'border-b', 'border-white/5');
    } else {
        nav.classList.remove('glass-panel', 'border-b', 'border-white/5');
    }
});

// Toast Notification Handler
let toastTimeout;
function showComingSoon(e, platformName) {
    if(e) e.preventDefault();
    const toast = document.getElementById('toast-notification');
    const message = document.getElementById('toast-message');
    
    if (!toast || !message) return;

    clearTimeout(toastTimeout);
    message.textContent = `${platformName} ဗားရှင်းကို လက်ရှိတွင် ရေးဆွဲနေဆဲဖြစ်ပါသည်။ စောင့်မျှော်ပေးပါဦး။`;
    
    toast.classList.remove('translate-y-[150%]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast-notification');
    if(toast) {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[150%]', 'opacity-0');
    }
}

// Close button for Toast
const toastCloseBtn = document.getElementById('toast-close');
if(toastCloseBtn) {
    toastCloseBtn.addEventListener('click', hideToast);
}

// ==========================================
// 5. App Download Handler
// ==========================================
const APP_LINKS = {
    // Android Phone APK လင့်ခ်ကို ဤနေရာတွင် ပြောင်းထည့်ပါ
    android: 'https://rapp.plyme.space/nexusSTR/nexus-mobile-release.apk', 
    tv: 'https://rapp.plyme.space/nexusSTR/nexus-release.apk',
    ios: null,      
    windows: null   
};

function setupDownloadButtons() {
    const btnAndroid = document.getElementById('btn-dl-android');
    const btnTv = document.getElementById('btn-dl-tv');
    const btnIos = document.getElementById('btn-dl-ios');
    const btnWindows = document.getElementById('btn-dl-windows');

    if (btnAndroid) {
        btnAndroid.addEventListener('click', (e) => {
            if (APP_LINKS.android) {
                window.open(APP_LINKS.android, '_blank');
                e.preventDefault();
            } else {
                showComingSoon(e, 'Android Phone & Tablet');
            }
        });
    }

    if (btnTv) {
        btnTv.addEventListener('click', (e) => {
            if (APP_LINKS.tv) {
                window.open(APP_LINKS.tv, '_blank');
                e.preventDefault();
            } else {
                showComingSoon(e, 'Android TV');
            }
        });
    }

    if (btnIos) {
        btnIos.addEventListener('click', (e) => showComingSoon(e, 'iPhone & iPad'));
    }

    if (btnWindows) {
        btnWindows.addEventListener('click', (e) => showComingSoon(e, 'Windows PC'));
    }
}

// ==========================================
// 6. API & Data Fetching (Payment Methods)
// ==========================================
const API_URL = 'https://api.auranov.site'; 

async function fetchPaymentMethods() {
    try {
        const methodsRes = await fetch(`${API_URL}/payment-methods`);
        if(methodsRes.ok) {
            const methods = await methodsRes.json();
            if(methods && methods.length > 0) {
                renderPaymentMethods(methods);
                return; // Success
            }
        }
        throw new Error("No data");
    } catch (error) {
        console.warn('Failed to fetch methods, using default UI.');
        // If API fails, create a default Kpay fallback so the page isn't empty
        renderPaymentMethods([
            { name: "Kpay", phone: "09123456789" },
            { name: "WavePay", phone: "09123456789" }
        ]);
    }
}

function renderPaymentMethods(methods) {
    const container = document.getElementById('payment-methods-container');
    if (!container) return;
    container.innerHTML = ''; 
    
    methods.forEach(method => {
        const isKpay = method.name.toLowerCase().includes('kpay');
        const brandColor = isKpay ? '#4285F4' : '#fbbc05';
        
        // Updated HTML to match the new Cosmic Cinema Theme
        const methodHTML = `
        <div tabindex="0" class="glass-panel p-4 rounded-2xl flex items-center justify-between cursor-pointer group hover:border-white/20 transition-all copy-btn" data-copy="${method.phone}">
            <div>
                <p class="text-xs font-bold mb-1 tracking-widest uppercase" style="color: ${brandColor}">${method.name}</p>
                <p class="text-lg text-white font-mono font-bold tracking-wider">${method.phone}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <i class="fa-regular fa-copy text-gray-400 group-hover:text-white transition-colors"></i>
            </div>
        </div>
        `;
        container.innerHTML += methodHTML;
    });
    
    attachCopyListeners();
}

function attachCopyListeners() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        // Handle click
        btn.addEventListener('click', function(e) {
            copyAction(this);
        });

        // Handle keyboard 'Enter' for accessibility
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                copyAction(this);
            }
        });
    });
}

function copyAction(element) {
    const textToCopy = element.getAttribute('data-copy');
    navigator.clipboard.writeText(textToCopy).then(() => {
        const iconContainer = element.querySelector('.fa-copy, .fa-check').parentElement;
        const icon = element.querySelector('.fa-copy, .fa-check');
        
        // Change to checkmark & green color
        iconContainer.classList.remove('bg-white/5', 'group-hover:bg-white/10');
        iconContainer.classList.add('bg-green-500/20');
        icon.className = 'fa-solid fa-check text-green-400';
        
        // Revert back after 2 seconds
        setTimeout(() => { 
            iconContainer.classList.add('bg-white/5', 'group-hover:bg-white/10');
            iconContainer.classList.remove('bg-green-500/20');
            icon.className = 'fa-regular fa-copy text-gray-400 group-hover:text-white transition-colors'; 
        }, 2000);
    });
}