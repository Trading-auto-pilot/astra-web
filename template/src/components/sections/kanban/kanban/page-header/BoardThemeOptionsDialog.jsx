import { FormProvider, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { backgroundColorOptions, backgroundImageOptions } from 'data/kanban/createBoard';
import { useKanbanContext } from 'providers/KanbanProvider';
import { UPDATE_BOARD_BACKGROUND } from 'reducers/KanbanReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import Background from 'components/sections/kanban/create-board/steps/Background/Background';

const BoardThemeOptionsDialog = ({ open, handleClose }) => {
  const { kanbanDispatch } = useKanbanContext();
  const methods = useForm({
    defaultValues: {
      backgroundOptions: {
        colors: backgroundColorOptions,
        images: backgroundImageOptions,
        selected: { ...backgroundColorOptions[0], type: 'color' },
      },
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = ({ backgroundOptions }) => {
    if (backgroundOptions.selected) {
      kanbanDispatch({
        type: UPDATE_BOARD_BACKGROUND,
        payload: {
          type: backgroundOptions.selected.type,
          background: backgroundOptions.selected.background,
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={handleClose}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          [`& .${dialogClasses.paper}`]: {
            width: 1,
            maxWidth: 375,
            borderRadius: 6,
          },
        }}
      >
        <DialogContent sx={{ px: 3, py: 0 }}>
          <Stack sx={{ py: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">Change Background</Typography>
            <Button
              variant="text"
              color="neutral"
              size="small"
              shape="square"
              onClick={handleClose}
            >
              <IconifyIcon
                icon="material-symbols:close-rounded"
                sx={{ fontSize: 18, pointerEvents: 'none' }}
              />
            </Button>
          </Stack>
          <Background
            actionButton={
              <Button onClick={handleClose} type="submit">
                Confirm
              </Button>
            }
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default BoardThemeOptionsDialog;
