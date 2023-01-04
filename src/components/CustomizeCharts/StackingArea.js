/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Chart, Axis, Tooltip, Legend, Line, Area } from 'bizcharts';
import DataSet from '@antv/data-set';

class SeriesLine extends React.Component {
  render() {
    const { data, cols, content, Color, height, padding } = this.props;
    const dv = new DataSet.View().source(data);
    dv.transform({
      type: 'sort-by',
      fields: ['type'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
      order: 'ASC', // 默认为 ASC，DESC 则为逆序
    });
    // console.log(dv.rows);
    return (
      <div>
        <Chart height={height} padding={padding} data={dv.rows} scale={cols} forceFit>
          <Legend name="name" />
          <Legend name="value" visible={false} />
          <Legend name="alert" visible={false} />
          <Axis
            name="clock"
            title={{
              position: 'end',
              offset: 15,
              textStyle: {
                fontSize: '12',
                textAlign: 'center',
                fill: '#999',
                fontWeight: 'bold',
                rotate: 0,
                autoRotate: true,
              },
            }}
          />
          <Axis
            name="value"
            title={{
              position: 'center',
              offset: 50,
              textStyle: {
                fontSize: '12',
                textAlign: 'center',
                fill: '#999',
                // fontWeight: 'bold',
                rotate: 90,
                autoRotate: true,
              },
            }}
            label={{
              formatter: val => `${val}`,
            }}
          />
          <Tooltip
            shared
            follow
            showCrosshairs
            crosshairs={{
              type: 'x',
            }}
          />
          <Area adjust="stack" color="name" position="clock*value" />
          <Line
            adjust="stack"
            position="clock*value"
            size={2}
            // color={['name', Color]}
            color="name"
          />
        </Chart>
      </div>
    );
  }
}

export default SeriesLine;
