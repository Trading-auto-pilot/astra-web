import Container from '@mui/material/Container';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import SocialTabs from 'components/sections/social/SocialTabs';
import CoverBanner from 'components/sections/social/profile-section/CoverBanner';
import ProfileInfo from 'components/sections/social/profile-section/ProfileInfo';

const Social = () => {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: 'Pages', url: '#!' },
          { label: 'Social', active: true },
        ]}
        sx={{ mb: 2, pt: { xs: 3, md: 5 }, px: { xs: 3, md: 5 } }}
      />
      <CoverBanner />
      <Container maxWidth={false} sx={{ maxWidth: 840, mb: 8, px: { xs: 3, sm: 5 } }}>
        <ProfileInfo />
        <SocialTabs />
      </Container>
    </>
  );
};

export default Social;
