import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { customDateAdapter } from 'helpers/gantt-utils';
import { SvelteGantt, SvelteGanttDependencies, SvelteGanttTable } from 'svelte-gantt';

const SvelteGanttChart = ({ chartOptions, sx }) => {
  const ganttContainerRef = useRef(null);
  const ganttInstanceRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const container = ganttContainerRef.current;
    if (container?.offsetHeight) {
      frameId = requestAnimationFrame(() => {
        ganttInstanceRef.current = new SvelteGantt({
          target: container,
          props: {
            dateAdapter: customDateAdapter,
            fitWidth: true,
            tableWidth: 166,
            rowHeight: 56,
            rowPadding: 8,
            classes: 'gantt-chart',
            columnStrokeColor: 'transparent',
            columnStrokeWidth: 0,
            headers: [
              { unit: 'month', format: 'MMMM', sticky: true },
              { unit: 'day', format: 'DD d' },
            ],
            minWidth: 1700,
            magnetUnit: 'hour',
            ganttTableModules: [SvelteGanttTable],
            ganttBodyModules: [SvelteGanttDependencies],
            useCanvasColumns: true,
            layout: 'overlap',
            ...chartOptions,
          },
        });
      });
    }

    return () => {
      cancelAnimationFrame(frameId);
      ganttInstanceRef.current?.$destroy();
    };
  }, []);

  useEffect(() => {
    const ganttInstance = ganttInstanceRef.current;
    if (ganttInstance) {
      ganttInstance.$set(chartOptions);
    }
  }, [chartOptions]);

  return (
    <Box
      ref={ganttContainerRef}
      sx={{
        height: 1,
        ...sx,
      }}
    />
  );
};

export default SvelteGanttChart;
