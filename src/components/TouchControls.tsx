import { useAtom } from 'jotai';
import { selectedInputDeviceAtom } from '../store';
import { INPUT_DEVICES } from '../constants';
import TouchJoystick from './TouchJoystick';
import { useTouch } from '../hooks/useTouch';

const TouchControls = () => {
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const touchState = useTouch(selectedDevice.type === INPUT_DEVICES.TOUCH);

  return (
    <div className="fixed bottom-40 left-40 z-10">
      <TouchJoystick
        direction={touchState.direction}
        active={touchState.active}
      />
    </div>
  );
};

export default TouchControls;
