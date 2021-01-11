import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, Upload, Button, DatePicker, Select, Checkbox } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const degreemap = [
  { key: '001', value: '低' },
  { key: '002', value: '中' },
  { key: '003', value: '高' },
];

const Examine = forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, userinfo, text, taskName, info } = props;
  const { getFieldDecorator } = props.form;
  const required = true;
  const [adopt, setAdopt] = useState(1);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const handleAdopt = e => {
    setAdopt(e.target.value);
  };
  const result = info[0] === undefined ? 1 : info[0].result;
  const reviewTime = info[0] === undefined ? moment().format() : info[0].reviewTime;
  const project = info[0] === undefined ? '' : info[0].project;
  const opinion = info[0] === undefined ? '' : info[0].opinion;
  const business = info[0] === undefined ? '' : info[0].business;
  const releases = info[0] === undefined ? '' : info[0].releases;
  const priority = info[0] === undefined ? '' : info[0].priority;

  return (
    <Form {...formItemLayout}>
      <Row gutter={24} style={{ paddingTop: 24 }}>
        <Col span={8}>
          <Form.Item label={`${text}结果`}>
            {getFieldDecorator('result', {
              rules: [{ required: true, message: `请选择${text}结果` }],
              initialValue: result,
            })(
              <Radio.Group onChange={handleAdopt}>
                <Radio value={1}>通过</Radio>
                <Radio value={0}>不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        {taskName === '需求复核' && (
          <Col span={8}>
            <Form.Item label="需求优先级">
              {getFieldDecorator('priority', {
                rules: [{ required: true, message: '请选择需求优先级' }],
                initialValue: priority,
              })(
                <Select placeholder="请选择">
                  {degreemap.map(({ key, value }) => {
                    return (
                      <Option key={key} value={value}>
                        {value}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          </Col>
        )}
        <Col span={8}>
          <Form.Item label={`${text}时间`}>
            {getFieldDecorator('reviewTime', {
              rules: [{ required, message: `请选择${text}时间` }],
              initialValue: moment(reviewTime),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>

        {taskName === '需求审核' && (
          <Col span={8}>
            <Form.Item label="所属项目">
              {getFieldDecorator('project', {
                rules: [{ required: true, message: '请输入所属项目' }],
                initialValue: project,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        )}
        <Col span={24}>
          {adopt === 1 && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: false, message: `请输入${text}意见` }],
                initialValue: opinion,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === 0 && (
            <Form.Item label={`${text}意见`} {...forminladeLayout}>
              {getFieldDecorator('opinion', {
                rules: [{ required: true, message: `请输入${text}意见` }],
                initialValue: opinion,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {taskName === '需求复核' && (
            <>
              <Col span={8}>
                <Form.Item label="是否影响业务">
                  {getFieldDecorator('business', {
                    valuePropName: 'checked',
                    initialValue: Number(business),
                  })(<Checkbox />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否影响发布">
                  {getFieldDecorator('releases', {
                    valuePropName: 'checked',
                    initialValue: Number(releases),
                  })(<Checkbox />)}
                </Form.Item>
              </Col>
            </>
          )}
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}人`}>
            {getFieldDecorator('userName', {
              rules: [{ required: true }],
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label={`${text}人ID`}>
            {getFieldDecorator('userId', {
              rules: [{ required: true }],
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}人单位`}>
            {getFieldDecorator('unit', {
              rules: [{ required: true }],
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={`${text}人部门`}>
            {getFieldDecorator('department', {
              rules: [{ required: true }],
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>

        {/* <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('check2')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item> */}
      </Row>
    </Form>
  );
});

Examine.defaultProps = {
  info: {
    creationTime: moment().format(),
    result: 1,
    project: '',
    reason: '',
    registerPerson: '',
    registrationDepartment: '',
    registrationUnit: '',
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

export default Form.create({})(Examine);
