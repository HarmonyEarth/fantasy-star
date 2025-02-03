import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Experience from '../components/Experience';
import { SocketManager } from '../components/SocketManager';
import type { Character } from '../types';
import { characters } from '../assets/mockData';
import InputSelector from '../components/InputSelector';
import TouchControls from '../components/TouchControls';
import CharacterSelect from '../components/CharacterSelect';
import { useState } from 'react';

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
    <div id="fullscreen-container" className="w-full h-screen relative">
      <SocketManager />
      <div className="flex flex-col sm:flex-row justify-evenly items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <InputSelector />
        <CharacterSelect />
        <div className="w-full sm:w-1/6 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
          <FullscreenToggle />
        </div>
      </div>
      <Canvas
        fallback={<div>Sorry no WebGL supported!</div>}
        // onCreated={({ gl }) => {
        //   if (navigator.gpu) {
        //     console.log(
        //       'Using WebGPURenderer',
        //       navigator.gpu instanceof GPU ? 'with GPU' : 'without GPU'
        //     );
        //     const canvas = gl.domElement;
        //     const webGPURenderer = new WebGPURenderer({ canvas });
        //     webGPURenderer.setSize(window.innerWidth, window.innerHeight);
        //     webGPURenderer.setPixelRatio(window.devicePixelRatio);
        //     // webGPURenderer.shadowMap.enabled = true;

        //     // Dispose of the default WebGLRenderer
        //     gl.dispose();

        //     // Replace with WebGPURenderer
        //     return webGPURenderer;
        //   } else {
        //     console.warn(
        //       'WebGPU not supported. Falling back to WebGLRenderer.'
        //     );
        //   }
        // }}
      >
        <Experience />
      </Canvas>
      <TouchControls />
    </div>
  );
};

export default HomePage;

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggle = () => {
    const elem = document.getElementById('fullscreen-container');
    if (elem && !document.fullscreenElement) {
      elem.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className=" flex items-center justify-between p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      {!isFullscreen && <span>Enable Fullscreen ✅</span>}
      {isFullscreen && <span>Disable Fullscreen ❌</span>}
    </button>
  );
};

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
