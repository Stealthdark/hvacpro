/**
 * HVACPro - Main JavaScript File
 * Handles form validation, submission, and Contact Form 7 API integration
 */

// ===================================
// Configuration
// ===================================

// IMPORTANT: Update this with your Contact Form 7 API endpoint
// Format: https://your-wordpress-site.com/wp-json/contact-form-7/v1/contact-forms/{form-id}/feedback
const CF7_API_ENDPOINT = 'YOUR_CONTACT_FORM_7_API_ENDPOINT_HERE';

// Alternative: Use a backend proxy or form service
// You can also use services like FormSpree, Netlify Forms, or your own backend
const USE_ALTERNATIVE_ENDPOINT = true;
// Added parameters: _captcha=false (no captcha), _template=box (AJAX friendly)
const ALTERNATIVE_API_ENDPOINT = 'https://formsubmit.co/ajax/me.harshitjoshi@gmail.com';

// ===================================
// PRELOADER - Energy Saving Animation
// ===================================

// Show preloader on page load
window.addEventListener('load', function() {
    hidePreloader();
});

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add fade-out class after minimum display time (1 second)
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.classList.add('fade-in');

            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    }
}

// ===================================
// DOM Content Loaded
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
    initializeConsentCheckboxes();
    // initializeFormSubmission(); // REMOVED - duplicate listener causing double submissions
    initializeSmoothScroll();
    initializePageTransitions();
    initializeAnimations();
});

// ===================================
// Form Validation
// ===================================

function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity()) {
                handleFormSubmit(form);
            } else {
                form.classList.add('was-validated');
            }
        }, false);
    });
}

// ===================================
// Consent Checkboxes Logic
// ===================================

function initializeConsentCheckboxes() {
    const forms = document.querySelectorAll('#contactForm');

    forms.forEach(form => {
        const hasAddressCheckbox = form.querySelector('#hasAddress');
        const residentDurationCheckbox = form.querySelector('#residentDuration');
        const submitBtn = form.querySelector('#submitBtn');

        if (hasAddressCheckbox && residentDurationCheckbox && submitBtn) {
            // Initially disable submit button
            updateSubmitButtonState();

            // Add event listeners to checkboxes
            hasAddressCheckbox.addEventListener('change', updateSubmitButtonState);
            residentDurationCheckbox.addEventListener('change', updateSubmitButtonState);

            function updateSubmitButtonState() {
                const bothChecked = hasAddressCheckbox.checked && residentDurationCheckbox.checked;
                submitBtn.disabled = !bothChecked;

                // Visual feedback
                if (bothChecked) {
                    submitBtn.classList.remove('btn-secondary');
                    submitBtn.classList.add('btn-primary');
                } else {
                    submitBtn.classList.remove('btn-primary');
                    submitBtn.classList.add('btn-secondary');
                }
            }
        }
    });
}

// ===================================
// Form Submission Handler
// ===================================
// REMOVED: This was causing duplicate submissions
// The form submission is now handled by initializeFormValidation()

