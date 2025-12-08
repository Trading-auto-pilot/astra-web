import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDropZone from 'components/base/FileDropZone';
import IconifyIcon from 'components/base/IconifyIcon';
import ApplicationFormSection from '../common/ApplicationFormSection';

const VideoResponses = () => {
  return (
    <ApplicationFormSection name="Video Responses">
      <Stack direction="column" gap={3}>
        <StrengthsAndWeaknesses />
        <ApplyingReason />
      </Stack>
    </ApplicationFormSection>
  );
};

export default VideoResponses;

const StrengthsAndWeaknesses = () => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const strengthsAndWeaknesses = watch('questionaries.videoResponse.strengthsAndWeaknesses') || [];
  const onDrop = (acceptedFiles) => {
    const files = acceptedFiles.map((file) => ({
      id: file.name,
      file,
    }));

    setValue('questionaries.videoResponse.strengthsAndWeaknesses', [
      ...(strengthsAndWeaknesses || []),
      ...files,
    ]);
    trigger('questionaries.videoResponse.strengthsAndWeaknesses');
  };

  const removeVideo = (index) => {
    setValue(
      'questionaries.videoResponse.strengthsAndWeaknesses',
      strengthsAndWeaknesses.filter((_, i) => i !== index),
    );
    trigger('questionaries.videoResponse.strengthsAndWeaknesses');
  };

  return (
    <div>
      <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
        1. What are your strengths and weaknesses?
      </Typography>
      <Stack direction="column" gap={2}>
        <FileDropZone
          accept={{
            'video/*': ['.mp4', '.mov', '.mkv'],
          }}
          icon="material-symbols:play-circle-rounded"
          onDrop={onDrop}
          onRemove={removeVideo}
          defaultFiles={strengthsAndWeaknesses.map((video) => video.file)}
          error={errors.questionaries?.videoResponse?.strengthsAndWeaknesses?.message}
          previewType="thumbnail"
          sx={{ height: 180, maxWidth: 'max-content' }}
        />
        <Stack gap={1}>
          <Box sx={{ flexShrink: 0 }}>
            <IconifyIcon
              icon="material-symbols:info-outline-rounded"
              sx={{ fontSize: 16, color: 'info.main' }}
            />
          </Box>
          <Typography variant="body2" color="info" fontWeight={500}>
            Upload a video (MP4, MOV, or AVI format, up to 100MB in size). Recommended length: 1
            min.
          </Typography>
        </Stack>
      </Stack>
    </div>
  );
};

const ApplyingReason = () => {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const applyingReason = watch('questionaries.videoResponse.applyingReason') || [];
  const onDrop = (acceptedFiles) => {
    const files = acceptedFiles.map((file) => ({
      id: file.name,
      file,
    }));

    setValue('questionaries.videoResponse.applyingReason', [...(applyingReason || []), ...files]);
    trigger('questionaries.videoResponse.applyingReason');
  };

  const removeVideo = (index) => {
    setValue(
      'questionaries.videoResponse.applyingReason',
      applyingReason.filter((_, i) => i !== index),
    );
    trigger('questionaries.videoResponse.applyingReason');
  };

  return (
    <div>
      <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
        2. Why did you choose to apply to this company?
      </Typography>
      <Stack direction="column" gap={2}>
        <FileDropZone
          accept={{
            'video/*': ['.mp4', '.mov', '.mkv'],
          }}
          icon="material-symbols:play-circle-rounded"
          onDrop={onDrop}
          onRemove={removeVideo}
          defaultFiles={applyingReason.map((video) => video.file)}
          error={errors.questionaries?.videoResponse?.applyingReason?.message}
          previewType="thumbnail"
          sx={{ height: 180, maxWidth: 'max-content' }}
        />
        <Stack gap={1}>
          <Box sx={{ flexShrink: 0 }}>
            <IconifyIcon
              icon="material-symbols:info-outline-rounded"
              sx={{ fontSize: 16, color: 'info.main' }}
            />
          </Box>
          <Typography variant="body2" color="info" fontWeight={500}>
            Upload a video (MP4, MOV, or AVI format, up to 100MB in size). Recommended length: 1
            min.
          </Typography>
        </Stack>
      </Stack>
    </div>
  );
};
