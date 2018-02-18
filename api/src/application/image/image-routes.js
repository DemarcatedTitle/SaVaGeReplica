const Joi = require('joi');
const imagecontroller = require('./image-controller.js');
module.exports = [
  {
    method: 'GET',
    path: '/image/{uploadID}',
    handler: imagecontroller.get,
    // config: {
    //   tags: ['api'],
    //   description: 'An example endpoint using a controller',
    // },
  },
  {
    method: 'GET',
    path: '/api/image/uploaded/{uploadID}',
    handler: imagecontroller.getUploaded,
    // config: {
    //   tags: ['api'],
    //   description: 'An example endpoint using a controller',
    // },
  },
  {
    method: 'GET',
    path: '/api/image/all',
    handler: imagecontroller.getAll,
    // config: {
    //   tags: ['api'],
    //   description: 'An example endpoint using a controller',
    // },
  },
  {
    method: 'GET',
    path: '/image',
    handler: (request, h, err) => {
      if (err) throw err;
      return h.response('Hey');
      // return h.response('GET /image');
    },
    // config: {
    //   tags: ['api'],
    //   description: 'An example endpoint using a controller',
    // },
  },
  {
    method: 'POST',
    path: '/api/image',
    config: {
      tags: ['api'],
      description: 'Image upload route',
      payload: {
        maxBytes: 11457280,
      },
      validate: {
        payload: {
          outputfilename: Joi.string(),
          numofshapes: Joi.number().integer(),
          mode: Joi.number().integer(),
          rep: Joi.number().integer(),
          nth: Joi.number().integer(),
          outputsize: Joi.number().integer(),
          alpha: Joi.number().integer(),
          backgroundcolor: Joi.number().integer(),
          file: Joi.binary(),
          filename: Joi.string(),
        },
      },
    },
    handler: imagecontroller.uploadImage,
  },
  {
    method: 'POST',
    path: '/api/animator/create',
    config: {
      tags: ['api'],
      description: 'Image upload route for animation',
      payload: {
        maxBytes: 11457280,
      },
      validate: {
        payload: Joi.array().items(
          Joi.string(),
          Joi.binary(),
          Joi.object({
            frame: Joi.number().integer(),
            numofshapes: Joi.number().integer(),
            mode: Joi.number().integer(),
            rep: Joi.number().integer(),
            nth: Joi.number().integer(),
            outputsize: Joi.number().integer(),
            alpha: Joi.number().integer(),
            backgroundcolor: Joi.number().integer(),
          })
        ),
      },
    },
    handler: imagecontroller.animate,
  },
  // {
  //   method: 'GET',
  //   path: '/async-validation-example',
  //   handler: (request, reply) => {
  //     reply({ message: 'the request was valid!' });
  //   },
  //   config: {
  //     tags: ['api'],
  //     description: 'An example endpoint using async validation',
  //     validate: {
  //       query: asyncValidation(
  //         {
  //           key: Joi.string().required(),
  //         },
  //         {
  //           key: (value, context) => Promise.resolve(value),
  //         }
  //       ),
  //     },
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/example-auth',
  //   handler: (request, reply) => {
  //     reply({ message: 'an authenticated reply!' });
  //   },
  //   config: {
  //     auth: 'jwt',
  //     tags: ['api'],
  //     description: 'An example of an authenticated enpoint',
  //   },
  // },
];
