import React, { useContext, useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, Upload, Button, Checkbox, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '../index.less';
import moment from 'moment';
import Link from 'umi/link';
import { RegistratContext } from '../Registration';


const { Option } = Select;
const { TextArea } = Input;


const Previewedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, show } = props;
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
  const {
    check,
    useInfo
  } = props;

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
      <Col span={8}>
        <Form.Item label="审核时间">
          {getFieldDecorator('checkTime', {
            rules:[
              {
                required,
                message:'请输入审核时间'
              }
            ],
            initialValue: check ? moment(check.checkTime) : moment(new Date()),
          })(<DatePicker 
               showTime 
               format="YYYY-MM-DD HH:mm:ss" 
          />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="所属项目">
          {getFieldDecorator('checkInfo', {
            rules:[
            {
              required,
              message:'请输入所属项目'
            }
          ],
            initialValue: check ? check.checkInfo : '',
          })(<Input />)}
        </Form.Item>
      </Col>
   
      <Col span={23}>
        <Form.Item label="审核意见" {...forminladeLayout}>
          {getFieldDecorator('checkOpinion', {
            rules: [
              {
                required,
                message: '请输入审核意见',
              },
            ],
            initialValue: check ? check.checkOpinion : '',
          })(<TextArea />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="审核人">
          {getFieldDecorator('checkUser', {
            // rules: [
            //   {
            //     required,
            //     message: '请输入审核人',
            //   },
            // ],
            initialValue: useInfo?useInfo.loginCode:'',
          })(<Input disabled/>)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="审核单位">
          {getFieldDecorator('checkUnit', {
            initialValue: '单位',
          })(<Input disabled/>)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="审核部门">
          {getFieldDecorator('checkDept', {
           initialValue: useInfo?useInfo.deptNameExt:'',
          })(<Input disabled/>)}
        </Form.Item>
      </Col>
    </Form>
  </Row>

  );
});

export default Form.create({})(Previewedit);
