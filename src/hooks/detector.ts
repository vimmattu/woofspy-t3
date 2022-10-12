import { useCallback, useEffect, useRef, useState } from "react";

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
  stream?: MediaStream;
  sensitivity: number;
  onStart: () => void | undefined;
  onEnd: () => void | undefined;
}

export const useActivityDetector = ({
  stream,
  sensitivity = 1.5,
  onStart,
  onEnd,
}: IActivityDetector) => {
  const audioCtx = useRef(new AudioContext());
  const analyser = useRef(audioCtx.current.createAnalyser());
  const dataArray = useRef(new Uint8Array(analyser.current.frequencyBinCount));
  const initialRender = useRef(true);
  const [active, setActive] = useState(false);

  const triggerTimer = useTimer(() => {
    setActive(false);
  }, 5000);

  const handleAnimationFrame = useCallback(() => {
    analyser.current.getByteTimeDomainData(dataArray.current);

    const highestActivity = dataArray.current.reduce(
      (prevMax, curr) => Math.max(prevMax, curr / 128.0),
      0
    );

    if (highestActivity < sensitivity) return;

    setActive(true);
    triggerTimer();
  }, [sensitivity]);

  useAnimationFrame(handleAnimationFrame);

  useEffect(() => {
    if (!stream) return;
    audioCtx.current.createMediaStreamSource(stream).connect(analyser.current);
  }, [stream]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    active ? onStart() : onEnd();
  }, [active]);
};
