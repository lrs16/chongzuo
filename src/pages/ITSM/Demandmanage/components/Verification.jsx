import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Verification = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, ChangeFlowtype } = props;
  const { check } = info;
  const { getFieldDecorator } = props.form;
  const required = true;
  const [adopt, setAdopt] = useState('001');
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
    if (e.target.value === '001') {
      ChangeFlowtype('1');
    } else {
      ChangeFlowtype('3');
    }
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="验证">
            {getFieldDecorator('form1', {
              rules: [{ required: true, message: '请选择验证结果' }],
              initialValue: info.form1,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="验证时间">
            {getFieldDecorator('creationTime', {
              rules: [{ required, message: '请选择验证时间' }],
              initialValue: moment(info.creationTime),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>

        {/* <Col span={8}>
          <Form.Item label="所属项目">
            {getFieldDecorator('form2', {
              rules: [{ required: true, message: '请输入所属项目' }],
              initialValue: info.form2,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col> */}
        <Row />
        <Col span={8}>
          <Form.Item label="验证人">
            {getFieldDecorator('registerPerson', {
              rules: [{ required: true }],
              initialValue: info.registerPerson,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="验证人单位">
            {getFieldDecorator('registrationUnit', {
              rules: [{ required: true }],
              initialValue: info.registrationUnit,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="验证人部门">
            {getFieldDecorator('registrationDepartment', {
              rules: [{ required: true }],
              initialValue: info.registrationDepartment,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          {adopt === '002' && (
            <Form.Item label="验证意见" {...forminladeLayout}>
              {getFieldDecorator('reason', {
                rules: [{ required: false, message: '请输入审核意见' }],
                initialValue: info.reason,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '001' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('reason', {
                rules: [{ required: true, message: '请输入审核意见' }],
                initialValue: info.reason,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>
        {/* <Col span={24}>
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
          </Form.Item> */}
      </Form>
    </Row>
  );
});

Verification.defaultProps = {
  info: {
    creationTime: moment().format(),
    form1: '',
    form2: '',
    reason: '',
    registerPerson: '',
    registrationDepartment: '',
    registrationUnit: '',
  },
};

export default Form.create({})(Verification);
