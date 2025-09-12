document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
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
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
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
    // Contact Form AJAX Submission with FormSubmit
const contactForm = document.getElementById('form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const formData = new FormData(this);

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Send form data to FormSubmit AJAX endpoint
            const response = await fetch('https://formsubmit.co/ajax/solutionsnelson@gmail.com', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            console.log(result); // Debug log
            alert('Message sent successfully!');

            this.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Oops! Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
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

    // WhatsApp popup functionality
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
    
    // Update social media links with real URLs
    const githubLinks = document.querySelectorAll('a[href="https://github.com/"]');
    const linkedinLinks = document.querySelectorAll('a[href="https://linkedin.com/"]');
    const twitterLinks = document.querySelectorAll('a[href="https://twitter.com/"]');
    
    githubLinks.forEach(link => {
        link.href = 'https://github.com/Nelsonfrank516';
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