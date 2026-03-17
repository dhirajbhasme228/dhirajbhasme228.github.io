document.addEventListener('DOMContentLoaded', () => {

    /* ===== NAVBAR SCROLL ===== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ===== MOBILE NAV ===== */
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });

    /* ===== ACTIVE NAV HIGHLIGHT ===== */
    const sections = document.querySelectorAll('.section, .hero');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => {
        if (sec.id) observerNav.observe(sec);
    });

    /* ===== SCROLL REVEAL ===== */
    const reveals = document.querySelectorAll('.reveal');
    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observerReveal.observe(el));

    /* ===== COUNTER ANIMATION ===== */
    const counters = document.querySelectorAll('.stat-number');
    const observerCount = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const suffix = entry.target.dataset.suffix || '';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 40));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current + suffix;
                }, 30);
                observerCount.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observerCount.observe(c));

    /* ===== HERO PARTICLE NETWORK ===== */
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles, animId;
        const PARTICLE_COUNT = 55;
        const CONNECT_DIST = 140;
        const COLORS = [
            { r: 59, g: 130, b: 246 },   // blue
            { r: 6, g: 182, b: 212 },     // cyan
            { r: 139, g: 92, b: 246 },    // purple
        ];

        function resize() {
            const hero = canvas.parentElement;
            width = canvas.width = hero.offsetWidth;
            height = canvas.height = hero.offsetHeight;
        }

        function createParticle() {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                color: color,
                alpha: Math.random() * 0.5 + 0.3,
            };
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const opacity = (1 - dist / CONNECT_DIST) * 0.15;
                        const c = particles[i].color;
                        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (const p of particles) {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Clamp
                p.x = Math.max(0, Math.min(width, p.x));
                p.y = Math.max(0, Math.min(height, p.y));

                // Glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
                gradient.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha})`);
                gradient.addColorStop(1, `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core dot
                ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha + 0.2})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        init();
        draw();

        window.addEventListener('resize', () => {
            resize();
            // Reposition particles that fell outside
            for (const p of particles) {
                if (p.x > width) p.x = width - 10;
                if (p.y > height) p.y = height - 10;
            }
        });
    }

    /* ===== TILT EFFECT ON CARDS ===== */
    document.querySelectorAll('.ai-card, .skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
