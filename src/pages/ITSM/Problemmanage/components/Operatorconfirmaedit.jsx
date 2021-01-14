import React, { useRef,useImperativeHandle,useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Upload,
  Button
} from 'antd';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Operatorconfirmaedit = React.forwardRef((props,ref) => {
  const { formItemLayout,forminladeLayout } = props;
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
    confirm,
    useInfo,
  } = props;
  const onChange = (e) => {
    console.log('e: ', e);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form>
        <Col span={23}>
          <Form.Item label='确认结果' {...forminladeLayout}>
          { getFieldDecorator('confirmResult',{
            rules:[
              {
                required,
                message:'请输入确认结果'
              }
            ],
            initialValue:1
          })(
            <Radio.Group onChange={onChange}>
              <Radio value='通过'>通过</Radio>
              <Radio value='不通过'>不通过</Radio>
            </Radio.Group>
          )
          }
          </Form.Item>
        </Col>
        <Col span={23}>
          <Form.Item label='确认时间' {...forminladeLayout}>
            {
              getFieldDecorator('confirmTime',{
                rules:[
                  {
                    required,
                    message:'请输入审核时间'
                  }
                ],
                initialValue: confirm ? moment(confirm.confirmTime) : moment(Date.now())
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
          <Form.Item label='确认意见' {...forminladeLayout}>
            {
              getFieldDecorator('confirmContent',{
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
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmUser',{
                initialValue: useInfo?useInfo.loginCode:'',
              })(<Input disabled/>)
            }

          </Form.Item>
          
        </Col>
  
        <Col span={8}>
          <Form.Item label='确认人单位'>
            {
              getFieldDecorator('confirmUnit',{
                initialValue: '单位',
              })(<Input disabled/>)
            }
          </Form.Item>

        </Col>
  
        <Col span={8}>
          <Form.Item label='确认人部门'>
            {
              getFieldDecorator('confirmDept',{
                initialValue: useInfo?useInfo.deptNameExt:'',
              })(<Input disabled/>)
            }
          </Form.Item>

        </Col>

      </Form>
    </Row>
  )
})

export default Form.create({})(Operatorconfirmaedit);