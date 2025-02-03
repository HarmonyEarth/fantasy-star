import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  RapierRigidBody,
} from '@react-three/rapier';
import { useRef, Suspense, useState } from 'react';
import { Group, Vector3, ArrowHelper } from 'three';
import { useAtom } from 'jotai';
import { useKeyboardControls, Loader, Html } from '@react-three/drei';
import { useGamepad } from '../hooks/useGamepad';
import { useTouch } from '../hooks/useTouch';
import {
  characterPositionAtom,
  playerCharacterIdAtom,
  selectedInputDeviceAtom,
} from '../store';
import { ANIMATION_STATES, INPUT_DEVICES, LOCOMOTION } from '../constants';
import Character from './Character';
import { characters } from '../assets/mockData';

const RUN_SPEED = 8;
const ROTATION_SPEED = 0.1;
const VELOCITY_LERP_FACTOR = 10;

interface Props {
  characterId?: string;
  scale?: number;
}

const CharacterController: React.FC<Props> = () => {
  const [playerCharacterId] = useAtom(playerCharacterIdAtom);
  const [characterPosition, setCharacterPosition] = useAtom(
    characterPositionAtom
  );
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE);
  const [locomotionState, setLocomotionState] = useState<
    LOCOMOTION | undefined
  >(undefined);

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterRef = useRef<Group>(null);
  const arrowHelperRef = useRef<ArrowHelper>(null);
  const moveDirection = useRef(new Vector3());
  const currentRotation = useRef(0);

  const { camera } = useThree();
  const { gamepadState, isConnected } = useGamepad();
  const { leftStick } = gamepadState;
  const { active: touchActive, direction: touchDirection } = useTouch(
    selectedDevice.type === INPUT_DEVICES.TOUCH
  );
  const [, getKeyboard] = useKeyboardControls();

  // Helper to compute movement direction based on input
  const computeMoveDirection = () => {
    moveDirection.current.set(0, 0, 0);
    const cameraForward = new Vector3();
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    cameraForward.normalize();
    const cameraRight = new Vector3()
      .crossVectors(cameraForward, new Vector3(0, 1, 0))
      .normalize();

    switch (selectedDevice.type) {
      case INPUT_DEVICES.KEYBOARD: {
        const keys = getKeyboard();
        if (keys.forward) moveDirection.current.add(cameraForward);
        if (keys.backward) moveDirection.current.sub(cameraForward);
        if (keys.left) moveDirection.current.sub(cameraRight);
        if (keys.right) moveDirection.current.add(cameraRight);
        break;
      }
      case INPUT_DEVICES.GAMEPAD:
        if (isConnected) {
          moveDirection.current.add(
            cameraForward.clone().multiplyScalar(-leftStick.y)
          );
          moveDirection.current.add(
            cameraRight.clone().multiplyScalar(leftStick.x)
          );
        }
        break;
      case INPUT_DEVICES.TOUCH:
        if (touchActive) {
          moveDirection.current.add(
            cameraForward.clone().multiplyScalar(-touchDirection.y)
          );
          moveDirection.current.add(
            cameraRight.clone().multiplyScalar(touchDirection.x)
          );
        }
        break;
    }
  };

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !characterRef.current) return;

    computeMoveDirection();
    const lerpFactor = 1 - Math.exp(-VELOCITY_LERP_FACTOR * delta);
    const currentVel = rigidBodyRef.current.linvel();

    if (moveDirection.current.lengthSq() > 0.01) {
      setAnimationState(ANIMATION_STATES.LOCOMOTION);
      setLocomotionState(LOCOMOTION.RUNNING);
      moveDirection.current.normalize();
      const targetRotation = Math.atan2(
        moveDirection.current.x,
        moveDirection.current.z
      );
      currentRotation.current = lerpAngle(
        currentRotation.current,
        targetRotation,
        ROTATION_SPEED
      );
      const targetVelocity = new Vector3(
        Math.sin(currentRotation.current) * RUN_SPEED,
        currentVel.y,
        Math.cos(currentRotation.current) * RUN_SPEED
      );
      const impulse = targetVelocity.sub(currentVel).multiplyScalar(0.5);
      rigidBodyRef.current.applyImpulse(impulse, true);
      characterRef.current.rotation.y = currentRotation.current;
    } else {
      setAnimationState(ANIMATION_STATES.IDLE);
      setLocomotionState(undefined);
      const impulse = new Vector3(0, currentVel.y, 0)
        .sub(currentVel)
        .multiplyScalar(0.5);
      rigidBodyRef.current.applyImpulse(impulse, true);
    }

    // Update arrow helper
    if (arrowHelperRef.current) {
      arrowHelperRef.current.setDirection(new Vector3(0, 0, 1));
      arrowHelperRef.current.position.copy(characterRef.current.position);
      arrowHelperRef.current.rotation.y = currentRotation.current;
    }

    // Re-add update: sync characterPosition atom with physics simulation
    const { x, y, z } = rigidBodyRef.current.translation();
    setCharacterPosition(new Vector3(x, y, z));
  });

  return (
    <group>
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        mass={1}
        type="dynamic"
        position={characterPosition}
        enabledRotations={[false, false, false]}
      >
        <group ref={characterRef}>
          <Suspense
            fallback={
              <Html>
                <Loader />
              </Html>
            }
          >
            <Character
              characters={characters}
              characterId={playerCharacterId}
              animationState={animationState}
              locomotionState={locomotionState}
            />
          </Suspense>
          {/* <arrowHelper
            ref={arrowHelperRef}
            args={[new Vector3(0, 0, 1), new Vector3(0, 1, 0), 2, 0x0000ff]}
          /> */}
          <CapsuleCollider args={[0.6, 0.4]} />
        </group>
      </RigidBody>
    </group>
  );
};

export default CharacterController;

const normalizeAngle = (angle: number): number =>
  ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

const lerpAngle = (start: number, end: number, t: number): number => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  const diff = normalizeAngle(end - start + Math.PI) - Math.PI;
  return normalizeAngle(start + diff * t);
};
