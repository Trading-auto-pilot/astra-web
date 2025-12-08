import { Avatar, ButtonBase, Grid, Tab, Tabs, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const Categories = ({
  categoryType,
  handleTabChange,
  displayedCategories,
  handleCategory,
  tabsRef,
  gridRef,
}) => {
  return (
    <>
      <Tabs
        ref={tabsRef}
        value={categoryType}
        onChange={handleTabChange}
        sx={{ mb: 3, mx: 'auto', width: 'fit-content' }}
      >
        <Tab value="popular" label="Popular Categories" />
        <Tab value="all" label="All Categories" />
      </Tabs>

      <Grid container columns={{ xs: 2, md: 4 }} spacing={1} ref={gridRef}>
        {displayedCategories.map((category) => (
          <Grid size={1} key={category.id}>
            <ButtonBase
              onClick={() => handleCategory(category.id)}
              sx={{
                height: 1,
                width: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                p: 3,
                borderRadius: 4,
                bgcolor: 'background.elevation1',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { bgcolor: 'background.elevation2' },
              }}
            >
              <Avatar
                sx={{
                  height: 24,
                  width: 24,
                  borderRadius: 1,
                  mb: 2,
                  bgcolor: `${category.avatar.color}.lighter`,
                }}
              >
                <IconifyIcon
                  icon={category.avatar.icon}
                  sx={{
                    color: `${category.avatar.color}.main`,
                    fontSize: 16,
                  }}
                />
              </Avatar>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                {category.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ lineClamp: 2 }}>
                {category.description}
              </Typography>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Categories;
