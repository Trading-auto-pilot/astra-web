import { useFormContext } from 'react-hook-form';
import Button, { buttonClasses } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useKanbanContext } from 'providers/KanbanProvider';
import { TASK_DETAILS_CLOSE } from 'reducers/KanbanReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const buttons = [
  {
    icon: 'material-symbols:drive-file-move-outline-rounded',
    title: 'Transfer',
  },
  {
    icon: 'material-symbols:file-copy-outline-rounded',
    title: 'Copy',
  },
  {
    icon: 'material-symbols:share-outline',
    title: 'Share',
  },
  {
    icon: 'material-symbols:move-up-rounded',
    title: 'Move Up',
  },
  {
    icon: 'material-symbols:delete-outline-rounded',
    title: 'Delete',
  },
  {
    icon: 'material-symbols:download-rounded',
    title: 'Download',
  },
];

const TaskDetailsHeader = () => {
  const { kanbanDispatch } = useKanbanContext();
  const { watch, setValue } = useFormContext();
  const { up } = useBreakpoints();
  const upMd = up('md');

  const isCompleted = watch('completed');

  const handleClick = () => {
    setValue('completed', true);
  };

  return (
    <Stack sx={{ px: { xs: 3, md: 5 }, py: 3, alignItems: 'center' }}>
      <Button
        variant="soft"
        shape={upMd ? undefined : 'square'}
        color={isCompleted ? 'success' : 'neutral'}
        size="small"
        startIcon={<IconifyIcon icon="material-symbols:check-rounded" fontSize="18px !important" />}
        onClick={handleClick}
        sx={[
          { borderRadius: 1 },
          !upMd && {
            [`& .${buttonClasses.startIcon}`]: {
              m: 0,
            },
          },
        ]}
      >
        {upMd && (isCompleted ? 'Completed' : 'Mark Complete')}
      </Button>

      {buttons.map((item, index) => (
        <Tooltip key={item.title} title={item.title}>
          <Button
            variant="soft"
            shape="square"
            color="neutral"
            size="small"
            sx={{ ml: index === 0 ? 'auto' : 1, borderRadius: 1 }}
            onClick={item.onClick}
          >
            <IconifyIcon icon={item.icon} fontSize={18} />
          </Button>
        </Tooltip>
      ))}

      <Button
        variant="text"
        shape="square"
        color="neutral"
        size="small"
        onClick={() => kanbanDispatch({ type: TASK_DETAILS_CLOSE })}
        sx={{ ml: 1, borderRadius: 1 }}
      >
        <IconifyIcon icon="material-symbols:close-rounded" fontSize={18} />
      </Button>
    </Stack>
  );
};

export default TaskDetailsHeader;
