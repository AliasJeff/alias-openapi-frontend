import React, { useRef, useEffect } from 'react';
import { Bar } from '@antv/g2plot';

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  console.log(data)

  useEffect(() => {
    if (data) {
      const bar = new Bar(chartRef.current, {
        data,
        xField: 'value',
        yField: 'interface',
        seriesField: 'interface',
        legend: {
          position: 'top-left',
        },
      });
      bar.render();
    }
  }, [data]);

  if (!data) {
    return null;
  }

  return <div ref={chartRef} style={{width: '100%', height: 400, marginTop: 10}}></div>;
};

export default BarChart;
