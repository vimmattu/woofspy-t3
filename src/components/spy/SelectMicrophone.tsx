import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaDevices } from "../../hooks/devices";
import { BaseDeviceAskProps } from "./types";
import WaveSurfer from "wavesurfer.js";

const MicrophoneSelection: React.FC<BaseDeviceAskProps> = (props) => {
  const displayInfo = !props.stream && !props.error;

  return (
    <>
      <h1 className="mb-2 text-center text-2xl">Microphone selection</h1>
      {displayInfo ? (
        <InitialPrompt {...props} />
      ) : (
        <MicrophonePreview {...props} />
      )}
    </>
  );
};

const InitialPrompt: React.FC<BaseDeviceAskProps> = ({ askForDevice }) => {
  return (
    <>
      <p className="mb-2">
        Next step is to select microphone you&apos;d like to use. Microphone use
        is <i>required</i> for woofspy to work.
      </p>
      <p className="mb-2">
        The browser will ask for permissions for microphone usage.
      </p>
      <button
        className="mb-2 w-full rounded bg-blue-500 p-2 text-white"
        onClick={() => askForDevice()}
      >
        Select microphone
      </button>
    </>
  );
};

const MicrophonePreview: React.FC<BaseDeviceAskProps> = ({
  stream,
  error,
  proceedSetup,
  onChangeDevice,
}) => {
  const devices = useMediaDevices();
  const [selected, setSelected] = useState<string>();

  const videoDevices = devices.filter((d) => d.kind === "audioinput");
  if (error)
    return (
      <>
        <h2 className="text-center text-xl text-red-500">Error happened :(</h2>
        <p className="text-center text-red-500">{error.message}</p>
      </>
    );

  function handleChange(id: string) {
    setSelected(id);
    onChangeDevice && onChangeDevice(id);
  }

  function proceed() {
    proceedSetup(selected || devices[0]?.deviceId);
  }

  return (
    <>
      <WaveForm stream={stream} />
      <select
        onChange={(e) => handleChange(e.target.value)}
        value={selected}
        className="my-2 w-full rounded-sm border-2 border-gray-300 p-1"
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <button
        className="w-full rounded bg-blue-500 p-2 text-white"
        onClick={proceed}
      >
        Next
      </button>
    </>
  );
};

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
      audioScriptProcessor.onaudioprocess = undefined;
    };
  }, [stream]);

  return <div className="w-full" ref={containerRef} />;
};

export default MicrophoneSelection;
