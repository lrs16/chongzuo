/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  Chart,
  registerShape,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
  Legend
} from "bizcharts";
import DataSet from '@antv/data-set';
import ChartDrawer from '../ChartDrawer';

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const { points } = cfg;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path
      }
    });
  }
});

function DonutPCT(props) {
  const { data, total, totaltitle, height, padding, onGetVal, staticName, time1, time2 } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [drawerval, onGetDrawerVal] = useState('');
  const { DataView } = DataSet;
  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    groupBy: ['category'],
    as: 'percent',
  });

  const handleGetDrawerVal = val => {
    setVisible(!visible);
    onGetDrawerVal(val);
  };

  return (
    <div>
      <div
        style={{ position: 'absolute', left: '50%', top: '40%', width: 100, textAlign: 'center', marginLeft: '-50px', zIndex: 9999 }}
      >
        <span style={{ fontSize: 24, fontWeight: 700 }}>
          {totaltitle ? (<a onClick={() => {
            setTimeout(() => {
              switch (staticName) {
                case '需求工单总情况':
                  handleGetDrawerVal({ staticName: 'sumtotal', time1, time2, drawtitle: '需求总数' });
                  break;
                case '功能模块情况':
                  handleGetDrawerVal({ staticName: 'moduletotal', time1, time2, drawtitle: '需求总数' });
                  break;
                case '需求类型统计分析':
                  handleGetDrawerVal({ staticName: 'typetotal', time1, time2, drawtitle: '需求总数' });
                  break;
                case '需求工单超时情况':
                  handleGetDrawerVal({ staticName: 'timeouttotal', time1, time2, drawtitle: '需求总数' });
                  break;
                default:
                  break;
              }
            }, 200);
          }}>{total}</a>) : (<>{total}</>)}
        </span><br />
        <span>{totaltitle}</span>
      </div>
      <Chart
        pure
        height={height}
        data={dv.rows}
        padding={padding}
        autoFit
        onClick={ev => {
          setTimeout(() => {
            const linkdata = ev.data;
            if (linkdata && linkdata.data && onGetVal) {
              onGetVal(linkdata.data);
              handleGetDrawerVal({ ...linkdata.data, staticName, time1, time2, drawtitle: linkdata.data.type });
            }
            if (linkdata && linkdata._origin && onGetVal) {
              onGetVal(linkdata._origin);
              handleGetDrawerVal({ ...linkdata._origin, staticName, time1, time2, drawtitle: linkdata._origin.type });
            }
          }, 200);
        }}>
        <Coordinate type="theta" radius={0.8} innerRadius={0.7} />
        <Axis visible={false} />
        <Tooltip showTitle={false} />
        <Legend />
        <Interval
          position="value"
          adjust="stack"
          color={staticName === '需求工单超时情况' ? ['type', ['#008000', '#FFFF00', '#FF0000']] : 'type'}
          shape="sliceShape"
          label={[
            'value',
            {
              layout: {
                type: 'pie-spider',
              },
              type: 'pie',
              content: picdata => {
                return `${picdata.type}：${picdata.value}（ ${(picdata.percent * 100).toFixed(2)}% ）`;
              },
              offset: '25',
            },
          ]}
        />
        <Interaction type="element-single-selected" />
      </Chart>
      {/* 抽屉 */}
      <ChartDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        drawerdata={drawerval}
        destroyOnClose
      />
    </div>
  );
}

export default DonutPCT;
