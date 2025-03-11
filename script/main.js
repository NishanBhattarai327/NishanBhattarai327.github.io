// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your public key
    if (window.emailjs) {
        emailjs.init("eadnQC8LvaDQjBOfI");
    }
    
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }
    
    // Toggle theme and save preference
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Make sure EmailJS is initialized before sending
            if (!window.emailjs) {
                console.error('EmailJS not loaded');
                alert('Email service not available. Please try again later.');
                return;
            }
            
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message
            };
            
            // Replace with your actual EmailJS service ID, template ID, and user ID
            emailjs.send('service_rcsehjs', 'template_ckkv3s5', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully!', response);
                    alert('Thanks for your message! I\'ll get back to you soon.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('Email sending failed:', error);
                    alert('Sorry, there was a problem sending your message.');
                });
        });
    }
    
    // Load GitHub projects if the script is available
    if (window.githubPortfolio) {
        window.githubPortfolio.loadGitHubProjects();
    } else {
        console.warn('GitHub portfolio integration not available');
    }
});
