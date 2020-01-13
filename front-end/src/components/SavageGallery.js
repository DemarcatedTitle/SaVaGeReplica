import React from "react";
import "../Animation.css";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import ResultCard from "./ResultCard";

export default class SavageGallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gallery: [],
      open: false,
      tile: { name: "", image_location: "" },
      width: 360,
      images: [],
      pageNumber: 0
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
    console.log("Deleting image...");
  };
  componentDidMount() {
    this.props.fetchAllImages();
  }

  render() {
    const actions = [
      <Button color="primary" onClick={this.handleClose}>
        Cancel
      </Button>
    ];
    // const customContentStyle = {
    //   maxWidth: 'none',
    //   maxHeight: 'none',
    //   width: 'fit-content',
    // };
    let { images } = this.props;
    const page = images.slice(this.state.pageNumber, this.state.pageNumber + 9);
    const width = this.state.width;
    const backdropstyle = {
      width: width + "px"
    };
    // const animationboxstyle = {
    //   width: 3 * width + "px"
    // };
    // images.push('animation');
    return (
      <div className="SavageGallery">
        <Button
          onClick={() =>
            this.setState({ pageNumber: this.state.pageNumber - 9 })
          }
        >
          Previous
        </Button>
        <Button
          onClick={() =>
            this.setState({ pageNumber: this.state.pageNumber + 9 })
          }
        >
          Next
        </Button>

        <Dialog
          className="gallerydialog"
          title="Image"
          actions={actions}
          modal={false}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className="columnContainer">
            <img
              className="dialogimage"
              src={this.state.tile.image_location}
              alt={this.state.tile.name}
            />
            <Button
              onClick={() => {
                this.deleteImage(this.state.tile.id);
              }}
            >
              Delete
            </Button>
          </div>
        </Dialog>
        <GridList cols={3} cellHeight={280}>
          {page.map(tile => {
            if (tile.image_location) {
              return (
                <GridListTile
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
                </GridListTile>
              );
            } else {
              return (
                <GridListTile
                  key="lsjflsejflsejflskejlbkjblkejbseklj"
                  title="Animation"
                  onClick={() => {
                    this.handleOpen(tile);
                  }}
                >
                  <div className="backdrop" style={backdropstyle} />
                </GridListTile>
              );
            }
          })}
        </GridList>
      </div>
    );
  }
}
