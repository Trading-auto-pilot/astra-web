import { useLocation } from 'react-router';
import {
  Box,
  Button,
  Container,
  List,
  Paper,
  Stack,
  Typography,
  listItemClasses,
  listItemTextClasses,
} from '@mui/material';
import { kebabCase } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import AnchorLinkContainer from 'components/base/AnchorLinkContainer';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const DocSection = ({
  children,
  title,
  id,
  description,
  descriptionEl,
  hideTitle,
  titleAdornment,
  badge,
}) => {
  const headerId = id ?? kebabCase(title);
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const { pathname } = useLocation();

  const sectionContent = (
    <Box sx={{ mb: 2 }}>
      {!hideTitle && (
        <ScrollSpyContent id={headerId} sx={{ mb: description || (descriptionEl && 0) }}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1, justifyContent: 'space-between' }}>
            <AnchorLinkContainer hashHref={headerId}>
              <Typography
                variant="h5"
                color={titleAdornment ? 'primary.main' : 'text.primary'}
                sx={{
                  fontWeight: titleAdornment ? 700 : 500,
                  fontSize: { xs: 'h6.fontSize', md: 'h5.fontSize' },
                }}
              >
                {title}
              </Typography>
              {upLg && titleAdornment}
              {badge}
            </AnchorLinkContainer>
            {!pathname.includes('migration') && titleAdornment && (
              <Button size="small" href="/documentation/migration">
                See Migration
              </Button>
            )}
          </Stack>
          {!upLg && titleAdornment}
        </ScrollSpyContent>
      )}
      {descriptionEl}
      {description && (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      {titleAdornment ? (
        <Container maxWidth="md" disableGutters>
          {sectionContent}
          {children}
        </Container>
      ) : (
        <>
          {sectionContent}
          {children}
        </>
      )}
    </Paper>
  );
};

DocSection.componentName = 'DocSection';

export const DocSubtitle = (props) => {
  return (
    <Typography
      variant="subtitle1"
      {...props}
      sx={[
        {
          fontWeight: 600,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

export const DocList = ({ sx, ...rest }) => {
  return (
    <List
      sx={[
        {
          listStyleType: 'disc',
          pl: 2.5,
          py: 0,
          [`& .${listItemClasses.root}`]: {
            display: 'list-item',
            py: 0.5,
            pl: 0.5,
            [`& .${listItemTextClasses.root}`]: {
              color: 'text.secondary',
              my: 0,
              py: 0.5,
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      dense
      {...rest}
    />
  );
};

export default DocSection;
