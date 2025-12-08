import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

const DetailsSection = ({ title, description }) => {
  return (
    <div>
      <Typography fontWeight={700} lineHeight={1.5} mb={1}>
        {title}
      </Typography>
      {typeof description === 'string' && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {Array.isArray(description) && (
        <List disablePadding sx={{ listStyleType: 'disc', pl: 3 }}>
          {description.map((item, index) => (
            <ListItem
              key={index}
              disableGutters
              disablePadding
              sx={{
                display: 'list-item',
                fontSize: 14,
                color: 'text.secondary',
              }}
            >
              {item}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default DetailsSection;
