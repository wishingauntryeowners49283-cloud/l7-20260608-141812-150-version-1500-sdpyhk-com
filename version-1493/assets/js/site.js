(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupHeader() {
        var header = qs('[data-site-header]');
        var toggle = qs('[data-menu-toggle]');
        var nav = qs('[data-mobile-nav]');
        if (header) {
            var update = function () {
                header.classList.toggle('is-scrolled', window.scrollY > 24);
            };
            update();
            window.addEventListener('scroll', update, { passive: true });
        }
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('is-open');
            });
        }
    }

    function setupHero() {
        var slides = qsa('[data-hero-slide]');
        var dots = qsa('[data-hero-dot]');
        if (!slides.length) {
            return;
        }
        var current = 0;
        var setActive = function (index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setActive(index);
            });
        });
        setActive(0);
        window.setInterval(function () {
            setActive((current + 1) % slides.length);
        }, 5200);
    }

    function setupFilters() {
        var root = qs('[data-filter-root]');
        if (!root) {
            return;
        }
        var input = qs('[data-filter-input]', root);
        var typeSelect = qs('[data-filter-type]', root);
        var yearSelect = qs('[data-filter-year]', root);
        var empty = qs('[data-empty-state]', root);
        var cards = qsa('[data-movie-card]', root);
        var query = new URLSearchParams(window.location.search).get('q');
        if (query && input) {
            input.value = query;
        }
        var normalize = function (value) {
            return String(value || '').toLowerCase().trim();
        };
        var apply = function () {
            var keyword = normalize(input && input.value);
            var type = normalize(typeSelect && typeSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre')
                ].join(' '));
                var show = (!keyword || haystack.indexOf(keyword) !== -1) &&
                    (!type || normalize(card.getAttribute('data-type')).indexOf(type) !== -1) &&
                    (!year || normalize(card.getAttribute('data-year')) === year);
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };
        [input, typeSelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', apply);
                element.addEventListener('change', apply);
            }
        });
        apply();
    }

    window.initPlayer = function (src) {
        var video = document.getElementById('movieVideo');
        var overlay = document.getElementById('playOverlay');
        if (!video || !src) {
            return;
        }
        var attached = false;
        var hls = null;
        var attach = function () {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(src);
                hls.attachMedia(video);
            } else {
                video.src = src;
            }
        };
        var start = function () {
            attach();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        };
        if (overlay) {
            overlay.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        setupHeader();
        setupHero();
        setupFilters();
    });
})();
