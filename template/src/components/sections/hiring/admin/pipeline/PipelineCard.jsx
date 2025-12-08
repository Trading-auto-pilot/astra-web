import { useNavigate } from 'react-router';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';

const PipelineCard = ({ pipeline }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(paths.hiringCandidateDetails);

  return (
    <Paper
      onClick={handleClick}
      background={2}
      sx={{
        p: 2,
        borderRadius: 4,
        outline: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Stack gap={2} alignItems="center">
        <Tooltip title={pipeline.user.name}>
          <Avatar src={pipeline.user.avatar} sx={{ width: 56, height: 56 }} />
        </Tooltip>

        <Stack direction="column" gap={0.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            {pipeline.user.name}
          </Typography>
          <Rating size="small" value={pipeline.rating} readOnly />
        </Stack>
      </Stack>

      <Stack justifyContent="space-between" alignItems="center" gap={2}>
        <Stack gap={1}>
          <IconifyIcon icon="material-symbols:schedule-outline-rounded" sx={{ fontSize: 18 }} />

          <Typography variant="caption" color="text.secondary" fontWeight={500} lineHeight={1.5}>
            {dayjs(pipeline.appliedDate).format('MMM DD, YYYY')}
          </Typography>
        </Stack>

        <DashboardMenu />
      </Stack>
    </Paper>
  );
};
export default PipelineCard;
