import {
  Environment,
  Stats,
  Grid,
  useTexture,
  KeyboardControls,
  Loader,
  Html,
} from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { AxesHelper, RepeatWrapping } from 'three';
import { Perf } from 'r3f-perf';
import CharacterController from './CharacterController';
import CameraController from './CameraController';
import Character from './Character';
import AnimatedGradient from './AnimatedGradient';
import { characters } from '../assets/mockData';
import { ANIMATION_STATES, LOCOMOTION } from '../constants';
import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
];

const Experience = () => {
  const checkerboardTexture = useTexture('/textures/placeholder.png');
  checkerboardTexture.wrapS = checkerboardTexture.wrapT = RepeatWrapping;
  checkerboardTexture.repeat.set(10, 10);

  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <Perf minimal />
        <Stats />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Environment preset="sunset" background backgroundBlurriness={0.3} />
        <Physics debug>
          <group>
            <RigidBody type="fixed">
              <mesh
                receiveShadow
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial map={checkerboardTexture} />
                {/* <AnimatedGradient /> */}
              </mesh>
            </RigidBody>
            <primitive object={new AxesHelper(10)} />
            <Grid
              position={[0, 0.01, 0]}
              args={[100, 100]}
              cellColor="#000000"
              sectionSize={5}
              sectionThickness={3}
              sectionColor="#000000"
              fadeDistance={100}
              fadeStrength={1}
              followCamera={false}
            />
          </group>
          {/* <CharacterController /> */}
          <Suspense
            fallback={
              <Html>
                <Loader />
              </Html>
            }
          >
            <Character
              characters={characters}
              characterId={characters[0].id}
              animationState={ANIMATION_STATES.LOCOMOTION}
              locomotionState={LOCOMOTION.RUNNING}
            />
          </Suspense>
          <CameraController />
        </Physics>
      </KeyboardControls>
    </>
  );
};

export default Experience;
