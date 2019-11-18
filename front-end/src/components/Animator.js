import React from 'react';
import '../Animation.css';
import Paper from '@material-ui/core/Paper';
// import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import sharedFunctions from '../util/sharedFunctions'
import ResultCard from './ResultCard';
import LinearProgress from '@material-ui/core/LinearProgress';
import FrameConfigurator from './FrameConfigurator';
import Upload from './Upload';

/* eslint-disable no-console */
export default class Animator extends React.Component {
  constructor(props) {
    super(props);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateAcceptance = sharedFunctions.updateAcceptance.bind(this);
    this.state = {
      width: '2048',
      mode: 1,
      open: false,
      repDialog: false,
      value: 1,
      accepted: [''],
      rejected: [],
    };
  }
  handleClose() {
    this.setState({ repDialog: false });
  }
  handleOpen() {
    this.setState({ repDialog: true });
  }
  frameNumberChange(event) {
    this.props.frameNumberChange({
      id: event.target.id,
      target: '',
      value: event.target.value,
    });
  }
  handleTyping(event) {
    this.props.animationInformationChange({
      id: event.target.id,
      value: event.target.value,
    });
  }
  increment() {
    this.props.valueChanged({
      value: this.props.animator.size + 1,
    });
  }
  handleChange(item, key) {
    const newObj = {};
    newObj[item] = key;
    this.setState(newObj);
  }
  handleSubmit(event) {
    event.preventDefault();
    //Toggle loading here
    this.props.onSubmit(!this.props.loading);
  }
  uploadImage() {
    var data = new FormData();
    // Object.entries(this.props.text).forEach(function(field) {
    //   if (field[1]) {
    //     data.append(field[1].id, field[1].value);
    //   }
    // });
    const animationUpload = [
      this.state.accepted[0],
      this.state.accepted[0].name,
    ];
    const animationInformation = this.props.animationInformation;
    const animationFrames = [];
    this.props.animator.forEach(function(frame, number) {
      animationFrames[number] = {
        numberOfShapes: frame.get('numberOfShapes'),
        mode: frame.get('mode'),
        rep: frame.get('mode'),
        nth: frame.get('nth'),
        alpha: frame.get('alpha'),
        backgroundcolor: frame.get('backgroundcolor'),
      };
    });
    data.append('animationInformation', JSON.stringify(animationInformation));
    data.append('animationFrames', JSON.stringify(animationFrames));
    data.append('image', this.state.accepted[0]);
    // data.append('filename', this.state.accepted[0].name);
    this.props.onUpload(data);
  }
  render() {
    const frameArr = Array.from(this.props.frames);
    return (
      <div className="columnContainer">
        <div className="rowContainer">
          <div className="viewer">
            <Upload
              accepted={this.state.accepted}
              updateAcceptance={this.updateAcceptance}
            ></Upload>
            <Paper className="paper section">
              <div className="horizontal">
                <div
                  className="fontButton"
                  onClick={this.props.decrementFrameNumber}
                >
                  -
                </div>
                Number of frames:
                {this.props.frames.size}
                <div
                  className="fontButton"
                  onClick={this.props.incrementFrameNumber}
                >
                  +
                </div>
              </div>
              <div className="formElement">
                <TextField
                  id="filename"
                  onChange={this.handleTyping}
                  placeholder="Output Filename"
                />
              </div>
              <div className="formElement">
                <Select
                  label="Output Filetype"
                  value={this.props.animationInformation.filetype}
                  onChange={this.handleChange}
                >
                  <MenuItem value={0} primaryText="png" />
                  <MenuItem value={1} primaryText="jpg" />
                  <MenuItem value={2} primaryText="svg" />
                  <MenuItem value={3} primaryText="gif" />
                </Select>
              </div>
              <div className="formElement">
                <TextField
                  id="resize"
                  onChange={this.handleTyping}
                  placeholder="Resize"
                />
              </div>
              <div className="formElement">
                <TextField
                  id="outputsize"
                  onChange={this.handleTyping}
                  placeholder="Output Image Size"
                />
              </div>
              <div className="controls section">
                <Paper className="animator">
                  <div className="controls section configurator">
                    {frameArr.map(frame => {
                      return (
                        <FrameConfigurator
                          key={frame[1].get("key")}
                          frameNumber={frame[0]}
                          frameNumberChange={this.props.frameNumberChange}
                          valueChanged={this.props.valueChanged}
                          frame={frame[1]}
                        />
                      );
                    })}
                  </div>
                </Paper>
                <Button
                  onClick={this.uploadImage}
                  label="Start Process"
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </Paper>

            <div className="section">
              <Paper className="paper outputCard">
                Current Image
                {this.props.imgurl === "" ? (
                  <LinearProgress
                    variant="determinate"
                    value={this.props.progress}
                  />
                ) : (
                  <ResultCard
                    dispatchFrameCount={this.props.dispatchFrameCount}
                    imageID={this.props.resultImage.uploadID}
                    imgurl={this.props.imgurl}
                    loading={this.props.resultImage.loading}
                    progress={this.props.progress}
                    frameCount={this.props.frameCount}
                  />
                )}
              </Paper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
