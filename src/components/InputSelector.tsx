import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useGamepad } from '../hooks/useGamepad';
import { availableDevicesAtom, selectedInputDeviceAtom } from '../store';
import { INPUT_DEVICES } from '../constants';
import type { InputDevice } from '../types';

const InputDeviceSelector = () => {
  const { activeGamepads, selectGamepad } = useGamepad();
  const [availableDevices, setAvailableDevices] = useAtom(availableDevicesAtom);
  const [selectedDevice, setSelectedDevice] = useAtom(selectedInputDeviceAtom);

  // Update available devices when gamepads change
  useEffect(() => {
    const updatedDevices = availableDevices.filter(
      (d) => d.type !== INPUT_DEVICES.GAMEPAD
    );
    activeGamepads.forEach((gamepad, index) => {
      updatedDevices.push({
        id: `gamepad-${index}`,
        name: gamepad.id || `Controller ${index + 1}`,
        type: INPUT_DEVICES.GAMEPAD,
        emoji: '🎮',
      });
    });
    setAvailableDevices(updatedDevices);
  }, [activeGamepads]);

  const handleDeviceSelect = (device: InputDevice) => {
    setSelectedDevice(device);
    if (device.type === INPUT_DEVICES.GAMEPAD) {
      const gamepadIndex = parseInt(device.id.split('-')[1]);
      selectGamepad(gamepadIndex);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
      <h2 className="text-lg font-bold mb-3">Input Device</h2>
      <div className="space-y-2">
        {availableDevices.map((device) => (
          <button
            key={device.id}
            onClick={() => handleDeviceSelect(device)}
            className={`w-full flex items-center justify-between p-2 rounded-md transition-colors
              ${
                selectedDevice.id === device.id
                  ? 'bg-white/20 hover:bg-white/25'
                  : 'hover:bg-white/10'
              }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{device.emoji}</span>
              <span className="text-sm">{device.name}</span>
            </div>
            {selectedDevice.id === device.id && (
              <span className="text-sm">✅</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputDeviceSelector;
