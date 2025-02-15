import { useAtom } from 'jotai';
import { gameDebugAtom } from '../../store';

const DebugToggle = () => {
  const [gameDebug, setGameDebug] = useAtom(gameDebugAtom);

  const handleToggle = () => {
    setGameDebug((prev) => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className="w-full flex items-center justify-between p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      {gameDebug ? (
        <div className="w-full flex justify-between">
          <p>Disable Debug</p>
          <p>❌</p>
        </div>
      ) : (
        <div className="w-full flex justify-between">
          <p>Enable Debug </p>
          <p>✅</p>
        </div>
      )}
    </button>
  );
};

export default DebugToggle;
