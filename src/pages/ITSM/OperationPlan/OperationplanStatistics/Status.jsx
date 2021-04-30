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
    title: '作业状态',
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
    title: '作业计划数',
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
];

function Status(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator,setFieldsValue },
    soluteArr,
    dispatch
  } = props;

  const onChange = (date,dateString) => {
    startTime = dateString;
    endTime =  moment(dateString).add(+6,'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
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
    // startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    // endTime = moment().format('YYYY-MM-DD');

    startTime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    endTime = `${endTime} 00:00:00`;
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [])

  const startdisabledDate = (current) => {
    return current > moment().subtract('days', 6)
  }

  const enddisabledDate = (current) => {
    return current > moment().endOf('day')
  }

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
                    initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
                    allowClear='false'
                    disabledDate={startdisabledDate}
                    onChange={onChange}
                  />)}
                </Form.Item>

                <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                <Form.Item label=''>
                  {
                    getFieldDecorator('time2', {
                      initialValue: endTime ? moment(endTime) : ''
                    })
                      (<DatePicker 
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
  }))(Status),
);