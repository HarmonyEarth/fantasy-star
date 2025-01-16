import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import { useRef } from 'react';
import { Group, Vector3, Euler, Quaternion } from 'three';
import { useAtom } from 'jotai';
import Character from './Character';
import { characterPositionAtom, characterRotationAtom } from '../store';
import { characters } from '../assets/mockData';
import { useGamepad } from '../hooks/useGamepad';

const RUN_SPEED = 8;
const JUMP_FORCE = 6;

interface Props {
  characterId?: string;
  scale?: number;
}

const CharacterController: React.FC<Props> = ({
  characterId = characters[0].id,
}) => {
  const characterRef = useRef<Group>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const [, setCharacterPosition] = useAtom(characterPositionAtom);

  const { rapier, world } = useRapier();
  const { gamepadState, isConnected } = useGamepad();
  const { leftStick, buttons } = gamepadState;

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const velocity = new Vector3();

    // Handle gamepad input
    if (isConnected) {
      velocity.x = leftStick.x * RUN_SPEED;
      velocity.z = -leftStick.y * RUN_SPEED;

      // Jump with gamepad
      if (buttons[0]) {
        // Assuming button[0] is the jump button
        //jump();
      }
    }

    // Apply movement
    const translation = rigidBodyRef.current.translation();
    const linvel = rigidBodyRef.current.linvel();

    // Ground check
    const ray = new rapier.Ray(
      { x: translation.x, y: translation.y, z: translation.z },
      { x: 0, y: -1, z: 0 }
    );
    const hit = world.castRay(ray, 0.5, true); // `true` means only consider solid bodies
    const grounded = hit !== null;

    // Apply velocity
    rigidBodyRef.current.setLinvel(
      { x: velocity.x, y: linvel.y, z: velocity.z },
      true
    );

    // Handle rotation
    if (velocity.length() > 0) {
      const targetRotation = Math.atan2(velocity.x, velocity.z);
      if (characterRef.current) {
        // Ensure characterRef.current is not null
        characterRef.current.rotation.y = targetRotation;
      }
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
        <Character characters={characters} characterId={characterId} />
      </group>
    </RigidBody>
  );
};
export default CharacterController;
