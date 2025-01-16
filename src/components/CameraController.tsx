import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Object3D, Vector3 } from 'three';
import { useAtom } from 'jotai';
import {
  characterPositionAtom,
  characterRotationAtom,
  cameraModeAtom,
} from '../store';
import { useGamepad } from '../hooks/useGamepad';
import { CAMERA_MODES } from '../constants';

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;
const ROTATION_SPEED = 0.1;
const SMOOTHING = 0.1;
const CAMERA_MIN_HEIGHT = 1;

const CameraController = () => {
  const { scene, gl, camera } = useThree();

  // Create hierarchical camera objects
  const pivot = useMemo(() => new Object3D(), []); //Tracks the character’s world position. Smoothly follows the character
  const alt = useMemo(() => new Object3D(), []); //Controls the vertical height of the camera
  const yaw = useMemo(() => new Object3D(), []); //Handles horizontal rotation (left/right)
  const pitch = useMemo(() => new Object3D(), []); //Handles vertical rotation (up/down)
  const worldPosition = useMemo(() => new Vector3(), []);

  // Atoms for character position and rotation
  const [characterPosition] = useAtom(characterPositionAtom);
  const [characterRotation] = useAtom(characterRotationAtom);
  const [cameraMode] = useAtom(cameraModeAtom);

  // Gamepad hook
  const { gamepadState, isConnected } = useGamepad();
  const { rightStick } = gamepadState;

  // Setup camera hierarchy
  useEffect(() => {
    pivot.add(alt);
    alt.position.y = CAMERA_HEIGHT;
    alt.add(yaw);
    yaw.add(pitch);
    pitch.add(camera);
    scene.add(pivot);

    const handleMouseMove = (event: MouseEvent) => {
      if (cameraMode === CAMERA_MODES.GAME && event.buttons === 1) {
        // Adjust yaw and pitch for orbiting
        yaw.rotation.y -= event.movementX * ROTATION_SPEED * 0.01;
        pitch.rotation.x -= event.movementY * ROTATION_SPEED * 0.01;

        // Limit pitch rotation to prevent flipping
        pitch.rotation.x = Math.max(
          -Math.PI / 2, // Allow full upward view
          Math.min(Math.PI / 2, pitch.rotation.x) // Allow full downward view
        );
      }
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, gl, scene, cameraMode]);

  // Frame update
  useFrame((_, delta) => {
    // Update pivot position based on character world position
    worldPosition.set(
      characterPosition.x,
      characterPosition.y,
      characterPosition.z
    );
    pivot.position.lerp(worldPosition, delta * 5);

    // Adjust camera rotation using the right stick
    if (
      isConnected &&
      cameraMode === CAMERA_MODES.GAME &&
      (Math.abs(rightStick.x) > 0.1 || Math.abs(rightStick.y) > 0.1)
    ) {
      yaw.rotation.y += rightStick.x * ROTATION_SPEED;
      pitch.rotation.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, pitch.rotation.x + rightStick.y * ROTATION_SPEED)
      );
    }

    // Follow character’s rotation when not manually controlled
    if (cameraMode === CAMERA_MODES.GAME && !isConnected) {
      yaw.rotation.y = characterRotation.y;
    }

    // Calculate the camera offset
    const offset = new Vector3(
      Math.sin(yaw.rotation.y) * CAMERA_DISTANCE,
      CAMERA_HEIGHT,
      Math.cos(yaw.rotation.y) * CAMERA_DISTANCE
    );

    // Smoothly move camera towards the target position
    camera.position.lerp(worldPosition.clone().sub(offset), SMOOTHING);
    camera.position.y = Math.max(camera.position.y, CAMERA_MIN_HEIGHT);

    // Make the camera look at the character
    camera.lookAt(worldPosition);
  });

  return null;
};

export default CameraController;
