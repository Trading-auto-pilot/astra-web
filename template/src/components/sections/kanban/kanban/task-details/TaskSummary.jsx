import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { boards, taskLabels, taskPriorities } from 'data/kanban/kanban';
import { users } from 'data/users';
import dayjs from 'dayjs';
import { useKanbanContext } from 'providers/KanbanProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import BoardMembers from 'components/sections/kanban/kanban/page-header/BoardMembers';
import InviteMemberDialog from 'components/sections/kanban/kanban/page-header/InviteMemberDialog';
import StyledTextField from 'components/styled/StyledTextField';

const options = [
  {
    name: 'board',
    items: boards,
  },
  {
    name: 'column',
    items: [],
  },
  {
    name: 'label',
    items: taskLabels,
  },
  {
    name: 'priority',
    items: taskPriorities,
  },
];

const TaskSummary = () => {
  const { listItems, taskDetails } = useKanbanContext();
  const { control, setValue, watch } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenInviteDialog, setIsOpenInviteDialog] = useState(false);

  const title = watch('title');

  const selectItems = useMemo(
    () =>
      options.map((item) =>
        item.name === 'column' ? { ...item, items: listItems.map((item) => item.title) } : item,
      ),
    [listItems],
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (value) => {
    if (value.trim() === '') {
      setValue('title', taskDetails?.title);
    }
    setIsEditing(false);
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
        {isEditing ? (
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <StyledTextField
                {...field}
                variant="outlined"
                size="large"
                autoFocus
                onBlur={(e) => handleBlur(e.target.value)}
                fullWidth
              />
            )}
          />
        ) : (
          <>
            <Typography variant="h5">{title}</Typography>
            <IconButton onClick={handleEditClick}>
              <IconifyIcon
                icon="material-symbols:edit-outline"
                sx={{ color: 'text.primary', fontSize: 20 }}
              />
            </IconButton>
          </>
        )}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Assignee
            </Typography>
            <Stack spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
              <BoardMembers members={[...users].slice(0, 6)} />

              <Button
                variant="soft"
                shape="circle"
                color="neutral"
                onClick={() => setIsOpenInviteDialog(true)}
              >
                <IconifyIcon
                  icon="material-symbols:add-2-rounded"
                  color="text.primary"
                  fontSize={18}
                />
              </Button>

              <InviteMemberDialog
                open={isOpenInviteDialog}
                handleClose={() => setIsOpenInviteDialog(false)}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="dueDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    Due Date
                  </Typography>
                  <DatePicker
                    format="DD MMM, YYYY"
                    defaultValue={dayjs(value)}
                    onChange={(date) => {
                      onChange(date);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                    slots={{
                      textField: StyledTextField,
                    }}
                  />
                </div>
              )}
            />
          </Grid>

          {selectItems.map((item) => (
            <Grid key={item.name} size={{ xs: 12, md: 6 }}>
              <Controller
                name={item.name}
                control={control}
                render={({ field }) => (
                  <div>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <StyledTextField
                      {...field}
                      id={`custom-select-${item.name}`}
                      size="medium"
                      select
                      sx={{ width: 1, textTransform: 'capitalize' }}
                    >
                      {item.items.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{ textTransform: 'capitalize' }}
                          dense
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </div>
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default TaskSummary;
