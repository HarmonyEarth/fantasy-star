import { useState, useEffect, useCallback } from 'react';

interface TouchState {
  active: boolean;
  position: { x: number; y: number };
  direction: { x: number; y: number };
  startPosition: { x: number; y: number };
}

export function useTouch(selectedDeviceIsTouch: boolean) {
  const [touchState, setTouchState] = useState<TouchState>({
    active: false,
    position: { x: 120, y: window.innerHeight - 200 }, // Initial fixed position
    direction: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
  });

  const handleStart = useCallback((x: number, y: number) => {
    setTouchState((prev) => ({
      ...prev,
      active: true,
      startPosition: { x, y },
    }));
  }, []);

  const handleMove = useCallback((x: number, y: number) => {
    setTouchState((prev) => {
      if (!prev.active) return prev;

      const deltaX = x - prev.startPosition.x;
      const deltaY = y - prev.startPosition.y;
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxRadius = 50;

      const normalizedX =
        length > maxRadius ? (deltaX / length) * maxRadius : deltaX;
      const normalizedY =
        length > maxRadius ? (deltaY / length) * maxRadius : deltaY;

      return {
        ...prev,
        direction: {
          x: normalizedX / maxRadius,
          y: normalizedY / maxRadius,
        },
      };
    });
  }, []);

  const handleEnd = useCallback(() => {
    setTouchState((prev) => ({
      ...prev,
      active: false,
      direction: { x: 0, y: 0 },
    }));
  }, []);

  useEffect(() => {
    if (!selectedDeviceIsTouch) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (touchState.active) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    const element = document.getElementById('root');
    const controller = new AbortController();

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, {
        signal: controller.signal,
        passive: false,
      });
      element.addEventListener('touchmove', handleTouchMove, {
        signal: controller.signal,
        passive: false,
      });
      element.addEventListener('touchend', handleTouchEnd, {
        signal: controller.signal,
      });
      element.addEventListener('mousedown', handleMouseDown, {
        signal: controller.signal,
      });
      element.addEventListener('mousemove', handleMouseMove, {
        signal: controller.signal,
      });
      element.addEventListener('mouseup', handleMouseUp, {
        signal: controller.signal,
      });
    }

    return () => {
      controller.abort();
    };
  }, [
    selectedDeviceIsTouch,
    handleStart,
    handleMove,
    handleEnd,
    touchState.active,
  ]);

  return {
    direction: touchState.direction,
    active: touchState.active,
    position: touchState.position,
  };
}
