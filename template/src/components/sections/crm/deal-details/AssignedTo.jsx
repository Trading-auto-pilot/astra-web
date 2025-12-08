import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const AssignedTo = ({ assignedToData }) => {
  return (
    <Paper component={Stack} direction="column" sx={{ p: { xs: 3, md: 5 }, gap: 2 }}>
      <Typography variant="h5">Assigned to</Typography>
      <Stack gap={2} sx={{ overflowX: 'auto' }}>
        {assignedToData.map((data) => (
          <Stack key={data.type} direction="column" gap={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {data.type}
            </Typography>
            <Stack gap={1} sx={{ alignItems: 'flex-start' }}>
              {data.people.map((peopleInfo) => (
                <Chip
                  key={peopleInfo.id}
                  label={peopleInfo.name}
                  avatar={<Avatar src={peopleInfo.avatar} sx={{ width: 16, height: 16 }} />}
                  variant="soft"
                  onDelete={peopleInfo.editable ? () => {} : undefined}
                  deleteIcon={
                    peopleInfo.editable ? (
                      <IconifyIcon icon="material-symbols:edit-outline" />
                    ) : undefined
                  }
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default AssignedTo;
