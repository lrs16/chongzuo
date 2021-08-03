import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Row,
  Col,
  Card,
  Divider
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
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


function ScoringRulesssearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    maintenanceData,
    dispatch
  } = props;
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [expand, setExpand] = useState(false);

  const columns = [
    {
      title: '评分细则编号',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: '评分细则名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '考核类型',
      dataIndex: 'type',
      key: 'type'
    },
  ]

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

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      searchdata(values, page, pageSize);
    })
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    validateFields((err, values) => {
      searchdata(values, page, paginations.pageSize)
    })

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const handleReset = () => {
    resetFields()
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: 150,
    showTotal: total => `总共${total}条记录`,
    onChange: (page) => changePage(page)
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form  {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='评分细则编号'>
                {
                  getFieldDecorator('no', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评分细则名称'>
                {
                  getFieldDecorator('name', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核类型'>
                {
                  getFieldDecorator('name', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={24} style={{textAlign:'right'}}>
              <Button type='primary' style={{marginRight:8}}>查询</Button>
              <Button>重置</Button>
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
  }))(ScoringRulesssearch)
)
