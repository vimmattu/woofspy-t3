import EventEmitter from "events";

class ActivityDetector extends EventEmitter {
  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private source:
    | MediaElementAudioSourceNode
    | MediaStreamAudioSourceNode
    | undefined;
  private dataArray: Uint8Array;
  private activeTimer: ReturnType<typeof setTimeout> | undefined;

  sensitivty = 1.5;

  constructor() {
    super();
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.tick();
  }

  setSource = (source: HTMLMediaElement | MediaStream) => {
    if (this.source) this.source.disconnect();
    if (source instanceof HTMLMediaElement) {
      this.source = this.audioCtx.createMediaElementSource(source);
    } else if (source instanceof MediaStream) {
      this.source = this.audioCtx.createMediaStreamSource(source);
    }
    this.source?.connect(this.analyser);
  };

  private createTimer = () => {
    let isStart = true;

    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      isStart = false;
    }

    this.activeTimer = setTimeout(() => {
      this.activeTimer = undefined;
      this.emit("stop");
    }, 5000);

    isStart && this.emit("start");
  };

  private tick = () => {
    requestAnimationFrame(this.tick);
    this.analyser.getByteTimeDomainData(this.dataArray);

    const highestActivity = this.dataArray.reduce(
      (prevMax, curr) => Math.max(prevMax, curr / 128.0),
      0
    );

    if (highestActivity < this.sensitivty) return;

    this.createTimer();
  };
}

export default ActivityDetector;
