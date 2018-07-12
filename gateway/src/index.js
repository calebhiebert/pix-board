const pino = require('pino');
const app = require('express')();
const bodyParser = require('body-parser');
const nc = require('./nats');
const msgpack = require('msgpack');
const v = require('./validate');

const port = process.env.PORT || 3000;
const logger = pino({ name: 'index' });
const errLogger = pino({ name: 'unhandled-err' });

app.use(bodyParser.json());

nc.subscribe('placement', (request, replyTo) => {
  const data = msgpack.unpack(request);
  logger.info('Placement', data);

  nc.publish(replyTo, msgpack.pack({ placement: 'reply' }));
});

app.post('/place', async (req, res) => {
  try {
    // Validate the place body to make sure it has the proper properties
    await v.validatePlacePost(req.body);
  } catch (err) {
    return res.status(400).json({ error: 'invalid request', info: err.errors });
  }

  // Validate user can place pix here (check time since last placement and whatnot)

  const result = await nc.requestOneAsync('placement', msgpack.pack(req.body), {}, 1000);

  logger.info('got result', result);

  res.status(200).json({ ok: 'yes' });
});

app.get('/info', async (req, res) => {
  res.status(200).json({
    board: {
      xWidth: 200,
      yWidth: 200,
    },
    player: {
      placeRate: 60,
    },
    colors: [
      { hex: '#B21F35', name: 'deep-red' },
      { hex: '#D82735', name: 'red' },
      { hex: '#FF7435', name: 'orange' },
      { hex: '#FFA135', name: 'light-orange' },
      { hex: '#FFCB35', name: 'dark-yellow' },
      { hex: '#FFF735', name: 'yellow' },
      { hex: '#00753A', name: 'dark-green' },
      { hex: '#0075A3', name: 'green' },
      { hex: '#16DD36', name: 'light-green' },
      { hex: '#0052A5', name: 'dark-blue' },
      { hex: '#0079E7', name: 'blue' },
      { hex: '#06A9FC', name: 'light-blue' },
      { hex: '#681E7E', name: 'dark-purple' },
      { hex: '#7D3CB5', name: 'purple' },
      { hex: '#BD7AF6', name: 'light-purple' },
    ],
  });
});

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  logger.info('Server ready', { port });
});

process.on('uncaughtException', (err) => {
  errLogger.error('ERROR', err.stack);
});
