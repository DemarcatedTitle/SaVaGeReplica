const uuidv4 = require('uuid/v4');
const child_process = require('child_process');
module.exports = {
  commandConstructor: settings => {
    class command {
      constructor(imageSettingsObject) {
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
          if (
            typeof parseInt(settings.mode) === 'number' &&
            settings.mode < 9
          ) {
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
        this.command = `foglemanPrimitive -i ${pathToSource()} -n ${shapes ||
          5} -rep ${rep(settings.rep) || 5} -m ${mode(
          settings.mode
        )} -v -o ${settings.output}.svg`;
      }
    }
    return new command(settings);
  },
  replicate: imageSettings => {
    const command = module.exports.commandConstructor(imageSettings);
    console.log(command);
    return child_process.exec(command.command, function(error, stdout, stderr) {
      //
      // Process is complete, insert into DB based on uuid
      // Then update redis to indicate this
      //
      if (error) {
        console.error(`exec error: ${error}`);
      }
    });
  },
};