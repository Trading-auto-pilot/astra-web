import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import paths from 'routes/paths';
import Logo from 'components/common/Logo';
import NavList from './NavList';
import NewsLetter from './NewsLetter';
import SocialIcons from './SocialIcons';

const footerLinks = [
  {
    title: 'Aurora',
    items: [
      {
        label: 'About Us',
        href: paths.landingAbout,
      },
      {
        label: 'Careers',
        href: '#!',
      },
      {
        label: 'Blog',
        href: '#!',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        label: 'Help Center',
        href: '#!',
      },
      {
        label: 'Contact Us',
        href: paths.landingContact,
      },
      {
        label: 'Pricing',
        href: '#!',
      },
      {
        label: 'FAQs',
        href: paths.landingFaq,
      },
    ],
  },
  {
    title: 'Legal',
    items: [
      {
        label: 'Privacy',
        href: '#!',
      },
      {
        label: 'Cookie',
        href: '#!',
      },
      {
        label: 'Terms',
        href: '#!',
      },
      {
        label: 'Security',
        href: '#!',
      },
    ],
  },
];

const NavSection = () => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: 1448, px: { xs: 3, md: 5 } }}>
      <Stack direction="column" divider={<Divider flexItem />}>
        <Grid container rowSpacing={5} py={5}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Logo />

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ maxWidth: { xs: 400, xl: 270 }, mt: 3 }}
            >
              Aurora is a complete platform with a user-friendly interface. It offers tools for
              seamless collaboration and easy integration with your workflow.
            </Typography>
          </Grid>

          <Grid container size={{ xs: 12, md: 7, lg: 4 }}>
            {footerLinks.map((item) => (
              <Grid key={item.title} size={{ xs: 4 }}>
                <NavList title={item.title} items={item.items} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} size={{ xs: 12, sm: 7, md: 5, lg: 4 }}>
            <Grid size={{ xs: 12 }}>
              <NewsLetter />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ justifySelf: 'flex-end' }}>
              <SocialIcons />
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            Aurora Ltd © 2025, all rights reserved
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default NavSection;
