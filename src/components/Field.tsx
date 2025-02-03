import { Grid, useTexture } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { AxesHelper, RepeatWrapping } from 'three';

const Field = () => {
  const checkerboardTexture = useTexture('/textures/placeholder.png');
  checkerboardTexture.wrapS = checkerboardTexture.wrapT = RepeatWrapping;
  checkerboardTexture.repeat.set(10, 10);

  return (
    <group>
      <RigidBody type="fixed">
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial map={checkerboardTexture} />
        </mesh>
      </RigidBody>
      {/* <primitive object={new AxesHelper(10)} position={[0, 0.5, 0]} /> */}
      <Grid
        position={[0, 0.01, 0]}
        args={[100, 100]}
        cellColor="#000000"
        sectionSize={5}
        sectionThickness={3}
        sectionColor="#000000"
        fadeDistance={100}
        fadeStrength={1}
        followCamera={false}
      />
    </group>
  );
};

export default Field;
