// Landing Page JavaScript

// Import debug utilities if available (will be ignored if script is loaded as regular JS)
try {
  import('./debug-utils.js').then(module => {
    window.logDebug = module.logDebug;
    window.logInfo = module.logInfo;
    window.logWarn = module.logWarn;
    window.logError = module.logError;
  }).catch(() => {
    // Fallback logging functions if module loading fails
    window.logDebug = window.logInfo = window.logWarn = window.logError = console.log;
  });
} catch (e) {
  // Fallback for non-module environments
  window.logDebug = window.logInfo = window.logWarn = window.logError = console.log;
}

document.addEventListener('DOMContentLoaded', function() {
  // Use logInfo if available, otherwise fall back to console.log
  (window.logInfo || console.log)('Landing page loaded', 'Landing');

  // Initialize Swiper for course carousel
  const swiper = new Swiper('.course-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // Course Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get filter value
      const filter = this.getAttribute('data-filter');

      // Filter courses
      courseCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Update Swiper
      swiper.update();
    });
  });

  // Pricing Toggle
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyPrices = document.querySelectorAll('.pricing-price.monthly');
  const annualPrices = document.querySelectorAll('.pricing-price.annual');

  pricingToggle.addEventListener('change', function() {
    if (this.checked) {
      // Show annual prices
      monthlyPrices.forEach(price => price.style.display = 'none');
      annualPrices.forEach(price => price.style.display = 'flex');
    } else {
      // Show monthly prices
      monthlyPrices.forEach(price => price.style.display = 'flex');
      annualPrices.forEach(price => price.style.display = 'none');
    }
  });

  // Discount Banner Close
  const bannerClose = document.querySelector('.banner-close');
  const discountBanner = document.querySelector('.discount-banner');

  if (bannerClose && discountBanner) {
    bannerClose.addEventListener('click', function() {
      discountBanner.style.display = 'none';

      // Add some padding to the header to compensate for the removed banner
      document.querySelector('.site-header').style.paddingTop = '20px';
    });
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');

      // Toggle icon
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Back to Top Button
  const backToTopButton = document.getElementById('back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Check if dark mode is enabled
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Set initial theme
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }

  // Toggle theme
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    // Update icon
    if (document.body.classList.contains('dark-mode')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('darkMode', 'true');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('darkMode', 'false');
    }
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        e.preventDefault();

        window.scrollTo({
          top: target.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          mobileMenuToggle.querySelector('i').classList.remove('fa-times');
          mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    });
  });

  // Newsletter Form Submission
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (email) {
        // Show success message
        alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
        emailInput.value = '';
      } else {
        // Show error message
        alert('Please enter a valid email address.');
      }
    });
  }
});
