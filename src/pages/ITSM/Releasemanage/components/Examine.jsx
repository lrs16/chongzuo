import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Select, Radio } from 'antd';
import DocumentAtt from './NewDocAtt';
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
  const functionmap = getTypebyId(451);   // 功能类型
  const modulamap = getTypebyId(466);     // 模块
  const docunitmap = getTypebyId(1289);       // 出具文档单位

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
          <Form.Item label="审核结果">
            {getFieldDecorator('form1', {
              rules: [{ required, message: `请选择审核结果` }],
              initialValue: 1,
            })(
              <RadioGroup>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>不通过</Radio>
              </RadioGroup>
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="审核说明" {...formuintLayout}>
            {getFieldDecorator('form9', {
              rules: [{ required, message: `请填写审核说明` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间" >
            {getFieldDecorator('form5', {
              rules: [{ required, message: `请选择审核时间` }],
              initialValue: moment(),
            })(
              <DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />
            )}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 24 }}>
          <DocumentAtt rowkey={null} unitmap={docunitmap} isEdit={isEdit} />
        </Col>
        <Col span={8}>
          <Form.Item label="审批人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('form11', {
              rules: [{ required, message: `请选择审批人` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审批单位" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('form13', {
              rules: [{ required, message: `请选择审批单位` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
const WrappedForm = Form.create({ name: 'form' })(forwardRef(Examine));
export default WrappedForm;