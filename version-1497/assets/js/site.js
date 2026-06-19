document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.querySelector("[data-nav-links]");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    var showSlide = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  var searchInput = document.querySelector("[data-filter-search]");
  var yearSelect = document.querySelector("[data-filter-year]");
  var typeSelect = document.querySelector("[data-filter-type]");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".js-movie-card"));
  var emptyState = document.querySelector("[data-empty-state]");

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q");

  if (searchInput && query) {
    searchInput.value = query;
  }

  var applyFilter = function () {
    if (!cards.length) {
      return;
    }

    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var yearValue = yearSelect ? yearSelect.value : "";
    var typeValue = typeSelect ? typeSelect.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var text = (card.dataset.search || card.textContent || "").toLowerCase();
      var year = parseInt(card.dataset.year || "0", 10);
      var typeText = (card.dataset.type || "") + " " + (card.dataset.genre || "");
      var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
      var yearMatch = true;
      var typeMatch = !typeValue || typeText.indexOf(typeValue) !== -1;

      if (yearValue) {
        var selectedYear = parseInt(yearValue, 10);
        if (selectedYear >= 2020) {
          yearMatch = year === selectedYear;
        } else {
          yearMatch = year >= selectedYear;
        }
      }

      var matched = keywordMatch && yearMatch && typeMatch;
      card.classList.toggle("is-filtered-out", !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  };

  [searchInput, yearSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilter);
      control.addEventListener("change", applyFilter);
    }
  });

  applyFilter();
});
