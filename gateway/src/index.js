const pino = require('pino');
const app = require('express')();
const bodyParser = require('body-parser');
const msgpack = require('msgpack');
const v = require('./validate');
const nc = require('@px/nats');
// const auth = require('./auth0-middleware');
// const Redis = require('ioredis');

const port = process.env.PORT || 3000;
const logger = pino({ name: 'index' });
const errLogger = pino({ name: 'unhandled-err' });

app.use(bodyParser.json());
// app.use(
//   auth(
//     {
//       domain: process.env.AUTH0_DOMAIN,
//       clientId: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//     },
//     new Redis(),
//   ),
// );

// app.use((req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.header('WWW-Authenticate', 'Bearer');
//     return res.status(401).json({ error: 'Authentication required' });
//   }
// });

app.post('/place', async (req, res) => {
  try {
    // Validate the place body to make sure it has the proper properties
    await v.validatePlacePost(req.body);
  } catch (err) {
    return res.status(400).json({ error: 'invalid request', info: err.errors });
  }

  // Validate user can place pix here (check time since last placement and whatnot)

  try {
    const result = await nc.requestOneAsync('placement', msgpack.pack({ ...req.body, userId: 'dummy' }), {}, 1000);
    const pix = msgpack.unpack(result);
    res.status(200).json(pix);
  } catch (err) {
    logger.error('Placement error', err);
    res.status(500).json({ error: err });
  }
});

app.get('/board', async (req, res) => {
  const board = new Uint8Array(500 * 500);
  res.status(200).write(Buffer.from(board), 'buffer');
  res.end('', 'buffer');
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
    user: req.user,
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
