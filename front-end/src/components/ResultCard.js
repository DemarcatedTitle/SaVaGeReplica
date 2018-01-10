import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
export default class ResultCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }
  save() {
    // var blob = new Blob(['Hello world'], { type: 'text/plain;charset=utf-8' });
    // const blob = this.props.imgurl;
  }
  render() {
    console.log(this.props.imgurl);
    if (this.props.imgurl !== '' && typeof this.props.imgurl === 'string') {
      return (
        <div className="outputCard">
          <img
            className="yourUpload"
            alt="Your upload"
            src={this.props.imgurl}
          />
          <a download="yourpicture.svg" href={this.props.imgurl}>
            <RaisedButton label="Download Image" primary={true} />
          </a>
        </div>
      );
    } else {
      return '';
    }
  }
}
