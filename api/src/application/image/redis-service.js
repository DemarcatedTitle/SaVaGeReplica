const { promisify } = require('util');
var redis = require('redis'),
  client = redis.createClient(6379, 'redis');
const hsetAsync = promisify(client.hset).bind(client);
const getAsync = promisify(client.get).bind(client);
const hgetallAsync = promisify(client.hgetall).bind(client);
const hgetAsync = promisify(client.hget).bind(client);

module.exports.logProgress = command => data => {
  //
  // While process is running update progress on redis
  //
  const currentStep = parseInt(data.slice(0, data.indexOf(':')));
  // TODO change it so it doesn't undo setting it to 1
  //
  const progress = isNaN(currentStep) ? 0 : currentStep / command.shapes;
  if (!isNaN(currentStep)) {
    return hsetAsync(
      command.imageID,
      command.frameNumber,
      progress
    ).catch(err => console.error(err));
  } else {
    return { progress: progress.toString() };
  }
};

module.exports.logAnimated = uploadID => {
    return hsetAsync(
      uploadID,
      'animated',
      true
    ).catch(err => console.error(err));
}
module.exports.getAnimated = uploadID => {
    return hgetAsync(uploadID, 'animated').catch(err => console.error(err));
}

module.exports.getProgress = uploadID => {
  return hgetallAsync(uploadID)
    .then(progress => {
      if (progress !== null) {
        if (progress.animated === 'true') {
          return 100
        }
        const progressArray = Object.entries(progress);

        const totalPercent = progressArray.reduce((accumulator, frame) => {
          if (frame[0].slice(0, 5) === 'frame') {
            const percent = parseInt(frame[1] * 100);
            return accumulator + percent;
          } else {
            return accumulator;
          }
        }, 0);

        const averagePercent = totalPercent / progressArray.length;

        return averagePercent;
      } else {
        throw new Error('There was a problem checking progress');
      }
    })
    .catch(err => console.error(err));
};
