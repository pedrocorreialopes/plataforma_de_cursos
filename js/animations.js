// ===== Animations JavaScript File =====

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.intersectionObserver = null;
        this.resizeObserver = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupClickAnimations();
        this.setupParallaxEffects();
        this.setupStaggerAnimations();
        this.setupCounterAnimations();
        this.setupProgressAnimations();
        this.setupRevealAnimations();
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    setupResizeObserver() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                this.handleResize(entry.target);
            });
        });

        // Observe responsive elements
        document.querySelectorAll('[data-responsive]').forEach(el => {
            this.resizeObserver.observe(el);
        });
    }

    setupScrollAnimations() {
        let ticking = false;
        let lastScrollY = 0;

        const updateScrollAnimations = () => {
            const currentScrollY = window.pageYOffset;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            const scrollProgress = currentScrollY / (document.documentElement.scrollHeight - window.innerHeight);

            // Update parallax elements
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
                const direction = el.getAttribute('data-parallax-direction') || 'vertical';
                
                if (direction === 'vertical') {
                    const y = currentScrollY * speed;
                    el.style.transform = `translateY(${y}px)`;
                } else if (direction === 'horizontal') {
                    const x = currentScrollY * speed;
                    el.style.transform = `translateX(${x}px)`;
                }
            });

            // Update scroll progress indicators
            document.querySelectorAll('.scroll-progress').forEach(el => {
                el.style.width = `${scrollProgress * 100}%`;
            });

            // Trigger scroll-based animations
            document.querySelectorAll('[data-scroll-animate]').forEach(el => {
                const triggerPoint = el.getAttribute('data-scroll-trigger') || 'enter';
                const elementTop = el.getBoundingClientRect().top;
                const elementBottom = el.getBoundingClientRect().bottom;
                const isInView = elementTop < window.innerHeight && elementBottom > 0;

                if (isInView) {
                    if (triggerPoint === 'enter' && elementTop < window.innerHeight * 0.75) {
                        el.classList.add('animate-fadeInUp');
                    } else if (triggerPoint === 'center' && elementTop < window.innerHeight * 0.5) {
                        el.classList.add('animate-fadeInUp');
                    }
                }
            });

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        window.addEventListener('resize', requestScrollUpdate, { passive: true });
    }

    setupHoverAnimations() {
        // 3D card hover effects
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCard3D(card, e);
            });

            card.addEventListener('mousemove', (e) => {
                this.updateCard3D(card, e);
            });

            card.addEventListener('mouseleave', (e) => {
                this.resetCard3D(card);
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn-3d').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('animate-pulse');
            });

            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('animate-pulse');
            });
        });

        // Icon hover effects
        document.querySelectorAll('.icon-3d').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.classList.add('animate-bounce');
            });

            icon.addEventListener('mouseleave', () => {
                icon.classList.remove('animate-bounce');
            });
        });
    }

    setupClickAnimations() {
        // Ripple effect for buttons
        document.querySelectorAll('.btn-ripple').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRipple(e, btn);
            });
        });

        // Confetti effect
        document.querySelectorAll('[data-confetti]').forEach(el => {
            el.addEventListener('click', () => {
                this.createConfetti(el);
            });
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
            const direction = el.getAttribute('data-parallax-direction') || 'vertical';
            
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform';
        });
    }

    setupStaggerAnimations() {
        document.querySelectorAll('.stagger-container').forEach(container => {
            const children = container.children;
            const delay = parseInt(container.getAttribute('data-stagger-delay')) || 100;
            const animation = container.getAttribute('data-stagger-animation') || 'fadeInUp';
            
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * delay}ms`;
                child.classList.add(`animate-${animation}`);
            });
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter-animate');
        
        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar-animate');
        
        progressBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateProgressBar(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }

    setupRevealAnimations() {
        document.querySelectorAll('.reveal-animate').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(el);
        });
    }

    // Animation methods
    triggerAnimation(element) {
        const animationType = element.getAttribute('data-animate') || 'fadeInUp';
        const delay = parseInt(element.getAttribute('data-animate-delay')) || 0;
        const duration = parseInt(element.getAttribute('data-animate-duration')) || 800;
        
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
            element.style.animationDuration = `${duration}ms`;
        }, delay);
    }

    animateCard3D(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rotateX', `${rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }

    updateCard3D(card, event) {
        this.animateCard3D(card, event);
    }

    resetCard3D(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
            
            element.textContent = `${prefix}${currentValue}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateProgressBar(element) {
        const targetWidth = element.getAttribute('data-width') || '100%';
        const duration = parseInt(element.getAttribute('data-duration')) || 1000;
        
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.width = targetWidth;
        }, 100);
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createConfetti(element) {
        const colors = ['#1e3a8a', '#2563eb', '#38bdf8', '#0ea5e9', '#60a5fa'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    handleResize(element) {
        // Handle responsive animations
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Simplify animations on mobile
            element.classList.add('mobile-optimized');
        } else {
            element.classList.remove('mobile-optimized');
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Easing functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

// Export for use in other modules
window.AnimationManager = AnimationManager;