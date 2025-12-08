import { useFormContext } from 'react-hook-form';
import { Paper, Stack } from '@mui/material';
import * as yup from 'yup';
import FileDropZone from 'components/base/FileDropZone';

export const mediaFilesFormSchema = yup.object({
  images: yup
    .array()
    .of(
      yup
        .object({
          id: yup.string().required('This field is required'),
          file: yup.mixed().required('File is required'),
        })
        .required(),
    )
    .min(1, 'Upload at least 1 media file')
    .required(),
});

const MediaFiles = () => {
  const {
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext();

  const images = watch('images');

  const onDrop = (acceptedFiles) => {
    const files = acceptedFiles.map((file) => ({
      id: file.name,
      file,
    }));

    setValue('images', [...(images || []), ...files]);
    trigger('images');
  };

  const removeImage = (index) => {
    setValue(
      'images',
      images.filter((_, i) => i !== index),
    );
    trigger('images');
  };

  return (
    <Paper background={1} sx={{ p: 3, borderRadius: 6, outline: 'none' }}>
      <Stack
        direction="column"
        sx={{
          rowGap: 3,
        }}
      >
        <FileDropZone
          accept={{
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'video/*': ['.mp4', '.mov'],
          }}
          onDrop={onDrop}
          onRemove={removeImage}
          defaultFiles={images.map((image) => image.file)}
          error={errors.images?.message}
          previewType="thumbnail"
        />
      </Stack>
    </Paper>
  );
};

export default MediaFiles;
