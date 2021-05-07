import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, DatePicker, Select, Radio, Alert } from 'antd';
import DocumentAtt from './DocumentAtt';

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

function Implementation(props, ref) {
  const { taskName, userinfo, register, selectdata, isEdit } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  useEffect(() => {
    if (isEdit && (moment(register.creationTime).format('DD') > 20 || moment(register.creationTime).format('DD') < 15)) {
      setAlertVisible(true);
    };
  }, [register])

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const resultmap = getTypebyId('1390197195424141314');   // 发布结果
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  return (
    <>
      {alertvisible && (<Alert
        message={`${taskName}超时,${taskName}时间在每月15日至20日之间`}
        type='warning'
        showIcon style={{ marginBottom: 12 }}
      />)}
      <Row gutter={12} >
        <Form ref={formRef} {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="发布实施时间" >
              {getFieldDecorator('form1', {
                rules: [{ required, message: `请选择发布实施时间` }],
                initialValue: moment(),
              })(
                <DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />
              )}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="发布结果">
              {getFieldDecorator('form2', {
                rules: [{ required, message: `请选择发布结果` }],
                initialValue: '001',
              })(
                <Select placeholder="请选择" disabled={!isEdit}>
                  {resultmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="发布实施人" {...formuintLayout}>
              {getFieldDecorator('form3', {
                rules: [{ required, message: `请输入发布实施人员名` }],
                initialValue: '',
              })(<TextArea autoSize disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="实施情况说明" {...formuintLayout}>
              {getFieldDecorator('form4', {
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="遗留问题说明" {...formuintLayout}>
              {getFieldDecorator('form5', {
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 4 }} disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <DocumentAtt rowkey='8' unitmap={unitmap} isEdit={isEdit} />
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Implementation));
WrappedForm.defaultProps = {
  register: {
    creationTime: undefined,
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
export default WrappedForm;