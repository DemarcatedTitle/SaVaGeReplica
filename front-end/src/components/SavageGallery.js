import React from 'react';
import '../Animation.css';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ResultCard from './ResultCard';

export default class SavageGallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gallery: [],
      open: false,
      tile: { name: '', image_location: '' },
      width: 360,
      images: [],
    };
  }
  handleOpen = tile => {
    this.setState({ open: true, tile: tile });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteImage = imageID => {
    this.setState({ open: false });
    this.props.deleteImage(imageID);
    console.log('Deleting image...');
  };
  componentDidMount() {
    this.props.fetchAllImages();
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
    ];
    // const customContentStyle = {
    //   maxWidth: 'none',
    //   maxHeight: 'none',
    //   width: 'fit-content',
    // };
    let { images } = this.props;
    const width = this.state.width;
    const backdropstyle = {
      width: width + 'px',
    };
    const animationboxstyle = {
      width: 3 * width + 'px',
    };
    // images.push('animation');
    return (
      <div className="SavageGallery">
        <FlatButton label="Dialog" onClick={this.handleOpen} />
        <Dialog
          className="gallerydialog"
          title="Image"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="columnContainer">
            <img
              className="dialogimage"
              src={this.state.tile.image_location}
              alt={this.state.tile.name}
            />
            <RaisedButton
              label="Delete"
              onClick={() => {
                this.deleteImage(this.state.tile.id);
              }}
            />
          </div>
        </Dialog>
        <GridList cols={3} cellHeight={480}>
          {images.map(tile => {
            if (tile.image_location) {
              return (
                <GridTile
                  key={tile.id}
                  title={tile.name}
                  onClick={() => {
                    this.handleOpen(tile);
                  }}
                >
                  <ResultCard
                    dispatchFrameCount={this.props.dispatchFrameCount}
                    imageID={tile.id}
                    imgurl={tile.image_location}
                    frameCount={this.props.frameCount}
                  />
                </GridTile>
              );
            } else {
              return (
                <GridTile
                  key="lsjflsejflsejflskejlbkjblkejbseklj"
                  title="Animation"
                  onClick={() => {
                    this.handleOpen(tile);
                  }}
                >
                  <div className="backdrop" style={backdropstyle}>
                  </div>
                </GridTile>
              );
            }
          })}
        </GridList>
      </div>
    );
  }
}
