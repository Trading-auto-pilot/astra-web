import Paper from '@mui/material/Paper';

const SectionWrapper = ({ sx, ...props }) => {
  return (
    <Paper
      component="section"
      sx={[
        {
          padding: { xs: 3, md: 5 },
          height: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export default SectionWrapper;
