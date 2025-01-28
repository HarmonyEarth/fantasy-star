import { atom } from 'jotai';
import { Vector3 } from 'three';
import type { InputDevice, Player } from './types';
import { CAMERA_MODES, INPUT_DEVICES } from './constants';

export const playersAtom = atom<Player[]>([]);
export const characterPositionAtom = atom(new Vector3(0, 0, 0));
export const characterRotationAtom = atom(new Vector3(0, 0, 0));

// Available devices atom
// export const availableDevicesAtom = atom<InputDevice[]>(getInitialDevices());

// Selected device atom with default based on available devices
export const selectedInputDeviceAtom = atom<InputDevice>({
  id: 'keyboard',
  name: 'Keyboard & Mouse',
  type: INPUT_DEVICES.KEYBOARD,
  emoji: '⌨️',
});

export const cameraModeAtom = atom(CAMERA_MODES.GAME);
