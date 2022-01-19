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
  // const [pieColor, setPieColor] = useState('');
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

  // useEffect(() => {
  //   if (staticName === '故障工单超时情况') {
  //     const value = Object.values(dv.rows)[0];
  //     switch (value.type) {
  //       case '已超时':
  //         setPieColor('#FF0000');
  //         break;
  //       case '未超时':
  //         setPieColor('#008000');
  //         break;
  //       case '即将超时':
  //         setPieColor('#FFFF00');
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }, [staticName]);

  return (
    <div>
      <div
        style={{ position: 'absolute', left: '50%', top: '40%', width: 100, textAlign: 'center', marginLeft: '-50px', zIndex: 9999 }}
      >
        <span style={{ fontSize: 24, fontWeight: 700 }}>
          {totaltitle ? (<a onClick={() => {
            setTimeout(() => {
              switch (staticName) {
                case '故障责任单位情况':
                  handleGetDrawerVal({ staticName: 'blametotal', time1, time2, drawtitle: '故障总数' });
                  break;
                case '故障类型总情况':
                  handleGetDrawerVal({ staticName: 'typetotal', time1, time2, drawtitle: '故障总数' });
                  break;
                case '硬件故障情况':
                  handleGetDrawerVal({ staticName: 'hardwaretotal', time1, time2, drawtitle: '硬件故障总数' });
                  break;
                case '软件故障情况':
                  handleGetDrawerVal({ staticName: 'softwaretotal', time1, time2, drawtitle: '软件故障总数' });
                  break;
                case '故障系统模块情况':
                  handleGetDrawerVal({ staticName: 'worksystemtotal', time1, time2, drawtitle: '总工单数' });
                  break;
                case '故障工单超时情况':
                  handleGetDrawerVal({ staticName: 'timeouttotal', time1, time2, drawtitle: '总工单数' });
                  break;
                default:
                  break;
              }
              // if (onGettotalVal) {
              //   onGettotalVal(staticName)
              // }
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
              handleGetDrawerVal({ ...linkdata.data, staticName, drawtitle: linkdata.data.type });
            }
            if (linkdata && linkdata._origin && onGetVal) {
              onGetVal(linkdata._origin);
              handleGetDrawerVal({ ...linkdata._origin, staticName, drawtitle: linkdata._origin.type });
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
          avoidLabelOverlap
          // color={staticName === '故障工单超时情况' ? pieColor : 'type'}
          color={staticName === '故障工单超时情况' ? ['type', ['#008000', '#FF0000']] : 'type'}
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
              offset: '20',
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
