import React, { Component } from 'react';
import { Chart, Axis, Coordinate, Legend, Interval, Tooltip } from 'bizcharts';
// import DataSet from "@antv/data-set";

// eslint-disable-next-line react/prefer-stateless-function
class BasicBarchart extends Component {
  render() {
    const { height, padding, data } = this.props;

    return (
      <Chart height={height} padding={padding} data={data} autoFit>
        <Axis name="name" visible={false} />
        <Axis name="usage" visible={false} />
        <Axis name="total" visible={false} />
        <Tooltip visible={false} />
        <Legend visible={false} />
        <Coordinate transpose />
        <Interval
          color="#eee"
          position="name*destotal"
          size={25}
          label={[
            'des',
            desvalue => {
              return {
                content: desvalue,
                position: 'des',
                offsetX: 10,
                style: {
                  fill: '#444',
                  textAlign: 'start',
                },
                layout: { type: 'fixed-overlap' },
              };
            },
          ]}
        />
        <Interval
          color="#eee"
          position="name*total"
          size={25}
          // label={[
          //   'des',
          // (desvalue)=> {
          //   return{
          //     content:desvalue,
          //     position: 'des',
          //     offsetX: -50,
          //     style: {
          //       fill: '#444',
          //       textAlign: 'end',
          //     },
          //     layout: { type: 'fixed-overlap' }
          //   }}
          //   ]}
        />
        <Interval
          color="#6395fa"
          position="name*usage"
          size={25}
          // shape='name'
        />
      </Chart>
    );
  }
}

export default BasicBarchart;
