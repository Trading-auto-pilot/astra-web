import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDropZone from 'components/base/FileDropZone';
import IconifyIcon from 'components/base/IconifyIcon';
import ApplicationFormSection from '../common/ApplicationFormSection';

const Resume = () => {
  const {
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext();

  const resume = watch('documents.resume') || [];
  const onDrop = (acceptedFiles) => {
    const files = acceptedFiles.map((file) => ({
      id: file.name,
      file,
    }));

    setValue('documents.resume', [...(resume || []), ...files]);
    trigger('documents.resume');
  };

  const removeImage = (index) => {
    setValue(
      'documents.resume',
      resume.filter((_, i) => i !== index),
    );
    trigger('documents.resume');
  };

  return (
    <ApplicationFormSection name="Resume">
      <Stack direction="column" gap={2}>
        <FileDropZone
          accept={{
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
          }}
          onDrop={onDrop}
          onRemove={removeImage}
          defaultFiles={resume.map((image) => image.file)}
          error={errors.documents?.resume?.message}
          previewType="thumbnail"
          sx={{ height: { xs: 'max-content', sm: 60 } }}
        />
        <Stack gap={1}>
          <Box sx={{ flexShrink: 0 }}>
            <IconifyIcon
              icon="material-symbols:info-outline-rounded"
              sx={{ fontSize: 16, color: 'info.main' }}
            />
          </Box>
          <Typography variant="body2" color="info" fontWeight={500}>
            Documents must be uploaded in PDF, DOC, or DOCX format, and should not exceed 5MB in
            size.
          </Typography>
        </Stack>
      </Stack>
    </ApplicationFormSection>
  );
};

export default Resume;
