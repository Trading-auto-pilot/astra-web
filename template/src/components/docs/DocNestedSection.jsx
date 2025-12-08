import { Box, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';
import AnchorLinkContainer from 'components/base/AnchorLinkContainer';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const DocNestedSection = ({ title, children, titleEl, id, ...rest }) => {
  return (
    <Box {...rest}>
      <ScrollSpyContent id={kebabCase(id ?? title)}>
        {titleEl ? (
          titleEl
        ) : (
          <AnchorLinkContainer hashHref={kebabCase(title)} sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
          </AnchorLinkContainer>
        )}
      </ScrollSpyContent>

      {children}
    </Box>
  );
};

DocNestedSection.componentName = 'DocNestedSection';

export default DocNestedSection;
