import { Environment, Stats, KeyboardControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import CharacterController from './CharacterController';
import CameraController from './CameraController';
import Field from './Field';
import PropObjects from './PropObjects';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
];

const Experience = () => {
  return (
    <>
      <Perf minimal />
      <Stats />
      <ambientLight intensity={1} />
      <directionalLight intensity={5} position={[15, 100, 150]} />
      <Sky azimuth={2} sunPosition={[0, 0, 30]} />
      <KeyboardControls map={keyboardMap}>
        <Physics>
          <Field />
          <PropObjects />
          <CharacterController />
        </Physics>
        <CameraController />
      </KeyboardControls>
    </>
  );
};

export default Experience;
