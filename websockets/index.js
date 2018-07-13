const nc = require('@px/nats');
const msgpack = require('msgpack');
const pino = require('pino');
const ws = require('ws');

const connections = {};
const logger = pino({ name: 'websockets', level: process.env.LOG_LEVEL || 'info' });

const wss = new ws.Server({
  port: process.env.PORT || 8080,
});

const broadcast = (type, data) => {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msgpack.pack({ type, data }));
    }
  }
};

nc.subscribe('new-pixel', (data) => {
  const unpacked = msgpack.unpack(data);
  broadcast('new-pixel', unpacked);
});
