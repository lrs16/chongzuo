import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import SysUpload from '@/components/SysUpload';
const { TextArea } = Input;

const ProviderConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout
  } = props;
  const [fileslist, setFilesList] = useState([]);
  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    []
  )

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='是否申诉'>
            {
              getFieldDecorator('ff', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ]
              })
                (
                  <Radio.Group>
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
        <Col span={24}>
          <Form.Item label='申诉内容' {...forminladeLayout}>
            {
              getFieldDecorator('ff', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ]
              })
              (<TextArea 
                  autoSize={{ minRows: 3 }}
                  placeholder='请输入申诉内容'
              />)
            }

          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label='上传附件'  {...forminladeLayout}>
            {
              getFieldDecorator('ff', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ]
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
              getFieldDecorator('ff', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ]
              })
              (<Input />)
            }

          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认时间'>
            {
              getFieldDecorator('ff', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ]
              })
              (<Input />)
            }

          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

export default Form.create({})(ProviderConfirmation)