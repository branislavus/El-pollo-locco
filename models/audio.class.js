class AudioManager {
  constructor() {
    this.sounds = {
      // Button & UI Sounds
      click: new Audio('audio/button.mp3'),

      // Character Sounds
      jump: new Audio('audio/jumping.mp3'),
      land: new Audio('audio/land.mp3'),
      walk: new Audio('audio/walking-in-sand.mp3'),
      hurt: new Audio('audio/yelp-in-pain.mp3'),
      snoring: new Audio('audio/snoring.mp3'),
      dieScream: new Audio('audio/die-scream.mp3'),

      // Enemy Sounds
      chicken1: new Audio('audio/chicken-noise1.mp3'),
      chicken2: new Audio('audio/chicken-noise2.mp3'),
      chicken3: new Audio('audio/chicken-noise3.mp3'),
      chickenSmall1: new Audio('audio/chicen-small1.mp3'),
      chickenSmall2: new Audio('audio/chicen-small2.mp3'),
      chickenSmall3: new Audio('audio/chicen-small3.mp3'),
      chickenSquish: new Audio('audio/chicken-squish.mp3'),

      // Boss Sounds
      bossBite: new Audio('audio/boss-bite.mp3'),
      bossDeathScream: new Audio('audio/boss-death-scream.mp3'),
      bossFootStep: new Audio('audio/boss-footstep.mp3'),


      // Item Sounds
      coin: new Audio('audio/coin.mp3'),
      bottle: new Audio('audio/bottle.mp3'),
      bottleBreak: new Audio('audio/broken-bottle.mp3'),
      bottleWhoosh: new Audio('audio/whoosh-bottle.mp3'),

      // Action Sounds
      throw: new Audio('audio/swing-whoosh.mp3'),
      fire: new Audio('audio/burning-boss.mp3'),

      // Environment Sounds
      wind: new Audio('audio/wind.mp3'),
      windGust: new Audio('audio/wind-gust.mp3'),

      // Background Music
      backgroundMusic: new Audio('audio/wildwest-soundtrack.mp3')
    };

    this.isMuted = false;
    this.masterVolume = 1.0;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.8;

    this.initializeSounds();
  }

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

  // Core sound playing method
  playSound(soundName, playbackRate = 1.0, volume = null) {
    if (this.isMuted || !this.sounds[soundName]) return;

    const sound = this.sounds[soundName];
    sound.currentTime = 0;
    sound.playbackRate = playbackRate;

    if (volume !== null) {
      sound.volume = volume * this.masterVolume;
    }

    sound.play().catch(e => console.log('Audio play failed:', e));
  }

  // Volume and mute controls
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.sounds.backgroundMusic.volume = this.musicVolume * this.masterVolume;
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  updateAllVolumes() {
    Object.keys(this.sounds).forEach(key => {
      if (key === 'backgroundMusic') {
        this.sounds[key].volume = this.musicVolume * this.masterVolume;
      } else {
        this.sounds[key].volume = this.sfxVolume * this.masterVolume;
      }
    });
  }

  // ===== GAME SOUND METHODS =====

  // Button & UI Sounds
  onClick() {
    this.playSound('click');
  }

  // Character Sounds
  onJump() {
    this.playSound('jump', 1.3);
  }

  onLand() {
    this.playSound('land', 0.8);
  }

  onWalk() {
    this.playSound('walk', 1.5);
  }

  onHurt() {
    this.playSound('hurt', 0.6);
  }

  onSleep() {
    this.playSound('snoring', 1.1);
  }

  onDie() {
    this.playSound('dieScream', 1.1);
  }

  // Boss sounds

  bossOnWalk() {
    this.playSound('bossFootStep', 2);
  }

  bossOnDie() {
    this.playSound('bossDeathScream');
  }

  bossOnBite() {
    this.playSound('bossBite');
  }


  // Enemy Sounds
  onChicken1() {
    this.playSound('chicken1');
  }

  onChicken2() {
    this.playSound('chicken2', 0.9);
  }

  onChicken3() {
    this.playSound('chickenHit', 1.4);
  }

  onChickeSmall1() {
    this.playSound('chickenSmall1');
  }

  onChickenSmall2() {
    this.playSound('chickenSmall2', 0.9);
  }

  onChickenSmall3() {
    this.playSound('chickenSmall3', 1.4);
  }

  onChickenSquish() {
    this.playSound('chickenSquish', 1.2);
  }

  onBossHurt() {
    this.playSound('bottleWhoosh');
  }

  // Item Sounds
  onCoin() {
    this.playSound('coin', 1);
  }

  onBottle() {
    this.playSound('bottle', 0.6);
  }

  onBottleBreak() {
    this.playSound('bottleBreak', 1.2);
  }

  // Action Sounds
  onThrow() {
    this.playSound('throw', 1.2);
  }

  onFire() {
    this.playSound('fire', 0.7);
  }

  // Environment Sounds
  onWind() {
    this.playSound('wind', 0.8);
  }

  onWindGust() {
    this.playSound('windGust', 1.1);
  }

  // Background Music
  startBackgroundMusic() {
    if (!this.isMuted) {
      this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }
  }

  stopBackgroundMusic() {
    this.sounds.backgroundMusic.pause();
    this.sounds.backgroundMusic.currentTime = 0;
  }

  pauseBackgroundMusic() {
    this.sounds.backgroundMusic.pause();
  }

  resumeBackgroundMusic() {
    if (!this.isMuted) {
      this.sounds.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }
  }

  // Stop all sounds method
  stopAllSounds() {
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

// Global instance for easy access
const audioManager = new AudioManager();