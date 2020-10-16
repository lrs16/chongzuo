import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;
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

@connect(({ indicatorchain, loading }) => ({
  indicatorchain,
  loading: loading.models.indicatorchain,
}))
class IndicatorChain extends Component {
  state = {
    current: 1,
    pageSize: 10,
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
        pageSize,
        currentPage,
      },
    });
  };

  seacherdata = (values, currentPage, pageSize) => {
    const { gddwmc, gldwlxbm, lb, mc } = values;
    this.props.dispatch({
      type: 'indicatorchain/fetchzbhblist',
      payload: {
        gddwmc,
        gldwlxbm,
        lb,
        mc,
        pageSize,
        currentPage,
      },
    });
  };

  handleSearch = () => {
    const currentPage = this.state.current;
    const pageSize = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.seacherdata(values, currentPage, pageSize);
      }
    });
  };

  handleextractData = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'indicatorchain/fetchextractData',
    }).then(res => {
      if (res.code === 200) {
        Message.success('抽数失败');
      } else {
        Message.error('抽数失败');
      }
    });
  };

  changePage = page => {
    const pageSize = this.state.pageSize;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.seacherdata(values, page, pageSize);
      }
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.seacherdata(values, current, pageSize);
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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '管理单位类型',
        dataIndex: 'gldwlxbm',
        key: 'gldwlxbm',
      },
      {
        title: '指标名称',
        dataIndex: 'mc',
        key: 'mc',
        width: 110,
      },
      {
        title: '统计类别',
        dataIndex: 'lb',
        key: 'lb',
      },
      {
        title: '供电单位编码',
        dataIndex: 'gddwbm',
        key: 'gddwbm',
      },
      {
        title: '分子',
        dataIndex: 'fz',
        key: 'fz',
      },
      {
        title: '分母',
        dataIndex: 'fm',
        key: 'fm',
      },
      {
        title: '百分比',
        dataIndex: 'bfb',
        key: 'bfb',
      },
      {
        title: '今日昨日差值',
        dataIndex: 'zrhb',
        key: 'zrhb',
      },
      {
        title: '今日前日差值',
        dataIndex: 'qrhb',
        key: 'qrhb',
      },
      {
        title: '昨日前日差值',
        dataIndex: 'qlrhb',
        key: 'qlrhb',
      },
      {
        title: '管理单位类型名称',
        dataIndex: 'gldwlxmc',
        key: 'gldwlxmc',
      },
      {
        title: '供电单位名称',
        dataIndex: 'gddwmc',
        key: 'gddwmc',
      },
      {
        title: '数据时间',
        dataIndex: 'sjsj',
        key: 'sjsj',
        width: 120,
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
                <Form.Item label="供电单位名称">
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
              {this.state.mc !== '覆盖率' && (
                <>
                  <Col span={8}>
                    <Form.Item label="管理单位类型编码">
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
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={this.handleSearch}>
                      查 询
                    </Button>
                    <Button style={{ marginLeft: 8 }}>重 置</Button>
                    <Button style={{ marginLeft: 8 }} type="link">
                      抽 数
                    </Button>
                  </Col>
                </>
              )}
              {this.state.mc === '覆盖率' && (
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.handleSearch}>
                    查 询
                  </Button>
                  <Button style={{ marginLeft: 8 }}>重 置</Button>
                  <Button style={{ marginLeft: 8 }} type="link">
                    抽 数
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
        <Table
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
