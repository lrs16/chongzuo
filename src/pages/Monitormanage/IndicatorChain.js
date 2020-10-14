import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Button, Table, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const ringtypemap = [
  { key: 1, value: '覆盖率' },
  { key: 2, value: '抄表率' },
  { key: 3, value: '完整率' },
];
const areatypemap = [
  { key: 3, value: '地市' },
  { key: 4, value: '县级' },
];
const statisticstypemap = [
  { key: 1, value: '变电站' },
  { key: 2, value: '低压' },
  { key: 3, value: '地方电厂' },
  { key: 4, value: '公变' },
  { key: 5, value: '统调电厂' },
  { key: 6, value: '专变' },
];

@connect(({ indicatorchain, loading }) => ({
  indicatorchain,
  loading: loading.models.indicatorchain,
}))
class IndicatorChain extends Component {
  state = {
    current: 1,
    pageSize: 10,
    ringname: '覆盖率',
  };

  componentDidMount() {
    const ringtype = '覆盖率';
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.props.dispatch({
      type: 'indicatorchain/fetchfgllist',
      payload: {
        ringtype,
        page,
        limit,
      },
    });
  }

  getdata = (values, page, limit) => {
    const { areatype, company, ringtype, supplycompany, type } = values;
    const { dispatch } = this.props;
    switch (ringtype) {
      case '覆盖率':
        dispatch({
          type: 'indicatorchain/fetchfgllist',
          payload: {
            areatype,
            company,
            ringtype,
            supplycompany,
            type,
            page,
            limit,
          },
        });
        break;
      case '抄表率':
        dispatch({
          type: 'indicatorchain/fetchcbllist',
          payload: {
            areatype,
            company,
            ringtype,
            supplycompany,
            type,
            page,
            limit,
          },
        });
        break;
      case '完整率':
        dispatch({
          type: 'indicatorchain/fetchwzllist',
          payload: {
            areatype,
            company,
            ringtype,
            supplycompany,
            type,
            page,
            limit,
          },
        });
        break;
      default:
        break;
    }
  };

  handleringtypeChange = value => {
    setTimeout(() => {
      this.setState({ ringname: value });
    }, 0);
  };

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
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '管理单位',
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '指标名称',
        dataIndex: 'ringtype',
        key: 'ringtype',
      },
      {
        title: '统计类别',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '供电单位',
        dataIndex: 'supplycompany',
        key: 'supplycompany',
      },
      {
        title: '百分比',
        dataIndex: 'percentage',
        key: 'percentage',
      },
      {
        title: '今日差值',
        dataIndex: 'todaydifference',
        key: 'todaydifference',
      },
      {
        title: '昨日差值',
        dataIndex: 'yesterdaydifference',
        key: 'yesterdaydifference',
      },
    ];

    const {
      loading,
      indicatorchain: { data },
    } = this.props;
    const dataSource = data.data;
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
                <Form.Item label="管理单位">
                  {getFieldDecorator('company')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('ringtype', {
                    initialValue: '覆盖率',
                  })(
                    <Select onChange={this.handleringtypeChange}>
                      {ringtypemap.map(({ key, value }) => [
                        <Option key={key} value={value}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="统计类别">
                  {getFieldDecorator('type')(
                    <Select placeholder="请选择">
                      {statisticstypemap.map(({ key, value }) => [
                        <Option key={key} value={value}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="供电单位">
                  {getFieldDecorator('supplycompany')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              {this.state.ringname !== '覆盖率' && (
                <Col span={8}>
                  <Form.Item label="地区类型">
                    {getFieldDecorator('areatype')(
                      <Select placeholder="请选择">
                        {areatypemap.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              )}
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }}>重 置</Button>
              </Col>
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
