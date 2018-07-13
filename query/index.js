const nc = require('@px/nats');
const msgpack = require('msgpack');
const pino = require('pino');
const db = require('@px/db');

const logger = pino({ name: 'query' });

nc.subscribe('board-cache', (data, replyTo) => {
  const board = new Uint8Array(200 * 200);

  nc.publish(replyTo, Buffer.from(board));
});

nc.subscribe('board-from-db', async (data, replyTo) => {
  const pixels = await db.getBoard();
  logger.info('Pixel board', pixels);
});
