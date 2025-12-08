import { ListItem, ListItemText, listItemTextClasses } from '@mui/material';

const ProductVariantListItem = ({ label, value, sx }) => {
  return (
    <ListItem disablePadding disableGutters sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <ListItemText
        sx={[
          {
            m: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            [`& .${listItemTextClasses.primary}`]: {
              minWidth: 64,
              display: 'flex',
              justifyContent: 'space-between',
              typography: 'caption',
              fontWeight: 700,
            },
            [`& .${listItemTextClasses.secondary}`]: {
              typography: 'caption',
            },
          },
        ]}
        primary={
          <>
            {label}
            <span>:</span>
          </>
        }
        secondary={value}
      />
    </ListItem>
  );
};

export default ProductVariantListItem;
