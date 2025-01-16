import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Experience from '../components/Experience';
import { SocketManager } from '../components/SocketManager';
import type { CharacterType } from '../types';
import { characters } from '../assets/mockData';

const HomePage = () => {
  return (
    <>
      <SocketManager />
      <Canvas
        style={{ height: '100vh', width: '100vw' }}
        fallback={<div>Sorry no WebGL supported!</div>}
        shadows
        // gl={(canvas) => new WebGPURenderer({ canvas, antialias: true })}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default HomePage;

const preloadCharacterAssets = (characters: CharacterType[]) => {
  characters.forEach((character) => {
    // Preload base model
    useGLTF.preload(character.fileName);

    // Preload all animations
    character.animations?.forEach((animation) => {
      useGLTF.preload(animation.fileName);
    });
  });
};

preloadCharacterAssets(characters);
