document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // COMPREHENSIVE ANALYTICS TRACKING SYSTEM
    // ===========================================
    
    // Analytics Configuration
    const analyticsConfig = {
        // Replace with your actual Google Analytics 4 Measurement ID
        ga4MeasurementId: 'G-XXXXXXXXXX', // Update this with your GA4 ID
        debug: true,
        trackScrollDepth: true,
        trackClicks: true,
        trackTimeOnPage: true,
        trackExitIntent: true,
        trackFormInteractions: true,
        trackSocialClicks: true,
        trackDownloads: true,
        trackOutboundLinks: true,
        trackVideoEngagement: true,
        trackHeatmap: true
    };
    
    // Analytics Data Storage
    let analyticsData = {
        pageLoadTime: Date.now(),
        scrollDepth: 0,
        maxScrollDepth: 0,
        scrollEvents: 0,
        clickEvents: 0,
        timeOnPage: 0,
        sectionsViewed: new Set(),
        exitIntentTriggered: false,
        userInteractions: [],
        sessionId: generateSessionId(),
        isReturningUser: checkReturningUser(),
        userRetention: {
            firstVisit: Date.now(),
            visitCount: getVisitCount(),
            lastVisit: getLastVisit(),
            sessionDuration: 0,
            pagesViewed: 1,
            engagementScore: 0
        }
    };
    
    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Check if user is returning
    function checkReturningUser() {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (!lastVisit) {
            localStorage.setItem('firstVisit', now);
            return false;
        }
        
        return (now - parseInt(lastVisit)) < oneDay;
    }
    
    // Get visit count
    function getVisitCount() {
        const count = localStorage.getItem('visitCount') || 0;
        const newCount = parseInt(count) + 1;
        localStorage.setItem('visitCount', newCount);
        return newCount;
    }
    
    // Get last visit time
    function getLastVisit() {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();
        localStorage.setItem('lastVisit', now);
        return lastVisit ? parseInt(lastVisit) : null;
    }
    
    // Initialize Google Analytics 4
    function initializeGA4() {
        if (analyticsConfig.ga4MeasurementId && analyticsConfig.ga4MeasurementId !== 'G-XXXXXXXXXX') {
            // Load Google Analytics 4
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4MeasurementId}`;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', analyticsConfig.ga4MeasurementId, {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                    'custom_parameter_1': 'user_engagement_score'
                }
            });
            
            window.gtag = gtag;
            console.log('Google Analytics 4 initialized');
        }
    }
    
    // Track Custom Events to Google Analytics
    function trackEvent(eventName, parameters = {}) {
        analyticsData.userInteractions.push({
            event: eventName,
            timestamp: Date.now(),
            parameters: parameters
        });
        
        if (window.gtag) {
            gtag('event', eventName, {
                event_category: parameters.category || 'User Interaction',
                event_label: parameters.label || eventName,
                value: parameters.value || 1,
                custom_parameter_1: calculateEngagementScore(),
                ...parameters
            });
        }
        
        if (analyticsConfig.debug) {
            console.log('Analytics Event:', eventName, parameters);
        }
    }
    
    // Calculate User Engagement Score
    function calculateEngagementScore() {
        let score = 0;
        score += analyticsData.scrollEvents * 2;
        score += analyticsData.clickEvents * 5;
        score += analyticsData.sectionsViewed.size * 10;
        score += Math.min(analyticsData.timeOnPage / 1000, 300); // Max 300 points for time
        return Math.round(score);
    }
    
    // Track Scroll Depth
    function trackScrollDepth() {
        if (!analyticsConfig.trackScrollDepth) return;
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.round((scrollTop / docHeight) * 100);
                
                analyticsData.scrollDepth = scrollPercent;
                analyticsData.scrollEvents++;
                
                if (scrollPercent > analyticsData.maxScrollDepth) {
                    analyticsData.maxScrollDepth = scrollPercent;
                    
                    // Track scroll milestones
                    if (scrollPercent >= 25 && !analyticsData.sectionsViewed.has('25%')) {
                        analyticsData.sectionsViewed.add('25%');
                        trackEvent('scroll_depth_25', {
                            category: 'Engagement',
                            label: '25% Scroll Depth'
                        });
                    }
                    if (scrollPercent >= 50 && !analyticsData.sectionsViewed.has('50%')) {
                        analyticsData.sectionsViewed.add('50%');
                        trackEvent('scroll_depth_50', {
                            category: 'Engagement',
                            label: '50% Scroll Depth'
                        });
                    }
                    if (scrollPercent >= 75 && !analyticsData.sectionsViewed.has('75%')) {
                        analyticsData.sectionsViewed.add('75%');
                        trackEvent('scroll_depth_75', {
                            category: 'Engagement',
                            label: '75% Scroll Depth'
                        });
                    }
                    if (scrollPercent >= 90 && !analyticsData.sectionsViewed.has('90%')) {
                        analyticsData.sectionsViewed.add('90%');
                        trackEvent('scroll_depth_90', {
                            category: 'Engagement',
                            label: '90% Scroll Depth'
                        });
                    }
                }
                
                // Track section views
                const sections = document.querySelectorAll('section[id]');
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        const sectionId = section.id;
                        if (!analyticsData.sectionsViewed.has(sectionId)) {
                            analyticsData.sectionsViewed.add(sectionId);
                            trackEvent('section_view', {
                                category: 'Navigation',
                                label: sectionId,
                                section_name: sectionId
                            });
                        }
                    }
                });
            }, 150);
        });
    }
    
    // Track All Clicks
    function trackClicks() {
        if (!analyticsConfig.trackClicks) return;
        
        document.addEventListener('click', (event) => {
            analyticsData.clickEvents++;
            
            const target = event.target;
            const tagName = target.tagName.toLowerCase();
            let clickData = {
                category: 'User Interaction',
                element_type: tagName,
                timestamp: Date.now()
            };
            
            // Track specific elements
            if (target.classList.contains('nav-link')) {
                clickData.category = 'Navigation';
                clickData.label = target.textContent.trim();
                clickData.destination = target.getAttribute('href');
                trackEvent('nav_click', clickData);
            } else if (target.classList.contains('btn')) {
                clickData.category = 'CTA';
                clickData.label = target.textContent.trim();
                clickData.button_type = target.classList.contains('btn-primary') ? 'primary' : 
                                      target.classList.contains('btn-secondary') ? 'secondary' : 'cv';
                trackEvent('button_click', clickData);
            } else if (tagName === 'a') {
                clickData.category = 'Link';
                clickData.label = target.textContent.trim();
                clickData.url = target.href;
                
                // Track outbound links
                if (target.href && !target.href.includes(window.location.hostname)) {
                    trackEvent('outbound_link_click', {
                        ...clickData,
                        category: 'Outbound Link',
                        destination: target.href
                    });
                } else {
                    trackEvent('link_click', clickData);
                }
            } else if (target.classList.contains('social-link')) {
                clickData.category = 'Social';
                clickData.label = target.querySelector('i').className;
                trackEvent('social_click', clickData);
            } else if (target.hasAttribute('download')) {
                clickData.category = 'Download';
                clickData.label = target.getAttribute('download') || target.textContent.trim();
                trackEvent('file_download', clickData);
            } else {
                clickData.category = 'General';
                clickData.label = `${tagName} click`;
                trackEvent('general_click', clickData);
            }
        });
    }
    
    // Track Form Interactions
    function trackFormInteractions() {
        if (!analyticsConfig.trackFormInteractions) return;
        
        // Track form field interactions
        document.addEventListener('focus', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                trackEvent('form_field_focus', {
                    category: 'Form Interaction',
                    label: event.target.name || event.target.placeholder,
                    field_type: event.target.type || 'textarea'
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                trackEvent('form_submit', {
                    category: 'Form Interaction',
                    label: form.id || 'contact_form',
                    form_action: form.action
                });
            }
        });
        
        // Track form validation errors
        document.addEventListener('invalid', (event) => {
            trackEvent('form_validation_error', {
                category: 'Form Interaction',
                label: event.target.name || event.target.placeholder,
                field_type: event.target.type
            });
        });
    }
    
    // Track Social Media Clicks
    function trackSocialClicks() {
        if (!analyticsConfig.trackSocialClicks) return;
        
        const socialLinks = document.querySelectorAll('a[href*="github.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="facebook.com"], a[href*="whatsapp.com"]');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', () => {
                const platform = link.href.includes('github.com') ? 'GitHub' :
                                link.href.includes('linkedin.com') ? 'LinkedIn' :
                                link.href.includes('twitter.com') ? 'Twitter' :
                                link.href.includes('facebook.com') ? 'Facebook' :
                                link.href.includes('whatsapp.com') ? 'WhatsApp' : 'Unknown';
                
                trackEvent('social_media_click', {
                    category: 'Social Media',
                    label: platform,
                    platform: platform,
                    url: link.href
                });
            });
        });
    }
    
    // Track File Downloads
    function trackDownloads() {
        if (!analyticsConfig.trackDownloads) return;
        
        const downloadLinks = document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]');
        
        downloadLinks.forEach(link => {
            link.addEventListener('click', () => {
                const fileName = link.getAttribute('download') || link.href.split('/').pop();
                const fileType = fileName.split('.').pop().toLowerCase();
                
                trackEvent('file_download', {
                    category: 'Download',
                    label: fileName,
                    file_type: fileType,
                    file_name: fileName
                });
            });
        });
    }
    
    // Track Time on Page
    function trackTimeOnPage() {
        if (!analyticsConfig.trackTimeOnPage) return;
        
        setInterval(() => {
            analyticsData.timeOnPage = Date.now() - analyticsData.pageLoadTime;
            
            // Track time milestones
            const seconds = Math.floor(analyticsData.timeOnPage / 1000);
            if (seconds === 30 && !analyticsData.sectionsViewed.has('30s')) {
                analyticsData.sectionsViewed.add('30s');
                trackEvent('time_on_page_30s', {
                    category: 'Engagement',
                    label: '30 seconds on page'
                });
            }
            if (seconds === 60 && !analyticsData.sectionsViewed.has('60s')) {
                analyticsData.sectionsViewed.add('60s');
                trackEvent('time_on_page_60s', {
                    category: 'Engagement',
                    label: '1 minute on page'
                });
            }
            if (seconds === 120 && !analyticsData.sectionsViewed.has('120s')) {
                analyticsData.sectionsViewed.add('120s');
                trackEvent('time_on_page_2m', {
                    category: 'Engagement',
                    label: '2 minutes on page'
                });
            }
        }, 1000);
    }
    
    // Exit Intent Detection
    function trackExitIntent() {
        if (!analyticsConfig.trackExitIntent) return;
        
        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (event) => {
            if (event.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                analyticsData.exitIntentTriggered = true;
                
                // Show exit intent popup
                showExitIntentPopup();
                
                trackEvent('exit_intent', {
                    category: 'Engagement',
                    label: 'User attempted to leave',
                    time_on_page: analyticsData.timeOnPage,
                    scroll_depth: analyticsData.maxScrollDepth,
                    engagement_score: calculateEngagementScore()
                });
            }
        });
        
        // Track page unload
        window.addEventListener('beforeunload', (event) => {
            trackEvent('page_unload', {
                category: 'Engagement',
                label: 'User leaving page',
                time_on_page: analyticsData.timeOnPage,
                scroll_depth: analyticsData.maxScrollDepth,
                click_events: analyticsData.clickEvents,
                scroll_events: analyticsData.scrollEvents,
                sections_viewed: analyticsData.sectionsViewed.size,
                engagement_score: calculateEngagementScore()
            });
            
            // Send final analytics data
            sendAnalyticsData();
        });
    }
    
    // Exit Intent Popup
    function showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="exit-popup-content">
                <div class="exit-popup-header">
                    <h3>Wait! Don't Go Yet! 🚀</h3>
                    <button class="exit-popup-close">&times;</button>
                </div>
                <div class="exit-popup-body">
                    <p>Did you find what you were looking for?</p>
                    <p>I'd love to help you with your next project or answer any questions!</p>
                    <div class="exit-popup-buttons">
                        <button class="btn btn-primary exit-stay-btn">Stay & Explore</button>
                        <a href="#contact" class="btn btn-secondary exit-contact-btn">Get In Touch</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup handlers
        popup.querySelector('.exit-popup-close').addEventListener('click', () => {
            popup.remove();
        });
        
        popup.querySelector('.exit-stay-btn').addEventListener('click', () => {
            trackEvent('exit_intent_stay', {
                category: 'Engagement',
                label: 'User chose to stay'
            });
            popup.remove();
        });
        
        popup.querySelector('.exit-contact-btn').addEventListener('click', () => {
            trackEvent('exit_intent_contact', {
                category: 'Engagement',
                label: 'User chose to contact'
            });
            popup.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 10000);
    }
    
    // Send Analytics Data to Server (if you have a backend)
    function sendAnalyticsData() {
        const data = {
            ...analyticsData,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        
        // You can send this data to your own analytics endpoint
        if (analyticsConfig.debug) {
            console.log('Final Analytics Data:', data);
        }
        
        // Send to Google Analytics as custom event
        if (window.gtag) {
            gtag('event', 'page_analytics_summary', {
                event_category: 'Analytics',
                event_label: 'Complete session data',
                custom_parameter_1: data.engagement_score,
                custom_parameter_2: data.time_on_page,
                custom_parameter_3: data.max_scroll_depth,
                custom_parameter_4: data.click_events,
                custom_parameter_5: data.scroll_events
            });
        }
    }
    
    // Initialize Analytics
    function initializeAnalytics() {
        initializeGA4();
        trackScrollDepth();
        trackClicks();
        trackTimeOnPage();
        trackExitIntent();
        trackFormInteractions();
        trackSocialClicks();
        trackDownloads();
        
        // Track user retention metrics
        trackUserRetention();
        
        // Track page load with enhanced data
        trackEvent('page_load', {
            category: 'Navigation',
            label: 'Page loaded',
            page_title: document.title,
            page_url: window.location.href,
            session_id: analyticsData.sessionId,
            is_returning_user: analyticsData.isReturningUser,
            visit_count: analyticsData.userRetention.visitCount,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer
        });
        
        // Track returning user
        if (analyticsData.isReturningUser) {
            trackEvent('returning_user', {
                category: 'User Retention',
                label: 'Returning visitor',
                visit_count: analyticsData.userRetention.visitCount,
                days_since_last_visit: analyticsData.userRetention.lastVisit ? 
                    Math.floor((Date.now() - analyticsData.userRetention.lastVisit) / (24 * 60 * 60 * 1000)) : 0
            });
        } else {
            trackEvent('new_user', {
                category: 'User Retention',
                label: 'First-time visitor'
            });
        }
        
        console.log('Analytics system initialized with comprehensive tracking');
        
        // Add debug panel if in debug mode
        if (analyticsConfig.debug) {
            createDebugPanel();
        }
    }
    
    // Create Debug Panel for Analytics
    function createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.className = 'analytics-debug-panel';
        debugPanel.innerHTML = `
            <h4>Analytics Debug</h4>
            <div class="debug-item">
                <span class="debug-label">Session ID:</span>
                <span class="debug-value">${analyticsData.sessionId.substring(0, 15)}...</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">User Type:</span>
                <span class="debug-value">${analyticsData.isReturningUser ? 'Returning' : 'New'}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Visit Count:</span>
                <span class="debug-value">${analyticsData.userRetention.visitCount}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Scroll Depth:</span>
                <span class="debug-value">${analyticsData.maxScrollDepth}%</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Clicks:</span>
                <span class="debug-value">${analyticsData.clickEvents}</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Engagement:</span>
                <span class="debug-value">${calculateEngagementScore()}</span>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        debugPanel.classList.add('show');
        
        // Update debug panel every 5 seconds
        setInterval(() => {
            debugPanel.innerHTML = `
                <h4>Analytics Debug</h4>
                <div class="debug-item">
                    <span class="debug-label">Session ID:</span>
                    <span class="debug-value">${analyticsData.sessionId.substring(0, 15)}...</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">User Type:</span>
                    <span class="debug-value">${analyticsData.isReturningUser ? 'Returning' : 'New'}</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Visit Count:</span>
                    <span class="debug-value">${analyticsData.userRetention.visitCount}</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Scroll Depth:</span>
                    <span class="debug-value">${analyticsData.maxScrollDepth}%</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Clicks:</span>
                    <span class="debug-value">${analyticsData.clickEvents}</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Engagement:</span>
                    <span class="debug-value">${calculateEngagementScore()}</span>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Time on Page:</span>
                    <span class="debug-value">${Math.floor(analyticsData.timeOnPage / 1000)}s</span>
                </div>
            `;
        }, 5000);
    }
    
    // Track User Retention
    function trackUserRetention() {
        // Track session duration
        setInterval(() => {
            analyticsData.userRetention.sessionDuration = Date.now() - analyticsData.pageLoadTime;
            analyticsData.userRetention.engagementScore = calculateEngagementScore();
            
            // Track session milestones
            const sessionMinutes = Math.floor(analyticsData.userRetention.sessionDuration / 60000);
            if (sessionMinutes === 1 && !analyticsData.sectionsViewed.has('1min')) {
                analyticsData.sectionsViewed.add('1min');
                trackEvent('session_1min', {
                    category: 'User Retention',
                    label: '1 minute session',
                    engagement_score: analyticsData.userRetention.engagementScore
                });
            }
            if (sessionMinutes === 5 && !analyticsData.sectionsViewed.has('5min')) {
                analyticsData.sectionsViewed.add('5min');
                trackEvent('session_5min', {
                    category: 'User Retention',
                    label: '5 minute session',
                    engagement_score: analyticsData.userRetention.engagementScore
                });
            }
        }, 60000); // Check every minute
    }
    
    // Start Analytics
    initializeAnalytics();
    
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