import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GradientTexture, GradientType } from '@react-three/drei';
import { lerp } from 'three/src/math/MathUtils.js';

const AnimatedGradient = () => {
  const [progress, setProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  // Use useFrame to update progress and trigger re-renders
  useFrame(() => {
    // Slow down the progress update (e.g., divide by 100 to make it slower)
    if (frameCount % 5 === 0) {
      setProgress((prev) => (prev + 0.001) % 1); // Smaller increment makes it slower
    }
    setFrameCount(frameCount + 1);
  });

  // Smooth oscillation for progress, using Math.sin to smoothly go back and forth
  const oscillatingProgress = Math.sin(progress * Math.PI * 2) / 2 + 0.5; // Oscillates between 0 and 1

  // Use lerp to smoothly interpolate between the stops and colors
  const stopMiddle = lerp(0.3, 0.7, oscillatingProgress); // Interpolate middle stop between 0.3 and 0.7
  const startColor = 'white';
  const middleColor = `hsl(${oscillatingProgress * 360}, 100%, 50%)`; // Interpolated hue based on progress
  const endColor = 'white';

  // Calculate the dynamic stops and colors based on the oscillating progress
  const stops = [0, stopMiddle, 1];

  const colors = [startColor, middleColor, endColor];

  return (
    <meshBasicMaterial>
      <GradientTexture
        stops={stops} // Pass dynamically calculated stops
        colors={colors} // Pass dynamically calculated colors
        type={GradientType.Linear} // Set to linear gradient
      />
    </meshBasicMaterial>
  );
};

export default AnimatedGradient;
