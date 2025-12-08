import ReactLightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import IconifyIcon from './IconifyIcon';

const pluginsMap = {
  caption: Captions,
  fullscreen: Fullscreen,
  slideshow: Slideshow,
  thumbnails: Thumbnails,
  video: Video,
  zoom: Zoom,
};

const Lightbox = ({ extension, ...rest }) => {
  const plugins = extension?.map((ext) => pluginsMap[ext]);

  return (
    <ReactLightbox
      {...rest}
      controller={{ closeOnBackdropClick: true }}
      plugins={plugins}
      zoom={{
        maxZoomPixelRatio: 3,
      }}
      render={{
        iconClose: () => (
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 24, color: 'common.white' }} />
        ),
        iconZoomIn: () => (
          <IconifyIcon
            icon="material-symbols:zoom-in"
            sx={{ fontSize: 24, color: 'common.white' }}
          />
        ),
        iconZoomOut: () => (
          <IconifyIcon
            icon="material-symbols:zoom-out"
            sx={{ fontSize: 24, color: 'common.white' }}
          />
        ),
        iconEnterFullscreen: () => (
          <IconifyIcon
            icon="material-symbols:open-in-full-rounded"
            sx={{ fontSize: 24, color: 'common.white' }}
          />
        ),
        iconExitFullscreen: () => (
          <IconifyIcon
            icon="material-symbols:close-fullscreen-rounded"
            sx={{ fontSize: 24, color: 'common.white' }}
          />
        ),
        iconNext: () => (
          <IconifyIcon icon="material-symbols:keyboard-arrow-right" sx={{ fontSize: 20 }} />
        ),
        iconPrev: () => (
          <IconifyIcon icon="material-symbols:keyboard-arrow-left" sx={{ fontSize: 20 }} />
        ),
      }}
    />
  );
};

export default Lightbox;
