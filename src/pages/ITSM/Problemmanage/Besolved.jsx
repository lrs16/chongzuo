import React from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function Besolved(props) {
  onFinsh = (values) => {
    console.log('values',values);
  }
  const pagetitle = props.route.name;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const required = true;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button 
              type="primary" 
              style={{marginRight:'8px'}}
              htmlType='submit'
            >
              保存
            </Button>
        

            <Button
              type='primary'
              style={{marginRight: 8}}
            >
              流转
            </Button>

            <Button
              type='primary'
              >
              关闭
            </Button>
          </>
        }
        >
          <Row gutter={16}>
          <Form onFinish={onFinsh}>
            <Col className="gutter-row" span={8}>
            <Form.Item label='问题编号'>
              { getFieldDecorator('questionNumber',{
                rules:[
                  {
                    required,
                    message:'请输入问题编号'
                  }
                ]

              })(<Input/>)}
            </Form.Item>

            </Col>

            <Col className="gutter-row" span={8}>
            <Form.Item label='问题来源'>
              { getFieldDecorator('questionSource',{
                rules:[
                  {
                    required,
                    message:'请输入问题来源'
                  }
                ]
              })(<Input/>)}
            </Form.Item>
            </Col>

            <Col className="gutter-row" span={8}>
            <Form.Item label='问题分类'>
              {getFieldDecorator('questionClass',{
                rules: [
                  {
                    required,
                    message:'请输入问题分类'
                  }
                ]
              })}
            </Form.Item>
            </Col>

           
          </Form>

          </Row>
         

      </Card>

    </PageHeaderWrapper>
  )
  
}

export default Form.create({})(Besolved);