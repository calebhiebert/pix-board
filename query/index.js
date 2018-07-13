const nc = require('@px/nats');
const msgpack = require('msgpack');
const pino = require('pino');
const db = require('@px/db');

const logger = pino({ name: 'query' });

let boardCache = null;

nc.subscribe('board-cache', async (data, replyTo) => {
  let board;

  if (boardCache === null) {
    const pixels = await db.getBoard();

    board = Buffer.from(constructBoard(pixels));
    boardCache = board;
  } else {
    board = boardCache;
  }

  nc.publish(replyTo, Buffer.from(board));
});

function constructBoard(pixels) {
  const board = new Uint8Array(200 * 200);

  for (const p of pixels) {
    board[mapCoords(p.x, p.y, 200, 200)] = p.pix;
  }

  return board;
}

function mapCoords(x, y, w, h) {
  return y * w + x;
}
