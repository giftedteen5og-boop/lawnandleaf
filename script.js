// ============================================================
// Lawn and Leaf — Main Script
// ============================================================

// ============ 1. MOBILE MENU TOGGLE ============
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

if (mobileMenu && navbar) {
    // Toggle menu on hamburger click
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents immediate closing
        navbar.classList.toggle('active');
    });

    // Close menu when clicking anywhere outside of it
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
            navbar.classList.remove('active');
        }
    });
}

// ============ 2. ACTIVE PAGE HIGHLIGHT ============
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('#navbar ul li a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
        link.classList.add('active');
    }
});

// ============ 3. TOAST NOTIFICATIONS ============
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = '';
    if (isError) toast.classList.add('error');
    toast.classList.add('show');
    if (toast.timeout) clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => toast.classList.remove('show'), 4500);
}

// ============ 4. BACK TO TOP ============
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ 5. SCROLL REVEAL ============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============ 6. CHARACTER COUNTER ============
const messageField = document.getElementById('message');
const charCount = document.getElementById('char-count');
if (messageField && charCount) {
    charCount.textContent = '0 / 500';
    messageField.addEventListener('input', () => {
        const len = messageField.value.length;
        charCount.textContent = `${len} / 500`;
        charCount.style.color = len > 480 ? '#c0392b' : len > 450 ? '#e67e22' : '#555';
    });
}

// ============ 7. FAQ ACCORDION ============
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ============ 8. EXPAND FULL SERVICES BOX ============
const toggleServicesBtn = document.getElementById('toggle-services');
const fullServicesList = document.getElementById('full-services-list');

if (toggleServicesBtn && fullServicesList) {
    toggleServicesBtn.addEventListener('click', () => {
        toggleServicesBtn.classList.toggle('active');
        fullServicesList.classList.toggle('active');
    });
}

// ============ 9. QUOTE CALCULATOR ============
const calcSize = document.getElementById('calc-size');
const calcService = document.getElementById('calc-service');
const calcFrequency = document.getElementById('calc-frequency');
const calcOutput = document.getElementById('calc-output');

function updateEstimate() {
    if (!calcSize || !calcService || !calcFrequency || !calcOutput) return;
    const size = parseFloat(calcSize.value);
    const service = parseFloat(calcService.value);
    const frequency = parseFloat(calcFrequency.value);
    const estimate = Math.round(size * service * frequency);
    const current = parseInt(calcOutput.textContent.replace(/\D/g, '')) || 0;
    animateNumber(calcOutput, current, estimate, 500);
}

function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(from + (to - from) * progress);
        el.textContent = value.toLocaleString('en-ZA');
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

if (calcSize) {
    calcSize.addEventListener('change', updateEstimate);
    calcService.addEventListener('change', updateEstimate);
    calcFrequency.addEventListener('change', updateEstimate);
    updateEstimate();
}

// ============ 10. ANIMATED IMPACT STAT COUNTERS ============
const impactNumbers = document.querySelectorAll('.impact-number');
if (impactNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target')) || 0;
                const duration = 1800;
                const start = performance.now();

                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    impactNumbers.forEach(el => counterObserver.observe(el));
}

// ============ 11. ENHANCED FORM SUBMISSION ============
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone')?.value.trim() || '';
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', true);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', true);
            return;
        }

        const inquiry = {
            id: Date.now(),
            name, email, phone, service, message,
            date: new Date().toLocaleString()
        };
        const inquiries = JSON.parse(localStorage.getItem('gm_inquiries') || '[]');
        inquiries.push(inquiry);
        localStorage.setItem('gm_inquiries', JSON.stringify(inquiries));

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                showToast(`✅ Thank you, ${name}! We'll be in touch within 24 hours.`);
                contactForm.reset();
                if (charCount) { charCount.textContent = '0 / 500'; charCount.style.color = '#555'; }
            } else {
                showToast('Something went wrong. Please try WhatsApp instead.', true);
            }
        } catch (err) {
            showToast('Network error. Please try WhatsApp instead.', true);
            console.error(err);
        }
    });
}

// ============ 12. DYNAMIC YEAR ============
const yearSpan = document.getElementById('current-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ============ 13. ESCAPE KEY TO CLOSE MENU ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar?.classList.contains('active')) {
        navbar.classList.remove('active');
    }
});

console.log('🌿 Lawn and Leaf | Multi-Page Architecture Loaded');