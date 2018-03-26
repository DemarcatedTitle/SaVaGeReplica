import { connect } from 'react-redux';
import { fetchAllImages } from '../actions/gallery';
import { deleteImage } from '../actions/deleteImage';
import SavageGallery from '../components/SavageGallery';

const mapStateToProps = state => {
  const currentState = state.allImages.slice(-1)[0];
  const images = currentState.imageLocations;
  return { images: images };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchAllImages: () => {
      dispatch(fetchAllImages());
    },
    deleteImage: imageID => {
      dispatch(deleteImage(imageID));
    },
  };
};

const GalleryContainer = connect(mapStateToProps, mapDispatchToProps)(
  SavageGallery
);
export default GalleryContainer;
