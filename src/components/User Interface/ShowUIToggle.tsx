import { useAtom } from 'jotai';
import { showUIAtom } from '../../store';

const ShowUIToggle = () => {
  const [showUI, setShowUI] = useAtom(showUIAtom);

  return (
    <button
      onClick={() => setShowUI((prev) => !prev)}
      className="flex items-center justify-between w-full p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      <span>{showUI ? 'Hide UI ❌' : 'Show UI ✅'}</span>
    </button>
  );
};

export default ShowUIToggle;
