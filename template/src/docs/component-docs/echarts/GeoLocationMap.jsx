import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, buttonGroupClasses, useTheme } from '@mui/material';
import world from 'assets/json/world.json';
import { MapChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';
import ZoomInIcon from 'components/icons/ZoomInIcon';
import ZoomOutIcon from 'components/icons/ZoomOutIcon';

const data = [
  { name: 'Japan', value: 44000 },
  { name: 'Greenland', value: 41000 },
  { name: 'India', value: 38000 },
  { name: 'Egypt', value: 27000 },
  { name: 'Mexico', value: 19000 },
  { name: 'Angola', value: 13000 },
  { name: 'Colombia', value: 11000 },
  { name: 'Finland', value: 7000 },
];

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MapChart,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  VisualMapComponent,
]);

echarts.registerMap('world', { geoJSON: world });

const GeoLocationMap = () => {
  const chartRef = useRef(null);
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const { currentBreakpoint } = useBreakpoints();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoomLevel] = useState(5);
  const [minZoomLevel] = useState(1);

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (param) => `${param.name} : ${isNaN(Number(param.value)) ? 0 : param.value}`,
      },
      toolbox: {
        show: false,
        feature: {
          restore: {},
        },
      },
      visualMap: {
        show: false,
        inRange: {
          color: [getThemeColor(vars.palette.chBlue[500])],
        },
      },
      series: [
        {
          type: 'map',
          map: 'world',
          data,
          selectedMode: false,
          zoom: zoomLevel,
          center:
            currentBreakpoint === 'xs'
              ? ['20%', '5%']
              : currentBreakpoint === 'sm'
                ? ['10%', '5%']
                : [0, 0],
          roam: 'move',
          scaleLimit: {
            min: 1,
          },
          left: 0,
          right: 0,
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: 'transparent',
            areaColor: getThemeColor(vars.palette.chGrey[200]),
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    }),
    [currentBreakpoint, zoomLevel, vars, data, getThemeColor],
  );

  const handleZoomIn = () => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(zoomLevel + 1);
    }
    chartRef.current?.getEchartsInstance().setOption({
      series: {
        zoom: zoomLevel + 1,
      },
    });
  };

  const handleZoomOut = () => {
    if (zoomLevel > minZoomLevel) {
      setZoomLevel(zoomLevel - 1);
    }
    chartRef.current?.getEchartsInstance().setOption({
      series: {
        zoom: zoomLevel - 1,
      },
    });
  };

  useEffect(() => {
    switch (currentBreakpoint) {
      case 'xs':
        setZoomLevel(3);
        break;
      case 'sm':
        setZoomLevel(2);
        break;
      default:
        setZoomLevel(1);
        break;
    }
  }, [currentBreakpoint]);

  return (
    <Box sx={{ position: 'relative' }}>
      <ReactEchart
        className="echart-map"
        ref={chartRef}
        echarts={echarts}
        option={getOptions}
        sx={{ height: '320px !important' }}
      />
      <ButtonGroup
        orientation="vertical"
        aria-label="vertical outlined button group"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          [`& .${buttonGroupClasses.grouped}`]: {
            minWidth: 36,
          },
        }}
      >
        <Button
          variant="soft"
          color="neutral"
          key="one"
          shape="square"
          sx={{ fontSize: 20, border: 1, borderColor: 'background.elevation2' }}
          onClick={handleZoomIn}
          disabled={maxZoomLevel === zoomLevel}
        >
          <ZoomInIcon />
        </Button>
        <Button
          variant="soft"
          color="neutral"
          key="two"
          shape="square"
          sx={{ fontSize: 20, border: 1, borderColor: 'background.elevation2' }}
          onClick={handleZoomOut}
          disabled={minZoomLevel === zoomLevel}
        >
          <ZoomOutIcon />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default GeoLocationMap;
