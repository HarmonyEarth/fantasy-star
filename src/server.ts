import { SOCKET_IO_EVENTS } from './constants';
import type { CharacterType } from './types';

interface WebSocketData {
  id: string;
}

const port = 3001;
const characters: CharacterType[] = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
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

      const character = {
        id: ws.data.id,
        position: generateRandomPosition(),
      };

      characters.push(character);

      ws.send(
        JSON.stringify({
          event: SOCKET_IO_EVENTS.HELLO,
          data: null,
        })
      );

      server.publish(
        'game-updates',
        JSON.stringify({
          event: SOCKET_IO_EVENTS.CHARACTERS,
          data: characters,
        })
      );
    },
    message(ws, message) {
      try {
        const parsed = JSON.parse(String(message));
        const { event, data } = parsed;

        if (event === SOCKET_IO_EVENTS.MOVE) {
          const character = characters.find((c) => c.id === ws.data.id);

          if (character) {
            character.position = data;
            server.publish(
              'game-updates',
              JSON.stringify({
                event: SOCKET_IO_EVENTS.CHARACTERS,
                data: characters,
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

      const index = characters.findIndex((c) => c.id === ws.data.id);
      if (index !== -1) {
        characters.splice(index, 1);
        server.publish(
          'game-updates',
          JSON.stringify({
            event: SOCKET_IO_EVENTS.CHARACTERS,
            data: characters,
          })
        );
      }
    },
  },
});

console.log(`WebSocket server running on ws://localhost:${port}`);
