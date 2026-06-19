function setupMoviePlayer(videoId, overlayId, sourceUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var attached = false;
  var hls = null;

  if (!video) {
    return;
  }

  var hideOverlay = function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  };

  var attachSource = function () {
    return new Promise(function (resolve) {
      if (attached) {
        resolve();
        return;
      }

      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        resolve();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          resolve();
        });
        setTimeout(resolve, 600);
        return;
      }

      video.src = sourceUrl;
      resolve();
    });
  };

  var startPlay = function () {
    hideOverlay();
    attachSource().then(function () {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    });
  };

  if (overlay) {
    overlay.addEventListener("click", startPlay);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlay();
    }
  });

  video.addEventListener("play", hideOverlay);
}
