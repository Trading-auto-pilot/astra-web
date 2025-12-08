import { Box } from '@mui/material';
import GradientDivider from '../../common/GradientDivider';

const GridPattern = () => {
  return (
    <Box sx={{ position: 'absolute', inset: 4 }}>
      <GradientDivider
        gradient={`linear-gradient(to right, transparent 0%,#ffffff50 50%,transparent 100%)`}
        thickness="2px"
        sx={{
          width: '150%',
          position: 'absolute',
          zIndex: 10,
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <GradientDivider
        gradient={`linear-gradient(to right, transparent 0%,#ffffff30 50%,transparent 100%)`}
        thickness="2px"
        sx={{
          width: '150%',
          position: 'absolute',
          zIndex: 10,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <GradientDivider
        gradient={`linear-gradient(to bottom, transparent 0%,#ffffff30 50%,transparent 100%)`}
        thickness="2px"
        orientation="vertical"
        sx={{
          height: '170%',
          position: 'absolute',
          zIndex: 10,
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <GradientDivider
        gradient={`linear-gradient(to bottom, transparent 0%,#ffffff30 50%,transparent 100%)`}
        thickness="2px"
        orientation="vertical"
        sx={{
          height: '170%',
          position: 'absolute',
          zIndex: 10,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <GradientDivider
        gradient={`linear-gradient(to bottom, transparent 0%,#ffffff30 50%,transparent 100%)`}
        thickness="2px"
        orientation="vertical"
        sx={{
          height: '170%',
          position: 'absolute',
          zIndex: 10,
          left: '30%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </Box>
  );
};

export default GridPattern;
