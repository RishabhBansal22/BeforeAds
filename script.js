// Automatically update footer copyright year
document.getElementById("year").textContent = new Date().getFullYear();

// ========================================================
// GOOGLE APPS SCRIPT CONFIGURATION
// Paste your deployed Google Apps Script Web App URL below:
// ========================================================
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzflwciZq-GPfz6AGJG4-o9YmTUTyGvILZbeLtTPzjmXJ3xHshKuouDiHM3IM7aN3kF/exec";

// Modal Elements
const openContactBtn = document.getElementById("openContactBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const successCloseBtn = document.getElementById("successCloseBtn");
const contactModal = document.getElementById("contactModal");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const formAlert = document.getElementById("formAlert");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");

// Form Field Elements
const fullNameInput = document.getElementById("fullName");
const fullNameError = document.getElementById("fullNameError");
const mobileNumberInput = document.getElementById("mobileNumber");
const mobileNumberError = document.getElementById("mobileNumberError");
const emailAddressInput = document.getElementById("emailAddress");
const emailAddressError = document.getElementById("emailAddressError");
const detailsInput = document.getElementById("details");
const detailsError = document.getElementById("detailsError");

// Field validation rules
function validateFullName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter your full name.";
  }
  if (trimmed.length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return "Please enter a valid name with letters.";
  }
  return null;
}

function validateMobileNumber(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter your mobile number.";
  }
  const digitsOnly = trimmed.replace(/\D/g, "");
  const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;
  if (!phonePattern.test(trimmed) || digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Please enter a valid mobile number (7 to 15 digits).";
  }
  return null;
}

function validateEmailAddress(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter your email address.";
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return "Please enter a valid email address (e.g. name@company.com).";
  }
  return null;
}

function validateDetails(value) {
  const trimmed = value.trim();
  if (trimmed.length > 2000) {
    return "Details cannot exceed 2000 characters.";
  }
  return null;
}

const formFields = [
  { input: fullNameInput, error: fullNameError, validator: validateFullName },
  { input: mobileNumberInput, error: mobileNumberError, validator: validateMobileNumber },
  { input: emailAddressInput, error: emailAddressError, validator: validateEmailAddress },
  { input: detailsInput, error: detailsError, validator: validateDetails },
];

function setFieldError(inputEl, errorEl, message) {
  inputEl.classList.add("is-invalid");
  inputEl.setAttribute("aria-invalid", "true");
  errorEl.textContent = message;
  errorEl.classList.add("visible");
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove("is-invalid");
  inputEl.removeAttribute("aria-invalid");
  errorEl.textContent = "";
  errorEl.classList.remove("visible");
}

function clearAllErrors() {
  formFields.forEach(({ input, error }) => {
    clearFieldError(input, error);
  });
  hideAlert();
}

// Attach real-time validation on user input
formFields.forEach(({ input, error, validator }) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) {
      const err = validator(input.value);
      if (!err) {
        clearFieldError(input, error);
        // If all errors resolved, hide the general alert banner
        const anyRemaining = formFields.some((f) => f.input.classList.contains("is-invalid"));
        if (!anyRemaining) {
          hideAlert();
        }
      } else {
        setFieldError(input, error, err);
      }
    }
  });

  input.addEventListener("blur", () => {
    // Validate on blur if the user has already typed something
    if (input.value.trim().length > 0) {
      const err = validator(input.value);
      if (err) {
        setFieldError(input, error, err);
      } else {
        clearFieldError(input, error);
      }
    }
  });
});

// Open Modal
function openModal(e) {
  if (e) e.preventDefault();
  contactModal.classList.add("active");
  contactModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // Focus first input
  setTimeout(() => {
    fullNameInput.focus();
  }, 100);
}

// Close Modal
function closeModal() {
  contactModal.classList.remove("active");
  contactModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearAllErrors();
}

// Reset form view
function resetFormView() {
  contactForm.reset();
  clearAllErrors();
  contactForm.style.display = "block";
  formSuccess.classList.remove("active");
  setLoading(false);
}

// Show/Hide Alert
function showAlert(msg) {
  formAlert.textContent = msg;
  formAlert.className = "form-alert error";
}

function hideAlert() {
  formAlert.textContent = "";
  formAlert.className = "form-alert";
}

// Set Loading State
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.classList.add("loading");
    btnText.textContent = "Submitting...";
  } else {
    submitBtn.classList.remove("loading");
    btnText.textContent = "Submit Inquiry";
  }
}

// Event Listeners for Modal Toggling
openContactBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
successCloseBtn.addEventListener("click", () => {
  closeModal();
  setTimeout(resetFormView, 300);
});

// Close when clicking outside the modal card
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    closeModal();
  }
});

// Close on Escape key press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && contactModal.classList.contains("active")) {
    closeModal();
  }
});

// Form Submission Handler
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  let hasErrors = false;
  let firstInvalidField = null;

  formFields.forEach(({ input, error, validator }) => {
    const err = validator(input.value);
    if (err) {
      setFieldError(input, error, err);
      hasErrors = true;
      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    } else {
      clearFieldError(input, error);
    }
  });

  if (hasErrors) {
    showAlert("Please correct the highlighted fields before submitting.");
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    return;
  }

  // Check if URL is configured
  if (
    !GOOGLE_SCRIPT_URL ||
    GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
  ) {
    showAlert(
      "Google Sheets integration pending: Please configure GOOGLE_SCRIPT_URL with your deployed Apps Script URL.",
    );
    console.warn(
      "Please follow the Google Apps Script instructions to paste your Web App URL into GOOGLE_SCRIPT_URL.",
    );
    return;
  }

  const fullName = fullNameInput.value.trim();
  const mobileNumber = mobileNumberInput.value.trim();
  const emailAddress = emailAddressInput.value.trim();
  const details = detailsInput.value.trim();

  setLoading(true);

  // Prepare payload as URLSearchParams for maximum Google Apps Script compatibility
  const formData = new URLSearchParams();
  formData.append("timestamp", new Date().toISOString());
  formData.append("fullName", fullName);
  formData.append("mobileNumber", mobileNumber);
  formData.append("emailAddress", emailAddress);
  formData.append("details", details);

  try {
    // Sending with mode: 'no-cors' allows Google Apps Script Web App 302 redirects
    // to succeed seamlessly without cross-origin blocking in any browser.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Show success state
    contactForm.style.display = "none";
    formSuccess.classList.add("active");
  } catch (error) {
    console.error("Submission failed:", error);
    showAlert(
      "Something went wrong while sending your message. Please try again or email us directly at client@norar.app.",
    );
  } finally {
    setLoading(false);
  }
});
