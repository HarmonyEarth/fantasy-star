import { Canvas } from '@react-three/fiber';
import Experience from '../components/Experience';
import { SocketManager } from '../components/SocketManager';

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
