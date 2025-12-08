import { Breadcrumbs, Link, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import docHeaderBg from 'assets/images/illustrations/6.webp';
import IconifyIcon from 'components/base/IconifyIcon';

const DocPageHeader = (props) => {
  const { breadcrumbs, title, docLink, docLinkLabel, description, descriptionEl, folderLink } =
    props;

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        borderBottom: 1,
        borderColor: 'divider',
        outline: 0,
        '::before': {
          content: '""',
          position: 'absolute',
          display: { xs: 'none', sm: 'unset' },
          top: '-30%',
          right: '6%',
          width: 190,
          height: '150%',
          backgroundImage: { xs: undefined, md: `url(${docHeaderBg})` },
          opacity: 0.6,
          backgroundSize: 'contain',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat',
          transform: 'rotate(20deg)',
          transformOrigin: 'center',
          pointerEvents: 'none',
          zIndex: -1,
        },
      }}
    >
      <Grid container>
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          {breadcrumbs && (
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              {breadcrumbs.slice(0, breadcrumbs.length - 1).map((breadcrumb) => (
                <Link href={breadcrumb.url} key={breadcrumb.label}>
                  {breadcrumb.label}
                </Link>
              ))}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {breadcrumbs[breadcrumbs.length - 1].label}
              </Typography>
            </Breadcrumbs>
          )}
          <Typography
            variant="h3"
            sx={{ mb: folderLink || docLink ? 1 : description || descriptionEl ? 2 : 0 }}
          >
            {title}
          </Typography>
          {(folderLink || docLink) && (
            <Stack
              sx={{
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: description || descriptionEl ? 2 : 0,
              }}
            >
              {folderLink && (
                <Stack
                  sx={{
                    gap: 0.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <IconifyIcon
                    icon="material-symbols:folder-outline"
                    fontSize={16}
                    color="text.disabled"
                    sx={{ flexShrink: 0 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.disabled',
                      fontWeight: 500,
                      wordBreak: 'break-all',
                      hyphens: 'auto',
                      lineHeight: 1.1,
                    }}
                  >
                    {folderLink}
                  </Typography>
                </Stack>
              )}
              {docLink && (
                <Link
                  href={docLink}
                  variant="body2"
                  target="_blank"
                  sx={{
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {docLinkLabel ? docLinkLabel : `${title} on MUI`}
                  <IconifyIcon icon="material-symbols:open-in-new-rounded" />
                </Link>
              )}
            </Stack>
          )}
          {description && (
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
              }}
            >
              {description}
            </Typography>
          )}
          {descriptionEl}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DocPageHeader;
