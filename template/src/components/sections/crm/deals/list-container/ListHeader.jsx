import { useState } from 'react';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';
import { useDealsContext } from 'providers/DealsProvider';
import { TOGGLE_COMPACT_MODE, UPDATE_LIST_TITLE } from 'reducers/DealsReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import ListMenu from './ListMenu';

const ListHeader = ({ listId, title, totalBudget, compactMode, dealCount }) => {
  const [listTitle, setListTitle] = useState({ isEditing: false, value: title });
  const { listItems, dealsDispatch } = useDealsContext();
  const { currencyFormat } = useNumberFormat();

  const handleBlur = () => {
    setListTitle({ ...listTitle, isEditing: false });

    const isTitleExist = listItems.some((list) => list.title === listTitle.value);

    if (listTitle.value === '' || isTitleExist) {
      setListTitle({ isEditing: false, value: title });
    } else {
      dealsDispatch({
        type: UPDATE_LIST_TITLE,
        payload: { id: listId, title: listTitle.value },
      });
    }
  };

  return (
    <Stack
      sx={[
        {
          px: 5,
          py: 2,
          gap: 1,
          alignItems: 'center',
          bgcolor: 'background.elevation1',
          borderBottom: (theme) => `1px solid ${theme.vars.palette.divider}`,
        },
        compactMode && { px: 0, borderBottom: 'none' },
      ]}
    >
      {!compactMode && (
        <>
          <Badge
            badgeContent={`${dealCount}`}
            color="primary"
            sx={{
              mr: 3.5,
              [`& .${badgeClasses.badge}`]: {
                right: -28,
                top: '50%',
                transform: 'translateY(-50%)',
              },
            }}
          >
            {listTitle.isEditing ? (
              <StyledTextField
                variant="outlined"
                size="small"
                value={listTitle.value}
                onChange={(e) => setListTitle({ ...listTitle, value: e.target.value })}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBlur();
                  }
                }}
                autoFocus
                fullWidth
              />
            ) : (
              <Typography
                variant="subtitle1"
                onClick={() => setListTitle({ ...listTitle, isEditing: true })}
                sx={{
                  fontWeight: 700,
                  overflow: 'hidden',
                  textWrap: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: 150,
                }}
              >
                {listTitle.value}
              </Typography>
            )}
          </Badge>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {currencyFormat(totalBudget, { minimumFractionDigits: 0 })}
          </Typography>

          <ListMenu />
        </>
      )}

      <Button
        variant="text"
        color="neutral"
        size="small"
        shape="square"
        onClick={() => dealsDispatch({ type: TOGGLE_COMPACT_MODE, payload: { id: listId } })}
        onPointerDown={(e) => e.stopPropagation()}
        sx={[compactMode && { mx: 'auto' }]}
      >
        <IconifyIcon
          icon={
            compactMode
              ? 'material-symbols:open-in-full-rounded'
              : 'material-symbols:close-fullscreen-rounded'
          }
          sx={{ fontSize: 18, pointerEvents: 'none' }}
        />
      </Button>
    </Stack>
  );
};

export default ListHeader;
