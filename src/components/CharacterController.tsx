import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RigidBody,
  RapierRigidBody,
  useRapier,
} from '@react-three/rapier';
import { useRef, useEffect, Suspense } from 'react';
import { Group, Vector3, ArrowHelper } from 'three';
import { useAtom } from 'jotai';
import { useKeyboardControls, Loader, Html } from '@react-three/drei';
import {
  characterPositionAtom,
  characterRotationAtom,
  selectedInputDeviceAtom,
} from '../store';
import { useGamepad } from '../hooks/useGamepad';
import { ANIMATION_STATES, INPUT_DEVICES, LOCOMOTION } from '../constants';
import Character from './Character';
import { characters } from '../assets/mockData';

const WALK_SPEED = 4;
const RUN_SPEED = 8;
const ROTATION_SPEED = 0.1;

interface Props {
  characterId?: string;
  scale?: number;
}

const CharacterController: React.FC<Props> = () => {
  const characterRef = useRef<Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const arrowHelperRef = useRef<ArrowHelper>(null);
  const isClicking = useRef<boolean>(false);
  const moveDirection = useRef<Vector3>(new Vector3());
  const currentRotation = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [, setCharacterPosition] = useAtom(characterPositionAtom);
  const [, setCharacterRotation] = useAtom(characterRotationAtom);
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const [, get] = useKeyboardControls();

  const { gamepadState, isConnected } = useGamepad();
  const { leftStick, buttons } = gamepadState;

  useEffect(() => {
    const controller = new AbortController();

    const handlePointer = (active: boolean) => (e: MouseEvent | TouchEvent) => {
      isClicking.current = active;
      if (active) {
        if (e instanceof MouseEvent) {
          mousePosRef.current = { x: e.clientX, y: e.clientY };
        } else {
          mousePosRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      }
    };

    document.addEventListener('mousedown', handlePointer(true), {
      signal: controller.signal,
    });
    document.addEventListener('mouseup', handlePointer(false), {
      signal: controller.signal,
    });
    document.addEventListener('touchstart', handlePointer(true), {
      signal: controller.signal,
    });
    document.addEventListener('touchend', handlePointer(false), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, []);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !characterRef.current) return;

    const speed = get().run ? RUN_SPEED : WALK_SPEED;
    moveDirection.current.set(0, 0, 0);

    // Handle input based on device type
    switch (selectedDevice.type) {
      case INPUT_DEVICES.KEYBOARD:
        if (get().forward) moveDirection.current.z += 1;
        if (get().backward) moveDirection.current.z -= 1;
        if (get().left) moveDirection.current.x -= 1;
        if (get().right) moveDirection.current.x += 1; // Fixed: increment x for right
        break;

      case INPUT_DEVICES.GAMEPAD:
        if (
          isConnected &&
          (Math.abs(leftStick.x) > 0.1 || Math.abs(leftStick.y) > 0.1)
        ) {
          moveDirection.current.x = -leftStick.x;
          moveDirection.current.z = leftStick.y;
        }
        break;

      case INPUT_DEVICES.TOUCH:
        if (isClicking.current) {
          // Convert screen coordinates to normalized direction
          const rect = state.gl.domElement.getBoundingClientRect();
          const x = ((mousePosRef.current.x - rect.left) / rect.width) * 2 - 1;
          const y = -((mousePosRef.current.y - rect.top) / rect.height) * 2 + 1;
          moveDirection.current.set(x, 0, -y).normalize();
        }
        break;
    }

    // Normalize movement vector
    if (moveDirection.current.lengthSq() > 0.01) {
      moveDirection.current.normalize();

      // Calculate target rotation based on movement direction
      const targetRotation = Math.atan2(
        moveDirection.current.x,
        moveDirection.current.z
      );

      // Smoothly interpolate current rotation
      currentRotation.current = lerpAngle(
        currentRotation.current,
        targetRotation,
        ROTATION_SPEED
      );

      // Apply movement in the rotated direction
      const velocity = new Vector3(
        Math.sin(currentRotation.current) * speed,
        rigidBodyRef.current.linvel().y,
        Math.cos(currentRotation.current) * speed
      );

      rigidBodyRef.current.setLinvel(velocity, true);

      // Update character visual rotation
      characterRef.current.rotation.y = currentRotation.current;

      // Update rotation atom with Vector3
      setCharacterRotation(new Vector3(0, currentRotation.current, 0));
    } else {
      // Stop horizontal movement when no input
      rigidBodyRef.current.setLinvel(
        { x: 0, y: rigidBodyRef.current.linvel().y, z: 0 },
        true
      );
    }

    // Update position atom
    const translation = rigidBodyRef.current.translation();
    setCharacterPosition(
      new Vector3(translation.x, translation.y, translation.z)
    );

    // Update arrow helper
    if (arrowHelperRef.current) {
      arrowHelperRef.current.setDirection(new Vector3(0, 0, 1));
      arrowHelperRef.current.position.copy(characterRef.current.position);
      arrowHelperRef.current.rotation.y = currentRotation.current;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]}
    >
      <group ref={characterRef}>
        <CapsuleCollider args={[1, 0.4]} />

        <Suspense
          fallback={
            <Html>
              <Loader />
            </Html>
          }
        >
          <Character
            characters={characters}
            characterId={characters[1].id}
            animationState={ANIMATION_STATES.LOCOMOTION}
            locomotionState={LOCOMOTION.RUNNING}
          />
        </Suspense>
        <arrowHelper
          ref={arrowHelperRef}
          args={[new Vector3(0, 0, 1), new Vector3(0, 1, 0), 2, 0x0000ff]}
        />
      </group>
    </RigidBody>
  );
};

export default CharacterController;

// Utility functions
const normalizeAngle = (angle: number): number => {
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
};

const lerpAngle = (start: number, end: number, t: number): number => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  const diff = end - start;
  const shortestDiff = normalizeAngle(diff + Math.PI) - Math.PI;

  return normalizeAngle(start + shortestDiff * t);
};
