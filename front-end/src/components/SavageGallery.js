import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const image = require('../sprite.css-4272fb9d.svg');
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
    console.log(tile);
    this.setState({ open: true, tile: tile });
  };
  handleClose = () => {
    this.setState({ open: false });
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
    console.log(images);
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
          <img
            className="dialogimage"
            src={this.state.tile.image_location}
            alt={this.state.tile.name}
          />
        </Dialog>
        <GridList cols={3} cellHeight={360}>
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
                  <img
                    className={tile.name}
                    src={tile.image_location}
                    alt={tile.name}
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
                    <embed
                      style={animationboxstyle}
                      className="animationbox"
                      type="image/svg+xml"
                      src={image}
                    />
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
