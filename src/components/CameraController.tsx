import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Object3D, Vector3, MathUtils } from 'three';
import { useAtom } from 'jotai';
import {
  characterPositionAtom,
  cameraModeAtom,
  selectedInputDeviceAtom,
} from '../store';
import { useGamepad } from '../hooks/useGamepad';
import { CAMERA_MODES, INPUT_DEVICES } from '../constants';

const CAMERA_DISTANCE = 4;
const CAMERA_HEIGHT = 2;
const CAMERA_MIN_HEIGHT = 1;
const POSITION_LERP_FACTOR = 0.1;
const GAMEPAD_ROTATION_SPEED = 2;
const MOUSE_ROTATION_SPEED = 0.002;
const INPUT_RETURN_LERP_FACTOR = 0.05;

const CameraController = () => {
  const { camera, scene, gl } = useThree();
  const [selectedDevice] = useAtom(selectedInputDeviceAtom);
  const [characterPosition] = useAtom(characterPositionAtom);
  const [cameraMode] = useAtom(cameraModeAtom);

  const cameraRig = useRef<Object3D>(new Object3D());
  const targetPosition = useRef<Vector3>(new Vector3());
  const currentRotation = useRef<number>(0);
  const lastInputRotation = useRef<number>(0);
  const isRotating = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const isUsingInput = useRef<boolean>(false);

  // Persistent temporary vector to avoid allocations
  const cameraOffset = useRef(new Vector3());

  const { gamepadState, isConnected } = useGamepad();
  const { rightStick } = gamepadState;

  useEffect(() => {
    const controller = new AbortController();
    scene.add(cameraRig.current);

    const handleMouseEvent = (e: MouseEvent, type: 'down' | 'up' | 'move') => {
      if (type === 'down' && e.button === 0) {
        isRotating.current = true;
        lastMouseX.current = e.clientX;
      }
      if (type === 'up' && e.button === 0) {
        isRotating.current = false;
        if (selectedDevice.type === INPUT_DEVICES.KEYBOARD)
          lastInputRotation.current = currentRotation.current;
      }
      if (type === 'move' && isRotating.current) {
        const deltaX = e.movementX;
        currentRotation.current -= deltaX * MOUSE_ROTATION_SPEED;
        if (selectedDevice.type === INPUT_DEVICES.KEYBOARD) {
          lastInputRotation.current = currentRotation.current;
        }
      }
    };

    gl.domElement.addEventListener(
      'mousedown',
      (e) => handleMouseEvent(e, 'down'),
      { signal: controller.signal }
    );
    gl.domElement.addEventListener(
      'mouseup',
      (e) => handleMouseEvent(e, 'up'),
      { signal: controller.signal }
    );
    gl.domElement.addEventListener(
      'mousemove',
      (e) => handleMouseEvent(e, 'move'),
      { signal: controller.signal }
    );
    gl.domElement.addEventListener('contextmenu', (e) => e.preventDefault(), {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
      scene.remove(cameraRig.current);
    };
  }, [scene, gl, selectedDevice]);

  useFrame((state, delta) => {
    if (cameraMode !== CAMERA_MODES.GAME) return;

    targetPosition.current.copy(characterPosition);
    // Calculate dynamic follow speed: if distance > 1, increase follow rate.
    const distance = cameraRig.current.position.distanceTo(
      targetPosition.current
    );
    const followSpeed =
      distance > 1
        ? Math.min(1, POSITION_LERP_FACTOR + (distance - 1) * 0.5)
        : POSITION_LERP_FACTOR;
    cameraRig.current.position.lerp(targetPosition.current, followSpeed);

    // Handle rotation input
    const processRotation = () => {
      if (selectedDevice.type === INPUT_DEVICES.GAMEPAD && isConnected) {
        if (Math.abs(rightStick.x) > 0.1) {
          isUsingInput.current = true;
          currentRotation.current +=
            rightStick.x * GAMEPAD_ROTATION_SPEED * delta;
          lastInputRotation.current = currentRotation.current;
        } else if (isUsingInput.current && !isRotating.current) {
          currentRotation.current = MathUtils.lerp(
            currentRotation.current,
            lastInputRotation.current,
            INPUT_RETURN_LERP_FACTOR
          );
        }
      } else if (selectedDevice.type === INPUT_DEVICES.KEYBOARD) {
        if (!isRotating.current && isUsingInput.current) {
          currentRotation.current = MathUtils.lerp(
            currentRotation.current,
            lastInputRotation.current,
            INPUT_RETURN_LERP_FACTOR
          );
        }
        isUsingInput.current = isRotating.current;
      }
    };

    processRotation();

    // Update the persistent cameraOffset vector instead of creating a new one
    cameraOffset.current.set(
      -Math.sin(currentRotation.current) * CAMERA_DISTANCE,
      CAMERA_HEIGHT,
      -Math.cos(currentRotation.current) * CAMERA_DISTANCE
    );
    camera.position.copy(cameraRig.current.position).add(cameraOffset.current);
    camera.position.y = Math.max(camera.position.y, CAMERA_MIN_HEIGHT);
    camera.lookAt(cameraRig.current.position);
  });

  return null;
};

export default CameraController;
