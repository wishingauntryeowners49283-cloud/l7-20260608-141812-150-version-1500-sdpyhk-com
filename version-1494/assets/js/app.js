(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var searchInput = document.querySelector("[data-page-search]");
  var clearButton = document.querySelector("[data-clear-search]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
  var notFound = document.querySelector("[data-not-found]");

  function runSearch(value) {
    var keyword = String(value || "").trim().toLowerCase();
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = String(card.getAttribute("data-search") || "").toLowerCase();
      var visible = keyword.length === 0 || haystack.indexOf(keyword) !== -1;
      card.classList.toggle("is-hidden", !visible);
      if (visible) {
        shown += 1;
      }
    });

    if (notFound) {
      notFound.classList.toggle("is-visible", shown === 0);
    }
  }

  if (searchInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      searchInput.value = query;
      runSearch(query);
    }

    searchInput.addEventListener("input", function () {
      runSearch(searchInput.value);
    });
  }

  if (clearButton && searchInput) {
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      runSearch("");
      searchInput.focus();
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]")).forEach(function (chip) {
    chip.addEventListener("click", function () {
      var value = chip.getAttribute("data-filter-chip") || "";
      if (searchInput) {
        searchInput.value = value;
        runSearch(value);
        searchInput.focus();
      } else {
        window.location.href = "./library.html?q=" + encodeURIComponent(value);
      }
    });
  });
})();
