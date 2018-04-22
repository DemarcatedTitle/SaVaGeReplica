const Joi = require('joi');
const Boom = require('boom');
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
    method: 'DELETE',
    path: '/api/image/delete/{imageId}',
    handler: imagecontroller.deleteImageById,
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
        failAction: (request, h, err) => {
          return err;
        },
        payload: {
          outputfilename: Joi.string(),
          settings: {
            numofshapes: Joi.number().integer(),
            mode: Joi.number().integer(),
            rep: Joi.number().integer(),
            nth: Joi.number().integer(),
            outputsize: Joi.number().integer(),
            alpha: Joi.number().integer(),
            backgroundcolor: Joi.number().integer(),
          },
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
        failAction: async (request, h, err) => {
          console.log(request.payload.animationInformation);
          return new Boom(err);
        },
        payload: {
          animationInformation: Joi.object({
            filename: Joi.string(),
            filetype: Joi.number().integer(),
            resize: Joi.string(),
            outputsize: Joi.string(),
          }),
          animationFrames: Joi.array()
            .items(
              Joi.object({
                frame: Joi.number()
                  .integer()
                  .allow(''),
                numberOfShapes: Joi.number()
                  .integer()
                  .allow(''),
                mode: Joi.number()
                  .integer()
                  .allow(''),
                rep: Joi.number()
                  .integer()
                  .allow(''),
                nth: Joi.number()
                  .integer()
                  .allow(''),
                alpha: Joi.number()
                  .integer()
                  .allow(''),
                backgroundcolor: Joi.number()
                  .integer()
                  .allow(''),
              })
            )
            .required(),
          image: Joi.binary(),
        },
      },
    },
    handler: imagecontroller.animate,
  },
];
