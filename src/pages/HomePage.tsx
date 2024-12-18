import { useState } from 'react';
import reactLogo from '../assets/react.svg';

const HomePage = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-screen-lg mx-auto p-8 text-center">
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img
            src="/vite.svg"
            className="h-24 p-6 transition-filter duration-300 ease-in-out hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className="h-24 p-6 transition-filter duration-300 ease-in-out hover:drop-shadow-[0_0_2em_#61dafbaa]"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold mt-4">Vite + React</h1>

      <div className="p-8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit{' '}
          <code className="font-mono bg-gray-200 p-1 rounded">src/App.tsx</code>{' '}
          and save to test HMR
        </p>
      </div>

      <p className="text-gray-400 mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};

export default HomePage;
