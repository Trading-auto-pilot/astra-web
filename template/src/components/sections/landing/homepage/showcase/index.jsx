import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DashedLine from '../../common/DashedLine';
import SectionHeader from '../../common/SectionHeader';
import { StripedBackground } from '../../common/StripedBackground';
import ShowcaseItem from './Item';

const Showcase = ({ data }) => {
  const { up } = useBreakpoints();

  const upMd = up('md');

  return (
    <Paper sx={{ py: { xs: 4, sm: 8 }, outline: 0 }}>
      <Container maxWidth={false} sx={{ maxWidth: 1082, px: { xs: 3, md: 5 } }}>
        <Stack direction="column" gap={3}>
          <SectionHeader title="Showcase" subtitle="Our selected works" />
          <Box
            sx={{
              position: 'relative',
            }}
          >
            {upMd && (
              <DashedLine
                orientation="vertical"
                gradientOrientation="none"
                sx={{
                  zIndex: 10,
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                }}
              />
            )}
            <DashedLine
              orientation="vertical"
              gradientOrientation="none"
              sx={{
                zIndex: 10,
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
              }}
            />
            <DashedLine
              orientation="vertical"
              gradientOrientation="none"
              sx={{
                zIndex: 10,
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
            <Stack
              direction="column"
              sx={{
                position: 'relative',
              }}
            >
              <StripedBackground sx={{ height: 40 }} />
              <ShowcaseItem item={data[0]} />
              <StripedBackground sx={{ height: 40 }} />
              <ShowcaseItem item={data[1]} isLeft={false} />
              <StripedBackground sx={{ height: 40 }} />
              <ShowcaseItem item={data[2]} />
              <StripedBackground sx={{ height: 40 }} />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Paper>
  );
};

export default Showcase;
