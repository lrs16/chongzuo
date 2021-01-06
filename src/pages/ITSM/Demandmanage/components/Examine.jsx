import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Examine = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, userinfo, text } = props;
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
  };

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label={`${text}结果`}>
            {getFieldDecorator('result', {
              rules: [{ required: true, message: `请选择${text}结果` }],
              initialValue: info.result,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}时间`}>
            {getFieldDecorator('reviewTime', {
              rules: [{ required, message: `请选择${text}时间` }],
              initialValue: moment(info.reviewTime),
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
          <Form.Item label={`${text}人`}>
            {getFieldDecorator('userName', {
              rules: [{ required: true }],
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}人单位`}>
            {getFieldDecorator('unit', {
              rules: [{ required: true }],
              initialValue: info.unit,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}人部门`}>
            {getFieldDecorator('department', {
              rules: [{ required: true }],
              initialValue: info.department,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          {adopt === '001' && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: false, message: `请输入${text}意见` }],
                initialValue: info.opinion,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '002' && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: true, message: `请输入${text}意见` }],
                initialValue: info.opinion,
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

Examine.defaultProps = {
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

export default Form.create({})(Examine);
