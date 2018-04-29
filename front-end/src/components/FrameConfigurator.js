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
const uuid = require('uuid/v4');
// import image from '../sprite.css-4272fb9d.svg';
export default class FrameConfigurator extends React.Component {
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
  handleTyping(event, target) {
    this.props.valueChanged({
      frameNumber: this.props.frameNumber,
      target: target,
      value: event.target.value,
    });
  }
  handleChange(value, target) {
    this.props.valueChanged({
      frameNumber: this.props.frameNumber,
      target: target,
      value: value,
    });
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
    const width = this.state.width;
    const backdropstyle = {
      width: width + 'px',
    };
    const animationboxstyle = {
      width: 3 * width + 'px',
    };

    return (
      <div className="configurator">
        <form onSubmit={this.handleSubmit}>
          <div className="closeX">X</div>
          Frame {this.props.frameNumber + 1}
          <div className="formElement">
            <TextField
              onChange={event => this.handleTyping(event, 'numberOfShapes')}
              hintText="Number of Shapes"
            />
          </div>
          <div className="formElement">
            <SelectField
              value={this.props.frame.get('mode')}
              onChange={(event, key, payload) => {
                this.handleChange(payload, 'mode');
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
              onChange={event => this.handleTyping(event, 'rep')}
              hintText="Rep"
            />
            <Dialog
              title="Rep"
              actions={actions}
              modal={false}
              open={this.state.repDialog}
              onRequestClose={this.handleClose}
            >
              Add N extra shapes each iteration with reduced search (mostly good
              for beziers)
            </Dialog>
            <div className="tooltip" onClick={this.handleOpen}>
              <div>?</div>
            </div>
          </div>
          <div className="formElement">
            <TextField
              id="nth"
              onChange={event => this.handleTyping(event, 'nth')}
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
              id="alpha"
              onChange={event => this.handleTyping(event, 'alpha')}
              hintText="Alpha"
            />
          </div>
          <div className="formElement">
            #<TextField
              id="backgroundcolor"
              onChange={event => this.handleTyping(event, 'backgroundcolor')}
              hintText="Background Color"
            />
          </div>
        </form>
      </div>
    );
  }
}
