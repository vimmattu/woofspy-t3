import { useEffect, useRef } from "react";
import { PusherHandler, SseHandler } from "../utils/client-signaling";
import { env } from "../env/client.mjs";
import { useSpyMode } from "./spy";

interface Opts {
  sessionId: string;
  streamToSend?: MediaStream;
  onRemoteStream?: (stream?: MediaStream) => void;
}

export const useLiveConnection = ({
  sessionId,
  streamToSend,
  onRemoteStream,
}: Opts) => {
  const [isHost] = useSpyMode();
  const remotes = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    if (!sessionId) return;
    if (isHost && !streamToSend) return;
    const signal = env.NEXT_PUBLIC_DEV
      ? new SseHandler(sessionId)
      : new PusherHandler(sessionId);

    const createPeer = (userId: string) => {
      const peer = new RTCPeerConnection({
        // iceTransportPolicy: "relay",
        iceServers: [
          {
            urls: "stun:37.27.8.127:3478",
          },
          {
            username: "user1",
            credential: "user1",
            urls: "turn:37.27.8.127:3478?transport=tcp",
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
      streamToSend
        ?.getTracks()
        .forEach((track) => peer.addTrack(track, streamToSend));

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
          console.log("ON REMOTE!", event.streams[0]);
          onRemoteStream && onRemoteStream(event.streams[0]);
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
  }, [isHost, streamToSend, sessionId]);
};
