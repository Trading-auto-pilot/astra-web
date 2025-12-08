import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SimpleBar from 'components/base/SimpleBar';
import PipelineHeader from 'components/sections/hiring/admin/pipeline/Header';
import PipelineKanban from 'components/sections/hiring/admin/pipeline/PipelineKanban';

const Pipeline = () => {
  const { topbarHeight } = useNavContext();
  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <Stack direction="column" height={1}>
      <PipelineHeader />

      <Box
        sx={{
          px: { xs: 3, md: 5 },
          height: ({ mixins }) =>
            mixins.contentHeight(
              topbarHeight,
              (upMd ? mixins.footer.sm : mixins.footer.xs) + (upMd ? 167 : 201),
            ),
        }}
      >
        <SimpleBar>
          <Stack sx={{ height: 1, gap: 3 }}>
            <PipelineKanban />
          </Stack>
        </SimpleBar>
      </Box>
    </Stack>
  );
};

export default Pipeline;
