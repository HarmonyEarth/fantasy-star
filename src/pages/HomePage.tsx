import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useState } from 'react';
import { useAtom } from 'jotai';
import Experience from '../components/Experience';
import { SocketManager } from '../components/SocketManager';
import type { Character } from '../types';
import { characters } from '../assets/mockData';
import InputSelector from '../components/InputSelector';
import TouchControls from '../components/TouchControls';
import CharacterSelect from '../components/CharacterSelect';
import { gameDebugAtom, uiVisibleAtom } from '../store';

const HomePage = () => {
  const [uiVisible] = useAtom(uiVisibleAtom);

  return (
    <div id="fullscreen-container" className="w-full h-screen relative">
      <SocketManager />
      <Canvas
        className="w-full h-full absolute top-0 left-0"
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <Experience />
      </Canvas>

      {/* UI Visibility Toggle - Always visible on mobile */}
      <div className="sm:hidden absolute top-4 left-4 right-4 pointer-events-none">
        <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
          <UIVisibilityToggle />
        </div>
      </div>

      {/* Main Controls - Toggleable visibility on mobile */}
      <div
        className={`absolute top-20 sm:top-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start gap-4 pointer-events-none ${
          !uiVisible ? 'sm:flex hidden' : 'flex'
        }`}
      >
        <InputSelector />
        <CharacterSelect />
        <div className="w-full sm:w-52 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
          <FullscreenToggle />
          <DebugToggle />
        </div>
      </div>
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
      {isFullscreen ? (
        <span>Disable Fullscreen ❌</span>
      ) : (
        <span>Enable Fullscreen ✅</span>
      )}
    </button>
  );
};

const DebugToggle = () => {
  const [gameDebug, setGameDebug] = useAtom(gameDebugAtom);

  const handleToggle = () => {
    setGameDebug((prev) => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className=" flex items-center justify-between p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      {gameDebug ? <span>Disable Debug ❌</span> : <span>Enable Debug ✅</span>}
    </button>
  );
};

const UIVisibilityToggle = () => {
  const [uiVisible, setUiVisible] = useAtom(uiVisibleAtom);

  return (
    <button
      onClick={() => setUiVisible((prev) => !prev)}
      className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      <span>{uiVisible ? 'Hide UI ❌' : 'Show UI ✅'}</span>
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
