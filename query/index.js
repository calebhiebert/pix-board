const nc = require('@px/nats');
const msgpack = require('msgpack');
const pino = require('pino');
const db = require('@px/db');
const Redis = require('ioredis');

const logger = pino({ name: 'query' });
const redis = new Redis(process.env.REDIS);

nc.subscribe('new-pixel', async (data) => {
  const pixel = msgpack.unpack(data);
  await redis.bitfield('board', 'SET', 'u8', (pixel.y * 200 + pixel.x) * 8, pixel.pix);
});

nc.subscribe('board-cache', async (data, replyTo) => {
  const bitField = await redis.getBuffer('board');
  if (bitField === null) {
    logger.info('Reconstructing board');
    const pixels = await db.getBoard();
    let board = Buffer.from(constructBoard(pixels));
    await redis.setBuffer('board', board);
    nc.publish(replyTo, board);
  } else {
    nc.publish(replyTo, bitField);
  }
});

function constructBoard(pixels) {
  const board = new Uint8Array(200 * 200);

  for (const p of pixels) {
    board[mapCoords(p.x, p.y, 200, 200)] = p.pix;
  }

  return board;
}

async function startBoard() {
  const bitfield = await redis.getBuffer('board');

  if (bitfield === null || bitfield.length < 200 * 200) {
    logger.info('Reconstructing board');
    const pixels = await db.getBoard();
    let board = Buffer.from(constructBoard(pixels));
    await redis.setBuffer('board', board);
  }
}

startBoard();

function mapCoords(x, y, w, h) {
  return y * w + x;
}
