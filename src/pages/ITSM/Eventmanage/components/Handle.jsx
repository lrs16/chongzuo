import React, { useRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Option } = Select;
const { TextArea } = Input;

const degreemap = [
  { key: '001', value: '高' },
  { key: '002', value: '中' },
  { key: '003', value: '低' },
  { key: '004', value: '紧急' },
];

const eventclass = [
  { key: '001', value: '咨询', disabled: false },
  { key: '002', value: '缺陷', disabled: false },
  { key: '003', value: '故障', disabled: false },
  { key: '004', value: '数据处理', disabled: false },
  { key: '005', value: '账号权限', disabled: true },
  { key: '006', value: '其它', disabled: false },
];

const eventobject = [
  { key: '001', value: '配网采集' },
  { key: '002', value: '主网采集' },
  { key: '003', value: '终端掉线' },
  { key: '004', value: '配网档案' },
  { key: '005', value: '实用化指标' },
  { key: '006', value: '账号缺陷' },
];

const result = [
  { key: '001', value: '误报' },
  { key: '002', value: '根本解决' },
  { key: '003', value: '代替方法' },
  { key: '004', value: '自动消失' },
  { key: '005', value: '转问题解决' },
];

const Handle = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, info, main, userinfo } = props;
  const { handle } = info;
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
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('handle_user', {
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="处理人ID">
            {getFieldDecorator('handle_user_id', {
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人单位">
            {getFieldDecorator('handle_handle_unit', {
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="处理人单位ID">
            {getFieldDecorator('handle_handle_unit_id', {
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人部门">
            {getFieldDecorator('handle_handle_dept', {
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
          <Form.Item label="处理人部门ID" style={{ display: 'none' }}>
            {getFieldDecorator('handle_handle_dept_id', {
              initialValue: userinfo.deptId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="影响度">
            {getFieldDecorator('handle_event_effect', {
              rules: [{ required, message: '请选择影响度' }],
              initialValue: handle.event_effect,
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }, index) => {
                  if (index < 3)
                    return (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="紧急度">
            {getFieldDecorator('handle_event_emergent', {
              rules: [{ required, message: '请选择紧急度' }],
              initialValue: handle.event_emergent,
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="优先级">
            {getFieldDecorator('handle_event_prior', {
              rules: [{ required, message: '请选择优先级' }],
              initialValue: handle.event_prior,
            })(
              <Select placeholder="请选择">
                {degreemap.map(({ key, value }, index) => {
                  if (index < 3)
                    return (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件分类">
            {getFieldDecorator('main_event_type', {
              rules: [{ required, message: '请选择事件分类' }],
              initialValue: main.event_type,
            })(
              <Select placeholder="请选择">
                {eventclass.map(({ key, value, disabled }) => [
                  <Option key={key} value={key} disabled={disabled}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="事件对象">
            {getFieldDecorator('main_event_object', {
              rules: [{ required, message: '请选择事件对象' }],
              initialValue: main.event_object,
            })(
              <Select placeholder="请选择">
                {eventobject.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('handle_handle_result', {
              rules: [{ required, message: '请选择处理结果' }],
              initialValue: handle.handle_result,
            })(
              <Select placeholder="请选择">
                {result.map(({ key, value }) => [
                  <Option key={key} value={key}>
                    {value}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="接单时间">
            {getFieldDecorator('handle_add_time', {
              rules: [{ required }],
              initialValue: handle.add_time,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理完成时间">
            {getFieldDecorator('handle_end_time', {
              rules: [{ required }],
              initialValue: moment(handle.end_time),
            })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item label="二线标签" {...forminladeLayout}>
            {getFieldDecorator('ha12')(
              <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
            )}
          </Form.Item>
        </Col>
        <Col span={22} offset={2}>
          <span>您可输入相关标签（例如重点标签）</span>
          <div
            style={{
              marginBottom: 24,
              padding: '12px 12px 24px 12px',
              background: '#f1f1f1',
              borderRadius: 4,
            }}
          >
            <h5>推荐标签</h5>
            <div className={styles.margin_r}>
              <Button>重点标签</Button>
              <Button>标签1</Button>
              <Button>标签2</Button>
              <Button>标签3</Button>
              <Button>标签4</Button>
            </div>
          </div>
        </Col> */}
        <Col span={24}>
          <Form.Item label="解决方案" {...forminladeLayout}>
            {getFieldDecorator('handle_content', {
              initialValue: handle.content,
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('ha14')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
          </Form.Item>
        </Col> */}
      </Form>
    </Row>
  );
});

Handle.defaultProps = {
  info: {
    handle: {
      add_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      content: '',
      end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      event_effect: '',
      event_emergent: '',
      event_prior: '',
      handle_result: '',
      handler: '管理员',
      handler_id: '1',
      handle_unit: '广西电网有限责任公司',
      handle_unit_id: '7AC3EF0F718E02A2E0530A644F130365',
      handle_dept: '广西电网有限责任公司',
      handle_dept_id: '7AC3EF0F639302A2E0530A644F130365',
    },
  },
  main: {
    event_object: '',
    event_type: '',
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

export default Form.create({})(Handle);
