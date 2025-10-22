document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 2000); // Show loading for 2 seconds
    });

    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#2563eb' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#2563eb', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }

    // Typing Animation
    const typingText = document.getElementById('typing-text');
    const texts = ['Software Engineer', 'Co-founder of Strive Go Tech', 'Brand Building Expert', 'Lead Generation Specialist', 'Business Automation Expert'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    // Start typing animation after a delay
    setTimeout(typeText, 2000);

    // Animated Counter for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    };

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Theme Toggle - DISABLED
    /*
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
    }
    */
    
    // Enhanced Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    // Add click animation and toggle functionality
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle classes
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navbar.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        
        // Add ripple effect
        createRippleEffect(e);
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            // Add staggered close animation based on screen size
            const isMobile = window.innerWidth <= 768;
            const delay = isMobile ? index * 50 : index * 100;
            
            setTimeout(() => {
                navbar.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }, delay);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Close menu if screen becomes large enough to show regular navigation
        if (window.innerWidth > 1024 && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Ripple effect function
    function createRippleEffect(e) {
        const ripple = document.createElement('span');
        const rect = menuToggle.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        menuToggle.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Active link highlighting
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Header shadow on scroll
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 500) {
            document.querySelector('.back-to-top').classList.add('active');
        } else {
            document.querySelector('.back-to-top').classList.remove('active');
        }
    });
    
    // Enhanced Contact Form Validation and AJAX Submission
    const contactForm = document.getElementById('form');
    const successMessage = document.getElementById('success-message');

    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });

        function validateField(e) {
            const field = e.target;
            const formGroup = field.closest('.form-group');
            const value = field.value.trim();

            // Remove previous states
            formGroup.classList.remove('error', 'success');

            if (field.hasAttribute('required') && !value) {
                showError(formGroup, 'This field is required');
                return false;
            }

            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError(formGroup, 'Please enter a valid email address');
                    return false;
                }
            }

            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showError(formGroup, 'Please enter a valid phone number');
                    return false;
                }
            }

            if (value) {
                formGroup.classList.add('success');
            }
            return true;
        }

        function showError(formGroup, message) {
            formGroup.classList.add('error');
            const errorMsg = formGroup.querySelector('.error-message');
            errorMsg.textContent = message;
        }

        function clearError(e) {
            const formGroup = e.target.closest('.form-group');
            formGroup.classList.remove('error');
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const formData = new FormData(this);
            let isValid = true;

            // Validate all fields
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });

            if (!isValid) {
                // Scroll to first error
                const firstError = this.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            try {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Send form data to FormSubmit AJAX endpoint
                const response = await fetch('https://formsubmit.co/ajax/solutionsnelson@gmail.com', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                // Show success message
                this.style.display = 'none';
                successMessage.classList.add('show');

                // Reset form after 5 seconds
                setTimeout(() => {
                    this.reset();
                    this.style.display = 'block';
                    successMessage.classList.remove('show');
                    inputs.forEach(input => {
                        input.closest('.form-group').classList.remove('success');
                    });
                }, 5000);

            } catch (error) {
                console.error('Error:', error);
                alert('Oops! Something went wrong. Please try again.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero section animation on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const observer = new window.IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        heroContent.classList.add('animate-zoom'); // or 'animate-slide' for slide-up
                    } else {
                        heroContent.classList.remove('animate-zoom');
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(heroContent);
    }

    // Scroll-triggered animation for all main sections
    const scrollAnimates = document.querySelectorAll('.scroll-animate');
    if (scrollAnimates.length > 0) {
        const sectionObserver = new window.IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    } else {
                        entry.target.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );
        scrollAnimates.forEach(section => sectionObserver.observe(section));
    }

    // Testimonials Slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonialItems.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length;
        showSlide(prev);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto-slide testimonials
    setInterval(nextSlide, 5000);

    // Animated Skill Bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Project Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    // Initialize: Hide all projects except web development
    function initializeProjects() {
        projectItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (category === 'web') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Initialize on page load
    initializeProjects();

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    // Show all projects when "All Projects" is selected
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else if (item.getAttribute('data-category') === filterValue) {
                    // Show only projects matching the selected category
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    // Hide all other projects
                    item.classList.add('hidden');
                }
            });
        });
    });

    // WhatsApp popup functionality - COMMENTED OUT
    /*
    const whatsappPopup = document.getElementById('whatsappPopup');
    
    // Show popup after 15 seconds
    setTimeout(() => {
        if (whatsappPopup) {
            whatsappPopup.classList.add('show');
        }
    }, 15000);
    
    // Close popup function
    window.closePopup = function() {
        if (whatsappPopup) {
            whatsappPopup.classList.remove('show');
        }
    };
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (whatsappPopup && !whatsappPopup.contains(e.target) && !e.target.closest('.whatsapp-chat')) {
            whatsappPopup.classList.remove('show');
        }
    });
    */
    
    // Update social media links with real URLs
    const githubLinks = document.querySelectorAll('a[href="https://github.com/"]');
    const linkedinLinks = document.querySelectorAll('a[href="https://linkedin.com/"]');
    const twitterLinks = document.querySelectorAll('a[href="https://twitter.com/"]');
    
    githubLinks.forEach(link => {
        link.href = 'https://github.com/nelsonfranklinwere';
    });
    
    linkedinLinks.forEach(link => {
        link.href = 'https://www.linkedin.com/in/nelson-w-a557272b4/';
    });
    
    twitterLinks.forEach(link => {
        link.href = 'https://www.facebook.com/profile.php?id=100089972558754';
    })
     facebookLinks.forEach(link => {
        link.href = 'https://www.facebook.com/profile.php?id=100089972558754';
    });
});