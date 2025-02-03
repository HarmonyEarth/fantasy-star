import { Vector3 } from 'three';
import { SOCKET_EVENTS } from './constants';
import type { Player } from './types';

interface WebSocketData {
  id: string;
}

const port = 3001;
const players: Player[] = [];

const generateRandomPosition = (): Vector3 => {
  return new Vector3(Math.random() * 3, 0, Math.random() * 3);
};

const generateRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const server = Bun.serve<WebSocketData>({
  port,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response('Upgrade required', { status: 426 });
  },
  websocket: {
    open(ws) {
      console.log('User Connected');
      ws.data = { id: crypto.randomUUID() };
      ws.subscribe('game-updates');

      const player = {
        id: ws.data.id,
        position: generateRandomPosition(),
      };

      players.push(player);

      ws.send(
        JSON.stringify({
          event: SOCKET_EVENTS.HELLO,
          data: null,
        })
      );

      server.publish(
        'game-updates',
        JSON.stringify({
          event: SOCKET_EVENTS.PLAYERS,
          data: players,
        })
      );
    },
    message(ws, message) {
      try {
        const parsed = JSON.parse(String(message));
        const { event, data } = parsed;

        if (event === SOCKET_EVENTS.MOVE) {
          const player = players.find((c) => c.id === ws.data.id);

          if (player) {
            player.position = data;
            server.publish(
              'game-updates',
              JSON.stringify({
                event: SOCKET_EVENTS.PLAYERS,
                data: players,
              })
            );
          }
        }
      } catch (err) {
        console.error('Invalid message received:', message, err);
      }
    },
    close(ws) {
      console.log('User Disconnected');
      ws.unsubscribe('game-updates');

      const index = players.findIndex((c) => c.id === ws.data.id);
      if (index !== -1) {
        players.splice(index, 1);
        server.publish(
          'game-updates',
          JSON.stringify({
            event: SOCKET_EVENTS.PLAYERS,
            data: players,
          })
        );
      }
    },
  },
});

console.log(`WebSocket server running on ws://localhost:${port}`);
