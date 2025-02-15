import { useAtom } from 'jotai';
import { selectedInputDeviceAtom, showUIAtom } from '../../store';
import { INPUT_DEVICES } from '../../constants';
import type { InputDevice } from '../../types';

const devices: InputDevice[] = [
  {
    id: 'keyboard',
    name: 'Keyboard',
    type: INPUT_DEVICES.KEYBOARD,
    emoji: '⌨️',
  },
  {
    id: 'gamepad-1',
    name: 'Controller 1',
    type: INPUT_DEVICES.GAMEPAD,
    emoji: '🎮',
  },
  {
    id: 'touch',
    name: 'Touch Controls',
    type: INPUT_DEVICES.TOUCH,
    emoji: '👆',
  },
];

const InputSelector = () => {
  const [selectedDevice, setSelectedDevice] = useAtom(selectedInputDeviceAtom);
  const [, setShowUI] = useAtom(showUIAtom);

  const handleDeviceSelect = (device: InputDevice) => {
    if (device.id !== selectedDevice.id) {
      setSelectedDevice(device);
      // Automatically hide UI when selecting touch controls
      if (device.type === INPUT_DEVICES.TOUCH) {
        setShowUI(false);
      }
    }
  };

  return (
    <div className="w-full sm:w-52 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
      <h2 className="text-lg font-bold mb-3">Input Device</h2>
      <div className="space-y-2">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => handleDeviceSelect(device)}
            className={`w-full flex items-center justify-between p-2 rounded-md transition-colors
              ${selectedDevice.id === device.id ? 'bg-white/20 hover:bg-white/25' : 'hover:bg-white/10'}`}
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

export default InputSelector;
