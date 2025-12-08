import { Button, InputAdornment, Stack, Tooltip, buttonClasses } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import SortMenu from './SortMenu';

const buttons = [
  {
    id: 1,
    text: 'Export / Import',
    icon: 'material-symbols:swap-vertical-circle-outline-rounded',
  },
  {
    id: 2,
    text: 'Filter',
    icon: 'material-symbols:filter-alt-outline',
  },
];

const KanbanBoardsHeader = () => {
  const { up } = useBreakpoints();

  const upLg = up('lg');

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: { xs: 3, md: 5 },
        alignItems: 'center',
        flexWrap: { xs: 'wrap', sm: 'noWrap' },
      }}
    >
      <Button
        size="medium"
        variant="contained"
        startIcon={
          <IconifyIcon icon="material-symbols:add-2-rounded" sx={{ fontSize: '18px !important' }} />
        }
        href={paths.createBoard}
        sx={{ flexShrink: 0 }}
      >
        New Board
      </Button>

      {buttons.map((item, index) => (
        <Tooltip key={item.id} title={item.text} disableHoverListener={upLg ? true : false}>
          <Button
            variant={upLg ? 'text' : 'soft'}
            color="neutral"
            shape={upLg ? undefined : 'square'}
            sx={[
              { flexShrink: 0, gap: 1 },
              index === 1 && { ml: 'auto' },
              !upLg && {
                [`& .${buttonClasses.startIcon}`]: {
                  m: 0,
                },
              },
            ]}
          >
            <IconifyIcon icon={item.icon} sx={{ fontSize: '18px !important' }} />
            {upLg && item.text}
          </Button>
        </Tooltip>
      ))}

      <SortMenu />

      <StyledTextField
        id="search-box"
        type="search"
        size="medium"
        placeholder="Search"
        sx={{
          width: 1,
          minWidth: 130,
          maxWidth: { xs: 1, sm: 355 },
          mt: { xs: 1, sm: 0 },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon
                  icon="material-symbols:search-rounded"
                  sx={{ color: 'text.secondary' }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </Stack>
  );
};

export default KanbanBoardsHeader;
