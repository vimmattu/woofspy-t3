import { useEffect, useRef } from "react";

const post = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(res.body);
  }
};

interface Opts {
  sessionId?: string;
  isHost?: boolean;
  stream?: MediaStream;
  onStreamChanged?: (stream?: MediaStream) => void;
}

export const useLiveConnection = ({
  sessionId,
  isHost = false,
  stream,
  onStreamChanged,
}: Opts) => {
  const remotes = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    if (!sessionId) return;
    const endpoint = `/api/sessions/${sessionId}/sse`;
    const eventSource = new EventSource(endpoint);

    eventSource.addEventListener(
      "join",
      async (event: MessageEvent<string>) => {
        const { userId } = JSON.parse(event.data);
        console.log(`User ${userId} joined`);
        if (!isHost) return;

        const peer = new RTCPeerConnection();
        // handle ice candidates
        peer.addEventListener("icecandidate", (event) => {
          if (event.candidate) {
            post(endpoint, {
              to: userId,
              type: "icecandidate",
              data: event.candidate,
            });
          }
        });

        remotes.current.set(userId, peer);
        stream?.getTracks().forEach((track) => peer.addTrack(track, stream));

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await post(endpoint, {
          to: userId,
          type: "offer",
          data: offer,
        });
      }
    );

    eventSource.addEventListener(
      "offer",
      async (event: MessageEvent<string>) => {
        if (isHost) return;
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type offer`);

        const peer = new RTCPeerConnection();
        // handle ice candidates
        peer.addEventListener("icecandidate", async (event) => {
          if (event.candidate) {
            await post(endpoint, {
              to: userId,
              type: "icecandidate",
              data: event.candidate,
            });
          }
        });

        peer.addEventListener("track", (event) => {
          if (event.track.kind === "video") {
            onStreamChanged?.(event.streams[0]);
          }
        });

        remotes.current.set(userId, peer);
        await peer.setRemoteDescription(data);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await post(endpoint, {
          to: userId,
          type: "answer",
          data: answer,
        });
      }
    );

    eventSource.addEventListener(
      "answer",
      async (event: MessageEvent<string>) => {
        if (!isHost) return;
        // handle answer
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type answer`);
        const peer = remotes.current.get(userId);
        if (!peer) return;
        await peer.setRemoteDescription(data);
      }
    );

    eventSource.addEventListener(
      "icecandidate",
      async (event: MessageEvent<string>) => {
        const { userId, data } = JSON.parse(event.data);
        console.log(`Received signal from ${userId} of type icecandidate`);
        const peer = remotes.current.get(userId);
        if (!peer) return;
        await peer.addIceCandidate(data);
      }
    );

    eventSource.addEventListener("leave", (event: MessageEvent<string>) => {
      const { userId } = JSON.parse(event.data);
      console.log(`User ${userId} left`);

      const peer = remotes.current.get(userId);
      if (peer) {
        peer.close();
        remotes.current.delete(userId);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [sessionId, isHost, stream]);
};
