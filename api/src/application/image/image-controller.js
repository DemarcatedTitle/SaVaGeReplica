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
const setAsync = promisify(client.set).bind(client);
module.exports = {
  get: (request, h, err) => {
    const uploadID = request.params.uploadID;
    return new Promise(function(resolve) {
      if (err) {
        throw err;
      }
      client.on('error', function(err) {
        console.log('Error ' + err);
      });
      return resolve(
        redisService.getProgress(uploadID).then(progress => {
          if (progress < 100) {
            return { progress: progress.toString() };
          } else if (progress === 100) {
            console.log('get uploaded');
            const uploadID = request.params.uploadID;
            let pathToFile = `src/application/image/images/${uploadID}.svg`;
            return h.file(pathToFile);
          }
        })
      );
    });
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
    console.log('Delete');
    return h.response('Okay');
  },
  getUploaded: (request, h, err) => {
    console.log('get uploaded');
    const uploadID = request.params.uploadID;
    let pathToFile = `src/application/image/images/${uploadID}.svg`;
    return h.file(pathToFile);
  },
  getAll: (request, h, err) => {
    return new Promise(function(resolve) {
      dbService
        .getAllImages()
        .then(allImages => {
          console.log(allImages);
          resolve(h.response(allImages));
        })
        .catch(err => console.log(err));
    });
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
      await setAsync(imageID, 0);
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
    await mkdir(pathToFile)
      .then(val => mkdir(pathToSource))
      .then(val => mkdir(pathToFrames))
      .then(val =>
        writeFile(pathToSource + '/' + imageID, request.payload.image)
      )
      .catch(error => console.error(error));
    const dbImageShape = {
      name: request.payload.animationInformation.filename,
      id: imageID,
      type: 'animation',
    };
    dbService.addImage(dbImageShape);
    const framePromises = Array.from(request.payload.animationFrames, function(
      imageSettings,
      index
    ) {
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
    Promise.all(framePromises)
      .then(values => {
        console.log(values);
        animateTask(pathToFrames, pathToFile);
      })
      .catch(err => {
        console.log('Catch error\n');
        console.error(err);
        console.log('Catch error\n');
      });

    return 'STRING';
  },
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['server'];
