// Simple sound generation using Web Audio API
class SoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play a correct answer sound (cheerful ascending tone)
  playCorrectSound() {
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  // Play a wrong answer sound (gentle descending tone)
  playWrongSound() {
    const ctx = this.getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
    oscillator.frequency.setValueAtTime(329.63, ctx.currentTime + 0.15); // E4
    oscillator.frequency.setValueAtTime(261.63, ctx.currentTime + 0.3); // C4

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  }

  // Play a celebration sound (multiple ascending tones)
  playCelebrationSound() {
    const ctx = this.getAudioContext();
    
    // Play multiple cheerful notes
    const notes = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.1 },   // E5
      { freq: 783.99, time: 0.2 },   // G5
      { freq: 1046.50, time: 0.3 },  // C6
      { freq: 783.99, time: 0.4 },   // G5
      { freq: 1046.50, time: 0.5 },  // C6
    ];

    notes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.3);

      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + 0.3);
    });
  }
}

export const soundGenerator = new SoundGenerator();