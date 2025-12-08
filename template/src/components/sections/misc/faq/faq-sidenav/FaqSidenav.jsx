import List from '@mui/material/List';
import { faqCategories } from 'data/faqs';
import SidenavItems from './SidenavItems';

const FaqSidenav = () => {
  return (
    <List component="nav" disablePadding>
      {faqCategories.map((item) => (
        <SidenavItems key={item.id} faqCategory={item} />
      ))}
    </List>
  );
};

export default FaqSidenav;
