import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const ringtypemap = [
  { key: 'fgl', value: '覆盖率' },
  { key: 'cbl', value: '自动抄表率' },
  { key: 'wzl', value: '采集完整率' },
];
const areatypemap = [
  { key: 3, value: '地市' },
  { key: 4, value: '县级' },
];
const statisticstypemap = [
  { key: 'bdz', value: '变电站' },
  { key: 'dy', value: '低压' },
  { key: 'dfdc', value: '地方电厂' },
  { key: 'gb', value: '公变' },
  { key: 'tddc', value: '统调电厂' },
  { key: 'zb', value: '专变' },
];

const toTime = moment().format('YYYY-MM-DD');

@connect(({ indicatorchain, loading }) => ({
  indicatorchain,
  loading: loading.models.indicatorchain,
}))
class IndicatorChain extends Component {
  state = {
    current: 1,
    pageSize: 10,
    ringname: 'fgl',
  };

  componentDidMount() {
    const currentPage = this.state.current;
    const pageSize = this.state.pageSize;
    this.getdata(currentPage, pageSize);
  }

  getdata = (currentPage, pageSize) => {
    this.props.dispatch({
      type: 'indicatorchain/fetchzbhblist',
      payload: {
        gddwmc: '',
        gldwlxbm: '',
        lb: '',
        mc: 'fgl',
        sjsj: '',
        pageSize,
        currentPage,
      },
    });
  };

  searchdata = (values, currentPage, pageSize) => {
    const { sjsj } = values;
    if (sjsj === undefined || sjsj === null) {
      this.props.dispatch({
        type: 'indicatorchain/fetchzbhblist',
        payload: {
          ...values,
          sjsj: '',
          pageSize,
          currentPage,
        },
      });
    } else {
      this.props.dispatch({
        type: 'indicatorchain/fetchzbhblist',
        payload: {
          ...values,
          sjsj: sjsj.format('YYYY-MM-DD'),
          pageSize,
          currentPage,
        },
      });
    }
  };

  handleringtypeChange = value => {
    setTimeout(() => {
      this.setState({ ringname: value });
    }, 0);
  };

  handleSearch = () => {
    const currentPage = 1;
    const pageSize = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.searchdata(values, currentPage, pageSize);
      this.setState({ current: 1 });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleextractData = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'indicatorchain/fetchextractData',
    }).then(res => {
      if (res.code === 200) {
        Message.success('抽数成功');
      } else {
        Message.error('抽数失败');
      }
    });
  };

  handleDownload = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { gddwmc, gldwlxbm, lb, mc, sjsj } = values;
      const { dispatch } = this.props;
      if (sjsj === undefined || sjsj === null) {
        return dispatch({
          type: 'indicatorchain/downloads',
          payload: {
            ...values,
            sjsj: '',
          },
        }).then(() => {
          const url = `/monitor/kpiData/download?gddwmc=${gddwmc}&gldwlxbm=${gldwlxbm}&lb=${lb}&mc=${mc}&sjsj=`;
          window.location.href = url;
        });
      } else {
        return dispatch({
          type: 'indicatorchain/downloads',
          payload: {
            ...values,
            sjsj: sjsj.format('YYYY-MM-DD'),
          },
        }).then(() => {
          const url = `/monitor/kpiData/download?gddwmc=${gddwmc}&gldwlxbm=${gldwlxbm}&lb=${lb}&mc=${mc}&sjsj=${sjsj}`;
          window.location.href = url;
        });
      }
    });
  };

  changePage = page => {
    const pageSize = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.searchdata(values, page, pageSize);
      }
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.searchdata(values, current, pageSize);
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
        title: '供电单位编码',
        dataIndex: 'gddwbm',
        key: 'gddwbm',
        width: 118,
      },
      {
        title: '供电单位名称',
        dataIndex: 'gddwmc',
        key: 'gddwmc',
        width: 220,
      },
      {
        title: '单位类型名称',
        dataIndex: 'gldwlxmc',
        key: 'gldwlxmc',
        width: 120,
      },
      {
        title: '指标名称',
        dataIndex: 'mc',
        key: 'mc',
        width: 120,
      },
      {
        title: '统计类别',
        dataIndex: 'lb',
        key: 'lb',
        width: 120,
      },

      {
        title: '分子',
        dataIndex: 'fz',
        key: 'fz',
        width: 80,
      },
      {
        title: '分母',
        dataIndex: 'fm',
        key: 'fm',
        width: 80,
      },
      {
        title: '百分比',
        dataIndex: 'bfb',
        key: 'bfb',
        width: 80,
      },
      {
        title: '今日昨日差值',
        dataIndex: 'zrhb',
        key: 'zrhb',
        width: 120,
      },
      {
        title: '今日前日差值',
        dataIndex: 'qrhb',
        key: 'qrhb',
        width: 120,
      },
      {
        title: '昨日前日差值',
        dataIndex: 'qlrhb',
        key: 'qlrhb',
        width: 120,
      },
      {
        title: '数据时间',
        dataIndex: 'sjsj',
        key: 'sjsj',
        width: 180,
      },
    ];

    const {
      loading,
      indicatorchain: { data },
    } = this.props;
    const dataSource = data.records;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      onChange: page => this.changePage(page),
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderWrapper title="指标环比数据">
        <Card>
          <Form {...formItemLayout}>
            <Row>
              <Col span={8}>
                <Form.Item label="供电单位">
                  {getFieldDecorator('gddwmc', { initialValue: '' })(
                    <Input placeholder="请输入" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('mc', {
                    initialValue: 'fgl',
                  })(
                    <Select onChange={this.handleringtypeChange}>
                      {ringtypemap.map(({ key, value }) => [
                        <Option key={key} value={key}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="统计类别">
                  {getFieldDecorator('lb', { initialValue: '' })(
                    <Select placeholder="请选择">
                      {statisticstypemap.map(({ key, value }) => [
                        <Option key={key} value={key}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="管理单位">
                  {getFieldDecorator('gldwlxbm', { initialValue: '' })(
                    <Select placeholder="请选择">
                      {areatypemap.map(({ key, value }) => [
                        <Option key={key} value={key}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="数据时间">
                  {getFieldDecorator(
                    'sjsj',
                    //  { initialValue: moment(toTime) }
                  )(<DatePicker />)}
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重 置
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleDownload}>
                  下 载
                </Button>
                <Button style={{ marginLeft: 8 }} type="link" onClick={this.handleextractData}>
                  抽 数
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Table
          scroll={{ x: 1400 }}
          style={{ marginTop: 24, background: '#fff' }}
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(IndicatorChain);
