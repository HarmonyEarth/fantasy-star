import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial } from 'three';
import { Color } from 'three';

const AnimatedGradient = () => {
  const materialRef = useRef<ShaderMaterial>(null); // Reference to the ShaderMaterial

  // Use useFrame to animate the gradient
  const progressRef = useRef(0); // Use ref to store progress without triggering re-renders

  useFrame(() => {
    // Animate the progress over time and loop smoothly between 0 and 1
    progressRef.current += 0.001;
    if (progressRef.current > 1) {
      progressRef.current -= 1; // Reset progress in a smooth loop
    }

    // Update the shader uniform for animation
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progressRef.current;
    }
  });

  // Shader code for the animated gradient
  const shader = useMemo(() => {
    return {
      uniforms: {
        uProgress: { value: 0 }, // Progress for animation
        uColor1: { value: new Color(0xff0000) }, // Red
        uColor2: { value: new Color(0xff7f00) }, // Orange
        uColor3: { value: new Color(0xffff00) }, // Yellow
        uColor4: { value: new Color(0x00ff00) }, // Green
        uColor5: { value: new Color(0x0000ff) }, // Blue
        uColor6: { value: new Color(0x4b0082) }, // Indigo
        uColor7: { value: new Color(0x8a2be2) }, // Violet
        uGold: { value: new Color(0xffd700) }, // Gold
        uSilver: { value: new Color(0xc0c0c0) }, // Silver
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        uniform vec3 uColor6;
        uniform vec3 uColor7;
        uniform vec3 uGold;
        uniform vec3 uSilver;

        void main() {
          // Smooth interpolation between the colors using uProgress
          vec3 color = mix(uColor1, uColor2, sin(uProgress * 3.14159) * 0.5 + 0.5);
          color = mix(color, uColor3, sin((uProgress + 0.14) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uColor4, sin((uProgress + 0.28) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uColor5, sin((uProgress + 0.42) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uColor6, sin((uProgress + 0.57) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uColor7, sin((uProgress + 0.71) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uGold, sin((uProgress + 0.85) * 3.14159) * 0.5 + 0.5);
          color = mix(color, uSilver, sin((uProgress + 1.0) * 3.14159) * 0.5 + 0.5);

          // Ensure the last color (uSilver) smoothly blends back into the first color (uRed)
          color = mix(color, uColor1, sin((uProgress + 1.14) * 3.14159) * 0.5 + 0.5);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    };
  }, []);

  return <shaderMaterial ref={materialRef} args={[shader]} />;
};

export default AnimatedGradient;
