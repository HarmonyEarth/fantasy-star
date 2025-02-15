import { useAtom } from 'jotai';
import { selectedInputDeviceAtom } from '../../store';
import { INPUT_DEVICES } from '../../constants';
import TouchJoystick from './TouchJoystick';
import { useTouch } from '../../hooks/useTouch';

const TouchControls = () => {
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const touchState = useTouch(selectedDevice.type === INPUT_DEVICES.TOUCH);

  if (selectedDevice.type !== INPUT_DEVICES.TOUCH) return null;

  return (
    <div
      className="fixed bottom-40 left-40 pointer-events-auto"
      style={{ zIndex: 40 }}
    >
      <TouchJoystick
        direction={touchState.direction}
        active={touchState.active}
      />
    </div>
  );
};

export default TouchControls;
