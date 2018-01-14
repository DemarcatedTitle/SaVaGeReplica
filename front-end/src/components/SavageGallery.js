import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import test from './bin/bez.svg';
import Subheader from 'material-ui/Subheader';
export default class SavageGallery extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const tilesData = [{ img: test, title: 'Test!', author: 'me!' }];
    return (
      <div className="SavageGallery">
        Savage Gallery!
        <GridList cellHeight={180}>
          <Subheader>December</Subheader>
          {tilesData.map(tile => (
            <GridTile
              key={tile.img}
              title={tile.title}
              subtitle={<span>Test</span>}
            >
              <img src={tile.img} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}
