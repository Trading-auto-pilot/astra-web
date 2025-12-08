import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Attachment from './Attachment';
import FileUploadArea from './FileUploadArea';

const Attachments = () => {
  const { watch } = useFormContext();
  const attachments = watch('attachments');

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Attachments
      </Typography>
      <Box sx={{ mb: 3 }}>
        {attachments.map((item) => (
          <Attachment key={item.id} data={item} />
        ))}
      </Box>
      <FileUploadArea />
    </Paper>
  );
};

export default Attachments;
