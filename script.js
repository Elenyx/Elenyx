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
});