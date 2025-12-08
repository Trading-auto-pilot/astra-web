import { Avatar, Box, Button, Chip, Link, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const GeneralInfo = ({ customerInfo }) => {
  const {
    name,
    avatar,
    isStarMember,
    contactInfo: { email, phone, address },
  } = customerInfo;
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const contactDetails = [
    {
      label: 'Email address',
      value: (
        <Link
          href="#!"
          sx={{
            color: 'text.primary',
          }}
        >
          {email}
        </Link>
      ),
    },
    {
      label: 'Phone number',
      value: (
        <Link
          href="#!"
          sx={{
            color: 'text.primary',
          }}
        >
          {phone}
        </Link>
      ),
    },
    {
      label: 'Default shipping address',
      value: <Typography variant="body1">{address.shipping}</Typography>,
    },
    {
      label: 'Default billing address',
      value: <Typography variant="body1">{address.billing}</Typography>,
    },
  ];

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          p: 3,
          position: 'relative',
          borderRadius: 6,
          backgroundImage: ({ vars }) =>
            `linear-gradient(to right, ${cssVarRgba(vars.palette.primary.mainChannel, 0.1)}, ${cssVarRgba(vars.palette.success.lightChannel, 0.1)})`,
        }}
      >
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          sx={{
            alignItems: { xl: 'center' },
            columnGap: 10,
            rowGap: 5,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row', xl: 'column' }}
            sx={{
              alignItems: { sm: 'center' },
              rowGap: 1,
              columnGap: 3,
            }}
          >
            <Avatar
              alt={name}
              src={avatar}
              sx={{
                width: 128,
                height: 128,
                border: '1px solid',
                borderColor: 'common.white',
              }}
            />
            <div>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 3, sm: 1.5, xl: 3 },
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </Typography>
              {isStarMember && (
                <Chip
                  variant="filled"
                  color="warning"
                  label="Star Member"
                  icon={<IconifyIcon icon="material-symbols:stars-rounded" fontSize={16} />}
                />
              )}
            </div>
          </Stack>

          <Grid container spacing={2}>
            {contactDetails.map((detail, index) => (
              <Grid key={index} size={12}>
                <Grid container rowSpacing={1} columnSpacing={2}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                      xl: 3,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        display: 'flex',
                        gap: 1,
                        justifyContent: { sm: 'space-between' },
                      }}
                    >
                      {detail.label}
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                        }}
                      >
                        :
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 8,
                      xl: 9,
                    }}
                  >
                    {detail.value}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Button
          variant="text"
          color="neutral"
          shape={upSm ? undefined : 'square'}
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
          }}
        >
          <IconifyIcon icon="material-symbols:edit-outline-rounded" fontSize="20px !important" />
          {upSm && (
            <Box component="span" sx={{ ml: 0.5 }}>
              Edit information
            </Box>
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default GeneralInfo;
