import React,{ useEffect } from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Card,
  Input
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  },
}

function CreditCardSearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator }
  } = props;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务商'>
                {
                  getFieldDecorator('dd',{})
                  (<Input />)
                }
              </Form.Item>
            </Col>

          </Form>
        </Row>
      </Card>

    </PageHeaderWrapper>
  )
}

export default  Form.create({})(CreditCardSearch);