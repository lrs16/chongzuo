/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
// import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Empty, Spin, Card, Form, Input, Button, DatePicker, Table } from 'antd';
import Columnar from '@/components/CustomizeCharts/Columnar';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

const dataArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.rate = Math.floor(datas[i].rate * 100);
    vote.type = datas[i].area.substring(0, 2);
    newArr.push(vote);
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
    vote.clock = moment(datas[i].date).format('HH');
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
const Tablecols = {
  clock: {
    min: 0,
    range: [0.02, 0.95],
    alias: '时刻',
    tickCount: 24,
  },
  value: {
    min: 0,
    range: [0, 0.9],
    alias: '入库数量',
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
    const thehours = dataLine(thehour);
    // console.log(operatingmode);
    return (
      <PageHeaderWrapper title="终端在线和入库">
        <h3>终端在线</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {(operatingmodes.length === 0 || operatingmode === undefined) && (
              <Empty style={{ height: '250px' }} />
            )}
            {operatingmodes.length > 0 && (
              <Columnar
                data={operatingmodes}
                height={350}
                scale={scale}
                padding={[60, 20, 40, 60]}
              />
            )}
          </Spin>
        </ChartCard>
        <h3>入库核查</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {storagechecks.length === 0 && <Empty style={{ height: '250px' }} />}
            {storagechecks.length > 0 && (
              <SeriesLine
                cols={Tablecols}
                data={storagechecks}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            )}
          </Spin>
        </ChartCard>
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
