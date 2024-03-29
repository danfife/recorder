class AudioRecorder {
  constructor(button) {
    this.isRecording = false;
    this.recordedBlobs = [];

    [['mousedown', 'mouseup'], ['touchstart', 'touchend']].forEach(([start, end]) => {
      button.addEventListener(start, () => this.startRecording());
      button.addEventListener(end, () => this.stopRecording());
    })
  }

  startRecording() {
    if (this.isRecording) return;
    this.recordedBlobs = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = event => {
          this.recordedBlobs.push(event.data)
          this.playRecording()
        };
        this.mediaRecorder.start();
      })
      .catch(error => console.error('Error accessing microphone:', error));
  }

  stopRecording() {
    if (!this.isRecording) return;

    this.isRecording = false;
    this.mediaRecorder.stop();
  }

  playRecording() {
    if (!this.recordedBlobs.length) return;

    const combinedBlob = new Blob(this.recordedBlobs, { type: 'audio/webm' });
    const audioURL = URL.createObjectURL(combinedBlob);

    const audioElement = new Audio(audioURL);
    audioElement.play();

    // Clean up after playback
    audioElement.onended = () => URL.revokeObjectURL(audioURL);
  }
}

// Example usage
const recorder = new AudioRecorder(document.getElementById('recordButton'));
