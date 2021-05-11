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
const sign = 'workordertreatmentrate';
const columns = [
  {
    title: '供电单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '工单数',
    dataIndex: 'order_num',
    key: 'order_num',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/eventmanage/query',
          query: {
            sign: 'last',
            time1: record.start_time,
            time2: record.end_time,
            applicationUnit: record.unit,
          }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '完成数',
    dataIndex: 'close_num',
    key: 'close_num',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/eventmanage/query',
          query: {
            sign: 'now',
            time1: record.start_time,
            time2: record.end_time,
            applicationUnit: record.unit,
            eventStatus: '已关闭'
          }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '完成率',
    dataIndex: 'points',
    key: 'points',
  },
];

function Workordertreatmentrate(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator, setFieldsValue },
    orderrateArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    startTime = dateString;
    endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }


  const handleListdata = () => {
    dispatch({
      type: 'eventstatistics/fetchorderrateList',
      payload: { sign, tabActiveKey, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadEventhandlerate',
      payload: {
        time1: startTime,
        time2: endTime,
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

  const defaultTime = () => {
    //  周统计
    // startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    // endTime = moment().format('YYYY-MM-DD');

    startTime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    //  endTime = `${endTime} 00:00:00`;
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

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
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
                    allowClear={false}
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
          dataSource={orderrateArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    orderrateArr: eventstatistics.orderrateArr
  }))(Workordertreatmentrate),
);