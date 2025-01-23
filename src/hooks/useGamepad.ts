import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

const GAMEPAD_EVENTS = {
  CONNECTED: 'gamepadconnected',
  DISCONNECTED: 'gamepaddisconnected',
};

const GAMEPAD_BUTTONS = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  Back: 8,
  Start: 9,
  LS: 10,
  RS: 11,
  DPadUp: 12,
  DPadDown: 13,
  DPadLeft: 14,
  DPadRight: 15,
};

const DEFAULT_DEADZONE = 0.1;

const normalizeStickValue = (value: number, deadzone: number) => {
  if (Math.abs(value) < deadzone) return 0;
  const normalized = (Math.abs(value) - deadzone) / (1 - deadzone);
  return value > 0 ? normalized : -normalized;
};

const getGamepads = async () => {
  return Object.values(navigator.getGamepads()).filter(Boolean) as Gamepad[];
};

export const useGamepad = ({ deadzone = DEFAULT_DEADZONE } = {}) => {
  const [selectedGamepad, setSelectedGamepad] = useState(0);
  const [gamepadState, setGamepadState] = useState({
    leftStick: { x: 0, y: 0 },
    rightStick: { x: 0, y: 0 },
    buttons: [],
    triggers: { left: 0, right: 0 },
  });

  const {
    data: gamepads,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['gamepads'],
    queryFn: getGamepads,
    refetchInterval: 16,
  });

  const selectedGamepadRef = useRef(selectedGamepad); // useRef to avoid re-renders

  const handleGamepadConnected = useCallback(() => refetch(), [refetch]);

  const handleGamepadDisconnected = useCallback(
    (e: GamepadEvent) => {
      if (
        e.gamepad.index === selectedGamepadRef.current &&
        gamepads?.length > 0
      ) {
        setSelectedGamepad(0); // Fall back if the selected gamepad is disconnected
      }
      refetch(); // Refresh list on disconnect
    },
    [gamepads, refetch]
  );

  useEffect(() => {
    selectedGamepadRef.current = selectedGamepad; // Keep track of the current selected gamepad in the ref

    const controller = new AbortController();
    window.addEventListener(GAMEPAD_EVENTS.CONNECTED, handleGamepadConnected, {
      signal: controller.signal,
    });
    window.addEventListener(
      GAMEPAD_EVENTS.DISCONNECTED,
      handleGamepadDisconnected,
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [handleGamepadConnected, handleGamepadDisconnected, selectedGamepad]);

  useEffect(() => {
    if (gamepads && !isError) {
      const gamepad = gamepads[selectedGamepad];
      if (gamepad) {
        setGamepadState({
          leftStick: {
            x: normalizeStickValue(gamepad.axes[0], deadzone),
            y: normalizeStickValue(gamepad.axes[1], deadzone),
          },
          rightStick: {
            x: normalizeStickValue(gamepad.axes[2], deadzone),
            y: normalizeStickValue(gamepad.axes[3], deadzone),
          },
          buttons: gamepad.buttons.map((button) => button.pressed),
          triggers: {
            left: gamepad.buttons[GAMEPAD_BUTTONS.LT]?.value || 0,
            right: gamepad.buttons[GAMEPAD_BUTTONS.RT]?.value || 0,
          },
        });
      }
    }
  }, [gamepads, selectedGamepad, deadzone, isError]);

  const selectGamepad = useCallback(
    (index: number) => {
      if (gamepads && index >= 0 && index < gamepads.length) {
        setSelectedGamepad(index);
      }
    },
    [gamepads]
  );

  return {
    isConnected: !!gamepads?.[selectedGamepad],
    gamepadState,
    activeGamepads: gamepads || [],
    selectedGamepad,
    selectGamepad,
  };
};
