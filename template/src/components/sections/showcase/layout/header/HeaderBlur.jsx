import { Box } from '@mui/material';

const HeaderBlur = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.appBar,
        top: 0,
        left: 0,
        width: 1,
        height: 152,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Box sx={{ position: 'relative', width: 1, height: 1 }}>
        {[
          ['0%', '12.5%', '25%', '37.5%', 0.5],
          ['12.5%', '25%', '37.5%', '50%', 0.6],
          ['25%', '37.5%', '50%', '62.5%', 1.25],
          ['37.5%', '50%', '62.5%', '75%', 2.25],
          ['50%', '62.5%', '75%', '87.5%', 4.5],
          ['62.5%', '75%', '87.5%', '100%', 9],
          ['75%', '87.5%', '100%', '100%', 18],
          ['87.5%', '100%', '100%', '100%', 36],
        ].map(([start, mid1, mid2, end, blur], i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: i + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,0) ${start}, rgba(0,0,0,1) ${mid1}, rgba(0,0,0,1) ${mid2}, rgba(0,0,0,0) ${end})`,
              maskImage: `linear-gradient(to top, rgba(0,0,0,0) ${start}, rgba(0,0,0,1) ${mid1}, rgba(0,0,0,1) ${mid2}, rgba(0,0,0,0) ${end})`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeaderBlur;
