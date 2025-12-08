import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  checkboxClasses,
  paperClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const ImagesDialog = ({ open, handleClose, field, handleUpdateImages }) => {
  const [selectedimages, setSelectedimages] = useState([]);
  const { watch } = useFormContext();

  const productImages = watch('images');

  const handleImageCheck = (imageId) => {
    if (selectedimages.includes(imageId)) {
      setSelectedimages(selectedimages.filter((item) => item !== imageId));
    } else {
      setSelectedimages([...selectedimages, imageId]);
    }
  };

  const handleSave = () => {
    const images = productImages.filter((image) => selectedimages.includes(image.id));
    handleUpdateImages(images);
    handleClose();
  };

  useEffect(() => {
    const images = field.images.map((image) => image.id);
    setSelectedimages(images);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        [`& .${paperClasses.root}`]: {
          borderRadius: 6,
          p: 5,
          width: 1,
          maxWidth: 545,
        },
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2 }}>Select the related photos</DialogTitle>
      <DialogContent sx={{ p: 0, mb: 5 }}>
        <Stack
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            position: 'relative',
          }}
        >
          {productImages.map((image, i) => {
            return (
              <FormControlLabel
                key={`image-${i}`}
                sx={{
                  ml: 0,
                  mr: 0,
                  [`& .${checkboxClasses.root}`]: {
                    display: 'none',
                  },
                }}
                control={
                  <Checkbox
                    checked={selectedimages.includes(image.id)}
                    onChange={() => handleImageCheck(image.id)}
                  />
                }
                label={
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: 'background.elevation1',
                      position: 'relative',
                      cursor: 'pointer',
                      border: 1,
                      borderStyle: 'solid',
                      borderColor: selectedimages.includes(image.id)
                        ? 'primary.main'
                        : 'transparent',
                    }}
                  >
                    <Image
                      src={URL.createObjectURL(image.file)}
                      alt={`preview ${i}`}
                      sx={{
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                      }}
                    />
                    {selectedimages.includes(image.id) && (
                      <IconifyIcon
                        icon="material-symbols:check-circle-rounded"
                        sx={{
                          position: 'absolute',
                          right: 4,
                          top: 4,
                          color: 'primary.main',
                        }}
                      />
                    )}
                  </Box>
                }
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0, justifyContent: 'flex-start' }}>
        <Button variant="contained" sx={{ minWidth: 96 }} onClick={handleSave}>
          Save
        </Button>
        <Button
          color="neutral"
          onClick={() => {
            setSelectedimages([]);
          }}
          autoFocus
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImagesDialog;
