// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active nav link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Carousel functionality
const carouselTrack = document.querySelector('.carousel-track');
const carouselIndicators = document.querySelector('.carousel-indicators');
const prevBtn = document.querySelector('.carousel-btn-left');
const nextBtn = document.querySelector('.carousel-btn-right');

// Dynamically load screenshots from appSS folder
const screenshots = [
    'appSS/ss1.png',
    'appSS/ss2.png',
    'appSS/ss3.png',
    'appSS/ss4.png'
];

let currentSlide = 0;

// Initialize carousel
function initCarousel() {
    // Add screenshots to carousel
    screenshots.forEach((screenshot, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === currentSlide) {
            carouselItem.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = screenshot;
        img.alt = `Accomplit App Screenshot ${index + 1}`;
        img.loading = 'lazy';

        carouselItem.appendChild(img);
        carouselTrack.appendChild(carouselItem);

        // Add indicator dot
        const dot = document.createElement('span');
        dot.classList.add('indicator-dot');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(dot);
    });

    // Calculate starting position based on even/odd number of images
    const totalImages = screenshots.length;
    if (totalImages % 2 === 0) {
        // Even number: Choose the image just right of center
        currentSlide = (totalImages / 2) - 1;
    } else {
        // Odd number: Choose the exact middle image
        currentSlide = Math.floor(totalImages / 2);
    }

    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.indicator-dot');
    const containerWidth = document.querySelector('.carousel-track-container').offsetWidth;

    // Remove active class from all items
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current item
    if (items[currentSlide]) {
        items[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }

    // Calculate offset to center the active item
    const itemWidth = items[0].offsetWidth;
    const gap = 30;
    const offset = (containerWidth / 2) - (itemWidth / 2) - (currentSlide * (itemWidth + gap));

    carouselTrack.style.transform = `translateX(${offset}px)`;
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % screenshots.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + screenshots.length) % screenshots.length;
    updateCarousel();
}

// Event listeners for carousel buttons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-track-container');

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Recalculate carousel position on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateCarousel();
    }, 250);
});

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
