import { Box, Button, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';

const PageHeader = ({ title, breadcrumb, userLoggedIn, sx }) => {
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Paper sx={{ py: 4, px: { xs: 3, md: 5 }, ...sx }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          rowGap: 3,
          columnGap: 5,
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={[
            {
              flexShrink: 0,
            },
            userLoggedIn === true && {
              flex: { xl: '50%' },
            },
          ]}
        >
          <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} />
          <Typography variant="h4">{title}</Typography>
        </Box>

        {userLoggedIn ? (
          <ButtonBase
            href={paths.products}
            sx={{
              display: 'flex',
              maxHeight: 90,
              position: 'relative',
              borderRadius: 2,
              py: 2,
              pl: 3,
              pr: 1,
              overflow: 'visible',
              bgcolor: ({ vars }) => cssVarRgba(vars.palette.error.mainChannel, 0.08),
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1,
                height: 1,
                backgroundImage: `url(${assetsDir}/images/ecommerce/promo/2.webp)`,
                opacity: 0.2,
                backgroundBlendMode: 'lighten',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                zIndex: 1,
                borderRadius: 'inherit',
              },
            }}
          >
            <Stack
              sx={{
                gap: { md: 1 },
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  mr: 1,
                  color: 'error.darker',
                  fontSize: { xs: 'h6.fontSize', sm: 'h4.fontSize' },
                }}
              >
                <Box component="span" sx={{ fontWeight: 400 }}>
                  Plants on Sale for
                </Box>{' '}
                <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                  Mother’s Day
                </Box>
              </Typography>

              <Image
                src={`${assetsDir}/images/ecommerce/promo/1.webp`}
                alt="Plant on Sale"
                sx={{
                  position: 'relative',
                  display: 'block',
                  zIndex: 1,
                  bottom: 16,
                  right: 0,
                  height: 110,
                }}
              />
            </Stack>
          </ButtonBase>
        ) : (
          <Box
            sx={{
              bgcolor: 'primary.lighter',
              borderRadius: 6,
              py: 2,
              px: 3,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                columnGap: 5,
                rowGap: 3,
                height: 1,
                alignItems: { sm: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Stack
                direction={{ xs: 'column', xl: 'row' }}
                sx={{
                  gap: 1,
                  alignItems: { xl: 'center' },
                }}
              >
                <Typography variant="h6">Already a member? </Typography>
                <Typography
                  component="p"
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Log in for a <strong>faster checkout process</strong>
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                sx={{
                  gap: 1,
                  alignItems: { xs: 'stretch', lg: 'center' },
                }}
              >
                <Button
                  variant="contained"
                  color="neutral"
                  sx={{ whiteSpace: 'nowrap' }}
                  href={paths.defaultJwtLogin}
                >
                  Login to checkout
                </Button>
                <Button
                  variant="text"
                  color="neutral"
                  sx={{ whiteSpace: 'nowrap' }}
                  href={paths.defaultJwtSignup}
                >
                  Create a new account
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
