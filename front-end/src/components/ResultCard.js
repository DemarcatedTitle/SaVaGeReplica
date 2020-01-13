import React from 'react';
import Button from '@material-ui/core/Button';
// import { frameCount } from '../actions/frameCount';
export default class ResultCard extends React.PureComponent {
  componentDidMount() {
    if (this.props.imgurl && this.props.dispatchFrameCount) {
      const animationEmbed = document.getElementById(this.props.imgurl);
      const dispatchFrameCount = this.props.dispatchFrameCount;
      const imageID = this.props.imageID;
      animationEmbed.addEventListener('load', function() {
        const svg = animationEmbed.getSVGDocument ? animationEmbed.getSVGDocument() : null;
        if (svg) {
          const rect = svg.getElementsByTagName('rect')[0];
          if (!!rect) {
            dispatchFrameCount({ imageID, frameCount: 1 });
          } else {
            const frameCount = svg.children[0].childElementCount;
            dispatchFrameCount({ imageID, frameCount });
          }
        }
      });
    }
  }

  render() {
    const width = 300;
    const backdropstyle = {
      width: width + 'px',
    };
    const animationboxstyle = {
      width: width + 'px',
    };

    if (this.props.frameCount && this.props.dispatchFrameCount) {
      const frameCount = this.props.frameCount[this.props.imageID];
      if (frameCount > 1) {
        animationboxstyle.width = frameCount * width + 'px';
        animationboxstyle.animation = `slide 5s steps(${frameCount}) infinite`;
      } else if (frameCount === 1) {
        console.log(this.props);
        return (
          <div className="outputCard">
            <div className="backdrop" style={backdropstyle}>
              {this.props.imgurl ? (
                <img
                  id={this.props.imgurl}
                  style={animationboxstyle}
                  className="static"
                  type="image/svg+xml"
                  src={this.props.imgurl}
                />
              ) : null}
            </div>
            <a download="yourpicture.svg" href={this.props.imgurl}>
              <Button color="primary">
                Download Image
              </Button>
            </a>
          </div>
        );
      }
    }
    if (this.props.imgurl !== '' && typeof this.props.imgurl === 'string') {
      return (
        <div className="outputCard">
          <div className="backdrop" style={backdropstyle}>
            {this.props.imgurl ? (
              <embed
                id={this.props.imgurl}
                style={animationboxstyle}
                className="picturebox"
                type="image/svg+xml"
                src={this.props.imgurl}
              />
            ) : null}
          </div>
          <a download="yourpicture.svg" href={this.props.imgurl}>
            <Button color="primary">Download Image</Button>
          </a>
        </div>
      );
    } else {
      return '';
    }
  }
}
