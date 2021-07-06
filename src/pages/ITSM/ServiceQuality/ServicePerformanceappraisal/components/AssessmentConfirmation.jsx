import React, { useImperativeHandle, useRef } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Tag
} from 'antd';

const { TextArea } = Input;

const AssessmentConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout
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
          <Form.Item label='是否申诉'>
            {
              getFieldDecorator('aa', {})
                (
                  <Radio.Group>
                    <Radio value='1'>是</Radio>
                    <Radio value='0'>否</Radio>
                  </Radio.Group>
                )
            }
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label='申诉内容' {...forminladeLayout}>
            {
              getFieldDecorator('aa', {})
                (
                  <TextArea
                    autosize={{ minRows: 3 }}
                  // placeholder='请输入申诉内容'
                  />
                )
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认结果'>
            {
              getFieldDecorator('aa', {})
                (
                  <Radio.Group>
                    <Radio value='1'>确认考核</Radio>
                    <Radio value='0'>取消考核</Radio>
                  </Radio.Group>
                )
            }
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label='确认说明' {...forminladeLayout}>
            {
              getFieldDecorator('aa', {})
                (
                  <TextArea
                    autosize={{ minRows: 3 }}
                    placeholder='请输入确认说明'
                  />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='考核类型'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label='考核内容说明' {...forminladeLayout}>
            {
              getFieldDecorator('aa', {})
                (
                  <TextArea
                    autosize={{ minRows: 3 }}
                    placeholder='请输入考核内容说明'
                  />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='一级指标'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='二级指标'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={24} {...forminladeLayout}>
          <Form.Item label='详细条款'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='考核得分'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认时间'>
            {
              getFieldDecorator('aa', {})
                (<Input />)
            }
          </Form.Item>
        </Col>
      </Form>

    </Row>
  )
})

export default Form.create({})(AssessmentConfirmation)

