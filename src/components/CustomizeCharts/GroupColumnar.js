import React, { Component } from 'react';
import { Chart, Interval, Axis, Tooltip, Legend, Interaction } from 'bizcharts';
import DataSet from '@antv/data-set';

class Columnar extends Component {
  dv = new DataSet().createView();

  render() {
    const { height, padding, data, scale } = this.props;
    this.dv.source(data);
    //  const end =data[data.length - 1];
    return (
      <div>
        {/* <Chart data={this.dv} padding={padding} scale={scale} height={height} forceFit animate> */}
        <Chart data={this.dv} padding={padding} scale={scale} height={height} forceFit animate>
          <Axis
            name="rate"
            label={{
              formatter: val => `${val}%`,
            }}
            position="left"
          />
          <Interval
            adjust={[
              {
                type: 'dodge',
                marginRatio: 0,
              },
            ]}
            color="type"
            position="name*rate"
          />
          <Tooltip shared />
        </Chart>
      </div>
    );
  }
}

export default Columnar;
