import { useEffect, useState } from 'react';

interface ElementSize {
  width: number;
  height: number;
}

export function useElementSize<TElement extends HTMLElement>(
  element: TElement | null,
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();

      setSize({
        width: rect.width,
        height: rect.height,
      });
    };
    const observer = new ResizeObserver(updateSize);

    updateSize();
    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  return size;
}
