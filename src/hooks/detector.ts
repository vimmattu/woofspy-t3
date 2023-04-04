import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStream } from "./devices";

const sensitivityAtom = atom<number>(1.5);
const sensitivityEditableAtom = atom<boolean>(true);
export const useSensitivity = () => useAtom(sensitivityAtom);
export const useSensitivityEditable = () => useAtom(sensitivityEditableAtom);

const useAnimationFrame = (handler: () => void) => {
  const frame = useRef(0);

  const animate = useCallback(() => {
    handler();
    frame.current = requestAnimationFrame(animate);
  }, [handler]);

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [animate]);
};

const useTimer = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return () => {
    const timer = timeoutRef.current;

    const tick = () => {
      savedCallback.current();
      clearInterval(timer);
      timeoutRef.current = undefined;
    };

    if (timer) clearInterval(timer);

    timeoutRef.current = setTimeout(tick, delay);
  };
};

interface IActivityDetector {
  onStart?: () => void | undefined;
  onEnd?: () => void | undefined;
}

export const useActivityDetector = ({ onStart, onEnd }: IActivityDetector) => {
  const [stream] = useStream();
  const [sensitivity] = useSensitivity();
  const [, setSensitivityEditable] = useSensitivityEditable();
  const audioCtx = useRef(new AudioContext());
  const analyser = useRef(audioCtx.current.createAnalyser());
  const dataArray = useRef(new Uint8Array(analyser.current.frequencyBinCount));
  const initialRender = useRef(true);
  const [active, setActive] = useState(false);

  const triggerTimer = useTimer(() => {
    setActive(false);
    setSensitivityEditable(true);
  }, 5000);

  const handleAnimationFrame = useCallback(() => {
    analyser.current.getByteTimeDomainData(dataArray.current);

    const highestActivity = dataArray.current.reduce(
      (prevMax, curr) => Math.max(prevMax, curr / 128.0),
      0
    );

    if (highestActivity < sensitivity) return;

    setActive(true);
    setSensitivityEditable(false);
    triggerTimer();
  }, [sensitivity, triggerTimer]);

  useAnimationFrame(handleAnimationFrame);

  useEffect(() => {
    if (!stream) return;
    if (!stream.getAudioTracks().length) return;
    audioCtx.current.createMediaStreamSource(stream).connect(analyser.current);
  }, [stream]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (active) onStart && onStart();
    else onEnd && onEnd();
  }, [active, onStart, onEnd]);

  return active;
};
