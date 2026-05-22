/**
 * Nexus TV - iOS Theme Interactive Logic (v1.0 Beta)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Configuration
    const CONFIG = {
        downloads: {
            // Android Direct APK download link
            android: 'https://rapp.plyme.space/android-phone/app-arm64-v8a-release.apk',
            tv: 'https://rapp.plyme.space/android-tv/app-release.apk'
        },
        socials: {
            facebook: 'https://www.facebook.com/NexusTVMyanmar',
            telegram: 'https://t.me/NexusSupport'
        }
    };

    // Auto update year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // iOS Style Notification System
    let toastTimer;
    window.showToast = (msg, isSuccess = true) => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        const toastIcon = document.getElementById('toast-icon');
        const toastIconBg = document.getElementById('toast-icon-bg');
        
        if (!toast) return;

        toastMsg.textContent = msg;
        
        if(isSuccess) {
            toastIconBg.className = "w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-iosBlue/20";
            toastIcon.className = "fa-solid fa-check text-iosBlue text-sm";
        } else {
            toastIconBg.className = "w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-red-500/20";
            toastIcon.className = "fa-solid fa-exclamation text-red-500 text-sm";
        }

        // Pop in animation
        toast.classList.remove('-translate-y-[150%]', 'opacity-0');
        
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('-translate-y-[150%]', 'opacity-0');
        }, 3500);
    };

    // Plan Selection UX
    window.selectPlan = (planName) => {
        showToast(`${planName} Plan အားရွေးချယ်ပြီးပါပြီ။ App အတွင်းငွေချေပါ။`, true);
        const paymentSection = document.getElementById('payment');
        if(paymentSection) {
            setTimeout(() => {
                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    };

    // Setup Social Links
    document.querySelectorAll('[data-social]').forEach(link => {
        const platform = link.getAttribute('data-social');
        if (CONFIG.socials[platform]) {
            link.href = CONFIG.socials[platform];
            link.target = '_blank';
        }
    });

    // Fix Download Issue Logic
    document.querySelectorAll('[data-download]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platformType = btn.getAttribute('data-download');
            const url = CONFIG.downloads[platformType];
            
            if (url) {
                showToast('v1.0 Beta အား Download စတင်နေပါပြီ...', true);
                
                // Using location.href is more reliable for APK downloads than window.open
                // which might be blocked by popup blockers.
                setTimeout(() => {
                    window.location.href = url;
                }, 800);

            } else {
                showToast("Download link မရနိုင်သေးပါ။", false);
            }
        });
    });

    // 1. Scroll Animations (Intersection Observer for smooth reveal)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 2. iOS Mobile Bottom Tab Bar Highlight Logic
    const mobileNavLinks = document.querySelectorAll('#mobile-nav .nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        let currentSection = "home";
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop - window.innerHeight / 2.5) {
                currentSection = sec.getAttribute("id");
            }
        });

        mobileNavLinks.forEach(item => {
            item.classList.remove("text-iosBlue");
            item.classList.add("text-iosGray");
            
            if (item.getAttribute("href").includes(currentSection)) {
                item.classList.remove("text-iosGray");
                item.classList.add("text-iosBlue");
            }
        });
    }, { passive: true });
});
