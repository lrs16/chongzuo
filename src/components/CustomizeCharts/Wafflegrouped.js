/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Geom, Tooltip, Legend, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

class Wafflegrouped extends Component {
  render() {
    const { height } = this.props;
    const { Text, Line } = Guide;
    const data = [
      {
        State: 'AL',
        'Under 5 Years': 310504,
        '5 to 13 Years': 552339,
        '14 to 17 Years': 259034,
        '18 to 24 Years': 450818,
        '25 to 44 Years': 1231572,
        '45 to 64 Years': 1215966,
        '65 Years and Over': 641667,
      },
      {
        State: 'AK',
        'Under 5 Years': 52083,
        '5 to 13 Years': 85640,
        '14 to 17 Years': 42153,
        '18 to 24 Years': 74257,
        '25 to 44 Years': 198724,
        '45 to 64 Years': 183159,
        '65 Years and Over': 50277,
      },
      {
        State: 'AZ',
        'Under 5 Years': 515910,
        '5 to 13 Years': 828669,
        '14 to 17 Years': 362642,
        '18 to 24 Years': 601943,
        '25 to 44 Years': 1804762,
        '45 to 64 Years': 1523681,
        '65 Years and Over': 862573,
      },
    ];
    const ages = [
      'Under 5 Years',
      '5 to 13 Years',
      '14 to 17 Years',
      '18 to 24 Years',
      '25 to 44 Years',
      '45 to 64 Years',
      '65 Years and Over',
    ];
    const dv = new DataSet.View()
      .source(data)
      .transform({
        type: 'fold',
        fields: ages,
        key: 'name',
      })
      .transform({
        type: 'waffle',
        maxCount: 500,
        groupBy: 'State',
      });
    const guideDv = new DataSet.View().source(dv).transform({
      type: 'aggregate',
      fields: ['y'],
      operations: ['median'],
      as: ['medianY'],
      groupBy: 'State',
    });
    const scale = {
      x: {
        nice: false,
      },
      y: {
        nice: false,
      },
    };
    const guideItems = guideDv.rows.map(row => {
      return (
        <Text
          top
          position={[0, row.medianY]}
          content={row.State}
          offsetX={-10}
          style={{
            fill: '#666',
            // 文本颜色
            fontSize: 24,
            // 文本大小
            fontWeight: 'bold',
            // 文本粗细
            textAlign: 'right',
          }}
        />
      );
    });
    return (
      <div>
        <Chart padding={[20, 20, 80, 50]} scale={scale} forceFit data={dv} height={height}>
          <Legend name="name" position="bottom" />
          <Legend name="_wStep" visible={false} />
          <Legend name="_hStep" visible={false} />
          <Tooltip />
          <Guide>
            {guideItems[0]}
            {guideItems[1]}
            {guideItems[2]}
            {guideItems[3]}
            {guideItems[4]}
            {guideItems[5]}
            {guideItems[6]}
          </Guide>

          <Geom
            type="point"
            position="x*y"
            color="name"
            shape="square"
            size={['_hStep', hStep => Math.min((window.innerHeight - 100) * 0.3 * hStep, 5)]}
          />
        </Chart>
      </div>
    );
  }
}

export default Wafflegrouped;
