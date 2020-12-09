import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title:'问题编号',
    dataIndex:'numberProblem',
    key:'numberProblem'
  },
  {
    title:'问题标题',
    dataIndex:'questionTitle',
    key:'questionTitle'
  },
  {
    title:'问题来源',
    dataIndex:'problemSource',
    key:''
  },
  {
    title:'问题分类',
    dataIndex:'problemClass',
    key:''
  },
  {
    title:'当前处理环节',
    dataIndex:'currentProcess',
    key:'currentProcess'
  },
  {
    title:'发送人',
    dataIndex:'sender',
    key:'Sender'
  },
  {
    title:'发送时间',
    dataIndex:'sendTime',
    key:'sendTime'
  },
  {
    title:'优先级',
    dataIndex:'priority',
    key:'priority'
  },
]

function Besolved(props) {

  const pagetitle = props.route.name;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const required = true;
  const { 
    dispatch, 
    besolveList,
    loading
  } = props;
  console.log('props: ', props);
  

  useEffect(() => {
    dispatch({
      type:'problemmanage/besolveList'
    })
  },[])

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
          <Form>
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

          <Table 
            loading={loading}
            columns={columns}
            dataSource={besolveList.data}
            />
      </Card>

    </PageHeaderWrapper>
  )
  
}

export default Form.create({})(
  connect(({problemmanage,loading}) =>({
    besolveList: problemmanage.besolveList,
    loading:loading.models.problemmanage
  }))(Besolved)
);