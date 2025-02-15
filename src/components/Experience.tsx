import { Environment, Stats, KeyboardControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import CharacterController from './CharacterController';
import CameraController from './CameraController';
import Field from './Maps/Field';
import PropObjects from './Maps/PropObjects';
import { useAtom } from 'jotai';
import { gameDebugAtom } from '../store';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
];

const Experience = () => {
  const [gameDebug] = useAtom(gameDebugAtom);
  return (
    <>
      {gameDebug && <Perf minimal />}
      {gameDebug && <Stats />}
      <ambientLight intensity={1} />
      <directionalLight intensity={5} position={[15, 100, 150]} />
      <Sky azimuth={2} sunPosition={[0, 0, 30]} />
      <KeyboardControls map={keyboardMap}>
        <Physics debug={gameDebug}>
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
