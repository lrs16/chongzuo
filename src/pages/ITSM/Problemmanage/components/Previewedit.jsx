import React, { useRef, useImperativeHandle } from 'react';
import { 
        Row,
        Col, 
        Form,
        Input,
        DatePicker
        } from 'antd';
import moment from 'moment';

const { TextArea } = Input;


const Previewedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
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
            c: check ? moment(check.checkTime) : moment(new Date()),
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
