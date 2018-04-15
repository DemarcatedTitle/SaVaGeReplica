const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const child_process = require('child_process');
const uuidv4 = require('uuid/v4');
const dbService = require('../../../db-service.js');
const path = require('path');
const knexfile = require('../../../knexfile.js');
const knex = require('knex')(knexfile);
const replicate = require('./cli-service.js').replicate;
const imageController = require('./image-controller');
const Boom = require('boom');
const animateTask = require('./gulp-service.js').animate;
const watcher = require('./gulp-service.js').watcher;
const commandConstructor = require('./cli-service.js').commandConstructor;
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
const setAsync = promisify(client.set).bind(client);
// const uploadID = uuidv4();
module.exports = {
  get: (request, h, err) => {
    const uploadID = request.params.uploadID;
    return new Promise(function(resolve) {
      if (err) {
        throw err;
      }
      // if you'd like to select database 3, instead of 0 (default), call
      // client.select(3, function() { /* ... */ });
      //
      // If client.get uuid is integer, return integer for progress indicator
      //
      // If client.get uuid is 'finished'
      // get image from db based on uuid
      //

      client.on('error', function(err) {
        console.log('Error ' + err);
      });
      client.get(uploadID, function(err, results) {
        console.log(`Results is: ${results}`);
        if (results !== null) {
          const percent = parseInt(results * 100);
          if (percent === 100) {
            // currently a race condition
            console.log(uploadID);
            const uploadedSVGData = dbService.getImageData(uploadID);
            uploadedSVGData.then(thesvg => {
              if (thesvg === []) {
                resolve(h.response({ progress: percent.toString() }));
              } else {
                let pathToFile = `src/application/image/images/${uploadID}.svg`;
                console.log(`path to file is ${pathToFile}`);
                resolve(h.file(pathToFile));
              }
            });
          } else {
            console.log(percent);
            resolve(h.response({ progress: percent.toString() }));
          }
        } else {
          resolve(h.response('error'));
        }
      });
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
    // return new Promise(function(resolve) {{{{
    //   if (err) {
    //     throw err;
    //   }
    //   // if you'd like to select database 3, instead of 0 (default), call // client.select(3, function() { /* ... */ });
    //   //
    //   // If client.get uuid is integer, return integer for progress indicator
    //   //
    //   // If client.get uuid is 'finished'
    //   // get image from db based on uuid
    //   //

    //   client.on('error', function(err) {
    //     console.log('Error ' + err);
    //   });
    //   client.get(uploadID, function(err, results) {
    //     if (results !== null) {
    //       const percent = parseInt(results * 100);
    //       if (percent === 100) {
    //         // currently a race condition
    //         console.log(uploadID);
    //         const yoursvg = dbService.getImage(uploadID);
    //         yoursvg.then(thesvg => {
    //           if (thesvg == []) {
    //             resolve(h.response({ progress: percent.toString() }));
    //           } else {
    //             let path = `src/application/image/images/${uploadID}.svg`;
    //             resolve(h.file(path));
    //             const response = h.response(thesvg[0].image);
    //             response.type('image/svg+xml');
    //             resolve(h.response(response));
    //           }
    //         });
    //       } else {
    //         console.log(percent);
    //         resolve(h.response({ progress: percent.toString() }));
    //       }
    //     } else {
    //       resolve(h.response('error'));
    //     }
    //   });
    // });}}}
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
        numofshapes: request.payload.numofshapes,
      };
      await writeFile(pathToSource, request.payload.file);
      const command = commandConstructor(imageSettings);
      replicate(command.command, imageSettings)
        .stdout.on('data', function(data) {
          //
          // While process is running update progress on redis
          //
          const currentStep = parseInt(data.slice(0, data.indexOf(':')));
          // console.log(currentStep);
          // console.log(``);
          //
          //
          // TODO change it so it doesn't undo setting it to 1
          //
          console.log(`currentStep: ${currentStep}\nshapes: ${command.shapes}`);
          const progress = isNaN(currentStep)
            ? 0
            : currentStep / command.shapes;
          // console.log(progress);
          if (!isNaN(currentStep)) {
            if (progress > 100) {
              console.log('\n\nprogress is over 100 \n\n');
            }
            client.set(imageID, progress);
          }
        })
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
    // console.log(request.payload);
    await mkdir(pathToFile)
      .then(val => mkdir(pathToSource))
      .then(val => mkdir(pathToFrames))
      .then(val =>
        writeFile(pathToSource + '/' + imageID, request.payload.image)
      )
      .catch(error => console.error(error));
    // TODO run gulp to combine svg
    const dbImageShape = {
      name: request.payload.animationInformation.filename, //outputName(imageSettings.outputFilename),
      id: imageID,
      type: 'animation',
    };
    console.log(dbImageShape);
    console.log(request.payload);
    dbService.addImage(dbImageShape);
    const framePromises = Array.from(request.payload.animationFrames, function(
      imageSettings,
      index
    ) {
      console.log('before replication');
      imageSettings['frameNumber'] = index;
      imageSettings['outputfilename'] = 'frame' + index;
      imageSettings['pathToSource'] = pathToSource + '/' + imageID;
      imageSettings['pathToOutput'] = pathToFile + 'frames';
      imageSettings['output'] = pathToFile + 'frames/frame' + index;
      const command = commandConstructor(imageSettings);
      return new Promise((resolve, reject) => {
        replicate(command.command, imageSettings)
          .stdout.on('data', function(data) {
            //
            // While process is running update progress on redis
            //
            const currentStep = parseInt(data.slice(0, data.indexOf(':')));
            // console.log(currentStep);
            // console.log(``);
            // TODO change it so it doesn't undo setting it to 1
            // console.log(
            //   `currentStep: ${currentStep}\nshapes: ${imageSettings.frameNumber}`
            // );
            const progress = isNaN(currentStep)
              ? 0
              : currentStep / imageSettings.frameNumber;
            console.log(
              'frame number is ' +
                imageSettings.frameNumber +
                ' | progress is ' +
                progress
            );
            if (!isNaN(currentStep)) {
              if (progress > 100) {
                console.log('\n\nprogress is over 100 \n\n');
              }
              client.set(imageSettings.output, progress);
            }
          })
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
