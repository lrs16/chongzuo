import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker } from 'antd';
import EditeTable from './EditeTable';
import TestingFacility from './TestingFacility';
import DocumentAtt from './DocumentAtt';

const { TextArea } = Input;

function Registrat(props, ref) {
  const { formItemLayout, forminladeLayout, userinfo, register, selectdata } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  console.log(selectdata)

  const [alertvisible, setAlertVisible] = useState(false);

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  useEffect(() => {
    if (moment(register.creationTime).format('DD') > 17) {
      setAlertVisible(true)
    }
  }, [register])

  const getTypebyId = key => {
    if (selectdata.length > 0) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const equipmentmap = getTypebyId('1379323795302518786');  // 设备名称及用途

  return (
    <>
      {alertvisible && (<Alert message='出厂测试超时，出厂测试登记时间超过本月25日' type='warning' showIcon />)}
      <Row gutter={12} style={{ paddingTop: 24 }}>
        <Form ref={formRef} {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="发布编号">
              {getFieldDecorator('register_id', {
                rules: [{ required, message: `发布编号不能为空` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试开始时间">
              {getFieldDecorator('form2', {
                rules: [{ required, message: `请选择出厂测试开始时间` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试结束时间">
              {getFieldDecorator('form3', {
                rules: [{ required, message: `请选择出厂测试结束时间` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试地点">
              {getFieldDecorator('form4', {
                rules: [{ required, message: `请输入出厂测试地点` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="参与测试单位">
              {getFieldDecorator('form5', {
                rules: [{ required, message: `请选择参与测试单位` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="测试人员">
              {getFieldDecorator('form6', {
                rules: [{ required, message: `请输入测试人员` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="发布类型">
              {getFieldDecorator('form7', {
                rules: [{ required, message: `请选择发布类型` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="责任单位">
              {getFieldDecorator('form8', {
                rules: [{ required, message: `请选择责任单位` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="受影响业务范围" {...forminladeLayout} labelAlign='left'>
              {getFieldDecorator('form9', {
                rules: [{ required, message: `请填写受影响业务范围` }],
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <TestingFacility title='测试环境' />
          </Col>
          <Col span={24} style={{ marginBottom: 12 }}>
            <EditeTable title='发布清单' />
          </Col>
          <Col span={24}>
            <Form.Item label="出厂测试结论" {...forminladeLayout} labelAlign='left'>
              {getFieldDecorator('form10', {
                rules: [{ required, message: `请填写受影响业务范围` }],
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <DocumentAtt />
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试登记人">
              {getFieldDecorator('form11', {
                rules: [{ required, message: `请选择出厂测试开始时间` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试登记时间">
              {getFieldDecorator('form12', {
                rules: [{ required, message: `请选择出厂测试登记时间` }],
                initialValue: moment(register.creationTime),
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="出厂测试登记单位">
              {getFieldDecorator('form13', {
                rules: [{ required, message: `请选择出厂测试登记单位` }],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Registrat))

WrappedForm.defaultProps = {
  register: {
    creationTime: moment().format(),
    // completeTime: moment().format(),
    demandId: '',
    demandType: '',
    detail: '',
    functionalModule: '',
    proposer: '',
    proposerId: '',
    proposerPhone: '',
    proposingDepartment: '',
    proposingDepartmentId: '',
    proposingUnit: '',
    proposingUnitId: '1',
    reason: '',
    // registerTime: moment().format(),
    title: '',
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