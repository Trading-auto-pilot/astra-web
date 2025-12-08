import Box from '@mui/material/Box';
import useLightbox from 'hooks/useLightbox';
import Lightbox from 'components/base/Lightbox';
import FileGridItem from './FileGridItem';

const GridView = ({ allFiles }) => {
  const { openLightbox, ...lightboxProps } = useLightbox();

  const lightboxSlides = allFiles
    .map(({ extension, src, name }) => {
      switch (extension) {
        case 'png':
        case 'jpg':
        case 'jpeg':
          return { src, type: 'image', title: `${name + '.' + extension}` };
        case 'mp4':
          return {
            src,
            type: 'video',
            title: `${name + '.' + extension}`,
            sources: [{ src, type: 'video/mp4' }],
          };
        default:
          return null;
      }
    })
    .filter(Boolean);

  const fileIdToMediaIndex = new Map();
  allFiles
    .filter(({ extension }) => ['png', 'jpg', 'jpeg', 'mp4'].includes(extension))
    .forEach((file, index) => {
      fileIdToMediaIndex.set(file.id, index);
    });

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(175px, 1fr))',
            sm: 'repeat(auto-fill, minmax(205px, 1fr))',
            md: 'repeat(auto-fill, minmax(185px, 1fr))',
            xl: 'repeat(auto-fill, minmax(205px, 1fr))',
          },
          gap: 2,
        }}
      >
        {allFiles.map((file) => (
          <FileGridItem
            key={file.id}
            file={file}
            mediaIndex={fileIdToMediaIndex.get(file.id)}
            openLightbox={openLightbox}
          />
        ))}
      </Box>
      <Lightbox
        slides={lightboxSlides}
        extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
        {...lightboxProps}
      />
    </>
  );
};

export default GridView;
