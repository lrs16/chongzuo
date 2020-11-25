import React, { useContext, useState } from 'react';
import { Row, Col, Form, Input, Select, Button, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { FromContext } from '../OverVies';

const { Option } = Select;

const typemap = [
  { key: 0, value: '业务指标' },
  { key: 1, value: '终端在线和入库' },
  { key: 2, value: '接口数据核查' },
  { key: 3, value: 'KAFKA消费' },
  { key: 4, value: 'KAFKA消费（凌晨）' },
  { key: 5, value: '主站系统运行' },
];
const monitormap = [
  [
    { key: 1, value: '采集完整率' },
    { key: 2, value: '终端覆盖率' },
    { key: 3, value: '自动抄表率' },
    { key: 4, value: '关口0点采集' },
    { key: 5, value: '关口整点采集' },
    { key: 6, value: '供售电量分析' },
  ],
  [
    { key: 1, value: '终端在线率' },
    { key: 2, value: '入库数量（整点）' },
    { key: 3, value: '入库数量（0-7点）' },
  ],
  [
    { key: 1, value: '抄表结算接口' },
    { key: 2, value: '参数下发' },
    { key: 3, value: '测量点主表生成' },
    { key: 4, value: '费控指令-kafka指令超时' },
    { key: 5, value: '档案同步接口' },
  ],
  [
    { key: 1, value: 'kafka节点监控' },
    { key: 2, value: '下行主题-低压相关' },
    { key: 3, value: '下行主题-其他回复接口' },
    { key: 4, value: '下行主题-广西102关口方面二区和安全接入区参考下发' },
    { key: 5, value: '下行主题-广西102档案下发（关口相关）' },
    { key: 6, value: '上行主题-低压相关' },
    { key: 7, value: '上行主题-其他回复接口' },
    { key: 8, value: '上行主题-广西102关口方面二区和安全接入区参考下发' },
    { key: 9, value: '上行主题-广西102档案下发（关口相关）' },
  ],
  [
    { key: 1, value: 'kafka节点监控' },
    { key: 2, value: '下行主题-低压相关' },
    { key: 3, value: '下行主题-其他回复接口' },
    { key: 4, value: '下行主题-广西102关口方面二区和安全接入区参考下发' },
    { key: 5, value: '下行主题-广西102档案下发（关口相关）' },
    { key: 6, value: '上行主题-低压相关' },
    { key: 7, value: '上行主题-其他回复接口' },
    { key: 8, value: '上行主题-广西102关口方面二区和安全接入区参考下发' },
    { key: 9, value: '上行主题-广西102档案下发（关口相关）' },
  ],
  [
    { key: 1, value: '登录检测' },
    { key: 2, value: '数据召测-低压' },
    { key: 3, value: '数据召测-负控配变' },
    { key: 4, value: '数据召测-厂站' },
  ],
];
const confirmmap = [
  { key: 1, value: '已确认' },
  { key: 0, value: '未确认' },
];
const eliminationmmap = [
  { key: 1, value: '已消除' },
  { key: 0, value: '未消除' },
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
  const { setQueryKeys } = useContext(FromContext);
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
      setQueryKeys(values);
    });
  };

  const handleReset = () => {
    resetFields();
    setQueryKeys({});
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSearch}>
      <Row gutter={24}>
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
              <Form.Item label="告警内容">{getFieldDecorator('content ')(<Input />)}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="确认告警时间">
                {getFieldDecorator('contenttime')(<DatePicker showTime />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="本次告警时间">
                {getFieldDecorator('thistime')(<DatePicker showTime />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="上次告警时间">
                {getFieldDecorator('lasttime')(<DatePicker showTime />)}
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
