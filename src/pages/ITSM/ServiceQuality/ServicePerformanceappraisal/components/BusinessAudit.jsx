import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Card,
  Tag,
  DatePicker
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const BusinessAudit = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    repeatAudit,
    businessAudit,
    userinfo,
  } = props;

  const [showContent, setShowContent] = useState('1');

  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    []
  )

  const handleChange = (e) => {
    setShowContent(e.target.value)
  }
  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='审核结果'>
            {getFieldDecorator('verifyValue', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ]
            })
              (
                <Radio.Group onChange={handleChange}>
                  <Radio value='1'>
                    通过
                  </Radio>

                  <Radio value='0'>
                    不通过
                  </Radio>

                </Radio.Group>
              )
            }
          </Form.Item>
        </Col>

        {
          showContent === '1' && (
            <Col span={24}>
            <Form.Item label='审核说明' {...forminladeLayout}>
              {
                getFieldDecorator('verifyContent', {})
                  (
                    <TextArea
                      autoSize={{ minRows: 3 }}
                      placeholder='请输入'
                    />
                  )
              }
  
            </Form.Item>
          </Col>
  
          )
        } 

        {
          showContent === '0' && (
            <Col span={24}>
            <Form.Item label='审核说明' {...forminladeLayout}>
              {
                getFieldDecorator('verifyContent', {
                  rules:[
                    {
                      required,
                      message:'请输入审核说明'
                    }
                  ]
                })
                  (
                    <TextArea
                      autoSize={{ minRows: 3 }}
                      placeholder='请输入'
                    />
                  )
              }
  
            </Form.Item>
          </Col>
  
          )
        } 
      
        {
          !repeatAudit && (
            <Col span={24} >
              <Form.Item label='考核状态' {...forminladeLayout}>
                {
                  getFieldDecorator('verifyStatus', {})
                    (<Tag color="blue">待审</Tag>)
                }
              </Form.Item>
            </Col>
          )
        }


        <Col span={8}>
          <Form.Item label='审核人'>
            {
              getFieldDecorator('verifier', {
                initialValue: userinfo.userName
              })
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='审核时间'>
            {
              getFieldDecorator('verifyTime', {
                rules: [
                  {
                    required,
                    message: '请选择审核时间'
                  }
                ],
                initialValue: businessAudit.checktime
              })
                (
                  <DatePicker
                    showTime
                    format='YYYY-MM-DD HH:MM'
                  />)
            }
          </Form.Item>
        </Col>


      </Form>
    </Row>
  )
})

BusinessAudit.defaultProps = {
  businessAudit: {
    verifyValue:'',
    verifyContent:'',
    verifyStatus:'',
    verifier:'',
    verifyTime:'',
    checktime: moment(new Date())
  }
}

export default Form.create({})(BusinessAudit)