import React, { useContext, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, DatePicker, Radio, Tag } from 'antd';
import moment from 'moment';
import { FatherContext } from '../Work';
import FormTextArea from './FormTextArea';

import styles from '../index.less';


const TaskCheck = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    check,
    formItemLayout,
    forminladeLayout,
    userinfo,
  } = props;
  const { flowtype, setFlowtype } = useContext(FatherContext);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const color = ['blue', 'green'];

  const onChange = e => {
    setFlowtype(e.target.value);
  };

  useEffect(() => {
    setFlowtype(check.result === null ? '001' : check.result);
  }, []);

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="审核结果">
            {getFieldDecorator('check_result', {
              rules: [
                {
                  required,
                  message: '请输入审核结果',
                },
              ],
              initialValue: check.result === null ? '001' : check.result,
            })(
              <Radio.Group onChange={onChange}>
                <Radio value="001">通过</Radio>
                <Radio value="002">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('check_checkTime', {
              rules: [
                {
                  required,
                  message: '请输入审核时间',
                },
              ],
              initialValue: check.checkTime ? moment(check.checkTime) : moment(new Date()),
            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                allowClear={false}
              />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核状态">
            {getFieldDecorator('check_status', {
              initialValue: check.status,
            })(<Tag color={color[0]}>待审核</Tag>)}
          </Form.Item>
        </Col>

        <div className={styles.autoCompleteallowclear}>
          {flowtype === '002' && (
            <Col span={24} style={{ marginTop: 4 }}>
              <Form.Item label="审核说明" {...forminladeLayout}>
                {getFieldDecorator('check_content', {
                  rules: [
                    {
                      required,
                      message: '请输入审核说明',
                    },
                  ],
                  initialValue: check.content,
                })(<FormTextArea
                  autoSize={1}
                  indexText={check.content}
                  isEdit
                  getVal={v => setFieldsValue({ check_content: v })}
                />)}
              </Form.Item>
            </Col>
          )}

          {flowtype === '001' && (
            <Col span={24} style={{ marginTop: 4 }}>
              <Form.Item label="审核说明" {...forminladeLayout}>
                {getFieldDecorator('check_content', {
                  initialValue: check.content,
                })(<FormTextArea
                  autoSize={1}
                  indexText={check.content}
                  isEdit
                  getVal={v => setFieldsValue({ check_content: v })}
                />)}
              </Form.Item>
            </Col>
          )}
        </div>

        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('check_checkUser', {
              initialValue: userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核单位">
            {getFieldDecorator('check_checkUnit', {
              initialValue: userinfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

TaskCheck.defaultProps = {
  check: {
    content: '',
    checkTime: new Date(),
    result: '001',
  },
};

export default Form.create({})(TaskCheck);
