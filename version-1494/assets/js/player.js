function initMoviePlayer(streamUrl, videoId, maskId) {
  var video = document.getElementById(videoId);
  var mask = document.getElementById(maskId);
  var hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function attachStream() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (video.getAttribute("src") !== streamUrl) {
        video.setAttribute("src", streamUrl);
      }
      return;
    }

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      }
      return;
    }

    if (video.getAttribute("src") !== streamUrl) {
      video.setAttribute("src", streamUrl);
    }
  }

  function startPlayback() {
    attachStream();

    if (mask) {
      mask.classList.add("is-hidden");
    }

    var attempt = video.play();

    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {});
    }
  }

  if (mask) {
    mask.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });
}
