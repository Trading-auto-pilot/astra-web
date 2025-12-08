import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

const ChartLegend = ({ state, label, color, onToggle }) => {
  return (
    <ButtonBase
      key={label}
      disableRipple
      onClick={() => onToggle(label)}
      sx={{
        alignItems: 'flex-start',
        flexDirection: 'column',
        opacity: state[label] ? 0.5 : 1,
      }}
    >
      <Box
        sx={{
          mb: 1,
          width: 16,
          height: 8,
          bgcolor: color,
          borderRadius: 0.5,
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{
          textOverflow: 'ellipsis',
          maxWidth: 1,
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
};

export default ChartLegend;
