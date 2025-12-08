import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useLightbox from 'hooks/useLightbox';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useFileManager } from 'providers/FileManagerProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Lightbox from 'components/base/Lightbox';
import FileItem from './FileItem';

const RecentFiles = () => {
  const { recentFiles } = useFileManager();
  const { openLightbox, ...lightboxProps } = useLightbox();
  const [expanded, setExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const { currentBreakpoint } = useBreakpoints();
  const [itemWidth, setItemWidth] = useState(210);

  const gap = 16;
  const itemsPerRow = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));

  const minInitialItems = itemsPerRow;
  const firstRowItems = recentFiles.slice(0, minInitialItems);
  const remainingItems = recentFiles.slice(minInitialItems);

  const showToggle = remainingItems.length > 0;

  const lightboxSlides = recentFiles
    .map(({ name, extension, src }) => {
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
  recentFiles
    .filter(({ extension }) => ['png', 'jpg', 'jpeg', 'mp4'].includes(extension))
    .forEach((file, index) => {
      fileIdToMediaIndex.set(file.id, index);
    });

  const toggleExpand = () => setExpanded(!expanded);

  useEffect(() => {
    switch (currentBreakpoint) {
      case 'xs':
        setItemWidth(210);
        break;
      case 'sm':
        setItemWidth(224);
        break;
      case 'md':
        setItemWidth(195);
        break;
      case 'lg':
        setItemWidth(242);
        break;
      case 'xl':
        setItemWidth(232);
        break;
      default:
        break;
    }
  }, [currentBreakpoint]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 0;
      setContainerWidth(width);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [currentBreakpoint]);

  return (
    <>
      <Paper ref={containerRef} sx={{ p: { xs: 3, md: 5 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1, p: '0 !important' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Recent Files</Typography>
            {showToggle && (
              <Button
                variant="soft"
                color="neutral"
                endIcon={
                  <IconifyIcon
                    icon={`material-symbols:keyboard-arrow-${expanded ? 'up' : 'down'}`}
                  />
                }
                onClick={toggleExpand}
              >
                {expanded ? 'Show less' : `Show more`}
              </Button>
            )}
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
              gap: 2,
            }}
          >
            {firstRowItems.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                mediaIndex={fileIdToMediaIndex.get(file.id)}
                openLightbox={openLightbox}
              />
            ))}
          </Box>

          {showToggle && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
                  gap: 2,
                  mt: 2,
                }}
              >
                {remainingItems.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    mediaIndex={fileIdToMediaIndex.get(file.id)}
                    openLightbox={openLightbox}
                  />
                ))}
              </Box>
            </Collapse>
          )}
        </Container>
      </Paper>

      <Lightbox
        slides={lightboxSlides}
        extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
        {...lightboxProps}
      />
    </>
  );
};

export default RecentFiles;
