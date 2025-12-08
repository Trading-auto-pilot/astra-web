import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const sizeConversion = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export const convertSize = (size, from = 'KB', to = 'MB') => {
  if (size < 0) throw new Error('Size cannot be negative');

  const sizeInBytes = size * sizeConversion[from];
  const convertedSize = sizeInBytes / sizeConversion[to];

  return `${convertedSize.toFixed(2)} ${to}`;
};

export const getFileSize = (file) => {
  return file.size < 1024
    ? convertSize(file.size, 'KB', 'KB')
    : file.size >= 1024 * 1024
      ? convertSize(file.size, 'KB', 'GB')
      : convertSize(file.size, 'KB', 'MB');
};

export const getThumbnail = (file, fontSize, color) => {
  switch (file.extension) {
    case 'html':
      return <IconifyIcon icon="material-symbols:html-rounded" sx={{ fontSize, color }} />;
    case 'css':
      return <IconifyIcon icon="material-symbols:css-rounded" sx={{ fontSize, color }} />;
    case 'docs':
      return <IconifyIcon icon="material-symbols:docs-outline-rounded" sx={{ fontSize, color }} />;
    case 'pdf':
      return (
        <IconifyIcon
          icon="material-symbols:picture-as-pdf-outline-rounded"
          sx={{ fontSize, color }}
        />
      );
    case 'zip':
      return (
        <IconifyIcon icon="material-symbols:folder-zip-outline-rounded" sx={{ fontSize, color }} />
      );
    case 'mp4':
      return (
        <Box
          component="video"
          src={file.src}
          sx={{ width: 1, aspectRatio: 1, objectFit: 'cover' }}
        />
      );
    default:
      return (
        <Image
          alt=""
          height={1}
          width={1}
          src={file.src}
          sx={{
            objectFit: 'cover',
          }}
        />
      );
  }
};
