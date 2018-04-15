const { promisify } = require('util');
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

module.exports.logProgress = command => data => {
  //
  // While process is running update progress on redis
  //
  const currentStep = parseInt(data.slice(0, data.indexOf(':')));
  console.log(typeof currentStep);
  // console.log(currentStep);
  // console.log(``);
  //
  //
  // TODO change it so it doesn't undo setting it to 1
  //
  console.log(`currentStep: ${currentStep}\nshapes: ${command.shapes}`);
  const progress = isNaN(currentStep) ? 0 : currentStep / command.shapes;
  console.log(progress);
  if (!isNaN(currentStep)) {
    if (progress > 100) {
      console.log('\n\nprogress is over 100 \n\n');
    }
    client.set(command.imageID, progress);
  }
};
module.exports.getProgress = uploadID => {
  return getAsync(uploadID).then(progress => {
    console.log(`Progress is: ${progress}`);
    if (progress !== null) {
      const percent = parseInt(progress * 100);
      if (percent === 100) {
        // currently a race condition
        console.log(uploadID);
        // const uploadedSVGData = dbService.getImageData(uploadID);
        // uploadedSVGData.then(thesvg => {
        //     if (thesvg === []) {
        //     resolve(h.response({ progress: percent.toString() }));
        //     } else {
        //     let pathToFile = `src/application/image/images/${uploadID}.svg`;
        //     console.log(`path to file is ${pathToFile}`);
        //     resolve(h.file(pathToFile));
        //     }
        //     });
      } else {
        console.log(percent);
        return { progress: percent.toString() };
      }
    } else {
      throw new Error('There was a problem checking progress');
    }
  });
  // client.get(uploadID, function(err, results) {
  //     if (results !== null) {
  //     const percent = parseInt(results * 100);
  //     if (percent === 100) {
  //     // currently a race condition
  //     console.log(uploadID);
  //     const uploadedSVGData = dbService.getImageData(uploadID);
  //     uploadedSVGData.then(thesvg => {
  //         if (thesvg === []) {
  //         resolve(h.response({ progress: percent.toString() }));
  //         } else {
  //         let pathToFile = `src/application/image/images/${uploadID}.svg`;
  //         console.log(`path to file is ${pathToFile}`);
  //         resolve(h.file(pathToFile));
  //         }
  //         });
  //     } else {
  //     console.log(percent);
  //     resolve(h.response({ progress: percent.toString() }));
  //     }
  //     } else {
  //       resolve(h.response('error'));
  //     }
  // });
};
