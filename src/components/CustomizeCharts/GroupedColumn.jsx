import React from 'react';
import {
  G2,
  Chart,
  Tooltip,
  Interval,
  Line,
  Point,
  Annotation
} from "bizcharts";

function GroupedColumn(props) {
  const { height, padding, data, scale } = props;
  const annotationdata = data[data.length - 1];
  return (
    <Chart padding={padding} height={height} data={data} scale={scale} autoFit>
      <Interval
        adjust={[
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]}
        color="name"
        position="type*value"
        label={[
          'value',
          {
            animate: true,
          },
        ]}
      // color={[
      //   'value*alertvalue',
      //   (value, alertvalue) => {
      //     if (value <= alertvalue) {
      //       return '#FF3703';
      //     }
      //     return '#3ba1ff';
      //   },
      // ]}
      />
      {/* 线形 */}
      <Line
        position="type*alertvalue"
        color="#ff0000"
        size={2}
        shape="line"
        animate={{
          appear: {
            duration: 1000,
            delay: 600,
          },
          enter: {
            duration: 1000, // enter 动画执行时间
            delay: 600,
          },
          update: {
            duration: 1000, // enter 动画执行时间
            delay: 600,
          },
          leave: false, // 关闭 leave 销毁动画
        }}
      />
      <Point
        position="type*alertvalue"
        color="#ff0000"
        size={2}
        shape="circle"
        animate={{
          appear: {
            duration: 1000,
            delay: 2000,
          },
          enter: {
            duration: 1000, // enter 动画执行时间
            delay: 2000,
          },
          update: {
            duration: 1000, // enter 动画执行时间
            delay: 2000,
          },
          leave: true, // 关闭 leave 销毁动画
        }}
      />
      {data && (<>
        <Annotation.Line />
        <Annotation.DataMarker
          position={[annotationdata.type, annotationdata.alertvalue]}
          text={{ content: '警戒值', style: { fill: '#ff0000', } }}
          point={{ style: { fill: '#ff0000', stroke: '#fff' } }}
          line={{ length: 0 }}
        />
      </>)}
      <Tooltip shared />
    </Chart>
  );
}

export default GroupedColumn;