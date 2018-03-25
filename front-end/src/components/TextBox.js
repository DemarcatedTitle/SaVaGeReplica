import React from 'react';
import '../Animation.css';
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ResultCard from './ResultCard';
import LinearProgress from 'material-ui/LinearProgress';
// import image from '../sprite.css-4272fb9d.svg';
// const image = require('../sprite.css-4272fb9d.svg');

/* eslint-disable no-console */
export default class TextBox extends React.Component {
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
    this.props.onTextTyped({ id: event.target.id, value: event.target.value });
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
    const actions = [
      <RaisedButton label="Cancel" primary={true} onClick={this.handleClose} />,
    ];
    // const width = this.state.width;
    // const backdropstyle = {
    //   width: width + 'px',
    // };
    // const animationboxstyle = {
    //   width: 3 * width + 'px',
    // };

    return (
      <div className="rowContainer">
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
        <div className="controls section">
          <Paper className="paper">
            <form onSubmit={this.handleSubmit}>
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
                  id="numofshapes"
                  onChange={this.handleTyping}
                  hintText="Number of Shapes"
                />
              </div>
              <div className="formElement">
                <SelectField
                  value={this.state.mode}
                  onChange={(value, key) => {
                    this.handleChange('mode', key);
                  }}
                  floatingLabelText="Mode"
                >
                  <MenuItem value={0} primaryText="Combo" />
                  <MenuItem value={1} primaryText="Triangle" />
                  <MenuItem value={2} primaryText="Rectangle" />
                  <MenuItem value={3} primaryText="Ellipse" />
                  <MenuItem value={4} primaryText="Circle" />
                  <MenuItem value={5} primaryText="Rotated Rectangle" />
                  <MenuItem value={6} primaryText="Beziers" />
                  <MenuItem value={7} primaryText="Rotated Ellipse" />
                  <MenuItem value={8} primaryText="Polygon" />
                </SelectField>
              </div>
              <div className="formElement">
                <TextField
                  id="rep"
                  onChange={this.handleTyping}
                  hintText="Rep"
                />
                <Dialog
                  title="Rep"
                  actions={actions}
                  modal={false}
                  open={this.state.repDialog}
                  onRequestClose={this.handleClose}
                >
                  Add N extra shapes each iteration with reduced search (mostly
                  good for beziers)
                </Dialog>
                <div className="tooltip" onClick={this.handleOpen}>
                  <div>?</div>
                </div>
              </div>
              <div className="formElement">
                <TextField
                  id="nth"
                  onChange={this.handleTyping}
                  hintText="Nth"
                />
                <Dialog
                  title="Test"
                  actions={actions}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                >
                  This is a test
                </Dialog>
                <div className="tooltip" onClick={this.handleOpen}>
                  <div>?</div>
                </div>
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
              <div className="formElement">
                <TextField
                  id="alpha"
                  onChange={this.handleTyping}
                  hintText="Alpha"
                />
              </div>
              <div className="formElement">
                #<TextField
                  id="backgroundcolor"
                  onChange={this.handleTyping}
                  hintText="Background Color"
                />
              </div>
              <RaisedButton
                onClick={this.uploadImage}
                label="Start Process"
                primary={true}
              />
            </form>
          </Paper>
        </div>
        <div className="section">
          <Paper className="paper outputCard">
            Current Image
            {this.props.imgurl === '' ? (
              <LinearProgress mode="determinate" value={this.props.progress} />
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
    );
  }
}
