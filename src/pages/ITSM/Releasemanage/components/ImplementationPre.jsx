import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Radio } from 'antd';
import DocumentAtt from './DocumentAtt';
import ImplementationEditTalbe from './ImplementationEditTalbe';
import IImplementationsteps from './Implementationsteps';

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

const implementequipment = [
  { key: 't1', title: '系统（设备）名称' },
  { key: 't2', title: 'IP地址' },
  { key: 't3', title: '用途' },
  { key: 't4', title: '负责人' },
  { key: 't5', title: '备注' },
];

const inplementers = [
  { key: 't1', title: '角色' },
  { key: 't2', title: '职责' },
  { key: 't3', title: '联系人' },
  { key: 't4', title: '联系方式' },
];

const inplementrisk = [
  { key: 't1', title: '主要风险分析' },
  { key: 't2', title: '应对措施' },
  { key: 't3', title: '备注' },
];
const inplementriskdata = [
  {
    t1: '前台功能 / 缺陷修复项',
    t2: '系统对时',
    t3: '功能菜单：采集管理/系统对时/电表对时预期效果：实现按供电单位进行失败列表的曲线批量召测功能验证步骤：',
  }
];

const validationtable = [
  { title: '功能类型', dataIndex: 't1', key: 't1' },
  { title: '模块', dataIndex: 't2', key: 't2' },
  { title: '功能名称', dataIndex: 't3', key: 't3' },
  { title: '问题类型', dataIndex: 't4', key: 't4' },
  { title: '问题类型', dataIndex: 't5', key: 't5' },
  { title: '测试内容及预期效果', dataIndex: 't6', key: 't6' },
  { title: '是否通过', dataIndex: 't7', key: 't7' },
  { title: '开发人员', dataIndex: 't8', key: 't8' },
  { title: '操作人员', dataIndex: 't9', key: 't9' },
];
const validationdata = [
  {
    t1: '前台功能 / 缺陷修复项',
    t2: '系统对时',
    t3: '电表对时',
    t4: '前台界面查询慢',
    t5: '功能菜单：采集管理/系统对时/电表对时预期效果：实现按供电单位进行失败列表的曲线批量召测功能验证步骤：',
    t6: '是',
    t7: '开发人员',
    t8: '徐姑姑',
    t9: '张三',
  }
];

function ImplementationPre(props, ref) {
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

  const unitmap = getTypebyId('1384056290929545218');       // 责任单位

  return (
    <Row gutter={12}>
      <Form ref={formRef} {...formItemLayout}>
        <Col span={24}>
          <Form.Item label="总述" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form1', {
              rules: [{ required, message: `请填写总述` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <ImplementationEditTalbe
            title='实施涉及系统（设备）'
            isEdit={isEdit}
            tablecolumns={implementequipment}
          />
        </Col>
        <Col span={24}>
          <Form.Item label="系统（设备）运行方式调整" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form2', {
              rules: [{ required, message: `请填写系统（设备）运行方式调整` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="涉级功能模块" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form3', {
              rules: [{ required, message: `请填写涉级功能模块` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <ImplementationEditTalbe
            title='实施人员'
            isEdit={isEdit}
            tablecolumns={inplementers}
          />
        </Col>
        <Col span={8} style={{ marginTop: 24 }}>
          <Form.Item label="实施计划开始时间">
            {getFieldDecorator('form4', {
              rules: [{ required, message: `请选择实施计划开始时间` }],
              initialValue: moment(register.form4),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 24 }}>
          <Form.Item label="实施计划结束时间" >
            {getFieldDecorator('form5', {
              rules: [{ required, message: `请选择实施计划结束时间` }],
              initialValue: moment(register.form5),
            })(
              <DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="影响范围" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form60', {
              rules: [{ required, message: `请填写影响范围` }],
              initialValue: register.form60,
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="停止业务访问" >
            {getFieldDecorator('form6', {
              rules: [{ required, message: `请选择实停止业务访问` }],
              initialValue: register.form6,
            })(
              <RadioGroup disabled={!isEdit}>
                <Radio value='001'>通过</Radio>
                <Radio value='002'>不通过</Radio>
              </RadioGroup>
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="中断开始时间" >
            {getFieldDecorator('form7', {
              rules: [{ required, message: `请选择中断开始时间` }],
              initialValue: moment(register.form7),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="中断结束时间">
            {getFieldDecorator('form8', {
              rules: [{ required, message: `请选择中断结束时间` }],
              initialValue: moment(register.form8),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="数据同步影响情况" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form9', {
              rules: [{ required, message: `请填写数据同步影响情况` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <IImplementationsteps
            title='实施步骤'
            isEdit={isEdit}
          />
        </Col>
        <Col span={24} style={{ marginTop: 24 }}>
          <ImplementationEditTalbe
            title='主要风险分析与应对措施'
            isEdit={isEdit}
            tablecolumns={inplementrisk}
            dataSoure={inplementriskdata}
          />
        </Col>
        <Col span={24}>
          <Form.Item label="特殊要求" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form9', {
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="回退方案" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form10', {
              rules: [{ required, message: `请填写回退方案` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <ImplementationEditTalbe
            title='功能验证表'
            isEdit={false}
            tablecolumns={validationtable}
            dataSoure={validationdata}
          />
        </Col>
        <Col span={24}>
          <Form.Item label="系统平台检查" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form11', {
              rules: [{ required, message: `请填写系统平台检查` }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 5 }} disabled={!isEdit} />)}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 24 }}>
          <DocumentAtt rowkey='5' unitmap={unitmap} isEdit={isEdit} />
        </Col>
        <Col span={8}>
          <Form.Item label="登记人" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form11', {
              rules: [{ required, message: `请选择登记人` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记时间" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form12', {
              rules: [{ required, message: `请选择登记时间` }],
              initialValue: moment(register.creationTime).format("YYYY-MM-DD HH:mm:ss"),
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登记单位" {...forminladeLayout} labelAlign='left'>
            {getFieldDecorator('form13', {
              rules: [{ required, message: `请选择登记单位` }],
              initialValue: '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(ImplementationPre));

WrappedForm.defaultProps = {
  register: {
    form4: undefined,
    form5: undefined,
    form6: '001',
    form60: `影响业务范围：\n\n影响用户范围：`,
    form7: undefined,
    form8: undefined,
  }
};
export default WrappedForm;