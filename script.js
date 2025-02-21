// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Disable cursor effect on mobile
if ('ontouchstart' in window) {
    const cursorEffect = document.querySelector('.cursor-effect');
    if (cursorEffect) {
        cursorEffect.style.display = 'none';
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // If it's the home link, scroll to hero landing
        if (this.classList.contains('home-link')) {
            document.querySelector('#home').scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            // For other links, scroll to the element
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add initial scroll on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add loading="lazy" to all images for better performance
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Update copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Theme toggling
    const themeToggle = document.querySelector('.theme-toggle');
    const mapIframe = document.getElementById('googleMap');
    
    // Function to update map theme
    function updateMapTheme(isDark) {
        let currentSrc = mapIframe.src;
        currentSrc = currentSrc.replace('&darkmode=1', '').replace('&darkmode=0', '');
        mapIframe.src = currentSrc + (isDark ? '&darkmode=1' : '&darkmode=0');
    }
    
    // Check for saved theme preference or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateMapTheme(savedTheme === 'dark');
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateMapTheme(true);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateMapTheme(newTheme === 'dark');
    });
    
    // Add keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            document.querySelector('.prev-arrow').click();
        } else if (e.key === 'ArrowRight') {
            document.querySelector('.next-arrow').click();
        }
    });
});

// Testimonial Carousel
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonial-track');
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    let currentIndex = 0;
    let autoPlayTimer;
    let isHovered = false;
    let isTransitioning = false;
    
    // Clone first and last slides for infinite loop
    const firstCardClone = cards[0].cloneNode(true);
    const lastCardClone = cards[cards.length - 1].cloneNode(true);
    track.appendChild(firstCardClone);
    track.insertBefore(lastCardClone, cards[0]);
    
    // Adjust initial position to show first real slide
    track.style.transform = `translateX(-100%)`;
    
    function updateCarousel(transition = true) {
        if (isTransitioning) return; // Prevent multiple transitions
        isTransitioning = true;
        
        track.style.transition = transition ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // If no transition, immediately allow next slide
        if (!transition) {
            isTransitioning = false;
        }
    }
    
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing timer
        if (!isHovered) { // Only start if not being hovered
            autoPlayTimer = setInterval(() => {
                currentIndex++;
                updateCarousel();
            }, 7000);
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
        }
    }
    
    // Handle transition end
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === cards.length) {
            currentIndex = 0;
            updateCarousel(false);
        } else if (currentIndex === -1) {
            currentIndex = cards.length - 1;
            updateCarousel(false);
        }
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoPlay();
    });
    
    track.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoPlay();
    });
    
    // Arrow navigation with debounce
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    prevArrow.addEventListener('click', () => {
        if (isTransitioning) return; // Prevent spam clicking
        currentIndex--;
        updateCarousel();
        startAutoPlay();
    });
    
    nextArrow.addEventListener('click', () => {
        if (isTransitioning) return; // Prevent spam clicking
        currentIndex++;
        updateCarousel();
        startAutoPlay();
    });
    
    // Dot navigation with timer reset
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            startAutoPlay(); // Reset timer
        });
    });
    
    // Start autoplay initially
    startAutoPlay();
});

// Cursor effect
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor-effect');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--cursor-x', x + '%');
        document.documentElement.style.setProperty('--cursor-y', y + '%');
        
        // Show the effect when mouse moves
        cursor.style.opacity = '1';
    });
    
    // Hide the effect when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
});

