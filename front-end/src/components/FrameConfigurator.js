import React from 'react';
import '../Animation.css';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
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
      <Button label="Cancel" color='primary' onClick={this.handleClose} />,
    ];
    // const width = this.state.width;
    // const backdropstyle = {
    //   width: width + 'px',
    // };
    // const animationboxstyle = {
    //   width: 3 * width + 'px',
    // };

    return (
      <div className="configurator">
        <form onSubmit={this.handleSubmit}>
          <div className="closeX">X</div>
          Frame {this.props.frameNumber + 1}
          <div className="formElement">
            <TextField
              onChange={event => this.handleTyping(event, 'numberOfShapes')}
              placeholder="Number of Shapes"
            />
          </div>
          <div className="formElement">
            <Select
              value={this.props.frame.get('mode')}
              onChange={(event, key, payload) => {
                this.handleChange(payload, 'mode');
              }}
              label="Mode"
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
            </Select>
          </div>
          <div className="formElement">
            <TextField
              id="rep"
              onChange={event => this.handleTyping(event, 'rep')}
              placeholder="Rep"
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
              placeholder="Nth"
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
              placeholder="Alpha"
            />
          </div>
          <div className="formElement">
            #<TextField
              id="backgroundcolor"
              onChange={event => this.handleTyping(event, 'backgroundcolor')}
              placeholder="Background Color"
            />
          </div>
        </form>
      </div>
    );
  }
}
