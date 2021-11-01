/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
// import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Empty, Spin, Card, Form, Input, Button, DatePicker, Table } from 'antd';
// import Columnar from '@/components/CustomizeCharts/Columnar';
import GroupColumnar from '@/components/CustomizeCharts/GroupColumnar';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

const tjsj = {
  xzl: '', // 在线率 统计时间
  xzl_sjsj: '', // 在线率 数据时间
};

const dataArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.rate = datas[i].zbzxl; // Math.floor(datas[i].rate * 100);
    vote.type = '专变';
    vote.name = datas[i].gddwmc.substring(0, 2);
    newArr.push(vote);

    const gbzxl = {};
    gbzxl.rate = datas[i].gbzxl; // Math.floor(datas[i].rate * 100);
    gbzxl.type = '公变'; // Math.floor(datas[i].rate * 100);
    gbzxl.name = datas[i].gddwmc.substring(0, 2);
    newArr.push(gbzxl);

    const dyzxl = {};
    dyzxl.rate = datas[i].dyzxl; // Math.floor(datas[i].rate * 100);
    dyzxl.type = '低压'; // Math.floor(datas[i].rate * 100);
    dyzxl.name = datas[i].gddwmc.substring(0, 2);
    newArr.push(dyzxl);

    const czzxl = {};
    czzxl.rate = datas[i].czzxl; // Math.floor(datas[i].rate * 100);
    czzxl.type = '厂站'; // Math.floor(datas[i].rate * 100);
    czzxl.name = datas[i].gddwmc.substring(0, 2);
    newArr.push(czzxl);
  }
  if (datas.length > 0) {
    tjsj.xzl = datas[0].cjsj;
    tjsj.xzl_sjsj = moment(datas[0].sjsj).format('YYYY-MM-DD');
  }
  return newArr;
};
const dataLine = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = parseInt(datas[i].value);
    vote.name = datas[i].type;
    vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
    newArr.push(vote);
  }

  return newArr;
};

const scale = {
  rate: {
    min: 0,
    max: 100,
    range: [0, 1],
    alias: '终端在线率',
  },
};

const Tablecolor = ['#4061d7', '#f00'];
@connect(({ databaseterminal, loading }) => ({
  databaseterminal,
  loading: loading.models.databaseterminal,
}))
class DatabaseTerminal extends Component {
  state = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 60000);
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.getdatas();
      router.push({
        pathname: `/monitormanage/measurmonitor/databaseterminal`,
        state: { cach: false, reset: false }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'databaseterminal/fetchoperat',
    });
    dispatch({
      type: 'databaseterminal/fetchstorge',
    });
    dispatch({
      type: 'databaseterminal/fetchthehour',
    });
  }

  handleSearch = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getdata(values, page, limit);
      }
    });
  };

  changePage = page => {
    const limit = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getdata(values, page, limit);
      }
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    const page = current;
    const limit = pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getdata(values, page, limit);
      }
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '入库数量',
        dataIndex: 'value',
        key: 'value',
      },
    ];
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      databaseterminal: {
        operatingmode,
        storagecheck,
        thehour,
        // list
      },
    } = this.props;

    const operatingmodes = dataArr(operatingmode);
    const storagechecks = dataLine(storagecheck);
    const thehours = {}; // dataLine(thehour);

    const minVal = (datas) => {
      let min = 15000000;
      if (!Array.isArray(datas)) {
        return min;
      }
      for (let i = 0; i < datas.length; i += 1) {
        const cur = datas[i].value;
        min = cur < min ? cur : min;
      }
      return min
    };

    const Tablecols = {
      clock: {
        min: 0,
        range: [0.02, 0.95],
        alias: '时刻',
        tickCount: 12,
      },
      value: {
        min: minVal(storagechecks),
        range: [0, 0.9],
        alias: '入库数量',
      },
    };

    return (
      <PageHeaderWrapper title="终端在线和入库">
        <h3>终端在线 {`${tjsj.xzl_sjsj}`}</h3>
        <ChartCard title={`统计时间 ${tjsj.xzl}`} contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {operatingmode && operatingmodes.length > 0 ? (
              <GroupColumnar
                data={operatingmodes}
                height={350}
                scale={scale}
                padding={[60, 20, 40, 60]}
              />
            ) : (<Empty style={{ height: '250px' }} />)}
          </Spin>
        </ChartCard>
        <h3>日冻结电能量(非厂站采集入库) 数量</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {storagechecks && storagechecks.length > 0 ? (
              <SeriesLine
                cols={Tablecols}
                data={storagechecks}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            ) : (<Empty style={{ height: '250px' }} />)}
          </Spin>
        </ChartCard>
        {/*
        <h3>入库数量（2-4时）</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {thehours.length === 0 && <Empty style={{ height: '250px' }} />}
            {thehours.length > 0 && (
              <SeriesLine
                cols={Tablecols}
                data={thehours}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            )}
          </Spin>
        </ChartCard>
        */}
        {/* <h3>入库量历史查询（5分钟入库量）</h3>
        <Card>
          <Row>
            <Form {...formItemLayout}>
              <Col span={10}>
              <Form.Item label="起止时间">
                {getFieldDecorator('timepicker')(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item>
              </Col>
              <Col span={8}>
              <Form.Item label="入库范围">
                {getFieldDecorator('minVal')(
                  <Input style={{width:60}}/>
                )}
                <span> -- </span>
                {getFieldDecorator('maxVal')(
                  <Input style={{width:60}}/>
                )}
              </Form.Item>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.handleSearch}>
                    查 询
                </Button>
                  <Button style={{ marginLeft: 8 }}>重 置</Button>
                </Col>
            </Form>
          </Row>
        </Card> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(DatabaseTerminal);
