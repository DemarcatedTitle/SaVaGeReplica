import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import test from './bin/bez.svg';
import Subheader from 'material-ui/Subheader';
export default class SavageGallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { gallery: [] };
  }
  componentDidMount() {
    this.props.fetchAllImages();
  }

  render() {
    return (
      <div className="SavageGallery">
        <GridList cols={3} cellHeight={360}>
          {this.props.images.map(tile => (
            <GridTile key={tile.id} title={tile.name}>
              <img src={tile.image_location} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}
