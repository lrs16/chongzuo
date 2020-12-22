import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Row, Col, Form, Input, Radio, Upload, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Check = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const [adopt, setAdopt] = useState(1);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const handleAdopt = e => {
    setAdopt(e.target.value);
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Form.Item label="审核结果" {...forminladeLayout}>
            {getFieldDecorator('check1', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: adopt,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          {adopt === 1 && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('check2', {
                rules: [
                  {
                    required: false,
                    message: '请输入审核意见',
                  },
                ],
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === 2 && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('check2', {
                rules: [
                  {
                    required: true,
                    message: '请输入审核意见',
                  },
                ],
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('check2')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('check3', {
                rules: [
                  {
                    required: true,
                    message: '审核人不能为空',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              {getFieldDecorator('check4', {
                rules: [
                  {
                    required: true,
                    message: '审核人单位不能为空',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人部门">
              {getFieldDecorator('check5', {
                rules: [
                  {
                    required: true,
                    message: '审核人部门不能为空',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Col>
      </Form>
    </Row>
  );
});

export default Form.create({})(Check);
