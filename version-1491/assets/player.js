(function () {
  function setupPlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var stream = player.getAttribute('data-stream');
    var hlsInstance = null;
    var initialized = false;

    if (!video || !overlay || !stream) {
      return;
    }

    function attachStream() {
      if (initialized) {
        return;
      }
      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = stream;
    }

    function beginPlayback() {
      attachStream();
      player.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    overlay.addEventListener('click', beginPlayback);
    video.addEventListener('click', function () {
      if (!initialized) {
        beginPlayback();
      }
    });
    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        player.classList.remove('is-playing');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.video-player')).forEach(setupPlayer);
  });
})();
