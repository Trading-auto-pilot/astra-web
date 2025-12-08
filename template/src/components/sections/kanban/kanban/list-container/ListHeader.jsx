import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useKanbanContext } from 'providers/KanbanProvider';
import { TOGGLE_COMPACT_MODE, UPDATE_LIST_TITLE } from 'reducers/KanbanReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import ListContainerMenu from './ListContainerMenu';

const ListHeader = ({ listId, title, compactMode, handleAddTaskFormOpen }) => {
  const [listTitle, setListTitle] = useState({ isEditing: false, value: title });
  const { kanbanDispatch } = useKanbanContext();

  const handleBlur = () => {
    setListTitle({ ...listTitle, isEditing: false });
    kanbanDispatch({
      type: UPDATE_LIST_TITLE,
      payload: { id: listId, title: listTitle.value },
    });
    if (listTitle.value === '') {
      setListTitle({ isEditing: false, value: title });
      kanbanDispatch({ type: UPDATE_LIST_TITLE, payload: { id: listId, title: title } });
    }
  };

  return (
    <Box sx={{ p: 3, pb: 2 }}>
      <Stack
        spacing={1}
        sx={{
          position: 'relative',
          alignItems: 'center',
        }}
      >
        {!compactMode && (
          <>
            {listTitle.isEditing ? (
              <StyledTextField
                variant="outlined"
                size="small"
                value={listTitle.value}
                onChange={(e) => setListTitle({ ...listTitle, value: e.target.value })}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBlur();
                  }
                }}
                autoFocus
                fullWidth
              />
            ) : (
              <Typography
                variant="h6"
                onClick={() => setListTitle({ ...listTitle, isEditing: true })}
                sx={{ overflow: 'hidden', textWrap: 'nowrap', textOverflow: 'ellipsis' }}
              >
                {listTitle.value}
              </Typography>
            )}

            <Button
              variant="soft"
              color="primary"
              size="small"
              shape="square"
              onClick={handleAddTaskFormOpen}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <IconifyIcon
                icon="material-symbols:add-2-rounded"
                sx={{ fontSize: 18, pointerEvents: 'none' }}
              />
            </Button>
            <ListContainerMenu />
          </>
        )}
        <Button
          variant="text"
          color="neutral"
          size="small"
          shape="square"
          onClick={() => kanbanDispatch({ type: TOGGLE_COMPACT_MODE, payload: { id: listId } })}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{ ml: 'auto' }}
        >
          <IconifyIcon
            icon={
              compactMode
                ? 'material-symbols:open-in-full-rounded'
                : 'material-symbols:close-fullscreen-rounded'
            }
            sx={{ fontSize: 18, pointerEvents: 'none' }}
          />
        </Button>
      </Stack>
    </Box>
  );
};

export default ListHeader;
