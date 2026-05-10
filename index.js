/**
 * Nexus TV - Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 1. Configuration & App State
    // ==========================================
    const CONFIG = {
        api: {
            paymentMethods: 'https://api.auranov.site/payment-methods'
        },
        downloads: {
            android: 'https://rapp.plyme.space/app-arm64-v8a-release.apk',
            tv: 'https://rapp.plyme.space/app-release.apk'
        },
        // ဤနေရာတွင် မိမိတို့၏ Social Media Link အမှန်များကို ပြောင်းလဲထည့်သွင်းပါ
        socials: {
            facebook: 'https://www.facebook.com/NexusTVMyanmar',
            tiktok: 'https://www.tiktok.com/@nexustv',
            telegram: 'https://t.me/NexusSupport'
        },
        defaultPayments: [
            { name: "Kpay", phone: "not yet" },
            { name: "WavePay", phone: "not yet" }
        ]
    };

    let toastTimer = null;

    // ==========================================
    // 2. DOM Elements
    // ==========================================
    const UI = {
        year: document.getElementById('current-year'),
        topNav: document.getElementById('top-nav'),
        toast: document.getElementById('toast'),
        toastMsg: document.getElementById('toast-msg'),
        toastIcon: document.getElementById('toast-icon'),
        paymentContainer: document.getElementById('payment-methods-container'),
        sections: document.querySelectorAll('section'),
        navItems: document.querySelectorAll('.bottom-nav-item'),
        downloadBtns: document.querySelectorAll('[data-download]'),
        socialLinks: document.querySelectorAll('[data-social]'),
        homeBtn: document.getElementById('nav-home-btn')
    };

    // ==========================================
    // 3. Initialization
    // ==========================================
    function init() {
        // Init AOS Animations
        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true, offset: 30 });
        }

        // Set Copyright Year
        if (UI.year) {
            UI.year.textContent = new Date().getFullYear();
        }

        // Inject Secure Social Links
        setupSocialLinks();

        // Fetch Data
        fetchPaymentMethods();

        // Attach Event Listeners
        attachEventListeners();
    }

    // ==========================================
    // 4. UI Helpers & Toast System
    // ==========================================
    function showToast(msg, type = 'info') {
        if (!UI.toast || !UI.toastMsg) return;

        UI.toastMsg.textContent = msg;
        
        // Dynamic Icon based on type
        if (type === 'success') {
            UI.toastIcon.className = 'fa-solid fa-circle-check text-green-500 text-sm';
        } else {
            UI.toastIcon.className = 'fa-solid fa-circle-info text-brand text-sm';
        }

        clearTimeout(toastTimer);
        
        UI.toast.classList.remove('-translate-y-[150%]', 'opacity-0');
        UI.toast.classList.add('translate-y-0', 'opacity-100');
        
        toastTimer = setTimeout(() => {
            UI.toast.classList.remove('translate-y-0', 'opacity-100');
            UI.toast.classList.add('-translate-y-[150%]', 'opacity-0');
        }, 3000);
    }

    // ==========================================
    // 5. Social Links Setup (Secure Injection)
    // ==========================================
    function setupSocialLinks() {
        UI.socialLinks.forEach(link => {
            const platform = link.getAttribute('data-social');
            if (CONFIG.socials[platform]) {
                link.href = CONFIG.socials[platform];
                // Security best practice for external links
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            } else {
                // If link is missing in config, handle click with toast
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showToast(`${platform} page is coming soon!`);
                });
            }
        });
    }

    // ==========================================
    // 6. API Functions (Payment)
    // ==========================================
    async function fetchPaymentMethods() {
        try {
            const res = await fetch(CONFIG.api.paymentMethods);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    renderPayments(data);
                    return;
                }
            }
            throw new Error("No data returned from API");
        } catch (e) {
            console.warn('API Fetch failed, using fallback payment methods.', e);
            renderPayments(CONFIG.defaultPayments);
        }
    }

    function renderPayments(methods) {
        if (!UI.paymentContainer) return;
        UI.paymentContainer.innerHTML = ''; // Clear loading state
        
        methods.forEach(m => {
            const isKpay = m.name.toLowerCase().includes('kpay');
            const color = isKpay ? '#4285F4' : '#fbbc05';
            
            const methodHTML = `
            <div tabindex="0" class="glass-panel p-4 rounded-xl flex items-center justify-between cursor-pointer group hover:border-white/20 active:scale-95 transition-all payment-copy-btn" data-phone="${m.phone}">
                <div>
                    <p class="text-[10px] font-bold tracking-widest uppercase mb-0.5" style="color:${color}">${m.name}</p>
                    <p class="text-sm text-white font-mono font-bold">${m.phone}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center icon-wrap group-hover:bg-white/10 transition-colors">
                    <i class="fa-regular fa-copy text-gray-400 text-sm group-hover:text-white transition-colors"></i>
                </div>
            </div>`;
            
            UI.paymentContainer.insertAdjacentHTML('beforeend', methodHTML);
        });

        // Attach listeners to newly created DOM elements
        document.querySelectorAll('.payment-copy-btn').forEach(btn => {
            btn.addEventListener('click', handleCopy);
            // Keyboard accessibility (Press Enter or Space to copy)
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCopy.call(btn, e);
            });
        });
    }

    function handleCopy(e) {
        e.preventDefault();
        const btn = this;
        const phone = btn.getAttribute('data-phone');
        
        navigator.clipboard.writeText(phone).then(() => {
            const wrap = btn.querySelector('.icon-wrap');
            const icon = btn.querySelector('i');
            
            // Visual feedback
            wrap.classList.remove('bg-white/5', 'group-hover:bg-white/10');
            wrap.classList.add('bg-green-500/20');
            icon.className = 'fa-solid fa-check text-green-400 text-sm';
            
            showToast('Copied to clipboard!', 'success');

            // Reset after 2s
            setTimeout(() => {
                wrap.classList.remove('bg-green-500/20');
                wrap.classList.add('bg-white/5', 'group-hover:bg-white/10');
                icon.className = 'fa-regular fa-copy text-gray-400 text-sm group-hover:text-white transition-colors';
            }, 2000);
        }).catch(err => {
            showToast('Failed to copy', 'error');
            console.error('Copy failed:', err);
        });
    }

    // ==========================================
    // 7. Event Listeners
    // ==========================================
    function attachEventListeners() {
        // Download Buttons
        UI.downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.getAttribute('data-download');
                const link = CONFIG.downloads[type];
                if (link) {
                    window.open(link, '_blank');
                } else {
                    showToast('Coming soon. Please wait!');
                }
            });
        });

        // Mobile Home Button (Scroll to top)
        if (UI.homeBtn) {
            UI.homeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Scroll Handlers (Nav styling & Scroll Spy)
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        // Top Nav Background Effect
        if (UI.topNav) {
            if (scrollY > 20) {
                UI.topNav.classList.add('bg-appBg/90', 'backdrop-blur-md', 'border-b', 'border-white/5');
            } else {
                UI.topNav.classList.remove('bg-appBg/90', 'backdrop-blur-md', 'border-b', 'border-white/5');
            }
        }

        // Mobile Bottom Nav Highlights (Scroll Spy)
        let currentSection = 'home';
        UI.sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            // Buffer space for accuracy
            if (scrollY >= sectionTop - 150) {
                currentSection = sec.getAttribute('id');
            }
        });

        UI.navItems.forEach(item => {
            item.classList.remove('active', 'text-brand');
            const href = item.getAttribute('href');
            
            if (href && href.includes(currentSection)) {
                if (currentSection === 'download') {
                    item.classList.add('text-brand');
                } else {
                    item.classList.add('active');
                }
            }
        });

        // Exception for scrolling to absolute top
        if (scrollY < 200) {
            UI.navItems.forEach(i => i.classList.remove('active', 'text-brand'));
            if (UI.navItems[0]) UI.navItems[0].classList.add('active');
        }
    }

    // Run Initialization
    init();
});
