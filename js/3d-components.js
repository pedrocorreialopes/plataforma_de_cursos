// ===== 3D Components JavaScript File =====

class ThreeJSManager {
    constructor() {
        this.scenes = new Map();
        this.renderers = new Map();
        this.cameras = new Map();
        this.meshes = new Map();
        this.particles = new Map();
        this.animations = new Map();
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        this.setupMouseTracking();
        this.setupResizeHandler();
        this.create3DComponents();
        this.startAnimationLoop();
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.scenes.forEach((scene, id) => {
                const camera = this.cameras.get(id);
                const renderer = this.renderers.get(id);
                
                if (camera && renderer) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            });
        });
    }

    create3DComponents() {
        // Create 3D logo animation
        this.create3DLogo();
        
        // Create particle systems
        this.createParticleSystem('hero-particles', {
            container: '.hero-section',
            count: 200,
            colors: [0x38bdf8, 0x1e3a8a, 0x60a5fa],
            size: 0.02,
            movement: 'floating'
        });

        // Create 3D shapes for cards
        this.createCard3DEffects();
        
        // Create floating elements
        this.createFloatingElements();
        
        // Create background 3D scene
        this.createBackground3D();
    }

    create3DLogo() {
        const container = document.querySelector('.logo-3d-container');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(120, 120);
        renderer.setClearColor(0x000000, 0);
        
        const canvas = renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        container.appendChild(canvas);

        // Create 3D logo geometry
        const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x38bdf8,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const logo = new THREE.Mesh(geometry, material);
        scene.add(logo);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 3;

        // Store references
        this.scenes.set('logo', scene);
        this.renderers.set('logo', renderer);
        this.cameras.set('logo', camera);
        this.meshes.set('logo', logo);
    }

    createParticleSystem(id, config) {
        const container = document.querySelector(config.container);
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create particles
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(config.count * 3);
        const colors = new Float32Array(config.count * 3);
        const sizes = new Float32Array(config.count);

        for (let i = 0; i < config.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const colorObj = new THREE.Color(color);
            colors[i * 3] = colorObj.r;
            colors[i * 3 + 1] = colorObj.g;
            colors[i * 3 + 2] = colorObj.b;

            sizes[i] = config.size * (1 + Math.random());
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: config.size,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 5;

        // Store references
        this.scenes.set(id, scene);
        this.renderers.set(id, renderer);
        this.cameras.set(id, camera);
        this.particles.set(id, { system: particleSystem, config });
    }

    createCard3DEffects() {
        document.querySelectorAll('.curso-card, .videoaula-card, .material-card').forEach((card, index) => {
            const sceneId = `card-${index}`;
            
            // Add 3D effect container
            const effectContainer = document.createElement('div');
            effectContainer.className = 'card-3d-effect';
            effectContainer.style.position = 'absolute';
            effectContainer.style.top = '0';
            effectContainer.style.left = '0';
            effectContainer.style.width = '100%';
            effectContainer.style.height = '100%';
            effectContainer.style.pointerEvents = 'none';
            effectContainer.style.zIndex = '1';
            
            card.style.position = 'relative';
            card.appendChild(effectContainer);

            // Create floating particles for card
            this.createFloatingParticles(sceneId, {
                container: effectContainer,
                count: 20,
                colors: [0x38bdf8, 0x1e3a8a],
                size: 0.01,
                movement: 'gentle'
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(sceneId, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateCardHover(sceneId, false);
            });
        });
    }

    createFloatingElements() {
        const container = document.querySelector('.floating-elements');
        if (!container) return;

        container.querySelectorAll('.floating-element').forEach((element, index) => {
            const sceneId = `floating-${index}`;
            
            // Create mini 3D scene for each floating element
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(60, 60);
            renderer.setClearColor(0x000000, 0);
            
            const canvas = renderer.domElement;
            canvas.style.position = 'absolute';
            canvas.style.top = '50%';
            canvas.style.left = '50%';
            canvas.style.transform = 'translate(-50%, -50%)';
            canvas.style.zIndex = '1';
            element.appendChild(canvas);

            // Create floating shape
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: [0x38bdf8, 0x1e3a8a, 0x60a5fa][index % 3],
                transparent: true,
                opacity: 0.7,
                shininess: 100
            });
            
            const shape = new THREE.Mesh(geometry, material);
            scene.add(shape);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0xffffff, 0.8);
            pointLight.position.set(2, 2, 2);
            scene.add(pointLight);

            camera.position.z = 2;

            // Store references
            this.scenes.set(sceneId, scene);
            this.renderers.set(sceneId, renderer);
            this.cameras.set(sceneId, camera);
            this.meshes.set(sceneId, shape);
        });
    }

    createBackground3D() {
        const container = document.querySelector('.hero-section');
        if (!container || typeof THREE === 'undefined') return;

        const sceneId = 'background';
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        const canvas = renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        container.appendChild(canvas);

        // Create background particles
        this.createParticleSystem('bg-particles', {
            container: '.hero-section',
            count: 300,
            colors: [0x1e3a8a, 0x2563eb, 0x38bdf8, 0x0ea5e9],
            size: 0.01,
            movement: 'floating'
        });

        // Create geometric shapes
        const shapes = [];
        for (let i = 0; i < 10; i++) {
            const geometries = [
                new THREE.BoxGeometry(0.5, 0.5, 0.5),
                new THREE.SphereGeometry(0.3, 16, 16),
                new THREE.ConeGeometry(0.3, 0.6, 8),
                new THREE.TorusGeometry(0.3, 0.1, 8, 16)
            ];
            
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhongMaterial({
                color: [0x1e3a8a, 0x2563eb, 0x38bdf8, 0x60a5fa][Math.floor(Math.random() * 4)],
                transparent: true,
                opacity: 0.6,
                shininess: 100
            });
            
            const shape = new THREE.Mesh(geometry, material);
            shape.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            shape.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            
            scene.add(shape);
            shapes.push(shape);
        }

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        camera.position.z = 10;

        // Store references
        this.scenes.set(sceneId, scene);
        this.renderers.set(sceneId, renderer);
        this.cameras.set(sceneId, camera);
        this.meshes.set(sceneId, shapes);
    }

    createFloatingParticles(id, config) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(100, 100);
        renderer.setClearColor(0x000000, 0);
        config.container.appendChild(renderer.domElement);

        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(config.count * 3);
        const colors = new Float32Array(config.count * 3);

        for (let i = 0; i < config.count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

            const color = new THREE.Color(config.colors[Math.floor(Math.random() * config.colors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: config.size,
            vertexColors: true,
            transparent: true,
            opacity: 0.7
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 3;

        this.scenes.set(id, scene);
        this.renderers.set(id, renderer);
        this.cameras.set(id, camera);
        this.particles.set(id, { system: particleSystem, config });
    }

    animateCardHover(sceneId, isHovering) {
        const particles = this.particles.get(sceneId);
        if (particles) {
            const particleSystem = particles.system;
            const currentScale = particleSystem.scale.x;
            const targetScale = isHovering ? 1.2 : 1;
            
            // Animate scale change
            const animateScale = () => {
                const newScale = currentScale + (targetScale - currentScale) * 0.1;
                particleSystem.scale.set(newScale, newScale, newScale);
                
                if (Math.abs(newScale - targetScale) > 0.01) {
                    requestAnimationFrame(animateScale);
                }
            };
            
            animateScale();
        }
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            const deltaTime = this.clock.getDelta();
            
            // Animate logo
            const logo = this.meshes.get('logo');
            if (logo) {
                logo.rotation.x += deltaTime * 0.5;
                logo.rotation.y += deltaTime * 0.3;
            }
            
            // Animate particles
            this.particles.forEach((particles, id) => {
                const particleSystem = particles.system;
                const config = particles.config;
                
                if (config.movement === 'floating') {
                    particleSystem.rotation.y += deltaTime * 0.2;
                    particleSystem.rotation.x += deltaTime * 0.1;
                } else if (config.movement === 'gentle') {
                    particleSystem.rotation.y += deltaTime * 0.1;
                }
                
                // Mouse interaction
                if (this.mouse.x !== 0 || this.mouse.y !== 0) {
                    particleSystem.rotation.x += this.mouse.y * deltaTime * 0.5;
                    particleSystem.rotation.y += this.mouse.x * deltaTime * 0.5;
                }
            });
            
            // Animate floating elements
            this.meshes.forEach((mesh, id) => {
                if (id.startsWith('floating-')) {
                    mesh.rotation.x += deltaTime * 0.3;
                    mesh.rotation.y += deltaTime * 0.2;
                    
                    // Floating motion
                    const time = this.clock.getElapsedTime();
                    mesh.position.y = Math.sin(time + parseInt(id.split('-')[1])) * 0.2;
                }
            });
            
            // Animate background shapes
            const backgroundShapes = this.meshes.get('background');
            if (backgroundShapes && Array.isArray(backgroundShapes)) {
                backgroundShapes.forEach((shape, index) => {
                    const time = this.clock.getElapsedTime();
                    shape.rotation.x += deltaTime * 0.2;
                    shape.rotation.y += deltaTime * 0.1;
                    shape.position.y = Math.sin(time + index) * 0.5;
                });
            }
            
            // Render all scenes
            this.renderers.forEach((renderer, id) => {
                const scene = this.scenes.get(id);
                const camera = this.cameras.get(id);
                
                if (scene && camera) {
                    renderer.render(scene, camera);
                }
            });
        };
        
        animate();
    }

    // Utility methods
    dispose() {
        // Clean up Three.js resources
        this.renderers.forEach(renderer => {
            renderer.dispose();
        });
        
        this.scenes.clear();
        this.renderers.clear();
        this.cameras.clear();
        this.meshes.clear();
        this.particles.clear();
        this.animations.clear();
    }
}

// Create 3D components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        window.threeJSManager = new ThreeJSManager();
    }
});

// Export for use in other modules
window.ThreeJSManager = ThreeJSManager;