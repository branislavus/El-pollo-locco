/**
 * Sets sound icon to enabled state.
 * @param {HTMLElement} icon - Sound icon element.
 */
function setSoundIconEnabled(icon) {
    if (!icon) return;
    icon.classList.remove('toggleAllSoundDisabled');
    icon.classList.add('toggleAllSoundEnabled');
}

/**
 * Sets sound icon to disabled state.
 * @param {HTMLElement} icon - Sound icon element.
 */
function setSoundIconDisabled(icon) {
    if (!icon) return;
    icon.classList.remove('toggleAllSoundEnabled');
    icon.classList.add('toggleAllSoundDisabled');
}

/**
 * Updates both sound icons based on enabled state.
 * @param {boolean} isEnabled - Whether sound is enabled.
 */
function updateSoundIcons(isEnabled) {
    const soundIcon = document.getElementById('toggleAllSound');
    const soundIconDesktop = document.getElementById('toggleAllSoundDesktop');

    if (isEnabled) {
        setSoundIconEnabled(soundIcon);
        setSoundIconEnabled(soundIconDesktop);
    } else {
        setSoundIconDisabled(soundIcon);
        setSoundIconDisabled(soundIconDesktop);
    }
}

/**
 * Loads sound on/off on gamestart.
 */
function checkSoundState() {
    soundFlag = loadSoundState();
    updateSoundIcons(soundFlag);
}

checkSoundState();