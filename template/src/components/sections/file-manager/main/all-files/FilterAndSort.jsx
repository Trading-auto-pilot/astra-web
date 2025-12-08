import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useFileManager } from 'providers/FileManagerProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const FilterAndSort = () => {
  const { fileManagerDispatch, filter, viewMode, sort } = useFileManager();
  const [tab, setTab] = useState(filter);

  const handleFilterChange = (event, newValue) => {
    fileManagerDispatch({ type: 'SET_FILTER', payload: newValue });
    setTab(newValue);
  };
  const handleSortChange = (event) => {
    fileManagerDispatch({ type: 'SET_SORT_BY', payload: event.target.value });
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, mb: 3 }}>
      <Stack
        flexWrap="wrap"
        sx={{
          flex: 1,
          width: 1,
          overflowX: 'hidden',
          gridColumn: { xs: 'span 8', sm: 'span 6', md: 'span 8', lg: 'span 6' },
          order: { xs: 1, sm: 0, md: 1, lg: 0 },
        }}
      >
        <Tabs value={tab} onChange={handleFilterChange} variant="scrollable" scrollButtons={false}>
          <Tab label="All Files" value="all" />
          <Tab label="Recent" value="recent" />
          <Tab label="Folder" value="folder" />
          <Tab label="Favorite" value="favorite" />
          <Tab label="Shared" value="shared" />
        </Tabs>
      </Stack>
      <Stack
        gap={1}
        sx={{
          width: { xs: 1, sm: 'max-content', md: 1, lg: 'max-content' },
          gridColumn: { xs: 'span 8', sm: 'span 2', md: 'span 8', lg: 'span 2' },
          justifySelf: { xs: 'flex-start', sm: 'flex-end', md: 'flex-start', lg: 'flex-end' },
        }}
      >
        <StyledTextField
          select
          fullWidth
          value={sort}
          onChange={handleSortChange}
          sx={{ maxWidth: { xs: 160, xl: 180 } }}
        >
          <MenuItem value="none">Sort by - None</MenuItem>
          <MenuItem value="name">Sort by - Name</MenuItem>
          <MenuItem value="size">Sort by - Size</MenuItem>
          <MenuItem value="modified">Sort by - Modified</MenuItem>
          <MenuItem value="created">Sort by - Created</MenuItem>
        </StyledTextField>

        <Button
          shape="square"
          variant={viewMode === 'grid' ? 'contained' : 'soft'}
          color={viewMode === 'grid' ? 'primary' : 'neutral'}
          onClick={() => {
            fileManagerDispatch({ type: 'VIEW_MODE', payload: 'grid' });
          }}
          sx={{ ml: 'auto' }}
        >
          <IconifyIcon icon="material-symbols:grid-view-outline-rounded" sx={{ fontSize: 20 }} />
        </Button>

        <Button
          shape="square"
          variant={viewMode === 'list' ? 'contained' : 'soft'}
          color={viewMode === 'list' ? 'primary' : 'neutral'}
          onClick={() => {
            fileManagerDispatch({ type: 'VIEW_MODE', payload: 'list' });
          }}
        >
          <IconifyIcon icon="material-symbols:list-rounded" sx={{ fontSize: 20 }} />
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterAndSort;
