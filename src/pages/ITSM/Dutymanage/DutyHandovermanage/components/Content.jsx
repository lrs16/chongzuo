import React, {
  // useState, 
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Switch } from 'antd';

// const RadioGroup = Radio.Group; Radio, 

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
    formrecord,
    form: { getFieldDecorator, getFieldsValue, resetFields,
      // setFieldsValue 
    }
  } = props;

  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  }

  return (
    <div style={{ paddingRight: 24 }}>
      <Row gutter={24}>
        <Form {...forItemLayout} >
          <Col span={8}>
            <Form.Item label="表单id" style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: formrecord.id,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="班次编号" >
              {getFieldDecorator('no', {
                initialValue: formrecord.no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="班次名称">
              {getFieldDecorator('form1', {
                rules: [{ required, message: '请输入' }],
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="值班时段" >
              <Row>
                <Col span={11}>
                  {getFieldDecorator('time3', {
                    rules: [{ required, }],
                    initialValue: undefined,
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      placeholder="开始时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                <Col span={11}>
                  {getFieldDecorator('time4', {
                    rules: [{ required, }],
                    initialValue: undefined,
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('23:59:59', 'HH:mm:ss'),
                      }}
                      placeholder="结束时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="启用状态">
              {getFieldDecorator('userStatus', {
                rules: [
                  {
                    required,
                    message: '请选择是否启用！',
                  },
                ],
              })(
                <Switch
                  defaultChecked 
                  onChange={v => onChange(v)}
                />
                // <RadioGroup>
                //   <Radio value="0">停用</Radio>
                //   <Radio value="1">启用</Radio>
                // </RadioGroup>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建人">
              {getFieldDecorator('form2', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建时间">
              {getFieldDecorator('addTime', {
                initialValue: moment(new Date()),
              })(
                <DatePicker
                  disabled
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear />
              )}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    addUser: sessionStorage.getItem('userName'),
    addUserId: sessionStorage.getItem('userauthorityid'),
  },
}

export default Form.create()(Content);