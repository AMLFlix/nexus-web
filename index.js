// Nav Bar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'bg-dark/95');
        nav.classList.remove('bg-dark/80');
    } else {
        nav.classList.add('bg-dark/80');
        nav.classList.remove('shadow-lg', 'bg-dark/95');
    }
});

// Auto Year in Footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Modal Functions
function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
    document.body.classList.add('modal-open');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }, 300);
}

// Close Modal when clicking outside
document.getElementById('payment-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('payment-modal');
});

// Copy Text
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const textToCopy = this.getAttribute('data-copy');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
            setTimeout(() => { this.innerHTML = originalHTML; }, 2000);
        });
    });
});