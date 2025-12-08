import { Box, Chip, Stack, Typography } from '@mui/material';
import Image from 'components/base/Image';

const growthBadge = (val) => {
  if (val > 1) {
    return {
      color: 'success',
    };
  }
  if (val < 0) {
    return {
      color: 'error',
    };
  }

  return {
    color: 'warning',
  };
};

const MarketShareList = ({ shares, bgColorMap }) => {
  return (
    <Stack
      direction="column"
      sx={{
        gap: 2,
        flex: 1,
        alignSelf: 'stretch',
      }}
    >
      {shares.map((share, index) => (
        <Stack
          key={share.id}
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            alignItems: 'stretch',
            pt: { xs: 2, sm: index === 0 ? 0 : 2, md: 2 },
            borderTop: { xs: 1, sm: index === 0 ? 0 : 1, md: 1 },
            borderColor: { xs: 'divider', sm: 'divider', md: 'divider' },
          }}
        >
          <Box
            sx={{
              height: { xs: 24, sm: 44, lg: 24 },
              width: 8,
              borderRadius: 2,
              background: bgColorMap[share.id],
            }}
          />
          <Stack
            direction={{ xs: 'row', sm: 'column', lg: 'row' }}
            sx={{
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <Stack
              sx={{
                alignItems: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Image src={share.icon} alt={share.brand} height={16} />
              <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
                {share.brand}
              </Typography>
            </Stack>
            <Stack
              sx={{
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {share.revenue}%
              </Typography>
              <Chip
                label={`${share.growth}%`}
                color={growthBadge(share.growth)?.color}
                variant="soft"
              />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default MarketShareList;
