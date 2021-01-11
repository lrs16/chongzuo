import React, { useRef, useImperativeHandle,useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Alert
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const Systemoperatoredit = React.forwardRef((props,ref) => {
  const { formItemLayout,forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const [value,setValue] = useState(1);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const onChange = (e) => {
    console.log('e: ', e);

  }
  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={23}>
          <Form.Item label='审核结果' {...forminladeLayout}>
          { getFieldDecorator('m1',{
            rules:[
              {
                required,
                message:'请输入审核结果'
              }
            ],
            initialValue:value
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

        <Col span={23}>
          <Form.Item label='审核时间' {...forminladeLayout}>
            {
              getFieldDecorator('m2',{
                rules:[
                  {
                    required,
                    message:'请输入审核时间'
                  }
                ]
              })(
                <DatePicker
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
                />
              )
            }
          </Form.Item>
        </Col>

        <Col span={23}>
          <Form.Item label='审核意见' {...forminladeLayout}>
            {
              getFieldDecorator('m3',{
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
        
        <Col span={23}>
          <Form.Item {...forminladeLayout} label='ff'>
            <Alert 
              message="若需要上传故障报告请于故障处理完成五个工作日内进行上传。" 
              type="warning" 
              showIcon
              />
          </Form.Item>
        </Col>

        <Col span={23}>
          <Form.Item label='上传附件' {...forminladeLayout} >

          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='审核人'>
            {
              getFieldDecorator('m5',{

              })(<Input disabled/>)
            }

          </Form.Item>
          
        </Col>
  
        <Col span={8}>
          <Form.Item label='审核人单位'>
            {
              getFieldDecorator('m6')(<Input disabled/>)
            }
          </Form.Item>

        </Col>
  
        <Col span={8}>
          <Form.Item label='审核人部门'>
            {
              getFieldDecorator('m6')(<Input disabled/>)
            }
          </Form.Item>

        </Col>
  
      </Form>

    </Row>
  )
});

export default Form.create({})(Systemoperatoredit);