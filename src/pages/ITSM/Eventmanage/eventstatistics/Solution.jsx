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
      return <span style={{fontWeight:700}}>{text}</span>
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
              sign:'solution',
              time1: record.start_time,
              time2: record.end_time,
              registerUser: record.user
            }
          }
          }
        >
          {text}
        </Link >
      }
      return <span style={{fontWeight:700}}>{text}</span>
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
              sign:'solution',
              time1: record.start_time,
              time2: record.end_time,
              selfhandle: '是',
              registerUser: record.user
            }
          }
          }
        >
          {text}
        </Link >
      }
      return <span style={{fontWeight:700}}>{text}</span>
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
      return <span style={{fontWeight:700}}>{text}</span>
    }
  },
];

function Solution(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator },
    soluteArr,
    dispatch
  } = props;

  const onChange = (date,dateString) => {
    startTime = dateString;
    endTime =  moment(dateString).add(+6,'day').format('YYYY-MM-DD');
  }


  const handleListdata = () => {
    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: { sign, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadEventselfhandle',
      payload:{
        time1:startTime,
        time2:endTime,
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
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
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
                  {getFieldDecorator('startTime', {
                    initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
                    allowClear='false'
                    onChange={onChange}
                  />)}
                </Form.Item>

                <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                <Form.Item label=''>
                  {
                    getFieldDecorator('endTime', {
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
          dataSource={soluteArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    soluteArr: eventstatistics.soluteArr
  }))(Solution),
);