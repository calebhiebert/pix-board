const nats = require('nats');
const { promisify } = require('util');
const logger = require('pino')({ name: 'nats', level: process.env.LOG_LEVEL || 'info' });

const nc = nats.connect({ url: process.env.NATS || 'nats://localhost:4222', preserveBuffers: true });

nc.publish = promisify(nc.publish);

nc.requestOneAsync = (subject, msg, options, timeout) => {
  return new Promise((resolve, reject) => {
    nc.requestOne(subject, msg, options, timeout, (response) => {
      if (response instanceof nats.NatsError && response.code === nats.REQ_TIMEOUT) {
        reject('Request timed out');
      } else {
        resolve(response);
      }
    });
  });
};

nc.on('error', (err) => {
  logger.error('Error occured', err);
});

nc.on('connect', () => {
  logger.info('Connected');
});

module.exports = nc;
