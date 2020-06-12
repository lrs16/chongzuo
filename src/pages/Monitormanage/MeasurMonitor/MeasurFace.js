import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Tooltip, Switch, Select, Button } from 'antd';
import { ChartCard } from '@/components/Charts';
import Donut from '@/components/CustomizeCharts/Donut';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import EdgeLine from '@/components/CustomizeCharts/EdgeLine';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import LineChart from '@/components/CustomizeCharts/LineChart';

const Donuttotal = 10000;
const Filecontent = '阈值：电能表<2000   终端<1000   采集关系<10000';
const Tablecontent = '理论值曲线';
const Donutdata = [
  {
    item: '配网入库',
    count: 600,
  },
  {
    item: '采集指标',
    count: 200,
  },
  {
    item: '接口程序',
    count: 100,
  },
];
const Filedatas = [
  { name: '电能表', clock: 1, value: 1100, alert: false },
  { name: '电能表', clock: 2, value: 1500, alert: false },
  { name: '电能表', clock: 3, value: 2500, alert: true },
  { name: '电能表', clock: 4, value: 3500, alert: true },
  { name: '电能表', clock: 5, value: 4522, alert: true },
  { name: '电能表', clock: 6, value: 4562, alert: true },
  { name: '电能表', clock: 7, value: 1990, alert: false },
  { name: '电能表', clock: 8, value: 4568, alert: true },
  { name: '电能表', clock: 9, value: 1800, alert: false },
  { name: '电能表', clock: 10, value: 3599, alert: true },
  { name: '电能表', clock: 11, value: 1999, alert: false },
  { name: '电能表', clock: 12, value: 2001, alert: true },
  { name: '电能表', clock: 13, value: 1100, alert: false },
  { name: '电能表', clock: 14, value: 1500, alert: false },
  { name: '电能表', clock: 15, value: 2500, alert: true },
  { name: '电能表', clock: 16, value: 3500, alert: true },
  { name: '电能表', clock: 17, value: 6520, alert: true },
  { name: '电能表', clock: 18, value: 2565, alert: true },
  { name: '电能表', clock: 19, value: 1990, alert: false },
  { name: '电能表', clock: 20, value: 4568, alert: true },
  { name: '电能表', clock: 21, value: 1800, alert: false },
  { name: '电能表', clock: 22, value: 3599, alert: true },
  { name: '电能表', clock: 23, value: 1999, alert: false },
  { name: '电能表', clock: 24, value: 2001, alert: true },
  { name: '终端', clock: 1, value: 990, alert: false },
  { name: '终端', clock: 2, value: 1150, alert: true },
  { name: '终端', clock: 3, value: 1500, alert: true },
  { name: '终端', clock: 4, value: 880, alert: false },
  { name: '终端', clock: 5, value: 750, alert: false },
  { name: '终端', clock: 6, value: 1150, alert: true },
  { name: '终端', clock: 7, value: 1500, alert: true },
  { name: '终端', clock: 8, value: 1620, alert: true },
  { name: '终端', clock: 9, value: 1300, alert: true },
  { name: '终端', clock: 10, value: 1850, alert: true },
  { name: '终端', clock: 11, value: 2500, alert: true },
  { name: '终端', clock: 12, value: 2750, alert: true },
  { name: '关系采集', clock: 1, value: 8800, alert: false },
  { name: '关系采集', clock: 2, value: 7500, alert: false },
  { name: '关系采集', clock: 3, value: 6400, alert: false },
  { name: '关系采集', clock: 4, value: 10000, alert: true },
  { name: '关系采集', clock: 5, value: 8500, alert: false },
  { name: '关系采集', clock: 6, value: 9900, alert: false },
  { name: '关系采集', clock: 7, value: 13000, alert: true },
  { name: '关系采集', clock: 8, value: 11000, alert: true },
  { name: '关系采集', clock: 9, value: 9500, alert: false },
  { name: '关系采集', clock: 10, value: 7500, alert: true },
  { name: '关系采集', clock: 11, value: 8000, alert: false },
  { name: '关系采集', clock: 12, value: 15000, alert: true },
];
const Issueddata = [
  { category: '正常', sold: 16000, alert: false },
  { category: '否认', sold: 15001, alert: true },
  { category: '无上下文报文', sold: 12200, alert: true },
  { category: '前置未返回', sold: 10900, alert: true },
  { category: '报文出错', sold: 7890, alert: true },
  { category: '空值', sold: 4200, alert: true },
  { category: '超时', sold: 2690, alert: true },
];
const Tabledatas = [
  { name: '未同步', clock: 1, value: 1100, alert: false },
  { name: '未同步', clock: 2, value: 1300, alert: false },
  { name: '未同步', clock: 3, value: 1000, alert: false },
  { name: '未同步', clock: 4, value: 1000, alert: false },
  { name: '未同步', clock: 5, value: 1000, alert: false },
  { name: '未同步', clock: 6, value: 1100, alert: false },
  { name: '未同步', clock: 7, value: 1250, alert: false },
  { name: '未同步', clock: 8, value: 990, alert: false },
  { name: '未同步', clock: 9, value: 1350, alert: false },
  { name: '未同步', clock: 10, value: 1550, alert: false },
  { name: '未同步', clock: 11, value: 1450, alert: false },
  { name: '未同步', clock: 12, value: 1350, alert: false },
  { name: '未同步', clock: 13, value: 1100, alert: false },
  { name: '未同步', clock: 14, value: 1500, alert: false },
  { name: '未同步', clock: 15, value: 1100, alert: false },
  { name: '未同步', clock: 16, value: 1100, alert: false },
  { name: '未同步', clock: 17, value: 990, alert: false },
  { name: '未同步', clock: 18, value: 1100, alert: false },
  { name: '未同步', clock: 19, value: 1350, alert: false },
  { name: '未同步', clock: 20, value: 1500, alert: false },
  { name: '未同步', clock: 21, value: 1450, alert: false },
  { name: '未同步', clock: 22, value: 1400, alert: false },
  { name: '未同步', clock: 23, value: 1350, alert: false },
  { name: '未同步', clock: 24, value: 1300, alert: false },
  { name: '基准值', clock: 1, value: 1400, alert: false },
  { name: '基准值', clock: 2, value: 1350, alert: false },
  { name: '基准值', clock: 3, value: 1300, alert: false },
  { name: '基准值', clock: 4, value: 1250, alert: false },
  { name: '基准值', clock: 5, value: 1200, alert: false },
  { name: '基准值', clock: 6, value: 1150, alert: false },
  { name: '基准值', clock: 7, value: 1100, alert: false },
  { name: '基准值', clock: 8, value: 1050, alert: false },
  { name: '基准值', clock: 9, value: 1000, alert: false },
  { name: '基准值', clock: 10, value: 1100, alert: false },
  { name: '基准值', clock: 11, value: 1150, alert: false },
  { name: '基准值', clock: 12, value: 1200, alert: false },
  { name: '基准值', clock: 13, value: 1250, alert: false },
  { name: '基准值', clock: 14, value: 1300, alert: false },
  { name: '基准值', clock: 15, value: 1350, alert: false },
  { name: '基准值', clock: 16, value: 1250, alert: false },
  { name: '基准值', clock: 17, value: 1200, alert: false },
  { name: '基准值', clock: 18, value: 1150, alert: false },
  { name: '基准值', clock: 19, value: 1300, alert: false },
  { name: '基准值', clock: 20, value: 1150, alert: false },
  { name: '基准值', clock: 21, value: 1300, alert: false },
  { name: '基准值', clock: 22, value: 1250, alert: false },
  { name: '基准值', clock: 23, value: 1000, alert: false },
  { name: '基准值', clock: 24, value: 1000, alert: false },
];
const selectdtats = [
  '南宁供电局',
  '柳州供电局',
  '桂林供电局',
  '贵港供电局',
  '梧州供电局',
  '河池供电局',
];
const LineChartData = [
  { clock: '1', value: 5, 警戒值: 10, alert: false },
  { clock: '2', value: 8, 警戒值: 10, alert: false },
  { clock: '3', value: 11, 警戒值: 10, alert: true },
  { clock: '4', value: 9, 警戒值: 10, alert: false },
  { clock: '5', value: 9, 警戒值: 10, alert: false },
  { clock: '6', value: 5, 警戒值: 10, alert: false },
  { clock: '7', value: 6, 警戒值: 10, alert: false },
  { clock: '8', value: 7, 警戒值: 10, alert: false },
  { clock: '9', value: 12, 警戒值: 10, alert: true },
  { clock: '10', value: 13, 警戒值: 10, alert: true },
  { clock: '11', value: 14, 警戒值: 10, alert: true },
  { clock: '12', value: 15, 警戒值: 10, alert: true },
];
// 有用
const Filecols = {
  clock: {
    min: 1,
    max: 24,
    range: [0.05, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    // max:17500,
    range: [0, 0.9],
    alias: '待同步档案数量',
    tickInterval: 2500,
  },
};
const Issuedscale = {
  sold: {
    type: 'linear',
    alias: '返回结果数量',
    min: 0,
    max: 17000,
    tickInterval: 1000,
  },
};
const Tablecols = {
  clock: {
    min: 1,
    max: 24,
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    max: 5000,
    range: [0, 0.9],
    alias: '主表未同步数据量',
    tickInterval: 1000,
  },
};
const timecols = {
  value: {
    min: 0,
    max: 50,
    range: [0, 1],
    alias: '超时记录数',
  },
  clock: {
    max: 24,
    range: [0.02, 0.9],
    alias: '时刻',
    tickInterval: 2,
  },
  警戒值: {
    min: 0,
    max: 50,
    alias: '警戒值',
  },
};
const Filecolor = ['#1890ff', '#2fc25b', '#f00'];
const Tablecolor = ['#4061d7', '#bbb', '#f00'];
@connect(({ measur, loading }) => ({
  measur,
  loading: loading.models.measur,
}))
class MeasurFace extends Component {
  state = {
    selectedItems: [],
  };

  componentDidMount() {
    this.getSummondatas();
  }

  getSummondatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measur/fetchFacatdata',
    });
  }

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { measur = {} } = this.props;
    const { facadatas = {} } = measur;
    const treedata = facadatas;
    const { selectedItems } = this.state;
    const filteredOptions = selectdtats.filter(o => !selectedItems.includes(o));
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="登录检测">
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -18,
                  textAlign: 'right',
                }}
              >
                <span>开始/结束进程</span>
                <Switch
                  style={{ margin: '-5px 10px 0 10px' }}
                  checkedChildren="开"
                  unCheckedChildren="结"
                  defaultChecked
                />
                <span>5s/刷新</span>
              </div>
              <Donut data={Donutdata} content={Donuttotal} height={350} padding={[0, 0, 0, 0]} />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="档案同步接口（同步中间库）"
              action={
                <Tooltip title="指标说明:红点为超阈值数量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
            >
              <SeriesLine
                cols={Filecols}
                data={Filedatas}
                content={Filecontent}
                Color={Filecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="参考下发（1h/刷新）">
              <ColumnarY
                cols={Issuedscale}
                data={Issueddata}
                height={350}
                padding={[30, 30, 50, 90]}
              />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="1h/自动召测测试">
              <div style={{ margin: '50px 0 0 0' }}>
                <EdgeLine datas={treedata} height={300} padding={[0, 120, 0, 50]} />
              </div>
              <div style={{ margin: '10px', position: 'absolute', top: '-50px', zIndex: '100px' }}>
                <span>档案召测测试</span>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  value={selectedItems}
                  onChange={this.handleChange}
                  style={{ width: '300px', margin: '0 10px' }}
                >
                  {filteredOptions.map(item => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary">手工招测</Button>
              </div>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="测量点主表生成">
              <SeriesLine
                cols={Tablecols}
                data={Tabledatas}
                content={Tablecontent}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="费控指令-KAFKA指令超时">
              <LineChart
                height={350}
                data={LineChartData}
                cols={timecols}
                padding={[30, 30, 30, 75]}
              />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MeasurFace;
