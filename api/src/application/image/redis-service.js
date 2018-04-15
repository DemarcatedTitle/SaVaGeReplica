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
      return percent;
    } else {
      throw new Error('There was a problem checking progress');
    }
  });
};
