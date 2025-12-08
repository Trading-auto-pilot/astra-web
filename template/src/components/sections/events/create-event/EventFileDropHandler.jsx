import { useFormContext } from 'react-hook-form';
import FileDropBox from 'components/base/FileDropBox';

const EventFileDropHandler = ({ imagesField }) => {
  const { watch, setValue } = useFormContext();

  const sectionImages = watch(imagesField) || [];

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({ id: file.name, file }));
    setValue(imagesField, [...sectionImages, ...newFiles]);
  };

  const handleRemove = (index) => {
    const updatedImages = sectionImages.filter((_, i) => i !== index);
    setValue(imagesField, updatedImages);
  };

  return (
    <FileDropBox
      onDrop={handleDrop}
      accept={{
        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        'video/*': ['.mp4', '.mov'],
      }}
      onRemove={handleRemove}
      defaultFiles={sectionImages.map((image) => image.file)}
    />
  );
};

export default EventFileDropHandler;
