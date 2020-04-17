/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

class Columncolor extends Component {
  render() {
    const { height, padding } = this.props;
    const data = [
      {
        name: '南宁',
        vote: 100,
      },
      {
        name: '柳州',
        vote: 80,
      },
      {
        name: '桂林',
        vote: 90,
      },
      {
        name: '贵港',
        vote: 60,
      },
      {
        name: '玉林',
        vote: 100,
      },
      {
        name: '梧州',
        vote: 100,
      },
      {
        name: '钦州',
        vote: 90,
      },
      {
        name: '北海',
        vote: 60,
        pet: '0~60',
      },
      {
        name: '防城港',
        vote: 100,
        pet: '100',
      },
      {
        name: '河池',
        vote: 100,
        pet: '100',
      },
      {
        name: '百色',
        vote: 90,
      },
      {
        name: '崇左',
        vote: 60,
      },
    ];
    const scale = {
      vote: {
        min: 0,
      },
    };
    const colorSet = {
      60: '#f04864',
      100: '#4FAAEB',
      80: '#4ecb73',
      90: '#36cbcb',
    };
    return (
      <div>
        <Chart data={data} padding={padding} scale={scale} forceFit height={height}>
          <Axis name="vote" labels={null} title={null} line={null} tickLine={null} />
          <Geom
            type="interval"
            position="name*vote"
            // color={["name", ["#7f8da9", "#fec514", "#db4c3c", "#daf0fd"]]}
            color={['vote', value => colorSet[value]]}
          />
          <Tooltip />
        </Chart>
      </div>
    );
  }
}

export default Columncolor;
