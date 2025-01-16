import {
  ANIMATION_STATES,
  ATTACK_LEVELS,
  INPUT_DEVICES,
  LOCOMOTION,
  SOUND_CATEGORIES,
} from './constants';

export type Sound = {
  displayName: string; // Display name for the audio (e.g., "Main Theme")
  fileName: string; // Path to the audio file (e.g., "assets/music/main_theme.mp3")
  volume?: number; // Volume of the audio (e.g., 0.0 to 1.0)
  loop?: boolean; // Whether the audio loops (true for background music)
  pitch?: number; // Pitch modifier (1.0 is normal pitch)
  category: SOUND_CATEGORIES; // Category of the audio (e.g., AUDIO.MUSIC)
  characterId?: string; // ID of the character associated with the audio (e.g., "player")
  id: string; // Unique identifier for the audio (e.g., "main_theme")
};

export type CharacterAnimation = {
  fileName: string; // File path for the animation (e.g., "assets/animations/idle.glb")
  state: ANIMATION_STATES;
  attackLevel?: ATTACK_LEVELS;
  locomotion?: LOCOMOTION;
  displayName: string;
  speed?: number;
  height?: number;
  characterId: string; // ID of the character associated with the animation (e.g., "player")
  id: string;
  loop?: boolean;
};
export interface CharacterType {
  name: string; // The name of the character (e.g., "Player", "Enemy")
  fileName: string; // File path for the character model (e.g., "assets/characters/player.glb")
  life: number; // Character's current life (e.g., 100 health points)
  animations: CharacterAnimation[]; // Array of animation data for the character
  sounds: Sound[]; // Array of associated audio data (e.g., voice lines, attack sounds)
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

export interface InputDevice {
  id: string;
  name: string;
  type: INPUT_DEVICES;
  emoji: string;
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
