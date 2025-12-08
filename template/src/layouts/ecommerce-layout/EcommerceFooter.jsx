import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { kebabCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const footerLinks = {
  company: [
    {
      label: 'About Us',
      url: '#!',
    },
    {
      label: 'Press',
      url: '#!',
    },
    {
      label: 'Sustainability',
      url: '#!',
    },
    {
      label: 'Request a Catalog',
      url: '#!',
    },
    {
      label: 'Careers',
      url: '#!',
    },
    {
      label: 'Blog',
      url: '#!',
    },
  ],
  help: [
    {
      label: 'Help Center',
      url: '#!',
    },
    {
      label: 'Track Your Order',
      url: '#!',
    },
    {
      label: 'Shipping',
      url: '#!',
    },
    {
      label: 'Information',
      url: '#!',
    },
    {
      label: 'Return Policy',
      url: '#!',
    },
    {
      label: 'FAQs',
      url: '#!',
    },
  ],
  contacts: [
    {
      label: 'Contact Us',
      url: '#!',
    },
    {
      label: 'Shops & Outlets',
      url: '#!',
    },
    {
      label: 'Feedback',
      url: '#!',
    },
  ],
};

const EcommerceFooter = () => {
  return (
    <Paper background={1} sx={{ position: 'relative', px: { xs: 3, md: 5 }, py: { xs: 5, md: 7 } }}>
      <Grid container columnSpacing={1}>
        <Grid
          sx={{ mb: { xs: 6, md: 8, lg: 0 } }}
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row', lg: 'column' }}
            sx={{
              rowGap: 6,
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'text.disabled',
                lineHeight: 1.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Thoughtfully designed,
              </Box>
              <Box component="span" sx={{ display: 'block' }}>
                Masterfully coded
              </Box>
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={(e) => e.preventDefault()}
              sx={{
                textAlign: { md: 'right', lg: 'left' },
              }}
            >
              <Stack
                sx={{
                  gap: 2,
                  mb: 2,
                  justifyContent: { md: 'flex-end', lg: 'flex-start' },
                }}
              >
                <StyledTextField
                  id="email"
                  type="email"
                  placeholder="Your email"
                  variant="filled"
                  sx={{
                    maxWidth: 260,
                    width: 1,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="neutral"
                  sx={{
                    flexShrink: 0,
                  }}
                  endIcon={<IconifyIcon icon="material-symbols:arrow-right-alt-rounded" />}
                >
                  Subscribe
                </Button>
              </Stack>
              <Typography
                component="p"
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                Subscribe to our newsletter for exclusive deals and promotions
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid
          sx={{ mb: { xs: 6, sm: 0 } }}
          size={{
            xs: 12,
            sm: 4,
            lg: 2,
          }}
        >
          <Stack direction="column" spacing={2}>
            {footerLinks['company'].map(({ label, url }) => (
              <Link
                key={kebabCase(label)}
                href={url}
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                }}
              >
                {label}
              </Link>
            ))}
          </Stack>
        </Grid>

        <Grid
          sx={{ mb: { xs: 6, sm: 0 } }}
          size={{
            xs: 12,
            sm: 4,
            lg: 2,
          }}
        >
          <Stack direction="column" spacing={2}>
            {footerLinks['help'].map(({ label, url }) => (
              <Link
                key={kebabCase(label)}
                href={url}
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                }}
              >
                {label}
              </Link>
            ))}
          </Stack>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 4,
            lg: 2,
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              height: 1,
              justifyContent: 'space-between',
            }}
          >
            {footerLinks['contacts'].map(({ label, url }) => (
              <Link
                key={kebabCase(label)}
                href={url}
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  alignSelf: 'flex-start',
                }}
              >
                {label}
              </Link>
            ))}
            <Box
              sx={{
                mt: 'auto',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Follow us at
              </Typography>
              <Stack
                sx={{
                  gap: 1,
                  color: 'text.secondary',
                }}
              >
                <Button
                  href="#!"
                  shape="circle"
                  variant="soft"
                  color="neutral"
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'background.elevation2',
                    },
                  }}
                >
                  <IconifyIcon icon="eva:facebook-fill" fontSize={16} />
                </Button>
                <Button
                  href="#!"
                  shape="circle"
                  variant="soft"
                  color="neutral"
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'background.elevation2',
                    },
                  }}
                >
                  <IconifyIcon icon="ri:twitter-x-fill" fontSize={16} />
                </Button>
                <Button
                  href="#!"
                  shape="circle"
                  variant="soft"
                  color="neutral"
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'background.elevation2',
                    },
                  }}
                >
                  <IconifyIcon icon="entypo-social:pinterest" fontSize={16} />
                </Button>
                <Button
                  href="#!"
                  shape="circle"
                  variant="soft"
                  color="neutral"
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'background.elevation2',
                    },
                  }}
                >
                  <IconifyIcon icon="ri:instagram-line" fontSize={16} />
                </Button>
                <Button
                  href="#!"
                  shape="circle"
                  variant="soft"
                  color="neutral"
                  size="small"
                  sx={{
                    '&:hover': {
                      bgcolor: 'background.elevation2',
                    },
                  }}
                >
                  <IconifyIcon icon="ic:sharp-tiktok" fontSize={16} />
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EcommerceFooter;
