import { Environment, Stats, KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import CharacterController from './CharacterController';
import CameraController from './CameraController';

import Field from './Field';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
];

const Experience = () => {
  return (
    <>
      <Perf minimal />
      <Stats />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <Environment preset="sunset" background backgroundBlurriness={0.3} />{' '}
      <KeyboardControls map={keyboardMap}>
        <Physics debug>
          <Field />
          <CharacterController />
        </Physics>
        <CameraController />
      </KeyboardControls>
    </>
  );
};

export default Experience;
