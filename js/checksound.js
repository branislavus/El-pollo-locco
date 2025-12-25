/**
 * Loads sound on/off on gamestart.
 */
function checkSoundState() {
    const soundIcon = document.getElementById('toggleAllSound');
    soundFlag = loadSoundState();
    if (soundFlag) {
        soundIcon.classList.remove('toggleAllSoundDisabled');
        soundIcon.classList.add('toggleAllSoundEnabled');
    } else {
        soundIcon.classList.remove('toggleAllSoundEnabled');
        soundIcon.classList.add('toggleAllSoundDisabled');
    }
}

checkSoundState();