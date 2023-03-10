import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table,
  message
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let endTime;
const sign = 'solution';
const columns = [
  {
    title: '受理人/处理人',
    dataIndex: 'user',
    key: 'user',
    render: (text, record) => {
      if (record.user !== '合计') {
        return <span>{text}</span>
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
  },
  {
    title: '工单受理数量',
    dataIndex: 'not_selfhandle',
    key: 'not_selfhandle',
    render: (text, record) => {
      if (record.user !== '合计') {
        return <Link
          to={{
            pathname: '/ITSM/eventmanage/query',
            query: {
              sign: 'solution',
              time1: record.start_time,
              time2: record.end_time,
              registerUser: record.user,
              pathpush: true
            },
            state: { cache: false },
          }
          }
        >
          {text}
        </Link >
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
  },
  {
    title: '一线处理量',
    dataIndex: 'is_selfhandle',
    key: 'is_selfhandle',
    render: (text, record) => {
      if (record.user !== '合计') {
        return <Link
          to={{
            pathname: '/ITSM/eventmanage/query',
            query: {
              sign: 'solution',
              time1: record.start_time,
              time2: record.end_time,
              selfhandle: '是',
              registerUser: record.user,
              pathpush: true
            },
            state: { cache: false },
          }
          }
        >
          {text}
        </Link >
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
  },
  {
    title: '一线解决率',
    dataIndex: 'points',
    key: 'points',
    render: (text, record) => {
      if (record.user !== '合计') {
        return <span>{text}</span>
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
  },
];

function Solution(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    soluteArr,
    dispatch,
    loading
  } = props;

  const handleListdata = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'eventstatistics/fetchSelfHandleList',
          payload: { sign, startTime, endTime }
        })
      }
    })
  }

  const download = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'eventstatistics/downloadEventselfhandle',
          payload: {
            time1: startTime,
            time2: endTime,
          }
        }).then(res => {
          const filename = `一线解决率${moment().format('MM-DD')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  const defaultTime = () => {
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
    setFieldsValue({
      time1: moment(startTime),
      time2: moment(endTime)
    });
  }

  useEffect(() => {
    defaultTime();
    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: { sign, startTime, endTime }
    })
  }, [])

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <Card>
        <Row gutter={24}>
          <Form layout='inline'>
            <>
              <Col span={24}>
                <Form.Item label='起始时间'>
                  {getFieldDecorator('time1', {
                    initialValue: moment(startTime)
                  })(<DatePicker
                    allowClear={false}
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
          dataSource={soluteArr}
          rowKey={(record, index) => { return index }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    soluteArr: eventstatistics.soluteArr,
    loading: loading.models.eventstatistics
  }))(Solution),
);
