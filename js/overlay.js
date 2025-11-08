const warning = document.getElementById('warning');

function checkOrientation() {
    if (!warning) return;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    warning.style.display = isPortrait ? 'flex' : 'none';
}

function resizeGameArea() {
  const fullscreen = document.getElementById('fullscreen');
  if (!fullscreen) return;
  let w = window.innerWidth;
  let h = window.innerHeight;
  // 3:2 aspect ratio
  if (w / h > 1.5) {
    h = Math.min(h, w / 1.5);
    w = h * 1.5;
  } else {
    w = Math.min(w, h * 1.5);
    h = w / 1.5;
  }
  fullscreen.style.width = w + 'px';
  fullscreen.style.height = h + 'px';
}

window.addEventListener('resize', () => {
  checkOrientation();
  resizeGameArea();
});
window.addEventListener('orientationchange', () => {
  checkOrientation();
  resizeGameArea();
});
checkOrientation();
resizeGameArea();
