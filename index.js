/**
 * Nexus TV - Premium UI Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Configuration
    const CONFIG = {
        downloads: {
            android: 'https://rapp.plyme.space/android-phone/nexus_code1_beta.apk',
            tv: 'https://rapp.plyme.space/app-release.apk'
        },
        socials: {
            facebook: 'https://www.facebook.com/NexusTVMyanmar',
            telegram: 'https://t.me/NexusSupport'
        }
    };

    // Auto update year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Fancy Toast Notification System
    let toastTimer;
    window.showToast = (msg, isSuccess = true) => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        const toastIcon = document.getElementById('toast-icon');
        const toastIconBg = document.getElementById('toast-icon-bg');
        
        if (!toast) return;

        toastMsg.textContent = msg;
        
        // Dynamic Styling based on state
        if(isSuccess) {
            toast.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
            toast.style.backgroundColor = 'rgba(24, 24, 27, 0.9)'; // Dark Zinc
            toastIconBg.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green tint
            toastIcon.className = "fa-solid fa-check text-green-500";
        } else {
            toast.style.borderColor = 'rgba(229, 9, 20, 0.3)'; 
            toast.style.backgroundColor = 'rgba(24, 24, 27, 0.9)';
            toastIconBg.style.backgroundColor = 'rgba(229, 9, 20, 0.2)'; // Red tint
            toastIcon.className = "fa-solid fa-info text-[#E50914]";
        }

        // Pop in animation
        toast.classList.remove('-translate-y-[200%]', 'opacity-0');
        
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('-translate-y-[200%]', 'opacity-0');
        }, 3000);
    };

    // Plan Selection UX
    window.selectPlan = (planName) => {
        showToast(`Selected ${planName} Plan. Proceed to App to pay.`, true);
        const paymentSection = document.getElementById('payment');
        if(paymentSection) {
            setTimeout(() => {
                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
        }
    };

    // Setup Download & Social Links
    document.querySelectorAll('[data-social]').forEach(link => {
        const platform = link.getAttribute('data-social');
        if (CONFIG.socials[platform]) {
            link.href = CONFIG.socials[platform];
            link.target = '_blank';
        }
    });

    document.querySelectorAll('[data-download]').forEach(btn => {
        btn.addEventListener('click', () => {
            const platformType = btn.getAttribute('data-download');
            const url = CONFIG.downloads[platformType];
            if (url) {
                showToast('Initiating download...', true);
                setTimeout(() => window.open(url, '_blank'), 500);
            } else {
                showToast("Link unavailable", false);
            }
        });
    });

    // Smooth Accordion (One open at a time)
    window.toggleFaq = (element) => {
        document.querySelectorAll('details').forEach(item => {
            if (item !== element) item.removeAttribute('open');
        });
    };

    // --- UI/UX Enhancements ---

    // 1. Scroll Animations (Intersection Observer for Fade-in)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 2. Floating Navbar & Mobile Nav Scroll Spy
    const navbarWrapper = document.getElementById('navbar-wrapper');
    const navbar = document.getElementById('navbar');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav .nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Desktop Navbar Style change on scroll
        if (navbarWrapper && navbar) {
            if (scrollY > 50) {
                navbar.classList.add('nav-floating');
                navbarWrapper.classList.remove('pt-4');
                navbarWrapper.classList.add('pt-2');
            } else {
                navbar.classList.remove('nav-floating');
                navbarWrapper.classList.add('pt-4');
                navbarWrapper.classList.remove('pt-2');
            }
        }

        // Mobile Nav Highlighting
        let currentSection = "home";
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop - window.innerHeight / 2.5) {
                currentSection = sec.getAttribute("id");
            }
        });

        mobileNavLinks.forEach(item => {
            // Reset state
            item.classList.remove("text-white");
            item.classList.add("text-zinc-500");
            item.style.transform = "scale(1)";
            
            // Active state
            if (item.getAttribute("href").includes(currentSection)) {
                item.classList.remove("text-zinc-500");
                item.classList.add("text-white");
                item.style.transform = "scale(1.15)";
            }
        });
    }, { passive: true });
});
