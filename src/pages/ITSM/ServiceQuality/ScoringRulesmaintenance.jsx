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
  Select,
  
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

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

const { Option } = Select;

const columns = [
  {
    title:'评分细则编号',
    dataIndex:'no',
    key:'no'
  },
  {
    title:'评分细则名称',
    dataIndex:'name',
    key:'name'
  },
  {
    title:'考核类型',
    dataIndex:'type',
    key:'type'
  },
  {
    title:'评分细则编号',
    dataIndex:'no',
    key:'no'
  },
]

function ScoringRulesmaintenance(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator,validateFields,resetFields },
    maintenanceData,
    dispatch
  } = props;

  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 })
  const [selectdata, setSelectData] = useState('');

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(
        item => item.title === title)[0].children;
    }
    return []
  }

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

  const handleReset = () => {
    resetFields()
  }

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err,values) => {
      if(!err) {
        searchdata(values,page, pageSize)
      }
    })
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    validateFields((err,values) => {
      if(!err) {
        searchdata(values,page, paginations.pageSize)
      }
    })

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const newScoringrules = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/addscoringrulesmaintenance'
    })
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page,pagesize) => onShowSizeChange(page,pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: 150,
    showTotal: total => `总共 ${total}条记录`,
    onChange: (page) => changePage(page)
  }

  const assessmentType = getTypebyTitle('考核类型');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row>
          <Form {...formItemLayout}>
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
                  getFieldDecorator('type', {})
                    (
                      <Select placeholder='请选择' allowClear>
                        {assessmentType.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ])}
                      </Select>
                    )
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评分细则编号'>
                {
                  getFieldDecorator('no', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

          </Form>


          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              type='primary'
              style={{ marginRight: 8 }}
            >
              查询
            </Button>

            <Button onClick={handleReset}>
              重置
            </Button>
          </Col>

          <Col span={8}>
            <Button type='primary'>导出数据</Button>
          </Col>

        </Row>

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={newScoringrules}
          icon='plus'
        >
          新增评分细则
        </Button>
      
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
  }))(ScoringRulesmaintenance)
)


