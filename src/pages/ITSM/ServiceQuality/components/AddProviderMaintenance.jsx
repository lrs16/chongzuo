import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Input,
  Popconfirm,
  Divider
} from 'antd';
import { connect } from 'dva';
import Contract from './Contract';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}


function AddProviderMaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator },
    maintenanceData,
    location: { query: { id } },
    dispatch
  } = props;
  const required = true;

  const handleonSumit = (values) => {
    console.log('values: ', values);
  }

  const handleDelete = (id) => {
    return dispatch({
      type: 'qualityassessment/maintenanceList',
      payload: { id }
    }).then(res => {
      // message.info(res.msg);
      searchdata({}, paginations.current, paginations.pageSize)
    })

  }

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: '服务商名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '签订日期',
      dataIndex: 'data',
      key: 'data'
    },
    {
      title: '到期日期',
      dataIndex: 'enddata',
      key: 'enddata'
    },
    {
      title: '状态',
      dataIndex: 'statue',
      key: 'statue'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        if (!id) {
          return (
            <span>
              <Contract
                title='编辑合同'
                formItemLayout={formItemLayout}
                onSumit={values => handleonSumit(values)}
              >
                <a>
                  编辑合同
                </a>
              </Contract>
              <Divider type="vertical" />
              <Popconfirm
                title='是否要删除此行？'
                onConfirm={() => handleDelete(record.key)}
              >
                <a>删除合同</a>
              </Popconfirm>
            </span>
          )
        }

        if (id) {
          return null
        }

      }
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'qualityassessment/maintenanceList',
    })
  }, [])

  const handleBack = () => {
    router.push({
      pathname: `/ITSM/servicequalityassessment/serviceprovidermaintenance`,
    })
  }

  return (
    <PageHeaderWrapper
      title={id ? '服务商维护详情' : pagetitle}
      extra={
        <>
          {!id && (
            <Button type='primary'>保存</Button>

          )}
          <Button onClick={handleBack}>返回</Button>
        </>
      }
    >
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务商编号'>
                {getFieldDecorator('no', {
                })
                  (<Input disabled={id} />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='服务商名称'>
                {getFieldDecorator('no', {
                  rules: [
                    {
                      required,
                      message: '请输入服务商名称'
                    }
                  ]
                })
                  (<Input disabled={id} />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='负责人'>
                {getFieldDecorator('no', {
                  rules: [
                    {
                      required,
                      message: '请输入负责人'
                    }
                  ]
                })
                  (<Input disabled={id} />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='负责人手机号'>
                {getFieldDecorator('no', {
                  rules: [
                    {
                      required,
                      message: '请输入负责人手机号'
                    }
                  ]
                })
                  (<Input disabled={id} />)
                }
              </Form.Item>
            </Col>

          </Form>
        </Row>

        {!id && (
          <Contract
            title='新增合同'
            formItemLayout={formItemLayout}
            onSumit={values => handleonSumit(values)}
          >
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type='primary'
              ghost
              icon='plus'
            >
              添加合同
            </Button>
          </Contract>
        )}

        <Table
          columns={columns}
          dataSource={maintenanceData}
        />


      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData
  }))(AddProviderMaintenance)
)
