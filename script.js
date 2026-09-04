document.addEventListener('DOMContentLoaded', () => {

    /* --- Set Year in Footer --- */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* --- Mobile Navigation Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on link click (excluding dropdown toggle itself)
        const navLinks = document.querySelectorAll('.nav-link:not(#dropdown-toggle-btn), .dropdown-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                if (bars && bars.length === 3) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });
        });

        // Dropdown Component Logic
        const dropdownToggle = document.getElementById('dropdown-toggle-btn');
        const dropdownMenu = document.getElementById('more-dropdown');

        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });

            // Close on ESC mapping
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    dropdownMenu.classList.remove('active');
                }
            });

            // Close inner dropdown purely when an inner link is clicked
            const dropLinks = dropdownMenu.querySelectorAll('.dropdown-link');
            dropLinks.forEach(link => {
                link.addEventListener('click', () => {
                    dropdownMenu.classList.remove('active');
                });
            });
        }
    }

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('element-visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach(el => observer.observe(el));


    /* --- Interactive Canvas Background (Biological Nodes) --- */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 70; // Adjust for density
        const connectionDistance = 150;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = 1 - (dist / connectionDistance);
                        ctx.strokeStyle = `rgba(0, 177, 167, ${opacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        // Initialize
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animate();
    }

    /* --- Accordion Logic --- */
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                // Toggle state logic
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                } else {
                    accordionItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
        // Open the first panel by default for discovery
        accordionItems[0].classList.add('active');
    }

    /* --- Tech Section Advanced Particle Network --- */
    const techCanvas = document.getElementById('tech-canvas');
    if (techCanvas) {
        const techCtx = techCanvas.getContext('2d');
        let tWidth, tHeight;
        let tParticles = [];

        const techSection = document.getElementById('technology-platform');

        // Mouse for subtle parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            const rect = techSection.getBoundingClientRect();
            // Only update if mouse is relatively near/inside section to save math
            if (e.clientY > rect.top - 500 && e.clientY < rect.bottom + 500) {
                mouseX = (e.clientX - rect.left - (rect.width / 2)) * 0.05;
                mouseY = (e.clientY - rect.top - (rect.height / 2)) * 0.05;
            }
        });

        function resizeTechCanvas() {
            tWidth = techCanvas.width = techSection.offsetWidth;
            tHeight = techCanvas.height = techSection.offsetHeight;
        }

        class TechParticle {
            constructor() {
                this.x = Math.random() * tWidth;
                this.y = Math.random() * tHeight;
                this.z = Math.random() * 2 + 0.5; // depth
                this.vx = (Math.random() - 0.5) * 0.15; // smooth slow movement
                this.vy = (Math.random() - 0.5) * 0.15;
                this.radius = this.z * 0.6;
                this.baseAlpha = Math.random() * 0.4 + 0.1;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
                this.pulseVal = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < -50 || this.x > tWidth + 50) this.vx *= -1;
                if (this.y < -50 || this.y > tHeight + 50) this.vy *= -1;

                this.pulseVal += this.pulseSpeed;
            }

            draw(offsetX, offsetY) {
                techCtx.beginPath();
                // Apply subtle depth parallax depending on z-index
                const px = this.x + (offsetX * this.z);
                const py = this.y + (offsetY * this.z);

                techCtx.arc(px, py, this.radius, 0, Math.PI * 2);
                const currentAlpha = this.baseAlpha + Math.sin(this.pulseVal) * 0.2;
                techCtx.fillStyle = `rgba(0, 240, 255, ${Math.max(0.05, currentAlpha)})`;
                techCtx.fill();
            }
        }

        function initTechParticles() {
            tParticles = [];
            const density = Math.min(Math.floor((tWidth * tHeight) / 10000), 120); // controlled max count
            for (let i = 0; i < density; i++) {
                tParticles.push(new TechParticle());
            }
        }

        function animateTechCanvas() {
            techCtx.clearRect(0, 0, tWidth, tHeight);

            // LERP mouse for smooth parallax
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            for (let i = 0; i < tParticles.length; i++) {
                tParticles[i].update();
                tParticles[i].draw(targetX, targetY);

                for (let j = i + 1; j < tParticles.length; j++) {
                    const pi = tParticles[i];
                    const pj = tParticles[j];

                    const pxi = pi.x + (targetX * pi.z);
                    const pyi = pi.y + (targetY * pi.z);
                    const pxj = pj.x + (targetX * pj.z);
                    const pyj = pj.y + (targetY * pj.z);

                    const dx = pxi - pxj;
                    const dy = pyi - pyj;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 12000) {
                        const opacity = 1 - (distSq / 12000);
                        techCtx.beginPath();
                        techCtx.moveTo(pxi, pyi);
                        techCtx.lineTo(pxj, pyj);
                        techCtx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.25})`;
                        techCtx.lineWidth = 0.5;
                        techCtx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateTechCanvas);
        }

        window.addEventListener('resize', () => {
            resizeTechCanvas();
            initTechParticles();
        });

        resizeTechCanvas();
        initTechParticles();
        animateTechCanvas();
    }

    /* --- Leadership Section Canvas --- */
    const leadCanvas = document.getElementById('leadership-canvas');
    if (leadCanvas) {
        const leadCtx = leadCanvas.getContext('2d');
        let lWidth, lHeight, lParticles = [];

        function resizeLead() {
            const section = leadCanvas.closest('.leadership-section');
            lWidth = leadCanvas.width = section ? section.offsetWidth : window.innerWidth;
            lHeight = leadCanvas.height = section ? section.offsetHeight : window.innerHeight;
        }

        class LeadParticle {
            constructor() {
                this.x = Math.random() * lWidth;
                this.y = Math.random() * lHeight;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
                this.baseAlpha = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > lWidth) this.vx *= -1;
                if (this.y < 0 || this.y > lHeight) this.vy *= -1;
            }
            draw() {
                leadCtx.beginPath();
                leadCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                leadCtx.fillStyle = `rgba(0, 240, 255, ${this.baseAlpha})`;
                leadCtx.fill();
                leadCtx.shadowBlur = 10;
                leadCtx.shadowColor = 'rgba(0, 240, 255, 0.5)';
            }
        }

        function initLead() {
            lParticles = [];
            const count = Math.floor((lWidth * lHeight) / 25000);
            for (let i = 0; i < (count > 120 ? 120 : count); i++) {
                lParticles.push(new LeadParticle());
            }
        }

        function animateLead() {
            leadCtx.clearRect(0, 0, lWidth, lHeight);
            for (let i = 0; i < lParticles.length; i++) {
                lParticles[i].update();
                for (let j = i + 1; j < lParticles.length; j++) {
                    const dx = lParticles[i].x - lParticles[j].x;
                    const dy = lParticles[i].y - lParticles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        leadCtx.beginPath();
                        leadCtx.moveTo(lParticles[i].x, lParticles[i].y);
                        leadCtx.lineTo(lParticles[j].x, lParticles[j].y);
                        const opacity = 1 - (dist / 150);
                        leadCtx.strokeStyle = `rgba(0, 168, 150, ${opacity * 0.3})`;
                        leadCtx.lineWidth = opacity * 1.5;
                        leadCtx.stroke();
                    }
                }
                lParticles[i].draw();
            }
            requestAnimationFrame(animateLead);
        }

        window.addEventListener('resize', () => {
            resizeLead();
            initLead();
        });

        resizeLead();
        initLead();
        animateLead();
    }

    /* --- Core Expertise Modal Logic --- */
    const expertiseItems = document.querySelectorAll('.tag-glow');
    const expertiseModal = document.getElementById('expertise-modal');

    if (expertiseItems.length > 0 && expertiseModal) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const closeBtn = document.querySelector('.modal-close-btn');

        // Open Modal mapping data bounds dynamically
        expertiseItems.forEach(item => {
            item.addEventListener('click', () => {
                modalTitle.textContent = item.getAttribute('data-title');
                modalDesc.textContent = item.getAttribute('data-desc');
                expertiseModal.classList.add('active');
            });
        });

        // Close Modal via button click
        closeBtn.addEventListener('click', () => {
            expertiseModal.classList.remove('active');
        });

        // Close Modal via click outside
        expertiseModal.addEventListener('click', (e) => {
            if (e.target === expertiseModal) {
                expertiseModal.classList.remove('active');
            }
        });

        // Close Modal via Escape key mapping
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && expertiseModal.classList.contains('active')) {
                expertiseModal.classList.remove('active');
            }
        });
    }
});
