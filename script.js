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

// Open Modal
function openModal(e) {
  if (e) e.preventDefault();
  contactModal.classList.add("active");
  contactModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  // Focus first input
  setTimeout(() => {
    document.getElementById("fullName").focus();
  }, 100);
}

// Close Modal
function closeModal() {
  contactModal.classList.remove("active");
  contactModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Reset form view
function resetFormView() {
  contactForm.reset();
  contactForm.style.display = "block";
  formSuccess.classList.remove("active");
  hideAlert();
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

  const fullName = document.getElementById("fullName").value.trim();
  const mobileNumber = document.getElementById("mobileNumber").value.trim();
  const emailAddress = document.getElementById("emailAddress").value.trim();
  const details = document.getElementById("details").value.trim();

  // Basic Client Validation
  if (!fullName || !mobileNumber || !emailAddress) {
    showAlert("Please fill out all required fields.");
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
