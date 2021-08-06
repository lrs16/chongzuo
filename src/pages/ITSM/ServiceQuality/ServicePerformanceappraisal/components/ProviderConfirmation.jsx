import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker
} from 'antd';
import SysUpload from '@/components/SysUpload';
const { TextArea } = Input;

const ProviderConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    userinfo,
    providerConfirmation
  } = props;

  const [showContent, setShowContent] = useState('1');
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');
  
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
          <Form.Item label='是否申诉'>
            {
              getFieldDecorator('isAppeal', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ],
                initialValue:providerConfirmation.isAppeal
              })
                (
                  <Radio.Group onChange={handleChange}>
                    <Radio value='1'>
                      是
                    </Radio>

                    <Radio value='0'>
                      否
                    </Radio>
                  </Radio.Group>
                )
            }

          </Form.Item>
        </Col>

        {
          showContent === '1' && (
            <Col span={24}>
            <Form.Item label='申诉内容' {...forminladeLayout}>
              {
                getFieldDecorator('appealContent', {
                  rules: [
                    {
                      required,
                      message: '请选择是否申诉'
                    }
                  ],
                  initialValue:providerConfirmation.appealContent
                })
                (<TextArea 
                    autoSize={{ minRows: 3 }}
                    placeholder='请输入申诉内容'
                />)
              }
  
            </Form.Item>
          </Col>
          )
        }

        {
          showContent === '0' && (
            <Col span={24}>
            <Form.Item label='申诉内容' {...forminladeLayout}>
              {
                getFieldDecorator('appealContent', {
                  initialValue:providerConfirmation.appealContent
                })
                (<TextArea 
                    autoSize={{ minRows: 3 }}
                    placeholder='请输入申诉内容'
                />)
              }
  
            </Form.Item>
          </Col>
          )
        }

        <Col span={24}>
          <Form.Item label='上传附件'  {...forminladeLayout}>
            {
              getFieldDecorator('annex', {
                rules: [
                  {
                    required,
                    message: '请上传附件'
                  }
                ],
                initialValue: providerConfirmation.annex
              })
              (
                <div>
                  <SysUpload
                    fileslist={[]}
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                   />
                </div>
              )
            }

          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmer', {
                rules: [
                  {
                    required,
                    message: '请输入确认人'
                  }
                ],
                initialValue:userinfo.userName
              })
              (<Input />)
            }

          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认时间'>
            {
              getFieldDecorator('confirmTime', {
                rules: [
                  {
                    required,
                    message: '请选择确认时间'
                  }
                ],
                intialValue:providerConfirmation.confirmTime
              })
              (<DatePicker />)
            }

          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

ProviderConfirmation.defaultProps = {
  providerConfirmation:{
    isAppeal:'0',
    appealContent:'',
    annex:[],
    confirmer:'',
    confirmTime:'',
  }
}

export default Form.create({})(ProviderConfirmation)