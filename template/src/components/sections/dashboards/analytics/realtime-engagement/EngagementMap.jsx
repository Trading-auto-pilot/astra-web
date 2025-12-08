import { useMemo, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, buttonGroupClasses, useTheme } from '@mui/material';
import world from 'assets/json/world.json';
import { MapChart, ScatterChart } from 'echarts/charts';
import {
  GeoComponent,
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
import IconifyIcon from 'components/base/IconifyIcon';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MapChart,
  ScatterChart,
  GeoComponent,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  VisualMapComponent,
]);

echarts.registerMap('world', { geoJSON: world });

const coordinatesMap = {
  Japan: [139.6917, 35.6895],
  Greenland: [-51.7214, 64.1836],
  India: [77.209, 28.6139],
  Egypt: [31.2357, 30.0444],
  Mexico: [-99.1332, 19.4326],
  Angola: [13.2343, -8.8147],
  Colombia: [-74.0721, 4.711],
  Finland: [24.9384, 60.1699],
};

const EngagementMap = ({ data, sx }) => {
  const chartRef = useRef(null);
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();

  const { up } = useBreakpoints();
  const [zoomLevel, setZoomLevel] = useState(2.2);
  const [maxZoomLevel] = useState(5);
  const [minZoomLevel] = useState(1);

  const upSm = up('sm');

  const minValue = Math.min(...data.map((item) => item.value));
  const maxValue = Math.max(...data.map((item) => item.value));

  const scatterData = useMemo(() => {
    return data.map((item) => {
      const normalizedValue = (item.value - minValue) / (maxValue - minValue);
      const opacity = 0.1 + (0.6 - 0.1) * (1 - normalizedValue);

      return {
        name: item.name,
        value: [...(coordinatesMap[item.name] || [0, 0]), item.value],
        itemStyle: {
          color: getThemeColor(vars.palette.chBlue[400]),
          opacity: opacity,
        },
      };
    });
  }, [data, vars.palette.chBlue, getThemeColor, minValue, maxValue]);

  const getOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: (param) => {
          if (
            param.seriesType === 'scatter' &&
            Array.isArray(param.value) &&
            param.value[2] != null
          ) {
            return `${param.name}: ${param.value[2].toLocaleString()}`;
          }

          return `${param.name}: ${isNaN(Number(param.value)) ? 0 : param.value}`;
        },
      },
      geo: {
        map: 'world',
        roam: 'move',
        zoom: zoomLevel,
        center: upSm ? ['55%', '30%'] : ['50%', '0%'],
        scaleLimit: { min: 1 },
        itemStyle: {
          borderColor: 'transparent',
          areaColor: getThemeColor(vars.palette.chGrey[200]),
        },
        emphasis: { disabled: true },
      },
      series: [
        {
          type: 'map',
          geoIndex: 0,
          data: data,
          selectedMode: false,
          label: { show: false },
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: scatterData,
          symbolSize: (val) => {
            const value = val[2];
            const minSize = 30;
            const maxSize = 100;

            return minSize + ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize);
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 1.2,
            itemStyle: { color: getThemeColor(vars.palette.chBlue[500]) },
          },
        },
      ],
    }),
    [zoomLevel, vars.palette, getThemeColor, data, scatterData, minValue, maxValue],
  );

  const handleZoomIn = () => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(zoomLevel + 1);
      chartRef.current?.getEchartsInstance().setOption({
        geo: { zoom: zoomLevel + 1 },
      });
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > minZoomLevel) {
      setZoomLevel(zoomLevel - 1);
      chartRef.current?.getEchartsInstance().setOption({
        geo: { zoom: zoomLevel - 1 },
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: 1 }}>
      <ReactEchart
        className="echart-map"
        ref={chartRef}
        echarts={echarts}
        option={getOptions}
        sx={sx}
      />

      <ButtonGroup
        orientation="vertical"
        aria-label="vertical outlined button group"
        sx={{
          position: 'absolute',
          bottom: { xs: 380, md: 40 },
          left: { xs: 24, md: 40 },
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
          <IconifyIcon icon="material-symbols:add-rounded" />
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
          <IconifyIcon icon="material-symbols:remove-rounded" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default EngagementMap;
