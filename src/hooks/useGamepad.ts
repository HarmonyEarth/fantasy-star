import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';

enum GAMEPAD_EVENTS {
  CONNECTED = 'gamepadconnected',
  DISCONNECTED = 'gamepaddisconnected',
}

// Standard gamepad button mapping (based on Xbox/PS5 layout)
export enum GAMEPAD_BUTTONS {
  A = 0, // Cross on PS5
  B = 1, // Circle on PS5
  X = 2, // Square on PS5
  Y = 3, // Triangle on PS5
  LB = 4, // L1 on PS5
  RB = 5, // R1 on PS5
  LT = 6, // L2 on PS5
  RT = 7, // R2 on PS5
  Back = 8, // Share on PS5
  Start = 9, // Options on PS5
  LS = 10, // L3 on PS5
  RS = 11, // R3 on PS5
  DPadUp = 12,
  DPadDown = 13,
  DPadLeft = 14,
  DPadRight = 15,
}

export interface GamepadState {
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
  triggers: { left: number; right: number };
}

interface GamepadConfig {
  deadzone?: number;
}

const DEFAULT_DEADZONE = 0.1;

const getGamepads = async (): Promise<Gamepad[]> => {
  return Object.values(navigator.getGamepads()).filter(Boolean) as Gamepad[];
};

const normalizeStickValue = (value: number, deadzone: number) => {
  if (Math.abs(value) < deadzone) return 0;

  // Adjust the value to account for the deadzone and normalize to 0-1 range
  const normalized = (Math.abs(value) - deadzone) / (1 - deadzone);
  return value > 0 ? normalized : -normalized;
};

export const useGamepad = (config: GamepadConfig = {}) => {
  const { deadzone = DEFAULT_DEADZONE } = config;
  const [selectedGamepad, setSelectedGamepad] = useState<number>(0);
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    leftStick: { x: 0, y: 0 },
    rightStick: { x: 0, y: 0 },
    buttons: [],
    triggers: { left: 0, right: 0 },
  });

  const {
    data: gamepads,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['gamepads'],
    queryFn: getGamepads,
    // refetchInterval: 16, // ~60fps
  });

  // // Handle gamepad connection/disconnection
  // useEffect(() => {
  //   const handleGamepadDisconnected = (e: GamepadEvent) => {
  //     // Only need to handle selected gamepad being disconnected
  //     if (
  //       e.gamepad.index === selectedGamepad &&
  //       gamepads &&
  //       gamepads.length > 0
  //     ) {
  //       setSelectedGamepad(0); // Fall back to first gamepad if selected one is disconnected
  //     }
  //   };

  //   window.addEventListener(
  //     GAMEPAD_EVENTS.DISCONNECTED,
  //     handleGamepadDisconnected
  //   );

  //   return () => {
  //     window.removeEventListener(
  //       GAMEPAD_EVENTS.DISCONNECTED,
  //       handleGamepadDisconnected
  //     );
  //   };
  // }, [gamepads, selectedGamepad]);

  // Handle gamepad connection/disconnection
  useEffect(() => {
    const handleGamepadConnected = () => {
      // Manually trigger refetch when a new gamepad connects
      refetch();
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      // Only need to handle selected gamepad being disconnected
      if (
        e.gamepad.index === selectedGamepad &&
        gamepads &&
        gamepads.length > 0
      ) {
        setSelectedGamepad(0); // Fall back to first gamepad if selected one is disconnected
      }
      refetch(); // Refresh gamepad list when one is disconnected
    };

    window.addEventListener(GAMEPAD_EVENTS.CONNECTED, handleGamepadConnected);

    window.addEventListener(
      GAMEPAD_EVENTS.DISCONNECTED,
      handleGamepadDisconnected
    );

    return () => {
      window.removeEventListener(
        GAMEPAD_EVENTS.CONNECTED,
        handleGamepadConnected
      );
      window.removeEventListener(
        GAMEPAD_EVENTS.DISCONNECTED,
        handleGamepadDisconnected
      );
    };
  }, [selectedGamepad, refetch]);

  // Update gamepad state
  useEffect(() => {
    if (!gamepads || isError) return;

    const gamepad = gamepads[selectedGamepad];
    if (!gamepad) return;

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
        left: gamepad.buttons[GAMEPAD_BUTTONS.LT].value,
        right: gamepad.buttons[GAMEPAD_BUTTONS.RT].value,
      },
    });
  }, [gamepads, selectedGamepad, deadzone, isError]);

  const selectGamepad = useCallback(
    (index: number) => {
      if (index >= 0 && index < (gamepads?.length || 0)) {
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
