/**
 * Loads sound on/off on gamestart.
 */
function checkSoundState() {
    const soundIcon = document.getElementById('toggleAllSound');
    const soundIconDesktop = document.getElementById('toggleAllSoundDesktop');
    soundFlag = loadSoundState();
    if (soundFlag) {
        soundIcon.classList.remove('toggleAllSoundDisabled');
        soundIcon.classList.add('toggleAllSoundEnabled');
        if (soundIconDesktop) {
            soundIconDesktop.classList.remove('toggleAllSoundDisabled');
            soundIconDesktop.classList.add('toggleAllSoundEnabled');
        }
    } else {
        soundIcon.classList.remove('toggleAllSoundEnabled');
        soundIcon.classList.add('toggleAllSoundDisabled');
        if (soundIconDesktop) {
            soundIconDesktop.classList.remove('toggleAllSoundEnabled');
            soundIconDesktop.classList.add('toggleAllSoundDisabled');
        }
    }
}

checkSoundState();