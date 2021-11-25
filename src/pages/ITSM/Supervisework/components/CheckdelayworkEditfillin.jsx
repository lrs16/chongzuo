import React, { useRef, useState, useImperativeHandle, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Tag
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const CheckdelayworkEditfillin = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    form: { getFieldDecorator, setFieldsValue },
    // ChangeResult,
    check,
    formItemLayout,
    forminladeLayout,
    userinfo,
  } = props;

  const [adopt, setAdopt] = useState('001');

  const color = ['blue', 'green'];

  useEffect(() => {
    if (check.result !== null) {
      setAdopt(check.result);
      // ChangeResult(check.result);
    }
  }, []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
    // ChangeResult(e.target.value);
  }

  const required = true;

  return (
    <div style={{ paddingRight: 24, marginTop: 24 }}>
      <Row gutter={16}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label='延期审核结果'>
              {getFieldDecorator('check_result', {
                rules: [
                  {
                    required,
                    message: '请输入审核结果'
                  }
                ],
                initialValue: (check === '' || check.result === null || check.result === '') ? '001' : check.result
              })(
                <Radio.Group
                  onChange={handleAdopt}
                >
                  <Radio value='001'>通过</Radio>
                  <Radio value='002'>不通过</Radio>
                </Radio.Group>
              )
              }
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="延期审核时间">
              {getFieldDecorator('check_checkTime', {
                rules: [
                  {
                    required,
                    message: '请输入审核时间'
                  }
                ],
                initialValue: check.checkTime ? moment(check.checkTime) : moment(new Date()),
              })(<>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  defaultValue={moment(check && check.checkTime ? check.checkTime : new Date())}
                  onChange={(v) => { setFieldsValue({ check_checkTime: moment(v) }) }}
                /></>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='延期审核状态'>
              {
                getFieldDecorator('check_status', {
                  initialValue: check.status ? check.status : ''
                })(
                  <Tag
                    color={color[0]}>待审核</Tag>
                )
              }
            </Form.Item>
          </Col>

          <Col span={24}>
            {adopt === '001' && (
              <Form.Item label="审核说明" {...forminladeLayout}>
                {getFieldDecorator('check_content', {
                  rules: [{ required: false, message: '请输入', }],
                  initialValue: check.content
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
            {adopt === '002' && (
              <Form.Item label="审核说明" {...forminladeLayout}>
                {getFieldDecorator('check_content', {
                  rules: [{ required: true, message: '请输入', }],
                  initialValue: check.content
                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            <Form.Item label="延期审核人">
              {getFieldDecorator('check_checkUser', {
                initialValue: userinfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="延期审核单位">
              {getFieldDecorator('check_checkUnit', {
                initialValue: userinfo.unitName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

CheckdelayworkEditfillin.defaultProps = {
  check: {
    content: '',
    checkTime: new Date(),
    result: '001',
  }
}

export default Form.create({})(CheckdelayworkEditfillin);
