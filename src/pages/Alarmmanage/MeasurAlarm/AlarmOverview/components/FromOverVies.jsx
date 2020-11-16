import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, Button, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;

const levelmap = [
  { key: '1', value: '紧急' },
  { key: '2', value: '一般' },
  { key: '3', value: '警告' },
];
const typemap = [
  { key: '0', value: '业务指标' },
  { key: '1', value: '终端在线和入库' },
  { key: '2', value: '接口数据' },
  { key: '3', value: 'KAFKA中间件' },
  { key: '4', value: '主站系统运行' },
];
const monitormap = [
  [
    { key: '1', value: '采集完整率' },
    { key: '2', value: '终端覆盖率' },
    { key: '3', value: '自动抄表率' },
    { key: '4', value: '关口0点采集' },
    { key: '5', value: '关口整点采集' },
    { key: '6', value: '供电量分析' },
    { key: '7', value: '售电量分析' },
  ],
  [
    { key: '1', value: '档案同步接口' },
    { key: '2', value: '参考下发' },
    { key: '3', value: '招测测试' },
    { key: '4', value: '测量点主表生成' },
    { key: '5', value: '费控指令-KAFKA指令超时' },
  ],
  [{ key: '1', value: '低压相关' }],
  [{ key: '1', value: '登录检测' }],
  [{ key: '1', value: '终端在线' }],
];
const confirmmap = [
  { key: 1, value: '已确认' },
  { key: 2, value: '未确认' },
];
const eliminationmmap = [
  { key: 1, value: '已消除' },
  { key: 2, value: '未消除' },
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

function FromOverVies(props) {
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const [expand, setExpand] = useState(false);
  const [monitorcontent, setMonitorContent] = useState(monitormap[0]);

  const handleTypeChange = value => {
    setMonitorContent(monitormap[value]);
    resetFields(['monitorco'], []);
  };

  const handleSearch = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
    });
  };
  const handleReset = () => {
    resetFields();
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSearch}>
      <Row gutter={24}>
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
              <Form.Item label="监控项">
                {getFieldDecorator(
                  'type',
                  {},
                )(
                  <Select placeholder="请选择" onChange={handleTypeChange}>
                    {typemap.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="监控内容">
                {getFieldDecorator(
                  'monitorco',
                  {},
                )(
                  <Select placeholder="请选择">
                    {monitorcontent.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
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
                {getFieldDecorator('contenttime', { initialValue: '' })(<DatePicker showTime />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="本次告警时间">
                {getFieldDecorator('thistime', { initialValue: '' })(<DatePicker showTime />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="上次告警时间">
                {getFieldDecorator('lasttime', { initialValue: '' })(<DatePicker showTime />)}
              </Form.Item>
            </Col>
          </>
        )}
        {expand === false && (
          <Col span={8}>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>
                查 询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                重 置
              </Button>
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
            </Form.Item>
          </Col>
        )}
        {expand === true && (
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={handleSearch}>
              查 询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重 置
            </Button>
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
        )}
      </Row>
    </Form>
  );
}

export default Form.create({})(FromOverVies);
