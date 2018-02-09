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
      accepted: [],
      rejected: [],
    };
  }
  handleClose() {
    this.setState({ repDialog: false });
  }
  handleOpen() {
    this.setState({ repDialog: true });
  }
  handleTyping(event) {
    this.props.frameNumberChange({
      id: event.target.id,
      value: event.target.value,
    });
  }
  increment() {
    this.props.frameNumberChange({
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
    Object.entries(this.props.text).forEach(function(field) {
      if (field[1]) {
        data.append(field[1].id, field[1].value);
      }
    });
    data.append('mode', this.state.mode);
    data.append('file', this.state.accepted[0]);
    data.append('filename', this.state.accepted[0].name);
    this.props.onUpload(data);
  }
  render() {
    // const actions = [
    //   <RaisedButton label="Cancel" primary={true} onClick={this.handleClose} />,
    // ];
    // const width = this.state.width;
    // const backdropstyle = {
    //   width: width + 'px',
    // };
    // const animationboxstyle = {
    //   width: 3 * width + 'px',
    // };

    console.log(Array.from(this.props.frames));
    const frameArr = Array.from(this.props.frames);
    return (
      <div className="mainContainer">
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
                  <img alt="Your upload" src={this.state.accepted[0].preview} />
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
              <TextField
                id="numFrames"
                disabled={true}
                value={this.props.frames.size}
                floatingLabelText="Number of Frames"
              />
              <div
                className="fontButton"
                onClick={this.props.incrementFrameNumber}
              >
                +
              </div>
            </div>
            <div className="formElement">
              <TextField
                id="outputfilename"
                onChange={this.handleTyping}
                hintText="Output Filename"
              />
            </div>
            <div className="formElement">
              <SelectField
                floatingLabelText="Output Filetype"
                value={2}
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
                  imgurl={this.props.imgurl}
                  loading={this.props.resultImage.loading}
                  progress={this.props.progress}
                />
              )}
            </Paper>
          </div>
        </div>
        <div className="controls section">
          <Paper className="paper animator">
            <FrameConfigurator
              frameNumberChange={this.props.frameNumberChange}
            />
            <RaisedButton
              onClick={this.uploadImage}
              label="Start Process"
              primary={true}
            />
          </Paper>
          <div className="controls section">
            {frameArr.map((frame, index) => {
              return (
                <div>
                  Number of shapes:
                  <div key={index + frame[0]}>
                    {frame[1].get('numberOfShapes')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
// <form className="animator" onSubmit={this.handleSubmit}>
// </form>
