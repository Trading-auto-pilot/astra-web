import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea, { cardActionAreaClasses } from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cssVarRgba } from 'lib/utils';
import { useFileManager } from 'providers/FileManagerProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import FMDropdownMenu from 'components/sections/file-manager/common/FMDropdownMenu';
import { getFileSize, getThumbnail } from 'components/sections/file-manager/common/helpers';

const FileGridItem = ({ file, mediaIndex, openLightbox }) => {
  const { fileManagerDispatch, selectedFiles } = useFileManager();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSelected = selectedFiles.some((selectedFile) => selectedFile.id === file.id);

  const handleClick = (event) => {
    event.stopPropagation();
    if (isSelected) fileManagerDispatch({ type: 'DESELECT_FILE', payload: file });
    else fileManagerDispatch({ type: 'SELECT_FILE', payload: file });
  };

  const handleFavoriteChange = (event) => {
    event.stopPropagation();
    fileManagerDispatch({ type: 'TOGGLE_FAVORITE', payload: file.id });
  };

  const handleCardClick = () => {
    if (!isMenuOpen && mediaIndex !== undefined) openLightbox(mediaIndex);
  };

  return (
    <Card
      role="button"
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ borderRadius: 4, position: 'relative', border: '0 !important' }}
    >
      <CardActionArea
        disableRipple
        onClick={file.type === 'folder' ? undefined : handleCardClick}
        onDoubleClick={
          file.type === 'folder'
            ? () => navigate(paths.fileManagerFolder(file.id.toString()))
            : undefined
        }
        sx={{
          '&:hover': {
            bgcolor: 'background.elevation1',
            [`& .${cardActionAreaClasses.focusHighlight}`]: {
              opacity: 0,
            },
          },
        }}
      >
        <Stack
          component="figure"
          sx={[
            {
              m: 0,
              aspectRatio: 1.27,
              width: 1,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              bgcolor: 'background.elevation1',
              '& > img, & > svg, & > video': {
                transition: 'transform 0.3s ease-in-out',
              },
            },
            isHovered && {
              '& > img, & > svg, & > video': {
                transform: 'scale(1.1)',
              },
            },
          ]}
        >
          {file.extension ? (
            getThumbnail(file, 88, 'grey.500')
          ) : (
            <IconifyIcon
              icon="material-symbols:folder-outline-rounded"
              sx={{
                fontSize: 80,
                color: file.color || file.color !== '' ? file.color : 'grey.500',
              }}
            />
          )}
          {file.extension === 'mp4' && (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={[
                {
                  position: 'absolute',
                  left: '50%',
                  width: 36,
                  height: 36,
                  borderRadius: 99,
                  transform: 'translate(-50%, 0)',
                  bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.whiteChannel, 0.15),
                  color: (theme) => theme.vars.palette.common.white,
                  transition: 'background-color 0.3s ease-in-out',
                },
                isHovered && {
                  bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.whiteChannel, 0.3),
                },
              ]}
            >
              <IconifyIcon
                icon="material-symbols:play-arrow-outline-rounded"
                sx={{ fontSize: 20, textAlign: 'center' }}
              />
            </Stack>
          )}

          <Checkbox
            checked={isSelected}
            onClick={handleClick}
            sx={{ position: 'absolute', top: 16, left: 7 }}
          />
        </Stack>

        <CardContent component={Stack} direction="column" gap={2} sx={{ p: 2 }}>
          <Stack gap={2} sx={{ alignItems: 'center' }}>
            <Box
              component="div"
              role="button"
              onClick={handleFavoriteChange}
              sx={{
                bgcolor: 'transparent !important',
                minWidth: 18,
                height: 18,
                width: 18,
              }}
            >
              <IconifyIcon
                icon="material-symbols:star-rate-rounded"
                sx={{
                  width: 1,
                  height: 1,
                  color: file.favorite ? 'warning.main' : 'background.elevation4',
                }}
              />
            </Box>

            <Stack direction="column" gap={1} sx={{ alignItems: 'flex-start', overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: 'block',
                  color: 'text.primary',
                  fontWeight: 700,
                  maxWidth: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.name}
              </Typography>
              <Typography
                component={Stack}
                variant="caption"
                gap={1}
                divider={
                  <Divider
                    component="hr"
                    flexItem
                    orientation="vertical"
                    sx={{ height: 8, alignSelf: 'center' }}
                  />
                }
                sx={[
                  {
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  },
                  file.type === 'folder' && { textTransform: 'capitalize' },
                ]}
              >
                <Box component="span">
                  {file.type === 'folder' ? `${file.files?.length} Items` : getFileSize(file)}
                </Box>
                <Box component="span">{file.type === 'folder' ? file.type : file.extension}</Box>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>

      <FMDropdownMenu
        variant="soft"
        sx={{
          visibility: isHovered ? 'visible' : 'hidden',
          position: 'absolute',
          top: 16,
          right: 16,
          borderRadius: 1,
        }}
        onMenuToggle={(open) => setIsMenuOpen(open)}
      />
    </Card>
  );
};

export default FileGridItem;
