import { Avatar, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const TaskSummaryCard = ({ task }) => {
  return (
    <Paper sx={{ flex: 1, px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack
        spacing={2}
        direction={{
          xs: 'row',
          sm: 'column',
          lg: 'row',
        }}
        alignItems={{
          xs: 'center',
          sm: 'flex-start',
          lg: 'center',
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: (theme) => cssVarRgba(theme.vars.palette[task.icon.color].mainChannel, 0.12),
            width: 40,
            height: 53,
            borderRadius: 2,
          }}
        >
          <IconifyIcon
            icon={task.icon.name}
            sx={{ fontSize: 24 }}
            color={`${task.icon.color}.main`}
          />
        </Avatar>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {task.title} : {task.count}
          </Typography>
          {task.change ? (
            <Stack spacing={1} alignItems="center">
              <Chip
                label={`${task.change.amount} ${task.change.direction}`}
                color={task.change.direction === 'less' ? 'neutral' : 'success'}
              />
              <Typography variant="caption" sx={{ lineHeight: 1.3 }}>
                than {task.change.timeFrame}
              </Typography>
            </Stack>
          ) : (
            task.deadlineRange && (
              <Typography
                variant="caption"
                component="p"
                sx={{ color: 'text.secondary', lineHeight: 1.3 }}
              >
                Deadline :
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600,
                    display: 'inline-block',
                    color: `${task.icon.color}.main`,
                    ml: 0.5,
                  }}
                >
                  {task.deadlineRange}
                </Box>
              </Typography>
            )
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default TaskSummaryCard;
