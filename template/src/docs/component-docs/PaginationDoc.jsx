import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import SimpleBar from 'components/base/SimpleBar';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import CustomTablePaginationAction from 'components/pagination/CustomTablePaginationAction';

const basicPaginationCode = `
<Box sx={{ overflow: 'auto' }}>
  <Stack direction="column" spacing={2.5} sx={{ minWidth: 350, alignItems: 'center' }}>
    <Pagination count={10} defaultPage={1} disabled />
    <Pagination count={10} defaultPage={1}/>
    <Pagination count={10} defaultPage={1} color="neutral"/>
    <Pagination count={10} defaultPage={1} color="primary"/>
    <Pagination count={10} defaultPage={1} color="secondary"/>
    <Pagination count={10} defaultPage={1} color="error"/>
    <Pagination count={10} defaultPage={1} color="info"/>
    <Pagination count={10} defaultPage={1} color="warning"/>
    <Pagination count={10} defaultPage={1} color="success"/>
  </Stack>
</Box>
`.trim();

const paginationVariantCode = `
<Box sx={{ overflow: 'auto' }}>
  <Stack direction="column" spacing={2.5} sx={{ minWidth: 350, alignItems: 'center' }}>
    <Pagination count={10} defaultPage={1} variant="solid" color="primary" />
    <Pagination count={10} defaultPage={1} variant="outlined" color="primary" />
  </Stack>
</Box>
`.trim();

const buttonPaginationCode = `
<Box sx={{ overflow: 'auto' }}>
  <Stack direction="column" spacing={2} sx={{ minWidth: 450, alignItems: 'center' }}>
    <Pagination count={10} variant="solid" color="primary" showFirstButton showLastButton />
    <Pagination count={10} variant="solid" color="primary" hidePrevButton hideNextButton />
  </Stack>
</Box>
`.trim();

const sizesPaginationCode = `
<Box sx={{ overflow: 'auto' }}>
  <Stack direction="column" spacing={2} sx={{ minWidth: 450, alignItems: 'center' }}>
    <Pagination count={10} defaultPage={1} size="small" color="primary" variant="solid" />
    <Pagination count={10} defaultPage={2} size="medium" color="primary" variant="solid" />
    <Pagination count={10} defaultPage={3} size="large" color="primary" variant="solid" />
  </Stack>
</Box>
`.trim();

const customIconPaginationCode = `
const CustomIcons = () => {
  const previous = () => (
    <IconifyIcon icon="material-symbols-light:arrow-left-alt" sx={{ fontSize: 22 }} />
  );

  const next = () => (
    <IconifyIcon icon="material-symbols-light:arrow-right-alt" sx={{ fontSize: 22 }} />
  );
  return (
    <Box sx={{ overflow: 'auto' }}>
      <Stack direction="column" spacing={2} sx={{ minWidth: 350, alignItems: 'center' }}>
        <Pagination
          count={10}
          variant="solid"
          color="primary"
          renderItem={(item) => <PaginationItem slots={{ next, previous }} {...item} />}
        />
      </Stack>
    </Box>
  );
};
render(<CustomIcons/>)
`.trim();

const paginationRangesCode = `
<Box sx={{ overflow: 'auto' }}>
  <Stack direction="column" spacing={2} sx={{ minWidth: 450, alignItems: 'center' }}>
    <Pagination
      count={11}
      defaultPage={6}
      variant="solid"
      siblingCount={0}
      color="primary"
    />
    <Pagination count={11} defaultPage={6} variant="solid" color="primary" />
    <Pagination
      count={11}
      defaultPage={6}
      variant="solid"
      siblingCount={0}
      boundaryCount={2}
      color="primary"
    />
    <Pagination
      count={11}
      defaultPage={6}
      variant="solid"
      boundaryCount={2}
      color="primary"
    />
  </Stack>
</Box>
`.trim();

const controlledPaginationCode = `
  const PaginationControlled = () => {
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Stack direction="column" spacing={2} sx={{ minWidth: 350, alignItems: 'center' }}>
        <Typography>Page: {page}</Typography>
        <Pagination count={10} page={page} color="primary" onChange={handleChange} />
      </Stack>
    </Box>
  );
};
render(<PaginationControlled/>)
`.trim();

