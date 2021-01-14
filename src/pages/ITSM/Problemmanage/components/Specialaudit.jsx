import React, { useRef, useImperativeHandle,useState } from 'react';
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

const { TextArea } = Input;


const Specialaudit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const [ result,setResult ]  = useState(1);
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

  
  const onChange = (e) => {
    console.log('e: ', e);
    console.log(result,'result');
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
            initialValue: result
          })(
            <Radio.Group onChange={onChange}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
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
                ]
              })(
                <TextArea/>
              )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='上传问题报告'>
            {
              getFieldDecorator('m4',{
              
              })(
                <>
                <Radio.Group>
                  <Radio value={1}>A</Radio>
                  <Radio value={2}>B</Radio>
                </Radio.Group>           
              </>
              )
            }
          </Form.Item>
        </Col>

        {/* <Col span={23}>
          <Form.Item {...forminladeLayout} label=''>
            <Alert 
              message="若需要上传故障报告请于故障处理完成五个工作日内进行上传。" 
              type="warning" 
              showIcon
              />
          </Form.Item>
        </Col> */}

        <Col span={24}>
          <Form.Item 
            label='上传附件'
            {...forminladeLayout}
            extra='只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb'
            >
              {getFieldDecorator('attachIds')(
                <Upload>
                  <Button type='primary'>
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

export default Form.create({})(Specialaudit);
