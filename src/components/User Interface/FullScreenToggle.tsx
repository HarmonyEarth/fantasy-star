import { useState } from 'react';

const FullScreenToggle = () => {
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
      className="w-full flex items-center justify-between p-2 rounded-md transition-colors hover:bg-white/10 text-white"
    >
      {isFullscreen ? (
        <div className="w-full flex justify-between">
          <p>Disable FullScreen</p>
          <p>❌</p>
        </div>
      ) : (
        <div className="w-full flex justify-between">
          <p>Enable FullScreen</p>
          <p>✅</p>
        </div>
      )}
    </button>
  );
};

export default FullScreenToggle;
