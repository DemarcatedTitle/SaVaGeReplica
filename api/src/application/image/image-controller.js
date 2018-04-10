const util = require('util');
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const child_process = require('child_process');
const uuidv4 = require('uuid/v4');
const dbService = require('../../../db-service.js');
const path = require('path');
const knexfile = require('../../../knexfile.js');
const knex = require('knex')(knexfile);
const imageController = require('./image-controller');
const Boom = require('boom');
const animateTask = require('./gulp-service.js').animate;
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
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
  uploadImage: function(request, h, err) {
    return new Promise(function(resolve) {
      if (err) {
        throw err;
      }
      const imageID = uuidv4();
      let defaults = {};
      defaults.numofshapes = 2;
      defaults.rep = 0;
      defaults.nth = 0;
      defaults.mode = 1;
      defaults.name = 'Your Picture';
      fs.writeFile(
        './src/application/image/images/' + imageID,
        request.payload.file,
        err => {
          if (err) throw err;
          console.log('The file has been saved!');
          function numShapes(numofshapes) {
            if (
              typeof parseInt(numofshapes) === 'number' &&
              numofshapes < 10000
            ) {
              return numofshapes;
            } else {
              return defaults.numofshapes;
            }
          }
          function rep(rep) {
            if (typeof parseInt(rep) === 'number' && rep < 10000) {
              return rep;
            } else {
              return defaults.rep;
            }
          }
          function mode(mode) {
            console.log(mode);
            if (
              typeof parseInt(request.payload.mode) === 'number' &&
              request.payload.mode < 9
            ) {
              return request.payload.mode;
            } else {
              return defaults.mode;
            }
          }
          function outputName(name) {
            if (request.payload.outputfilename) {
              return request.payload.outputfilename;
            } else {
              return defaults.name;
            }
          }
          const shapes = numShapes(request.payload.numofshapes);
          // console.log(typeof shapes);
          const command = `foglemanPrimitive -i ./src/application/image/images/${imageID} -n ${shapes} -rep ${rep(
            request.payload.rep
          )} -m ${mode(
            request.payload.mode
          )} -v -o ./src/application/image/images/${imageID}.svg`;
          console.log(command);
          //
          // Generate a uuid, reply with that uuid
          // Run the command with that uuid as a filename
          //
          child_process
            .exec(command, function(error, stdout, stderr) {
              //
              // Process is complete, insert into DB based on uuid
              // Then update redis to indicate this
              //
              if (error) {
                console.error(`exec error: ${error}`);
              }
              var yoursvg;
              yoursvg = stdout.substring(
                stdout.indexOf('<svg'),
                stdout.indexOf('</svg>') + 6
              );
              console.log(`stderr: ${stderr}`);
              // const response = h.response(yoursvg);
              // response.type('image/svg+xml');
              // return response;
              const dbImageShape = {
                name: outputName(request.payload.outputfilename),
                id: imageID,
              };
              dbService.addImage(dbImageShape);
            })
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
              console.log(`currentStep: ${currentStep}\nshapes: ${shapes}`);
              const progress = isNaN(currentStep) ? 0 : currentStep / shapes;
              console.log(progress);
              if (!isNaN(currentStep)) {
                if (progress > 100) {
                  console.log('\n\nprogress is over 100 \n\n');
                }
                client.set(imageID, progress);
              }
            });
          client.set(imageID, 0, function() {
            resolve(h.response({ uploadID: imageID }));
          });
        }
      );
    });
  },
  animate: async (request, h, err) => {
    console.log('\n\nanimate\n\n');
    const imageID = uuidv4();
    const pathToFile = './src/application/image/images/' + imageID + '/';
    const pathToSource = pathToFile + 'uploaded';
    const pathToFrames = pathToFile + 'frames';
    console.log(request.payload);
    await mkdir(pathToFile)
      .then(val => mkdir(pathToSource))
      .then(val => mkdir(pathToFrames))
      .then(val =>
        writeFile(pathToSource + '/' + imageID, request.payload.image)
      )
      .catch(error => console.error(error));
    // TODO run commands to turn into svg
    // TODO run gulp to combine svg
    animateTask(pathToSource);
    request.payload.animationFrames.forEach(function(item, index) {
      item['frameNumber'] = index;
      item['outputfilename'] = 'frame' + index;
      item['pathToSource'] = pathToSource + '/' + imageID;
      item['pathToOutput'] = pathToFile + 'frames';
      console.log(module.exports.commandConstructor(item));
      module.exports.replicate(request, item);
    });

    return 'STRING';
  },
  commandConstructor: settings => {
    const imageID = uuidv4();
    let defaults = {};
    defaults.numberOfShapes = 2;
    defaults.rep = 0;
    defaults.nth = 0;
    defaults.mode = 1;
    defaults.name = 'Your Picture';
    function numShapes(numberOfShapes) {
      if (
        typeof parseInt(numberOfShapes) === 'number' &&
        numberOfShapes < 10000
      ) {
        return numberOfShapes;
      } else {
        return defaults.numberOfShapes;
      }
    }
    function rep(rep) {
      if (typeof parseInt(rep) === 'number' && rep < 10000) {
        return rep;
      } else {
        return defaults.rep;
      }
    }
    function mode(mode) {
      if (typeof parseInt(settings.mode) === 'number' && settings.mode < 9) {
        return settings.mode;
      } else {
        return defaults.mode;
      }
    }
    function outputName(name) {
      if (settings.outputfilename) {
        return settings.outputfilename;
      } else {
        return defaults.name;
      }
    }
    function pathToSource(pathToSource) {
      if (settings.pathToSource) {
        return settings.pathToSource;
      } else {
        return './src/application/image/images/';
      }
    }
    function pathToOutput(pathToOutput) {
      if (settings.pathToOutput) {
        return settings.pathToOutput;
      } else {
        return './src/application/image/images/';
      }
    }
    let frameNumber = '';
    if (settings.frameNumber) {
      frameNumber = `frame${settings.frameNumber}`;
    }
    const shapes = numShapes(settings.numberOfShapes);
    // Why did I put a frameNumber in the command? Maybe keep around until I figure that out.
    // const command = `foglemanPrimitive -i ${pathToSource()}${frameNumber} -n ${shapes ||
    //   50} -rep ${rep(settings.rep) || 50} -m ${mode(
    //   settings.mode
    // )} -v -o ${pathToOutput()}/${outputName()}.svg`;
    const command = `foglemanPrimitive -i ${pathToSource()} -n ${shapes ||
      50} -rep ${rep(settings.rep) || 50} -m ${mode(
      settings.mode
    )} -v -o ${pathToOutput()}/${outputName()}.svg`;
    return command;
  },
  replicate: (request, imageSettings) => {
    const command = module.exports.commandConstructor(imageSettings);
    child_process
      .exec(command, function(error, stdout, stderr) {
        //
        // Process is complete, insert into DB based on uuid
        // Then update redis to indicate this
        //
        if (error) {
          console.error(`exec error: ${error}`);
        }
        var yoursvg;
        yoursvg = stdout.substring(
          stdout.indexOf('<svg'),
          stdout.indexOf('</svg>') + 6
        );
        console.log(`stderr: ${stderr}`);
        // const response = h.response(yoursvg);
        // response.type('image/svg+xml');
        // return response;
        //
        // const dbImageShape = {
        //   name: outputName(imageSettings.outputFilename),
        //   id: imageID,
        // };
        // dbService.addImage(dbImageShape);
      })
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
        console.log(
          `currentStep: ${currentStep}\nshapes: ${imageSettings.frameNumber}`
        );
        const progress = isNaN(currentStep)
          ? 0
          : currentStep / imageSettings.frameNumber;
        console.log(progress);
        if (!isNaN(currentStep)) {
          if (progress > 100) {
            console.log('\n\nprogress is over 100 \n\n');
          }
          client.set(imageSettings.outputFilename, progress);
        }
      });
  },
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['server'];
