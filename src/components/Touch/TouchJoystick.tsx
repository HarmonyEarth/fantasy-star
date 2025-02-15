import React from 'react';

interface Props {
  direction: { x: number; y: number };
  active: boolean;
}

const TouchJoystick: React.FC<Props> = ({ direction, active }) => {
  const baseSize = 120;
  const stickSize = 48;
  return (
    <>
      <div
        className={`absolute rounded-full border-2 transition-colors ${
          active ? 'border-white/50 bg-black/30' : 'border-white/30 bg-black/20'
        }`}
        style={{
          width: baseSize,
          height: baseSize,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        className={`absolute rounded-full transition-all ${
          active ? 'bg-white/40 border-white/60' : 'bg-white/30 border-white/40'
        } border-2`}
        style={{
          width: stickSize,
          height: stickSize,
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${(direction.x * (baseSize - stickSize)) / 2}px), calc(-50% + ${(direction.y * (baseSize - stickSize)) / 2}px))`,
          transition: active ? 'none' : 'transform 0.15s ease-out',
        }}
      />
    </>
  );
};

export default TouchJoystick;
