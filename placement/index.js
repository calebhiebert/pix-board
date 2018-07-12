const nc = require('@px/nats');
const msgpack = require('msgpack');
const pino = require('pino');
const db = require('@px/db');

const logger = pino({ name: 'placement' });

nc.subscribe('placement', async (data, replyTo) => {
  const pixData = msgpack.unpack(data);

  logger.info('Placement', pixData);

  try {
    const { id } = await db.insertPix(pixData.x, pixData.y, pixData.pix, pixData.userId);

    nc.publish(replyTo, msgpack.pack({ id, ...pixData }));
  } catch (err) {
    logger.error('Pix insertion error', err);
  }
});
