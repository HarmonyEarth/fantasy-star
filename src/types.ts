import { AnimationClip } from 'three/src/Three.js';
import { ANIMATION_STATES, AUDIO } from './constants';

export interface CharacterType {
  id: string;
  position: number[];
}

export type Sound = {
  displayName: string; // Display name for the audio (e.g., "Main Theme")
  fileName: string; // Path to the audio file (e.g., "assets/music/main_theme.mp3")
  volume: number; // Volume of the audio (e.g., 0.0 to 1.0)
  loop: boolean; // Whether the audio loops (true for background music)
  pitch: number; // Pitch modifier (1.0 is normal pitch)
  category: AUDIO; // Category of the audio (e.g., AUDIO.MUSIC)
  characterId?: string; // ID of the character associated with the audio (e.g., "player")
  id: string; // Unique identifier for the audio (e.g., "main_theme")
};

export type Animation = {
  fileName: AnimationClip;
  state: ANIMATION_STATES;
  displayName: string;
  speed?: number;
  height?: number;
  characterId: string; // ID of the character associated with the animation (e.g., "player")
  id: string;
  loop?: boolean;
};
export interface Character {
  name: string; // The name of the character (e.g., "Player", "Enemy")
  fileName: string; // File path for the character model (e.g., "assets/characters/player.glb")
  life: number; // Character's current life (e.g., 100 health points)
  animations: Animation[]; // Array of animation data for the character
  audioData: Sound[]; // Array of associated audio data (e.g., voice lines, attack sounds)
  currentAnimation: ANIMATION_STATES; // Current animation state of the character (e.g., IDLE, ATTACK)
  speed?: number; // Movement speed of the character (optional, but useful for locomotion logic)
  id: string; // Unique identifier for the character (e.g., "player", "enemy1")
  size: number; // Size of the character (e.g., 1.0 for normal size)
}

export interface Customization {
  displayName: string; // Display name for the customization (e.g., "Armor Set")
  meshName: string; // Name of the mesh (e.g., "armor_set")
  characterId: string; // ID of the character associated with the animation (e.g., "player")
  id: string;
}

// export type AudioData = {
//     name: string;
//     file: string;
//     type: AUDIO;
//     volume: number;
//     loop: boolean;
//     delay: number;
//     offset: number;
//     duration: number;
//     spatial: boolean;
//     distance: number;
//     rolloff: number;
//     refDistance: number;
//     maxDistance: number;
//     coneInnerAngle: number;
//     coneOuterAngle: number;
//     coneOuterGain: number;
//     playbackRate: number;
//     startTime: number;
//     stopTime: number;
//     fadeIn: number;
//     fadeOut: number;
//     startTimeRange: number;
//     stopTimeRange: number;
//     fadeInRange: number;
//     fadeOutRange: number;
//     startTimeOffset: number;
//     stopTimeOffset: number;
//     fadeInOffset: number;
//     fadeOutOffset: number;
//     startTimeRandomness: number;
//     stopTimeRandomness: number;
//     fadeInRandomness: number;
//     fadeOutRandomness: number;
//     startTimeRandomnessRange: number;
//     stopTimeRandomnessRange: number;
//     fadeInRandomnessRange: number;
//     fadeOutRandomnessRange: number;
//     startTimeRandomnessOffset: number;
//     stopTimeRandomnessOffset: number;
//     fadeInRandomnessOffset: number;
//     fadeOutRandomnessOffset: number;
//     startTimeRandomnessFactor: number;
//     stopTimeRandomnessFactor: number;
//     fadeInRandomnessFactor: number;
//     fadeOutRandomnessFactor: number;
//     startTimeRandomnessFactorRange: number;
//     stopTimeRandomnessFactorRange: number;
//     fadeInRandomnessFactorRange: number;
//     fadeOutRandomnessFactorRange: number;
//     startTimeRandomnessFactorOffset: number;
//     stopTimeRandomnessFactorOffset: number;
//     fadeInRandomnessFactorOffset: number;
//     fadeOutRandomnessFactorOffset: number;
//     startTimeRandomnessFactorRandomness: number;
//     stopTimeRandomnessFactorRandomness: number;
//     fadeInRandomnessFactorRandomness: number;
//     fadeOutRandomnessFactorRandomness: number;
//     startTimeRandomnessFactorRandomnessRange: number;
//     stopTimeRandomnessFactorRandomnessRange: number;
//     fadeInRandomnessFactorRandomnessRange: number;
//     fadeOutRandomnessFactorRandomnessRange: number;
//     startTimeRandomnessFactorRandomnessOffset: number;
//     stopTimeRandomnessFactorRandomnessOffset: number;
//     fadeInRandomnessFactorRandomnessOffset: number;
//   };
