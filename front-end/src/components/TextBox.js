import React from 'react';
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import ResultCard from './ResultCard';
import LinearProgress from 'material-ui/LinearProgress';

/* eslint-disable no-console */
export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.checkProgress = this.checkProgress.bind(this);
    this.state = {
      value: 0,
      accepted: [],
      rejected: [],
    };
  }
  handleTyping(event) {
    this.props.onTextTyped({ id: event.target.id, value: event.target.value });
  }
  handleChange(event) {
    let newObj = {};
    newObj[event.target.id] = event.target.value;
    this.setState(newObj);
  }
  handleSubmit(event) {
    event.preventDefault();
    //Toggle loading here
    this.props.onSubmit(!this.props.loading);
  }
  checkProgress() {
    var data = new FormData();
    data.append('uploadID', this.props.resultImage.uploadID);
    this.props.fetchProgress(data);
  }
  uploadImage() {
    var data = new FormData();
    Object.entries(this.props.text).forEach(function(field) {
      if (field[1]) {
        data.append(field[1].id, field[1].value);
      }
    });
    data.append('file', this.state.accepted[0]);
    data.append('filename', this.state.accepted[0].name);
    this.props.onUpload(data);
  }
  render() {
    return (
      <div className="mainContainer">
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
              <div>
                <TextField
                  id="outputfilename"
                  onChange={this.handleTyping}
                  hintText="Output Filename"
                />
                <DropDownMenu
                  value={this.state.value}
                  onChange={this.handleChange}
                >
                  <MenuItem value={0} primaryText="png" />
                  <MenuItem value={1} primaryText="jpg" />
                  <MenuItem value={2} primaryText="svg" />
                  <MenuItem value={3} primaryText="gif" />
                </DropDownMenu>
              </div>
              <div>
                <TextField
                  id="numofshapes"
                  onChange={this.handleTyping}
                  hintText="Number of Shapes"
                />
              </div>
              <div>
                <SelectField
                  value={this.state.value}
                  onChange={this.handleChange}
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
              <div>
                <TextField
                  id="rep"
                  onChange={this.handleTyping}
                  hintText="Rep"
                />
              </div>
              <div>
                <TextField
                  id="nth"
                  onChange={this.handleTyping}
                  hintText="Nth"
                />
              </div>
              <div>
                <TextField
                  id="resize"
                  onChange={this.handleTyping}
                  hintText="Resize"
                />
              </div>
              <div>
                <TextField
                  id="outputsize"
                  onChange={this.handleTyping}
                  hintText="Output Image Size"
                />
              </div>
              <div>
                <TextField
                  id="alpha"
                  onChange={this.handleTyping}
                  hintText="Alpha"
                />
              </div>
              <div>
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
              <RaisedButton
                onClick={this.checkProgress}
                label="Check progress"
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
