(function () {
  function mount(config) {
    var video = document.getElementById(config.id);
    var button = document.getElementById(config.button);
    if (!video || !config || !config.src) return;
    var attached = false;
    var hls = null;

    function attach() {
      if (attached) return;
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(config.src);
        hls.attachMedia(video);
      } else {
        video.src = config.src;
      }
    }

    function start() {
      if (button) button.classList.add("is-hidden");
      attach();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) start();
    });
    video.addEventListener("play", function () {
      if (button) button.classList.add("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
      if (hls) hls.destroy();
    });
  }

  window.VideoPlayer = { mount: mount };
})();
