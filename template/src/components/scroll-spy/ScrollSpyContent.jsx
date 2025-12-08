import { Box } from '@mui/material';
import { useScrollSpyContext } from '.';

export const ScrollSpyContent = ({ id, children, offset, ...rest }) => {
  const { sectionRefs } = useScrollSpyContext();

  return (
    <Box
      id={id}
      ref={(el) => {
        sectionRefs.current[id] = { element: el, offset };
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

ScrollSpyContent.componentName = 'ScrollSpyContent';
export default ScrollSpyContent;
