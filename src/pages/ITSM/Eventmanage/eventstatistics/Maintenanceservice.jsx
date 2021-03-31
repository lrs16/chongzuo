import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let endTime;
const sign = 'maintenanceservice';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;


function Maintenanceservice(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator },
    maintenanceService,
    dispatch,
    loading
  } = props;
  const tableHeadweek = tabActiveKey === 'week' ? '上周' : '上月';
  const tableHeadmonth = tabActiveKey === 'week' ? '本周' : '本月';

  const columns = [
    {
      title: '服务指标',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: tableHeadweek,
      dataIndex: 'last',
      key: 'last',
    },
    {
      title: tableHeadmonth,
      dataIndex: 'now',
      key: 'now',
    },
    {
      title: '环比',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  const onChange = (date,dateString) => {
    if (tabActiveKey === 'week') {
      startTime = dateString;
      endTime =  moment(dateString).add(+6,'day').format('YYYY-MM-DD');
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const handleListdata = () => {
    dispatch({
      type: 'eventstatistics/fetcheventServiceList',
      payload: { sign, tabActiveKey, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadEventservice',
      payload: {
        time1: startTime,
        time2: endTime,
        type: tabActiveKey,
      }
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }


  const defaultTime = () => {
    //  周统计
    if (tabActiveKey === 'week') {
      startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else { // 月统计
      startTime = moment().startOf('month').format('YYYY-MM-DD');
      endTime = moment().endOf('month').format('YYYY-MM-DD');
    }
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [tabActiveKey])

  const tabList = [
    {
      key: 'week',
      tab: '软件运维服务指标完成情况(周)',
    },
    {
      key: 'month',
      tab: '软件运维服务指标完成情况(月)',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <Card>
        <Row gutter={24}>
          <Form layout='inline'>
            {
              tabActiveKey === 'week' && (
                <>
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(startTime)
                      })(<DatePicker
                        format="YYYY-MM-DD"
                        allowClear={false}
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: moment(endTime)
                        })
                          (<DatePicker disabled />)
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={() => handleListdata('search')}
                    >
                      查询
                    </Button>
                  </Col>

                </>
              )
            }

            {
              tabActiveKey === 'month' && (
                <>
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('startTime', {
                        initialValue: moment(startTime)
                      })( <MonthPicker 
                        // format="YYYY-MM-DD"
                        allowClear='false'
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    {/* <p>{startTime}</p> */}




                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={() => handleListdata('search')}
                    >
                      查询
                    </Button>
                  </Col>
                </>
              )
            }
          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24, marginTop: 5 }}
            onClick={download}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={maintenanceService}
          rowKey={record => record.remark}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics,loading }) => ({
    maintenanceService: eventstatistics.maintenanceService,
    loading:loading.models.eventstatistics
  }))(Maintenanceservice),
);