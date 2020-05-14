/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Guide, View } from 'bizcharts';

const { Html } = Guide;
class Columncolor extends Component {
  render() {
    const { height, padding, data } = this.props;

    const scale = {
      vote: {
        min: 0,
      },
    };
    return (
      <div>
        <Chart data={data} padding={padding} scale={scale} forceFit height={height}>
          <Axis
            name="完成率"
            title={null}
            line={null}
            tickLine={null}
            label={{
              formatter: val => `${val}%`,
            }}
          />
          <Axis
            name="警戒值"
            label={{
              formatter: val => `${val}%`,
            }}
          />
          <View data={data}>
            <Geom type="line" position="name*警戒值" color="#ff0000" size={3} />
          </View>
          <Geom
            type="interval"
            position="name*完成率"
            // color={["name", ["#7f8da9", "#fec514", "#db4c3c", "#daf0fd"]]}
            color={[
              '完成率',
              value => {
                if (value <= 90.0) {
                  return '#FF3703';
                }
                if (value > 90.0 && value < 100.0) {
                  return '#faa51a';
                }
                if (value === 100) {
                  return '#3ba1ff';
                }
              },
            ]}
          />
          <Tooltip />
          <Geom type="line" position="label*警戒值" color="#ff0000" size={3} />

          <Guide>
            <Html
              position={['100%', '9%']}
              html={`<div style="text-align: center;"><span style="color:red;font-size:0.8em;">警戒值</span></div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
        </Chart>
      </div>
    );
  }
}

export default Columncolor;
