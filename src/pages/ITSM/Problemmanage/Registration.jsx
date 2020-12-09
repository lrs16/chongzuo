import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Icon,
  DatePicker 
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span:24},
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span:24},
    sm: { span:18}
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
}

const { TextArea } = Input;

// @connect(({ problemmanage, loading }) => ({
//   problemmanage,
//   loading: loading.models.problemmanage,
// }))

const Registration = (props)  =>{
  const pagetitle = props.route.name;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const required = true;
  const data = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
  };

  const onFinish = () => {
    props.form.validateFields((err, values) => {
      if(!err){
        console.log(values,'values');
      }
  })
  };

  const {
    loading,
    list,
    dispatch
  } = props;

  useEffect(() => {
    dispatch({
      type:'problemmanage/fetchlist',
    });
  },[]);

  return (
 
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button 
              type="primary" 
              style={{marginRight:'8px'}}
              htmlType="submit"
              // onClick={onFinish}
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
          <Row>
            <Form {...formItemLayout} onSubmit={onFinish}>
              <Col span={8}>
                <Form.Item label='问题编号'>
                  { getFieldDecorator('questionNumber',{
                    rules:[
                      {
                        // required,
                        message:'请输入问题编号'
                      }
                    ],
                    initialValue: list.questionNumber || ''
                  })(<Input/>)}
                </Form.Item>

              </Col>

              <Col span={8}>
                <Form.Item label='问题来源'>
                  { getFieldDecorator('questionSource',{
                    rules:[
                      {
                        // required,
                        message:'请输入问题来源'
                      }
                    ],
                    initialValue: list.questionSource || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='问题分类'>
                  {getFieldDecorator('questionClass',{
                    rules: [
                      {
                        // required,
                        message:'请输入问题分类'
                      }
                    ],
                    initialValue: list.questionClass || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='紧急度'>
                  {getFieldDecorator('urgency',{
                    rules:[
                      {
                        // required,
                        message:'请输入紧急度'
                      }
                    ],
                    initialValue: list.urgency || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='影响度'>
                  {getFieldDecorator('influenceDegree',{
                    rules:[
                      {
                        // required,
                        message:'请输入影响度'
                      }
                    ],
                    initialValue: list.influenceDegree || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='优先级'>
                  {getFieldDecorator('priority',{
                    rules:[
                      {
                        // required,
                        message:'请输入优先级'
                      }
                    ],
                    initialValue: list.priority || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='填报人单位'>
                  {getFieldDecorator('applicant',{
                    rules:[
                      {
                        // required,
                        message:'请输入填报人单位'
                      }
                    ],
                    initialValue: list.applicant || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='填报人部门'>
                  {getFieldDecorator('Department',{
                    rules:[
                      {
                        // required,
                        message:'请输入填报人部门'
                      }
                    ],
                    initialValue: list.Department || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='填报人'>
                  {getFieldDecorator('filledBy',{
                    rules:[
                      {
                        // required,
                        message:'请输入填报人'
                      }
                    ],
                    initialValue: list.filledBy || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

            

              <Col span={8}>
                <Form.Item label='联系电话'>
                  {getFieldDecorator('contactNumber',{
                    rules:[
                      {
                        // required,
                        message:'请输入联系电话'
                      }
                    ],
                    initialValue: list.contactNumber || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='登记时间'>
                  {getFieldDecorator('registTime',{
                    rules:[
                      {
                        // required,
                        message:'请输入登记时间'
                      }
                    ],
                    initialValue: moment(list.registTime) || ''
                  })(<DatePicker format='YYYY-MM-DD HH:mm'/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='建单时间'>
                  {getFieldDecorator('orderCreationtime',{
                    rules:[
                      {
                        // required,
                        message:'请输入紧急度'
                      }
                    ],
                    initialValue: moment(list.orderCreationtime) || ''
                  })(<DatePicker format='YYYY-MM-DD HH:mm'/>)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='问题标题' {...forminladeLayout}>
                  {getFieldDecorator('questionTitle',{
                    rules:[
                      {
                        // required,
                        message:'请输入紧急度'
                      }
                    ],
                    initialValue: list.questionTitle || ''
                  })(<Input/>)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='问题描述' {...forminladeLayout}>
                  {getFieldDecorator('problemDescription',{
                    rules:[
                      {
                        // required,
                        message:'请输入问题描述'
                      }
                    ],
                    initialValue: list.problemDescription || ''
                  })(<TextArea/>)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='上传附件' {...forminladeLayout}>
                  {getFieldDecorator('uploadAttachment',{
                    rules:[
                      {
                        // required,
                        message:'请输入问题描述'
                      }
                    ],
                  })(<Upload {...data}>
                       <Button type='primary'>
                         <Icon type="upload" /> Click to Upload
                       </Button>
                    </Upload>)}
                </Form.Item>
              </Col>
            </Form>
          </Row>
      </Card>

    </PageHeaderWrapper>
  )
  
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    list: problemmanage.list,
    loading: loading.models.problemmanage
  }))(Registration),
);