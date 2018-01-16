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
    const tilesData = [{ img: test, title: 'Test!', author: 'me!' }];
    const image1 = this.state.gallery[0] ? this.state.gallery[0].image_id : '';
    const test = `${window.location.host}/api/images/uploaded/${image1}`;
    return (
      <div className="SavageGallery">
        Savage Gallery!
        {image1}
        <GridList cols={3} cellHeight={360}>
          <Subheader>December</Subheader>
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
