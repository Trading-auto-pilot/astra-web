import Box from '@mui/material/Box';

const Video = ({ src, type = 'video/webm', srcProps, ...props }) => {
  return (
    <Box component="video" {...props}>
      <source src={src} type={type} {...srcProps} />
    </Box>
  );
};

export default Video;
