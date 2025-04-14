// Signup Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('signup-form');
    const stepBtns = document.querySelectorAll('.step-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const progressFill = document.getElementById('progress-fill');
    const completionPercentage = document.getElementById('completion-percentage');
    const pointsCounter = document.getElementById('points-counter');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const completionAnimation = document.getElementById('completion-animation');
    const finalPoints = document.getElementById('final-points');
    const profileStatus = document.getElementById('profile-status');
    const continueBtn = document.getElementById('continue-to-dashboard');

    // Badges
    const badgeBasics = document.getElementById('badge-basics');
    const badgeProfile = document.getElementById('badge-profile');
    const badgeLearning = document.getElementById('badge-learning');
    const badgeInterests = document.getElementById('badge-interests');

    // Variables
    let currentStep = 1;
    let totalPoints = 0;
    let earnedPoints = {};
    let maxPoints = 100;

    // Initialize
    updateProgress();

    // Step Navigation
    stepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));

            // Only allow navigation to completed steps or the current step
            if (step <= currentStep) {
                goToStep(step);
            }
        });
    });

    // Next Step Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));

            if (validateStep(currentStep)) {
                // Award points for completing the step
                awardStepPoints(currentStep);

                // Mark current step as completed
                const currentStepBtn = document.querySelector(`.step-btn[data-step="${currentStep}"]`);
                currentStepBtn.classList.add('completed');

                // Go to next step
                goToStep(nextStep);
            }
        });
    });

    // Previous Step Buttons
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    // Password Strength Meter
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);

            // Update strength meter
            strengthBar.style.width = `${(strength.score / 5) * 100}%`;
            strengthBar.style.backgroundColor = strength.color;
            strengthText.textContent = strength.level;
            strengthText.style.color = strength.color;
        });
    }

    // Toggle Password Visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Form Submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateStep(currentStep)) {
                // Award points for the final step
                awardStepPoints(currentStep);

                // Mark current step as completed
                const currentStepBtn = document.querySelector(`.step-btn[data-step="${currentStep}"]`);
                currentStepBtn.classList.add('completed');

                // Show completion animation
                showCompletionAnimation();

                // In a real application, you would submit the form data to the server here
                console.log('Form submitted successfully!');
            }
        });
    }

    // Continue to Dashboard Button
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = '/app.html';
        });
    }

    // Functions
    function goToStep(step) {
        // Hide all steps
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
        });

        // Show the target step
        const targetStep = document.getElementById(`step-${step}`);
        targetStep.classList.add('active');

        // Update active step button
        stepBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeStepBtn = document.querySelector(`.step-btn[data-step="${step}"]`);
        activeStepBtn.classList.add('active');

        // Update current step
        currentStep = step;

        // Update progress
        updateProgress();
    }

    function validateStep(step) {
        const currentStepElement = document.getElementById(`step-${step}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Remove all existing error messages
        const errorMessages = currentStepElement.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());

        // Reset error classes
        const formGroups = currentStepElement.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('error'));

        // Validate required fields
        requiredFields.forEach(field => {
            // For radio buttons and checkboxes
            if ((field.type === 'radio' || field.type === 'checkbox') && !field.checked) {
                // Check if any other radio button with the same name is checked
                if (field.type === 'radio') {
                    const name = field.name;
                    const checkedRadio = currentStepElement.querySelector(`input[name="${name}"]:checked`);

                    if (!checkedRadio) {
                        const fieldGroup = field.closest('.form-group');
                        if (!fieldGroup.classList.contains('error')) {
                            showError(fieldGroup, 'Please select an option');
                            isValid = false;
                        }
                    }
                }
                // For checkboxes, only show error if it's the first checkbox in the group
                else if (field.type === 'checkbox') {
                    const name = field.name;
                    const firstCheckbox = currentStepElement.querySelector(`input[name="${name}"]`);

                    if (field === firstCheckbox) {
                        const checkedCheckbox = currentStepElement.querySelector(`input[name="${name}"]:checked`);

                        if (!checkedCheckbox) {
                            const fieldGroup = field.closest('.form-group');
                            if (!fieldGroup.classList.contains('error')) {
                                showError(fieldGroup, 'Please select at least one option');
                                isValid = false;
                            }
                        }
                    }
                }
            }
            // For text inputs, email, password, etc.
            else if (field.value.trim() === '') {
                const fieldGroup = field.closest('.form-group');
                showError(fieldGroup, 'This field is required');
                isValid = false;
            }
        });

        // Validate password confirmation in step 1
        if (step === 1 && passwordInput.value.trim() !== '' && confirmPasswordInput.value.trim() !== '') {
            if (passwordInput.value !== confirmPasswordInput.value) {
                const fieldGroup = confirmPasswordInput.closest('.form-group');
                showError(fieldGroup, 'Passwords do not match');
                isValid = false;
            }
        }

        // Validate password strength in step 1
        if (step === 1 && passwordInput.value.trim() !== '') {
            const strength = calculatePasswordStrength(passwordInput.value);
            if (strength.score < 2) {
                const fieldGroup = passwordInput.closest('.form-group');
                showError(fieldGroup, 'Password is too weak');
                isValid = false;
            }
        }

        return isValid;
    }

    function showError(fieldGroup, message) {
        fieldGroup.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        fieldGroup.appendChild(errorElement);
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        let level = 'Weak';
        let color = '#e74c3c'; // Red

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Complexity checks
        if (/[A-Z]/.test(password)) score += 1; // Uppercase
        if (/[a-z]/.test(password)) score += 1; // Lowercase
        if (/[0-9]/.test(password)) score += 1; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters

        // Determine strength level
        if (score >= 5) {
            level = 'Strong';
            color = '#2ecc71'; // Green
        } else if (score >= 3) {
            level = 'Good';
            color = '#3498db'; // Blue
        } else if (score >= 2) {
            level = 'Fair';
            color = '#f39c12'; // Orange
        }

        return {
            score: score,
            level: level,
            color: color
        };
    }

    function updateProgress() {
        // Calculate progress percentage
        const totalSteps = formSteps.length;
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

        // Update progress bar
        progressFill.style.width = `${progressPercentage}%`;
        completionPercentage.textContent = `${Math.round(progressPercentage)}%`;

        // Update badges
        updateBadges();
    }

    function updateBadges() {
        // Reset badges
        badgeBasics.classList.remove('earned');
        badgeProfile.classList.remove('earned');
        badgeLearning.classList.remove('earned');
        badgeInterests.classList.remove('earned');

        // Update badges based on completed steps
        const completedSteps = document.querySelectorAll('.step-btn.completed');

        completedSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));

            switch (stepNumber) {
                case 1:
                    badgeBasics.classList.add('earned');
                    break;
                case 2:
                    badgeProfile.classList.add('earned');
                    break;
                case 3:
                    badgeLearning.classList.add('earned');
                    break;
                case 4:
                    badgeInterests.classList.add('earned');
                    break;
            }
        });

        // Also add the current step badge
        switch (currentStep) {
            case 1:
                badgeBasics.classList.add('earned');
                break;
            case 2:
                badgeProfile.classList.add('earned');
                break;
            case 3:
                badgeLearning.classList.add('earned');
                break;
            case 4:
                badgeInterests.classList.add('earned');
                break;
        }
    }

    function awardStepPoints(step) {
        // Only award points once per step
        if (earnedPoints[`step-${step}`]) return;

        let stepPoints = 0;
        const stepElement = document.getElementById(`step-${step}`);

        // Get all point indicators in the step
        const pointIndicators = stepElement.querySelectorAll('.points-indicator');

        pointIndicators.forEach(indicator => {
            const pointsText = indicator.textContent;
            const pointsMatch = pointsText.match(/\+(\d+)/);

            if (pointsMatch) {
                const points = parseInt(pointsMatch[1]);

                // For checkboxes and radio buttons
                const field = indicator.previousElementSibling;
                if (field && field.tagName === 'LABEL' && (field.classList.contains('checkbox-container') || field.classList.contains('radio-container'))) {
                    const input = field.querySelector('input');
                    if (input && input.checked) {
                        stepPoints += points;
                    }
                }
                // For interest categories (multiple checkboxes)
                else if (field && field.classList.contains('interest-categories')) {
                    const checkedInputs = field.querySelectorAll('input:checked');
                    stepPoints += points * checkedInputs.length;
                }
                // For other fields
                else {
                    stepPoints += points;
                }
            }
        });

        // Store earned points for this step
        earnedPoints[`step-${step}`] = stepPoints;

        // Update total points
        totalPoints = Object.values(earnedPoints).reduce((sum, points) => sum + points, 0);

        // Update points counter with animation
        animatePointsCounter(totalPoints);
    }

    function animatePointsCounter(targetPoints) {
        const duration = 1000; // Animation duration in milliseconds
        const startTime = performance.now();
        const startValue = parseInt(pointsCounter.textContent) || 0;

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const currentValue = Math.floor(startValue + progress * (targetPoints - startValue));
            pointsCounter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function showCompletionAnimation() {
        // Update final points and status
        finalPoints.textContent = totalPoints;

        // Determine profile status based on points
        let status = 'Beginner';
        if (totalPoints >= 90) {
            status = 'Master';
        } else if (totalPoints >= 70) {
            status = 'Expert';
        } else if (totalPoints >= 50) {
            status = 'Advanced';
        } else if (totalPoints >= 30) {
            status = 'Intermediate';
        }

        profileStatus.textContent = status;

        // Show completion animation
        completionAnimation.style.display = 'flex';

        // Trigger confetti animation
        if (window.confetti) {
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            (function frame() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) return;

                const particleCount = 50 * (timeLeft / duration);

                // Create confetti
                confetti({
                    particleCount,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Keep the animation going
                requestAnimationFrame(frame);
            }());
        }
    }
});
