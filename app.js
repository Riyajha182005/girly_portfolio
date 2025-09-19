// DOM elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navbarMenu = document.getElementById('navbarMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    setupIntersectionObserver();
    setupNavigation();
    setupContactForm();
    
    // Delay typewriter effect slightly
    setTimeout(typewriterEffect, 1000);
});

// Setup navigation functionality
function setupNavigation() {
    // Mobile menu functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // Setup smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight || 70;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup contact form functionality
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    
    // Clear any existing error states
    clearFormErrors();
    
    // Basic form validation
    let hasErrors = false;
    
    if (!name) {
        showFieldError('name', 'Name is required');
        hasErrors = true;
    }
    
    if (!email) {
        showFieldError('email', 'Email is required');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    if (!message) {
        showFieldError('message', 'Message is required');
        hasErrors = true;
    }
    
    if (hasErrors) {
        showNotification('Please fix the errors below and try again.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you for your message! I\'ll get back to you soon. 💕', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }, 2000);
}

// Show field-specific errors
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
    }
}

// Clear form errors
function clearFormErrors() {
    const errorFields = contactForm.querySelectorAll('.form-control.error');
    const errorMessages = contactForm.querySelectorAll('.field-error');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

// Function to scroll to a specific section (used by hero CTA)
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight || 70;
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navbarHeight = document.querySelector('.navbar').offsetHeight || 70;
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - navbarHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <span>&times;</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for notification if not already present
    if (!document.querySelector('#notification-styles')) {
        addNotificationStyles();
    }
    
    // Show notification with animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
}

// Add notification and form error styles
function addNotificationStyles() {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(10px);
            font-family: var(--font-family-base);
        }
        
        .notification--success {
            background: rgba(181, 234, 215, 0.95);
            border: 1px solid #B5EAD7;
            color: #065f46;
        }
        
        .notification--error {
            background: rgba(255, 179, 186, 0.95);
            border: 1px solid #FFB3BA;
            color: #991b1b;
        }
        
        .notification--info {
            background: rgba(230, 230, 250, 0.95);
            border: 1px solid #E6E6FA;
            color: #4c1d95;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
        }
        
        .notification-message {
            font-weight: 500;
            line-height: 1.4;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
            opacity: 0.7;
            flex-shrink: 0;
        }
        
        .notification-close:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.1);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .field-error {
            color: #991b1b;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
        }
        
        .form-control.error {
            border-color: #FFB3BA !important;
            box-shadow: 0 0 0 3px rgba(255, 179, 186, 0.2) !important;
        }
        
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .achievement-card, .timeline-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// Initialize fade-in class for elements
function initializeAnimations() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .achievement-card, .timeline-item');
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
}

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 179, 186, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
}

// Typing animation for hero subtitle
function typewriterEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid var(--color-soft-purple)';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            // Remove cursor after typing is complete
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }, 80);
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-animation when scrolling back up
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .achievement-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Event listeners for scroll events
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    animateOnScroll();
    updateNavbarBackground();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    }
});

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    
    // Add loader styles
    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FFF8DC 0%, #E6E6FA 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
            color: #DDA0DD;
            font-family: var(--font-family-base);
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(221, 160, 221, 0.3);
            border-top: 3px solid #DDA0DD;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .page-loader.fade-out {
            opacity: 0;
            pointer-events: none;
        }
    `;
    
    document.head.appendChild(loaderStyles);
    document.body.appendChild(loader);
    
    // Hide loader after content is loaded
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
                loaderStyles.remove();
            }
        }, 500);
    }, 1500);
});

// Export functions for global access
window.scrollToSection = scrollToSection;

// Add some fun interactions
let clickCount = 0;
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('profile-avatar')) {
        clickCount++;
        if (clickCount === 5) {
            showNotification('🎉 You found the secret! Thanks for clicking my avatar 5 times!', 'success');
            e.target.style.animation = 'bounce 1s ease';
            clickCount = 0;
            
            // Add bounce animation
            if (!document.querySelector('#bounce-animation')) {
                const bounceStyle = document.createElement('style');
                bounceStyle.id = 'bounce-animation';
                bounceStyle.textContent = `
                    @keyframes bounce {
                        0%, 20%, 60%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        80% { transform: translateY(-10px); }
                    }
                `;
                document.head.appendChild(bounceStyle);
            }
            
            setTimeout(() => {
                e.target.style.animation = '';
            }, 1000);
        }
    }
});