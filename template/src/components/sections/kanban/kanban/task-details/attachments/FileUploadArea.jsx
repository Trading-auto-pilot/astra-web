import { useFormContext } from 'react-hook-form';
import FileDropZone from 'components/base/FileDropZone';

const FileUploadArea = () => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const files = watch('attachments') || [];

  const onDrop = (acceptedFiles) => {
    const uploadedFiles = acceptedFiles.map((file) => ({
      id: file.name,
      filename: file.name,
      time: new Date().toISOString().slice(0, 19),
      addedBy: 'Sampro',
      file,
    }));

    setValue('attachments', [...uploadedFiles, ...files], { shouldValidate: true });
  };

  const removeImage = (index) => {
    console.log(index);
    const updatedFiles = files.filter((_, i) => i !== index);
    setValue('attachments', updatedFiles, { shouldValidate: true });
  };

  return (
    <FileDropZone
      accept={{
        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        'video/*': ['.mp4', '.mov'],
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc'],
        'application/zip': ['.zip'],
      }}
      onDrop={onDrop}
      onRemove={removeImage}
      error={errors?.attachments?.message}
      previewType="thumbnail"
      sx={{ px: { xs: 0, md: 2 }, height: { xs: 'auto', md: 60 } }}
    />
  );
};

export default FileUploadArea;
