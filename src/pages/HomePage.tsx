import { Canvas } from '@react-three/fiber';
import Experience from '../components/Game/Experience';
import { SocketManager } from '../components/Game/SocketManager';

const HomePage = () => {
  return (
    <>
      <SocketManager />
      <Canvas
        style={{ height: '100vh', width: '100vw' }}
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default HomePage;
