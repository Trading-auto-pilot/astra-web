import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import paths from 'routes/paths';
import DashboardMenu from 'components/common/DashboardMenu';

const JobOpeningCard = ({ job }) => {
  return (
    <Paper
      component={Link}
      href={paths.hiringJobDetails()}
      underline="none"
      background={1}
      sx={{
        p: 3,
        display: 'block',
        borderRadius: 6,
        outline: 0,
        height: 1,
        '&:hover': { bgcolor: 'background.elevation2' },
      }}
    >
      <Stack direction="column" gap={3} height={1} justifyContent="space-between">
        <Stack direction="column" gap={2}>
          <Stack gap={2} justifyContent="space-between">
            <Stack direction="column" gap={0.5}>
              <Typography
                color="text.primary"
                variant="h6"
                lineHeight={1.5}
                sx={{
                  lineClamp: 2,
                }}
              >
                {job.title}
              </Typography>
              <Stack gap={2}>
                <Typography component="span" variant="subtitle2" fontWeight={400}>
                  {job.field}
                </Typography>
                <Typography component="span" variant="subtitle2" fontWeight={400}>
                  {job.branch} branch
                </Typography>
              </Stack>
            </Stack>

            <DashboardMenu />
          </Stack>

          <Stack gap={2} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight={700} color="text.primary">
                {job.vacancy}
              </Box>
              {` `}Vacancy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight={700} color="text.primary">
                {job.candidates}
              </Box>
              {` `}Candidates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight={700} color="text.primary">
                {job.hiringLead}
              </Box>
              {` `}Hiring Lead
            </Typography>
          </Stack>
        </Stack>
        <Stack gap={1} justifyContent="space-between" alignItems="center">
          <Stack gap={1} alignItems="center" flexWrap="wrap">
            {job.tags.map((tag, index) => (
              <Chip key={index} label={tag.label} color={tag.color} />
            ))}
          </Stack>
          <Typography variant="caption" fontWeight={500} lineHeight={1.5} color="text.secondary">
            {dayjs(job.postedDate).format('MMM D, YYYY')}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default JobOpeningCard;
