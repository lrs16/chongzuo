/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class Areanull extends Component {
  render() {
    const { height } = this.props;
    const data = [
      {
        year: '2019-09',
        ACME: 167,
        Compitor: 47,
      },
      {
        year: '2019-10',
        ACME: 142,
      },
      {
        year: '2019-11',
        ACME: 117,
      },
      {
        year: '2019-12',
        ACME: 113,
        Compitor: 23,
      },
      {
        year: '2020-01',
        ACME: 132,
      },
      {
        year: '2020-02',
        ACME: 146,
        Compitor: 46,
      },
      {
        year: '2020-03',
        ACME: 169,
        Compitor: 59,
      },
      {
        year: '2020-04',
        ACME: 184,
        Compitor: 44,
      },
    ];
    const dv = new DataSet.View().source(data);
    dv.transform({
      type: 'fold',
      fields: ['ACME', 'Compitor'],
      key: 'type',
      value: 'value',
    });
    const scale = {
      value: {
        alias: 'The Share Price in Dollars',
        formatter(val) {
          return `$${val}`;
        },
      },
      year: {
        range: [0, 1],
      },
    };
    return (
      <div>
        <Chart data={dv} padding="auto" scale={scale} forceFit height={height}>
          <Tooltip crosshairs />
          <Axis />
          <Legend />
          <Geom type="area" position="year*value" color="type" shape="smooth" />
          <Geom type="line" position="year*value" color="type" shape="smooth" size={2} />
        </Chart>
      </div>
    );
  }
}

export default Areanull;
