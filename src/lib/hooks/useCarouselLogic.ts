import { useCallback } from "react";

export function useCarouselLogic(length, activeIndex, setActiveIndex) {
  const normalize = useCallback(
    (i) => (i + length) % length,
    [length]
  );

  const next = () => setActiveIndex((i) => normalize(i + 1));
  const prev = () => setActiveIndex((i) => normalize(i - 1));

  const getRelativeIndex = (index) => {
    let diff = index - activeIndex;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  };

  return { next, prev, getRelativeIndex };
}
