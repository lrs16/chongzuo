/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Chart, Axis, Tooltip, Legend, Line, Point, Annotation } from 'bizcharts';

class SeriesLine extends React.Component {
  render() {
    const { data, cols, content, Color, height, padding } = this.props;
    return (
      <div>
        <Chart height={height} padding={padding} data={data} scale={cols} forceFit>
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
              offset: 60,
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
          <Annotation.Line />
          <Annotation.Text position={['median', 'max']} content={content} offsetY="-30" />
          <Line position="clock*value" size={2} color={['name', Color]} />
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
