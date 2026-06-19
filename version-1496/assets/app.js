(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length || !dots.length) {
            return;
        }
        var active = 0;
        var timer = null;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                stop();
                show(index);
                start();
            });
        });
        show(0);
        start();
    }

    function setupFilters() {
        var filterRoot = document.querySelector("[data-filter-root]");
        if (!filterRoot) {
            return;
        }
        var input = filterRoot.querySelector("[data-filter-input]");
        var type = filterRoot.querySelector("[data-filter-type]");
        var region = filterRoot.querySelector("[data-filter-region]");
        var year = filterRoot.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-card]"));
        var empty = filterRoot.querySelector("[data-no-result]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }
        function cardValue(card, name) {
            return normalize(card.getAttribute("data-" + name));
        }
        function apply() {
            var query = normalize(input ? input.value : "");
            var selectedType = normalize(type ? type.value : "");
            var selectedRegion = normalize(region ? region.value : "");
            var selectedYear = normalize(year ? year.value : "");
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    cardValue(card, "title"),
                    cardValue(card, "region"),
                    cardValue(card, "type"),
                    cardValue(card, "year"),
                    cardValue(card, "genre"),
                    normalize(card.textContent)
                ].join(" ");
                var matched = true;
                if (query && haystack.indexOf(query) === -1) {
                    matched = false;
                }
                if (selectedType && cardValue(card, "type") !== selectedType) {
                    matched = false;
                }
                if (selectedRegion && cardValue(card, "region") !== selectedRegion) {
                    matched = false;
                }
                if (selectedYear && cardValue(card, "year") !== selectedYear) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        [input, type, region, year].forEach(function (element) {
            if (element) {
                element.addEventListener("input", apply);
                element.addEventListener("change", apply);
            }
        });
        apply();
    }

    window.setupMoviePlayer = function (videoUrl) {
        ready(function () {
            var video = document.querySelector(".movie-video");
            var overlay = document.querySelector(".player-overlay");
            var button = document.querySelector(".play-trigger");
            var hls = null;
            var attached = false;
            if (!video || !videoUrl) {
                return;
            }
            function attach() {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(videoUrl);
                    hls.attachMedia(video);
                } else {
                    video.src = videoUrl;
                }
            }
            function start() {
                attach();
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                video.setAttribute("controls", "controls");
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {
                        if (overlay) {
                            overlay.classList.remove("is-hidden");
                        }
                    });
                }
            }
            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    start();
                });
            }
            if (overlay) {
                overlay.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                } else {
                    video.pause();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
