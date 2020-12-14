import React, { useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const sourcemap = [
  { key: 0, value: '用户电话申告' },
  { key: 1, value: '企信' },
];

const returnvisit = [
  { key: 0, value: '企信回访' },
  { key: 1, value: '电话回访' },
  { key: 2, value: '短信回访' },
  { key: 3, value: '邮箱回访' },
];

const satisfactions = [
  { key: 0, value: '满意' },
  { key: 1, value: '一般' },
  { key: 2, value: '不满意' },
];

const ReturnVisit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const required = true;

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="回访方式">
            {getFieldDecorator('visit7', {
              rules: [
                {
                  required,
                  message: '请选择回访方式',
                },
              ],
            })(
              <Select placeholder="请选择">
                {returnvisit.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('visit2', {
              rules: [
                {
                  required,
                  message: '请选择处理结果',
                },
              ],
            })(
              <Select placeholder="请选择">
                {sourcemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="满意度">
            {getFieldDecorator('visit3', {
              rules: [
                {
                  required,
                  message: '请选择满意度',
                },
              ],
            })(
              <Select placeholder="请选择">
                {satisfactions.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="回访内容" {...forminladeLayout}>
            {getFieldDecorator('visit15')(
              <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="回访时间">
            {getFieldDecorator('re1', {
              rules: [
                {
                  required,
                  message: '请选择回访时间',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('visit17')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('visit18')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人单位">
            {getFieldDecorator('visit19')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记人部门">
            {getFieldDecorator('visit20')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

export default Form.create({})(ReturnVisit);
