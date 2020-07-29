/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  View,
  Legend,
  //  Interaction
} from 'bizcharts';
import styles from './index.less';

const alertvalues = [
  { alertvalue: 27000, date: '07/17', alert: false },
  { alertvalue: 30000, date: '07/16', alert: true },
  { alertvalue: 27000, date: '07/15', alert: false },
  { alertvalue: 27000, date: '07/14', alert: false },
  { alertvalue: 27000, date: '07/13', alert: false },
  { alertvalue: 28000, date: '07/12', alert: false },
  { alertvalue: 27000, date: '07/11', alert: false },
  { alertvalue: 29000, date: '07/10', alert: true },
  { alertvalue: 29000, date: '07/09', alert: true },
  { alertvalue: 27000, date: '07/08', alert: false },
  { alertvalue: 27000, date: '07/07', alert: false },
  { alertvalue: 27000, date: '07/04', alert: false },
];
class Labelline extends Component {
  render() {
    const { height, padding, data, cols } = this.props;
    return (
      <>
        <Chart height={height} padding={padding} scale={cols} autoFit>
          <Axis
            name="date"
            grid={{
              line: {
                type: 'circle',
              },
              closed: false,
            }}
          />
          <Axis name="alertvalue" visible={false} />
          <Axis name="value" visible={false} />
          <Legend visible={false} />
          {/* <Tooltip shared showMarkers/> */}
          <Tooltip shared>
            {(title, items) => {
              // const {color}=items[0];
              // items 是个数组，即被触发tooltip的数据。
              // 获取items的颜色
              // const {color} = items[0];
              const alertvalue = items[0].value;
              const { alert } = items[0].data;
              const { value } = items[1];
              const differ = alertvalue - value;
              return (
                <div style={{ padding: '15px 5px' }}>
                  <div>{title}</div>
                  <ul className={styles.tooltipul}>
                    <li style={{ margin: '12px 0' }}>
                      <span
                        style={{ background: `${items[0].color}` }}
                        className={styles.tooltipico}
                      />
                      <span>警戒值:</span>
                      <span className={styles.tooltipvalue}>{alertvalue}</span>
                    </li>
                    <li style={{ margin: '12px 0' }}>
                      <span
                        style={{ background: `${items[1].color}` }}
                        className={styles.tooltipico}
                      />
                      <span>value:</span>
                      <span className={styles.tooltipvalue}>{value}</span>
                    </li>
                    {alert === true && (
                      <li>
                        <span style={{ background: '#f7c42e' }} className={styles.tooltipico} />
                        <span>差值:</span>
                        <span className={styles.tooltipvalue}>{differ}</span>
                      </li>
                    )}
                  </ul>
                </div>
              );
            }}
          </Tooltip>
          {/* <Interaction type="element-single-selected"/>  */}
          <View data={alertvalues} padding={0} animate>
            <Coordinate
              type="polar"
              startAngle={Math.PI} // 起始角度
              endAngle={Math.PI * (4 / 2)} // 结束角度
            />

            <Interval
              position="date*alertvalue"
              adjust="stack"
              color="#ff0000"
              element-highlight
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              animate={{
                appear: {
                  duration: 1000,
                  delay: 1000,
                },
                enter: {
                  duration: 1000, // enter 动画执行时间
                  delay: 600,
                },
                update: {
                  duration: 1000, // enter 动画执行时间
                  delay: 600,
                },
                leave: false, // 关闭 leave 销毁动画
              }}
            />
          </View>
          <View data={data} padding={0} animate>
            <Coordinate
              type="polar"
              startAngle={Math.PI} // 起始角度
              endAngle={Math.PI * (4 / 2)} // 结束角度
            />
            <Interval
              position="date*value"
              adjust="stack"
              color={['value', '#3ba1ff-#d0dffd']}
              element-highlight
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              label={[
                'value',
                {
                  offset: -15,
                  style: {
                    textAlign: 'center',
                    fill: '#000',
                  },
                },
              ]}
              animate={{
                appear: {
                  duration: 1000,
                  delay: 2000,
                },
                enter: {
                  duration: 1000, // enter 动画执行时间
                  delay: 600,
                },
                update: {
                  duration: 1000, // enter 动画执行时间
                  delay: 600,
                },
                leave: false, // 关闭 leave 销毁动画
              }}
            />
          </View>
        </Chart>
      </>
    );
  }
}

export default Labelline;