const usePaginationHookCode = `
import usePagination from '@mui/material/usePagination';

const UsePagination = () => {
  const { items } = usePagination({ count: 10 });

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Stack direction="column" spacing={2} sx={{ minWidth: 400, alignItems: 'center' }}>
        <List component="nav" dense sx={{ display: 'flex', p: 0, m: 0, listStyle: 'none' }}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === 'start-ellipsis' || type === 'end-ellipsis') {
              children = '…';
            } else if (type === 'page') {
              children = (
                <Button
                  size="small"
                  variant={selected ? "contained" : "outlined"}
                  shape="circle"
                  color="success"
                  sx={{ fontWeight: selected ? 'bold' : 100, mx: 0.5 }}
                  {...item}
                >
                  {page}
                </Button>
              );
            } else {
              children = (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  {...item}
                >
                  { type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              );
            }

            return (
              <ListItem key={index} sx={{ display: 'inline', p: 0 }}>
                {children}
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Box>
  );
};
render(<UsePagination />);
`.trim();

const tablePaginationCode = `
  import CustomTablePaginationAction from 'components/pagination/CustomTablePaginationAction';

  const TablePaginationDemo = () => {
    const [page, setPage] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <TablePagination
        component="div"
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={(props) => (
          <CustomTablePaginationAction
            {...props}
            onPrevClick={() => handleChangePage(null, page - 1)}
            onNextClick={() => handleChangePage(null, page + 1)}
          />
        )}
      />
    );
  };
  render(<TablePaginationDemo/>);
`.trim();

const PaginationDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Pagination',
        description:
          'The Pagination component enables the user to select a specific page from a range of pages.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Pagination',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-pagination`,
        folderLink: `${folderBaseLink}/PaginationDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Pagination"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            The Pagination component supports customization through various props such as &nbsp;
            <Code>defaultPage</Code>&nbsp; (to set the initially selected page). The &nbsp;
            <Code>color</Code>&nbsp; prop allows setting custom colors, such as &nbsp;
            <Code>primary</Code>&nbsp;, &nbsp;
            <Code>neutral</Code>&nbsp;, &nbsp;
            <Code>success</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={basicPaginationCode} scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Pagination Variant"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            Pagination component offers style variations using the &nbsp;
            <Code>variant</Code>&nbsp; prop, with &nbsp;<Code>solid</Code>&nbsp; and &nbsp;
            <Code>outlined</Code>&nbsp; options.
          </Typography>
        }
      >
        <DocCard code={paginationVariantCode} scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Buttons"
        description="You can optionally enable first-page and last-page buttons, or disable the previous-page and next-page buttons."
      >
        <DocCard code={buttonPaginationCode} scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>size='small'|'large'</Code>&nbsp; for different sizes of pagination.
            Default is &nbsp;<Code>medium</Code>&nbsp;
          </Typography>
        }
      >
        <DocCard code={sizesPaginationCode} scope={{ SimpleBar }} />
      </DocSection>
      <DocSection title="Custom Control Icon">
        <DocCard code={customIconPaginationCode} noInline scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Pagination Ranges"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Adjust &nbsp;
            <Code sx={{ bgcolor: 'primary.lighter', p: 0.5, mx: 0.5, borderRadius: 1.5 }}>
              siblingCount
            </Code>
            &nbsp; and &nbsp;<Code>boundaryCount</Code>&nbsp; to define the visible page range
          </Typography>
        }
      >
        <DocCard code={paginationRangesCode} scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Controlled Pagination"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Handle page navigation using state-driven page and &nbsp;<Code>onChange</Code>&nbsp;
            props.
          </Typography>
        }
      >
        <DocCard code={controlledPaginationCode} noInline scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="usePagination Hook"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            For advanced customization use cases, a headless &nbsp;
            <Code>usePagination()</Code>&nbsp; hook is exposed. It accepts almost the same options
            as the Pagination component minus all the props related to the rendering of JSX.
          </Typography>
        }
      >
        <DocCard code={usePaginationHookCode} noInline scope={{ SimpleBar }} />
      </DocSection>
      <DocSection
        title="Table Pagination"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            For the pagination of a large set of tabular data, you should use the &nbsp;
            <Code>TablePagination</Code>&nbsp; component.
          </Typography>
        }
      >
        <DocCard code={tablePaginationCode} scope={{ CustomTablePaginationAction }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default PaginationDoc;
