/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Interval, Tooltip, Coordinate, Interaction } from 'bizcharts';
import DataSet from '@antv/data-set';

// const data = [
//   { type: '处理中', count: 40},
//   { type: '已处理', count: 21},
//   { type: '待处理', count: 17},
// ];

class DonutPCT extends Component {
  render() {
    const { DataView } = DataSet;
    const { data, height, padding } = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'type',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          return `${(val * 100).toFixed(2)}%`;
        },
      },
    };

    return (
      <div>
        <Chart height={height} data={dv.rows} scale={cols} padding={padding} autoFit>
          <Tooltip shared showTitle={false} />
          <Coordinate type="theta" radius={0.88} innerRadius={0.7} />
          <Interval
            position="percent"
            adjust="stack"
            color="type"
            shape="sliceShape"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
            tooltip={false}
            label={[
              'count',
              {
                content: data => {
                  return `${data.type}: ${(data.percent * 100).toFixed(0)}%`;
                },
                offset: '25',
              },
            ]}
          />
          <Interaction type="element-single-selected" />
        </Chart>
      </div>
    );
  }
}

export default DonutPCT;
