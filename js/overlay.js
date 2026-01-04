const warning = document.getElementById('warning');

/**
 * Checks device orientation and shows/hides warning overlay.
 * Displays warning in portrait mode, hides in landscape mode.
 */
function checkOrientation() {
    if (!warning) return;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    warning.style.display = isPortrait && window.innerWidth < 1000 ? 'flex' : 'none';
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);
checkOrientation();
