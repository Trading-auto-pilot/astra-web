import { memo, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { fileStructure } from 'data/file-manager';
import { getFileExtension, getFileIcon } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const getTreeBranchStyles = (level, isLastItem) => {
  if (level === 0) return {};

  const baseLeft = `${level * 24}px`;

  return {
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      left: baseLeft,
      top: -8,
      width: '1px',
      height: isLastItem ? '20px' : 'calc(100% + 8px)',
      bgcolor: 'divider',
      zIndex: 10,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      left: baseLeft,
      top: 0,
      width: 12,
      height: 20,
      borderBottom: '1px solid',
      borderLeft: '1px solid',
      borderColor: 'divider',
      borderBottomLeftRadius: 8,
      zIndex: 10,
    },
  };
};

const FileIcon = memo(({ type, icon, fileName }) => (
  <ListItemIcon sx={{ minWidth: 24 }}>
    {type === 'section' ? (
      <IconifyIcon icon={icon || 'material-symbols:share-outline'} />
    ) : type === 'folder' ? (
      <IconifyIcon icon={icon || 'material-symbols:folder-outline-rounded'} />
    ) : (
      <IconifyIcon icon={getFileIcon(getFileExtension(fileName || ''))} />
    )}
  </ListItemIcon>
));

const FileListItem = memo(({ item, level, isLastItem, openFolders, onToggleFolder }) => {
  const isFolder = item.type === 'folder';
  const newItemsCount = useMemo(
    () => (isFolder ? item.children?.filter((child) => child.status === 'new').length : 0),
    [isFolder, item.children],
  );

  return (
    <Box sx={getTreeBranchStyles(level, isLastItem)}>
      <ListItemButton
        onClick={() => isFolder && onToggleFolder(item.name)}
        sx={{
          pl: level === 0 ? 2 : 2 + level * 3,
          position: 'relative',
          zIndex: 2,
          '&:hover': {
            bgcolor: (theme) => theme.vars.palette.background.elevation2,
          },
        }}
      >
        <FileIcon type={item.type} icon={item.icon} fileName={item.name} />
        <ListItemText
          primary={
            <Stack spacing={1} alignItems="center">
              <Stack spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 'caption.fontSize', color: 'text.primary' }}>
                  {item.name}
                </Typography>
                {item.status === 'new' && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                    }}
                  />
                )}
              </Stack>

              {newItemsCount > 0 && <Chip label={newItemsCount} size="small" color="info" />}
            </Stack>
          }
        />
        {isFolder && (
          <IconifyIcon
            icon={
              openFolders[item.name]
                ? 'material-symbols:keyboard-arrow-up-rounded'
                : 'material-symbols:keyboard-arrow-down-rounded'
            }
            fontSize={12}
          />
        )}
      </ListItemButton>
      {isFolder && (
        <Collapse in={openFolders[item.name]} timeout="auto" unmountOnExit>
          <FileList
            items={item.children || []}
            level={level + 1}
            openFolders={openFolders}
            onToggleFolder={onToggleFolder}
          />
        </Collapse>
      )}
    </Box>
  );
});

const FileList = memo(({ items, level = 0, openFolders, onToggleFolder }) => (
  <List dense disablePadding sx={{ position: 'relative' }}>
    {items.map((item, index) => (
      <FileListItem
        key={item.name}
        item={item}
        level={level}
        isLastItem={index === items.length - 1}
        openFolders={openFolders}
        onToggleFolder={onToggleFolder}
      />
    ))}
  </List>
));

const DriveNavigation = ({ handleDrawer }) => {
  const { up } = useBreakpoints();
  const [openFolders, setOpenFolders] = useState({
    [fileStructure.find((item) => item.type === 'folder')?.name || '']: true,
  });

  const upMd = up('md');

  const handleToggleFolder = useCallback((name) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return (
    <Stack direction="column" gap={1} sx={{ pt: { xs: 3, md: 5 }, pb: 3 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          My Files
        </Typography>

        {!upMd && (
          <Button
            variant="text"
            size="small"
            color="neutral"
            shape="circle"
            onClick={() => handleDrawer(false)}
          >
            <IconifyIcon icon="material-symbols:close-rounded" fontSize={18} />
          </Button>
        )}
      </Stack>
      <Box sx={{ flex: 1, px: 2 }}>
        <FileList
          items={fileStructure}
          openFolders={openFolders}
          onToggleFolder={handleToggleFolder}
        />
      </Box>
    </Stack>
  );
};

export default DriveNavigation;
