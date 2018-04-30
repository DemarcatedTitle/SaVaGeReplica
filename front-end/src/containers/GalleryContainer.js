import { connect } from 'react-redux';
import { fetchAllImages } from '../actions/gallery';
import { deleteImage } from '../actions/deleteImage';
import { setFrameCount } from '../actions/frameCount';
import SavageGallery from '../components/SavageGallery';

const mapStateToProps = state => {
  const currentState = state.allImages.slice(-1)[0];
  const images = currentState.imageLocations;
  const frameCount = state.frameCount.slice(-1)[0];
  return { images, frameCount };
};
const mapDispatchToProps = dispatch => {
  return {
    fetchAllImages: () => {
      dispatch(fetchAllImages());
    },
    deleteImage: imageID => {
      dispatch(deleteImage(imageID));
    },
    dispatchFrameCount: payload => {
      dispatch(setFrameCount(payload));
    },
  };
};

const GalleryContainer = connect(mapStateToProps, mapDispatchToProps)(
  SavageGallery
);
export default GalleryContainer;
