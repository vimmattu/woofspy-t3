import { useEffect, useRef } from "react";
import { PusherHandler } from "../utils/client-signaling";

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
    const signal = new PusherHandler(sessionId);

    const createPeer = (userId: string) => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
      peer.addEventListener(
        "icecandidate",
        ({ candidate: data }) =>
          data && signal.send(userId, "icecandidate", data)
      );
      return peer;
    };

    signal.on("join", async (event: CustomEvent<string>) => {
      const userId = event.detail;
      if (!isHost) return;

      const peer = createPeer(userId);
      remotes.current.set(userId, peer);
      stream?.getTracks().forEach((track) => peer.addTrack(track, stream));

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      signal.send(userId, "offer", offer);
    });

    signal.on(
      "offer",
      async (
        event: CustomEvent<{ userId: string; data: RTCSessionDescription }>
      ) => {
        if (isHost) return;
        const { userId, data } = event.detail;
        console.log(`Received signal from ${userId} of type offer`);

        const peer = createPeer(userId);
        peer.addEventListener("track", (event) => {
          if (event.track.kind === "video") {
            onStreamChanged?.(event.streams[0]);
          }
        });

        remotes.current.set(userId, peer);
        await peer.setRemoteDescription(data);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        signal.send(userId, "answer", answer);
      }
    );

    signal.on(
      "answer",
      async (
        event: CustomEvent<{ userId: string; data: RTCSessionDescription }>
      ) => {
        if (!isHost) return;
        const { userId, data } = event.detail;
        console.log(`Received signal from ${userId} of type answer`);
        const peer = remotes.current.get(userId);
        if (!peer) return;
        await peer.setRemoteDescription(data);
      }
    );

    signal.on(
      "icecandidate",
      async (event: CustomEvent<{ userId: string; data: RTCIceCandidate }>) => {
        const { userId, data } = event.detail;
        console.log(`Received signal from ${userId} of type icecandidate`);
        const peer = remotes.current.get(userId);
        if (!peer) return;
        await peer.addIceCandidate(data);
      }
    );

    signal.on("leave", (event: CustomEvent<string>) => {
      const userId = event.detail;
      const peer = remotes.current.get(userId);
      if (peer) {
        peer.close();
        remotes.current.delete(userId);
      }
    });

    return () => {
      signal.close();
    };
  }, [isHost, stream]);
};
