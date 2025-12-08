import { Breadcrumbs, Link, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';

const PageBreadcrumb = ({ items, sx }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ ...sx }}>
      {items.map(({ label, url, active }) => (
        <Typography
          key={kebabCase(label)}
          variant="body2"
          aria-current={active ? 'page' : undefined}
          component={active ? 'span' : Link}
          href={!active ? url : undefined}
          sx={{
            color: active ? 'text.primary' : 'primary.main',
            fontWeight: 'medium',
          }}
        >
          {label}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default PageBreadcrumb;
