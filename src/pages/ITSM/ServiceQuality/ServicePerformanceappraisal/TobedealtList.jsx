import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  DatePicker
} from 'antd';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
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
};

const { MonthPicker, RangePicker } = DatePicker;

const columns = [
  {
    title: '服务商',
    dataIndex: 'serviceprovider',
    key: 'serviceprovider',
    render: (text, record) => {
      const todetail = () => {
        router.push({
          pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
          // query: {

          // }
        })
      };
      return <a onClick={todetail}>{text}</a>
    }
  },
  {
    title: '责任人',
    dataIndex: 'personliable',
    key: 'personliable'
  },
  {
    title: '考核内容说明',
    dataIndex: 'contentdescription',
    key: 'contentdescription'
  },
  {
    title: '考核类型',
    dataIndex: 'assessmentType',
    key: 'assessmentType'
  },
  {
    title: '一级指标',
    dataIndex: 'firstlevelindicators',
    key: 'firstlevelindicators'
  },
  {
    title: '二级指标',
    dataIndex: 'secondaryindicators',
    key: 'secondaryindicators'
  },
  {
    title: '详细条款',
    dataIndex: 'detailedterms',
    key: 'detailedterms'
  },
  {
    title: '考核得分',
    dataIndex: 'assessmentscore',
    key: 'assessmentscore'
  },
  {
    title: '发生时间',
    dataIndex: 'timeoccurrence',
    key: 'timeoccurrence'
  },
  {
    title: '考核得分',
    dataIndex: 'currentprocessingsection',
    key: 'currentprocessingsection'
  },
]
function TobedealtList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator },
    tobeDealtarr,
    dispatch
  } = props;

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'performanceappraisal/tobeDealtdata'
    })
  }, [])

  console.log(tobeDealtarr,'tobeDealtarr')
  const extra = (
    <>
      <Button type='primary' style={{ marginLeft: 8 }}>查询</Button>
      <Button style={{ marginLeft: 8 }}>重置</Button>
      <Button
        type='link'
        style={{ marginLeft: 8 }}
        onClick={() => {
          setExpand(!expand)
        }}
      >
        {expand ? (<>关闭 <UpOutlined /></>) : (<>展开 <DownOutlined /></>)}
      </Button>
    </>)

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='考核编号'>
                {
                  getFieldDecorator('name', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核状态'>
                {
                  getFieldDecorator('name', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <div style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label={`当前
                处理环节`}
                >
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='发生时间'>
                  {
                    getFieldDecorator('name', {})
                      (<RangePicker />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='关联合同名称'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='责任人'>
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

              <Col span={8}>
                <Form.Item label='考核内容说明'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='一级指标'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='二级指标'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='详细条款'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='得分'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='登记人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='登记时间'>
                  {
                    getFieldDecorator('name', {})
                      (
                        <RangePicker
                          showTime
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ width: '100%' }}
                        />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核结果'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核说明'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核状态'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责审核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人审核时间'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核结果'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核说明'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核状态'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='自动化科专责审核时间'>
                  {
                    getFieldDecorator('name', {})
                      (
                        <RangePicker
                          showTime
                          format='YYYY-MM-DD HH-mm-ss'
                          style={{ width: '100%' }}
                        />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='是否申诉'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='申诉内容'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商确认人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务商确认时间'>
                  {
                    getFieldDecorator('name', {})
                      (
                      <RangePicker
                        showTime
                        format='YYYY-MM-DD HH-mm:ss'
                        style={{ width: '100%'}}
                       />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核结果'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核说明'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核时间'>
                  {
                    getFieldDecorator('name', {})
                      (
                      <RangePicker
                        showTime
                        format='YYYY-MM-DD HH-mm:ss'
                        style={{ width: '100%'}}
                       />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认结果'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认说明'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='服务绩效考核确认时间'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='业务负责人复核人'>
                  {
                    getFieldDecorator('name', {})
                      (<Input />)
                  }
                </Form.Item>

              </Col>

            </div>

            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}

          </Form>
        </Row>

        <Table
          columns={columns}
          dataSource={tobeDealtarr}
          scroll={{ x: 1500 }}
        />
      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ qualityassessment, performanceappraisal, loading }) => ({
    maintenanceData: qualityassessment.maintenanceData,
    tobeDealtarr: performanceappraisal.tobeDealtarr
  }))(TobedealtList)
)

