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
  },
  {
    title: '工单受理数量',
    dataIndex: 'not_selfhandle',
    key: 'not_selfhandle',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/eventmanage/query',
          query: { 
            time1: record.start_time,
            time2: record.end_time,
           }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '一线处理量',
    dataIndex: 'is_selfhandle',
    key: 'is_selfhandle',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/eventmanage/query',
          query: { 
            time1: record.start_time,
            time2: record.end_time,
            selfhandle:'是',
            registerUser:record.user
           }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '一线解决率',
    dataIndex: 'points',
    key: 'points',
  },
];

function Solution(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator },
    soluteArr,
    dispatch
  } = props;

  const onChange = (date) => {
    const date1 = new Date(date._d);
    const date2 = new Date(date._d);
    startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
    date2.setDate(date1.getDate() + 7);
    endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
  }


  const handleListdata = (params) => {
    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: { sign, startTime, endTime }
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
    const day2 = new Date();
    day2.setTime(day2.getTime());
    endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
    const date2 = new Date(day2);
    date2.setDate(day2.getDate() - 7);
    startTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
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
              <Col span={15}>
                <Form.Item label='开始时间'>
                  {getFieldDecorator('startTime', {
                    initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
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