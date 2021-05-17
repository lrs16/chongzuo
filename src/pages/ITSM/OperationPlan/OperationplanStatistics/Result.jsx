import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
const statusMap = ['green', 'gold', 'red'];
const status = [0,1,2];
const statusContent = ['未超时', '即将超时', '已超时'];

const columns = [
  {
    title: '作业结果',
    dataIndex: 'result',
    key: 'result',
    render: (text, record) => {
      return <span style={{fontWeight:700}}>{text}</span>
    }
  },
  {
    title: '作业计划数',
    dataIndex: 'num',
    key: 'num',
    render: (text, record) => {
      const gotoDetail = (record) => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: record.time1,
            time2: record.time2,
            result:record.result=== '合计' ? '': record.result
          }
        })
      };
        return <a onClick={() => gotoDetail(record)}>{text}</a>
    }
  },
];

function Result(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator,setFieldsValue },
    resultArr,
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
      type: 'taskstatistics/executeResult',
      payload: {  startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'taskstatistics/downloadExecuteResult',
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

    // startTime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    // endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    // endTime = `${endTime} 00:00:00`;
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
          dataSource={resultArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ taskstatistics }) => ({
    resultArr: taskstatistics.resultArr
  }))(Result),
);