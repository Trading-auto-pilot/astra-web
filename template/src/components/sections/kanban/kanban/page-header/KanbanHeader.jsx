import { InputAdornment } from '@mui/material';
import Button, { buttonClasses } from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { kanbanBoard } from 'data/kanban/kanban';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import BoardMembers from './BoardMembers';
import BoardTheme from './BoardTheme';
import HeaderMenu from './HeaderMenu';
import InviteButton from './InviteButton';
import FilterMenu from './filter-menu/FilterMenu';

const KanbanHeader = () => {
  const { up } = useBreakpoints();
  const upXl = up('xl');
  const upSm = up('sm');

  const handleSearch = (e) => {
    console.log(e.target.value);
  };

  return (
    <Stack
      spacing={{ xs: 1, xl: 2 }}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        py: 1,
        px: { xs: 3, md: 5 },
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Stack spacing={{ xs: 1, xl: 2 }} sx={{ width: { xs: 1, sm: 'auto' }, alignItems: 'center' }}>
        <HeaderMenu />
        <BoardMembers
          members={kanbanBoard.assignee}
          sx={{ ml: { xs: 'auto', sm: 0 } }}
          assigneeType="board"
        />
        <InviteButton />
        <Divider
          orientation="vertical"
          variant="middle"
          sx={{ my: 1.75, display: { xs: 'flex', sm: 'none' } }}
          flexItem
        />
        {!upSm && <BoardTheme />}
      </Stack>

      <Stack
        spacing={1}
        sx={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: { xs: 1, sm: 'auto' },
        }}
      >
        {upSm && <BoardTheme />}
        <FilterMenu />

        <Tooltip title="Export / Import" disableHoverListener={upXl ? true : false}>
          <Button
            variant={upXl ? 'text' : 'soft'}
            color="neutral"
            shape={upXl ? undefined : 'square'}
            startIcon={
              <IconifyIcon
                icon="material-symbols:swap-vertical-circle-outline-rounded"
                sx={{ fontSize: '18px !important' }}
              />
            }
            sx={[
              { flexShrink: 0 },
              !upXl && {
                [`& .${buttonClasses.startIcon}`]: {
                  m: 0,
                },
              },
            ]}
          >
            {upXl && 'Export / Import'}
          </Button>
        </Tooltip>

        <StyledTextField
          id="search-box"
          type="search"
          size="medium"
          placeholder="Search Tasks"
          onChange={handleSearch}
          sx={{ ml: { xl: 1 }, maxWidth: { xs: 1, sm: 300 } }}
          fullWidth
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
    </Stack>
  );
};

export default KanbanHeader;
