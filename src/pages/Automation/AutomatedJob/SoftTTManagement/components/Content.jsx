import React, {
  useState,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import { Button, Form, Input, DatePicker, Row, Col } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';

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

const formItemLayout1 = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    userinfo,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;

  const [showexpand, setshowExpand] = useState(false);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  return (
    <div style={{ marginRight: 24, marginTop: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={24} >
            <Form.Item label="启停对象" {...formItemLayout1}>
              {getFieldDecorator('agentIds', {
                rules: [{ required: true, message: '请选择作业对象' }],
                initialValue: [""],
              })(<Button block onClick={() => {
                setshowExpand(!showexpand);
              }}>+添加对象</Button>)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="申请说明" {...formItemLayout} >
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '请输入审核说明' }],
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ paddingBottom: 24 }}>
            <Row>
              <Col span={2} style={{ paddingTop: 4, textAlign: 'right' }}>上传附件：</Col>
              <Col span={22} >
                <div style={{ width: 400, float: 'left' }}>
                  <SysUpload />
                </div>
                {/* {formrecord.fileIds !== '' && <Downloadfile files={formrecord.fileIds} />} */}
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('applyer', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="申请人单位">
              {getFieldDecorator('applyUnit', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('applyTime', {
                rules: [{ required: true }],
                initialValue: moment(new Date()),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
          {/* <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('checkUserId', {
                rules: [{ required: true }],
                initialValue: userinfo.userId ? userinfo.userId : check.checkUserId,
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
          </Col> */}
        </Form>
      </Row>
    </div>
  );
});

Content.defaultProps = {
  userinfo: {}
}

export default Form.create()(Content);