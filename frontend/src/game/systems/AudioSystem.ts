class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
      this.isMuted = true; // degrade gracefully
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playDiscoverySound() {
    // Ascending arpeggio
    this.playTone(440, 'sine', 0.5, 0.1);
    setTimeout(() => this.playTone(554.37, 'sine', 0.5, 0.1), 150);
    setTimeout(() => this.playTone(659.25, 'sine', 1.0, 0.15), 300);
  }

  public playInteractionSound() {
    // Subtle digital click
    this.playTone(800, 'square', 0.1, 0.05);
  }

  public playCoreSound() {
    // Deep resonant drone
    this.playTone(110, 'sawtooth', 2.0, 0.2);
    setTimeout(() => this.playTone(55, 'sine', 3.0, 0.3), 100);
  }
}

export const audioSystem = new AudioSystem();
