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
    // return fetch('/api/image/all', {
    //   method: 'GET',
    //   credentials: 'same-origin',
    // })
    //   .then(response => {
    //     if (response.status === 200) {
    //       response.json().then(data => {
    //         return this.setState({ gallery: data });
    //         // const imgurl = URL.createObjectURL(data);
    //       });
    //     } else {
    //       console.log(response);
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }

  render() {
    console.log(this.props.images);
    const tilesData = [{ img: test, title: 'Test!', author: 'me!' }];
    const image1 = this.state.gallery[0] ? this.state.gallery[0].image_id : '';
    const test = `${window.location.host}/api/images/uploaded/${image1}`;
    console.log(test);
    return (
      <div className="SavageGallery">
        Savage Gallery!
        {image1}
        <GridList cols={3} cellHeight={360}>
          <Subheader>December</Subheader>
          {this.props.images.map(tile => (
            <GridTile key={tile}>
              <img src={tile} />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}
