// ===== Interactions JavaScript File =====

class InteractionManager {
    constructor() {
        this.magneticElements = [];
        this.cursor = null;
        this.isMagneticCursor = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }

    init() {
        this.setupMagneticCursor();
        this.setupTouchGestures();
        this.setupKeyboardNavigation();
        this.setupVoiceCommands();
        this.setupGestureRecognition();
        this.setupEyeTracking();
        this.setupHapticFeedback();
        this.setupAmbientInteractions();
        this.setupSocialInteractions();
        this.setupGamification();
    }

    setupMagneticCursor() {
        // Create custom cursor
        this.cursor = document.createElement('div');
        this.cursor.id = 'magnetic-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            transform: translate(-50%, -50%);
            display: none;
        `;
        document.body.appendChild(this.cursor);

        // Magnetic elements
        this.magneticElements = document.querySelectorAll('[data-magnetic]');
        
        document.addEventListener('mousemove', (e) => {
            if (this.isMagneticCursor) {
                this.updateCursorPosition(e);
                this.checkMagneticInteraction(e);
            }
        });

        // Enable magnetic cursor on non-touch devices
        if (!('ontouchstart' in window)) {
            this.enableMagneticCursor();
        }
    }

    enableMagneticCursor() {
        this.isMagneticCursor = true;
        this.cursor.style.display = 'block';
        document.body.classList.add('magnetic-cursor');
        
        // Add magnetic effect to elements
        this.magneticElements.forEach(element => {
            this.makeElementMagnetic(element);
        });
    }

    disableMagneticCursor() {
        this.isMagneticCursor = false;
        this.cursor.style.display = 'none';
        document.body.classList.remove('magnetic-cursor');
    }

    updateCursorPosition(e) {
        this.cursor.style.left = e.clientX + 'px';
        this.cursor.style.top = e.clientY + 'px';
    }

    checkMagneticInteraction(e) {
        this.magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
            );
            
            const magneticRadius = 100;
            
            if (distance < magneticRadius) {
                const force = (magneticRadius - distance) / magneticRadius;
                const attractionX = (centerX - e.clientX) * force * 0.5;
                const attractionY = (centerY - e.clientY) * force * 0.5;
                
                this.cursor.style.transform = `translate(-50%, -50%) translate(${attractionX}px, ${attractionY}px) scale(${1 + force * 0.5})`;
                element.style.transform = `translate(${attractionX * 0.2}px, ${attractionY * 0.2}px)`;
            } else {
                this.cursor.style.transform = 'translate(-50%, -50%)';
                element.style.transform = 'translate(0, 0)';
            }
        });
    }

    makeElementMagnetic(element) {
        element.addEventListener('mouseenter', () => {
            element.classList.add('magnetic-active');
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('magnetic-active');
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    setupTouchGestures() {
        if (!('ontouchstart' in window)) return;

        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipeGesture();
        }, { passive: true });

        // Touch-specific interactions
        document.querySelectorAll('.touch-interactive').forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', (e) => {
                element.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    handleSwipeGesture() {
        const deltaY = this.touchEndY - this.touchStartY;
        const deltaX = this.touchEndX - this.touchStartX;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    this.handleSwipeDown();
                } else {
                    this.handleSwipeUp();
                }
            }
        }
    }

    handleSwipeLeft() {
        console.log('Swipe left detected');
        // Navigate to next section or item
        const currentSection = this.getCurrentSection();
        const sections = document.querySelectorAll('section[id]');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleSwipeRight() {
        console.log('Swipe right detected');
        // Navigate to previous section or item
        const currentSection = this.getCurrentSection();
        const sections = document.querySelectorAll('section[id]');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        
        if (currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleSwipeUp() {
        console.log('Swipe up detected');
        // Scroll up or show navigation
        window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    }

    handleSwipeDown() {
        console.log('Swipe down detected');
        // Scroll down or hide navigation
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.handleKeyUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.handleKeyDown();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.handleKeyLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.handleKeyRight();
                    break;
                case 'Escape':
                    this.handleEscape();
                    break;
                case 'Tab':
                    this.handleTab(e);
                    break;
                case 'Enter':
                    this.handleEnter(e);
                    break;
                case ' ':
                    e.preventDefault();
                    this.handleSpace();
                    break;
            }
        });
    }

    handleKeyUp() {
        // Navigate up or previous item
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (currentIndex > 0) {
            focusableElements[currentIndex - 1].focus();
        }
    }

    handleKeyDown() {
        // Navigate down or next item
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
        }
    }

    handleKeyLeft() {
        // Navigate left or previous section
        this.handleSwipeRight();
    }

    handleKeyRight() {
        // Navigate right or next section
        this.handleSwipeLeft();
    }

    handleEscape() {
        // Close modals, menus, or go back
        const openModals = document.querySelectorAll('.modal.show');
        if (openModals.length > 0) {
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    }

    handleTab(e) {
        // Enhanced tab navigation
        if (e.shiftKey) {
            // Shift + Tab - previous element
            this.handleKeyUp();
        } else {
            // Tab - next element
            this.handleKeyDown();
        }
    }

    handleEnter(e) {
        // Activate current element
        if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'A') {
            document.activeElement.click();
        }
    }

    handleSpace() {
        // Play/pause or scroll
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length > 0) {
            videoElements.forEach(video => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }
    }

    setupVoiceCommands() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';
        
        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            this.processVoiceCommand(command);
        };
        
        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
        };
        
        // Start voice recognition
        try {
            recognition.start();
        } catch (error) {
            console.log('Voice recognition not available:', error);
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command:', command);
        
        if (command.includes('ir para') || command.includes('navegar para')) {
            const section = command.replace(/ir para |navegar para /, '');
            this.navigateToSection(section);
        } else if (command.includes('iniciar') || command.includes('começar')) {
            this.startCourse();
        } else if (command.includes('ajuda') || command.includes('help')) {
            this.showHelp();
        } else if (command.includes('contato') || command.includes('contatar')) {
            this.scrollToContact();
        }
    }

    navigateToSection(sectionName) {
        const sections = {
            'início': 'home',
            'home': 'home',
            'cursos': 'cursos',
            'videoaulas': 'videoaulas',
            'materiais': 'materiais',
            'contato': 'contato'
        };
        
        const sectionId = sections[sectionName];
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    startCourse() {
        const firstCourseButton = document.querySelector('.curso-card .btn-primary');
        if (firstCourseButton) {
            firstCourseButton.click();
        }
    }

    showHelp() {
        this.showToast('Comandos de voz disponíveis: "Ir para [seção]", "Iniciar", "Ajuda", "Contato"', 'info');
    }

    scrollToContact() {
        const contactSection = document.getElementById('contato');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupGestureRecognition() {
        // Simple gesture recognition using mouse movements
        let isMouseDown = false;
        let mousePath = [];
        
        document.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mousePath = [{ x: e.clientX, y: e.clientY, time: Date.now() }];
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                mousePath.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            isMouseDown = false;
            this.analyzeGesture(mousePath);
        });
    }

    analyzeGesture(path) {
        if (path.length < 5) return;
        
        const start = path[0];
        const end = path[path.length - 1];
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < 50) return; // Too small to be meaningful
        
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        if (angle > -45 && angle < 45) {
            console.log('Gesture: Right swipe');
            this.handleSwipeRight();
        } else if (angle > 135 || angle < -135) {
            console.log('Gesture: Left swipe');
            this.handleSwipeLeft();
        } else if (angle > 45 && angle < 135) {
            console.log('Gesture: Down swipe');
            this.handleSwipeDown();
        } else if (angle > -135 && angle < -45) {
            console.log('Gesture: Up swipe');
            this.handleSwipeUp();
        }
    }

    setupEyeTracking() {
        // Simple eye tracking simulation using webcam and face detection
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
        
        const video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
                this.startEyeTracking(video);
            })
            .catch(error => {
                console.log('Webcam access denied:', error);
            });
    }

    startEyeTracking(video) {
        // This is a simplified version - real eye tracking would require
        // more sophisticated computer vision libraries
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const trackEyes = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Simple face detection using canvas (placeholder)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                // Process imageData for face/eye detection
                // This would require a proper computer vision library
            }
            
            requestAnimationFrame(trackEyes);
        };
        
        trackEyes();
    }

    setupHapticFeedback() {
        if (!('vibrate' in navigator)) return;
        
        // Add haptic feedback to interactive elements
        document.querySelectorAll('.btn, .card-3d, .icon-3d').forEach(element => {
            element.addEventListener('touchstart', () => {
                navigator.vibrate(50); // Light vibration
            }, { passive: true });
            
            element.addEventListener('click', () => {
                navigator.vibrate(100); // Medium vibration
            });
        });
        
        // Strong vibration for important actions
        document.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', () => {
                navigator.vibrate([100, 50, 200]); // Pattern vibration
            });
        });
    }

    setupAmbientInteractions() {
        // Ambient sound effects
        this.ambientAudio = new Audio();
        this.ambientAudio.loop = true;
        this.ambientAudio.volume = 0.1;
        
        // Background ambient sounds (would need actual audio files)
        // this.ambientAudio.src = '/audio/ambient.mp3';
        
        // Ambient lighting based on time of day
        this.updateAmbientLighting();
        setInterval(() => this.updateAmbientLighting(), 60000); // Update every minute
        
        // Ambient particles based on user activity
        this.createAmbientParticles();
    }

    updateAmbientLighting() {
        const hour = new Date().getHours();
        let brightness = 1;
        let colorTemp = 'neutral';
        
        if (hour >= 6 && hour < 12) {
            brightness = 1.2; // Morning - bright
            colorTemp = 'cool';
        } else if (hour >= 12 && hour < 18) {
            brightness = 1.0; // Afternoon - normal
            colorTemp = 'neutral';
        } else if (hour >= 18 && hour < 22) {
            brightness = 0.8; // Evening - dim
            colorTemp = 'warm';
        } else {
            brightness = 0.6; // Night - dark
            colorTemp = 'warm';
        }
        
        document.documentElement.style.setProperty('--ambient-brightness', brightness);
        document.documentElement.style.setProperty('--ambient-color-temp', colorTemp);
    }

    createAmbientParticles() {
        // Create floating particles that react to user presence
        const particleContainer = document.createElement('div');
        particleContainer.className = 'ambient-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(particleContainer);
        
        // Create particles that float and react to mouse
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'ambient-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(56, 189, 248, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
            `;
            particleContainer.appendChild(particle);
        }
    }

    setupSocialInteractions() {
        // Social sharing buttons
        document.querySelectorAll('.social-share').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.getAttribute('data-platform');
                const url = window.location.href;
                const title = document.title;
                
                this.shareOnSocial(platform, url, title);
            });
        });
        
        // Social login buttons
        document.querySelectorAll('.social-login').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.getAttribute('data-provider');
                this.loginWithSocial(provider);
            });
        });
        
        // Community features
        this.setupCommunityChat();
        this.setupUserPresence();
    }

    shareOnSocial(platform, url, title) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
        };
        
        const shareUrl = shareUrls[platform];
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    loginWithSocial(provider) {
        // Simulate social login
        this.showToast(`Conectando com ${provider}...`, 'info');
        
        setTimeout(() => {
            this.showToast(`Conectado com ${provider} com sucesso!`, 'success');
        }, 2000);
    }

    setupCommunityChat() {
        // Create floating chat widget
        const chatWidget = document.createElement('div');
        chatWidget.className = 'community-chat';
        chatWidget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: var(--gradient-secondary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            transition: transform 0.3s ease;
            z-index: 1000;
        `;
        chatWidget.innerHTML = '<i class="fas fa-comments"></i>';
        
        chatWidget.addEventListener('click', () => {
            this.toggleCommunityChat();
        });
        
        document.body.appendChild(chatWidget);
    }

    toggleCommunityChat() {
        // Create or toggle chat interface
        const existingChat = document.querySelector('.chat-interface');
        
        if (existingChat) {
            existingChat.remove();
        } else {
            const chatInterface = document.createElement('div');
            chatInterface.className = 'chat-interface';
            chatInterface.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 300px;
                height: 400px;
                background: white;
                border-radius: 10px;
                box-shadow: var(--shadow-xl);
                display: flex;
                flex-direction: column;
                z-index: 999;
            `;
            
            chatInterface.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #eee;">
                    <h5 style="margin: 0;">Comunidade</h5>
                </div>
                <div style="flex: 1; padding: 15px; overflow-y: auto;">
                    <p style="color: #666; text-align: center;">Conectando à comunidade...</p>
                </div>
                <div style="padding: 15px; border-top: 1px solid #eee;">
                    <input type="text" placeholder="Digite sua mensagem..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            `;
            
            document.body.appendChild(chatInterface);
        }
    }

    setupUserPresence() {
        // Show online users count
        const onlineUsers = Math.floor(Math.random() * 50) + 10; // Simulate online users
        
        const presenceIndicator = document.createElement('div');
        presenceIndicator.className = 'user-presence';
        presenceIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
        `;
        presenceIndicator.innerHTML = `
            <i class="fas fa-circle" style="color: #28a745; margin-right: 5px;"></i>
            ${onlineUsers} usuários online
        `;
        
        document.body.appendChild(presenceIndicator);
        
        // Update online users periodically
        setInterval(() => {
            const change = Math.random() > 0.5 ? 1 : -1;
            const currentUsers = parseInt(presenceIndicator.textContent);
            const newUsers = Math.max(5, currentUsers + change);
            presenceIndicator.innerHTML = `
                <i class="fas fa-circle" style="color: #28a745; margin-right: 5px;"></i>
                ${newUsers} usuários online
            `;
        }, 30000); // Update every 30 seconds
    }

    setupGamification() {
        // Achievement system
        this.achievements = {
            firstVisit: { name: 'Primeira Visita', description: 'Bem-vindo ao nosso site!', icon: 'fas fa-star', unlocked: false },
            courseExplorer: { name: 'Explorador', description: 'Visualizou todos os cursos', icon: 'fas fa-compass', unlocked: false },
            videoWatcher: { name: 'Assíduo', description: 'Assistiu a 5 videoaulas', icon: 'fas fa-play-circle', unlocked: false },
            socialButterfly: { name: 'Social', description: 'Compartilhou conteúdo', icon: 'fas fa-share-alt', unlocked: false }
        };
        
        // Check achievements
        this.checkAchievements();
        
        // Progress tracking
        this.userProgress = {
            pagesVisited: new Set(),
            videosWatched: 0,
            socialShares: 0,
            timeSpent: 0
        };
        
        // Track user activity
        this.trackUserActivity();
    }

    checkAchievements() {
        // Check first visit
        if (!localStorage.getItem('hasVisited')) {
            localStorage.setItem('hasVisited', 'true');
            this.unlockAchievement('firstVisit');
        }
        
        // Check course explorer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.userProgress.pagesVisited.add(entry.target.id);
                    
                    if (this.userProgress.pagesVisited.size >= 4) {
                        this.unlockAchievement('courseExplorer');
                    }
                }
            });
        });
        
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            
            // Show achievement notification
            this.showAchievement(achievement);
            
            // Save to localStorage
            const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
            unlockedAchievements.push(achievementId);
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        }
    }

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 2000;
            animation: slideInDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <i class="${achievement.icon}" style="font-size: 24px; color: #ff6b35;"></i>
            <div>
                <strong>${achievement.name}</strong>
                <p style="margin: 0; font-size: 12px;">${achievement.description}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    trackUserActivity() {
        // Track time spent on page
        let startTime = Date.now();
        
        setInterval(() => {
            this.userProgress.timeSpent += 1;
            
            // Check for time-based achievements
            if (this.userProgress.timeSpent >= 300) { // 5 minutes
                // Could unlock a "dedicated learner" achievement
            }
        }, 1000);
        
        // Track video watching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.videoaula-play')) {
                this.userProgress.videosWatched++;
                
                if (this.userProgress.videosWatched >= 5) {
                    this.unlockAchievement('videoWatcher');
                }
            }
        });
        
        // Track social shares
        document.addEventListener('click', (e) => {
            if (e.target.closest('.social-share')) {
                this.userProgress.socialShares++;
                
                if (this.userProgress.socialShares >= 1) {
                    this.unlockAchievement('socialButterfly');
                }
            }
        });
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section;
            }
        });
        
        return currentSection;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: var(--shadow-md);
            z-index: 1000;
            animation: slideInUp 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractionManager();
});

// Export for use in other modules
window.InteractionManager = InteractionManager;