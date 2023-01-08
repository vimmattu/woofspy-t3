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

  on(event: string, callback: any) {
    this.addEventListener(event, callback);
  }

  onJoin(_userId: string) {
    throw new Error("Not implemented");
  }

  onLeave(_userId: string) {
    throw new Error("Not implemented");
  }

  onOffer(_userId: string, _offer: RTCSessionDescription) {
    throw new Error("Not implemented");
  }

  onAnswer(_userId: string, _answer: RTCSessionDescription) {
    throw new Error("Not implemented");
  }

  onIceCandidate(_userId: string, _candidate: RTCIceCandidate) {
    throw new Error("Not implemented");
  }

  send(_userId: string, _type: string, _data: any) {
    throw new Error("Not implemented");
  }

  close() {
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

  onJoin(userId: string) {
    this.dispatchEvent(new CustomEvent("join", { detail: userId }));
  }

  onLeave(userId: string) {
    this.dispatchEvent(new CustomEvent("leave", { detail: userId }));
  }

  onOffer(userId: string, offer: RTCSessionDescriptionInit) {
    this.dispatchEvent(
      new CustomEvent("offer", { detail: { userId, data: offer } })
    );
  }

  onAnswer(userId: string, answer: RTCSessionDescriptionInit) {
    this.dispatchEvent(
      new CustomEvent("answer", { detail: { userId, data: answer } })
    );
  }

  onIceCandidate(userId: string, candidate: RTCIceCandidateInit) {
    this.dispatchEvent(
      new CustomEvent("icecandidate", { detail: { userId, data: candidate } })
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
