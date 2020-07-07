/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Chart,
  Interval,
  Tooltip,
  View,
  Coordinate,
  Legend,
  Annotation,
  Interaction,
} from 'bizcharts';
import DataSet from '@antv/data-set';

// const data = [
//   { type: '处理中', count: 40},
//   { type: '已处理', count: 21},
//   { type: '待处理', count: 17},
// ];

const total = '1000';
class Donut extends Component {
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
        {/* <Chart height={height} data={data} scale={cols} padding={padding} forceFit>  */}
        <Chart height={height} data={data} scale={cols} padding={padding} autoFit>
          <Legend visible={false} />
          <View data={dv.rows} animate>
            <Legend visible={false} />
            <Tooltip shared showTitle={false} />
            <Coordinate type="theta" radius={0.88} innerRadius={0.99} />
            <Interval
              position="percent"
              adjust="stack"
              color="type"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
              tooltip={false}
              label={[
                'count',
                {
                  content: data => {
                    return `${data.type}: ${data.count}`;
                  },
                  offset: '25',
                },
              ]}
            />
            <Interaction type="element-single-selected" />
            <Annotation.Text
              position={['50%', '50%']}
              content={`总处理${total}`}
              style={{
                lineHeight: '240px',
                fontSize: '30',
                fill: '#262626',
                textAlign: 'center',
              }}
            />
          </View>
          <View data={dv.rows} animate>
            <Coordinate type="theta" radius={0.88} innerRadius={0.65} />
            <Interval
              position="percent"
              adjust="stack"
              color="type"
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
              tooltip={false}
              label={[
                'count',
                {
                  content: data => {
                    // return `${data.type}: ${(data.percent * 100).toFixed(2)}%`;
                    return `${(data.percent * 100).toFixed(0)}%`;
                  },
                  offset: '-15',
                },
              ]}
            />
            <Interaction type="element-single-selected" />
          </View>
        </Chart>
      </div>
    );
  }
}

export default Donut;
