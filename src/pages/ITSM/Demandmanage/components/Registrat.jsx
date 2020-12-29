import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Button, Select, Upload, DatePicker, Cascader } from 'antd';
import { phone_reg } from '@/utils/Regexp';

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};
const formpartLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const demandtype = [
  { key: '001', value: '新增功能' },
  { key: '002', value: '功能变更' },
  { key: '003', value: '其他' },
];

const modulemap = [
  {
    value: '采集管理',
    label: '采集管理',
    children: [
      {
        value: '档案管理',
        label: '档案管理',
        children: [
          { value: '档案查询', label: '档案查询' },
          { value: '档案同步', label: '档案同步' },
          { value: '档案维护', label: '档案维护' },
          { value: '档案异常校验', label: '档案异常校验' },
          { value: '线损分析', label: '线损分析' },
          { value: '电表对时', label: '电表对时' },
        ],
      },
      {
        value: '系统对时',
        label: '系统对时',
        children: [{ value: '电表对时', label: '电表对时' }],
      },
      {
        value: '远程抄表',
        label: '远程抄表',
        children: [
          { value: '采集任务管理', label: '采集任务管理' },
          { value: '厂站数据查询', label: '厂站数据查询' },
          { value: '抄表数据查询', label: '抄表数据查询' },
          { value: '抄表数据查询', label: '抄表数据查询' },
          { value: '计量点信息查询', label: '计量点信息查询' },
          { value: '群组表码查询', label: '群组表码查询' },
          { value: '事件查询', label: '事件查询' },
          { value: '手动召测', label: '手动召测' },
        ],
      },
      {
        value: '终端数据查询',
        label: '终端数据查询',
        children: [
          { value: '档案查询', label: '档案查询' },
          { value: '档案同步', label: '档案同步' },
          { value: '档案维护', label: '档案维护' },
          { value: '档案异常校验', label: '档案异常校验' },
          { value: '线损分析', label: '线损分析' },
          { value: '电表对时', label: '电表对时' },
        ],
      },
    ],
  },
  {
    value: '数据管理',
    label: '数据管理',
    children: [
      {
        value: '电量分析',
        label: '电量分析',
        children: [{ value: '电量查询', label: '电量查询' }],
      },
      {
        value: '负荷分析',
        label: '负荷分析',
        children: [{ value: '六角图分析', label: '六角图分析' }],
      },
      {
        value: '数据异常管理',
        label: '数据异常管理',
        children: [{ value: '单一异常分析', label: '单一异常分析' }],
      },
    ],
  },
];
const Registrat = forwardRef((props, ref) => {
  const { register } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  return (
    <>
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="事件编号">
              {getFieldDecorator('demandId', {
                initialValue: register.demandId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="建单时间">
              {getFieldDecorator('creationTime', {
                rules: [{ required }],
                initialValue: moment(register.creationTime),
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('proposer', {
                rules: [{ required, message: '请输入提出人' }],
                initialValue: register.proposer,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              {getFieldDecorator('proposingUnit', {
                rules: [{ required, message: '请输入提出人单位' }],
                initialValue: register.proposingUnit,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人部门">
              {getFieldDecorator('proposingDepartment', {
                rules: [{ required, message: '请输入提出人部门' }],
                initialValue: register.proposingDepartment,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人电话">
              {getFieldDecorator('proposerPhone', {
                rules: [
                  {
                    required,
                    len: 11,
                    validator: phone_reg,
                    message: '请输入正确的正确的手机号码',
                  },
                ],
                initialValue: register.proposerPhone,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请时间">
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: '请选择登记时间' }],
                initialValue: moment(register.creationTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="期待完成时间">
              {getFieldDecorator('completeTime', {
                rules: [{ required, message: '请选择期待完成时间' }],
                initialValue: moment(register.completeTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="需求类型">
              {getFieldDecorator('demandType', {
                rules: [{ required, message: '请选择需求类型' }],
                initialValue: register.demandType,
              })(
                <Select placeholder="请选择">
                  {demandtype.map(({ key, value }) => [
                    <Option key={key} value={key}>
                      {value}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属功能模块">
              {getFieldDecorator('functionalModule', {
                rules: [{ required, message: '请选择所属功能模块' }],
                initialValue: register.functionalModule,
              })(<Cascader options={modulemap} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求标题" {...forminladeLayout}>
              {getFieldDecorator('title', {
                rules: [{ required, message: '请输入需求标题' }],
                initialValue: register.title,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求原因" {...forminladeLayout}>
              {getFieldDecorator('reason', {
                rules: [{ required, message: '请输入需求原因' }],
                initialValue: register.reason,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="需求详述" {...forminladeLayout}>
              {getFieldDecorator('detail', {
                rules: [{ required, message: '请输入需求详述' }],
                initialValue: register.detail,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('form17')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                    </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col> */}
          <Col span={8}>
            <Form.Item label="登记人">
              {getFieldDecorator('registerPerson', {
                rules: [{ required }],
                initialValue: register.registerPerson,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人单位">
              {getFieldDecorator('registrationUnit', {
                rules: [{ required }],
                initialValue: register.registrationUnit,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记人部门">
              {getFieldDecorator('registrationDepartment', {
                rules: [{ required }],
                initialValue: register.registrationDepartment,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
});

Registrat.defaultProps = {
  register: {
    creationTime: moment().format(),
    completeTime: moment().format(),
    demandId: '',
    demandType: '',
    detail: '',
    functionalModule: '',
    proposer: '',
    proposerPhone: '',
    proposingDepartment: '计量中心',
    proposingUnit: '广西电网有限责任公司',
    reason: '',
    registerPerson: '管理员',
    registerTime: moment().format(),
    registrationDepartment: '计量中心',
    registrationUnit: '广西电网有限责任公司',
    title: '',
  },
};

export default Form.create()(Registrat);
