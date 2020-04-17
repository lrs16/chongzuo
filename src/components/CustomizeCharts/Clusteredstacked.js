import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

class Clusteredstacked extends Component {
  render() {
    const { height, padding } = this.props;
    const { DataView } = DataSet;
    const data = [
      {
        State: 'AL',
        '0 ~ 59%': 45682,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
      {
        State: 'AK',
        '0 ~ 59%': 3568,
        '60% ~ 69%': 4578,
        '70% ~ 79%': 256489,
        '80% ~ 89%': 4564,
        '90% ~ 99%': 4891,
        '100%': 1215966,
      },
      {
        State: 'AZ',
        '0 ~ 59%': 310504,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
      {
        State: 'AR',
        '0 ~ 59%': 310504,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
      {
        State: 'CA',
        '0 ~ 59%': 310504,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
      {
        State: 'CO',
        '0 ~ 59%': 310504,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
      {
        State: 'CT',
        '0 ~ 59%': 310504,
        '60% ~ 69%': 552339,
        '70% ~ 79%': 259034,
        '80% ~ 89%': 450818,
        '90% ~ 99%': 1231572,
        '100%': 1215966,
      },
    ];
    const pets = ['0 ~ 59%', '60% ~ 69%', '70% ~ 79%', '80% ~ 89%', '90% ~ 99%', '100%'];
    const dv = new DataView();
    dv.source(data)
      .transform({
        type: 'fold',
        fields: pets,
        key: 'pet',
        value: 'population',
        retains: ['State'],
      })
      .transform({
        type: 'map',
        callback: obj => {
          const key = obj.pet;
          let type;

          if (key === '0 ~ 59%' || key === '60% ~ 69%' || key === '70% ~ 79%') {
            type = 'a';
          } else if (key === '80% ~ 89%') {
            type = 'b';
          } else if (key === '90% ~ 99%') {
            type = 'c';
          } else {
            type = 'd';
          }

          obj.type = type;
          return obj;
        },
      });
    const colorMap = {
      '0 ~ 59%': '#E3F4BF',
      '60% ~ 69%': '#BEF7C8',
      '70% ~ 79%': '#86E6C8',
      '80% ~ 89%': '#36CFC9',
      '90% ~ 99%': '#209BDD',
      '100%': '#1581E6',
    };
    const cols = {
      population: {
        tickInterval: 1000000,
      },
    };
    return (
      <div>
        <Chart data={dv} scale={cols} padding={padding} forceFit height={height}>
          <Axis
            name="population"
            label={{
              formatter(val) {
                return `${val / 1000000}M`;
              },
            }}
          />
          <Legend position="right" />
          <Tooltip />
          <Geom
            type="interval"
            position="State*population"
            color={[
              'pet',
              function(pet) {
                return colorMap[pet];
              },
            ]}
            tooltip={[
              'pet*population',
              (pet, population) => {
                return {
                  name: pet,
                  value: population,
                };
              },
            ]}
            adjust={[
              {
                type: 'dodge',
                dodgeBy: 'type',
                // 按照 type 字段进行分组
                marginRatio: 0, // 分组中各个柱子之间不留空隙
              },
              {
                type: 'stack',
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default Clusteredstacked;
