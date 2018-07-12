const { ManagementClient } = require('auth0');
const logger = require('pino')({ name: 'auth0-middleware', level: process.env.LOG_LEVEL || 'info' });
const jwt = require('jsonwebtoken');
const jwks = require('jwks-rsa');

module.exports = (auth0Options, redis) => {
  const auth0 = new ManagementClient(auth0Options);
  const jwksClient = jwks({
    jwksUri: `https://${auth0Options.domain}/.well-known/jwks.json`,
  });

  const getKey = (header, cb) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return cb(err, null);
      }

      const signingKey = key.publicKey || key.rsaPublicKey;
      cb(null, signingKey);
    });
  };

  const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, (err, decoded) => {
        if (err) {
          return reject(err);
        }

        resolve(decoded);
      });
    });
  };

  const getUserData = async (userId, expireAt) => {
    const cacheData = await redis.get(`user-cache-${userId}`);

    let profile;

    if (cacheData === null) {
      profile = await auth0.getUser({ id: userId });
      await redis.set(`user-cache-${profile.user_id}`, JSON.stringify(profile), 'PX', expireAt * 1000 - Date.now());
    } else {
      profile = JSON.parse(cacheData);
    }

    return {
      id: profile.user_id,
      nickname: profile.nickname,
      name: profile.name,
      picture: profile.picture,
      updatedAt: new Date(profile.updated_at),
      email: profile.email,
      emailVerified: profile.email_verified,
    };
  };

  return async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization && authorization.trim() !== '') {
      const bearerToken = authorization.substring('Bearer '.length).trim();

      let decoded;

      try {
        decoded = await verifyToken(bearerToken);
      } catch (err) {
        logger.debug('JWT Error', err);
        res.header('WWW-Authenticate', 'Bearer');
        return res.status(401).json({ error: err });
      }

      try {
        let userData = await getUserData(decoded.sub, decoded.exp);

        req.user = userData;
        next();
      } catch (err) {
        logger.error('Cache Error', err);
        return res.status(500).json({ error: err });
      }
    } else {
      next();
    }
  };
};
