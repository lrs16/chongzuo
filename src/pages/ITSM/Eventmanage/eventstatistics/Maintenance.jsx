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
import MergeTable from '@/components/MergeTable';
import iconfontUrl from '@/utils/iconfont';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let monthStarttime;
let endTime;
const sign = 'maintenanceservice';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const mergeCell = 'first_object';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});
function Maintenance(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator, setFieldsValue },
    maintenanceArr,
    dispatch,
    loading
  } = props;

  const tableHeadweek = tabActiveKey === 'week' ? '上周工单数' : '上月工单数';
  const tableHeadmonth = tabActiveKey === 'week' ? '本周工单数' : '本月工单数';

  const columns = [
    {
      title: '一级对象',
      dataIndex: mergeCell,
      key: mergeCell,
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = record.rowSpan;
        return obj;
      },
    },
    {
      title: '二级对象',
      dataIndex: 'second_object',
      key: 'second_object',
      align: 'center',
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
      align: 'center',
      render: (text, record) => {
        if (record.second_object !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/eventmanage/query',
              query: {
                sign: 'last',
                time1: moment(record.last_start_time).format('YYYY-MM-DD'),
                time2: moment(record.last_end_time).format('YYYY-MM-DD'),
                eventObject: [record.first_object, record.object_name],
                pathpush: true
              },
              state: { cache: false, }
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
      align: 'center',
      render: (text, record) => {
        if (record.second_object !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/eventmanage/query',
              query: {
                sign: 'last',
                time1: moment(record.now_start_time).format('YYYY-MM-DD'),
                time2: moment(record.now_end_time).format('YYYY-MM-DD'),
                eventObject: [record.first_object, record.object_name],
                pathpush: true
              },
              state: { cache: false, }
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
      align: 'center',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }
        return <span>{text}</span>
      }
    },
  ];

  const onChange = (date, dateString) => {

    if (tabActiveKey === 'week') {
      startTime = dateString;
      endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setFieldsValue({ time2: moment(endTime) });
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
  }

  const handleListdata = () => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { sign, tabActiveKey, startTime, monthStarttime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadMaintenance',
      payload: {
        time1: startTime,
        time2: endTime,
        type: tabActiveKey,

      }
    }).then(res => {
      const filename = `运维分类情况统计${moment().format('MM-DD')}.xls`;
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
      startTime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD');
      endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
      //  endTime = `${endTime} 00:00:00`;
    } else { // 月统计
      startTime = moment().startOf('month').format('YYYY-MM-DD');
      endTime = moment().endOf('month').format('YYYY-MM-DD');
    }
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [tabActiveKey])

  const startdisabledDate = (current) => {
    return current > moment().subtract('days', 6)
  }

  const enddisabledDate = (current) => {
    return current > moment().endOf('day')
  }

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
      <Card style={{ margin: '24px 0' }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <div className="gutter-box">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <IconFont
                  type="iconshangzhoudingdan"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
                  <span>{tabActiveKey === 'week' ? '上周' : '上月'}</span>
                  <span style={{ fontWeight: 500, fontSize: 22 }}>{maintenanceArr.last_count}</span>
                </div>
              </div>
            </div>
          </Col>

          <Col className="gutter-row" span={8}>

            <div className="gutter-box">

              <div style={{ display: 'flex', flexDirection: 'row', postion: 'relative' }}>
                <Divider type="vertical" style={{ height: '50px', postion: 'position', marginRight: '50px' }} />
                <IconFont
                  type="icondingdan"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px', textAlign: 'center' }}>
                  <span>{tabActiveKey === 'month' ? '本月' : '本周'}</span>
                  <span style={{ fontWeight: 500, fontSize: 22 }}>{maintenanceArr.now_count}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div className="gutter-box">
              <div style={{ display: 'flex', flexDirection: 'row', postion: 'relative', marginLeft: '16px', textAlign: 'center' }}>
                <Divider type="vertical" style={{ height: '50px', postion: 'position', marginRight: '50px' }} />
                <IconFont
                  type="iconicon-huanbifenxi"
                  style={{ fontSize: '4em' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px', textAlign: 'center' }}>
                  <span>环比</span>
                  <span style={{ fontWeight: 500, fontSize: 22 }}>{maintenanceArr.points_count}</span>
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
                        initialValue: moment(startTime)
                      })(<DatePicker
                        allowClear={false}
                        disabledDate={startdisabledDate}
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
                            disabledDate={enddisabledDate}
                            onChange={endonChange}
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
                        initialValue: moment(startTime)
                      })(
                        <MonthPicker
                          // format="YYYY-MM-DD"
                          allowClear='false'
                          onChange={onChange}
                        />)}
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

        {/* {
          loading === false && (
            <Table
              bordered
              columns={columns}
              dataSource={makeData(maintenanceArr.data)}
              pagination={false}
              rowKey={record => record.event_object}
            />
          )
        } */}


        {loading === false && (
          <MergeTable
            column={columns}
            tableSource={maintenanceArr.data}
            mergecell={mergeCell}
          />
        )}


      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    maintenanceArr: eventstatistics.maintenanceArr,
    loading: loading.models.eventstatistics,
  }))(Maintenance),
);