/* ============================================
   PINKY DEY MAKEUP STUDIO — Main JavaScript
   All interactive features for the website
   ============================================ */

// ============================================
// INITIALIZATION — Run when DOM is fully loaded
// ============================================
document.addEventListener('DOMContentLoaded', function () {

    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,       // Animate only once on scroll
        offset: 80,       // Trigger 80px before element enters viewport
    });

    // Set minimum selectable date on booking form to today
    const dateInput = document.getElementById('userDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Start all interactive features
    initPageLoader();
    initCountdownTimer();
    initStatsCounter();
    initBeforeAfterSlider();
    initGalleryFilter();
    initGalleryLightbox();
    initNavbarScroll();
    initDarkMode();
    initPriceEstimator();
    initWhatsAppForm();
    initTypewriter();
    initMobileCTA();
});


// ============================================
// 1. PAGE LOADER
// ============================================
// Shows a loading spinner on page load, then fades it out
// once all content is ready.
// ============================================
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', function () {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 600);
    });

    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 3000);
}


// ============================================
// 2. TYPEWRITER EFFECT (Hero Section)
// ============================================
// Cycles through phrases with a typing/deleting animation
// to showcase different services in the hero.
// ============================================
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Best Bridal Makeup Artist in Silchar',
        'HD Airbrush Makeup Specialist',
        'Professional Makeup Classes Available',
        'Party & Engagement Glam Expert',
        '7+ Years of Makeup Excellence',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of phrase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after a brief delay
    setTimeout(type, 1000);
}


// ============================================
// 3. WHATSAPP BOOKING FORM
// ============================================
// This is the CORE feature of the website.
// 
// HOW IT WORKS:
// 1. The user fills in: Name, Phone, Service, Date, Message
// 2. On form submit, we prevent the default HTML form submission
// 3. We capture all input values from the form fields
// 4. We create a formatted WhatsApp message string
// 5. We encode the message using encodeURIComponent()
// 6. We redirect the user to: https://wa.me/918586008694?text=ENCODED_MESSAGE
// 7. This automatically opens WhatsApp (app or web) with the pre-filled message
// 8. NO backend, NO API, NO database needed!
//
// The WhatsApp number used: +91 8586008694 (Pinky Dey)
// ============================================
function initWhatsAppForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        // Step 1: Prevent default form submission (no page reload / no server call)
        e.preventDefault();

        // Step 2: Capture all input values from the form fields
        const name    = document.getElementById('userName').value.trim();
        const phone   = document.getElementById('userPhone').value.trim();
        const service = document.getElementById('userService').value;
        const date    = document.getElementById('userDate').value;
        const message = document.getElementById('userMessage').value.trim();

        // Basic validation
        if (!name || !phone || !service || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        // Step 3: Create a formatted message string
        const whatsappMessage = 
`Hello, I want to book a makeup service 💄

*Name:* ${name}
*Phone:* ${phone}
*Service:* ${service}
*Date:* ${date}
*Message:* ${message || 'N/A'}

Sent from the website ✨`;

        // Step 4: Encode the message
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Step 5: Build the WhatsApp redirect URL
        const whatsappURL = `https://wa.me/918586008694?text=${encodedMessage}`;

        // Step 6: Redirect the user to WhatsApp
        window.open(whatsappURL, '_blank');

        // Show success feedback
        const btn = document.getElementById('submitBtn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check text-2xl"></i> Redirecting to WhatsApp...';
            btn.classList.add('opacity-80');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('opacity-80');
            }, 3000);
        }
    });
}


// ============================================
// 4. COUNTDOWN TIMER (Offer Banner)
// ============================================
// Creates a countdown timer for the promotional offer banner.
// The timer counts down from a deadline set 3 days from now.
// ============================================
function initCountdownTimer() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    // Set the deadline to 3 days from now
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 3);

    function updateTimer() {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;

        if (distance < 0) {
            countdownEl.textContent = 'Offer Expired!';
            return;
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}


// ============================================
// 5. STATS COUNTER ANIMATION
// ============================================
// Animates the statistics numbers (7+, 500+, etc.) 
// when they scroll into view, counting up from 0.
// ============================================
function initStatsCounter() {
    const stats = [
        { id: 'stat1', target: 7,   suffix: '+' },
        { id: 'stat2', target: 500, suffix: '+' },
        { id: 'stat3', target: 200, suffix: '+' },
        { id: 'stat4', target: 450, suffix: '+' }
    ];

    let counted = false;

    function animateCount(element, target, suffix) {
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 80));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = current + suffix;
        }, 25);
    }

    // Use IntersectionObserver to trigger counting when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                stats.forEach(stat => {
                    const el = document.getElementById(stat.id);
                    if (el) animateCount(el, stat.target, stat.suffix);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statEl = document.getElementById('stat1');
    if (statEl) {
        observer.observe(statEl.closest('div').parentElement);
    }
}


