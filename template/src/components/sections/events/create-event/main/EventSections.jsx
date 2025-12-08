import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { closestCenter } from '@dnd-kit/core';
import { Button, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import EventImageDropzone from './EventImageDropzone';
import EventOverview from './EventOverview';
import DraggableEventSection from './draggable-section';

const initializeSectionFields = (type, title) => ({
  title,
  contentType: type,
  ...(type === 'paragraph' && { paragraphContents: '' }),
  ...(type === 'list' && {
    listItems: [
      { value: '', itemId: 'item1' },
      { value: '', itemId: 'item2' },
      { value: '', itemId: 'item3' },
    ],
  }),
  ...(type === 'info' && {
    infoItems: [
      { option: '', value: '', itemId: 'item1' },
      { option: '', value: '', itemId: 'item2' },
      { option: '', value: '', itemId: 'item3' },
    ],
    imageAlignment: 'right',
  }),
});

const EventSections = () => {
  const { control } = useFormContext();

  const {
    fields: sections,
    append,
    update,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'sections',
  });

  const addSection = () =>
    append(initializeSectionFields('paragraph', `Section ${sections.length + 1}`));

  const handleChange = (index, event) => {
    const updatedContentType = event.target.value;
    update(index, initializeSectionFields(updatedContentType, sections[index].title));
  };

  const handleDragEnd = useCallback(
    (oldIndex, newIndex) => {
      move(oldIndex, newIndex);
    },
    [sections, move],
  );

  return (
    <div>
      <Stack direction="column" sx={{ rowGap: 4, mb: 4 }}>
        <EventImageDropzone />
        <EventOverview />
        <SortableDnd
          items={sections}
          handleDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          {sections.map((section, index) => (
            <DraggableEventSection
              key={section.id}
              section={section}
              index={index}
              handleChange={handleChange}
              remove={remove}
            />
          ))}
        </SortableDnd>
      </Stack>

      <Button
        onClick={addSection}
        fullWidth
        color="neutral"
        variant="soft"
        startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
      >
        Add another section
      </Button>
    </div>
  );
};

export default EventSections;
