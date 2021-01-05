import React, { useRef, useImperativeHandle, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Upload, Button, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Option } = Select;
const { TextArea } = Input;

const degreemap = [
  { key: '001', value: '低' },
  { key: '002', value: '中' },
  { key: '003', value: '高' },
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
  const { formItemLayout, forminladeLayout, info, main, userinfo, defaultvalue } = props;
  console.log(defaultvalue);
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

  useEffect(() => {
    sessionStorage.setItem('Nextflowtype', '确认');
  }, []);

  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="处理表单id">
            {getFieldDecorator('handle_id', {
              initialValue: handle.id,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('handle_handler', {
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="处理人ID">
            {getFieldDecorator('handle_handlerId', {
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人单位">
            {getFieldDecorator('handle_handleUnit', {
              initialValue: userinfo.unitName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="处理人单位ID">
            {getFieldDecorator('handle_handleUnitId', {
              initialValue: userinfo.unitId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理人部门">
            {getFieldDecorator('handle_handleDept', {
              initialValue: userinfo.deptName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
          <Form.Item label="处理人部门ID" style={{ display: 'none' }}>
            {getFieldDecorator('handle_handleDeptId', {
              initialValue: userinfo.deptId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        {/* 保存环节 */}
        {defaultvalue !== '' && defaultvalue !== undefined && (
          <>
            <Col span={8}>
              <Form.Item label="影响度">
                {getFieldDecorator('handle_eventEffect', {
                  rules: [{ required, message: '请选择影响度' }],
                  initialValue: defaultvalue.register_eventEffect,
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
                {getFieldDecorator('handle_eventEmergent', {
                  rules: [{ required, message: '请选择紧急度' }],
                  initialValue: defaultvalue.register_eventEmergent,
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
                {getFieldDecorator('handle_eventPrior', {
                  rules: [{ required, message: '请选择优先级' }],
                  initialValue: defaultvalue.register_eventPrior,
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
                {getFieldDecorator('main_eventType', {
                  rules: [{ required, message: '请选择事件分类' }],
                  initialValue: defaultvalue.main_eventType,
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
                {getFieldDecorator('main_eventObject', {
                  rules: [{ required, message: '请选择事件对象' }],
                  initialValue: defaultvalue.main_eventObject,
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
          </>
        )}
        {/* 登记时自行处理,处理环节 */}
        {(defaultvalue === '' || defaultvalue === undefined) && (
          <>
            {handle.eventEffect !== '' && (
              <>
                <Col span={8}>
                  <Form.Item label="影响度">
                    {getFieldDecorator('handle_eventEffect', {
                      rules: [{ required, message: '请选择影响度' }],
                      initialValue: handle.eventEffect,
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
                    {getFieldDecorator('handle_eventEmergent', {
                      rules: [{ required, message: '请选择紧急度' }],
                      initialValue: handle.eventEmergent,
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
                    {getFieldDecorator('handle_eventPrior', {
                      rules: [{ required, message: '请选择优先级' }],
                      initialValue: handle.eventPrior,
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
              </>
            )}
            {handle.eventEffect === '' && (
              <>
                <Col span={8}>
                  <Form.Item label="影响度">
                    {getFieldDecorator('handle_eventEffect', {
                      rules: [{ required, message: '请选择影响度' }],
                      initialValue: main.eventEffect,
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
                    {getFieldDecorator('handle_eventEmergent', {
                      rules: [{ required, message: '请选择紧急度' }],
                      initialValue: main.eventEmergent,
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
                    {getFieldDecorator('handle_eventPrior', {
                      rules: [{ required, message: '请选择优先级' }],
                      initialValue: main.eventPrior,
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
              </>
            )}
            <Col span={8}>
              <Form.Item label="事件分类">
                {getFieldDecorator('main_eventType', {
                  rules: [{ required, message: '请选择事件分类' }],
                  initialValue: main.eventType,
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
                {getFieldDecorator('main_eventObject', {
                  rules: [{ required, message: '请选择事件对象' }],
                  initialValue: main.eventObject,
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
          </>
        )}
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('handle_handleResult', {
              rules: [{ required, message: '请选择处理结果' }],
              initialValue: main.eventResult,
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
            {getFieldDecorator('handle_addTime', {
              rules: [{ required }],
              initialValue: handle.addTime,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="完成时间">
            {getFieldDecorator('handle_endTime', {
              rules: [{ required }],
              initialValue: moment(handle.endTime),
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
              rules: [{ required, message: '请输入解决方案' }],
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
      addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      content: '',
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      eventEffect: '',
      eventEmergent: '',
      eventPrior: '',
      handleResult: '',
      id: '',
    },
  },
  main: {
    eventObject: '',
    eventType: '',
    eventEffect: '',
    eventEmergent: '',
    eventPrior: '',
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
