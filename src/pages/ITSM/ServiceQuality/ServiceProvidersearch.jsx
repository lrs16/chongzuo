import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
  Popconfirm,
  Divider
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
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
  },
}


function ServiceProvidersearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields,resetFields },
    maintenanceData,
    dispatch
  } = props;
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'qualityassessment/maintenanceList',
      payload: {
        ...values
      }
    })
  }

  useEffect(() => {
    searchdata({}, paginations.current, paginations.pageSize)
  }, [])

  const columns = [
    {
      title: '服务商编号',
      dataIndex: 'no',
      key: 'no',
      render: (text, record) => {
        const gotoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/addserviceprovidermaintenance',
            query: {
              id: 'id'
            }
          })
        }
        return (
          <a onClick={() => gotoDetail()}>{text}</a>
        )
      }
    },
    {
      title: '服务商名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '合同数量',
      dataIndex: 'number',
      key: 'number'
    },
    {
      title: '服务商名称',
      dataIndex: 'name2',
      key: 'name2'
    },
    {
      title: '负责人',
      dataIndex: 'person',
      key: 'person'
    },
    {
      title: '负责人手机号',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '状态',
      dataIndex: 'statue',
      key: 'statue'
    },
  ]

  const newProvider = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addserviceprovidermaintenance'
    })
  }

  const handleReset = () => {
    resetFields()
  }

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize)
      }
    })
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize)
      }
    })

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: 150,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }


  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务商名称'>
                {
                  getFieldDecorator('name', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='负责人'>
                {
                  getFieldDecorator('person')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='负责人手机号'>
                {
                  getFieldDecorator('mobile')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商编号'>
                {
                  getFieldDecorator('no')
                    (<Input />)
                }

              </Form.Item>
            </Col>

            <Col span={16} style={{ textAlign: 'right' }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
              >
                查询
              </Button>

              <Button onClick={handleReset}>重置</Button>
            </Col>

          </Form>


        </Row>
        <Button type='primary'>导出数据</Button>

        <Table
          columns={columns}
          dataSource={maintenanceData}
          pagination={pagination}
        />

      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData
  }))(ServiceProvidersearch)
)
