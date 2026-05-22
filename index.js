/**
 * Nexus TV - Production Grade Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Configuration Links
    const CONFIG = {
        downloads: {
            android: 'https://rapp.plyme.space/android-phone/app-arm64-v8a-release.apk',
            tv: 'https://rapp.plyme.space/android-tv/app-release.apk'
        },
        socials: {
            facebook: 'https://www.facebook.com/NexusTVMyanmar',
            telegram: 'https://t.me/NexusSupport'
        }
    };

    // 1. Auto update copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Premium Toast Notification System
    let toastTimer;
    window.showToast = (msg, type = 'info') => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        const toastIconBg = document.getElementById('toast-icon-bg');
        const toastIcon = document.getElementById('toast-icon');
        
        if (!toast) return;

        toastMsg.textContent = msg;
        
        // Styling based on type
        if(type === 'success') {
            toastIconBg.className = "w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30";
            toastIcon.className = "fa-solid fa-check text-emerald-400 text-sm";
        } else if (type === 'error') {
            toastIconBg.className = "w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30";
            toastIcon.className = "fa-solid fa-triangle-exclamation text-red-400 text-sm";
        } else {
            // Default Info (Brand blue)
            toastIconBg.className = "w-8 h-8 rounded-full flex items-center justify-center bg-brand/20 border border-brand/30";
            toastIcon.className = "fa-solid fa-info text-brand-light text-sm";
        }

        // Animate In
        toast.classList.remove('-translate-y-[200%]', 'opacity-0');
        
        // Auto Hide
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('-translate-y-[200%]', 'opacity-0');
        }, 3500);
    };

    // 3. Download Handling (Directing to correct APK)
    document.querySelectorAll('[data-download]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platformType = btn.getAttribute('data-download');
            const url = CONFIG.downloads[platformType];
            
            if (url) {
                const deviceName = platformType === 'tv' ? 'Android TV' : 'Android Phone';
                showToast(`${deviceName} အတွက် Download စတင်နေပါပြီ...`, 'success');
                
                // Use location.href for reliable APK download triggering
                setTimeout(() => {
                    window.location.href = url;
                }, 800);
            } else {
                showToast("Download link မရနိုင်သေးပါ။", 'error');
            }
        });
    });

    // 4. Social Links Setup
    document.querySelectorAll('[data-social]').forEach(link => {
        const platform = link.getAttribute('data-social');
        if (CONFIG.socials[platform]) {
            link.href = CONFIG.socials[platform];
            link.target = '_blank';
        }
    });

    // 5. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 6. Sticky Glass Navbar Behavior
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-nav', 'py-3');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('glass-nav', 'py-3');
            navbar.classList.add('py-4');
        }
    }, { passive: true });
});
