import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useMemo } from 'react';
import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import { ANIMATION_STATES, LOCOMOTION } from '../constants';
import type { CharacterType } from '../types';
import { AnimationAction } from 'three';

interface Props {
  characters: CharacterType[];
  characterId: string;
  animationState: ANIMATION_STATES;
  locomotionState?: LOCOMOTION;
}

const Character: React.FC<Props> = ({
  characters,
  characterId,
  animationState,
  locomotionState,
}) => {
  const mixerRef = useRef<AnimationMixer | null>(null);
  const animationActionsRef = useRef<{ [key: string]: AnimationAction }>({});

  // Get character data by ID
  const character = useMemo(
    () => characters.find((char) => char.id === characterId),
    [characters, characterId]
  );

  if (!character) {
    throw new Error(`Character with id ${characterId} not found`);
  }

  // Pre-load all required models and animations
  const characterModel = useGLTF(character.fileName);
  const animationModels = useMemo(() => {
    if (!character.animations) return {};
    return Object.fromEntries(
      character.animations.map((anim) => [anim.state, useGLTF(anim.fileName)])
    );
  }, [character.animations]);

  // Setup mixer and animations
  useEffect(() => {
    if (!characterModel.scene || !character.animations) return;

    // Create new mixer
    const mixer = new AnimationMixer(characterModel.scene);
    mixerRef.current = mixer;

    // Setup all animations
    character.animations.forEach((animation) => {
      const animationData = animationModels[animation.state];
      if (!animationData || !animationData.animations[0]) return;

      const action = mixer.clipAction(animationData.animations[0]);
      action.loop = animation.loop ? LoopRepeat : LoopOnce;
      if (animation.speed) action.timeScale = animation.speed;

      animationActionsRef.current[animation.state] = action;
      if (animation.locomotion) {
        animationActionsRef.current[animation.locomotion] = action;
      }
    });

    return () => {
      mixer.stopAllAction();
      Object.values(animationActionsRef.current).forEach((action) =>
        action.reset()
      );
    };
  }, [characterModel.scene, character.animations, animationModels]);

  // Handle animation state changes
  useEffect(() => {
    if (!mixerRef.current || !animationActionsRef.current) return;

    const targetAction =
      animationState === ANIMATION_STATES.LOCOMOTION && locomotionState
        ? animationActionsRef.current[locomotionState]
        : animationActionsRef.current[animationState];

    if (targetAction) {
      // Fade out all other animations
      Object.values(animationActionsRef.current).forEach((action) => {
        if (action !== targetAction) action.fadeOut(0.2);
      });

      // Play the target animation
      targetAction.reset().fadeIn(0.2).play();

      // Configure non-looping animations
      if (targetAction.loop === LoopOnce) {
        targetAction.clampWhenFinished = true;
        targetAction.repetitions = 1;
      }
    }
  }, [animationState, locomotionState]);

  // Update mixer on each frame
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return <primitive object={characterModel.scene} />;
};

export default Character;
