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
const columns = [
  {
    title: '服务指标',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '上周',
    dataIndex: 'last',
    key: 'last',
  },
  {
    title: '本周',
    dataIndex: 'now',
    key: 'now',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { handleStatu: '0' }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '环比',
    dataIndex: 'points',
    key: 'points',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { handleStatu: '0' }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '备注',
    dataIndex: 'points_count',
    key: 'points_count',
  },
];

function Maintenanceservice(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator },
    maintenanceService,
    dispatch
  } = props;

  const onChange = (date) => {
    if (tabActiveKey === 'week') {
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      date2.setDate(date1.getDate() + 7);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else {
      startTime = '';
      endTime = '';
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      date2.setDate(date1.getDate() + 30);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    }
  }


  const handleListdata = (params) => {
    dispatch({
      type: 'eventstatistics/fetcheventServiceList',
      payload: { sign,tabActiveKey, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/downloadHandlegrate'
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
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 7);
      startTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else { // 月统计
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      console.log('startTime: ', startTime);
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 30);
      startTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    }
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [tabActiveKey])

  const tabList = [
    {
      key: 'week',
      tab: '运维分类统计情况(周)',
    },
    {
      key: 'month',
      tab: '运维分类统计情况(月)',
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
                  <Col span={15}>
                    <Form.Item label='开始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: startTime ? moment(startTime) : ''
                      })(<DatePicker
                        format="YYYY-MM-DD"
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: endTime ? moment(endTime) : ''
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
                    <Form.Item label='开始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(startTime)
                      })(<DatePicker
                        format="YYYY-MM-DD"
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    {/* <p>{startTime}</p> */}

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: endTime ? moment(endTime) : ''
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
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    maintenanceService: eventstatistics.maintenanceService
  }))(Maintenanceservice),
);