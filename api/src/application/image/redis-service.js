const { promisify } = require('util');
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
const hsetAsync = promisify(client.hset).bind(client);
const getAsync = promisify(client.get).bind(client);
const hgetallAsync = promisify(client.hgetall).bind(client);

module.exports.logProgress = command => data => {
  //
  // While process is running update progress on redis
  //
  const currentStep = parseInt(data.slice(0, data.indexOf(':')));
  // TODO change it so it doesn't undo setting it to 1
  //
  const progress = isNaN(currentStep) ? 0 : currentStep / command.shapes;
  console.log(
    `currentStep is: ${currentStep}\ncommand.shapes is ${command.shapes}`
  );
  if (!isNaN(currentStep)) {
    console.log(data.slice(0, data.indexOf(':')));
    if (progress > 100) {
      // console.log('\n\nprogress is over 100 \n\n');
      // console.log(`progress is ${progress}`);
    }
    // console.log(
    //   `command.imageID is ${command.imageID}\ncommand.framenumber is ${command.frameNumber}`
    // );
    return hsetAsync(
      command.imageID,
      command.frameNumber,
      progress
    ).catch(err => console.error(err));
  } else {
    return { progress: progress.toString() };
  }
};
module.exports.getProgress = uploadID => {
  console.log(`\ngetprogress uploadID is \n${uploadID}`);
  return hgetallAsync(uploadID)
    .then(progress => {
      console.log(`Progress is: `);
      console.log(progress);
      if (progress !== null) {
        const progressArray = Object.entries(progress);
        console.log(progressArray);

        const totalPercent = progressArray.reduce((accumulator, frame) => {
          const percent = parseInt(frame[1] * 100);
          console.log(percent);
          return accumulator + percent;
        }, 0);

        const averagePercent = totalPercent / progressArray.length;
        console.log(
          `totalPercent is ${totalPercent}\naveragePercent is ${averagePercent}`
        );

        return averagePercent;
      } else {
        throw new Error('There was a problem checking progress');
      }
    })
    .catch(err => console.error(err));
};
