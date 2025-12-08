import { Chip, Typography } from '@mui/material';
import { changelog } from 'data/changelogs';
import Logs from 'pages/changelog/Logs';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const ChangelogPage = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Changelog',
      }}
    >
      {changelog.map((log) => (
        <DocSection
          key={log.version}
          title={log.version}
          sideNavLabel={`${log.version} – ${log.title}`}
          titleAdornment={
            <Typography variant="h5" fontWeight={600} sx={{ fontSize: 'h6.fontSize' }}>
              - {log.title}
            </Typography>
          }
          badge={
            log.badgeTitle ? (
              <Chip label={log.badgeTitle} color="warning" size="small" sx={{ ml: 1 }} />
            ) : undefined
          }
          description={log.publish}
        >
          <Logs version={log.version} logs={log.logs} warning={log.warning} />
        </DocSection>
      ))}
    </DocPageLayout>
  );
};

export default ChangelogPage;
