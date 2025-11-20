function loadSoundState() {
    let soundFlag = localStorage.getItem("soundFlag");
    if (soundFlag) {
        return JSON.parse(soundFlag);
    }
    return null;
}

function saveSoundState(state) {
    localStorage.setItem("soundFlag", state);
}




