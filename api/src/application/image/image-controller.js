const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const uuidv4 = require('uuid/v4');
const dbService = require('../../../db-service.js');
const path = require('path');
const knexfile = require('../../../knexfile.js');
const knex = require('knex')(knexfile);
const replicate = require('./cli-service.js').replicate;
const redisService = require('./redis-service.js');
const Boom = require('boom');
const animateTask = require('./gulp-service.js').animate;
const commandConstructor = require('./cli-service.js').commandConstructor;
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
const hsetAsync = promisify(client.hset).bind(client);
module.exports = {
  get: async (request, h, err) => {
    console.log('get Ran');
    const uploadID = request.params.uploadID;
    if (err) {
      throw err;
    }
    // Represents primitive still being in progress
    const frameGenerationProgress = await redisService.getProgress(uploadID).catch(err => {
      console.error(err);
      throw Boom.notFound();
    });
    console.log(`\n\nget progress is ${frameGenerationProgress}`);
    if (frameGenerationProgress < 100) {
      return { progress: frameGenerationProgress.toString() };
    } else if (frameGenerationProgress === 100) {
      const imageData = await dbService.getImageData(uploadID);
      if (imageData[0].type === null) {
        return { progress: frameGenerationProgress.toString() };
      } else if (imageData[0].type === 'animation') {

        // Checks to see if the svgs have been processed by the gulp utility
        const animated = await redisService.getAnimated(uploadID);
        if (animated === 'true') {
          return { progress: frameGenerationProgress.toString() };
        }
      } else {
        console.error('line 45');
        return Boom.notFound();
      }

      // Currently unknown if gulp svg utility has something that can be used for this.
      const totalProgress = 99;
      return { progress: totalProgress.toString() };
    }
  },

  deleteImage: async (request, h, err) => {
    const imageId = request.params.imageId;
    const svg_image_deleted = await knex('image_references')
      .where('id', '=', imageId)
      .delete();
    if (svg_image_deleted > 0) {
      const pathToFile = `src/application/image/images/`;
      try {
        await unlink(pathToFile + imageId + '.svg');
        await unlink(pathToFile + imageId);
      } catch (err) {
        if (err) {
          return Boom.notFound();
        }
      }
    } else {
      return Boom.notFound();
    }
    return h.response('Okay');
  },
  getUploaded: async (request, h, err) => {
    console.log('get uploaded ran');
    const uploadID = request.params.uploadID;
    const imageData = await dbService.getImageData(uploadID);
    const imageReference = imageData[0];
    if (imageReference.type === null) {
      const pathToFile = `src/application/image/images/${uploadID}.svg`;
      return h.file(pathToFile);
    } else if (imageReference.type === 'animation') {
      const pathToFile = `src/application/image/images/${uploadID}/css/svg/sprite.css.svg`;
      return h.file(pathToFile);
    }
  },
  getAll: async (request, h, err) => {
    return h.response(await dbService.getAllImages());
  },
  uploadImage: async function(request, h, err) {
    try {
      const imageID = uuidv4();
      let defaults = {};
      const pathToSource = './src/application/image/images/' + imageID;
      const pathToDir = './src/application/image/images/';
      defaults.numofshapes = 2;
      defaults.rep = 0;
      defaults.nth = 0;
      defaults.mode = 1;
      defaults.name = 'Your Picture';
      const imageSettings = {
        mode: request.payload.mode,
        outputfilename: request.payload.outputfilename,
        pathToSource: pathToSource,
        output: pathToDir + imageID,
        imageID: imageID,
        numberOfShapes: request.payload.numofshapes,
      };
      await writeFile(pathToSource, request.payload.file);
      const command = commandConstructor(imageSettings);
      replicate(command.command, imageSettings)
        .stdout.on('data', redisService.logProgress(command))
        .on('error', function(error) {
          console.error(error);
        })
        .on('close', function(data) {
          const dbImageShape = {
            name: request.payload.outputfilename,
            id: imageID,
          };
          dbService.addImage(dbImageShape);
        });
      await hsetAsync(imageID, 'frame0', 0).catch(err => console.error(err));
      return h.response({ uploadID: imageID });
    } catch (e) {
      console.error(e);
    }
  },
  animate: async (request, h, err) => {
    console.log('\n\nanimate\n\n');
    const imageID = uuidv4();
    const pathToFile = './src/application/image/images/' + imageID + '/';
    const pathToSource = pathToFile + 'uploaded';
    const pathToFrames = pathToFile + 'frames';
    await mkdir(pathToFile);
    await mkdir(pathToSource);
    await mkdir(pathToFrames);
    await writeFile(pathToSource + '/' + imageID, request.payload.image);
    const dbImageShape = {
      name: request.payload.animationInformation.filename,
      id: imageID,
      type: 'animation',
    };
    await dbService.addImage(dbImageShape);
    const framePromises = Array.from(request.payload.animationFrames, function(imageSettings, index) {
      imageSettings['frameNumber'] = index;
      imageSettings['outputfilename'] = 'frame' + index;
      imageSettings['pathToSource'] = pathToSource + '/' + imageID;
      imageSettings['pathToOutput'] = pathToFile + 'frames';
      imageSettings['output'] = pathToFile + 'frames/frame' + index;
      imageSettings['imageID'] = imageID;
      const command = commandConstructor(imageSettings);
      return new Promise((resolve, reject) => {
        replicate(command.command, imageSettings)
          .stdout.on('data', redisService.logProgress(command))
          .on('error', reject)
          .on('close', resolve);
      });
    });
    await hsetAsync(imageID, 'frame0', 0).catch(err => console.error(err));
    Promise.all(framePromises).then(val => {
      return animateTask(pathToFrames, pathToFile).on('end', function() {
        console.log('\n\nThe animate task has ended\n\n');
        redisService.logAnimated(imageID);
      });
    });

    return h.response({ uploadID: imageID });
  },
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['server'];
