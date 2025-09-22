// Portfolio JavaScript - Elenyx

document.addEventListener('DOMContentLoaded', function() {
    // --- Runtime Status Display ---
    const startTime = Date.now();
    const runtimeDisplay = document.getElementById('runtime-display');
    
    function updateRuntime() {
        const currentTime = Date.now();
        const uptime = currentTime - startTime;
        
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (runtimeDisplay) {
            runtimeDisplay.textContent = formattedTime;
        }
    }
    
    // Update runtime every second
    updateRuntime(); // Initial call
    setInterval(updateRuntime, 1000);

    // --- GitHub Statistics Integration ---
    async function fetchGitHubStats() {
        try {
            const username = 'Elenyx';
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            
            if (!response.ok) {
                throw new Error('GitHub API request failed');
            }
            
            const repos = await response.json();
            
            // Calculate statistics from repository data
            const stats = calculateStats(repos);
            
            // Update the statistics in the DOM
            updateStatistics(stats);
            
        } catch (error) {
            console.warn('Failed to fetch GitHub stats, using fallback values:', error);
            // Use fallback static values if API fails
            const fallbackStats = {
                discordBots: 3,
                minecraftPlugins: 2,
                webApps: 5,
                techStack: 15,
                openSource: 100
            };
            updateStatistics(fallbackStats);
        }
    }
    
    function calculateStats(repos) {
        // Filter repositories by type based on language, topics, and names
        const discordBots = repos.filter(repo => 
            repo.language === 'TypeScript' || repo.language === 'JavaScript' || 
            (repo.topics && repo.topics.some(topic => 
                topic.includes('discord') || topic.includes('bot')
            )) ||
            repo.name.toLowerCase().includes('discord') ||
            repo.name.toLowerCase().includes('bot')
        ).length;
        
        const minecraftPlugins = repos.filter(repo => 
            repo.language === 'Java' || 
            (repo.topics && repo.topics.some(topic => 
                topic.includes('minecraft') || topic.includes('bukkit') || topic.includes('spigot')
            )) ||
            repo.name.toLowerCase().includes('minecraft') ||
            repo.name.toLowerCase().includes('plugin')
        ).length;
        
        const webApps = repos.filter(repo => 
            repo.language === 'HTML' || repo.language === 'CSS' || 
            repo.language === 'JavaScript' || repo.language === 'TypeScript' ||
            (repo.topics && repo.topics.some(topic => 
                topic.includes('web') || topic.includes('react') || topic.includes('frontend')
            )) ||
            repo.name.toLowerCase().includes('web') ||
            repo.name.toLowerCase().includes('app')
        ).length;
        
        // Count unique languages as tech stack
        const languages = new Set(repos.map(repo => repo.language).filter(lang => lang !== null));
        const techStack = languages.size;
        
        // Calculate open source percentage (all public repos are open source)
        const publicRepos = repos.filter(repo => !repo.private).length;
        const openSource = repos.length > 0 ? Math.round((publicRepos / repos.length) * 100) : 100;
        
        return {
            discordBots: Math.max(discordBots, 3), // Ensure minimum values based on known projects
            minecraftPlugins: Math.max(minecraftPlugins, 2),
            webApps: Math.max(webApps, 5),
            techStack: Math.max(techStack, 15),
            openSource: openSource
        };
    }
    
    function updateStatistics(stats) {
        // Update data-target attributes and trigger animations
        const statElements = {
            discordBots: document.querySelector('.stat-card:nth-child(1) .stat-number'),
            minecraftPlugins: document.querySelector('.stat-card:nth-child(2) .stat-number'),
            webApps: document.querySelector('.stat-card:nth-child(3) .stat-number'),
            techStack: document.querySelector('.stat-card:nth-child(4) .stat-number'),
            openSource: document.querySelector('.stat-card:nth-child(5) .stat-number')
        };
        
        // Update Discord Bots
        if (statElements.discordBots) {
            statElements.discordBots.setAttribute('data-target', stats.discordBots);
            statElements.discordBots.textContent = '0+';
        }
        
        // Update Minecraft Plugins
        if (statElements.minecraftPlugins) {
            statElements.minecraftPlugins.setAttribute('data-target', stats.minecraftPlugins);
            statElements.minecraftPlugins.textContent = '0+';
        }
        
        // Update Web Apps
        if (statElements.webApps) {
            statElements.webApps.setAttribute('data-target', stats.webApps);
            statElements.webApps.textContent = '0+';
        }
        
        // Update Tech Stack
        if (statElements.techStack) {
            statElements.techStack.setAttribute('data-target', stats.techStack);
            statElements.techStack.textContent = '0+';
        }
        
        // Update Open Source
        if (statElements.openSource) {
            statElements.openSource.setAttribute('data-target', stats.openSource);
            statElements.openSource.textContent = '0%';
        }
        
        console.log('GitHub Stats Updated:', stats);
    }
    
    // Fetch GitHub stats on page load
    fetchGitHubStats();

    // --- Fade-in Animation ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // --- Number Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const isPercent = counter.textContent.includes('%');
        animateCounter(counter, target, isPercent);
    });

    function animateCounter(el, target, isPercent = false) {
        let count = 0;
        const increment = target / 100;
        const frameDuration = 2000 / 100;

        const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                el.textContent = isPercent ? target + '%' : target + '+';
                clearInterval(counter);
            } else {
                el.textContent = isPercent ? Math.ceil(count) + '%' : Math.ceil(count) + '+';
            }
        }, frameDuration);
    }

    // --- Role Typing Animation ---
    const typingRole = document.getElementById('typing-role');
    if (typingRole) {
        const roles = ['Discord Bot Developer', 'Full-Stack Engineer', 'TypeScript Expert', 'Backend Architect', 'Open Source Contributor'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeRole() {
            const currentRole = roles[roleIndex];
            let typeSpeed = isDeleting ? 75 : 150;

            typingRole.textContent = currentRole.substring(0, charIndex);

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            if (!isDeleting && charIndex === currentRole.length + 1) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === -1) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(typeRole, typeSpeed);
        }
        setTimeout(typeRole, 500);
    }

    // --- Terminal Prompt Typing Animation ---
    const terminalPrompt = document.getElementById('terminal-prompt');
    if (terminalPrompt) {
        const promptText = '>_ Full-Stack Developer';
        let charIndex = 0;
        
        function typeTerminalPrompt() {
            if (charIndex < promptText.length) {
                terminalPrompt.textContent = promptText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeTerminalPrompt, 100); // Typing speed
            }
        }
        
        // Start typing immediately with a small delay
        setTimeout(typeTerminalPrompt, 300);
    }

    // --- Collaboration Text Typing Animation ---
    const collaborationText = document.getElementById('collaboration-text');
    if (collaborationText) {
        const fullText = "Interested in collaborating on a project, discussing tech, or just saying hello? I'd love to hear from you.";
        let charIndex = 0;
        
        function typeCollaborationText() {
            if (charIndex < fullText.length) {
                collaborationText.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeCollaborationText, 50); // Typing speed
            }
        }
        
        // Start typing animation when the contact section comes into view
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && charIndex === 0) {
                        setTimeout(typeCollaborationText, 800); // Delay before starting
                        contactObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            contactObserver.observe(contactSection);
        }
    }

    // --- Code Window Typing Animation ---
    const codeContainer = document.getElementById('code-animation-content');
    if (codeContainer) {
        const codeSnippets = [
            { language: 'javascript', code: `// Discord Bot Development\nconst bot = new Client({\n  intents: [GatewayIntentBits.Guilds]\n});\nbot.login(process.env.TOKEN);` },
            { language: 'java', code: `// Minecraft Plugin\n@EventHandler\npublic void onPlayerJoin(PlayerJoinEvent e) {\n  Player p = e.getPlayer();\n  p.sendMessage("Welcome!");\n}` },
            { language: 'javascript', code: `// Web Application\nconst [gameState, setGameState] = useState({\n  players: [],\n  galaxies: generateGalaxies(),\n  economy: initEconomy()\n});` },
            { language: 'sql', code: `/* Database Schema */\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  discord_id BIGINT UNIQUE,\n  credits INTEGER DEFAULT 0\n);` }
        ];

        let snippetIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeCode() {
            const currentSnippet = codeSnippets[snippetIndex];
            let typeSpeed = isDeleting ? 30 : 60;

            const displayedText = currentSnippet.code.substring(0, charIndex);
            
            codeContainer.innerHTML = `<pre><code class="language-${currentSnippet.language}"></code></pre>`;
            const codeElement = codeContainer.querySelector('code');
            codeElement.textContent = displayedText;

            hljs.highlightElement(codeElement);
            
            if (!isDeleting && charIndex === currentSnippet.code.length) {
                // Pause at the end, caret stops blinking
            } else {
                codeElement.innerHTML += '<span class="typing-caret"></span>';
            }

            if (!isDeleting && charIndex < currentSnippet.code.length) {
                charIndex++;
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
            } else if (!isDeleting && charIndex === currentSnippet.code.length) {
                setTimeout(() => { isDeleting = true; }, 2500); 
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                snippetIndex = (snippetIndex + 1) % codeSnippets.length;
            }
            
            setTimeout(typeCode, typeSpeed);
        }
        
        // Trigger code animation on scroll
        const codeWindow = document.querySelector('.code-window');
        if (codeWindow) {
            const codeObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !codeWindow.dataset.animated) {
                    typeCode();
                    codeWindow.dataset.animated = 'true';
                    codeObserver.unobserve(codeWindow);
                }
            }, { threshold: 0.6 });
            codeObserver.observe(codeWindow);
        }
    }

    // --- Fetch GitHub Stats ---
    async function fetchGitHubStats() {
        const projectCards = document.querySelectorAll('[data-repo]');
        
        for (const card of projectCards) {
            const repo = card.dataset.repo;
            if (!repo) continue;

            try {
                const response = await fetch(`https://api.github.com/repos/${repo}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const starsEl = card.querySelector('.stargazers-count');
                const forksEl = card.querySelector('.forks-count');

                if (starsEl) starsEl.textContent = data.stargazers_count;
                if (forksEl) forksEl.textContent = data.forks_count;

            } catch (error) {
                console.error(`Could not fetch GitHub stats for ${repo}:`, error);
            }
        }
    }

    fetchGitHubStats();

    // --- Navigation Functionality ---
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Active section highlighting and navbar background
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    function updateActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        // Update active nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Update navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveSection);
    
    // Initial call
    updateActiveSection();

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, and other developer shortcuts
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });
    // --- Interactive 3D Globe ---
    let globe = null;
    let scene, camera, renderer, points;
    let isGlobeInitialized = false;

    // Visitor data for major cities
    const visitorData = [
        { city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, visitors: 1247, online: 23 },
        { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, visitors: 892, online: 18 },
        { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, visitors: 1156, online: 31 },
        { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, visitors: 743, online: 15 },
        { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, visitors: 634, online: 12 },
        { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, visitors: 521, online: 9 },
        { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, visitors: 687, online: 14 },
        { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, visitors: 934, online: 22 },
        { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, visitors: 456, online: 8 },
        { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, visitors: 578, online: 11 },
        { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, visitors: 823, online: 19 },
        { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, visitors: 412, online: 7 },
        { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, visitors: 345, online: 6 },
        { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, visitors: 289, online: 5 },
        { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, visitors: 234, online: 4 }
    ];

    function initGlobe() {
        if (isGlobeInitialized) return;
        
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded!');
            return;
        }
        
        const globeContainer = document.getElementById('globe-container');
        if (!globeContainer) return;

        // 1. Scene Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
        camera.position.z = 3;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        globeContainer.appendChild(renderer.domElement);

        // 2. Globe Geometry and Material
        const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64);
        const globeMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444, // A dark grey color for the wireframe
            wireframe: true,
        });
        
        globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);

        // 3. Simulated Visitor Points
        const visitorLocations = [
            { lat: 40.7128, lon: -74.0060 }, // New York
            { lat: 34.0522, lon: -118.2437 }, // Los Angeles
            { lat: 51.5074, lon: -0.1278 },  // London
            { lat: 48.8566, lon: 2.3522 },   // Paris
            { lat: 35.6895, lon: 139.6917 }, // Tokyo
            { lat: -33.8688, lon: 151.2093 }, // Sydney
            { lat: 19.0760, lon: 72.8777 },  // Mumbai
            { lat: -23.5505, lon: -46.6333 }, // São Paulo
            { lat: 39.9042, lon: 116.4074 }, // Beijing
            { lat: 1.3521, lon: 103.8198 },  // Singapore
            { lat: 55.7558, lon: 37.6173 },   // Moscow
            { lat: 6.5244, lon: 3.3792 }     // Lagos
        ];

        const pointsMaterial = new THREE.PointsMaterial({
            color: 0x00ff00, // Bright green for the dots
            size: 0.03,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7,
        });

        const pointsGeometry = new THREE.BufferGeometry();
        const vertices = [];

        visitorLocations.forEach(loc => {
            const phi = (90 - loc.lat) * (Math.PI / 180);
            const theta = (loc.lon + 180) * (Math.PI / 180);
            const x = -(1.5 * Math.sin(phi) * Math.cos(theta));
            const y = 1.5 * Math.cos(phi);
            const z = 1.5 * Math.sin(phi) * Math.sin(theta);
            vertices.push(x, y, z);
        });
        
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        points = new THREE.Points(pointsGeometry, pointsMaterial);
        globe.add(points);

        // 4. Start Animation and Add Controls
        animateGlobe();
        
        globeContainer.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);
        
        // Update stats
        updateGlobalStats();
        
        isGlobeInitialized = true;
    }



    let isDragging = false, previousMousePosition = { x: 0, y: 0 };

    function animateGlobe() {
        if (!isGlobeInitialized) return;
        
        requestAnimationFrame(animateGlobe);
        
        // Auto-rotation when not dragging
        if (!isDragging) {
            globe.rotation.y += 0.0005;
        }

        // Blinking effect for the points
        const time = Date.now() * 0.005;
        if (points) {
            points.material.opacity = Math.sin(time * 0.7) * 0.4 + 0.6;
        }

        renderer.render(scene, camera);
    }

    // --- Mouse Interaction Functions ---
    function onMouseDown(event) {
        isDragging = true;
        const globeContainer = document.getElementById('globe-container');
        if (globeContainer) {
            globeContainer.style.cursor = 'grabbing';
        }
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        isDragging = false;
        const globeContainer = document.getElementById('globe-container');
        if (globeContainer) {
            globeContainer.style.cursor = 'grab';
        }
    }

    function onMouseMove(event) {
        if (!isDragging) return;
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        globe.rotation.y += deltaMove.x * 0.005;
        globe.rotation.x += deltaMove.y * 0.005;
        
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    function onWindowResize() {
        if (!renderer || !camera) return;
        
        const globeContainer = document.getElementById('globe-container');
        if (!globeContainer) return;
        
        camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    }



    function updateGlobalStats() {
        const totalVisitors = visitorData.reduce((sum, visitor) => sum + visitor.visitors, 0);
        const totalOnline = visitorData.reduce((sum, visitor) => sum + visitor.online, 0);
        const countries = new Set(visitorData.map(v => v.country)).size;
        const cities = visitorData.length;
        
        // Animate counters
        animateCounter('total-visitors', totalVisitors);
        animateCounter('active-countries', countries);
        animateCounter('active-cities', cities);
        animateCounter('online-now', totalOnline);
    }

    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let currentValue = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue).toLocaleString();
        }, 30);
    }

    // Initialize globe when section comes into view
    const globeSection = document.getElementById('global-reach');
    if (globeSection) {
        const globeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isGlobeInitialized) {
                    setTimeout(() => {
                        initGlobe();
                    }, 500);
                }
            });
        }, { threshold: 0.1 });
        
        globeObserver.observe(globeSection);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (isGlobeInitialized && renderer && camera) {
            const globeContainer = document.getElementById('globe-container');
            if (globeContainer) {
                camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
            }
        }
    });
});