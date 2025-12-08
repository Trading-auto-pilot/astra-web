import { useNavigate } from 'react-router';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useThemeMode } from 'hooks/useThemeMode';
import { useFileManager } from 'providers/FileManagerProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import FMDropdownMenu from 'components/sections/file-manager/common/FMDropdownMenu';
import { getFileSize, getThumbnail } from 'components/sections/file-manager/common/helpers';

const FileRowItem = ({ file, mediaIndex, openLightbox }) => {
  const { fileManagerDispatch, selectedFiles } = useFileManager();
  const navigate = useNavigate();
  const { isDark } = useThemeMode();

  const isSelected = selectedFiles.some((selectedFile) => selectedFile.id === file.id);

  const handleSelect = () => {
    if (isSelected) {
      fileManagerDispatch({ type: 'DESELECT_FILE', payload: file });
    } else {
      fileManagerDispatch({ type: 'SELECT_FILE', payload: file });
    }
  };

  const handleClick = () => {
    if (mediaIndex !== undefined) openLightbox(mediaIndex);
  };

  return (
    <TableRow key={file.id}>
      <TableCell padding="checkbox">
        <Checkbox color="primary" checked={isSelected} onChange={handleSelect} />
      </TableCell>
      <TableCell component="th" scope="row">
        <Stack
          spacing={2.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Stack
            component="figure"
            onClick={file.type === 'folder' ? undefined : handleClick}
            onDoubleClick={
              file.type === 'folder'
                ? () => navigate(paths.fileManagerFolder(file.id.toString()))
                : undefined
            }
            sx={{
              cursor: 'pointer',
              m: 0,
              height: 40,
              width: 40,
              borderRadius: 1,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {file.extension ? (
              getThumbnail(file, 32, 'grey.500')
            ) : (
              <IconifyIcon
                icon="material-symbols:folder-outline-rounded"
                sx={{
                  fontSize: 32,
                  color:
                    file.color || file.color !== ''
                      ? file.color
                      : isDark
                        ? 'grey.500'
                        : 'neutral.light',
                }}
              />
            )}
          </Stack>
          <Typography
            onClick={file.type === 'folder' ? undefined : handleClick}
            onDoubleClick={
              file.type === 'folder'
                ? () => navigate(paths.fileManagerFolder(file.id.toString()))
                : undefined
            }
            sx={{
              fontWeight: 500,
              display: 'inline-block',
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {file.name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        {file.type === 'folder' ? 'Folder' : file.extension && file.extension.toUpperCase()}
      </TableCell>

      <TableCell align="center">
        <Button
          shape="square"
          size="small"
          color="neutral"
          disableRipple
          onClick={() =>
            fileManagerDispatch({
              type: 'TOGGLE_FAVORITE',
              payload: file.id,
            })
          }
          sx={{ bgcolor: 'transparent !important', minWidth: 'fit-content' }}
        >
          <IconifyIcon
            icon="material-symbols:star-rate-rounded"
            sx={{
              fontSize: 18,
              color: file.favorite ? 'warning.main' : 'background.elevation4',
            }}
          />
        </Button>
      </TableCell>

      <TableCell align="left">
        <AvatarGroup
          max={5}
          color="primary"
          sx={{
            display: 'inline-flex',
            mr: 1,
            [`& .${avatarClasses.root}`]: {
              width: file.shared.length > 5 ? 24 : 32,
              height: file.shared.length > 5 ? 24 : 32,
              fontSize: 9.6,
              fontWeight: 600,
              backgroundColor: 'primary.main',
            },
          }}
        >
          {file.shared.map((share) => (
            <Tooltip title={share.user.name} key={share.user.id}>
              <Avatar alt={share.user.name} src={share.user.avatar} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </TableCell>

      <TableCell align="left">{dayjs(file.modifiedAt).format('MMM D, YYYY, h:mm A')}</TableCell>
      <TableCell align="left">
        {file.type === 'folder' ? `${file.files?.length} Items` : getFileSize(file)}
      </TableCell>
      <TableCell align="center">
        <FMDropdownMenu />
      </TableCell>
    </TableRow>
  );
};

export default FileRowItem;
