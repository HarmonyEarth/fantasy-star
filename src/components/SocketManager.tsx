import { useEffect } from 'react';
import { useAtom } from 'jotai';
import type { Player } from '../types';
import { SOCKET_EVENTS } from '../constants';
import { playersAtom } from '../store';

export const SocketManager = () => {
  const [, setPlayers] = useAtom(playersAtom);

  useEffect(() => {
    const controller = new AbortController();
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

    const onPlayers = (players: Player[]) => {
      console.log('characters', players);
      setPlayers(players);
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const { event: eventType, data } = JSON.parse(event.data);

        switch (eventType) {
          case SOCKET_EVENTS.HELLO:
            onHello();
            break;
          case SOCKET_EVENTS.PLAYERS:
            onPlayers(data);
            break;
          default:
            console.warn('Unhandled event:', eventType);
        }
      } catch (err) {
        console.error('Invalid message format:', event.data, err);
      }
    };

    socket.addEventListener('open', onConnect, { signal: controller.signal });
    socket.addEventListener('close', onDisconnect, {
      signal: controller.signal,
    });
    socket.addEventListener('message', handleMessage, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
      socket.close();
    };
  }, [setPlayers]);

  return null;
};
