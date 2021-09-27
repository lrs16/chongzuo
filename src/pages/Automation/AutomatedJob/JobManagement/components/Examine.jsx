import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd';

const { TextArea } = Input;

const formallItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 22 },
  },
};

const Examine = forwardRef((props, ref) => {
  const {
    userinfo, checkInfo, Noediting,
    form: { getFieldDecorator, getFieldsValue, resetFields },
  } = props;

  const [adopt, setAdopt] = useState('1');

  // console.log(checkInfo, 'checkInfo')

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
  }

  useEffect(() => {
    if (checkInfo !== undefined) {
      setAdopt(checkInfo.examineStatus);
    }
  }, [checkInfo]);

  return (
    <div style={{ marginRight: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('id', {
                initialValue: checkInfo.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="审核结果">
              {getFieldDecorator('examineStatus', {
                rules: [{ required: true, message: '请选择审核结果' }],
                initialValue: checkInfo.examineStatus,
              })(
                <Radio.Group onChange={handleAdopt} >
                  <Radio value="1">通过</Radio>
                  <Radio value="0">不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              {getFieldDecorator('examineTime', {
                rules: [{ required: true }],
                initialValue: moment(checkInfo.examineTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={Noediting} />)}
            </Form.Item>
          </Col>
          {/* <Col span={8} >
            <Form.Item label="审核状态">
              <Tag color="blue">{check.status}</Tag>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            {adopt === '1' && (
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('examineRemarks', {
                  initialValue: checkInfo.examineRemarks,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
            {adopt === '0' && (
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('examineRemarks', {
                  rules: [{ required: true, message: '请输入审核说明' }],
                  initialValue: checkInfo.examineRemarks,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('examineByName', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : checkInfo.examineBy,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('examineBy', {
                rules: [{ required: true }],
                initialValue: userinfo.userId ? userinfo.userId : checkInfo.examineById,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              {getFieldDecorator('examineDeptName', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : checkInfo.examineDept,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人单位ID">
              {getFieldDecorator('examineDept', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId ? userinfo.unitId : checkInfo.examineDeptId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Examine.defaultProps = {
  checkInfo: {
    id: '',
    examineStatus: '1',
    checkTime: new Date(),
    examineRemarks: '',
  },
  userinfo: {}
}

export default Form.create()(Examine);