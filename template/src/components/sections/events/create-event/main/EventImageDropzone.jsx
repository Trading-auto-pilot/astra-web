import { useFormContext } from 'react-hook-form';
import { Paper, Typography } from '@mui/material';
import FileDropZone from 'components/base/FileDropZone';

const EventImageDropzone = () => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const eventImages = watch('eventImages');

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({ id: file.name, file }));
    setValue('eventImages', [...(eventImages || []), ...newFiles]);
    trigger('eventImages');
  };

  const handleRemove = (index) => {
    const updatedImages = eventImages.filter((_, i) => i !== index);
    setValue('eventImages', updatedImages);
    trigger('eventImages');
  };

  return (
    <Paper background={1} sx={{ p: 3, borderRadius: 6, outline: 0 }}>
      <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 700 }}>
        Event cover photo
      </Typography>
      <FileDropZone
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
          'video/*': ['.mp4', '.mov'],
        }}
        previewType="thumbnail"
        onDrop={handleDrop}
        onRemove={handleRemove}
        defaultFiles={eventImages.map((image) => image.file)}
        error={errors.eventImages?.message}
      />
    </Paper>
  );
};

export default EventImageDropzone;
