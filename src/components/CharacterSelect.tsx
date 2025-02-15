import React from 'react';
import { useAtom } from 'jotai';
import { playerCharacterIdAtom } from '../store';
import { characters } from '../assets/mockData';

const CharacterSelect = () => {
  const [playerCharacterId, setPlayerCharacterId] = useAtom(
    playerCharacterIdAtom
  );
  return (
    <div className="w-full sm:w-48 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white pointer-events-auto">
      <h2 className="text-lg font-bold mb-3">Select Character</h2>
      <div className="space-y-2">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => setPlayerCharacterId(character.id)}
            className={`w-full flex items-center justify-between p-2 rounded-md transition-colors
              ${playerCharacterId === character.id ? 'bg-white/20 hover:bg-white/25' : 'hover:bg-white/10'}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{character.icon}</span>
              <span className="text-sm">{character.name}</span>
            </div>
            {playerCharacterId === character.id && (
              <span className="text-sm">✅</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;
