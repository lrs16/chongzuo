import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import { Chart, Line, Point, Tooltip, Axis, Legend, } from 'bizcharts';
import DataSet from '@antv/data-set';
import { uniqueItem, ObjkeyToArr } from '@/utils/Regexp';
import styles from './index.less';

const axisConfig = {
  label: {
    style: {
      textAlign: 'center',
    }, // 设置坐标轴文本样式
  },
  line: {
    style: {
      stroke: '#ccc',
      lineDash: [3, 3],
    }, // 设置坐标轴线样式
  },
  grid: {
    line: {
      style: {
        stroke: '#ccc',
        lineDash: [3, 3],
      },
    }, // 设置坐标系栅格样式
  },
};

const tickLine = {
  style: {
    lineWidth: 1, // 刻度线宽
    stroke: '#bbb', // 刻度线的颜色
  },
  length: 12, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
}

function SmoothLine(props) {
  const { data, cols, height, padding, onGetVal, uncheckedname, colors, lock } = props;
  const [legendItem, setlegendItem] = useState(null);
  const [pointSize, setPointSize] = useState(0);

  const dv = new DataSet.View().source(data);
  // dv.transform({
  //   type: 'sort-by',
  //   fields: ['name'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
  //   //  order: 'ASC', // 默认为 ASC，DESC 则为逆序
  // });
  const indexcolors = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3']
  const ChangeItem = (item) => {
    const newArr = [];
    if (data && item) {
      const keyItem = uniqueItem(data, 'name');
      for (let i = 0; i < keyItem.length; i += 1) {
        const vote = {};
        vote.id = keyItem[i].name;
        vote.name = keyItem[i].name;
        vote.value = keyItem[i].name;
        vote.marker = {
          symbol: "circle",
          style: { fill: colors?.[i] || indexcolors[i], r: 5 },
        };
        if (item && item.length > 0) {
          const fineName = item.indexOf(keyItem[i].name);
          if (fineName > -1) {
            vote.unchecked = true;
          } else {
            vote.unchecked = false;
          }
        } else {
          vote.unchecked = false;
        }
        newArr.push(vote);
      }
    };
    setlegendItem(newArr);
    setPointSize(newArr)
  };

  useEffect(() => {
    if (data && data.length) {
      ChangeItem(uncheckedname || ['总数']);
    }
  }, [data]);

  return (
    <Chart padding={padding} scale={cols} autoFit height={height} data={data}
      onClick={ev => {
        const linkdata = ev.data;
        if (linkdata && linkdata.data && !Array.isArray(linkdata.data) && onGetVal) {
          setTimeout(() => {
            onGetVal(linkdata.data)
          }, 200)
        }
      }}
      onDoubleClick={ev => {
        const linkdata = ev.data;
        if (linkdata && linkdata.data && !Array.isArray(linkdata.data) && onGetVal) {
          onGetVal(linkdata.data)
        }
      }}
    >
      <Legend
        name="name"
        position="bottom"
        title={null}
        dx={20}
        items={legendItem}
      />
      <Legend name="date" visible={false} />
      <Legend name="value" visible={false} />
      <Line
        shape="smooth"
        position="date*value"
        color="name"
        size={['name', (name) => {
          const arr = pointSize.filter(item => !item.unchecked);
          const newArr = ObjkeyToArr(arr, 'name');
          if (newArr && Array.isArray(newArr) && newArr.indexOf(name) > -1) {
            return 2;
          }
          return 0;
        }]}
      />
      <Point
        position="date*value"
        color="name"
        shape="circle"
        size={['name', (name) => {
          const arr = pointSize.filter(item => !item.unchecked);
          const newArr = ObjkeyToArr(arr, 'name')
          if (newArr && Array.isArray(newArr) && newArr.indexOf(name) > -1) {
            return 3;
          }
          return 0;
        }]}
      />
      {lock ? (
        <Tooltip shared showCrosshairs lock >
          {
            (name, items) => {
              return <div>
                <div style={{ margin: '10px 0' }}>
                  {name}
                </div>
                <ul className={styles.tooltipul}>
                  {
                    items.map(it => {
                      return (
                        <li
                          onClick={() => {
                            if (onGetVal && it?.data) {
                              setTimeout(() => { onGetVal(it.data) }, 200)
                            }
                          }}
                          onDoubleClick={() => {
                            if (onGetVal && it?.data) {
                              onGetVal(it.data)
                            }
                          }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 8, background: it.mappingData.color }} />
                          <span style={{ pointerEvents: 'none' }}>{it.data.name}</span>
                          <span style={{ display: 'inline-block', float: 'right', marginLeft: 30 }}>{it.data.value}</span>
                        </li>)
                    })
                  }
                </ul>
              </div>
            }
          }
        </Tooltip>
      ) : (
        <Tooltip shared showCrosshairs >
          {
            (name, items) => {
              const show = legendItem.findIndex(obj => obj.id === name && !obj.unchecked);
              return (
                <>
                  {show && (<div>
                    <div style={{ margin: '10px 0' }}>{name}</div>
                    <ul className={styles.tooltipul}>
                      {
                        items.map(it => {
                          return (
                            <>
                              <li
                                onClick={() => {
                                  if (onGetVal && it?.data) {
                                    setTimeout(() => { onGetVal(it.data) }, 200)
                                  }
                                }}
                                onDoubleClick={() => {
                                  if (onGetVal && it?.data) {
                                    onGetVal(it.data)
                                  }
                                }}
                              >
                                <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 8, background: it.mappingData.color }} />
                                <span style={{ pointerEvents: 'none' }}>{it.data.name}</span>
                                <span style={{ display: 'inline-block', float: 'right', marginLeft: 30 }}>{it.data.value}</span>
                              </li>
                            </>)
                        })
                      }
                    </ul>
                  </div>)}
                </>
              )
            }
          }
        </Tooltip>
      )}

      <Axis name="date"  {...axisConfig} tickLine={tickLine} label={{ offset: 25 }} />
      <Axis name="value"   {...axisConfig} label={{ offset: 10 }} />
      {lock && <span style={{ position: 'absolute', top: 0, right: 0 }}> <Icon type="info-circle" style={{ marginRight: 8 }} />单击标尺参考线锁定/解锁提示信息</span>}
    </Chart>
  );
}

export default SmoothLine;
