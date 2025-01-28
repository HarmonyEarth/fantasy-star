import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Object3D, Vector3, MathUtils } from 'three';
import { useAtom } from 'jotai';
import {
  characterPositionAtom,
  characterRotationAtom,
  cameraModeAtom,
  selectedInputDeviceAtom,
} from '../store';
import { useGamepad } from '../hooks/useGamepad';
import { CAMERA_MODES, INPUT_DEVICES } from '../constants';

const CAMERA_DISTANCE = 5;
const CAMERA_HEIGHT = 2;
const CAMERA_MIN_HEIGHT = 1;
const POSITION_LERP_FACTOR = 0.1;
const ROTATION_LERP_FACTOR = 0.1;
const GAMEPAD_ROTATION_SPEED = 2;
const MOUSE_ROTATION_SPEED = 0.002;
const INPUT_RETURN_LERP_FACTOR = 0.05; // Smooth return for both gamepad and mouse

const CameraController = () => {
  const { camera, scene, gl } = useThree();
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const [characterPosition] = useAtom(characterPositionAtom);
  const [characterRotation] = useAtom(characterRotationAtom);
  const [cameraMode] = useAtom(cameraModeAtom);

  const cameraRig = useRef<Object3D>(new Object3D());
  const targetPosition = useRef<Vector3>(new Vector3());
  const currentRotation = useRef<number>(0);
  const lastInputRotation = useRef<number>(0);
  const isRotating = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const isUsingInput = useRef<boolean>(false);

  const { gamepadState, isConnected } = useGamepad();
  const { rightStick } = gamepadState;

  useEffect(() => {
    const controller = new AbortController();

    scene.add(cameraRig.current);

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // Left mouse button
        isRotating.current = true;
        lastMouseX.current = e.clientX;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isRotating.current = false;
        // Update the lastInputRotation to the current rotation when mouse stops
        if (selectedDevice.type === INPUT_DEVICES.KEYBOARD) {
          lastInputRotation.current = currentRotation.current;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isRotating.current) {
        const deltaX = e.movementX;

        // Rotate horizontally
        currentRotation.current -= deltaX * MOUSE_ROTATION_SPEED;

        // Update lastInputRotation during active mouse movement
        if (selectedDevice.type === INPUT_DEVICES.KEYBOARD) {
          lastInputRotation.current = currentRotation.current;
        }
      }
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    gl.domElement.addEventListener('mousedown', handleMouseDown, {
      signal: controller.signal,
    });
    gl.domElement.addEventListener('mouseup', handleMouseUp, {
      signal: controller.signal,
    });
    gl.domElement.addEventListener('mousemove', handleMouseMove, {
      signal: controller.signal,
    });
    gl.domElement.addEventListener('contextmenu', handleContextMenu, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
      scene.remove(cameraRig.current);
    };
  }, [scene, gl, selectedDevice]);

  useFrame((state, delta) => {
    if (cameraMode !== CAMERA_MODES.GAME) return;

    // Update camera rig position to follow character
    targetPosition.current.copy(characterPosition);
    cameraRig.current.position.lerp(
      targetPosition.current,
      POSITION_LERP_FACTOR
    );

    // Handle input based on device type
    if (selectedDevice.type === INPUT_DEVICES.GAMEPAD && isConnected) {
      // Gamepad input handling
      if (Math.abs(rightStick.x) > 0.1) {
        isUsingInput.current = true;
        const rotation = rightStick.x * GAMEPAD_ROTATION_SPEED * delta;
        currentRotation.current += rotation;
        lastInputRotation.current = currentRotation.current;
      } else if (isUsingInput.current && !isRotating.current) {
        // Smoothly interpolate back to the last gamepad rotation
        currentRotation.current = MathUtils.lerp(
          currentRotation.current,
          lastInputRotation.current,
          INPUT_RETURN_LERP_FACTOR
        );
      }
    } else if (selectedDevice.type === INPUT_DEVICES.KEYBOARD) {
      // Keyboard/Mouse input handling
      if (!isRotating.current && isUsingInput.current) {
        // Smoothly interpolate back to the last mouse rotation
        currentRotation.current = MathUtils.lerp(
          currentRotation.current,
          lastInputRotation.current,
          INPUT_RETURN_LERP_FACTOR
        );
      }
    }

    // Reset input state when switching devices
    if (selectedDevice.type !== INPUT_DEVICES.GAMEPAD) {
      isUsingInput.current = isRotating.current;
    }

    // Only align with character rotation when:
    // 1. Character is moving
    // 2. Not actively rotating with input
    // 3. Not using any input device
    const isMoving = characterPosition.lengthSq() > 0.01;
    const shouldAlignWithCharacter =
      isMoving && !isRotating.current && !isUsingInput.current;

    if (shouldAlignWithCharacter) {
      currentRotation.current = MathUtils.lerp(
        currentRotation.current,
        characterRotation.y,
        ROTATION_LERP_FACTOR
      );
    }

    // Calculate and update camera position
    const cameraOffset = new Vector3(
      -Math.sin(currentRotation.current) * CAMERA_DISTANCE,
      CAMERA_HEIGHT,
      -Math.cos(currentRotation.current) * CAMERA_DISTANCE
    );

    camera.position.copy(targetPosition.current).add(cameraOffset);
    camera.position.y = Math.max(camera.position.y, CAMERA_MIN_HEIGHT);
    camera.lookAt(targetPosition.current);
  });

  return null;
};

export default CameraController;
