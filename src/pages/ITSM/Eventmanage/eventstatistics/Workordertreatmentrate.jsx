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
    form: { getFieldDecorator },
    orderrateArr,
    dispatch
  } = props;

  const onChange = (date) => {
    const date1 = new Date(date._d);
    const date2 = new Date(date._d);
    startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
    date2.setDate(date1.getDate() + 6);
    endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
  }


  const handleListdata = (params) => {
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
    date2.setDate(day2.getDate() - 6);
    startTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [tabActiveKey])

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
                    onChange={onChange}
                  />)}
                </Form.Item>

                <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                <Form.Item label=''>
                  {
                    getFieldDecorator('time2', {
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