import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveForm = ({ stream }: { stream?: MediaStream }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stream) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const audioScriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      audioContext,
      audioScriptProcessor,
      barWidth: 2,
      interact: false,
    });

    source.connect(audioScriptProcessor);
    audioScriptProcessor.connect(audioContext.destination);

    audioScriptProcessor.onaudioprocess = (event) => {
      ws.empty();
      ws.loadDecodedBuffer(event.inputBuffer);
    };

    return () => {
      ws.destroy();
      source.disconnect();
      audioScriptProcessor.disconnect();
      audioScriptProcessor.onaudioprocess = null;
    };
  }, [stream]);

  return <div className="w-full" ref={containerRef} />;
};

export default WaveForm;
