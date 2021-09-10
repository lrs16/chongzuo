import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker, Tag } from 'antd';

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
    userinfo, check, Noediting,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;
  const [adopt, setAdopt] = useState('通过');

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
  }

  useEffect(() => {
    if (check !== undefined) {
      setAdopt(check.result);
    }
  }, [check]);

  return (
    <div style={{ marginRight: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('id', {
                initialValue: check.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="审核结果">
              {getFieldDecorator('result', {
                rules: [{ required: true, message: '请选择审核结果' }],
                initialValue: check.result,
              })(
                <Radio.Group onChange={handleAdopt} disabled={Noediting}>
                  <Radio value="通过">通过</Radio>
                  <Radio value="不通过">不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              {getFieldDecorator('checkTime', {
                rules: [{ required: true }],
                initialValue: moment(check.checkTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={Noediting} />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="审核状态">
              <Tag color="blue">{check.status}</Tag>
            </Form.Item>
          </Col>
          {adopt === '通过' ? (
            <Col span={24}>
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('content', {
                  initialValue: check.content,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" disabled={Noediting} />)}
              </Form.Item>
            </Col>) : (
            <Col span={24}>
              <Form.Item label="审核说明" {...formItemLayout}>
                {getFieldDecorator('content1', {
                  rules: [{ required: true, message: '请输入审核说明' }],
                  initialValue: check.content,
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" disabled={Noediting} />)}
              </Form.Item>
            </Col>)}
          {/* <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div style={{ width: 400 }}>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('checkUser', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : check.checkUser,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('checkUserId', {
                rules: [{ required: true }],
                initialValue: userinfo.userId ? userinfo.userId : check.checkUserId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              {getFieldDecorator('checkUnit', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : check.checkUnit,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人单位ID">
              {getFieldDecorator('checkUnitId', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId ? userinfo.unitId : check.checkUnitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Examine.defaultProps = {
  check: {
    id: '',
    result: '通过',
    checkTime: undefined,
    status: '待审核',
    content: undefined,
  },
  userinfo: {}
}

export default Form.create()(Examine);