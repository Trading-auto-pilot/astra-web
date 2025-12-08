import { Avatar, Container, Grid, Link, Paper, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Mapbox from 'components/base/Mapbox';
import RevealItems from '../common/RevealItems';
import ContactForm from './ContactForm';

const contactCardItems = [
  {
    id: 1,
    icon: 'mdi:phone-in-talk-outline',
    title: 'Phone Number',
    isLink: true,
    href: 'tel:55512345678901',
    content: '(555) 123-4567-8901',
  },
  {
    id: 2,
    icon: 'mdi:email-outline',
    title: 'Email Address',
    isLink: true,
    href: 'mailto:hello@randommail.com',
    content: 'hello@randommail.com',
  },
  {
    id: 3,
    icon: 'mdi:location-on-outline',
    title: 'Location',
    content: '123 Sunnyvale Park, Springfield, IL, USA',
  },
];

const ContactContainer = () => {
  return (
    <div>
      <RevealItems component={Grid} container spacing={2} mb={2} mt={2}>
        {contactCardItems.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 4 }}>
            <Paper
              variant="elevation"
              elevation={0}
              background={1}
              sx={{
                p: { xs: 2, sm: 3 },
                height: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: 'primary.lighter',
                  mb: 2,
                }}
              >
                <IconifyIcon icon={item.icon} fontSize={16} sx={{ color: 'primary.main' }} />
              </Avatar>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {item.title}
              </Typography>

              <Typography
                component={item.href ? Link : 'p'}
                href={item.href}
                variant="caption"
                color="textSecondary"
                sx={{ display: 'block', lineClamp: 1 }}
              >
                {item.content}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </RevealItems>

      <Mapbox
        sx={{ bgcolor: 'background.elevation1', borderRadius: 2, mb: 8 }}
        options={{
          center: [-118.4782382, 34.1917607],
          zoom: 14,
          scrollZoom: false,
        }}
      />

      <Container maxWidth={false} sx={{ maxWidth: 440, py: 6 }} disableGutters>
        <ContactForm />
      </Container>
    </div>
  );
};

export default ContactContainer;
