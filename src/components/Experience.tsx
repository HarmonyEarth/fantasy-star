import { Environment, Grid, OrbitControls, Stats } from '@react-three/drei';

const Experience = () => {
  return (
    <>
      <Stats />
      {/* <color attach="background" args={["#234b80"]} /> */}

      <OrbitControls />
      <ambientLight />
      <Environment preset="sunset" background backgroundBlurriness={0.3} />
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={1.5}
        cellColor="#000000"
        sectionSize={5}
        sectionThickness={3}
        sectionColor="#000000"
        fadeDistance={100}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
};

export default Experience;
