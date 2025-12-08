import { Box, Container, Toolbar } from '@mui/material';
import PageHeader from 'components/sections/landing/common/PageHeader';
import SectionHeader from 'components/sections/landing/common/SectionHeader';
import ContactContainer from 'components/sections/landing/contact/ContactContainer';

const Contact = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Toolbar sx={{ height: 56, width: 1 }} />

      <PageHeader>
        <SectionHeader title="Contact" subtitle="Where to find us?" />
      </PageHeader>

      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1000,
          p: { xs: 3, md: 5 },
        }}
      >
        <ContactContainer />
      </Container>
    </Box>
  );
};

export default Contact;
