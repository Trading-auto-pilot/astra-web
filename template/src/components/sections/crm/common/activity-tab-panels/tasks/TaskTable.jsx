import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import CRMDropdownMenu from '../../CRMDropdownMenu';

const TaskTable = ({ taskList, handleCheck }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <TableContainer component={Box} sx={{ pl: 0 }}>
      <Table
        sx={{
          minWidth: 0,
          borderColor: 'dividerLight',
          [`& .${tableCellClasses.root}`]: {
            py: 1.5,
          },
        }}
        aria-label="simple table"
        className="disable-edge-padding"
      >
        <TableBody>
          {taskList.map((taskItem) => {
            return (
              <TableRow key={taskItem.id}>
                <TableCell padding="none">
                  <Checkbox checked={taskItem.completed} onChange={() => handleCheck(taskItem)} />
                </TableCell>
                <TableCell
                  align="left"
                  sx={(theme) => ({
                    fontWeight: 500,
                    pl: 0,
                    color: `${taskItem.completed ? theme.vars.palette.text.disabled : theme.vars.palette.text.primary} !important`,
                  })}
                >
                  {taskItem.title}
                </TableCell>
                <TableCell align="right">
                  <AvatarGroup>
                    {taskItem.people.map((user) => (
                      <Avatar key={user.id} src={user.avatar} sx={{ width: 30, height: 30 }} />
                    ))}
                    <Avatar
                      component={ButtonBase}
                      color="secondary"
                      sx={[
                        {
                          zIndex: '6 !important',
                          width: 30,
                          height: 30,
                        },
                        taskItem.completed && {
                          bgcolor: 'action.disabledBackground',
                          color: 'text.disabled',
                        },
                      ]}
                    >
                      <IconifyIcon
                        icon="material-symbols:group-add-outline-rounded"
                        sx={{ fontSize: 18 }}
                      />
                    </Avatar>
                  </AvatarGroup>
                </TableCell>
                <TableCell align="right">
                  <Stack gap={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={[
                        { color: 'text.secondary' },
                        taskItem.completed && { color: 'text.disabled' },
                      ]}
                    >
                      {dayjs(taskItem.timeStamp).format('h:mm a')}
                    </Typography>
                    <Button
                      size="small"
                      shape="square"
                      color="neutral"
                      disabled={taskItem.completed}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{ borderRadius: 1 }}
                    >
                      <IconifyIcon
                        icon="material-symbols:more-vert"
                        sx={[
                          { fontSize: 18, color: 'text.primary' },
                          taskItem.completed && { color: 'text.disabled' },
                        ]}
                      />
                    </Button>
                    <CRMDropdownMenu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      handleClose={() => setAnchorEl(null)}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
