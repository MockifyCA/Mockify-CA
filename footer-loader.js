(function() {
  var FOOTER_HTML =
    '<footer class="global-footer" aria-label="Site footer">' +
      '<div class="global-footer-grid">' +
        '<div class="global-footer-col global-footer-col-brand">' +
          '<div data-brand-host></div>' +
          '<div class="global-footer-tagline">Mockify CA is built to help CA students prepare with structure, clarity, and real exam-like practice. Designed for serious preparation.</div>' +
        '</div>' +
        '<div class="global-footer-col">' +
          '<h4>Quick Links</h4>' +
          '<ul class="global-footer-links">' +
            '<li><button class="global-footer-link" type="button" data-footer-action="home">Home</button></li>' +
            '<li><button class="global-footer-link" type="button" data-footer-action="start-practice">Start Practice</button></li>' +
            '<li><button class="global-footer-link" type="button" data-footer-action="features">Features</button></li>' +
          '</ul>' +
        '</div>' +
        '<div class="global-footer-col">' +
          '<h4>Feedback / Suggestions</h4>' +
          '<ul class="global-footer-links">' +
            '<li><button class="global-footer-link" type="button" data-footer-action="feedback">Share Feedback</button></li>' +
            '<li><span class="global-footer-note"><span class="global-footer-note-icon">&#9993;</span><span>Send your ideas and suggestions</span></span></li>' +
            '<li><span class="global-footer-note"><span class="global-footer-note-icon">&#8984;</span><span>Help us improve the platform experience</span></span></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="global-footer-disclaimer">This is a practice platform for CA students. Not affiliated with or endorsed by ICAI. All questions are created for practice purposes only.</div>' +
      '<div class="global-footer-bottom">' +
        '<div>&copy; 2026 Mockify CA. All rights reserved.</div>' +
      '</div>' +
    '</footer>';

  function goHome() {
    if (typeof window.nav === "function" && document.getElementById("page-landing")) {
      window.nav("landing");
      return;
    }
    if (document.getElementById("top")) {
      window.location.hash = "top";
      return;
    }
    window.location.href = "index.html#top";
  }

  function startPractice() {
    if (typeof window.handleStartPractice === "function") {
      window.handleStartPractice();
      return;
    }
    if (typeof window.handleMockStartClick === "function") {
      window.handleMockStartClick();
      return;
    }
    window.location.href = "index.html#top";
  }

  function goToFeatures() {
    if (typeof window.scrollToLandingSection === "function" && document.getElementById("landing-features")) {
      window.scrollToLandingSection("landing-features");
      return;
    }
    var features = document.getElementById("landing-features");
    if (features) {
      features.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = "index.html#landing-features";
  }

  function openFeedback() {
    if (typeof window.nav === "function" && document.getElementById("page-feedback")) {
      window.nav("feedback");
      return;
    }
    if (typeof window.openInfoModal === "function" && document.getElementById("feedback-modal")) {
      window.openInfoModal("feedback-modal");
      return;
    }
    var feedbackUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdn7vrmcXYS70Bf51eWHICGB5ZTkmOwAeJMmI_lnIESG8MmSg/viewform";
    if (typeof window.openInfoModal === "function" && document.getElementById("contact-modal")) {
      window.openInfoModal("contact-modal");
      return;
    }
    if (typeof window.openModal === "function" && document.getElementById("modal-contact")) {
      window.openModal("modal-contact");
      return;
    }
    window.location.href = "index.html#contact-modal";
  }

  function bindFooterActions(scope) {
    scope.querySelectorAll("[data-footer-action]").forEach(function(button) {
      button.addEventListener("click", function() {
        var action = button.getAttribute("data-footer-action");
        if (action === "home") goHome();
        if (action === "start-practice") startPractice();
        if (action === "features") goToFeatures();
        if (action === "feedback") openFeedback();
      });
    });
  }

  function injectFooter(host) {
    host.innerHTML = FOOTER_HTML;
    if (typeof window.renderMockifyBrands === "function") {
      window.renderMockifyBrands(host);
    }
    bindFooterActions(host);
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-global-footer]").forEach(function(host) {
      injectFooter(host);
    });
  });
})();
