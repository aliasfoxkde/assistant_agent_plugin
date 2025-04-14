// Sound Effects for MENTOR Learning Platform

/**
 * Create and play a slide sound effect
 * @param {number} duration - Duration of the slide sound in milliseconds
 * @param {number} frequency - Starting frequency of the slide sound
 * @param {number} endFrequency - Ending frequency of the slide sound
 */
function playSlideSound(duration = 300, frequency = 800, endFrequency = 400) {
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create oscillator
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Set oscillator type and frequency
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(endFrequency, audioCtx.currentTime + duration / 1000);
    
    // Set gain (volume)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Start and stop oscillator
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
    
    return true;
  } catch (error) {
    console.error('Error playing slide sound:', error);
    return false;
  }
}

/**
 * Create and play a notification sound effect
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
function playNotificationSound(type = 'info') {
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create oscillator
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Set parameters based on notification type
    let frequency, duration, waveType;
    
    switch (type) {
      case 'success':
        frequency = 800;
        duration = 200;
        waveType = 'sine';
        break;
      case 'error':
        frequency = 300;
        duration = 400;
        waveType = 'triangle';
        break;
      case 'info':
      default:
        frequency = 600;
        duration = 150;
        waveType = 'sine';
        break;
    }
    
    // Set oscillator type and frequency
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Set gain (volume)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 1000);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Start and stop oscillator
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
    
    return true;
  } catch (error) {
    console.error('Error playing notification sound:', error);
    return false;
  }
}

// Export functions
export { playSlideSound, playNotificationSound };
