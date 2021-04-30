import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Checkbox, Button, Radio } from 'antd';
import DocumentAtt from './DocumentAtt';
import EditeTable from './EditeTable';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};
const forminladeLayout = {
  labelCol: {
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};
const formuintLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};

function Examine(props, ref) {
  const { taskName, userinfo, register, selectdata, isEdit } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');     // 模块
  const grademap = getTypebyId('1387229272208314369');      // 发布等级

  return (
    <Row gutter={12} style={{ paddingTop: 24, }}>
      <Form ref={formRef} {...formItemLayout}>
        <Col span={24} style={{ marginBottom: 12 }}>
          <EditeTable
            title='发布清单'
            functionmap={functionmap}
            modulamap={modulamap}
            isEdit={false}
            listType='临时'
            taskName={taskName}
          />
        </Col>
        <Col span={8} >
          <Form.Item label="申请发布等级">
            {getFieldDecorator('form1', {
              rules: [{ required, message: `请选择发布等级` }],
              initialValue: '',
            })(
              <Select placeholder="请选择" disabled={!isEdit}>
                {grademap.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
const WrappedForm = Form.create({ name: 'form' })(forwardRef(Examine));
export default WrappedForm;