// Business Hours Status
function updateBusinessHours() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Update current day highlight
    const hoursList = document.querySelector('.hours-list');
    const allDays = hoursList.querySelectorAll('li');
    allDays.forEach(day => {
        if (parseInt(day.dataset.day) === currentDay) {
            day.classList.add('current-day');
        } else {
            day.classList.remove('current-day');
        }
    });
    
    // Check if we're currently open
    const statusElement = document.querySelector('.current-status');
    const isWeekday = currentDay >= 1 && currentDay <= 6;
    const currentTime = currentHour + (currentMinute / 60);
    
    if (!statusElement) return;
    
    if (currentDay === 0) {
        // Sunday
        statusElement.textContent = "Currently Closed - Opens Monday at 8:00 AM";
        statusElement.classList.add('closed');
        statusElement.classList.remove('open');
    } else if (isWeekday && currentTime >= 8 && currentTime < 18) {
        // Open on weekday between 8 AM and 6 PM
        statusElement.textContent = "Currently Open";
        statusElement.classList.add('open');
        statusElement.classList.remove('closed');
    } else {
        // Outside business hours
        const nextOpenDay = currentDay === 0 ? "Monday" : 
                          currentDay === 6 ? "Monday" : 
                          getDayName(currentDay + 1);
        
        statusElement.textContent = `Currently Closed - Opens ${currentTime >= 18 ? nextOpenDay : 'today'} at 8:00 AM`;
        statusElement.classList.add('closed');
        statusElement.classList.remove('open');
    }
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

// Update business hours status immediately and every minute
updateBusinessHours();
setInterval(updateBusinessHours, 60000);

// Image gallery expansion
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = document.createElement('div');
        const backdrop = document.createElement('div');
        const expandedImg = document.createElement('img');
        const closeBtn = document.createElement('button');
        
        overlay.className = 'image-overlay';
        backdrop.className = 'overlay-backdrop';
        closeBtn.className = 'overlay-close';
        closeBtn.innerHTML = '×';
        
        expandedImg.src = img.src;
        overlay.appendChild(expandedImg);
        overlay.appendChild(closeBtn);
        
        document.body.appendChild(backdrop);
        document.body.appendChild(overlay);
        
        // Add active class after a small delay to trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            backdrop.classList.add('active');
        });
        
        // Close handlers
        const closeOverlay = () => {
            overlay.classList.remove('active');
            backdrop.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                backdrop.remove();
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeOverlay);
        backdrop.addEventListener('click', closeOverlay);
    });
});

// Add scroll detection for hero visibility
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const currentScroll = window.pageYOffset;

    if (currentScroll < lastScroll) {
        // Scrolling up
        header?.classList.add('visible');
        hero?.classList.add('visible');
    } else {
        // Scrolling down
        header?.classList.remove('visible');
        hero?.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// Add sound effects for buttons
document.addEventListener('DOMContentLoaded', function() {
    const hoverSound = document.getElementById('hoverSound');
    const clickSound = document.getElementById('clickSound');
    
    // Set base volumes
    hoverSound.volume = 0.1;
    clickSound.volume = 0.15;
    
    // Function to play sound with random pitch
    function playWithRandomPitch(audio) {
        if (!soundEnabled) return;
        
        // Create a new audio context each time
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audio.cloneNode());
        const pitchShift = audioCtx.createOscillator();
        
        // Randomize pitch slightly (between 0.95 and 1.05 of original)
        const pitch = 0.95 + Math.random() * 0.1;
        source.playbackRate.value = pitch;
        
        source.connect(audioCtx.destination);
        audio.currentTime = 0;
        audio.play();
        
        // Clean up
        setTimeout(() => audioCtx.close(), 1000);
    }
    
    // Add sound to all interactive elements
    const interactiveElements = document.querySelectorAll('.cta-button-landing, .contact-item, .phone-button, .theme-toggle, .nav-links a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            playWithRandomPitch(hoverSound);
        });
        
        element.addEventListener('click', () => {
            playWithRandomPitch(clickSound);
        });
    });
});

// Add sound toggle
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
}

// Only play sounds if enabled
function playSound(audio) {
    if (soundEnabled) {
        audio.currentTime = 0;
        audio.play();
    }
}

// Add intersection observer to handle active nav states
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section, .hero-landing');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-20% 0px -20% 0px' // Adds margin to when the observation triggers
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => observer.observe(section));
});