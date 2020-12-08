import React from 'react';
import { useState } from 'react';
// import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Icon 
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

  // onChange = (info) => {
  //   if (info.file.status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (info.file.status === 'done') {
  //     // message.success(`${info.file.name} file uploaded successfully`);
  //   } else if (info.file.status === 'error') {
  //     // message.error(`${info.file.name} file upload failed.`);
  //   }
  // }

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
                    ]

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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
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
                    ]
                  })(<Input/>)}
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
                    ]
                  })(<Input/>)}
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
                    ]
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
                    ]
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
                    ]
                  })(<Upload {...data}>
                       <Button>
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

export default Form.create({})(Registration);