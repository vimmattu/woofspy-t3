import EventEmitter from "events";

class ActivityRecorder extends EventEmitter {
  private recorder: MediaRecorder | undefined;

  constructor() {
    super();
  }

  setSource = (stream: MediaStream) => {
    //if (this.recorder) this.recorder.stop();

    const mimeType = !!stream.getVideoTracks().length
      ? "video/webm"
      : !!stream.getAudioTracks().length
        ? "audio/webm"
        : undefined;

    if (!mimeType) throw new Error("No video or audio tracks found in stream");

    this.recorder = new MediaRecorder(stream, {
      mimeType,
    });

    this.recorder.ondataavailable = (ev: BlobEvent) => {
      this.emit("recording-available", ev);
    };
  };

  start = () => {
    if (!this.recorder)
      return console.warn(
        "Tried to start ActivityRecorder, but source wasnt set"
      );
    this.recorder.start();
  };

  stop = () => {
    if (!this.recorder) {
      return console.warn(
        "Tried to stop ActivityRecorder, but source wasnt set"
      );
    }
    this.recorder.stop();
  };
}

export default ActivityRecorder;
