import { useMemo } from 'react';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { shares } from 'data/e-commerce/marketShare';
import useNumberFormat from 'hooks/useNumberFormat';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import MarketShareChart from './MarketShareChart';
import MarketShareList from './MarketShareList';

const MarketShare = () => {
  const { vars } = useTheme();
  const { currencyFormat } = useNumberFormat();

  const brandColorMap = useMemo(
    () => ({
      alligator: vars.palette.chBlue[300],
      check_mark: vars.palette.chGrey[300],
      stripes: vars.palette.chGrey[500],
      head_mead: vars.palette.chBlue[500],
    }),
    [vars.palette],
  );

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: '100%' }} background={1}>
      <SectionHeader
        title="Market Share"
        subTitle="Amount of revenue in one month"
        actionComponent={<DashboardMenu />}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'column' }}
        sx={{
          gap: 4,
          alignItems: 'center',
        }}
      >
        <Stack sx={{ justifyContent: 'center', flex: 1 }}>
          <Box sx={{ width: 'fit-content', position: 'relative' }}>
            <MarketShareChart
              data={shares}
              bgColorMap={brandColorMap}
              sx={{ height: '230px !important', width: '230px' }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>
                {currencyFormat(6322.32)}
              </Typography>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{
                  fontWeight: 'regular',
                  color: 'text.secondary',
                }}
              >
                Total transactions
              </Typography>
            </Box>
          </Box>
        </Stack>

        <MarketShareList shares={shares} bgColorMap={brandColorMap} />
      </Stack>
    </Paper>
  );
};

export default MarketShare;
