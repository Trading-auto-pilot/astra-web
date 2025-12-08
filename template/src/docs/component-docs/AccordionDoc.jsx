import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicAccordionCode = `
<div>
  <Accordion>
    <AccordionSummary
      aria-controls="panel1-content"
      id="panel1-header"
    >
      Accordion 1
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
      lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      aria-controls="panel2-content"
      id="panel2-header"
    >
      Accordion 2
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
      lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
  </Accordion>
  <Accordion disabled>
    <AccordionSummary
      aria-controls="panel3-content"
      id="panel3-header"
    >
      Disabled Accordion
    </AccordionSummary>
  </Accordion>
  <Accordion defaultExpanded>
    <AccordionSummary
      aria-controls="panel4-content"
      id="panel4-header"
    >
      Accordion Actions
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
      lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
    <AccordionActions>
      <Button>Cancel</Button>
      <Button>Agree</Button>
    </AccordionActions>
  </Accordion>
</div>
`.trim();

const withIconAccordionCode = `
<div>
  <Accordion>
    <AccordionSummary
      expandIcon={
        <IconifyIcon
          icon="material-symbols-light:keyboard-arrow-down"
          color="primary.main"
          sx={{ fontSize: 24, verticalAlign: 'text-bottom' }}
        />
      }
      aria-controls="panel1-content"
      id="panel1-header"
    >
      Accordion 1
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
      lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={
        <IconifyIcon
          icon="material-symbols-light:arrow-downward-alt"
          color="primary.main"
          sx={{ fontSize: 24, verticalAlign: 'text-bottom' }}
        />
      }
      aria-controls="panel2-content"
      id="panel2-header"
    >
      Accordion 2
    </AccordionSummary>
    <AccordionDetails>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
      lacus ex, sit amet blandit leo lobortis eget.
    </AccordionDetails>
  </Accordion>
</div>
`.trim();

const transitionAccordionCode = `const AccordionTransition = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade as AccordionSlots['transition'] }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={[
          expanded
            ? {
                [\`& .\${accordionClasses.region}\`]: {
                  height: 'auto',
                },
                [\`& .\${accordionDetailsClasses.root}\`]: {
                  display: 'block',
                },
              }
            : {
                [\`& .\${accordionClasses.region}\`]: {
                  height: 0,
                },
                [\`& .\${accordionDetailsClasses.root}\`]: {
                  display: 'none',
                },
              },
        ]}
      >
        <AccordionSummary
          expandIcon={
            <IconifyIcon
              icon="material-symbols-light:keyboard-arrow-down"
              color="primary.main"
              sx={{ fontSize: 24, verticalAlign: 'text-bottom' }}
            />
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Custom transition using Fade</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={
            <IconifyIcon
              icon="material-symbols-light:keyboard-arrow-down"
              color="primary.main"
              sx={{ fontSize: 24, verticalAlign: 'text-bottom' }}
            />
          }
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Default transition using Collapse</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
render(<AccordionTransition />)`.trim();

const controlledAccordionCode = `const ControlledAccordions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ [\`& .\${accordionSummaryClasses.content}\`]: { alignItems: 'center' } }}
        >
          <Typography sx={{ width: '44%', flexShrink: 0 }}>General settings</Typography>
          <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          aria-controls="panel2bh-content"
          id="panel2bh-header"
          sx={{ [\`& .\${accordionSummaryClasses.content}\`]: { alignItems: 'center' } }}
        >
          <Typography sx={{ width: '44%', flexShrink: 0 }}>Users</Typography>
          <Typography sx={{ color: 'text.secondary' }}>You are currently not an owner</Typography>
        </AccordionSummary>
        <AccordionDetails>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          aria-controls="panel3bh-content"
          id="panel3bh-header"
          sx={{ [\`& .\${accordionSummaryClasses.content}\`]: { alignItems: 'center' } }}
        >
          <Typography sx={{ width: '44%', flexShrink: 0 }}>Advanced settings</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          aria-controls="panel4bh-content"
          id="panel4bh-header"
          sx={{ [\`& .\${accordionSummaryClasses.content}\`]: { alignItems: 'center' } }}
        >
          <Typography sx={{ width: '44%', flexShrink: 0 }}>Personal data</Typography>
        </AccordionSummary>
        <AccordionDetails>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
render(<ControlledAccordions />)`.trim();

