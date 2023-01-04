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
  message,
  Select,
} from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TreatmentrateDetail from './TreatmentrateDetail';

let startTime;
let endTime;
const sign = 'workordertreatmentrate';
const { MonthPicker } = DatePicker;
const { Option } = Select;

let selectvalue = 'unit';
function Workordertreatmentrate(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    orderrateArr,
    loading,
    dispatch
  } = props;


  const columns = [
    {
      title: `${selectvalue === 'unit' ? '供电单位' : '处理人'}`,
      dataIndex: selectvalue,
      key: selectvalue,
    },
    {
      title: '工单数',
      dataIndex: 'order_num',
      key: 'order_num',
      render: (text, record) => {
        const detailParams = {
          time1: record.start_time,
          time2: record.end_time,
          unitName: record.unit || '',
          handler: record.handler || '',
          status: '',
          eventStatus:''
        }
        return (
          <TreatmentrateDetail
            detailParams={detailParams}
            type={selectvalue}
          >
            <a type="link">{text}</a>
          </TreatmentrateDetail>
        )
      }
    },
    {
      title: '完成数',
      dataIndex: 'close_num',
      key: 'close_num',
      render: (text, record) => {
        const detailParams = {
          time1: record.start_time,
          time2: record.end_time,
          unitName: record.unit || '',
          handler: record.handler || '',
          eventStatus: record.handler ? '已关闭':'',
          status: record.unit ? '已关闭':''
        }
        return (
          <TreatmentrateDetail
            detailParams={detailParams}
            type={selectvalue}
          >
            <a type="link">{text}</a>
          </TreatmentrateDetail>
        )
      }
    },
    {
      title: '完成率',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '按时处理数',
      dataIndex: 'noTimeout_num',
      key: 'noTimeout_num',
      render: (text, record) => {
        const detailParams = {
          time1: record.start_time,
          time2: record.end_time,
          unitName: record.unit || '',
          handler: record.handler || '',
          status: '按时处理',
          type:'noTimeout',
          eventStatus:''
        }
        return (
          <TreatmentrateDetail
            detailParams={detailParams}
            type={selectvalue}
          >
            <a type="link">{text}</a>
          </TreatmentrateDetail>
        )
      }
    },
    {
      title: '及时率',
      dataIndex: 'noTimeoutPoints',
      key: 'noTimeoutPoints',
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
      case 'other':
        endTime = dateString;
        setFieldsValue({ time2: moment(endTime) })
        break;
      default:
        break;
    }
  }

  const handleListdata = (type) => {
    if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
      message.error('开始时间必须小于结束时间')
    } else {
      dispatch({
        type: 'eventstatistics/fetchorderrateList',
        payload: { sign, type: type || selectvalue, startTime, endTime }
      })
    }
  }

  const download = () => {
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'eventstatistics/downloadEventhandlerate',
          payload: {
            time1: startTime,
            time2: endTime,
            type:selectvalue
          }
        }).then(res => {
          const filename = `工单处理率${moment().format('MM-DD')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
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
    selectvalue = 'unit';
    setFieldsValue({
      type:selectvalue
    });
    defaultTime();
    dispatch({
      type: 'eventstatistics/fetchorderrateList',
      payload: { sign, type: selectvalue, startTime, endTime }
    })
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
      tab: '工单处理率(周)',
    },
    {
      key: 'month',
      tab: '工单处理率(月)',
    },
    {
      key: 'other',
      tab: '工单处理率(总)',
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
      <Card>
        <Row>
          <Form layout='inline'>
            {
              tabActiveKey === 'week' && (
                <>
                  <Col span={24}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: ''
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
                          initialValue: ''
                        })
                          (<DatePicker
                            allowClear={false}
                            disabledDate={enddisabledDate}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Form.Item label='统计维度'>
                      {
                        getFieldDecorator('type', {
                          initialValue: selectvalue
                        })(
                          <Select
                            style={{ width: 120 }}
                            onChange={(e) => { handleListdata(e); selectvalue = e; }}
                          >
                            <Option key='unit' value='unit'>供电单位</Option>
                            <Option key='handler' value='handler'>处理人</Option>
                          </Select>
                        )
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={() => handleListdata('')}
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
                        initialValue: ''
                      })(
                        <MonthPicker
                          allowClear='false'
                          onChange={onChange}
                        />)}
                    </Form.Item>

                    <Form.Item label='统计维度'>
                      {
                        getFieldDecorator('type', {
                          initialValue: selectvalue
                        })(
                          <Select
                            style={{ width: 120 }}
                            onChange={(e) => { handleListdata(e); selectvalue = e; }}
                          >
                            <Option key='unit' value='unit'>供电单位</Option>
                            <Option key='handler' value='handler'>处理人</Option>
                          </Select>
                        )
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={() => handleListdata('')}
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
                        initialValue: ''
                      })(<DatePicker
                        allowClear={false}
                        onChange={onChange}
                      />)}
                    </Form.Item>

                    <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                    <Form.Item label=''>
                      {
                        getFieldDecorator('time2', {
                          initialValue: ''
                        })
                          (<DatePicker
                            allowClear={false}
                            onChange={endonChange}
                          />)
                      }
                    </Form.Item>

                    <Form.Item label='统计维度'>
                      {
                        getFieldDecorator('type', {
                          initialValue: selectvalue
                        })(
                          <Select
                            style={{ width: 120 }}
                            onChange={(e) => { handleListdata(e); selectvalue = e; }}
                          >
                            <Option key='unit' value='unit'>供电单位</Option>
                            <Option key='handler' value='handler'>处理人</Option>
                          </Select>
                        )
                      }
                    </Form.Item>

                    <Button
                      type='primary'
                      style={{ marginTop: 6 }}
                      onClick={() => handleListdata('')}
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
          loading={loading}
          columns={columns}
          rowKey={(text, records, index) => { return index }}
          dataSource={orderrateArr}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    orderrateArr: eventstatistics.orderrateArr,
    loading: loading.models.eventstatistics
  }))(Workordertreatmentrate),
);