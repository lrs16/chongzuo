import React, { useEffect, useState } from 'react';
import {
  Table,
  DatePicker,
  Card,
  Row,
  Col,
  Form,
  Button,
  message
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


let startTime;
let endTime;
const { MonthPicker } = DatePicker;
function Statisticalquery(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    statsSearcharr,
    dispatch
  } = props;
  const [tabActiveKey, setTabActiveKey] = useState('week');

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '考核周期',
      dataIndex: 'assessPhase',
      key: 'assessPhase'
    },
    {
      title: '签订日期',
      dataIndex: 'signTime',
      key: 'signTime'
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName'
    },
    {
      title: '本周扣分',
      width: 120,
      dataIndex: 'weekMinus',
      key: 'weekMinus'
    },
    {
      title: '本周加分',
      width: 120,
      dataIndex: 'weekPlus',
      key: 'weekPlus'
    },
    {
      title: '累计扣分',
      dataIndex: 'minus',
      key: 'minus'
    },
    {
      title: '累计加分',
      dataIndex: 'plus',
      key: 'plus'
    },
    {
      title: '考核得分',
      dataIndex: 'total',
      key: 'total'
    },
  ];
  const columns2 = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo'
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName'
    },
    {
      title: '考核周期',
      dataIndex: 'assessPhase',
      key: 'assessPhase'
    },
    {
      title: '签订日期',
      dataIndex: 'signTime',
      key: 'signTime'
    },
    {
      title: '服务商名称',
      dataIndex: 'providerName',
      key: 'providerName'
    },
    {
      title: '累计扣分',
      dataIndex: 'minus',
      key: 'minus'
    },
    {
      title: '累计加分',
      dataIndex: 'plus',
      key: 'plus'
    },
    {
      title: '考核得分',
      dataIndex: 'total',
      key: 'total'
    },
  ];

  const onChange = (date, dateString) => {
    switch (tabActiveKey) {
      case 'week':
        startTime = dateString;
        endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
        setFieldsValue({ time2: moment(endTime) });
        break;
      case 'month':
        startTime = date.startOf('month').format('YYYY-MM-DD');
        setFieldsValue({ monthStarttime: moment(startTime) });
        break;
      default:
        break;
    }
  }

  const endonChange = (date, dateString) => {
    switch (tabActiveKey) {
      case 'week':
        endTime = dateString;
        startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
        setFieldsValue({ time1: moment(startTime) })
        break;
      case 'month':
        endTime = date.endOf('month').format('YYYY-MM-DD');
        setFieldsValue({
          monthEndtime: moment(endTime),
        })
        break;
      default:
        break;
    }
  }

  const defaultTime = () => {
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    switch (tabActiveKey) {
      case 'week':
        setFieldsValue({
          time1: moment(startTime),
          time2: moment(endTime)
        });
        break;
      case 'month':
        startTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        endTime = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        setFieldsValue({
          monthStarttime: moment(startTime),
          monthEndtime: moment(endTime)
        });
        break;
      default:
        break;
    }
  }

  const getList = () => {
    if (new Date(startTime).valueOf() > new Date(endTime).valueOf()) {
      message.info('开始时间必须小于结束时间')
    } else {
      dispatch({
        type: 'performanceappraisal/fetchstatsSearch',
        payload: {
          beginTime: moment(startTime).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
          type: tabActiveKey === 'week' ? 'W' : 'M'
        }
      })
    }
  }

  useEffect(() => {
    defaultTime();
    getList()
  }, [tabActiveKey])

  const tabList = [
    {
      key: 'week',
      tab: '服务绩效统计（按周）',
    },
    {
      key: 'month',
      tab: '服务绩效统计（按月）',
    },
  ]

  const handleTabChange = (key) => {
    setTabActiveKey(key);
  }

  const download = () => {
    dispatch({
      type: 'performanceappraisal/fetchstatsExport',
      payload: {
        beginTime: moment(startTime).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(endTime).format('YYYY-MM-DD 23:59:59'),
        type: tabActiveKey === 'week' ? 'W' : 'M'
      }
    }).then(res => {
      const filename = `统计查询.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <>
        <Card>
          <Row gutter={16}>

            <Form layout='inline'>
              {
                tabActiveKey === 'week' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {
                        getFieldDecorator('time1', {
                          initialValue: ''
                        })(
                          <DatePicker
                            allowClear={false}
                            // disabledDate={startdisabledDate}
                            onChange={onChange}
                          />
                        )
                      }

                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: moment(endTime)
                        })
                          (<DatePicker
                            allowClear={false}
                            // disabledDate={enddisabledDate}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={getList}
                    >
                      查询
                    </Button>

                  </Col>
                )
              }

              {
                tabActiveKey === 'month' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('monthStarttime', {
                        initialValue: moment(startTime)
                      })(
                        <MonthPicker
                          allowClear='false'
                          onChange={onChange}
                        />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('monthEndtime', {
                          initialValue: moment(endTime)
                        })
                          (<MonthPicker
                            allowClear={false}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={getList}
                    >
                      查询
                    </Button>
                  </Col>
                )
              }
            </Form>
          </Row>

          <Button
            type='primary'
            style={{ marginBottom: 24, marginTop: 5 }}
            onClick={download}
          >
            导出数据
          </Button>

          <Table
            columns={tabActiveKey === 'week' ? columns :columns2}
            dataSource={statsSearcharr}
          />
        </Card>

      </>

    </PageHeaderWrapper>
  )
}
export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    statsSearcharr: performanceappraisal.statsSearcharr,
    loading: loading.models.performanceappraisal,
  }))(Statisticalquery),
);