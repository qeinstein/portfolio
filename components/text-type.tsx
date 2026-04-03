"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TextTypeProps = {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
};

export function TextType({
  texts,
  typingSpeed = 55,
  deletingSpeed = 28,
  pauseDuration = 1400,
  className
}: TextTypeProps) {
  const safeTexts = useMemo(() => texts.filter(Boolean), [texts]);
  const prefersReducedMotion = useReducedMotion();
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (safeTexts.length === 0 || prefersReducedMotion) {
      return;
    }

    const currentText = safeTexts[textIndex % safeTexts.length];

    if (!isDeleting && displayedText === currentText) {
      const pauseTimer = window.setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);

      return () => window.clearTimeout(pauseTimer);
    }

    if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setTextIndex((current) => (current + 1) % safeTexts.length);
      return;
    }

    const nextText = isDeleting
      ? currentText.slice(0, displayedText.length - 1)
      : currentText.slice(0, displayedText.length + 1);

    const timer = window.setTimeout(
      () => setDisplayedText(nextText),
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => window.clearTimeout(timer);
  }, [
    deletingSpeed,
    displayedText,
    isDeleting,
    pauseDuration,
    prefersReducedMotion,
    safeTexts,
    textIndex,
    typingSpeed
  ]);

  if (safeTexts.length === 0) {
    return null;
  }

  if (prefersReducedMotion) {
    return <span className={className}>{safeTexts[0]}</span>;
  }

  return (
    <span className={className}>
      {displayedText}
      <span className="ml-0.5 inline-block h-[1.05em] w-[1px] translate-y-[0.15em] bg-current align-baseline text-accent animate-[pulse_1s_ease-in-out_infinite]" />
    </span>
  );
}
