(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) {
      return;
    }
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = selectAll('.hero-slide');
    var dots = selectAll('.hero-dot');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        showSlide(Number(dot.getAttribute('data-slide') || 0));
        start();
      });
    });

    start();
  }

  function setupSearch() {
    var layer = document.querySelector('.search-layer');
    var openButtons = selectAll('.search-open');
    var closeButton = document.querySelector('.search-close');
    var input = document.querySelector('.search-input');
    var form = document.querySelector('.search-form');
    var results = document.querySelector('.search-results');
    var movies = window.SITE_MOVIES || [];

    if (!layer || !input || !form || !results) {
      return;
    }

    function openSearch() {
      layer.classList.add('is-open');
      layer.setAttribute('aria-hidden', 'false');
      window.setTimeout(function () {
        input.focus();
      }, 30);
    }

    function closeSearch() {
      layer.classList.remove('is-open');
      layer.setAttribute('aria-hidden', 'true');
    }

    function render(items, query) {
      if (!query) {
        results.innerHTML = '<div class="search-result-item"><strong>输入关键词开始搜索</strong><small>可搜索片名、地区、类型、分类和标签</small></div>';
        return;
      }
      if (!items.length) {
        results.innerHTML = '<div class="search-result-item"><strong>没有找到匹配影片</strong><small>请换一个关键词再试</small></div>';
        return;
      }
      results.innerHTML = items.slice(0, 24).map(function (item) {
        return '<a class="search-result-item" href="' + escapeHtml(item.url) + '">' +
          '<strong>' + escapeHtml(item.title) + '</strong>' +
          '<small>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type + ' · ' + item.category) + '</small>' +
          '<span>' + escapeHtml(item.text) + '</span>' +
          '</a>';
      }).join('');
    }

    function runSearch() {
      var query = input.value.trim().toLowerCase();
      var matched = movies.filter(function (item) {
        var haystack = [item.title, item.year, item.region, item.type, item.category, item.tags, item.text].join(' ').toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
      render(matched, query);
    }

    openButtons.forEach(function (button) {
      button.addEventListener('click', openSearch);
    });
    closeButton.addEventListener('click', closeSearch);
    layer.addEventListener('click', function (event) {
      if (event.target === layer) {
        closeSearch();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeSearch();
      }
    });
    input.addEventListener('input', runSearch);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch();
    });
    render([], '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
