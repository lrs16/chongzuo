import React, { useContext, useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, Upload, Button, Checkbox, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
import moment from 'moment';
import Link from 'umi/link';
import { RegistratContext } from '../Registration';


const { Option } = Select;
const { TextArea } = Input;


const Closeedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, close } = props;
  const { getFieldDecorator } = props.form;
  // const { setActiveKey, setShow } = useContext(RegistratContext);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
    <Col span={8}>
        <Form.Item label="关闭人">
          {getFieldDecorator('closeUser', {
            rules: [
              {
                required,
                message: '请输入关闭人',
              },
            ],
             initialValue: close?close.closeUser:''
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="关闭单位">
          {getFieldDecorator('closeUnit', {
            initialValue: close?close.closeUnit:''
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="关闭部门">
          {getFieldDecorator('closeDept', {
            initialValue: close?close.closeDept:''
          })(<Input />)}
        </Form.Item>
      </Col>

      <Col span={22}>
        <Form.Item label="问题总结" {...forminladeLayout}>
          {getFieldDecorator('closeContent', {
            rules: [
              {
                required,
                message: '请输入问题总结',
              },
            ],
            initialValue: close?close.closeContent:''
          })(<TextArea />)}
        </Form.Item>
      </Col>
    </Form>
    </Row>

    
  );
});

export default Form.create({})(Closeedit);
