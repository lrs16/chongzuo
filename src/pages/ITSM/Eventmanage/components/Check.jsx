import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Check = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, ChangeFlowtype, userinfo } = props;
  const { check } = info;
  const { getFieldDecorator } = props.form;
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
        <Col span={24}>
          <Form.Item label="审核结果" {...forminladeLayout}>
            {getFieldDecorator('check_check_result', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: check.check_result,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          {adopt === '002' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('check_content', {
                rules: [{ required: false, message: '请输入审核意见' }],
                initialValue: check.check_content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '001' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('check_content', {
                rules: [{ required: true, message: '请输入审核意见' }],
                initialValue: check.content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>
        <Col span={8}>
          <Form.Item label="接单时间">
            {getFieldDecorator('check_add_time', {
              rules: [{ required: true }],
              initialValue: check.add_time,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('check_check_time', {
              rules: [{ required: true }],
              initialValue: moment(check.check_time),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
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
        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('check_check_user', {
              rules: [{ required: true }],
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人ID">
            {getFieldDecorator('check_check_user_id', {
              rules: [{ required: true }],
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人单位">
            {getFieldDecorator('check_check_unit', {
              rules: [{ required: true }],
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人单位ID">
            {getFieldDecorator('check_check_unit_id', {
              rules: [{ required: true }],
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人部门">
            {getFieldDecorator('check_check_dept', {
              rules: [{ required: true }],
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="审核人部门ID">
            {getFieldDecorator('check_check_dept_id', {
              rules: [{ required: true }],
              initialValue: userinfo.deptId,
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

Check.defaultProps = {
  info: {
    check: {
      check_result: '001',
      content: '',
      add_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      check_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      check_user: '管理员',
      check_user_id: '1',
      check_unit: '广西电网有限责任公司',
      check_unit_id: '7AC3EF0F718E02A2E0530A644F130365',
      check_dept: '计量中心',
      check_dept_id: '7AC3EF0F718E02A2E0530A644F130365',
    },
  },
  userinfo: {
    deptName: '',
    deptId: '',
    unitName: '',
    unitId: '',
    userName: '',
    userId: '',
  },
};

export default Form.create({})(Check);
