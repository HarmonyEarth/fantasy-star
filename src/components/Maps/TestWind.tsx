import { useRapier } from '@react-three/rapier';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import React from 'react';

interface Props {
  strength?: number;
  direction?: Vector3;
  turbulence?: number;
  frequency?: number;
}

const TestWind: React.FC<Props> = ({
  strength = 0.05,
  direction = new Vector3(1, 0, 0),
  turbulence = 0.2,
  frequency = 0.01,
}) => {
  const { world } = useRapier();

  useFrame((state) => {
    const timeVariation =
      Math.sin(state.clock.elapsedTime * frequency) * turbulence;
    const windForce = direction
      .clone()
      .normalize()
      .multiplyScalar(strength * (1 + timeVariation));

    // Correctly iterate through all bodies
    world.bodies.forEach((body) => {
      if (body.mass() > 0) {
        body.applyImpulse(
          { x: windForce.x, y: windForce.y, z: windForce.z },
          true
        );
      }
    });
  });

  return null;
};

export default TestWind;
