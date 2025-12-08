import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicTransferListCode = `const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
}

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const TransferList = () => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([0, 1, 2, 3]);
  const [right, setRight] = useState([4, 5, 6, 7]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper background={1} sx={{ width: 180, height: 230, overflow: 'auto', borderRadius: 2 }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = \`transfer-list-item-\${value}-label\`;

          return (
            <ListItemButton
              key={value}
              dense
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{
                    input: {
                      'aria-label': labelId,
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={\`List item \${value + 1}\`} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Stack spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
      {customList(left)}
      <Stack gap={1} direction="column" sx={{ alignItems: 'center' }}>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleAllRight}
          disabled={left.length === 0}
          aria-label="move all right"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:keyboard-double-arrow-right-rounded" fontSize={20} />
        </Button>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:chevron-right-rounded" fontSize={20} />
        </Button>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:chevron-left-rounded" fontSize={20} />
        </Button>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label="move all left"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:keyboard-double-arrow-left-rounded" fontSize={20} />
        </Button>
      </Stack>
      {customList(right)}
    </Stack>
  );
}
render(<TransferList />)`;

const enhancedTransferListCode = `const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
}

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const union = (a, b) => {
  return [...a, ...not(b, a)];
}

const SelectAllTransferList = () => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([0, 1, 2, 3]);
  const [right, setRight] = useState([4, 5, 6, 7]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card sx={{ borderRadius: 2, bgcolor: 'background.elevation1' }}>
      <CardHeader
        sx={{ px: 2, py: 1, [\`& .\${cardHeaderClasses.avatar}\`]: {mr: 0} }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            slotProps={{
              input: {
                'aria-label': 'all items selected',
              },
            }}
          />
        }
        title={title}
        subheader={\`\${numberOfChecked(items)}/\${items.length} selected\`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = \`transfer-list-all-item-\${value}-label\`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  slotProps={{
                    input: {
                      'aria-label': labelId
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={\`List item \${value + 1}\`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Stack spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
      {customList('Choices', left)}
      <Stack gap={1} direction="column" sx={{ alignItems: 'center' }}>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:chevron-right-rounded" fontSize={20} />
        </Button>
        <Button
          variant="soft"
          shape="square"
          color="neutral"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
        >
          <IconifyIcon flipOnRTL icon="material-symbols:chevron-left-rounded" fontSize={20} />
        </Button>
      </Stack>
      {customList('Chosen', right)}
    </Stack>
  );
}
render(<SelectAllTransferList />)`;

const TransferListDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Transfer List',
        description: `A Transfer List (or "shuttle") enables the user to move one or more list items between lists.`,
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Transfer List',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-transfer-list`,
        folderLink: `${folderBaseLink}/TransferListDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic transfer list"
        description={`For completeness, this example includes buttons for "move all", but not every transfer list needs these.`}
      >
        <DocCard code={basicTransferListCode} noInline />
      </DocSection>

      <DocSection
        title="Enhanced transfer list"
        description={`This example exchanges the "move all" buttons for a "select all / select none" checkbox and adds a counter.`}
      >
        <DocCard code={enhancedTransferListCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default TransferListDoc;
