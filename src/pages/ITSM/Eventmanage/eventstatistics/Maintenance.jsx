import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table,
  Icon,
  Divider
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import iconfontUrl from '@/utils/iconfont';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let starttime;
let monthStarttime;
let endTime;
const sign = 'maintenanceservice';


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});
function Maintenance(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator, resetFields },
    maintenanceArr,
    dispatch
  } = props;
  const tableHeadweek = tabActiveKey === 'week' ? '上周工单数' : '上月工单数';
  const tableHeadmonth = tabActiveKey === 'week' ? '本周工单数' : '本月工单数';



  const columns = [
    {
      title: '一级对象',
      dataIndex: 'first_object',
      key: 'first_object',
    },
    {
      title: '二级对象',
      dataIndex: 'second_object',
      key: 'second_object',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
        return <span>{text}</span>
      }
    },
    {
      title: tableHeadweek,
      dataIndex: 'last_num',
      key: 'last_num',
      render: (text, record) => {
        if (record.second_object !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/eventmanage/query',
              query: {
                sign: 'last',
                time1: record.last_start_time,
                time2: record.last_end_time,
                eventObject: record.object_name
              }
            }}
          >
            {text}
          </Link>
        }
        return <span style={{ fontWeight: 700 }}>{text}</span>
      }
    },
    {
      title: tableHeadmonth,
      dataIndex: 'now_num',
      key: 'now_num',
      render: (text, record) => {
        if (record.second_object !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/eventmanage/query',
              query: {
                sign: 'last',
                time1: record.now_start_time,
                time2: record.now_end_time,
                eventObject: record.object_name
              }
            }}
          >
            {text}
          </Link>
        }
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
      }
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
        return <span>{text}</span>
      }
    },
  ];

  const onChange = (date) => {
    if (tabActiveKey === 'week') {
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      starttime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      date2.setDate(date1.getDate() + 6);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else {
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      starttime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      date2.setDate(date1.getDate() + 29);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    }
  }

  const handleListdata = (params) => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { sign, tabActiveKey, starttime, monthStarttime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadMaintenance',
      payload: {
        time1: starttime,
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
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 6);
      starttime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else { // 月统计
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 29);
      starttime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
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
      <Card style={{ margin: 20 }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <div className="gutter-box">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <IconFont
                  type="icondingdan"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{tabActiveKey === 'week' ? '上周' : '上月'}</span>
                  <span style={{ fontWeight: 900, fontSize: 22 }}>{maintenanceArr.last_count}</span>
                </div>
              </div>
            </div>
          </Col>

          <Col className="gutter-row" span={8}>

            <div className="gutter-box">

              <div style={{ display: 'flex', flexDirection: 'row', postion: 'relative' }}>
                <Divider type="vertical" style={{ height: '50px', postion: 'position', marginRight: '50px' }} />
                <IconFont
                  type="iconshangzhoudingdan"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{tabActiveKey === 'month' ? '本月' : '本周'}</span>
                  <span style={{ fontWeight: 900, fontSize: 22 }}>{maintenanceArr.now_count}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div className="gutter-box">
              <div style={{ display: 'flex', flexDirection: 'row', postion: 'relative' }}>
                <Divider type="vertical" style={{ height: '50px', postion: 'position', marginRight: '50px' }} />
                <IconFont
                  type="iconicon-huanbifenxi"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>百分比</span>
                  <span style={{ fontWeight: 900, fontSize: 22 }}>{maintenanceArr.points_count}</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={24}>
          <Form layout='inline'>
            {
              tabActiveKey === 'week' && (
                <>
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(starttime)
                      })(<DatePicker
                        allowClear={false}
                        // placeholder='请选择'
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: moment(endTime)
                        })
                          (<DatePicker
                            allowClear={false}
                            disabled
                          />)
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
                      {getFieldDecorator('monthStarttime', {
                        initialValue: moment(starttime)
                      })(<DatePicker
                        // format="YYYY-MM-DD"
                        // allowClear='false'
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('endTime', {
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
          dataSource={maintenanceArr.data}
          rowKey={record => record.event_object}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    maintenanceArr: eventstatistics.maintenanceArr
  }))(Maintenance),
);