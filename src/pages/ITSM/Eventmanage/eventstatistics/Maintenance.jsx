import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Icon,
  Divider,
  message
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
const { MonthPicker } = DatePicker;
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
      title: '问题对象',
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
      title: '问题分类',
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
        return []
      }
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
      align: 'center',
      render: (text, record) => {
        if (record.second_object === '合计') {
          return (
            <>
            <span style={{ fontWeight: 700 }}>{text}</span>
            { text && text.substring(0,1) === '-' ? <Icon type="caret-down" style={{ color: '#f5222d' }}/> : <Icon type="caret-up" style={{ color: '#52c41a' }}/>}
          </>
          )
 
        }
        return (
          <>
           <span>{text}</span>
           { text && text.substring(0,1) === '-' ? <Icon type="caret-down" style={{ color: '#f5222d' }}/> : <Icon type="caret-up" style={{ color: '#52c41a' }}/>}
          </>
        )
      }
    },
  ];

  const otherColumns = [
    {
      title: '问题对象',
      dataIndex: mergeCell,
      key: mergeCell,
      align: 'center',
      render: (text, record) => {
        if (record.first_object !== '合计') {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = record.rowSpan;
          return obj;
        }

        return <span style={{ fontWeight: 700 }}>{text}</span>
      },
    },
    {
      title: '问题分类',
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
      title: '工单数',
      dataIndex: 'num',
      key: 'num',
      align: 'center',
      render: (text, record) => {
        if (record.first_object !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/eventmanage/query',
              query: {
                sign: 'last',
                time1: moment(startTime).format('YYYY-MM-DD'),
                time2: moment(endTime).format('YYYY-MM-DD'),
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
        endTime = date.endOf('month').format('YYYY-MM-DD');
        break;
      case 'other':
        startTime = dateString;
        setFieldsValue({ time1: moment(startTime) });
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
      default:
        break;
    }
  }

  const handleListdata = () => {
    if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
      message.error('开始时间必须小于结束时间')
    } else {
      dispatch({
        type: 'eventstatistics/fetchMaintenancelist',
        payload: { sign, tabActiveKey, startTime, monthStarttime, endTime }
      })
    }

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
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
    switch (tabActiveKey) {
      case 'week':
        setFieldsValue({
          time1: moment(startTime),
          time2: moment(endTime)
        });
        break;
      case 'month':

        startTime = moment().startOf('month').format('YYYY-MM-DD');
        endTime = moment().endOf('month').format('YYYY-MM-DD');
        setFieldsValue({
          monthStarttime: moment(startTime)
        });
        break;
      case 'other':
        startTime = moment().startOf('month').format('YYYY-MM-DD');
        endTime = moment().endOf('month').format('YYYY-MM-DD');
        setFieldsValue({
          time1: moment(startTime),
          time2: moment(endTime)
        });
        break;
      default:
        break;
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
    {
      key: 'other',
      tab: '运维分类统计情况',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
    defaultTime()
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        tabActiveKey !== 'other' && (
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
        )
      }

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

            {
              tabActiveKey === 'other' && (
                <>
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(startTime)
                      })(<DatePicker
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
                          (<DatePicker
                            allowClear={false}
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

        {loading === false && (
          <MergeTable
            column={tabActiveKey === 'other' ? otherColumns : columns}
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