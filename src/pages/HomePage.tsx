import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Experience from '../components/Experience';
import { SocketManager } from '../components/SocketManager';
import type { Character } from '../types';
import { characters } from '../assets/mockData';
import { WebGPURenderer } from 'three/webgpu';
import InputSelector from '../components/InputSelector';
import TouchControls from '../components/TouchControls';
import CharacterSelect from '../components/CharacterSelect';

const HomePage = () => {
  // useEffect(() => {
  //   const initGPU = async () => {
  //     const adapter = await navigator.gpu.requestAdapter();
  //     const device = await adapter?.requestDevice();
  //     console.log('device', device);
  //   };
  //   initGPU();
  // }, []);
  return (
    <div className="w-full h-screen relative">
      <SocketManager />
      <div className="flex flex-col sm:flex-row justify-evenly items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <InputSelector />
        <CharacterSelect />
      </div>
      <Canvas
        fallback={<div>Sorry no WebGL supported!</div>}
        onCreated={({ gl }) => {
          if (navigator.gpu) {
            console.log(
              'Using WebGPURenderer',
              navigator.gpu instanceof GPU ? 'with GPU' : 'without GPU'
            );
            const canvas = gl.domElement;
            const webGPURenderer = new WebGPURenderer({ canvas });
            webGPURenderer.setSize(window.innerWidth, window.innerHeight);
            webGPURenderer.setPixelRatio(window.devicePixelRatio);
            // webGPURenderer.shadowMap.enabled = true;

            // Dispose of the default WebGLRenderer
            gl.dispose();

            // Replace with WebGPURenderer
            return webGPURenderer;
          } else {
            console.warn(
              'WebGPU not supported. Falling back to WebGLRenderer.'
            );
          }
        }}
      >
        <Experience />
      </Canvas>
      <TouchControls />
    </div>
  );
};

export default HomePage;

const preloadCharacterAssets = (characters: Character[]) => {
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
