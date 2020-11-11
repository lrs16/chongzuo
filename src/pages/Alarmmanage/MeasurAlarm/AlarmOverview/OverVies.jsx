import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Form,
  Input,
  Select,
  Button,
  Dropdown,
  Menu,
  Table,
} from 'antd';
import moment from 'moment';
import { ChartCard } from '@/components/Charts';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;
const levelmap = [
  { key: '1', value: '高' },
  { key: '2', value: '中' },
  { key: '3', value: '低' },
];
const typemap = [
  { key: '1', value: '业务指标' },
  { key: '2', value: '终端在线和入库' },
  { key: '3', value: '接口数据' },
  { key: '4', value: 'KAFKA中间件' },
  { key: '5', value: '主站系统运行' },
];
const confirmmap = [
  { key: 1, value: '已确认' },
  { key: 2, value: '未确认' },
];
const eliminationmmap = [
  { key: 1, value: '已消除' },
  { key: 2, value: '未消除' },
];
const Donutdata = [
  {
    type: '业务指标告警',
    count: 600,
  },
  {
    type: '终端在线和入库告警',
    count: 200,
  },
  {
    type: '接口数据告警',
    count: 100,
  },
  {
    type: 'KAFKA中间件告警',
    count: 390,
  },
  {
    type: '主站系统运行告警',
    count: 400,
  },
];
// 数据源
const smoothdata = [
  {
    month: 'Jan',
    city: 'Tokyo',
    temperature: 7,
  },
  {
    month: 'Jan',
    city: 'London',
    temperature: 3.9,
  },
  {
    month: 'Feb',
    city: 'Tokyo',
    temperature: 6.9,
  },
  {
    month: 'Feb',
    city: 'London',
    temperature: 4.2,
  },
  {
    month: 'Mar',
    city: 'Tokyo',
    temperature: 9.5,
  },
  {
    month: 'Mar',
    city: 'London',
    temperature: 5.7,
  },
  {
    month: 'Apr',
    city: 'Tokyo',
    temperature: 14.5,
  },
  {
    month: 'Apr',
    city: 'London',
    temperature: 8.5,
  },
  {
    month: 'May',
    city: 'Tokyo',
    temperature: 18.4,
  },
  {
    month: 'May',
    city: 'London',
    temperature: 11.9,
  },
  {
    month: 'Jun',
    city: 'Tokyo',
    temperature: 21.5,
  },
  {
    month: 'Jun',
    city: 'London',
    temperature: 15.2,
  },
  {
    month: 'Jul',
    city: 'Tokyo',
    temperature: 25.2,
  },
  {
    month: 'Jul',
    city: 'London',
    temperature: 17,
  },
  {
    month: 'Aug',
    city: 'Tokyo',
    temperature: 26.5,
  },
  {
    month: 'Aug',
    city: 'London',
    temperature: 16.6,
  },
  {
    month: 'Sep',
    city: 'Tokyo',
    temperature: 23.3,
  },
  {
    month: 'Sep',
    city: 'London',
    temperature: 14.2,
  },
  {
    month: 'Oct',
    city: 'Tokyo',
    temperature: 18.3,
  },
  {
    month: 'Oct',
    city: 'London',
    temperature: 10.3,
  },
  {
    month: 'Nov',
    city: 'Tokyo',
    temperature: 13.9,
  },
  {
    month: 'Nov',
    city: 'London',
    temperature: 6.6,
  },
  {
    month: 'Dec',
    city: 'Tokyo',
    temperature: 9.6,
  },
  {
    month: 'Dec',
    city: 'London',
    temperature: 4.8,
  },
];

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
const OverVies = props => {
  const [expand, setExpand] = useState(false);
  const { getFieldDecorator } = props.form;
  const handleMenuClick = e => {
    console.log('click', e);
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">事件工单</Menu.Item>
      <Menu.Item key="2">问题工单</Menu.Item>
      <Menu.Item key="3">变更工单</Menu.Item>
      <Menu.Item key="4">发布工单</Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: '级别',
      dataIndex: 'leve',
      key: 'leve',
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '确认状态',
      dataIndex: 'configstatus',
      key: 'configstatus',
    },
    {
      title: '消除状态',
      dataIndex: 'elimination',
      key: 'elimination',
    },
    {
      title: '警告内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '确认警告时间',
      dataIndex: 'contenttime',
      key: 'contenttime',
    },
    {
      title: '本次警告时间',
      dataIndex: 'thistime',
      key: 'thistime',
    },
    {
      title: '上次警告时间',
      dataIndex: 'lasttime',
      key: 'lasttime',
    },
  ];
  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <ChartCard title="告警概览">
            <Spin spinning={false} style={{ background: '#ffffff' }}>
              {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
              {Donutdata !== undefined && (
                <DonutPCT data={Donutdata} height={350} padding={[10, 0, 30, 0]} />
              )}
            </Spin>
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title="月度告警数量">
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: -18,
                textAlign: 'right',
              }}
            >
              时间：{moment().format('YYYY-MM')}
            </div>
            <Spin spinning={false} style={{ background: '#ffffff' }}>
              {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
              {Donutdata !== undefined && (
                <SmoothLine data={smoothdata} height={350} padding={[30, 0, 50, 0]} />
              )}
            </Spin>
          </ChartCard>
        </Col>
      </Row>
      <h3 style={{ fontWeight: 'bold', margin: '12px 0' }}>当前告警</h3>
      <Card>
        <Form {...formItemLayout}>
          <Row>
            {expand === true && (
              <Col span={8}>
                <Form.Item label="类别">
                  {getFieldDecorator(
                    'type',
                    {},
                  )(
                    <Select placeholder="请选择">
                      {typemap.map(({ key, value }) => [
                        <Option key={key} value={key}>
                          {value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item label="告警级别">
                {getFieldDecorator('level')(
                  <Select placeholder="请选择">
                    {levelmap.map(({ key, value }) => [
                      <Option key={key} value={key}>
                        {value}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="确认状态">
                {getFieldDecorator('configstatus')(
                  <Select placeholder="请选择">
                    {confirmmap.map(({ key, value }) => [
                      <Option key={key} value={key}>
                        {value}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="消除状态">
                    {getFieldDecorator('elimination ')(
                      <Select placeholder="请选择">
                        {eliminationmmap.map(({ key, value }) => [
                          <Option key={key} value={key}>
                            {value}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="告警内容">
                    {getFieldDecorator('content ', { initialValue: '' })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="确认告警时间">
                    {getFieldDecorator('contenttime', { initialValue: '' })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="本次告警时间">
                    {getFieldDecorator('thistime', { initialValue: '' })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="上次告警时间">
                    {getFieldDecorator('lasttime', { initialValue: '' })(<Input />)}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button type="primary">查 询</Button>
              <Button style={{ marginLeft: 8 }}>重 置</Button>
              <Button
                style={{ marginLeft: 8 }}
                type="link"
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? (
                  <>
                    关 闭 <UpOutlined />
                  </>
                ) : (
                  <>
                    展 开 <DownOutlined />
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
        <div style={{ margin: '10px 0 24px 0' }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            确认告警
          </Button>
          <Button style={{ marginRight: 8 }}>取消确认</Button>
          <Dropdown overlay={menu}>
            <Button type="primary" style={{ marginRight: 8 }}>
              派发工单 <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            手工消除
          </Button>
          <Button style={{ marginRight: 8 }}>导 出</Button>
        </div>
        <Table columns={columns} />
      </Card>
    </>
  );
};

export default Form.create()(OverVies);
