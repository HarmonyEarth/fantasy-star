import { INPUT_DEVICES } from '../constants';
import type { InputDevice } from '../types';

// Utility functions to detect available input devices
const detectKeyboard = (): boolean => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') return false;

  // Check if the device has a physical keyboard
  // This isn't perfect but helps detect mobile vs desktop
  return (
    !('ontouchstart' in window) || // No touch support typically means desktop
    navigator.maxTouchPoints === 0 || // No touch points
    window.matchMedia('(pointer: fine)').matches
  ); // Has precise pointer (mouse)
};

const detectTouch = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get initial available devices
export const getInitialDevices = (): InputDevice[] => {
  const devices: InputDevice[] = [];

  if (detectKeyboard()) {
    devices.push({
      id: 'keyboard',
      name: 'Keyboard & Mouse',
      type: INPUT_DEVICES.KEYBOARD,
      emoji: '⌨️',
    });
  }

  if (detectTouch()) {
    devices.push({
      id: 'touch',
      name: 'Touch Controls',
      type: INPUT_DEVICES.TOUCH,
      emoji: '👆',
    });
  }

  return devices;
};