async function handleFormSubmit(form) {
    const submitBtn = form.querySelector('#submitBtn');
    const submitSpinner = form.querySelector('#submitSpinner');
    // Look for formMessage in parent container, not just within form
    const formMessage = form.parentElement.querySelector('#formMessage') ||
                        document.querySelector('#formMessage');

    // Validate required elements exist
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        contactNo: formData.get('contactNo'),
        productInterest: formData.get('productInterest'),
        hasAddress: formData.get('hasAddress') ? 'Yes' : 'No',
        residentDuration: formData.get('residentDuration') ? 'Yes' : 'No',
        submittedAt: new Date().toISOString(),
        pageUrl: window.location.href
    };

    // Show loading state
    submitBtn.disabled = true;
    if (submitSpinner) {
        submitSpinner.classList.remove('d-none');
    }
    if (formMessage) {
        formMessage.innerHTML = '';
    }

    try {
        // Determine which endpoint to use
        const endpoint = USE_ALTERNATIVE_ENDPOINT ? ALTERNATIVE_API_ENDPOINT : CF7_API_ENDPOINT;

        // Check if endpoint is configured
        if (endpoint.includes('YOUR_') || endpoint.includes('ENDPOINT_HERE')) {
            // Demo mode - show success message without actual submission
            console.log('Form Data (Demo Mode):', data);
            await simulateAPICall(data);
            if (formMessage) {
                showSuccessMessage(formMessage, 'Demo Mode: Form submitted successfully! Check console for data.');
            }
            form.reset();
            form.classList.remove('was-validated');
        } else {
            // Submit to Contact Form 7 API or Alternative Endpoint
            const response = await submitToAPI(endpoint, data);

            if (response.success) {
                if (formMessage) {
                    showSuccessMessage(formMessage, 'Thank you! Your inquiry has been submitted successfully. We will contact you soon.');
                }
                form.reset();
                form.classList.remove('was-validated');

                // Optional: Send data to spreadsheet service
                await sendToSpreadsheet(data);
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        }
    } catch (error) {
        console.error('Form submission error:', error);
        if (formMessage) {
            showErrorMessage(formMessage, 'Sorry, there was an error submitting your form. Please try again or contact us directly.');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        if (submitSpinner) {
            submitSpinner.classList.add('d-none');
        }
    }
}

// ===================================
// API Submission Functions
// ===================================

async function submitToAPI(endpoint, data) {
    try {
        // FormSubmit AJAX endpoint expects JSON when using /ajax/ endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.fullName,
                email: data.email,
                phone: data.contactNo,
                product: data.productInterest,
                hasAddress: data.hasAddress,
                residentDuration: data.residentDuration,
                submittedAt: data.submittedAt,
                pageUrl: data.pageUrl
            })
        });

        // Parse the JSON response from FormSubmit AJAX endpoint
        const result = await response.json();

        if (response.ok && result.success) {
            return {
                success: true,
                message: result.message || 'Form submitted successfully'
            };
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    } catch (error) {
        console.error('API submission error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Simulate API call for demo purposes
function simulateAPICall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Simulated submission:', data);
            resolve({ success: true });
        }, 1500);
    });
}

// ===================================
// Spreadsheet Integration
// ===================================

/**
 * Send form data to Google Sheets or other spreadsheet service
 * You can use:
 * 1. Google Apps Script Web App
 * 2. Zapier webhook
 * 3. Make.com (Integromat) webhook
 * 4. Your own backend service
 */
async function sendToSpreadsheet(data) {
    // Example: Google Apps Script endpoint
    const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxnzbCorugakGKmzJ9KtFXl_9xt19muCc9NUfqr5bh7jCJiNrgCWRaD2_fjnUFdhoiP/exec';

    // Skip if not configured
    if (SPREADSHEET_WEBHOOK_URL.includes('YOUR_')) {
        console.log('Spreadsheet integration not configured. Data:', data);
        return;
    }

    try {
        await fetch(SPREADSHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('Data sent to spreadsheet successfully');
    } catch (error) {
        console.error('Spreadsheet submission error:', error);
        // Don't throw error - spreadsheet is secondary
    }
}

// ===================================
// Message Display Functions
// ===================================

function showSuccessMessage(container, message) {
    container.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            <strong>Success!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function showErrorMessage(container, message) {
    container.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            <strong>Error!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===================================
// Phone Number Formatting (Optional)
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            e.target.value = value;
        });
    });
});

// ===================================
// Form Data Logger (Development Only)
// ===================================

// Utility function for debugging (currently unused)
// function logFormData(data) {
//     console.log('=== Form Submission Data ===');
//     console.log('Full Name:', data.fullName);
//     console.log('Email:', data.email);
//     console.log('Contact Number:', data.contactNo);
//     console.log('Product Interest:', data.productInterest);
//     console.log('Has Physical Address:', data.hasAddress);
//     console.log('Resident Duration (2+ years):', data.residentDuration);
//     console.log('Submitted At:', data.submittedAt);
//     console.log('Page URL:', data.pageUrl);
//     console.log('===========================');
// }

// ===================================
// Page Transitions & Animations
// ===================================

function initializePageTransitions() {
    // Smooth transitions for internal links
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="products.html"], a[href^="contact.html"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');

            // Only apply transition for different pages
            if (targetUrl && !targetUrl.includes('#')) {
                e.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    const animatedElements = document.querySelectorAll('.expertise-card, .product-card, .contact-info-card, .why-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in class styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Add stagger animation delay
    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ===================================
// Parallax Effect (Subtle)
// ===================================

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        const parallaxSpeed = 0.5;
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ===================================
// Export for testing (optional)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleFormSubmit,
        submitToAPI,
        sendToSpreadsheet
    };
}

// I confirm that the provided physical address has been that is being older than 2 years 