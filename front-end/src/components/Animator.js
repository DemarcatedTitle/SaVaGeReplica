import React from 'react';
import '../Animation.css';
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
// import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ResultCard from './ResultCard';
import LinearProgress from 'material-ui/LinearProgress';
import FrameConfigurator from './FrameConfigurator';
// import image from '../sprite.css-4272fb9d.svg';
// const image = require('../sprite.css-4272fb9d.svg');

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
    console.log(`this.props.imgurl is ${this.props.imgurl}`);
    const frameArr = Array.from(this.props.frames);
    return (
      <div className="columnContainer">
        <div className="rowContainer">
          <div className="viewer">
            <Paper className="upload paper section">
              <p>Uploaded Image</p>
              <Dropzone
                style={{}}
                accept="image/png, image/jpg, image/jpeg"
                onDrop={(accepted, rejected) => {
                  this.setState({ accepted, rejected });
                }}
              >
                <div>
                  {this.state.accepted[0] ? (
                    <img
                      alt="Your upload"
                      src={this.state.accepted[0].preview}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </Dropzone>
            </Paper>
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
                  hintText="Output Filename"
                />
              </div>
              <div className="formElement">
                <SelectField
                  floatingLabelText="Output Filetype"
                  value={this.props.animationInformation.filetype}
                  onChange={this.handleChange}
                >
                  <MenuItem value={0} primaryText="png" />
                  <MenuItem value={1} primaryText="jpg" />
                  <MenuItem value={2} primaryText="svg" />
                  <MenuItem value={3} primaryText="gif" />
                </SelectField>
              </div>
              <div className="formElement">
                <TextField
                  id="resize"
                  onChange={this.handleTyping}
                  hintText="Resize"
                />
              </div>
              <div className="formElement">
                <TextField
                  id="outputsize"
                  onChange={this.handleTyping}
                  hintText="Output Image Size"
                />
              </div>
            </Paper>

            <div className="section">
              <Paper className="paper outputCard">
                Current Image
                {this.props.imgurl === '' ? (
                  <LinearProgress
                    mode="determinate"
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
                <RaisedButton
                  onClick={this.uploadImage}
                  label="Start Process"
                  primary={true}
                />
              </Paper>
            </div>
          </div>
        </div>
        <div className="controls section">
          <Paper className="animator">
            <div className="controls section configurator">
              {frameArr.map(frame => {
                return (
                  <FrameConfigurator
                    key={frame[1].get('key')}
                    frameNumber={frame[0]}
                    frameNumberChange={this.props.frameNumberChange}
                    valueChanged={this.props.valueChanged}
                  />
                );
              })}
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}
// <form className="animator" onSubmit={this.handleSubmit}>
// </form>
