/**
 * Loads the sound state from localStorage.
 * @returns {boolean} True if sound is enabled, false otherwise.
 */
function loadSoundState() {
    const stored = localStorage.getItem("soundFlag");
    
    // Default to true if nothing stored
    if (stored === null) {
        return true;
    }
    
    // Parse stored value ("true"/"false" strings to boolean)
    return JSON.parse(stored);
}

/**
 * Saves the sound state to localStorage.
 * @param {boolean} state - The sound state to save.
 */
function saveSoundState(state) {
    localStorage.setItem("soundFlag", JSON.stringify(state));
}




