import { Paper } from '@mui/material';

const InfoCard = ({ sx, setOpen, onClick, children, ...props }) => {
  return (
    <Paper
      {...props}
      variant="elevation"
      background={1}
      elevation={0}
      role="button"
      onClick={() => {
        if (setOpen) {
          setOpen(true);
        } else {
          onClick?.();
        }
      }}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        px: 3,
        py: 2,
        border: '0 !important',
        ...sx,
        ...(setOpen || onClick
          ? {
              '&:hover': {
                cursor: 'pointer',
                bgcolor: 'background.elevation2',
                '& .iconify': {
                  visibility: 'visible',
                },
              },
            }
          : {}),
      }}
    >
      {children}
    </Paper>
  );
};

export default InfoCard;
