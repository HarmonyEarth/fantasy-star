import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AnimationMixer, LoopOnce, LoopRepeat, SkeletonHelper } from 'three';
import { ANIMATION_STATES, LOCOMOTION } from '../constants';
import type { Character } from '../types';
import { useAtom } from 'jotai';
import { gameDebugAtom } from '../store';

interface Props {
  characters: Character[];
  characterId: string | null;
  animationState: ANIMATION_STATES;
  locomotionState?: LOCOMOTION;
}

const Character: React.FC<Props> = ({
  characters,
  characterId,
  animationState,
  locomotionState,
}) => {
  const [gameDebug] = useAtom(gameDebugAtom);
  // Find character data
  const character = useMemo(
    () => characters.find((char) => char.id === characterId),
    [characters, characterId]
  );

  if (!character) {
    throw new Error(`Character with id ${characterId} not found`);
  }

  // Load character model
  const characterModel = useGLTF(character.fileName);

  // Initialize animation-related refs
  const mixer = useMemo(
    () => new AnimationMixer(characterModel.scene),
    [characterModel.scene]
  );
  const currentAnimationRef = useRef<string | null>(null);

  // Function to play animations
  const playAnimation = (state: ANIMATION_STATES, locomotion?: LOCOMOTION) => {
    if (!character.animations) return;

    let targetAnimation;
    if (state === ANIMATION_STATES.LOCOMOTION && locomotion) {
      targetAnimation = character.animations.find(
        (anim) => anim.locomotion === locomotion
      );
    } else if (state === ANIMATION_STATES.LOCOMOTION && !locomotion) {
      targetAnimation = character.animations.find(
        (anim) => anim.state === ANIMATION_STATES.IDLE
      );
    } else {
      targetAnimation = character.animations.find(
        (anim) => anim.state === state
      );
    }

    if (targetAnimation) {
      const { animations: loadedAnimations } = useGLTF(
        targetAnimation.fileName
      );

      if (
        loadedAnimations[0] &&
        currentAnimationRef.current !== targetAnimation.fileName
      ) {
        mixer.stopAllAction(); // Stop any currently playing animations
        const action = mixer.clipAction(loadedAnimations[0]);

        // Configure action
        action.reset().play();
        action.loop = targetAnimation.loop ? LoopRepeat : LoopOnce;
        if (!targetAnimation.loop) {
          action.clampWhenFinished = true;
          action.repetitions = 1;
        }
        if (targetAnimation.speed) {
          action.timeScale = targetAnimation.speed;
        }

        // Update current animation ref
        currentAnimationRef.current = targetAnimation.fileName;
      }
    }
  };

  useEffect(() => {
    playAnimation(animationState, locomotionState);

    return () => {
      mixer.stopAllAction();
    };
  }, [animationState, locomotionState, mixer]);

  // Update mixer on each frame
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    const scene = characterModel.scene;
    const skeletonHelper = new SkeletonHelper(scene);
    gameDebug && scene.add(skeletonHelper);

    return () => {
      scene.remove(skeletonHelper);
    };
  }, [characterModel.scene, gameDebug]);

  return characterId ? (
    <group position-y={-1}>
      <primitive object={characterModel.scene} />
    </group>
  ) : null;
};

export default Character;
