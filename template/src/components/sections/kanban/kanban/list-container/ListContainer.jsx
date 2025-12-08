import { useState } from 'react';
import { isWindows } from 'react-device-detect';
import { useTheme } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListHeader from './ListHeader';
import TaskItems from './TaskItems';

const ListContainer = ({ taskList, listeners }) => {
  const { id, title, tasks, compactMode } = taskList;
  const [isAddNewTaskFormOpen, setIsAddNewTaskFormOpen] = useState(false);
  const theme = useTheme();

  return (
    <Box
      {...listeners}
      sx={[
        {
          height: 1,
          width: 316,
          flexShrink: 0,
          bgcolor: 'background.default',
        },
        compactMode && {
          width: 80,
          bgcolor: 'background.elevation1',
        },
      ]}
    >
      <ListHeader
        listId={id}
        title={title}
        compactMode={compactMode}
        handleAddTaskFormOpen={() => setIsAddNewTaskFormOpen(true)}
      />

      {compactMode ? (
        <Box sx={{ px: 3 }}>
          <Divider />
          <Stack
            sx={{
              mt: 8,
              width: 1,
              alignItems: 'center',
              justifyContent: theme.direction === 'rtl' ? 'flex-start' : 'flex-end',
              transform: 'rotate(-90deg)',
            }}
          >
            <Badge
              badgeContent={`${tasks.length}`}
              color="primary"
              sx={[
                {
                  [`& .${badgeClasses.badge}`]: {
                    right: -28,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  },
                },
                theme.direction === 'rtl' && {
                  left: -28,
                },
              ]}
            >
              <Typography variant="h6">{title}</Typography>
            </Badge>
          </Stack>
        </Box>
      ) : (
        <Stack
          direction="column"
          sx={{
            height: `calc(100% - 70px)`,
            overflowY: 'auto',
            ...(isWindows && {
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }),
          }}
        >
          <TaskItems
            listId={id}
            isAddNewTaskFormOpen={isAddNewTaskFormOpen}
            handleAddNewTaskFormClose={() => setIsAddNewTaskFormOpen(false)}
            tasks={tasks}
          />
        </Stack>
      )}
    </Box>
  );
};

export default ListContainer;
