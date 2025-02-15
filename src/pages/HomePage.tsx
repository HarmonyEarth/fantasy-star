import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useAtom } from 'jotai';
import { showUIAtom } from '../store';
import type { Character } from '../types';
import { characters } from '../assets/mockData';
import Experience from '../components/Experience';
import InputSelector from '../components/User Interface/InputSelector';
import TouchControls from '../components/Touch/TouchControls';
import CharacterSelect from '../components/User Interface/CharacterSelect';
import DebugToggle from '../components/User Interface/DebugToggle';
import ShowUIToggle from '../components/User Interface/ShowUIToggle';
import FullScreenToggle from '../components/User Interface/FullScreenToggle';
import { SocketManager } from '../components/Networking/SocketManager';

const HomePage = () => {
  const [showUI] = useAtom(showUIAtom);

  return (
    <div id="fullscreen-container" className="w-full h-screen relative">
      <SocketManager />
      <Canvas
        className="w-full h-full absolute top-0 left-0"
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

      {/* UI Visibility Toggle - Always visible */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none z-50">
        <div className="w-full sm:w-52 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
          <ShowUIToggle />
        </div>
      </div>

      {/* Main Controls - Toggleable visibility on mobile */}
      <div
        className={`absolute top-20 sm:top-20 left-4 right-4 flex flex-col sm:flex-row justify-between items-start gap-4 pointer-events-none z-50 ${
          showUI ? 'flex' : 'hidden'
        }`}
      >
        <InputSelector />
        <CharacterSelect />
        <div className="w-full sm:w-52 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
          <FullScreenToggle />
          <DebugToggle />
        </div>
      </div>
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
