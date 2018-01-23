import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
export default class SavageGallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gallery: [],
      open: false,
      tile: { name: '', image_location: '' },
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
    const customContentStyle = {
      maxWidth: 'none',
      maxHeight: 'none',
      width: 'fit-content',
    };
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
          {this.props.images.map(tile => (
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
          ))}
        </GridList>
      </div>
    );
  }
}
