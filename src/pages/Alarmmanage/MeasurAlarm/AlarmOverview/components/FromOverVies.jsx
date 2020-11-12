import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
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
  const { getFieldDecorator } = props.form;
  const [expand, setExpand] = useState(false);

  const handleSearch = () => {
    props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
    });
  };
  const handleReset = () => {
    props.form.resetFields();
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSearch}>
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
      </Row>
    </Form>
  );
}

export default Form.create({})(FromOverVies);
