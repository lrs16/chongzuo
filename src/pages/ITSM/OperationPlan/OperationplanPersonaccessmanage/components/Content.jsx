import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker } from 'antd';

const { TextArea } = Input;

const formallItemLayout = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 22 },
  },
  labelAlign: 'right',
};
const forItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
  labelAlign: 'right',
};

const Content = forwardRef((props, ref) => {
  const {
    userinfo,
    selectedRows,
    ChangeResult,
    type,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields
    },
  } = props;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const [adopt, setAdopt] = useState('0');

  const required = true;

  useEffect(() => {
    if (selectedRows.checkResult !== null) {
      setAdopt(selectedRows.checkResult);
      ChangeResult(selectedRows.checkResult);
    }
  }, []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
    ChangeResult(e.target.value);
  }

  return (
    <div style={{ paddingRight: 24 }}>
      <Row gutter={24}>
        <Form {...forItemLayout} >
          <Col span={8}>
            <Form.Item label="审核结果">
              {getFieldDecorator('checkResult', {
                rules: [{ required, message: '请选择' }],
                initialValue: (selectedRows && selectedRows.checkResult !== null) ? selectedRows.checkResult : '0'
              })
                (
                  <Radio.Group onChange={handleAdopt} disabled={type === 'toquery'}>
                    <Radio value="0">通过</Radio>
                    <Radio value="1">不通过</Radio>
                  </Radio.Group>,
                )
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              {getFieldDecorator('checkTime', {
                rules: [
                  {
                    required,
                    message: '请选择'
                  }
                ],
                initialValue: (selectedRows && selectedRows.checkTime === null) ? moment(new Date()) : moment(selectedRows.checkTime),
              })
                (
                  <DatePicker
                    showTime
                    disabled={type === 'toquery'}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
            </Form.Item>
          </Col>
          <Col span={24}>
            {adopt === '0' && (
              <Form.Item label="审核说明" {...formallItemLayout}>
                {getFieldDecorator('checkContent', {
                  rules: [{ required: false, message: '请输入', }],
                  initialValue: selectedRows.checkContent
                })(<TextArea disabled={type === 'toquery'} autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
            {adopt === '1' && (
              <Form.Item label="审核说明" {...formallItemLayout}>
                {getFieldDecorator('checkContent', {
                  rules: [{ required: true, message: '请输入', }],
                  initialValue: selectedRows.checkContent
                })(<TextArea disabled={type === 'toquery'} autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('checkUser', {
                initialValue: userinfo ? userinfo.userName : ''
              })
                (
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核单位">
              {getFieldDecorator('checkUnit', {
                initialValue: userinfo ? userinfo.unitName : ''
              })
                (
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Content.defaultProps = {
  checkResult: '0',
  checkTime: moment(new Date()),
  checkContent: '',
  userinfo: {
    userName: '',
    unitName: ''
  }
}

export default Form.create()(Content);