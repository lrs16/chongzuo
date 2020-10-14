/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Chart, Point, Annotation, Axis, Coordinate, registerShape } from 'bizcharts';

class Gauge extends Component {
  render() {
    // 自定义Shape 部分
    registerShape('point', 'pointer', {
      draw(cfg, container) {
        const group = container.addGroup();
        const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        const start = this.parsePoint({ x: 0, y: 0.8 }); // 获取极坐标系下起始点
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: start.x,
            y2: start.y,
            stroke: cfg.color,
            lineWidth: 5,
            lineCap: 'round',
          },
        });
        group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 9.75,
            stroke: cfg.color,
            lineWidth: 4.5,
            fill: '#fff',
          },
        });

        const angle1 = Math.atan((start.y - center.y) / (start.x - center.x));
        const angle = (Math.PI - 2 * angle1) * cfg.points[0].x;
        if (group.cfg.animable) {
          group.animate(ratio => {
            group.resetMatrix();
            group.rotateAtPoint(center.x, center.y, angle * ratio);
          }, 300);
        } else {
          group.rotateAtPoint(center.x, center.y, angle);
        }

        return group;
      },
    });
    const { height, data, title } = this.props;

    return (
      <div>
        <Chart
          height={height}
          data={data}
          padding={[0, 0, 30, 0]}
          scale={{
            value: {
              min: 0,
              max: 10,
              tickInterval: 1,
            },
          }}
          autoFit
        >
          <Coordinate
            type="polar"
            radius={0.75}
            startAngle={(-9 / 8) * Math.PI}
            endAngle={(1 / 8) * Math.PI}
          />
          <Axis name="1" />
          <Axis
            name="value"
            line={null}
            label={{
              offset: -25,
              style: {
                fontSize: 12,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            }}
            subTickLine={{
              count: 4,
              length: -8,
              style: {
                stroke: '#CBCBCB',
              },
            }}
            tickLine={{
              length: -15,
            }}
            grid={null}
          />
          <Point position="value*10" color="#1890FF" shape="pointer" animate={false} />
          <Annotation.Arc
            top={false}
            start={[0, 1]}
            end={[10, 1]}
            style={{
              stroke: '#CBCBCB',
              lineWidth: 10,
              lineDash: null,
            }}
          />
          <Annotation.Arc
            start={[0, 1]}
            end={[data[0].value, 1]}
            style={{
              stroke: '#1890FF',
              lineWidth: 10,
              lineDash: null,
            }}
          />
          <Annotation.Text
            position={['50%', '85%']}
            content={title}
            style={{
              fontSize: 14,
              fill: '#666',
              textAlign: 'center',
            }}
          />
          <Annotation.Text
            position={['50%', '90%']}
            content={`${data} %`}
            style={{
              fontSize: 24,
              fill: '#e16757',
              textAlign: 'center',
            }}
            offsetY={15}
          />
        </Chart>
      </div>
    );
  }
}

export default Gauge;
