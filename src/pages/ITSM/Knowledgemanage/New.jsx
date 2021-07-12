import React, { useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RichTextEditor from '@/components/RichTextEditor'

const formallItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  labelAlign: 'left'
};

function New(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch,
  } = props;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formallItemLayout} >
            <Col span={8}>
              <Form.Item label="知识编号">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="知识分类">
                {getFieldDecorator('form2', {
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布时间">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="知识标题">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="知识内容">
                <RichTextEditor />
              </Form.Item>
            </Col>

          </Form>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(New),
);