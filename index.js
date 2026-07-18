document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Configuration (URLs တွေ ပြင်ရန်)
    const CONFIG = {
        downloads: {
            'download-mobile': 'https://app.nexusmm.xyz/android-phone/nexus-2.0-app-release.apk==',
            'download-tv': 'https://app.nexusmm.xyz/android-tv/androidtv.apk'
        },
        socials: {
            facebook: 'https://facebook.com/nexus',
            telegram: 'https://t.me/NexusCareOfficial',
            support: 'https://t.me/NexusCareOfficial',
            tiktok: 'https://tiktok.com/@nexus',
            youtube: 'https://youtube.com/@nexus'
        }
    };

    // 3. Enhanced Toast System (Notification ပြသည့်စနစ်)
    let toastTimer;
    const showToast = (msg, isError = false) => {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-msg');
        const iconBg = document.getElementById('toast-icon-bg');
        const icon = document.getElementById('toast-icon');

        msgEl.textContent = msg;

        if (isError) {
            iconBg.className = "w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30";
            icon.className = "fa-solid fa-triangle-exclamation text-red-500 text-sm";
            toast.classList.replace('border-nexus-red/30', 'border-red-500/30');
        } else {
            iconBg.className = "w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/30";
            icon.className = "fa-solid fa-check text-green-500 text-sm";
            toast.classList.replace('border-red-500/30', 'border-nexus-red/30'); // Revert to default
        }

        // Animate In
        toast.classList.remove('-translate-y-[200%]', 'opacity-0');
        
        // Animate Out
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('-translate-y-[200%]', 'opacity-0');
        }, 3500);
    };

    // 4. Download Handlers (with visual feedback)
    document.querySelectorAll('[data-action^="download"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-action');
            const url = CONFIG.downloads[type];
            
            if (url) {
                const deviceName = type === 'download-tv' ? 'Android TV' : 'Android Phone';
                showToast(`Preparing ${deviceName} APK download...`);
                
                // Simulate delay for smooth UX
                setTimeout(() => {
                    window.location.href = url;
                }, 1200);
            } else {
                showToast("Download link not configured.", true);
            }
        });
    });

    // 5. Social Link Handlers
    document.querySelectorAll('[data-social]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.getAttribute('data-social');
            const url = CONFIG.socials[platform];
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // 6. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Apply observer to all elements with 'reveal' class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});
