import { Box, ButtonBase, Collapse, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const CollapsibleSection = ({ title, isOpen, onToggle, children, ...rest }) => {
  return (
    <Box {...rest}>
      <ButtonBase
        onClick={onToggle}
        sx={{
          width: 1,
          bgcolor: 'background.elevation1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          px: 2,
          borderRadius: 2,
          cursor: 'pointer',
        }}
      >
        <Typography variant="h6">{title}</Typography>

        <IconifyIcon
          icon="material-symbols:keyboard-arrow-down-rounded"
          fontSize={18}
          sx={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </ButtonBase>

      <Collapse in={isOpen}>
        <Stack direction="column" gap={5} sx={{ pt: 3 }}>
          {children}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
