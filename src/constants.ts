import { atom } from 'jotai';
import type { CharacterType } from './types';

export const charactersAtom = atom<CharacterType[]>([]);

export enum LOCOMOTION {
  WALKING = 'WALKING',
  RUNNING = 'RUNNING',
  JUMPING = 'JUMPING',
  DODGING = 'DODGING',
  LANDING = 'LANDING', // New state for landing after a jump
}

export enum ANIMATION_STATES {
  LOCOMOTION = 'LOCOMOTION',
  IDLE = 'IDLE',
  TAUNT = 'TAUNT',
  ATTACK = 'ATTACK',
  ABILITY = 'ABILITY',
  DEATH = 'DEATH',
  DAMAGED = 'DAMAGED',
  POSE = 'POSE',
  ATTACK_TRANSITION = 'ATTACK_TRANSITION',
  INTERRUPTED = 'INTERRUPTED', // General state for being interrupted
}

export enum AUDIO {
  VOICE_FX = 'VOICE_FX',
  SOUND_FX = 'SOUND_FX',
  MUSIC = 'MUSIC',
}

export enum SOCKET_EVENTS {
  CONNECTION = 'connection',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  HELLO = 'hello',
  CHARACTERS = 'characters',
  MOVE = 'move',
}
