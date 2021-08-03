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
  Divider,
  Radio
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
    form: {
      getFieldDecorator,
      validateFields,
      resetFields
    },
    providerArr,
    dispatch,
    loading
  } = props;
  console.log(providerArr, 'providerArr')
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [data, setData] = useState([]);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'qualityassessment/providerList',
      payload: {
        ...values,
        pageNum: page,
        pageSize
      }
    })
  }

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15)
    })
  }

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, paginations.current, paginations.pageSize)
    })
  }, [])

  const handleDelete = (id) => {
    return dispatch({
      type: 'qualityassessment/providerDel',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        searchdata({}, 1, paginations.pageSize)
      } else {
        message.error(res.msg);
      }
    })
  }

  const columns = [
    {
      title: '服务商编号',
      dataIndex: 'providerNo',
      key: 'providerNo',
      render: (text, record) => {
        const togoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/addserviceprovidermaintenance',
            query: {
              id: record.id,
              providerStatus: record.isEdit,
              providerSearch:true
            }
          })
        }
        return <a onClick={togoDetail}>{text}</a>
      }
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName'
    },
    {
      title: '合同数量',
      dataIndex: 'contractNum',
      key: 'contractNum'
    },
    {
      title: '负责人',
      dataIndex: 'creator',
      key: 'creator'
    },
    {
      title: '负责人手机号',
      dataIndex: 'directorPhone',
      key: 'directorPhone'
    },
  ]

  const newProvider = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addserviceprovidermaintenance'
    })
  }

  const handleReset = () => {
    resetFields();
    searchdata({}, 1, 15)
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

  // const handleTabledata = () => {
  //   const newarr = maintenanceData.map((item, index) => {
  //     return Object.assign(item,{ isNew: false,key:index})
  //   })
  //   setData(newarr)
  // }

  // useEffect(() => {
  //   handleTabledata()
  // },maintenanceData)

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: providerArr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务商编号'>
                {
                  getFieldDecorator('providerNo')
                    (<Input />)
                }

              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商名称'>
                {
                  getFieldDecorator('providerName', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='负责人'>
                {
                  getFieldDecorator('creator')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='负责人手机号'>
                {
                  getFieldDecorator('directorPhone')
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={16} style={{ textAlign: 'right' }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={handlesearch}
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
          dataSource={providerArr.records}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    providerArr: qualityassessment.providerArr,
    loading: loading.models.qualityassessment
  }))(ServiceProvidersearch)
)
