/* Umi Cleaning — site behavior. No dependencies; every page renders without it. */
(function () {
  "use strict";

  /* ---------- Header: scroll state + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    // Only the Home page (over the dark hero photo) starts transparent.
    var overHero = header.hasAttribute("data-over-hero");
    var menuBtn = header.querySelector(".menu-btn");
    var panel = header.querySelector(".nav-panel");
    var open = false;

    var sync = function () {
      var scrolled = !overHero || open || window.scrollY > 40;
      header.setAttribute("data-scrolled", scrolled ? "1" : "0");
      header.setAttribute("data-open", open ? "1" : "0");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
    };

    var setOpen = function (next) {
      open = next;
      sync();
    };

    window.addEventListener("scroll", sync, { passive: true });

    if (menuBtn) {
      menuBtn.addEventListener("click", function () { setOpen(!open); });
    }

    if (panel) {
      // Tapping any link in the panel closes it (anchor links stay on the page).
      panel.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        if (menuBtn) menuBtn.focus();
      }
    });

    // Close the panel if the viewport grows past the mobile breakpoint.
    var desktop = window.matchMedia("(min-width: 861px)");
    var onDesktop = function () { if (desktop.matches && open) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);

    sync();
  }

  /* ---------- Checklist: mobile accordion ---------- */
  // CSS only collapses groups at <=760px, so on desktop every area stays open.
  var mobile = window.matchMedia("(max-width: 760px)");
  document.querySelectorAll(".ck-group").forEach(function (group) {
    var btn = group.querySelector(".ck-area");
    if (!btn) return;
    var setExpanded = function () {
      var isOpen = group.getAttribute("data-open") === "true";
      btn.setAttribute("aria-expanded", !mobile.matches || isOpen ? "true" : "false");
    };
    btn.addEventListener("click", function () {
      if (!mobile.matches) return;
      var isOpen = group.getAttribute("data-open") === "true";
      group.setAttribute("data-open", isOpen ? "false" : "true");
      setExpanded();
    });
    if (mobile.addEventListener) mobile.addEventListener("change", setExpanded);
    setExpanded();
  });

  /* ---------- Contact: Netlify Forms via fetch ---------- */
  var form = document.querySelector("[data-quote-form]");
  if (form) {
    var success = form.querySelector("[data-form-success]");
    var error = form.querySelector("[data-form-error]");
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (error) error.hidden = true;
      if (submit) submit.disabled = true;

      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Form submission failed: " + res.status);
          form.reset();
          if (success) {
            success.hidden = false;
            success.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
        })
        .catch(function () {
          if (error) error.hidden = false;
        })
        .finally(function () {
          if (submit) submit.disabled = false;
        });
    });
  }
})();
