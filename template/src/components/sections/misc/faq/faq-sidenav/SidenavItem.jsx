import { useEffect } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import { kebabCase } from 'lib/utils';
import { useFaqContext } from 'providers/FaqProvider';
import { HashLinkBehavior } from 'theme/components/Link';
import IconifyIcon from 'components/base/IconifyIcon';
import { useScrollSpyContext } from 'components/scroll-spy';

const SidenavItem = ({ categoryUrl, item }) => {
  const { activeFaqItem, handleActiveItemChange, handleDrawerClose } = useFaqContext();
  const { activeElemId } = useScrollSpyContext();

  useEffect(() => {
    if (activeElemId === kebabCase(item.question)) {
      handleActiveItemChange(item.question);
    }
  }, [activeElemId]);

  return (
    <ListItemButton
      key={item.id}
      LinkComponent={HashLinkBehavior}
      href={`${categoryUrl}#${kebabCase(item.question)}`}
      sx={{ p: 2, '&:hover': { bgcolor: 'background.elevation2' } }}
      onClick={handleDrawerClose}
    >
      <ListItemIcon sx={{ mt: 1, alignSelf: 'flex-start' }}>
        <IconifyIcon
          icon="material-symbols:fiber-manual-record"
          fontSize={14}
          color={activeFaqItem === item.question ? 'primary.main' : 'background.elevation3'}
        />
      </ListItemIcon>
      <ListItemText
        primary={item.question}
        sx={{
          ml: 0.25,
          [`& .${listItemTextClasses.primary}`]: {
            color: activeFaqItem === item.question ? 'primary.main' : 'text.secondary',
            typography: 'body2',
          },
        }}
      />
    </ListItemButton>
  );
};

export default SidenavItem;
