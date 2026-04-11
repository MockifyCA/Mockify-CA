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
            '<li><button class="global-footer-link" type="button" data-footer-action="about">About</button></li>' +
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
      '<div class="global-footer-disclaimer">This is a practice platform for CA students. Not affiliated with or endorsed by ICAI. All questions are for practice purposes only.</div>' +
      '<div class="global-footer-bottom">' +
        '<div>&copy; 2026 Mockify CA. All rights reserved.</div>' +
      '</div>' +
    '</footer>' +
    '<div class="global-footer-modal-overlay" id="about-mockify-modal" hidden>' +
      '<div class="global-footer-modal" role="dialog" aria-modal="true" aria-label="About Mockify CA" aria-describedby="about-mockify-copy" tabindex="-1">' +
        '<button class="global-footer-modal-close" type="button" aria-label="Close about dialog">&times;</button>' +
        '<div class="global-footer-modal-eyebrow">About</div>' +
        '<div class="global-footer-modal-copy" id="about-mockify-copy">' +
          '<p>Mockify CA is a small initiative built to help CA students practice in a structured and exam-oriented way.</p>' +
          '<p>The idea is simple — provide a clean, distraction-free environment where students can focus on solving case-based questions and improve their approach for the actual exam.</p>' +
          '<p>This platform is not affiliated with ICAI. It is created purely for practice and learning purposes.</p>' +
          '<p>If it helps you even a little in your preparation journey, then the purpose is fulfilled.</p>' +
        '</div>' +
        '<div class="global-footer-modal-note">Built with intent to simplify preparation.</div>' +
      '</div>' +
    '</div>';

  var aboutModalState = {
    overlay: null,
    dialog: null,
    closeButton: null,
    lastFocused: null,
    keyHandlerBound: false
  };

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

  function getFocusableElements() {
    if (!aboutModalState.dialog) return [];
    return Array.prototype.slice.call(
      aboutModalState.dialog.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function handleAboutModalKeydown(event) {
    if (!aboutModalState.overlay || !aboutModalState.overlay.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeAboutModal();
      return;
    }

    if (event.key !== "Tab") return;

    var focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      aboutModalState.dialog.focus();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    var active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function closeAboutModal() {
    if (!aboutModalState.overlay || !aboutModalState.overlay.classList.contains("is-open")) return;
    aboutModalState.overlay.classList.remove("is-open");
    document.body.classList.remove("global-footer-modal-open");
    window.setTimeout(function() {
      if (aboutModalState.overlay && !aboutModalState.overlay.classList.contains("is-open")) {
        aboutModalState.overlay.hidden = true;
      }
    }, 240);
    if (aboutModalState.lastFocused && typeof aboutModalState.lastFocused.focus === "function") {
      aboutModalState.lastFocused.focus();
    }
  }

  function openAboutModal(trigger) {
    ensureAboutModal();
    if (!aboutModalState.overlay || !aboutModalState.dialog) return;
    aboutModalState.lastFocused = trigger || document.activeElement;
    aboutModalState.overlay.hidden = false;
    document.body.classList.add("global-footer-modal-open");
    window.requestAnimationFrame(function() {
      aboutModalState.overlay.classList.add("is-open");
      if (aboutModalState.closeButton) aboutModalState.closeButton.focus();
      else aboutModalState.dialog.focus();
    });
  }

  function ensureAboutModal() {
    if (aboutModalState.overlay) return;
    aboutModalState.overlay = document.getElementById("about-mockify-modal");
    if (!aboutModalState.overlay) return;
    aboutModalState.dialog = aboutModalState.overlay.querySelector(".global-footer-modal");
    aboutModalState.closeButton = aboutModalState.overlay.querySelector(".global-footer-modal-close");

    if (aboutModalState.closeButton) {
      aboutModalState.closeButton.addEventListener("click", closeAboutModal);
    }

    aboutModalState.overlay.addEventListener("click", function(event) {
      if (event.target === aboutModalState.overlay) closeAboutModal();
    });

    if (!aboutModalState.keyHandlerBound) {
      document.addEventListener("keydown", handleAboutModalKeydown);
      aboutModalState.keyHandlerBound = true;
    }
  }

  function bindFooterActions(scope) {
    scope.querySelectorAll("[data-footer-action]").forEach(function(button) {
      button.addEventListener("click", function() {
        var action = button.getAttribute("data-footer-action");
        if (action === "home") goHome();
        if (action === "about") openAboutModal(button);
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
    ensureAboutModal();
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-global-footer]").forEach(function(host) {
      injectFooter(host);
    });
  });
})();
