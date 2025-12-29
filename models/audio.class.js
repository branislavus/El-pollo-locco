/**
 * Manages all game audio including sound effects and background music.
 * Provides volume controls, mute functionality, and organized sound playback methods.
 */
class AudioManager {

  sounds = {
    click: new Audio('audio/button.mp3'),
    jump: new Audio('audio/jumping.mp3'),
    land: new Audio('audio/land.mp3'),
    walk: new Audio('audio/walking-in-sand.mp3'),
    hurt: new Audio('audio/yelp-in-pain.mp3'),
    snoring: new Audio('audio/snoring.mp3'),
    dieScream: new Audio('audio/die-scream.mp3'),
    chicken1: new Audio('audio/chicken-noise1.mp3'),
    chicken2: new Audio('audio/chicken-noise2.mp3'),
    chicken3: new Audio('audio/chicken-noise3.mp3'),
    chickenSmall1: new Audio('audio/chicen-small1.mp3'),
    chickenSmall2: new Audio('audio/chicen-small2.mp3'),
    chickenSmall3: new Audio('audio/chicen-small3.mp3'),
    chickenSquish: new Audio('audio/chicken-squish.mp3'),
    bossBite: new Audio('audio/boss-bite.mp3'),
    bossDeathScream: new Audio('audio/boss-death-scream.mp3'),
    bossFootStep: new Audio('audio/boss-footstep.mp3'),
    bossGrowl: new Audio('audio/endboss-growl.mp3'),
    coin: new Audio('audio/coin.mp3'),
    bottle: new Audio('audio/bottle.mp3'),
    bottleBreak: new Audio('audio/broken-bottle.mp3'),
    bottleWhoosh: new Audio('audio/whoosh-bottle.mp3'),
    throw: new Audio('audio/swing-whoosh.mp3'),
    fire: new Audio('audio/burning-boss.mp3'),
    wind: new Audio('audio/wind.mp3'),
    windGust: new Audio('audio/wind-gust.mp3'),
    backgroundMusic: new Audio('audio/wildwest-soundtrack.mp3'),
    eggCracking: new Audio('audio/egg-cracking.mp3'),
  };

  /**
   * Creates a new AudioManager instance and initializes all sounds.
   */
  constructor() {
    this.sounds = this.sounds;
    this.isMuted = !soundFlag;
    this.masterVolume = 1.0;
    this.musicVolume = 0.2;
    this.sfxVolume = 0.8;
    this.initializeSounds();
  }

  /**
   * Initializes all sounds with default volume settings.
   * Sets background music to loop and applies appropriate volumes.
   */
  initializeSounds() {
    Object.keys(this.sounds).forEach(key => {
      if (key === 'backgroundMusic') {
        this.sounds[key].volume = this.musicVolume;
        this.sounds[key].loop = true;
      } else {
        this.sounds[key].volume = this.sfxVolume;
      }
    });
  }

  /**
   * Plays a sound with optional playback rate and volume adjustments.
   * @param {string} soundName - Name of the sound to play.
   * @param {number} playbackRate - Speed of playback (default 1.0).
   * @param {number|null} volume - Optional volume override.
   */
  playSound(soundName, playbackRate = 1.0, volume = null) {
    if (this.isMuted || !this.sounds[soundName]) return;

    const sound = this.sounds[soundName];
    sound.currentTime = 0;
    sound.playbackRate = playbackRate;

    if (volume !== null)
      sound.volume = volume * this.masterVolume;

    sound.play().catch(e => console.log('Audio play failed:', e));
  }

  /**
   * Sets the master volume level for all sounds.
   * @param {number} volume - Volume level between 0 and 1.
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  /**
   * Sets the music volume level.
   * @param {number} volume - Volume level between 0 and 1.
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.sounds.backgroundMusic.volume = this.musicVolume * this.masterVolume;
  }

  /**
   * Sets the sound effects volume level.
   * @param {number} volume - Volume level between 0 and 1.
   */
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  /**
   * Mutes all sounds by setting volumes to 0.
   */
  mute() {
    this.isMuted = true;
    Object.values(this.sounds).forEach(audio => {
      audio.volume = 0;
      saveSoundState(false)
    });
  }

  /**
   * Unmutes all sounds by restoring volume levels.
   */
  unmute() {
    this.isMuted = false;
    this.updateAllVolumes();
    saveSoundState(true);
  }

