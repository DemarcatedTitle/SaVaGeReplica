import { connect } from 'react-redux';
import { fetchAllImages } from '../actions/gallery';
import SavageGallery from '../components/SavageGallery';

const mapStateToProps = state => {
  const currentState = state.allImages.slice(-1)[0];
  const images = currentState.imageLocations.concat(['animation']);
  return { images: images };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchAllImages: () => {
      dispatch(fetchAllImages());
    },
  };
};

const GalleryContainer = connect(mapStateToProps, mapDispatchToProps)(
  SavageGallery
);
export default GalleryContainer;
