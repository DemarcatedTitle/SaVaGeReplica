const fs = require('fs');
const child_process = require('child_process');
const uuidv4 = require('uuid/v4');
const imageDB = require('../../../imageDB.js');
const path = require('path');
// const knexfile = require('../../../knexfile.js');
// const knex = require('../../lib/knex.js');
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
            const yoursvg = imageDB.getImage(uploadID);
            yoursvg.then(thesvg => {
              if (thesvg == []) {
                resolve(h.response({ progress: percent.toString() }));
              } else {
                let path = `src/application/image/images/${uploadID}.svg`;
                resolve(h.file(path));
                const response = h.response(thesvg[0].image);
                response.type('image/svg+xml');
                resolve(h.response(response));
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
  getUploaded: (request, h, err) => {
    const uploadID = request.params.uploadID;
    let path = `src/application/image/images/${uploadID}.svg`;
    return h.file(path);
    // return new Promise(function(resolve) {
    //   if (err) {
    //     throw err;
    //   }
    //   const yoursvg = imageDB.getImage(uploadID);
    //   yoursvg.then(thesvg => {
    //     const response = h.response(thesvg[0].image);
    //     response.type('image/svg+xml');
    //     resolve(h.response(response));
    //   });
    // });
  },
  getAll: (request, h, err) => {
    return new Promise(function(resolve) {
      imageDB
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
          )} -v -bg ff5733 -o ./src/application/image/images/${imageID}.svg`;
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
                image: yoursvg,
                name: outputName(request.payload.outputfilename),
                image_id: imageID,
              };
              imageDB.addImage(dbImageShape);
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
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['server'];
