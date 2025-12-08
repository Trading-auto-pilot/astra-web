import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useKanbanContext } from 'providers/KanbanProvider';
import BoardThemeOptionsDialog from './BoardThemeOptionsDialog';

const BoardTheme = () => {
  const { kanbanBoard } = useKanbanContext();
  const { backgroundOption } = kanbanBoard;
  const { up } = useBreakpoints();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const upXl = up('xl');

  return (
    <>
      <Stack
        spacing={1}
        sx={{
          py: 1.25,
          px: { xs: 0.75, xl: 2 },
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <Tooltip title="Theme" disableHoverListener={upXl ? true : false}>
          <Box
            sx={[
              {
                height: 24,
                width: 24,
                border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                borderRadius: 50,
              },
              backgroundOption.type === 'image' && {
                backgroundImage: `url('${backgroundOption.background}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              },
              backgroundOption.type === 'color' && {
                background: backgroundOption.background,
              },
            ]}
          />
        </Tooltip>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, display: { xs: 'none', xl: 'flex' } }}
        >
          Theme
        </Typography>
      </Stack>

      <BoardThemeOptionsDialog open={isDialogOpen} handleClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default BoardTheme;
