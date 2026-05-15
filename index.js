document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Config & State
    const CONFIG = {
        paymentApi: 'https://api.auranov.site/payment-methods',
        downloads: {
            android: 'https://rapp.plyme.space/android-phone/nexus_code1_beta.apk',
            tv: 'https://rapp.plyme.space/app-release.apk'
        },
        fallbackPayments: [
            { name: "Kpay", phone: "09971234567" },
            { name: "WavePay", phone: "09971234567" }
        ]
    };

    const UI = {
        desktopNav: document.getElementById('desktop-nav'),
        toast: document.getElementById('toast'),
        toastMsg: document.getElementById('toast-msg'),
        paymentContainer: document.getElementById('payment-methods-container'),
        sections: document.querySelectorAll('section'),
        navLinks: document.querySelectorAll('.nav-link'),
        downloadBtns: document.querySelectorAll('[data-download]')
    };

    // 2. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 50 });
    }

    // 3. Toast Controller
    const showToast = (msg) => {
        UI.toastMsg.textContent = msg;
        UI.toast.classList.replace('-translate-y-24', 'translate-y-0');
        UI.toast.classList.replace('opacity-0', 'opacity-100');
        
        setTimeout(() => {
            UI.toast.classList.replace('translate-y-0', '-translate-y-24');
            UI.toast.classList.replace('opacity-100', 'opacity-0');
        }, 3000);
    };

    // 4. Payment Fetcher
    const loadPayments = async () => {
        try {
            const res = await fetch(CONFIG.paymentApi);
            const data = res.ok ? await res.json() : CONFIG.fallbackPayments;
            renderPayments(data);
        } catch {
            renderPayments(CONFIG.fallbackPayments);
        }
    };

    const renderPayments = (list) => {
        if (!UI.paymentContainer) return;
        UI.paymentContainer.innerHTML = list.map(p => `
            <div class="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-white/10 active:scale-95 transition-all" onclick="copyText('${p.phone}')">
                <div>
                    <p class="text-[10px] font-bold text-brand uppercase tracking-tighter mb-1">${p.name}</p>
                    <p class="text-sm font-mono font-bold text-white">${p.phone}</p>
                </div>
                <i class="fa-regular fa-copy text-gray-500 group-hover:text-white transition-colors"></i>
            </div>
        `).join('');
    };

    // Global copy function
    window.copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!"));
    };

    // 5. Scroll Handling (Responsive)
    const onScroll = () => {
        const scrollY = window.scrollY;

        // Desktop Nav Styling
        if (UI.desktopNav) {
            UI.desktopNav.classList.toggle('bg-appBg/80', scrollY > 50);
            UI.desktopNav.classList.toggle('backdrop-blur-xl', scrollY > 50);
            UI.desktopNav.classList.toggle('py-4', scrollY > 50);
            UI.desktopNav.classList.toggle('border-b', scrollY > 50);
            UI.desktopNav.classList.toggle('border-white/5', scrollY > 50);
        }

        // Scroll Spy (Mobile & Desktop)
        let current = "";
        UI.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        UI.navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    };

    // 6. Download Controller
    UI.downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = CONFIG.downloads[btn.dataset.download];
            url ? window.open(url, '_blank') : showToast("Coming soon!");
        });
    });

    // Run
    window.addEventListener('scroll', onScroll, { passive: true });
    loadPayments();
});
