import { INPUT_DEVICES } from '../constants';
import type { InputDevice } from '../types';

// Get default device based on available devices
export const getDefaultDevice = (devices: InputDevice[]): InputDevice => {
  // Prefer keyboard if available
  const keyboard = devices.find((d) => d.type === INPUT_DEVICES.KEYBOARD);
  if (keyboard) return keyboard;

  // Fall back to touch if available
  const touch = devices.find((d) => d.type === INPUT_DEVICES.TOUCH);
  if (touch) return touch;

  // Fall back to gamepad if available
  const gamepad = devices.find((d) => d.type === INPUT_DEVICES.GAMEPAD);
  if (gamepad) return gamepad;

  // If somehow no devices are available, provide keyboard as fallback
  // This should rarely happen
  return {
    id: 'keyboard',
    name: 'Keyboard & Mouse',
    type: INPUT_DEVICES.KEYBOARD,
    emoji: '⌨️',
  };
};
