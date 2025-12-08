import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import bg from 'assets/images/background/4.webp';
import { useThemeMode } from 'hooks/useThemeMode';
import IconifyIcon from 'components/base/IconifyIcon';
import RevealItems from '../common/RevealItems';
import RevealText from '../common/RevealText';
import SectionHeader from '../common/SectionHeader';

const FAQContact = ({ sx }) => {
  const { isDark } = useThemeMode();

  return (
    <Box
      sx={{
        position: 'relative',
        width: 1,
        px: { xs: 3, md: 5 },
        '&:after': {
          content: '""',
          position: 'absolute',
          zIndex: -1,
          inset: 0,
          opacity: isDark ? 0.5 : 1,
          background: `url(${bg}) no-repeat`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom left',
        },
        mb: 3,

        ...sx,
      }}
    >
      <Container
        maxWidth={false}
        sx={{ position: 'relative', maxWidth: 1000, px: { xs: 0 }, py: { xs: 4, sm: 8 } }}
      >
        <Grid
          container
          columns={{ xs: 1, md: 2 }}
          rowSpacing={10}
          columnSpacing={15}
          alignItems="center"
        >
          <Grid
            size={1}
            container
            columns={{ xs: 1, sm: 2, md: 1 }}
            spacing={5}
            alignItems="flex-end"
          >
            <Grid size={1}>
              <SectionHeader
                title="CONTACT"
                subtitle="Still have questions?"
                sx={{ textAlign: 'left', mb: 2 }}
              />

              <RevealText delay={0.2}>
                <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 440 }}>
                  Still have questions? Don’t hesitate to ask! Our dedicated team is ready to assist
                  you with any concerns, ensuring you have the clarity and support needed to proceed
                  with confidence.
                </Typography>
              </RevealText>
            </Grid>

            <Grid size={1}>
              <RevealItems component={List} disablePadding dense>
                <ListItem sx={{ gap: 1 }} disableGutters>
                  <ListItemIcon>
                    <IconifyIcon icon="material-symbols:call-outline" fontSize={24} />
                  </ListItemIcon>
                  <ListItemText disableTypography>
                    <Link href="#!" color="textSecondary" variant="body2">
                      (555) 123-4567
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem sx={{ gap: 1 }} disableGutters>
                  <ListItemIcon>
                    <IconifyIcon icon="material-symbols:mail-outline-rounded" fontSize={24} />
                  </ListItemIcon>
                  <ListItemText disableTypography>
                    <Link href="#!" color="textSecondary" variant="body2">
                      hello@randommail.com
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem sx={{ gap: 1 }} disableGutters>
                  <ListItemIcon>
                    <IconifyIcon
                      icon="material-symbols:location-on-outline-rounded"
                      fontSize={24}
                    />
                  </ListItemIcon>
                  <ListItemText disableTypography>
                    <Typography color="textSecondary" variant="body2">
                      123 Sunnyvale Park, Springfield, IL, USA
                    </Typography>
                  </ListItemText>
                </ListItem>
              </RevealItems>
            </Grid>
          </Grid>

          <RevealItems component={Grid} y={0} container size={1} columns={12} spacing={2}>
            <Grid size={6}>
              <TextField variant="filled" label="First Name" sx={{ width: 1 }} />
            </Grid>
            <Grid size={6}>
              <TextField variant="filled" label="Last Name" sx={{ width: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <TextField variant="filled" label="Email" sx={{ width: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
              <TextField variant="filled" label="Phone" sx={{ width: 1 }} />
            </Grid>
            <Grid size={12}>
              <TextField multiline rows={2} variant="filled" label="Message" sx={{ width: 1 }} />
            </Grid>
            <Grid size={12} sx={{ textAlign: 'right' }}>
              <Button variant="soft">Send message</Button>
            </Grid>
          </RevealItems>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQContact;
