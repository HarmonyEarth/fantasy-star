import { atom } from 'jotai';
import { Vector3 } from 'three';
import type { CharacterType, InputDevice } from './types';
import { getInitialDevices } from './utils/getInitialDevices';
import { getDefaultDevice } from './utils/getDefaultDevice';
import { CAMERA_MODES } from './constants';

export const charactersAtom = atom<CharacterType[]>([]);
export const characterPositionAtom = atom(new Vector3(0, 0, 0));
export const characterRotationAtom = atom(new Vector3(0, 0, 0));

// Available devices atom
export const availableDevicesAtom = atom<InputDevice[]>(getInitialDevices());

// Selected device atom with default based on available devices
export const selectedInputDeviceAtom = atom<InputDevice>(
  getDefaultDevice(getInitialDevices())
);

export const cameraModeAtom = atom(CAMERA_MODES.GAME);
