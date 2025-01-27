import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import { useRef, useEffect } from 'react';
import { Group, Vector3 } from 'three';
import { useAtom } from 'jotai';
import { characterPositionAtom, characterRotationAtom } from '../store';
import { useGamepad } from '../hooks/useGamepad';

const WALK_SPEED = 5;
const RUN_SPEED = 8;
const ROTATION_SPEED = 0.5 * (Math.PI / 180);
const JUMP_FORCE = 6;

interface Props {
  characterId?: string;
  scale?: number;
}

const CharacterController: React.FC<Props> = () => {
  const characterRef = useRef<Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const isClicking = useRef<boolean>(false);
  const rotationTarget = useRef<number>(0);

  const [, setCharacterPosition] = useAtom(characterPositionAtom);
  const [, setCharacterRotation] = useAtom(characterRotationAtom);
  const [, get] = useKeyboardControls();

  const { rapier, world } = useRapier();
  const { gamepadState, isConnected } = useGamepad();
  const { leftStick, buttons } = gamepadState;

  useEffect(() => {
    const controller = new AbortController();

    const onMouseDown = () => {
      isClicking.current = true;
    };
    const onMouseUp = () => {
      isClicking.current = false;
    };

    document.addEventListener('mousedown', onMouseDown, {
      signal: controller.signal,
    });
    document.addEventListener('mouseup', onMouseUp, {
      signal: controller.signal,
    });
    document.addEventListener('touchstart', onMouseDown, {
      signal: controller.signal,
    });
    document.addEventListener('touchend', onMouseUp, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, []);

  useFrame(({ mouse }) => {
    if (!rigidBodyRef.current) return;

    const movement = {
      x: 0,
      z: 0,
    };

    // Combine all input methods
    // 1. Keyboard
    if (get().forward) movement.z += 1;
    if (get().backward) movement.z -= 1;
    if (get().left) movement.x += 1;
    if (get().right) movement.x -= 1;

    // 2. Mouse (when clicking)
    if (isClicking.current) {
      if (Math.abs(mouse.x) > 0.1) {
        movement.x -= mouse.x;
      }
      movement.z += mouse.y + 0.4;
    }

    // 3. Gamepad
    if (isConnected) {
      movement.x -= leftStick.x;
      movement.z += leftStick.y;
    }

    // Normalize movement vector if magnitude > 1
    const magnitude = Math.sqrt(
      movement.x * movement.x + movement.z * movement.z
    );
    if (magnitude > 1) {
      movement.x /= magnitude;
      movement.z /= magnitude;
    }

    // Determine speed
    let speed = get().run ? RUN_SPEED : WALK_SPEED;
    if (
      isClicking.current &&
      (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5)
    ) {
      speed = RUN_SPEED;
    }

    // Update rotation
    if (movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }

    // Calculate velocity
    const velocity = new Vector3();
    if (movement.x !== 0 || movement.z !== 0) {
      const targetRotation = Math.atan2(movement.x, movement.z);
      velocity.x = Math.sin(rotationTarget.current + targetRotation) * speed;
      velocity.z = Math.cos(rotationTarget.current + targetRotation) * speed;
    }

    // Apply movement
    const translation = rigidBodyRef.current.translation();
    const linvel = rigidBodyRef.current.linvel();

    // Ground check
    const ray = new rapier.Ray(
      { x: translation.x, y: translation.y, z: translation.z },
      { x: 0, y: -1, z: 0 }
    );
    const hit = world.castRay(ray, 0.5, true);
    const grounded = hit !== null;

    // Apply velocity
    rigidBodyRef.current.setLinvel(
      { x: velocity.x, y: linvel.y, z: velocity.z },
      true
    );

    // Update character rotation
    if (characterRef.current && (movement.x !== 0 || movement.z !== 0)) {
      const targetRotation = Math.atan2(movement.x, movement.z);
      const newRotation = lerpAngle(
        characterRef.current.rotation.y,
        targetRotation,
        0.1
      );
      characterRef.current.rotation.y = newRotation;

      // Update rotation atom
      setCharacterRotation(new Vector3(0, newRotation, 0));
    }

    // Update character position for camera
    setCharacterPosition(
      new Vector3(translation.x, translation.y, translation.z)
    );
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 1, 0]}
      enabledRotations={[false, true, false]}
    >
      <group ref={characterRef}>
        <CapsuleCollider args={[1, 0.4]} />
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default CharacterController;

const normalizeAngle = (angle: number): number => {
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
};

const lerpAngle = (start: number, end: number, t: number): number => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  // Find shortest direction
  const diff = end - start;
  const shortestDiff = normalizeAngle(diff + Math.PI) - Math.PI;

  return normalizeAngle(start + shortestDiff * t);
};
