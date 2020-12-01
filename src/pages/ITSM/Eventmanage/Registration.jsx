import React, { useContext, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Upload,
  Tag,
  Alert,
  Table,
  Select,
  DatePicker,
  Message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';

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
              <Form.Item label="建单时间">
                {getFieldDecorator('form1')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="事件来源">
                {getFieldDecorator('form2')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="申报人">
                {getFieldDecorator('form3')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="申报人单位">
                {getFieldDecorator('form4')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="申报人部门">
                {getFieldDecorator('form5')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="申报人电话">
                {getFieldDecorator('form6')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="回访方式">
                {getFieldDecorator('form7')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="影响度">
                {getFieldDecorator('form8')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="系统模块">
                {getFieldDecorator('form9')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="事件分类">
                {getFieldDecorator('form10')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="紧急度">
                {getFieldDecorator('form11')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="8">
              <Form.Item label="优先级">
                {getFieldDecorator('form12')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="事件标题" {...forminladeLayout}>
                {getFieldDecorator('form13')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="一线标签" {...forminladeLayout}>
                {getFieldDecorator('form14')(
                  <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
                )}
              </Form.Item>
            </Col>
            <Col span="22" offset="2">
              <span>您可输入相关标签（例如重点标签）</span>
              <div
                style={{
                  marginBottom: 24,
                  padding: '12px 12px 24px 12px',
                  background: '#f1f1f1',
                  borderRadius: 4,
                }}
              >
                <h5>推荐标签</h5>
                <div className={styles.margin_r}>
                  <Button>重点标签</Button>
                  <Button>标签1</Button>
                  <Button>标签2</Button>
                  <Button>标签3</Button>
                  <Button>标签4</Button>
                </div>
              </div>
            </Col>
            <Col span="24">
              <Form.Item label="事件描述" {...forminladeLayout}>
                {getFieldDecorator('form15')(
                  <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />,
                )}
              </Form.Item>
            </Col>
            <Col span="24">
              <Form.Item label="自行处理" {...forminladeLayout}>
                {getFieldDecorator('form16')(<Checkbox />)}
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
