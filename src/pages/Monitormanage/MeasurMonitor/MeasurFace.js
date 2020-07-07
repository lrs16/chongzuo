import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Switch, Select, Button } from 'antd';
import { ChartCard } from '@/components/Charts';
import Donut from '@/components/CustomizeCharts/Donut';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import EdgeLine from '@/components/CustomizeCharts/EdgeLine';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import LineChart from '@/components/CustomizeCharts/LineChart';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const changearchdata = datas => {
  const arr = Object.values(datas);
  const newArrs = []; // 新的数组格式
  if (!Array.isArray(arr)) {
    return newArrs;
  }
  for (let i = 0; i < arr.length; i += 1) {
    const arrss = arr[i];
    for (let t = 0; t < arrss.length; t += 1) {
      const vote = {};
      vote.clock = moment(arrss[t].date).format('HH');
      vote.alert = arrss[t].flag;
      vote.value = arrss[t].total;
      vote.name = arrss[t].type;
      newArrs.push(vote);
      // newArrs.push(arrss[t]);
    }
  }

  return newArrs;

  // console.log(newArrs);
};
const Filecontent = '阈值：电能表<2000   终端<1000   采集关系<10000';
const Tablecontent = '理论值曲线';
const Donutdata = [
  {
    type: '已处理',
    count: 600,
  },
  {
    type: '未处理',
    count: 200,
  },
  {
    type: '处理中',
    count: 100,
  },
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
@connect(({ measurface, loading }) => ({
  measurface,
  loading: loading.models.measurface,
}))
class MeasurFace extends Component {
  state = {
    selectedItems: [],
  };

  componentDidMount() {
    this.getsettl();
    this.getarch();
    this.getissue();
    this.getfile();
    this.gettable();
    this.getorder();
  }

  getsettl() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchsettl',
    });
  }

  getarch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetcharch',
    });
  }

  getissue() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchissue',
    });
  }

  getfile() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchfile',
    });
  }

  gettable() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchtable',
    });
  }

  getorder() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchorder',
    });
  }

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const {
      loading,
      measurface: { settldata, archdata, issuedata, filetdata, tabledata, orderdata },
    } = this.props;

    const archdatas = changearchdata(archdata);
    const { selectedItems } = this.state;
    const filteredOptions = selectdtats.filter(o => !selectedItems.includes(o));
    return (
      <PageHeaderWrapper title="接口数据核查情况">
        <div>
          <Row gutter={24} type="flex">
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="抄表结算接口">
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
                <Donut data={Donutdata} height={350} padding={[0, 0, 0, 0]} />
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
                  data={archdatas}
                  content={Filecontent}
                  Color={Filecolor}
                  height={350}
                  padding={[30, 20, 70, 80]}
                />
              </ChartCard>
            </Col>
            {/* <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
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
                <Button type="primary">手工召测</Button>
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
          </Col> */}
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default MeasurFace;
