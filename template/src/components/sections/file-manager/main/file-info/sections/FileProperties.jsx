import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { getFileSize } from 'components/sections/file-manager/common/helpers';

const FileProperty = ({ property, value }) => {
  return (
    <Stack gap={1} sx={{ alignItems: 'center' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, minWidth: 110 }}>
        {property}
      </Typography>
      :
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {value}
      </Typography>
    </Stack>
  );
};

const FileProperties = ({ file }) => {
  return (
    <Paper background={1} sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" gap={3}>
        <Typography variant="h6">Properties</Typography>
        <Stack direction="column" gap={2}>
          <FileProperty property="Name" value={file.name} />
          <FileProperty
            property="Type"
            value={file.extension ? file.extension.toLowerCase() : 'Folder'}
          />
          <FileProperty property="Saved in" value={dayjs(file.savedIn).format('D MMM, YYYY')} />
          <FileProperty property="Size" value={getFileSize(file)} />
          <FileProperty property="Storage used" value={getFileSize(file)} />
          <FileProperty property="Location" value={file.location} />
          <FileProperty
            property="Modified"
            value={dayjs(file.modifiedAt).format('D MMM, YYYY, h:mm A')}
          />
          <FileProperty property="Opened" value={dayjs(file.openedAt).format('D MMM, YYYY')} />
          <FileProperty property="Created" value={dayjs(file.createdAt).format('D MMM, YYYY')} />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FileProperties;
