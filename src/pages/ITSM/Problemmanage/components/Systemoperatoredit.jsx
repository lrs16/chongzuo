import React, { useContext,useRef, useImperativeHandle,useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Alert,
  Upload,
  Button
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import {FatherContext} from '../Workorder';

const { TextArea } = Input;


const Systemoperatoredit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const {flowtype,setFlowtype } = useContext(FatherContext);
  const attRef = useRef();
  // let {num ,setNum } = useContext(NumContext);
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

  
  const onChange = (e) => {
    setFlowtype(e.target.value);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
      <Col span={23}>
          <Form.Item label='审核结果' {...forminladeLayout}>
          { getFieldDecorator('checkResult',{
            rules:[
              {
                required,
                message:'请输入审核结果'
              }
            ],
            initialValue:check?check.checkResult:flowtype
          })(
            <Radio.Group onChange={onChange}>
              <Radio value='1'>通过</Radio>
              <Radio value='0'>不通过</Radio>
            </Radio.Group>
          )
          }
        </Form.Item>
        </Col>
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

      
      <Col span={23}>
          <Form.Item label='审核意见' {...forminladeLayout}>
            {
              getFieldDecorator('checkOpinion',{
                rules:[
                  {
                    required,
                    message:'请输入审核意见'
                  }
                ],
                initialValue: check ? check.checkOpinion:''
              })(
                <TextArea/>
              )
            }
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('checkAttachIds')(
              <Upload>
                <Button type="primary">
                  <DownloadOutlined /> 上传附件
                </Button>
              </Upload>,
            )}
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

export default Form.create({})(Systemoperatoredit);
