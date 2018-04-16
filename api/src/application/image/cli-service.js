const uuidv4 = require('uuid/v4');
const child_process = require('child_process');
module.exports = {
  commandConstructor: settings => {
    console.log(settings);
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
          if (numberOfShapes && numberOfShapes < 10000) {
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
        const frameNumber = `frame${settings.frameNumber}`;
        this.shapes = numShapes(imageSettingsObject.numberOfShapes);
        this.imageID = imageSettingsObject.imageID;
        this.frameNumber = frameNumber;
        // Why did I put a frameNumber in the command? Maybe keep around until I figure that out.
        // const command = `foglemanPrimitive -i ${pathToSource()}${frameNumber} -n ${shapes ||
        //   50} -rep ${rep(settings.rep) || 50} -m ${mode(
        //   settings.mode
        // )} -v -o ${pathToOutput()}/${outputName()}.svg`;
        this.command = `primitive -i ${pathToSource()} -n ${this.shapes ||
          5} -rep ${rep(settings.rep) || 5} -m ${mode(
          settings.mode
        )} -v -o ${settings.output}.svg`;
      }
    }
    return new command(settings);
  },
  replicate: (command, imageSettings) => {
    return child_process.exec(command, function(error, stdout, stderr) {
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
