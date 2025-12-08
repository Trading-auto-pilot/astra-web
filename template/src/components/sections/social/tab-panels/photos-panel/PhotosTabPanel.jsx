import Grid from '@mui/material/Grid';
import { profileData } from 'data/social';
import useLightbox from 'hooks/useLightbox';
import Lightbox from 'components/base/Lightbox';
import Media from '../common/Media';

const PhotosTabPanel = () => {
  const { openLightbox, ...lightboxProps } = useLightbox();

  const lightboxSlides = profileData.photos.map((img) => {
    return {
      src: img,
      type: 'image',
    };
  });

  return (
    <>
      <Grid container columns={12} spacing={1}>
        {profileData.photos.map((photo, index) => (
          <Grid key={photo} size={{ xs: 6, sm: 4, md: 3 }} sx={{ maxHeight: 184 }}>
            <Media item={{ src: photo, type: 'image' }} index={index} openLightbox={openLightbox} />
          </Grid>
        ))}
      </Grid>
      <Lightbox
        slides={lightboxSlides}
        extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
        {...lightboxProps}
      />
    </>
  );
};

export default PhotosTabPanel;
