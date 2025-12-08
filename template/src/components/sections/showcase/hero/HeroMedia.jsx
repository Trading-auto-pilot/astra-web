import { Box } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import Image from 'components/base/Image';
import Video from 'components/base/Video';

const HeroMedia = ({ ref }) => {
  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        width: 1,
        height: { xs: '40vh', sm: '50vh', md: '60vh', xl: '70vh' },
      }}
    >
      <Video
        src={showcaseAssets.hero.video}
        type="video/webm"
        sx={{ width: 1, height: 1, objectFit: 'cover', position: 'absolute' }}
        autoPlay
        loop
        muted
        playsInline
      />
      <Image
        src={showcaseAssets.hero.planet}
        sx={{
          width: { xs: '150%', sm: '120%', md: 1 },
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: -1,
        }}
      />
    </Box>
  );
};

export default HeroMedia;
