import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { frameCount } from '../actions/frameCount';
export default class ResultCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }
  componentDidMount() {
    if (this.props.imgurl && this.props.dispatchFrameCount) {
      console.log(this.props.imgurl);
      const animationEmbed = document.getElementById(this.props.imgurl);
      const dispatchFrameCount = this.props.dispatchFrameCount;
      const imageID = this.props.imageID;
      animationEmbed.addEventListener('load', function() {
        const svg = animationEmbed.getSVGDocument();
        const frameCount = svg.children[0].childElementCount;
        dispatchFrameCount({imageID, frameCount});
      });
    }
  }

  save() {
    // var blob = new Blob(['Hello world'], { type: 'text/plain;charset=utf-8' });
    // const blob = this.props.imgurl;
  }
  render() {
    const width = 300;
    const backdropstyle = {
      width: width + 'px',
    };
    const animationboxstyle = {
      width: width + 'px',
    };
    console.log(this.props.frameCount);
    if (this.props.frameCount && this.props.dispatchFrameCount) {
      const frameCount = this.props.frameCount[this.props.imageID];
      console.log(frameCount);
      animationboxstyle.width =  frameCount * width + 'px';
      animationboxstyle.animation = `slide 5s steps(${frameCount}) infinite`;
    }
    console.log(animationboxstyle);
    const classes = this.props.dispatchFrameCount ? '' : 'animationbox';
    if (this.props.imgurl !== '' && typeof this.props.imgurl === 'string') {
      return (
        <div className="outputCard">
          <div className="backdrop" style={backdropstyle}>
            {this.props.imgurl ? <embed id={this.props.imgurl} style={animationboxstyle} className={classes} type="image/svg+xml" src={this.props.imgurl} /> : null }
          </div>
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
