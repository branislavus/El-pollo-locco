
function checkOrientation() {
    const overlay = document.getElementById('orientation-overlay');
    if (!overlay) return;
    if (window.matchMedia("(orientation: portrait)").matches) {
        overlay.classList.remove("d_none");
    } else {
        overlay.classList.add("d_none");
    }
}


window.addEventListener("load", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
