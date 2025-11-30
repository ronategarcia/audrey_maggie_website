// ===================================
// Mobile Navigation Toggle
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Dynamic Screenshot Carousel
// ===================================
const carouselTrack = document.getElementById('carouselTrack');
const carouselDots = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Screenshots array - automatically loads all screenshots from appSS folder
const screenshots = [
    'appSS/ss1.png',
    'appSS/ss2.png',
    'appSS/ss3.png',
    'appSS/ss4.png'
];

let currentSlide = 0;
const totalSlides = screenshots.length;

// Calculate initial slide for desktop/tablet (screenshots on both sides)
function getInitialSlide() {
    if (window.innerWidth >= 768) {
        // Desktop/Tablet: Start with a slide that has items on both sides
        if (totalSlides % 2 === 0) {
            // Even number: Choose the image just right of center
            return (totalSlides / 2) - 1;
        } else {
            // Odd number: Choose the exact middle image
            return Math.floor(totalSlides / 2);
        }
    } else {
        // Mobile: Start at first slide (index 0)
        return 0;
    }
}

// Initialize carousel
function initCarousel() {
    // Clear existing content
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';

    // Create carousel items
    screenshots.forEach((screenshot, index) => {
        // Create carousel item
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        if (index === currentSlide) {
            item.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = screenshot;
        img.alt = `Accomplit App Screenshot ${index + 1}`;

        item.appendChild(img);
        carouselTrack.appendChild(item);

        // Create dot indicator
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    updateCarousel();
}

// Update carousel position and active states
function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const isMobile = window.innerWidth < 768;

    // Update active states
    items.forEach((item, index) => {
        if (index === currentSlide) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update carousel position (only for desktop/tablet)
    if (!isMobile && items.length > 0) {
        const carouselContainer = document.querySelector('.carousel-wrapper');
        const containerWidth = carouselContainer.offsetWidth;
        const itemWidth = items[currentSlide].offsetWidth;
        const gap = 30;

        // Calculate offset to center the current slide
        const offset = (containerWidth / 2) - (itemWidth / 2) - (currentSlide * (itemWidth + gap));

        carouselTrack.style.transform = `translateX(${offset}px)`;
    } else {
        // Mobile: no transform needed, CSS handles single centered item
        carouselTrack.style.transform = 'translateX(0)';
    }
}

// Move carousel with infinite loop
function moveCarousel(direction) {
    currentSlide += direction;

    // Infinite loop logic
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1; // Go to last slide
    }
    if (currentSlide >= totalSlides) {
        currentSlide = 0; // Go to first slide
    }

    updateCarousel();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Event listeners for carousel navigation
prevBtn.addEventListener('click', () => moveCarousel(-1));
nextBtn.addEventListener('click', () => moveCarousel(1));

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselWrapper = document.querySelector('.carousel-wrapper');

carouselWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carouselWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - go to next
            moveCarousel(1);
        } else {
            // Swipe right - go to previous
            moveCarousel(-1);
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// Handle window resize - reinitialize carousel with proper starting position
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateCarousel();
    }, 250);
});

// Initialize carousel on page load
window.addEventListener('load', () => {
    currentSlide = getInitialSlide();
    initCarousel();
});

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(44, 62, 92, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(44, 62, 92, 0.08)';
    }

    lastScroll = currentScroll;
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animations
document.querySelectorAll('.impact-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
