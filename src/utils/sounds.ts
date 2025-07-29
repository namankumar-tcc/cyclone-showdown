// Simple sound generation using Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play a correct answer sound (cheerful ascending chime)
  playCorrectSound() {
    const ctx = this.getAudioContext();
    
    // Create a nice bell-like sound with harmonics
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gainNode.gain.setValueAtTime(0.8, ctx.currentTime + index * 0.1); // Much louder
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.8);

      oscillator.start(ctx.currentTime + index * 0.1);
      oscillator.stop(ctx.currentTime + index * 0.1 + 0.8);
    });
  }

  // Play a wrong answer sound (sympathetic "aww" tone)
  playWrongSound() {
    const ctx = this.getAudioContext();
    
    // Create a more sympathetic "aww" sound
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    // Start high and go low like "awww"
    oscillator1.frequency.setValueAtTime(440, ctx.currentTime); // A4
    oscillator1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.8); // A3
    
    oscillator2.frequency.setValueAtTime(330, ctx.currentTime); // E4
    oscillator2.frequency.exponentialRampToValueAtTime(165, ctx.currentTime + 0.8); // E3

    gainNode.gain.setValueAtTime(0.7, ctx.currentTime); // Much louder
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 1);
    oscillator2.start(ctx.currentTime);
    oscillator2.stop(ctx.currentTime + 1);
  }

  // Play a celebration sound like "YAAAAAYYY!"
  playCelebrationSound() {
    const ctx = this.getAudioContext();
    
    // Create an exciting "YAAAAAYYY!" celebration sound
    // First part: Rising "YAA" sound
    const yaaOscillator = ctx.createOscillator();
    const yaaGain = ctx.createGain();
    
    yaaOscillator.connect(yaaGain);
    yaaGain.connect(ctx.destination);
    
    yaaOscillator.type = 'sawtooth';
    yaaOscillator.frequency.setValueAtTime(200, ctx.currentTime);
    yaaOscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5);
    
    yaaGain.gain.setValueAtTime(0.9, ctx.currentTime); // Very loud!
    yaaGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    yaaOscillator.start(ctx.currentTime);
    yaaOscillator.stop(ctx.currentTime + 0.8);
    
    // Second part: Celebratory chimes
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, G5, C6, E6
    const chimeTimings = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
    
    chimeFreqs.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + chimeTimings[index]);

      gainNode.gain.setValueAtTime(0.8, ctx.currentTime + chimeTimings[index]);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + chimeTimings[index] + 0.5);

      oscillator.start(ctx.currentTime + chimeTimings[index]);
      oscillator.stop(ctx.currentTime + chimeTimings[index] + 0.5);
    });
    
    // Third part: Ending flourish
    setTimeout(() => {
      const flourishOsc = ctx.createOscillator();
      const flourishGain = ctx.createGain();
      
      flourishOsc.connect(flourishGain);
      flourishGain.connect(ctx.destination);
      
      flourishOsc.type = 'square';
      flourishOsc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
      flourishOsc.frequency.exponentialRampToValueAtTime(2093.00, ctx.currentTime + 0.3); // C7
      
      flourishGain.gain.setValueAtTime(0.8, ctx.currentTime);
      flourishGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      flourishOsc.start(ctx.currentTime);
      flourishOsc.stop(ctx.currentTime + 0.4);
    }, 1300);
  }
}

export const soundGenerator = new SoundGenerator();