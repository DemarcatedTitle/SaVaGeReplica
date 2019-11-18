import React from 'react';
import '../Animation.css';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ResultCard from './ResultCard';
import LinearProgress from '@material-ui/core/LinearProgress';
import Upload from './Upload';
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
    this.updateAcceptance = this.updateAcceptance.bind(this);
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
    const settings = {};
    Object.entries(this.props.text).forEach(function(field) {
      if (field[1]) {
        if (field[1].id !== 'outputfilename') {
          settings[field[1].id] = field[1].value;
        } else if (field[1].id === 'outputfilename') {
          data.append(field[1].id, field[1].value);
        }
      }
    });
    settings['mode'] = this.state.mode;
    data.append('settings', JSON.stringify(settings));
    // data.append('mode', this.state.mode);
    data.append('file', this.state.accepted[0]);
    data.append('filename', this.state.accepted[0].name);
    this.props.onUpload(data);
  }
  updateAcceptance(accepted) {
    this.setState({accepted});
  }
  render() {
    const actions = [
      <Button label="Cancel" color='primary' onClick={this.handleClose}>
        <span>
          Test
        </span>
      </Button>,
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
        <Upload accepted={this.state.accepted} updateAcceptance={this.updateAcceptance}></Upload>
        <div className="controls section">
          <Paper className="paper">
            <form onSubmit={this.handleSubmit}>
              <div className="formElement">
                <TextField
                  id="outputfilename"
                  onChange={this.handleTyping}
                  placeholder="Output Filename"
                />
              </div>
              <div className="formElement">
                <Select
                  label="Output Filetype"
                  value={2}
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
                  id="numofshapes"
                  onChange={this.handleTyping}
                  placeholder="Number of Shapes"
                />
              </div>
              <div className="formElement">
                <Select
                  value={this.state.mode}
                  onChange={(value, key) => {
                    this.handleChange('mode', key);
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
                  onChange={this.handleTyping}
                  placeholder="Rep"
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
              <div className="formElement">
                <TextField
                  id="alpha"
                  onChange={this.handleTyping}
                  placeholder="Alpha"
                />
              </div>
              <div className="formElement">
                #<TextField
                  id="backgroundcolor"
                  onChange={this.handleTyping}
                  placeholder="Background Color"
                />
              </div>
              <Button
                onClick={this.uploadImage}
                label="Start Process"
                color='primary'
              >
                <span>
                  Test
                </span>
              </Button>
            </form>
          </Paper>
        </div>
        <div className="section">
          <Paper className="paper outputCard">
            Current Image
            {this.props.imgurl === '' ? (
              <LinearProgress variant="determinate" value={this.props.progress} />
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
