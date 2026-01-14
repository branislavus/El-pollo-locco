/**
 * Loads the sound state from localStorage. If nothing stored set to true.
 * @returns {boolean} True if sound is enabled, false otherwise.
 */
function loadSoundState() {
    const stored = localStorage.getItem("soundFlag");
    
    if (stored === null) {
        return true;
    }
    
    return JSON.parse(stored);
}

/**
 * Saves the sound state to localStorage.
 * @param {boolean} state - The sound state to save.
 */
function saveSoundState(state) {
    localStorage.setItem("soundFlag", JSON.stringify(state));
}