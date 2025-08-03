// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const demographicForm = document.getElementById('demographic-form');
const typingText = document.querySelector('.typing-text');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeForms();
    initializeTypingAnimation();
    initializeScrollEffects();
    initializeIntersectionObserver();
    initializeMobileMenu();
});

// Navigation functionality
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href').substring(1);
            navigateToPage(targetPage);
        });
    });
}

function navigateToPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
        
        // Trigger page-specific animations
        triggerPageAnimations(pageId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Page-specific animations
function triggerPageAnimations(pageId) {
    const page = document.getElementById(pageId);
    
    switch(pageId) {
        case 'welcome':
            animateWelcomePage(page);
            break;
        case 'launch':
            animateLaunchPage(page);
            break;
        case 'learn':
            animateLearnPage(page);
            break;
        case 'start':
            animateStartPage(page);
            break;
    }
}

function animateWelcomePage(page) {
    const elements = page.querySelectorAll('.login-container > *');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate dental icon floating
    const dentalIcon = page.querySelector('.dental-icon');
    if (dentalIcon) {
        setTimeout(() => {
            dentalIcon.style.animation = 'float 3s ease-in-out infinite';
        }, 800);
    }
}

function animateLaunchPage(page) {
    const heroText = page.querySelector('.hero-text');
    const heroImage = page.querySelector('.hero-image');
    
    // Animate hero text elements
    const textElements = heroText.querySelectorAll('h1, p, .hero-buttons');
    textElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }, index * 300);
    });
    
    // Animate hero image
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            heroImage.style.transition = 'all 1s ease-out';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 600);
    }
    
    // Add parallax effect to background
    const heroBackground = page.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

function animateLearnPage(page) {
    const header = page.querySelector('.learn-header');
    const featureCards = page.querySelectorAll('.feature-card');
    
    // Animate header
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            header.style.transition = 'all 0.8s ease-out';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Animate feature cards with bounce effect
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.3) translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 600 + (index * 200));
    });
}

function animateStartPage(page) {
    const formGroups = page.querySelectorAll('.form-group');
    
    // Animate form groups sliding in from right
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.6s ease-out';
            group.style.opacity = '1';
            group.style.transform = 'translateX(0)';
        }, index * 150);
    });
    
    // Animate submit button pulse
    const submitBtn = page.querySelector('.submit-btn');
    if (submitBtn) {
        setTimeout(() => {
            submitBtn.style.animation = 'pulse 2s ease-in-out infinite';
        }, formGroups.length * 150 + 500);
    }
}

// Form handling
function initializeForms() {
    // Tab switching for login/signup
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    // Demographic form submission
    if (demographicForm) {
        demographicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDemographicSubmission();
        });
    }
}

function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide forms
    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate login process
    showLoadingState('login-btn');
    
    setTimeout(() => {
        hideLoadingState('login-btn');
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            navigateToPage('launch');
        }, 1500);
    }, 2000);
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Simulate signup process
    showLoadingState('signup-btn');
    
    setTimeout(() => {
        hideLoadingState('signup-btn');
        showNotification('Account created successfully! Welcome to Redefynn!', 'success');
        
        setTimeout(() => {
            navigateToPage('launch');
        }, 1500);
    }, 2000);
}

function handleDemographicSubmission() {
    const formData = new FormData(demographicForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    showLoadingState('submit-btn');
    
    // Simulate form submission
    setTimeout(() => {
        hideLoadingState('submit-btn');
        showNotification('Application submitted successfully! We\'ll be in touch soon.', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            demographicForm.reset();
        }, 2000);
    }, 3000);
}

// Typing animation for the start page
function initializeTypingAnimation() {
    if (typingText) {
        const text = typingText.getAttribute('data-text');
        typingText.textContent = '';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                typingText.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // Add cursor blink effect
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                typingText.appendChild(cursor);
            }
        }, 50);
    }
}

// Scroll effects and parallax
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.01}deg)`;
        }
        
        // Navbar background opacity
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Intersection Observer for animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const icon = entry.target.querySelector('.feature-icon');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.animation = 'bounce 2s ease-in-out infinite';
                        }, 600);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.feature-card, .learn-header, .form-header');
    animateElements.forEach(el => observer.observe(el));
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Utility functions
function showLoadingState(buttonId) {
    const button = document.querySelector(`.${buttonId}`) || document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
        button.style.opacity = '0.7';
        const originalText = button.innerHTML;
        button.setAttribute('data-original-text', originalText);
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
}

function hideLoadingState(buttonId) {
    const button = document.querySelector(`.${buttonId}`) || document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
        button.style.opacity = '1';
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Add CSS for additional animations
const additionalStyles = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .animate-in {
        animation: slideUp 0.8s ease-out forwards;
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1rem 0;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize animations on page load
function initializeAnimations() {
    // Add initial animation classes
    const animatedElements = document.querySelectorAll('.login-container, .hero-content, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    // Trigger initial page animation
    setTimeout(() => {
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            triggerPageAnimations(activePage.id);
        }
    }, 100);
}

// Add smooth hover effects for buttons
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('cta-btn') || e.target.classList.contains('login-btn') || e.target.classList.contains('submit-btn')) {
        e.target.style.transform = 'translateY(-2px) scale(1.02)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('cta-btn') || e.target.classList.contains('login-btn') || e.target.classList.contains('submit-btn')) {
        e.target.style.transform = 'translateY(0) scale(1)';
    }
});

// Add particle effect for special interactions
function createParticleEffect(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #10b981;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let opacity = 1;
        let currentX = x;
        let currentY = y;
        
        const animate = () => {
            currentX += vx * 0.02;
            currentY += vy * 0.02;
            opacity -= 0.02;
            
            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Add particle effects to button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-btn') || e.target.classList.contains('login-btn')) {
        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createParticleEffect(x, y);
    }
});