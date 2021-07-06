import React, { useImperativeHandle, useRef } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Card,
  Tag
} from 'antd';

const { TextArea } = Input;

const BusinessAudit = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    repeatAudit
  } = props;
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
          <Form.Item label='审核结果'>
            {getFieldDecorator('dd', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ]
            })
              (
                <Radio.Group>
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

        <Col span={24}>
          <Form.Item label='审核说明' {...forminladeLayout}>
            {
              getFieldDecorator('content', {})
                (
                  <TextArea
                    autoSize={{ minRows: 3 }}
                    placeholder='请输入'
                  />
                )
            }

          </Form.Item>
        </Col>

        {
          !repeatAudit && (
            <Col span={24} >
              <Form.Item label='考核状态' {...forminladeLayout}>
                {
                  getFieldDecorator('statue', {})
                    (<Tag color="blue">blue</Tag>)
                }
              </Form.Item>
            </Col>
          )
        }


        <Col span={8}>
          <Form.Item label='审核人'>
            {
              getFieldDecorator('person', {})
                (<Input />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='审核时间'>
            {
              getFieldDecorator('time', {
                rules: [
                  {
                    required,
                    message: '请选择审核时间'
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

export default Form.create({})(BusinessAudit)