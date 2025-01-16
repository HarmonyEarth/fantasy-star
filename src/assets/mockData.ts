import {
  ANIMATION_STATES,
  ATTACK_LEVELS,
  LOCOMOTION,
  SOUND_CATEGORIES,
} from '../constants';
import type { CharacterType, CharacterAnimation, Sound } from '../types';

const tifaId = 'Tifa';

const tifaAnimations: CharacterAnimation[] = [
  {
    displayName: ANIMATION_STATES.IDLE,
    fileName: 'models/Tifa/tifaIdle.glb',
    state: ANIMATION_STATES.IDLE,
    characterId: tifaId,
    id: 'TifaIdle',
    loop: true,
  },
  {
    displayName: LOCOMOTION.RUNNING,
    fileName: 'models/Tifa/tifaRun.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.RUNNING,
    characterId: tifaId,
    id: 'TifaRun',
    loop: true,
  },
  {
    displayName: 'Tifa Kick 1',
    fileName: 'models/Tifa/tifaKick1.glb',
    state: ANIMATION_STATES.ATTACK,
    attackLevel: ATTACK_LEVELS.STANDING_LIGHT,
    characterId: tifaId,
    id: 'TifaKick1',
  },
  {
    displayName: 'Tifa Kick 2',
    fileName: 'models/Tifa/tifaKick2.glb',
    state: ANIMATION_STATES.ATTACK,
    attackLevel: ATTACK_LEVELS.STANDING_MEDIUM,
    characterId: tifaId,
    id: 'TifaKick2',
  },
  {
    displayName: LOCOMOTION.DODGING,
    fileName: 'models/Tifa/tifaDodge.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.DODGING,
    characterId: tifaId,
    id: 'TifaDodge',
  },
  {
    displayName: LOCOMOTION.JUMPING,
    fileName: 'models/Tifa/tifaJump.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.JUMPING,
    characterId: tifaId,
    id: 'TifaJump',
  },
  {
    displayName: LOCOMOTION.FALLING,
    fileName: 'models/Tifa/tifaFall.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.FALLING,
    characterId: tifaId,
    id: 'TifaFall',
    loop: true,
  },
];

const tifaSounds: Sound[] = [
  {
    displayName: 'Tifa Voice Line #5',
    fileName: 'audio/Tifa/p_dlc110_chatvoice_e#5.wav',
    category: SOUND_CATEGORIES.VOICE_FX,
    characterId: tifaId,
    id: 'TifaVoiceLine5',
  },
];

const Tifa: CharacterType = {
  id: tifaId,
  name: 'Tifa',
  fileName: 'models/Tifa/tifaBase.glb',
  life: 100,
  size: 1,
  animations: tifaAnimations,
  sounds: tifaSounds,
};

const cloudId = 'Cloud';

const cloudAnimations: CharacterAnimation[] = [
  {
    displayName: LOCOMOTION.RUNNING,
    fileName: 'models/Cloud/cloudRun.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.RUNNING,
    characterId: cloudId,
    id: 'CloudRun',
    loop: true,
  },
  {
    displayName: LOCOMOTION.DODGING,
    fileName: 'models/Cloud/cloudDodge.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.DODGING,
    characterId: cloudId,
    id: 'CloudDodge',
  },
  {
    displayName: LOCOMOTION.JUMPING,
    fileName: 'models/Cloud/cloudJump.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.JUMPING,
    characterId: cloudId,
    id: 'CloudJump',
  },
  {
    displayName: LOCOMOTION.FALLING,
    fileName: 'models/Cloud/cloudFall.glb',
    state: ANIMATION_STATES.LOCOMOTION,
    locomotion: LOCOMOTION.FALLING,
    characterId: cloudId,
    id: 'CloudFall',
    loop: true,
  },
  {
    displayName: 'Cloud Slash 1',
    fileName: 'models/Cloud/cloudSlash1.glb',
    state: ANIMATION_STATES.ATTACK,
    attackLevel: ATTACK_LEVELS.STANDING_LIGHT,
    characterId: cloudId,
    id: 'CloudSlash1',
  },
  {
    displayName: ANIMATION_STATES.IDLE,
    fileName: 'models/Cloud/cloudIdle.glb',
    state: ANIMATION_STATES.IDLE,
    characterId: cloudId,
    id: 'CloudIdle',
    loop: true,
  },
];

const cloudSounds: Sound[] = [];

const Cloud: CharacterType = {
  id: cloudId,
  name: 'Cloud',
  fileName: 'models/Cloud/cloudBase.glb',
  life: 100,
  size: 1,
  animations: cloudAnimations,
  sounds: cloudSounds,
};

export const characters = [Tifa, Cloud];
