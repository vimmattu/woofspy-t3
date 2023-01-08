class SignalingHandler extends EventTarget {
  constructor(_sessionId: string) {
    super();
    this.onJoin = this.onJoin.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onOffer = this.onOffer.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
    this.onIceCandidate = this.onIceCandidate.bind(this);
    this.send = this.send.bind(this);
    this.close = this.close.bind(this);
  }

  protected onJoin(userId: string) {
    this.dispatchEvent(new CustomEvent("join", { detail: userId }));
  }

  protected onLeave(userId: string) {
    this.dispatchEvent(new CustomEvent("leave", { detail: userId }));
  }

  protected onOffer(userId: string, offer: RTCSessionDescriptionInit) {
    this.dispatchEvent(
      new CustomEvent("offer", { detail: { userId, data: offer } })
    );
  }

  protected onAnswer(userId: string, answer: RTCSessionDescriptionInit) {
    this.dispatchEvent(
      new CustomEvent("answer", { detail: { userId, data: answer } })
    );
  }

  protected onIceCandidate(userId: string, candidate: RTCIceCandidateInit) {
    this.dispatchEvent(
      new CustomEvent("icecandidate", { detail: { userId, data: candidate } })
    );
  }

  public on(event: string, callback: any) {
    this.addEventListener(event, callback);
  }

  public send(_userId: string, _type: string, _data: any) {
    throw new Error("Not implemented");
  }

  public close() {
    throw new Error("Not implemented");
  }
}

export class SseHandler extends SignalingHandler {
  private endpoint: string;
  private eventSource: EventSource;

  constructor(sessionId: string) {
    super(sessionId);
    this.endpoint = `/api/sessions/${sessionId}/sse`;

    this.eventSource = new EventSource(this.endpoint);

    this.eventSource.addEventListener("join", (event: MessageEvent<string>) => {
      const { userId } = JSON.parse(event.data);
      console.log(`User ${userId} joined`);
      this.onJoin(userId);
    });

    this.eventSource.addEventListener(
      "leave",
      (event: MessageEvent<string>) => {
        const { userId } = JSON.parse(event.data);
        console.log(`User ${userId} left`);
        this.onLeave(userId);
      }
    );

    this.eventSource.addEventListener(
      "offer",
      (event: MessageEvent<string>) => {
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type offer`);
        this.onOffer(userId, data);
      }
    );

    this.eventSource.addEventListener(
      "answer",
      (event: MessageEvent<string>) => {
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type answer`);
        this.onAnswer(userId, data);
      }
    );

    this.eventSource.addEventListener(
      "icecandidate",
      (event: MessageEvent<string>) => {
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type icecandidate`);
        this.onIceCandidate(userId, data);
      }
    );
  }

  send(userId: string, type: string, data: any) {
    const payload = JSON.stringify({ to: userId, data, type });
    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
  }

  close() {
    this.eventSource.close();
  }
}
