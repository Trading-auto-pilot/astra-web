import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import { useFaqContext } from 'providers/FaqProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import ScrollSpyNavItem from 'components/scroll-spy/ScrollSpyNavItem';
import SidenavItem from './SidenavItem';

const SidenavItems = ({ faqCategory }) => {
  const [open, setOpen] = useState(false);
  const { activeCategory } = useFaqContext();

  const handleClick = () => {
    setOpen(!open);
  };

  const selected = activeCategory?.slug === faqCategory.slug;

  useEffect(() => {
    setOpen(selected);
  }, [selected]);

  return (
    <>
      <ListItem
        disableGutters
        component="div"
        sx={{
          borderRadius: 1.5,
          overflow: 'hidden',
          '&:hover': { bgcolor: 'background.elevation2' },
        }}
        secondaryAction={
          <Button
            variant="soft"
            shape="square"
            color="neutral"
            size="large"
            onClick={handleClick}
            sx={{
              px: 2.25,
              py: 3.75,
              borderRadius: 0,
              bgcolor: 'transparent',
              '&:hover': { bgcolor: 'background.elevation3' },
            }}
          >
            <IconifyIcon
              icon="material-symbols:keyboard-arrow-down-rounded"
              color={selected ? 'primary.main' : 'text.primary'}
              fontSize={20}
              sx={(theme) => ({
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.short,
                  easing: theme.transitions.easing.easeInOut,
                }),
              })}
            />
          </Button>
        }
        disablePadding
      >
        <ListItemButton
          href={faqCategory.url}
          sx={{ p: 2, bgcolor: 'transparent !important', borderRadius: 0 }}
        >
          <ListItemText
            primary={faqCategory.subheader}
            sx={{
              [`& .${listItemTextClasses.primary}`]: {
                color: selected ? 'primary.main' : 'text.primary',
                fontSize: 'body2.fontSize',
                fontWeight: 600,
              },
            }}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {faqCategory.items?.map((faqItem) => (
            <ScrollSpyNavItem key={faqItem.id}>
              <SidenavItem categoryUrl={faqCategory.url} item={faqItem} />
            </ScrollSpyNavItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidenavItems;
