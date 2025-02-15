import { RigidBody } from '@react-three/rapier';

const PropObjects = () => {
  return (
    <>
      {/* Large Cube */}
      <RigidBody type="dynamic" colliders="cuboid" position={[-5, 5, 0]}>
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="tomato" />
        </mesh>
      </RigidBody>

      {/* Large Sphere */}
      <RigidBody type="dynamic" colliders="ball" position={[0, 5, 5]}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="skyblue" />
        </mesh>
      </RigidBody>

      {/* Large Cone */}
      <RigidBody type="dynamic" colliders="hull" position={[5, 5, -5]}>
        <mesh>
          <coneGeometry args={[1.5, 4, 32]} />
          <meshStandardMaterial color="limegreen" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default PropObjects;
