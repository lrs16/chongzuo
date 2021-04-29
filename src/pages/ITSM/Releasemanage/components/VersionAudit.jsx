import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Checkbox, Button, Radio } from 'antd';
import DocumentAtt from './DocumentAtt';
import EditeTable from './EditeTable';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


const orderkeys = ['1132', '1135'];

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

function VersionAudit(props, ref) {
  const { taskName, userinfo, register, selectdata, isEdit } = props;
  const { getFieldDecorator } = props.form;
  const required = true;

  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [alertmessage, setAlertMessage] = useState('');

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  useEffect(() => {
    if (isEdit && (moment(register.creationTime).format('DD') > 15 || moment(register.creationTime).format('DD') < 11)) {
      setAlertVisible(true);
      setAlertMessage(`${taskName}超时`);
    };
  }, [register])

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');     // 模块
  const grademap = getTypebyId('1387229272208314369');      // 发布等级
  const reasonmap = getTypebyId('1387231433545748481');     // 发布变更原因
  const contentmap = getTypebyId('1387231738408734721');    // 发布变更内容

  const onCheckboxChange = (checkds) => {
    console.log(checkds);
  }
  const descriptionopion = (
    <>
      <Checkbox.Group
        options={orderkeys}
        onChange={onCheckboxChange}
      />
      <Button style={{ marginLeft: 30 }} type='link'>取消合并</Button>
    </>
  )


  return (
    <>
      {alertvisible && (<Alert
        message={alertmessage}
        description='版本管理员审批时间在每月11日至14日之间'
        type='warning'
        showIcon style={{ marginBottom: 12 }}
      />)}
      <Alert message='已合并工单' description={descriptionopion} type='info' />
      <Row gutter={12} style={{ paddingTop: 24, }}>
        <Form ref={formRef} {...formItemLayout}>
          <Col span={24} style={{ marginBottom: 12 }}>
            <EditeTable
              title='发布清单'
              functionmap={functionmap}
              modulamap={modulamap}
              isEdit={isEdit}
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
          <Col span={8}>
            <Form.Item label="发布开始时间">
              {getFieldDecorator('form2', {
                rules: [{ required, message: `请选择发布开始时间` }],
                initialValue: '',
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="发布结束时间">
              {getFieldDecorator('form3', {
                rules: [{ required, message: `请选择发布结束时间` }],
                initialValue: '',
              })(<Input disabled={!isEdit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="停止业务访问" >
              {getFieldDecorator('form4', {
                rules: [{ required, message: `请选择停止业务访问` }],
                initialValue: register.form6,
              })(
                <RadioGroup disabled={!isEdit}>
                  <Radio value='001'>通过</Radio>
                  <Radio value='002'>不通过</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="变更原因" {...formuintLayout}>
              {getFieldDecorator('form5', {
                rules: [{ required, message: `请选择变更原因` }],
                initialValue: '全部',
              })(
                <Select placeholder="请选择" disabled={!isEdit} mode="multiple">
                  {reasonmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24} >
            <Form.Item label="变更内容" {...formuintLayout}>
              {getFieldDecorator('form6', {
                rules: [{ required, message: `请选择变更内容` }],
                initialValue: '全部',
              })(
                <Select placeholder="请选择" disabled={!isEdit} mode="multiple">
                  {contentmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <DocumentAtt rowkey='6' unitmap={unitmap} isEdit={isEdit} />
          </Col>
          <Col span={8}>
            <Form.Item label="审核人" {...forminladeLayout} labelAlign='left'>
              {getFieldDecorator('form11', {
                rules: [{ required }],
                initialValue: '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间" {...forminladeLayout} labelAlign='left'>
              {getFieldDecorator('form12', {
                rules: [{ required }],
                initialValue: moment(register.creationTime).format("YYYY-MM-DD HH:mm:ss"),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核单位" {...forminladeLayout} labelAlign='left'>
              {getFieldDecorator('form13', {
                rules: [{ required }],
                initialValue: '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(VersionAudit));

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