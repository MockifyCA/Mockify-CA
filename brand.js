(function() {
  var brandMarkup =
    '<div class="mockify-brand" aria-label="Mockify CA brand">' +
      '<div class="mockify-brand-logo" aria-hidden="true">' +
        '<svg viewBox="0 0 64 64" role="img" aria-label="Mockify CA logo">' +
          '<path d="M8 8v48h48" fill="none" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M8 8l-3 3m3-3l3 3" fill="none" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M56 56l-3-3m3 3l-3 3" fill="none" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<rect x="16" y="31" width="8" height="17" rx="1.5" fill="#d9a441"/>' +
          '<rect x="28" y="36" width="8" height="12" rx="1.5" fill="#27b89a"/>' +
          '<rect x="40" y="24" width="8" height="24" rx="1.5" fill="#ff3652"/>' +
          '<path d="M16 26h11l4 5 10-14h8l10-10" fill="none" stroke="#3f3fa3" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M58 7v8h-8" fill="none" stroke="#3f3fa3" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<div class="mockify-brand-text">' +
        '<span class="mockify-brand-name">Mockify CA</span>' +
      '</div>' +
    '</div>';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderHost(host) {
    if (!host) return;
    var tagline = host.getAttribute("data-brand-tagline");
    host.innerHTML = brandMarkup;
    if (tagline) {
      host.querySelector(".mockify-brand-text").insertAdjacentHTML(
        "beforeend",
        '<span class="mockify-brand-tagline">' + escapeHtml(tagline) + "</span>"
      );
    }
  }

  function renderBrands(scope) {
    (scope || document).querySelectorAll("[data-brand-host]").forEach(renderHost);
  }

  window.renderMockifyBrands = renderBrands;

  document.addEventListener("DOMContentLoaded", function() {
    renderBrands(document);
  });
})();