// ============================================
// 6. BEFORE/AFTER IMAGE SLIDER
// ============================================
// A draggable comparison slider that lets users
// reveal the "before" vs "after" makeup transformation.
// ============================================
function initBeforeAfterSlider() {
    const slider = document.getElementById('baSlider');
    const before = document.getElementById('baBefore');
    const handle = document.getElementById('baHandle');
    if (!slider || !before || !handle) return;

    let isDragging = false;

    function getPosition(e) {
        const rect = slider.getBoundingClientRect();
        let x;
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }
        // Clamp between 5% and 95% of slider width
        return Math.max(0.05 * rect.width, Math.min(x, 0.95 * rect.width));
    }

    function updateSlider(x) {
        const width = slider.getBoundingClientRect().width;
        const percent = (x / width) * 100;
        before.style.width = percent + '%';
        handle.style.left = percent + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(getPosition(e));
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(getPosition(e));
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch events (mobile)
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(getPosition(e));
    });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(getPosition(e));
    });
    window.addEventListener('touchend', () => { isDragging = false; });
}


// ============================================
// 7. GALLERY FILTER
// ============================================
// Filters portfolio gallery items by category
// (all, bridal, party, engagement) with smooth transitions.
// ============================================
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active tab
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            items.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden-item');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden-item');
                    }, 300);
                }
            });
        });
    });
}


// ============================================
// 8. GALLERY LIGHTBOX
// ============================================
// Opens a full-screen lightbox when clicking on gallery
// images. Users can close by clicking the backdrop or X button.
// ============================================
function initGalleryLightbox() {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.className = 'fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer';
    overlay.innerHTML = `
        <button class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
        <img src="" alt="Gallery image" class="transition-transform duration-300">
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('img');

    // Close lightbox on click
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.closest('button')) {
            overlay.classList.remove('show');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            overlay.classList.remove('show');
        }
    });

    // Add click handler to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                overlay.classList.add('show');
            }
        });
    });
}


// ============================================
// 9. STICKY NAVBAR SCROLL EFFECT
// ============================================
// Adds shadow to navbar on scroll and highlights
// the active nav link based on scroll position.
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar shadow on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            // Toggle icon between bars and X
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// Global function to close mobile menu (called from HTML onclick)
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
}


// ============================================
// 10. DARK MODE TOGGLE
// ============================================
// Toggles between light and dark mode.
// Persists user preference in localStorage.
// ============================================
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.classList.add('dark');
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}


// ============================================
// 11. INSTANT PRICE ESTIMATOR
// ============================================
// Calculates estimated price based on selected
// service and add-ons in real time.
// ============================================
function initPriceEstimator() {
    // Initial calculation
    updateEstimate();
}

// Global function (called from HTML onchange events)
function updateEstimate() {
    const serviceSelect = document.getElementById('est-service');
    const addons = document.querySelectorAll('.est-addon');
    const totalEl = document.getElementById('est-total');

    if (!serviceSelect || !totalEl) return;

    let total = parseInt(serviceSelect.value) || 0;

    addons.forEach(addon => {
        if (addon.checked) {
            total += parseInt(addon.value) || 0;
        }
    });

    // Animate the number change
    totalEl.style.transform = 'scale(1.1)';
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    setTimeout(() => {
        totalEl.style.transform = 'scale(1)';
    }, 200);
}


// ============================================
// 12. MOBILE STICKY CTA BAR
// ============================================
// Shows a sticky bottom CTA bar on mobile devices
// once the user scrolls past the hero section.
// ============================================
function initMobileCTA() {
    const mobileCTA = document.getElementById('mobileCTA');
    const heroSection = document.getElementById('home');
    if (!mobileCTA || !heroSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Hero is out of view — show mobile CTA
                mobileCTA.classList.add('show');
            } else {
                // Hero is visible — hide mobile CTA
                mobileCTA.classList.remove('show');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(heroSection);
}
