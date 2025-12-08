import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import { profileData } from 'data/social';
import Image from 'components/base/Image';

const CoverBanner = () => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 1148, height: 257, px: { xs: 0, sm: 3 } }}>
      <Box sx={{ width: 1, height: 1, borderRadius: { sm: 6 }, overflow: 'hidden' }}>
        <Image
          src={profileData.bannerImage}
          alt="cover-banner"
          sx={{ width: 1, height: 1, objectFit: 'cover' }}
        />
      </Box>
    </Container>
  );
};

export default CoverBanner;
