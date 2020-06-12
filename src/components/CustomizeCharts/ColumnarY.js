/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Chart, Geom, Axis, Coord, Label, Tooltip } from 'bizcharts';

class ColumnarY extends React.Component {
  render() {
    const { data, cols, height, padding } = this.props;
    return (
      <div>
        <Chart
          renderer="canvas"
          height={height}
          data={data}
          scale={cols}
          padding={padding}
          forceFit
        >
          <Coord transpose />
          <Axis
            name="sold"
            label={{
              formatter: val => `${(val / 1000).toFixed(0)}k`,
            }}
          />
          <Axis name="category" />
          <Tooltip />
          <Geom type="interval" position="category*sold" color="category">
            <Label
              content="sold"
              offset={10} // 设置坐标轴文本 label 距离坐标轴线的距离
              htmlTemplate={(text, item) => {
                if (item.point.alert === true) {
                  return `<span style="color:#ff0000;">${item.point.sold}</span>`;
                }
                return `<span style="color:#404040;">${item.point.sold}</span>`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default ColumnarY;
