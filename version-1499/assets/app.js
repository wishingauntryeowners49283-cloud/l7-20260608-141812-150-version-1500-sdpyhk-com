(function () {
    var headerButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (headerButton && mobileNav) {
        headerButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            headerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slide-target]'));
        var current = 0;
        var timer = null;

        var setSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        };

        var start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var target = Number(dot.getAttribute('data-slide-target')) || 0;
                setSlide(target);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    var searchForms = Array.prototype.slice.call(document.querySelectorAll('.search-panel'));

    searchForms.forEach(function (form) {
        var input = form.querySelector('[data-search-input]');
        var scope = form.parentElement ? form.parentElement.querySelector('[data-filter-scope]') : null;

        form.addEventListener('submit', function (event) {
            if (scope) {
                event.preventDefault();
                runFilter(input, scope);
            }
        });

        if (input && scope) {
            input.addEventListener('input', function () {
                runFilter(input, scope);
            });
        }
    });

    function runFilter(input, scope) {
        var keyword = (input.value || '').trim().toLowerCase();
        var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .ranking-item'));

        items.forEach(function (item) {
            var haystack = [
                item.getAttribute('data-title') || '',
                item.getAttribute('data-tags') || '',
                item.getAttribute('data-year') || '',
                item.getAttribute('data-region') || '',
                item.textContent || ''
            ].join(' ').toLowerCase();

            item.classList.toggle('hidden-by-search', keyword && haystack.indexOf(keyword) === -1);
        });
    }

    var hlsScriptPromise = null;

    function loadHlsScript() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }

        if (!hlsScriptPromise) {
            hlsScriptPromise = new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
                script.async = true;
                script.onload = function () {
                    resolve(window.Hls);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        return hlsScriptPromise;
    }

    function startVideo(shell) {
        var video = shell.querySelector('video');

        if (!video) {
            return;
        }

        var url = video.getAttribute('data-video') || '';

        if (!url) {
            return;
        }

        shell.classList.add('is-ready');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.src) {
                video.src = url;
            }
            video.play().catch(function () {});
            return;
        }

        loadHlsScript().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                if (!video._siteHls) {
                    var hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    video._siteHls = hls;
                }
                video.play().catch(function () {});
            } else {
                video.src = url;
                video.play().catch(function () {});
            }
        }).catch(function () {
            video.src = url;
            video.play().catch(function () {});
        });
    }

    var videoShells = Array.prototype.slice.call(document.querySelectorAll('[data-video-shell]'));

    videoShells.forEach(function (shell) {
        var button = shell.querySelector('.video-start');
        var video = shell.querySelector('video');

        if (button) {
            button.addEventListener('click', function () {
                startVideo(shell);
            });
        }

        if (video) {
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });

            video.addEventListener('pause', function () {
                if (video.currentTime === 0 || video.ended) {
                    shell.classList.remove('is-playing');
                }
            });
        }
    });
})();