const customAccordionCode = `
const CustomAccordion = ({ id, expanded, handleChange, title, content }) => (
  <Accordion
    expanded={expanded === id}
    onChange={handleChange(id)}
    sx={{
      boxShadow: 'none',
      border: 'none',
      borderRadius: 0,
      overflow: 'hidden',
      '&:not(:last-of-type)': { borderBottom: 0 },
      '&:before': { display: 'none' },
      [\`&.\${accordionSummaryClasses.expanded}\`]: { margin: 'auto' },
      [\`&.\${paperClasses.root}\`]: { marginBottom: 2 }
    }}
  >
    <AccordionSummary
      aria-controls={\`\${id}-content\`}
      id={\`\${id}-header\`}
      sx={{
        transition: 'none',
        backgroundColor: (theme) => \`\${theme.vars.palette.background.elevation1}\`,
        borderBottom: (theme) =>  expanded === id ? \`1px solid \${theme.vars.palette.divider}\` : undefined,
      }}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails sx={{ padding: (theme) => \`\${theme.spacing(4)}\` }}>
      {content}
    </AccordionDetails>
  </Accordion>
);

// Main Component
const AccordionCustomized = () => {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const panels = [
    {
      id: 'panel1',
      title: 'Accordion 1',
      content: 'Wafer sesame snaps chocolate bar candy canes halvah. Cupcake sesame snaps sweet tart dessert biscuit. Topping soufflé tart sweet croissant.',
    },
    {
      id: 'panel2',
      title: 'Accordion 2',
      content: 'Sugar plum sesame snaps caramels. Cake pie tart fruitcake sesame snaps donut cupcake macaroon. Gingerbread pudding cheesecake pie ice cream.',
    },
    {
      id: 'panel3',
      title: 'Accordion 3',
      content: 'Gingerbread lemon drops bear claw gummi bears bonbon wafer jujubes tiramisu. Jelly pie cake. Sweet roll dessert sweet pastry powder.',
    },
  ];

  return (
    <>
      {panels.map(({ id, title, content }) => (
        <CustomAccordion
          key={id}
          id={id}
          expanded={expanded}
          handleChange={handleChange}
          title={title}
          content={content}
        />
      ))}
    </>
  );
};

render(<AccordionCustomized />);
`.trim();

const AccordionDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Accordion',
        description:
          'The Accordion component lets users show and hide sections of related content on a page.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Accordion',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-accordion`,
        folderLink: `${folderBaseLink}/AccordionDoc.jsx`,
      }}
    >
      <DocSection title="Basic Accordion">
        <DocCard code={basicAccordionCode} />
      </DocSection>
      <DocSection
        title="Expand Icon"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: 'text.secondary',
              }}
            >
              Use the &nbsp;<Code>expandIcon</Code>,&nbsp; prop on the <Code>AccordionSummary</Code>{' '}
              component to change the expand indicator icon.
            </Typography>
          </>
        }
      >
        <DocCard code={withIconAccordionCode} />
      </DocSection>
      <DocSection
        title="Transition"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: 'text.secondary',
            }}
          >
            Use the &nbsp;<Code>slots.transition</Code>&nbsp; and &nbsp;
            <Code>slotProps.transition</Code>&nbsp; props to change the Accordion's default
            transition.
          </Typography>
        }
      >
        <DocCard code={transitionAccordionCode} noInline />
      </DocSection>
      <DocSection title="Controlled Accordion">
        <DocCard code={controlledAccordionCode} noInline />
      </DocSection>
      <DocSection
        title="Customized Accordion"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: 'text.secondary',
            }}
          >
            Use the &nbsp;<Code>sx</Code>&nbsp; prop to customize the component the way you want it.
          </Typography>
        }
      >
        <DocCard code={customAccordionCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default AccordionDoc;
