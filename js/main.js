// ===== Main JavaScript File =====

class CourseWebsite {
    constructor() {
        this.isLoading = true;
        this.loadingProgress = 0;
        this.particles = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupCounterAnimations();
        this.setupContactForm();
        this.setupVideoModal();
        this.loadCourseData();
        this.loadVideoData();
        
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }

        // Initialize GLightbox
        if (typeof GLightbox !== 'undefined') {
            this.lightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true
            });
        }
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        const loadingMessages = [
            'Carregando experiência 3D...',
            'Preparando animações...',
            'Carregando conteúdo...',
            'Quase pronto...'
        ];

        let messageIndex = 0;
        
        // Simulate loading progress
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    this.isLoading = false;
                    this.setupThreeJS();
                }, 500);
            }
            
            loadingProgress.style.width = `${this.loadingProgress}%`;
            
            // Update loading message
            if (this.loadingProgress > 25 && messageIndex < loadingMessages.length - 1) {
                messageIndex++;
                loadingText.textContent = loadingMessages[messageIndex];
            }
        }, 200);

        // Create particles for loading screen
        this.createLoadingParticles();
    }

    createLoadingParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.animationDuration = `${2 + Math.random() * 2}s`;
            container.appendChild(particle);
        }
    }

    setupThreeJS() {
        if (typeof THREE === 'undefined') return;

        const container = document.getElementById('three-container');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Create particles
        this.createThreeParticles();
        
        // Position camera
        this.camera.position.z = 5;

        // Start animation loop
        this.animateThreeJS();

        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse interaction
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    createThreeParticles() {
        if (!this.scene) return;

        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            colors[i * 3] = Math.random();
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);

        this.particles = particleSystem;
    }

    animateThreeJS() {
        if (!this.renderer || !this.scene || !this.camera) return;

        requestAnimationFrame(() => this.animateThreeJS());

        // Rotate particles based on mouse position
        if (this.particles) {
            this.particles.rotation.x += 0.001 + this.mouse.y * 0.01;
            this.particles.rotation.y += 0.001 + this.mouse.x * 0.01;
        }

        this.renderer.render(this.scene, this.camera);
    }

    setupNavigation() {
        const navbar = document.getElementById('main-navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Add scroll effect to navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
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
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (heroSection) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });

        // Fade in elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.curso-card, .videoaula-card, .material-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        // Use Intersection Observer to trigger animations
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                this.showToast('Mensagem enviada com sucesso!', 'success');
                contactForm.reset();
                
            } catch (error) {
                this.showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    setupVideoModal() {
        const videoLinks = document.querySelectorAll('.videoaula-play');
        
        videoLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = link.getAttribute('data-video');
                const videoTitle = link.getAttribute('data-title');
                
                this.openVideoModal(videoUrl, videoTitle);
            });
        });
    }

    openVideoModal(videoUrl, title) {
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="videoModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="ratio ratio-16x9">
                                <iframe src="${videoUrl}" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('videoModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('videoModal'));
        modal.show();
        
        // Clean up when modal is hidden
        document.getElementById('videoModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }

    showToast(message, type = 'info') {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toast = new bootstrap.Toast(toastContainer.lastElementChild);
        toast.show();
        
        // Remove toast element after it's hidden
        toastContainer.lastElementChild.addEventListener('hidden.bs.toast', function () {
            this.remove();
        });
    }

    async loadCourseData() {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const courses = [
                {
                    id: 1,
                    title: 'Informática Básica',
                    description: 'Aprenda os fundamentos da informática com uma abordagem moderna e interativa.',
                    icon: 'fas fa-computer',
                    features: ['Windows 10/11', 'Office 365', 'Internet', 'Segurança Digital'],
                    duration: '40 horas',
                    level: 'Iniciante'
                },
                {
                    id: 2,
                    title: 'Microsoft Word',
                    description: 'Domine o processador de textos mais utilizado no mundo corporativo.',
                    icon: 'fas fa-file-word',
                    features: ['Formatação avançada', 'Tabelas e gráficos', 'Mail merge', 'Templates'],
                    duration: '30 horas',
                    level: 'Básico/Intermediário'
                },
                {
                    id: 3,
                    title: 'Microsoft Excel',
                    description: 'Torne-se um expert em planilhas e análise de dados.',
                    icon: 'fas fa-file-excel',
                    features: ['Fórmulas avançadas', 'Gráficos dinâmicos', 'Tabelas pivot', 'Macros'],
                    duration: '45 horas',
                    level: 'Básico/Intermediário'
                },
                {
                    id: 4,
                    title: 'Microsoft PowerPoint',
                    description: 'Crie apresentações profissionais e impactantes.',
                    icon: 'fas fa-file-powerpoint',
                    features: ['Animações avançadas', 'Design profissional', 'Multimídia', 'Templates'],
                    duration: '25 horas',
                    level: 'Básico/Intermediário'
                },
                {
                    id: 5,
                    title: 'Internet e Navegação',
                    description: 'Navegue com segurança e aproveite todo o potencial da internet.',
                    icon: 'fas fa-globe',
                    features: ['Navegadores', 'Segurança online', 'Redes sociais', 'Cloud computing'],
                    duration: '20 horas',
                    level: 'Iniciante'
                },
                {
                    id: 6,
                    title: 'Windows Avançado',
                    description: 'Aprofunde seus conhecimentos no sistema operacional Windows.',
                    icon: 'fab fa-windows',
                    features: ['Administração', 'Segurança', 'Performance', 'Solução de problemas'],
                    duration: '35 horas',
                    level: 'Intermediário'
                }
            ];
            
            this.renderCourses(courses);
            
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
            this.showToast('Erro ao carregar cursos.', 'error');
        }
    }

    renderCourses(courses) {
        const container = document.getElementById('cursos-container');
        if (!container) return;
        
        container.innerHTML = courses.map(course => `
            <div class="col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${course.id * 100}">
                <div class="curso-card card-3d">
                    <div class="curso-icon icon-3d">
                        <i class="${course.icon}"></i>
                    </div>
                    <h4 class="curso-title">${course.title}</h4>
                    <p class="curso-description">${course.description}</p>
                    <ul class="curso-features">
                        ${course.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="curso-meta d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary">${course.level}</span>
                        <small class="text-muted">${course.duration}</small>
                    </div>
                    <div class="mt-3">
                        <a href="#contato" class="btn btn-primary w-100">
                            <i class="fas fa-play"></i> Começar Agora
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadVideoData() {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const videos = [
                {
                    id: 1,
                    title: 'Introdução à Informática',
                    description: 'Conheça os fundamentos da computação moderna.',
                    thumbnail: 'https://via.placeholder.com/400x225/1e3a8a/ffffff?text=Informática+Básica',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '15:30',
                    views: '1.2k'
                },
                {
                    id: 2,
                    title: 'Windows 11 - Primeiros Passos',
                    description: 'Aprenda a navegar pelo novo Windows 11.',
                    thumbnail: 'https://via.placeholder.com/400x225/2563eb/ffffff?text=Windows+11',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '12:45',
                    views: '890'
                },
                {
                    id: 3,
                    title: 'Word - Formatação Avançada',
                    description: 'Domine as técnicas de formatação profissional.',
                    thumbnail: 'https://via.placeholder.com/400x225/38bdf8/ffffff?text=Word+Avançado',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '20:15',
                    views: '2.1k'
                },
                {
                    id: 4,
                    title: 'Excel - Fórmulas Essenciais',
                    description: 'As fórmulas mais importantes do Excel.',
                    thumbnail: 'https://via.placeholder.com/400x225/0ea5e9/ffffff?text=Excel+Fórmulas',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '18:20',
                    views: '1.8k'
                },
                {
                    id: 5,
                    title: 'PowerPoint - Design Profissional',
                    description: 'Crie apresentações com design impactante.',
                    thumbnail: 'https://via.placeholder.com/400x225/60a5fa/ffffff?text=PowerPoint+Design',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '25:10',
                    views: '950'
                },
                {
                    id: 6,
                    title: 'Internet - Segurança Digital',
                    description: 'Proteja-se online com dicas de segurança.',
                    thumbnail: 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Segurança+Digital',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '22:40',
                    views: '1.5k'
                }
            ];
            
            this.renderVideos(videos);
            
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
            this.showToast('Erro ao carregar vídeos.', 'error');
        }
    }

    renderVideos(videos) {
        const container = document.getElementById('videoaulas-container');
        if (!container) return;
        
        container.innerHTML = videos.map(video => `
            <div class="col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${video.id * 100}">
                <div class="videoaula-card">
                    <div class="videoaula-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                        <a href="#" class="videoaula-play" data-video="${video.videoUrl}" data-title="${video.title}">
                            <i class="fas fa-play"></i>
                        </a>
                    </div>
                    <div class="videoaula-content">
                        <h5 class="videoaula-title">${video.title}</h5>
                        <p class="videoaula-description">${video.description}</p>
                        <div class="videoaula-meta">
                            <span><i class="fas fa-clock"></i> ${video.duration}</span>
                            <span><i class="fas fa-eye"></i> ${video.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-setup video modal after rendering
        this.setupVideoModal();
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseWebsite();
});

// Handle page visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('animation-cleanup');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('animation-cleanup');
    }
});

// Handle offline/online events
window.addEventListener('online', () => {
    console.log('Conexão restaurada');
});

window.addEventListener('offline', () => {
    console.log('Conexão perdida');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('SW registro falhou:', error);
            });
    });
}

// Export for use in other modules
window.CourseWebsite = CourseWebsite;