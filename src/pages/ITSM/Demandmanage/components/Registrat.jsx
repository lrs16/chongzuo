import React from 'react';
import { Card, Row, Col, Form, Input, Button, Select, Upload, DatePicker, Cascader } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

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
function Registrat(props) {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const required = true;
  return (
    <Row gutter="24">
      <Form {...formItemLayout}>
        <Col span="8">
          <Form.Item label="需求编号">
            {getFieldDecorator('demandId')(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="建单时间">
            {getFieldDecorator('creationTime', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="登记时间">
            {getFieldDecorator('registerTime', {
              rules: [{ required }],
              initialValue: '',
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="提出人">
            {getFieldDecorator('proposer', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="提出单位">
            {getFieldDecorator('proposingUnit', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="提出部门">
            {getFieldDecorator('proposingDepartment', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="提出人电话">
            {getFieldDecorator('proposerPhone', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="需求类型">
            {getFieldDecorator('demandType', {
              rules: [{ required }],
              initialValue: '',
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
        <Col span="24">
          <Form.Item label="所属功能模块" {...forminladeLayout}>
            {getFieldDecorator('form9', {
              rules: [{ required }],
              initialValue: '',
            })(<Cascader options={modulemap} />)}
          </Form.Item>
        </Col>
        <Col span="24">
          <Form.Item label="需求原因" {...forminladeLayout}>
            {getFieldDecorator('form10', {
              rules: [{ required }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="24">
          <Form.Item label="需求详述" {...forminladeLayout}>
            {getFieldDecorator('form11', {
              rules: [{ required }],
              initialValue: '',
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {/* <Col span="24">
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
        <Col span="8">
          <Form.Item label="登记人">
            {getFieldDecorator('form18', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="登记人单位">
            {getFieldDecorator('form19', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
        <Col span="8">
          <Form.Item label="登记人部门">
            {getFieldDecorator('form20', {
              rules: [{ required }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}

export default Form.create()(Registrat);
