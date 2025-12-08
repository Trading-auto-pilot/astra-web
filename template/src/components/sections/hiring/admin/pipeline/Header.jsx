import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';

const PipelineHeader = () => {
  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack direction="column" gap={2}>
        <PageBreadcrumb
          items={[
            { label: 'Home', url: paths.hiringJobOpening },
            { label: 'Pipeline', active: true },
          ]}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={2}
          justifyContent="space-between"
          alignItems={{ sm: 'flex-end' }}
        >
          <Stack direction="column" gap={0.5}>
            <Typography variant="h4" whiteSpace={{ sm: 'nowrap' }}>
              Content Writer
            </Typography>

            <Stack gap={2}>
              <Typography variant="subtitle2" fontWeight={400}>
                Marketing
              </Typography>
              <Typography variant="subtitle2" fontWeight={400}>
                UK branch
              </Typography>
            </Stack>
          </Stack>

          <Stack
            columnGap={{ sm: 4, lg: 10 }}
            rowGap={1}
            justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
            alignItems="flex-end"
            flexWrap="wrap"
          >
            <Stack
              columnGap={2}
              flexWrap="wrap"
              justifyContent={{ sm: 'flex-end' }}
              alignItems="flex-end"
            >
              <Typography variant="body2" color="text.secondary">
                <Box component="span" fontWeight={700} color="text.primary">
                  2{` `}
                </Box>
                Vacancy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" fontWeight={700} color="text.primary">
                  10
                  {` `}
                </Box>
                Candidates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" fontWeight={700} color="text.primary">
                  John Carter
                  {` `}
                </Box>
                Hiring Lead
              </Typography>
            </Stack>

            <Button
              href={paths.hiringJobApplication}
              variant="contained"
              startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
              sx={{ flexShrink: 0 }}
            >
              Add Candidate
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PipelineHeader;
