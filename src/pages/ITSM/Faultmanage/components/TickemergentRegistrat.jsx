import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Row, Col, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import FormTextArea from '@/components/FormTextArea'; // 文本域收缩: 默认展示一行
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

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

function TickemergentRegistrat(props, ref) {
  const { formrecord, userinfo, userlist, unedit } = props;

  const { getFieldDecorator, getFieldsValue, setFieldsValue, resetFields } = props.form;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const required = true;

  const formRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      getVal: () => getFieldsValue(),
      resetVal: () => resetFields(),
      Forms: props.form.validateFieldsAndScroll,
      geteventObject: props.form.validateFields,
    }),
    [],
  );

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children || [];
    }
    return [];
  };

  const unitmap = getTypebyId(13331); // 单位

  return (
    <>
      <Form ref={formRef} {...formItemLayout}>
        <Row gutter={24}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="表单id">
              {getFieldDecorator('id', {
                initialValue: formrecord?.id || '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="抢修票编号">
              {getFieldDecorator('no', {
                initialValue: formrecord?.no || '',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登记时间">
              {getFieldDecorator('registerTime', {
                rules: [{ required, message: '请选择登记时间' }],
                initialValue: moment(formrecord?.registerTime || undefined),
              })(
                <>
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    defaultValue={moment(formrecord?.registerTime || undefined)}
                    onChange={v => {
                      setFieldsValue({ registerTime: moment(v) });
                    }}
                    disabled={unedit}
                  />
                </>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="抢修负责人">
              {getFieldDecorator('addUser', {
                rules: [{ required, message: '请输入抢修负责人' }],
                initialValue: formrecord?.addUser ? formrecord.addUser : userinfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单位或班组">
              {getFieldDecorator('unit', {
                rules: [{ required, message: '请选择单位或班组' }],
                initialValue: formrecord?.unit || '',
              })(
                <Select placeholder="请选择" allowClear disabled={unedit}>
                  {unitmap.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="抢修人员">
              {getFieldDecorator('repairer', {
                rules: [{ required, message: '请输入抢修人员' }],
                initialValue: formrecord?.repairer || '',
              })(<Input placeholder="请输入" allowClear disabled={unedit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="监护人">
              {getFieldDecorator('guardian', {
                rules: [{ required, message: '请输入监护人' }],
                initialValue: formrecord?.guardian || '',
              })(<Input placeholder="请输入" allowClear disabled={unedit} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障发生时间">
              {getFieldDecorator('occurrenceTime', {
                rules: [{ required, message: '请选择故障发生时间' }],
                initialValue: moment(formrecord?.occurrenceTime || undefined),
              })(
                <>
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    defaultValue={moment(formrecord?.occurrenceTime || undefined)}
                    onChange={v => {
                      setFieldsValue({ occurrenceTime: moment(v) });
                    }}
                    disabled={unedit}
                  />
                </>,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
            <Form.Item label="故障范围" {...forminladeLayout}>
              {getFieldDecorator('troubleRange', {
                rules: [{ required, message: '请输入故障范围' }],
                initialValue: formrecord.troubleRange || '',
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={formrecord.troubleRange || ''}
                  isEdit={!unedit}
                  getVal={v => setFieldsValue({ troubleRange: v })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
            <Form.Item label="抢修风险" {...forminladeLayout}>
              {getFieldDecorator('risk', {
                rules: [{ required, message: '请输入抢修风险' }],
                initialValue: formrecord?.risk || '',
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={formrecord?.risk || ''}
                  isEdit={!unedit}
                  getVal={v => setFieldsValue({ risk: v })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
            <Form.Item label="抢修内容" {...forminladeLayout}>
              {getFieldDecorator('content', {
                rules: [{ required, message: '请输入抢修内容' }],
                initialValue: formrecord?.content || '',
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={formrecord?.content || ''}
                  isEdit={!unedit}
                  getVal={v => setFieldsValue({ content: v })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: 4, marginBottom: '-10px' }}>
            <Form.Item label="风险应对措施" {...forminladeLayout}>
              {getFieldDecorator('measures', {
                rules: [{ required, message: '请输入风险应对措施' }],
                initialValue: formrecord?.measures || '',
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={formrecord?.measures || ''}
                  isEdit={!unedit}
                  getVal={v => setFieldsValue({ measures: v })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Col span={8}>
              <Form.Item label="系统开发商确认人">
                {getFieldDecorator('confirm', {
                  rules: [{ required, message: '请选择确认人' }],
                  initialValue: formrecord?.confirm || '',
                })(
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={unedit}
                    onSelect={(_, option) => setFieldsValue({ confirmId: option.key })}
                  >
                    {userlist &&
                      userlist.confirm.map(obj => (
                        <Option key={obj.useId} value={obj.userName}>
                          {obj.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={16} style={{ display: 'none' }}>
              <Form.Item label="确认人Id">
                {getFieldDecorator('confirmId', {
                  initialValue: formrecord?.confirmId || '',
                })(<Input />)}
              </Form.Item>
            </Col>
          </Col>
          <Col span={24}>
            <Col span={8}>
              <Form.Item label="工作许可人">
                {getFieldDecorator('permit', {
                  rules: [{ required, message: '请选择许可人' }],
                  initialValue: formrecord?.permit || '',
                })(
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={unedit}
                    onSelect={(_, option) => setFieldsValue({ permitId: option.key })}
                  >
                    {userlist &&
                      userlist.permit.map(obj => (
                        <Option key={obj.useId} value={obj.userName}>
                          {obj.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={16} style={{ display: 'none' }}>
              <Form.Item label="许可人Id">
                {getFieldDecorator('permitId', {
                  initialValue: formrecord?.permitId || '',
                })(<Input />)}
              </Form.Item>
            </Col>
          </Col>
          <Col span={24}>
            <Col span={8}>
              <Form.Item label="工作签发人">
                {getFieldDecorator('issue', {
                  rules: [{ required, message: '请选择签发人' }],
                  initialValue: formrecord?.issue || '',
                })(
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={unedit}
                    onSelect={(_, option) => setFieldsValue({ issueId: option.key })}
                  >
                    {userlist &&
                      userlist.issue.map(obj => (
                        <Option key={obj.useId} value={obj.userName}>
                          {obj.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={16} style={{ display: 'none' }}>
              <Form.Item label="签发人Id">
                {getFieldDecorator('issueId', {
                  initialValue: formrecord?.issueId || '',
                })(<Input />)}
              </Form.Item>
            </Col>
          </Col>
          <Col span={24}>
            <Col span={8}>
              <Form.Item label="工作接收人">
                {getFieldDecorator('receive', {
                  rules: [{ required, message: '请选择接收人' }],
                  initialValue: formrecord?.receive || '',
                })(
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={unedit}
                    onSelect={(_, option) => setFieldsValue({ receiveId: option.key })}
                  >
                    {userlist &&
                      userlist.receive.map(obj => (
                        <Option key={obj.useId} value={obj.userName}>
                          {obj.userName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={16} style={{ display: 'none' }}>
              <Form.Item label="接收人Id">
                {getFieldDecorator('receiveId', {
                  initialValue: formrecord?.receiveId || '',
                })(<Input />)}
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </Form>
      <DictLower
        typeid="13330"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
    </>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(TickemergentRegistrat));

WrappedForm.defaultProps = {
  formrecord: {
    no: '',
    id: '',
    unit: '',
    repairer: '',
    risk: '',
    troubleRange: '',
    guardian: '',
    measures: '',
    content: '',
    issue: '',
    issueId: '',
    permit: '',
    permitTd: '',
    confirm: '',
    confirmId: '',
    receive: '',
    receiveId: '',
    registerTime: undefined,
    occurrenceTime: undefined,
  },
  userinfo: {
    addUser: '',
  },
};

export default WrappedForm;