  /**
   * Toggles the mute state on/off.
   * @returns {boolean} Current mute state after toggle.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Updates all sound volumes based on master and category volumes.
   */
  updateAllVolumes() {
    Object.keys(this.sounds).forEach(key => {
      this.sounds[key].volume = key === 'backgroundMusic'
        ? this.musicVolume * this.masterVolume
        : this.sfxVolume * this.masterVolume;
    });
  }

  /**
   * Plays button click sound.
   */
  onClick() {
    this.playSound('click');
  }

  /**
   * Plays character jump sound.
   */
  onJump() {
    this.playSound('jump', 1.3);
  }

  /**
   * Plays character landing sound.
   */
  onLand() {
    this.playSound('land', 0.8);
  }

  /**
   * Plays character walking sound.
   */
  onWalk() {
    this.playSound('walk', 1.5);
  }

  /**
   * Plays character hurt sound.
   */
  onHurt() {
    this.playSound('hurt', 1.1);
  }

  /**
   * Plays character sleeping/snoring sound.
   */
  onSleep() {
    this.playSound('snoring', 1.1);
  }

  /**
   * Plays character death scream.
   */
  onDie() {
    this.playSound('dieScream', 1.1);
  }

  /**
   * Plays boss walking/footstep sound.
   */
  bossOnWalk() {
    this.playSound('bossFootStep', 2);
  }

  /**
   * Plays boss death scream.
   */
  bossOnDie() {
    this.playSound('bossDeathScream');
  }

  /**
   * Plays boss bite/attack sound.
   */
  bossOnBite() {
    this.playSound('bossBite', 2);
  }

  /**
 * Plays boss bite/attack sound.
 */
  bossOnGrowl() {
    this.playSound('bossGrowl');
  }

  /**
   * Plays chicken sound variant 1.
   */
  onChicken1() {
    this.playSound('chicken1');
  }

  /**
   * Plays chicken sound variant 2.
   */
  onChicken2() {
    this.playSound('chicken2', 0.9);
  }

  /**
   * Plays chicken sound variant 3.
   */
  onChicken3() {
    this.playSound('chickenHit', 1.4);
  }

  /**
   * Plays small chicken sound variant 1.
   */
  onChickenSmall1() {
    this.playSound('chickenSmall1');
  }

  /**
   * Plays small chicken sound variant 2.
   */
  onChickenSmall2() {
    this.playSound('chickenSmall2', 0.9);
  }

  /**
   * Plays small chicken sound variant 3.
   */
  onChickenSmall3() {
    this.playSound('chickenSmall3', 1.4);
  }

  /**
   * Plays chicken squish/death sound.
   */
  onChickenSquish() {
    this.playSound('chickenSquish', 1.2);
  }

  /**
   * Plays boss hurt sound.
   */
  onBossHurt() {
    this.playSound('bottleWhoosh');
  }

  /**
   * Plays coin collection sound.
   */
  onCoin() {
    this.playSound('coin', 1);
  }

  /**
   * Plays bottle collection sound.
   */
  onBottle() {
    this.playSound('bottle', 0.6);
  }

  /**
   * Plays bottle breaking sound.
   */
  onBottleBreak() {
    this.playSound('bottleBreak', 1.2);
  }

  /**
   * Plays throw action sound.
   */
  onThrow() {
    this.playSound('throw', 1.2);
  }

  /**
   * Plays fire/burning sound.
   */
  onFire() {
    this.playSound('fire', 0.7);
  }

  /**
   * Plays wind ambient sound.
   */
  onWind() {
    this.playSound('wind', 0.8);
  }

  /**
   * Plays wind gust sound.
   */
  onWindGust() {
    this.playSound('windGust', 1.1);
  }

  /**
 * Plays egg cracking sound.
 */
  onEggCracking() {
    this.playSound('eggCracking', 1);
  }


  /**
   * Starts playing background music.
   */
  startBackgroundMusic() {
    if (!this.isMuted) {
      this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }
  }
  
  /**
   * Stops background music and resets to start.
   */
  stopBackgroundMusic() {
    this.sounds.backgroundMusic.pause();
    this.sounds.backgroundMusic.currentTime = 0;
  }

  /**
   * Pauses background music at current position.
   */
  pauseBackgroundMusic() {
    this.sounds.backgroundMusic.pause();
  }

  /**
   * Resumes paused background music.
   */
  resumeBackgroundMusic() {
    if (!this.isMuted)
      this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
  }

  /**
   * Stops all currently playing sounds and resets them.
   */
  stopAllSounds() {
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}