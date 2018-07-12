const ajv = require('ajv');
const Ajv = new ajv({ allErrors: true, removeAdditional: true });

const placeSchema = {
  type: 'object',
  $async: true,
  additionalProperties: false,
  required: ['x', 'y', 'pix'],
  properties: {
    x: {
      type: 'number',
    },
    y: {
      type: 'number',
    },
    pix: {
      type: 'number',
    },
  },
};

module.exports = {
  validatePlacePost: Ajv.compile(placeSchema),
};
