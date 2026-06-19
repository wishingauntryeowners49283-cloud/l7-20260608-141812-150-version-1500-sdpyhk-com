(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(open));
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5000);
      }
    }

    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });
    restart();

    var activeFilter = { key: "all", value: "all" };
    var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".site-search"));
    var clearButtons = Array.prototype.slice.call(document.querySelectorAll(".search-clear"));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInputs.map(function (input) { return input.value; }).join(" "));
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      var visible = 0;
      cards.forEach(function (card) {
        var meta = normalize((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || ""));
        var okSearch = !query || meta.indexOf(query) !== -1;
        var okFilter = true;
        if (activeFilter.key !== "all") {
          okFilter = normalize(card.getAttribute("data-" + activeFilter.key)) === normalize(activeFilter.value);
        }
        var show = okSearch && okFilter;
        card.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      Array.prototype.slice.call(document.querySelectorAll(".empty-state")).forEach(function (empty) {
        empty.classList.toggle("is-visible", cards.length > 0 && visible === 0);
      });
    }

    searchInputs.forEach(function (input) {
      input.addEventListener("input", applyFilters);
    });
    clearButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        searchInputs.forEach(function (input) { input.value = ""; });
        activeFilter = { key: "all", value: "all" };
        filterButtons.forEach(function (item) {
          item.classList.toggle("is-active", item.getAttribute("data-filter-key") === "all");
        });
        applyFilters();
      });
    });
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = {
          key: button.getAttribute("data-filter-key") || "all",
          value: button.getAttribute("data-filter-value") || "all"
        };
        filterButtons.forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        applyFilters();
      });
    });
  });
})();
