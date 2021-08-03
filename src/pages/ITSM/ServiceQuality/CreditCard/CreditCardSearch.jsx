import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Form,
  Card,
  Input,
  Button
} from 'antd';
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

const columns = [
  {
    title: '服务商',
    dataIndex: 'serviceprovider',
    key: 'serviceprovider',
    render: (text, record) => {
      const todetail = () => {
        router.push({
          pathname: '/ITSM/servicequalityassessment/creditcard/creditcardregister',
        })
      };
      return <a onClick={todetail}>{text}</a>
    }
  },
  {
    title: '合同名称',
    dataIndex: 'personliable',
    key: 'personliable'
  },
  {
    title: '考核类型',
    dataIndex: 'contentdescription',
    key: 'contentdescription'
  },
  {
    title: '评价计分卡名称',
    dataIndex: 'assessmentType',
    key: 'assessmentType'
  },
  {
    title: '评分细则名称',
    dataIndex: 'firstlevelindicators',
    key: 'firstlevelindicators'
  },
  {
    title: '版本号',
    dataIndex: 'secondaryindicators',
    key: 'secondaryindicators'
  },
  {
    title: '专业部门',
    dataIndex: 'detailedterms',
    key: 'detailedterms'
  },
  {
    title: '评价区间',
    dataIndex: 'assessmentscore',
    key: 'assessmentscore'
  },
]

function CreditCardSearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    tobeDealtarr,
    dispatch
  } = props;
  const [expand, setExpand] = useState(false);

  const handleReset = () => {
    resetFields()
  }

  useEffect(() => {
    dispatch({
      type: 'performanceappraisal/tobeDealtdata'
    })
  }, [])

  const extra = (<>
    <Button type="primary">查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>)

  console.log(expand, 'expand')

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='计分卡编号'>
                {
                  getFieldDecorator('dd', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商'>
                {
                  getFieldDecorator('dd11', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label='考核类型'>
                  {
                    getFieldDecorator('dd22', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='评价计分卡名称'>
                  {
                    getFieldDecorator('dd33', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='评分细则名称'>
                  {
                    getFieldDecorator('dd4', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='版本号'>
                  {
                    getFieldDecorator('dd55', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='专业部门'>
                  {
                    getFieldDecorator('dd6', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='评价区间'>
                  {
                    getFieldDecorator('dd7', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='合同名称'>
                  {
                    getFieldDecorator('dd8', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>
            </span>

            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}

            <Col span={24}>
              <Button type='primary'>导出数据</Button>
            </Col>

            <Table
              columns={columns}
              dataSource={tobeDealtarr}
            />

          </Form>
        </Row>
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, performanceappraisal, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
    tobeDealtarr: performanceappraisal.tobeDealtarr
  }))(CreditCardSearch)
)