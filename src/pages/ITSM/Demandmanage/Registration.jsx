import React, { useContext, useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Checkbox, Upload } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function Registration(props) {
  const pagetitle = props.route.name;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button type="primary" style={{ marginRight: 8 }}>
              保 存
            </Button>
            <Button type="primary" style={{ marginRight: 8 }}>
              流 转
            </Button>
            <Button type="default">关 闭</Button>
          </>
        }
      >
        <Row gutter="24">
          <Form {...formItemLayout}>
            <Col span="8">
              <Form.Item label="需求编号">
                {getFieldDecorator('form1')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="建单时间">
                {getFieldDecorator('form2')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="登记时间">
                {getFieldDecorator('form3')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="提出人">
                {getFieldDecorator('form4')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="提出单位">
                {getFieldDecorator('form5')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="提出部门">
                {getFieldDecorator('form6')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="提出人电话">
                {getFieldDecorator('form7')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="需求类型">
                {getFieldDecorator('form8')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="所属功能模块" {...forminladeLayout}>
                {getFieldDecorator('form9')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="需求原因" {...forminladeLayout}>
                {getFieldDecorator('form10')(
                  <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />,
                )}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="需求详述" {...forminladeLayout}>
                {getFieldDecorator('form11')(
                  <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />,
                )}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
                extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
              >
                {getFieldDecorator('form17')(
                  <Upload>
                    <Button type="primary">
                      <DownloadOutlined /> 上传附件
                    </Button>
                  </Upload>,
                )}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="登记人">
                {getFieldDecorator('form18')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="登记人单位">
                {getFieldDecorator('form19')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="登记人部门">
                {getFieldDecorator('form20')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(Registration);
