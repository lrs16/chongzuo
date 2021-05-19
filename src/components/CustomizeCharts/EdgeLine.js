import React, { Component } from 'react';

import {
  //  G2,
  Chart,
  Geom,
  Axis,
  // Tooltip,
  Coord,
  Legend,
  View,
  //  Guide,
  //  Shape,
  //  Facet,
  //  Util,
  Tooltip,
  Point,
} from 'bizcharts';
import { Badge } from 'antd';
import DataSet from '@antv/data-set';
import styles from './index.less';

const colormap = new Map([
  ['失败', 'error'],
  ['成功', 'success'],
  ['未招测', 'default'],
]);
const linecolormap = new Map([
  ['失败', '#f50'],
  ['成功', '#87d068'],
  ['未招测', '#666'],
])
class EdgeLine extends Component {
  render() {
    const { datas, height, padding } = this.props;
    const dv = new DataSet.View().source(datas, {
      type: 'hierarchy',
      pureData: true,
    });
    dv.transform({
      type: 'hierarchy.compact-box',
      // this layout algorithm needs to use pure data
      direction: 'TB',

      getHGap() {
        return 10;
      },

      getVGap() {
        return 10;
      },

      getHeight() {
        return 18;
      },

      getWidth() {
        return 18;
      },
    });
    // console.log(dv);
    return (
      <div>
        <Chart padding={padding} height={height} forceFit>
          <Axis visible={false} />
          <Coord transpose />

          <View
            data={dv.getAllLinks().map(link => {
              return ({
                x: [link.source.x, link.target.x],
                y: [link.source.y, link.target.y],
                source: link.source.id,
                target: link.target.id,
                area: link.target.data.area,
                state: link.target.data.state,
                date: link.target.data.date,
                ip: '172.11.11.11',               // 正式环境用这个：link.target.data.ip
              })
            })}
          >
            <Tooltip shared>
              {(_, items) => {
                const { data } = items[0];
                const { area, date, ip, state } = data;
                return (
                  <div style={{ padding: '15px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>{area}</div>
                    <ul className={styles.tooltipul}>
                      <li style={{ margin: '12px 0' }}>
                        <span>召测状态:</span>
                        <span className={styles.tooltipvalue}> <Badge status={colormap.get(state)} />{state}</span>
                      </li>
                      <li style={{ margin: '12px 0' }}>
                        <span>召测时间:</span>
                        <span className={styles.tooltipvalue}>{date}</span>
                      </li>
                      <li style={{ margin: '12px 0' }}>
                        <span>IP地址:</span>
                        <span className={styles.tooltipvalue}>{ip}</span>
                      </li>
                    </ul>
                  </div>
                );
              }}
            </Tooltip>
            <Geom
              type="edge"
              position="x*y"
              shape="line"
              color={['state', (state) => {
                return linecolormap.get(state);
              }]}
              opacity={0.8}
            />
          </View>
          <View
            data={dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              statetrue: !!(node.data.state === '失败'),
              area: node.data.area,
              ip: node.data.ip,
              state: node.data.state,
              x: node.x,
              y: node.y,
            }))}
          >
            <Point
              position="x*y"
              color={['state', (state) => {
                return linecolormap.get(state);
              }]}
              label={[
                'area*state*hasChildren',
                (area, state, hasChildren) => {
                  if (hasChildren === false) {
                    return {
                      content: `${area}(召测${state})`,
                      style: {
                        fill: `${linecolormap.get(state)}`,
                      },
                    };
                  }
                  return {
                    content: `${area}`,
                    style: {
                      fill: '#444',
                    },
                    offset: '-10',
                  };
                },
              ]}
              tooltip={false}
            />
          </View>
          <Legend visible={false} />
        </Chart>
      </div>
    );
  }
}

export default EdgeLine;
