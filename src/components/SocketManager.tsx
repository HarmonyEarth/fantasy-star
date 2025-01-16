import { useEffect } from 'react';
import { useAtom } from 'jotai';
import type { CharacterType } from '../types';
import { SOCKET_EVENTS } from '../constants';
import { charactersAtom } from '../store';

export const SocketManager = () => {
  const [, setCharacters] = useAtom(charactersAtom);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    const onConnect = () => {
      console.log('Connected to WebSocket');
    };

    const onDisconnect = () => {
      console.log('Disconnected from WebSocket');
    };

    const onHello = () => {
      console.log('Hello client side');
    };

    const onCharacters = (characters: CharacterType[]) => {
      console.log('characters', characters);
      setCharacters(characters);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const { event: eventType, data } = JSON.parse(event.data);

        switch (eventType) {
          case SOCKET_EVENTS.HELLO:
            onHello();
            break;
          case SOCKET_EVENTS.CHARACTERS:
            onCharacters(data);
            break;
          default:
            console.warn('Unhandled event:', eventType);
        }
      } catch (err) {
        console.error('Invalid message format:', event.data, err);
      }
    };

    socket.addEventListener('open', onConnect);
    socket.addEventListener('close', onDisconnect);
    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('open', onConnect);
      socket.removeEventListener('close', onDisconnect);
      socket.removeEventListener('message', handleMessage);
      socket.close();
    };
  }, [setCharacters]);

  return null;
};
