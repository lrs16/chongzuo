import React, { Component } from 'react';
import { Button, Badge, Tag, Table, Select, Row, Col, Form, Input, Radio, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import numeral from 'numeral';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { MiniProgress } from '@/components/Charts';
// import Detail from './components/Detail';

const { Option } = Select;
const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];
const alarmstatusMap = ['#FF3703', '#FF9B2F', '#FFDC1D', '#3FF6CE', '#56DF6B', '#ccc'];
const alarmmap = ['严重', '一般', '警告', '恢复', '正常', '未知'];
const monitoringsort = [
  { key: 1, value: '流量' },
  { key: 2, value: '进程' },
  { key: 3, value: '磁盘' },
  { key: 4, value: '内存' },
  { key: 5, value: 'CPU' },
  { key: 6, value: 'WEB响应时间' },
];
const alarmstatus = [
  { key: 0, value: '严重' },
  { key: 1, value: '一般' },
  { key: 2, value: '警告' },
  { key: 3, value: '恢复' },
  { key: 4, value: '正常' },
  { key: 5, value: '未知' },
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@connect(({ basicmonitorlist, loading }) => ({
  basicmonitorlist,
  loading: loading.models.basicmonitorlist,
}))
class Host extends Component {
  state = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getHost();
  }

  getHost = () => {
    const { current, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'basicmonitorlist/fetchhost',
      payload: {
        current,
        pageSize,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'basicmonitorlist/fetchhost',
      payload: {
        page,
        pageSize: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'basicmonitorlist/fetchhost',
      payload: {
        current,
        pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  render() {
    const columns = [
      // {
      //   title: '告警状态',
      //   dataIndex: 'alarmstatus',
      //   key: 'alarmstatus',
      //   width: 100,
      //   align: 'center',
      //   render: (text, record) => {
      //     const colors = alarmstatusMap[record.alarmstatus];
      //     const alarms = alarmmap[record.alarmstatus];
      //     return (
      //       <span>
      //         {/* <div style={{width:15, height:15, borderRadius:'50%', background:`${colors}`}}/> */}
      //         <Icon
      //           type="exclamation-circle"
      //           theme="filled"
      //           style={{ color: `${colors}`, fontSize: '1.5em', marginRight: 8 }}
      //         />
      //         <span>{alarms}</span>
      //       </span>
      //     );
      //   },
      // },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 180,
        render: (text, record) => (
          <Link
            to={{
              pathname: '/monitormanage/basicMonitor/detail',
              state: {
                id: record.id,
                data: record,
                radiaokey: '操作系统',
              },
            }}
          >
            {text}
          </Link>
        ),
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        width: 150,
      },
      {
        title: '监控分类',
        dataIndex: 'monitorType',
        key: 'monitorType',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.status]} text={status[record.status]} />
          </span>
        ),
      },
      {
        title: 'CPU使用率',
        dataIndex: 'cpuUsage',
        key: 'cpuUsage',
        width: 120,
        render: text => (
          <span>
            {numeral(text).format('0,0.00')}%
            {/* <MiniProgress percent={text} strokeWidth={8} target={80} /> */}
          </span>
        ),
      },
      {
        title: '内存使用率',
        dataIndex: 'memoryUsage',
        key: 'memoryUsage',
        width: 120,
        render: text => (
          <span>
            {numeral(text).format('0,0.00')}%
            {/* <MiniProgress percent={text} strokeWidth={8} target={80} /> */}
          </span>
        ),
      },
      {
        title: '负载(15m)',
        dataIndex: 'load',
        key: 'load',
        width: 120,
        render: text => <span>{numeral(text).format('0,0')}KB/ms</span>,
      },
      {
        title: 'IO读速率',
        dataIndex: 'ioReadRate',
        key: 'ioReadRate',
        width: 100,
        render: text => <span>{numeral(text).format('0,0')}KB/ms</span>,
      },
      {
        title: 'IO写速率',
        dataIndex: 'ioWriteRate',
        key: 'ioWriteRate',
        width: 100,
        render: text => <span>{numeral(text).format('0,0')}KB/ms</span>,
      },
      {
        title: '标签',
        dataIndex: 'applyLabel',
        key: 'applyLabel',
        width: 100,
        render: applyLabel => (
          <span>
            {applyLabel.map(tag => (
              <Tag key={tag} style={{ marginBottom: 2, marginTop: 2 }}>
                {tag}
              </Tag>
            ))}
          </span>
        ),
      },
    ];
    const {
      loading,
      basicmonitorlist: { hostlist },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const dataSource = hostlist.data;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      // total: data.total,
      onChange: page => this.changePage(page),
    };
    return (
      <PageHeaderWrapper title="主机监测">
        <div
          style={{
            background: '#fff',
            padding: '24px 24px 0',
            border: '1px #ccc',
            marginBottom: '24px',
          }}
        >
          <Row gutter={24}>
            <Form {...formItemLayout}>
              <Col xl={8} xs={12}>
                <Form.Item label="输入搜索">
                  {getFieldDecorator('seacherkey', {})(<Input placeholder="输入名称/IP" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="监控分类">
                  {getFieldDecorator(
                    'monitorType',
                    {},
                  )(
                    <Select placeholder="请选择">
                      {monitoringsort.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="应用标签">
                  {getFieldDecorator('applyLabel', {})(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="告警状态">
                  {getFieldDecorator(
                    'status',
                    {},
                  )(
                    <Select placeholder="请选择">
                      {alarmstatus.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="运行状态">
                  {getFieldDecorator(
                    'status',
                    {},
                  )(
                    <Radio.Group>
                      <Radio value={0}>离线</Radio>
                      <Radio value={1}>在线</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 12 }} type="primary">
                  查询
                </Button>
                <Button>重置</Button>
              </Col>
            </Form>
          </Row>
        </div>
        <div style={{ background: '#fff' }}>
          <Table
            loading={loading}
            dataSource={dataSource}
            rowKey={record => record.id}
            columns={columns}
            scroll={{ x: 1200 }}
            pagination={pagination}
          />
          {/* <Detail 
                // data={selectDetail} 
                // visible={detailVisible} 
                // onClose={() => setDetailVisible(false)} 
              /> */}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Host);
