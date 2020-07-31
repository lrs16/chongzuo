/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Chart, Axis, Tooltip, Legend, Line, Point, Annotation, Geom } from 'bizcharts';
import DataSet from '@antv/data-set';
import { Alert } from 'antd';

class SeriesLine extends React.Component {
  render() {
    // const Colors='#ffeeee-#ff6565';
    const { data, cols, content, alerttitle, Color, height, padding } = this.props;
    const dv = new DataSet.View().source(data);
    dv.transform({
      type: 'sort-by',
      fields: ['name'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
      order: 'ASC', // 默认为 ASC，DESC 则为逆序
    });
    // console.log(dv.rows);
    return (
      <div>
        <Chart height={height} padding={padding} data={dv.rows} scale={cols} forceFit>
          <Legend name="name" />
          <Legend name="value" visible={false} />
          <Legend name="alert" visible={false} />
          <Legend name="alerttip" visible={false} />
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
              },
              rotate: 0,
              autoRotate: true,
            }}
          />
          <Axis
            name="value"
            //position="top"
            title={{
              position: 'end',
              offset: -25,
              rotate: 0,
              autoRotate: true,
              formatter: false,
              textStyle: {
                fontSize: '12',
                textAlign: 'left',
                fill: '#fff',
                // fontWeight: 'bold',
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
          <Annotation.Line />
          <Annotation.Text position={['median', 'max']} content={content} offsetY="-30" />
          {alerttitle !== undefined && (
            <Annotation.Text
              position={['min', 'max']}
              content={`${alerttitle}存在差异`}
              offsetY="-30"
              style={{
                fill: 'red',
              }}
            />
          )}
          <Line
            position="clock*value"
            // size={[
            //   'alerttip',
            //   (alerttip) => {
            //     if (alerttip === true) {
            //       return 4;
            //     }
            //     return 1;
            //   },
            // ]}
            size="2"
            color={['name', Color]}
            // color='name'
          />
          <Point
            position="clock*value"
            // size={4}
            size={[
              'alert',
              alert => {
                if (alert === true) {
                  return 4;
                }
                return 0;
              },
            ]}
            shape="circle"
            color={[
              'value*alert',
              (value, alert) => {
                if (alert) {
                  return 'red';
                }
                return '#fff';
              },
            ]}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default SeriesLine;
