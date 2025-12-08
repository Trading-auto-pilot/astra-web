import { Box, Grid, Stack } from '@mui/material';
import { positionsData as data } from 'data/hiring/dashboard';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DashboardMenu from 'components/common/DashboardMenu';
import SectionHeader from 'components/common/SectionHeader';
import SectionWrapper from '../common/SectionWrapper';
import PositionCard from './PositionCard';

const MyPositions = () => {
  const { only } = useBreakpoints();
  const onlySm = only('sm');
  const onlyXs = only('xs');

  return (
    <Stack component={SectionWrapper} direction="column">
      <SectionHeader
        title="My Positions"
        subTitle="Recruitment involvement across roles"
        actionComponent={<DashboardMenu />}
      />
      <Box
        sx={[
          { flexGrow: 1, height: 1, overflowY: 'auto', flexBasis: { sm: 0 } },
          onlySm && { minHeight: 330 },
          onlyXs && { maxHeight: 440 },
        ]}
      >
        <Grid container spacing={1}>
          {data.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 12 }}>
              <PositionCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default MyPositions;
