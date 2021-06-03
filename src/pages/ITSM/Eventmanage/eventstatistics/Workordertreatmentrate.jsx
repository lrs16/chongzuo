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
const { RangePicker } = DatePicker;
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
            pathpush: true,
          },
          state: { cache: false },
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
            time1: record.start_time,
            time2: record.end_time,
            applicationUnit: record.unit,
            eventStatus: '已关闭',
            pathpush: true
          },
          state: { cache: false },
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
    form: { getFieldDecorator, setFieldsValue, validateFields },
    orderrateArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    startTime = dateString;
    endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }


  const handleListdata = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1[0]).format('YYYY-MM-DD');
      endTime = moment(value.time1[1]).format('YYYY-MM-DD');
      dispatch({
        type: 'eventstatistics/fetchorderrateList',
        payload: { sign, tabActiveKey, startTime, endTime }
      })
    })

  }

  const download = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1[0]).format('YYYY-MM-DD');
      endTime = moment(value.time1[1]).format('YYYY-MM-DD');
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
    })

  }

  const defaultTime = () => {
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
    // startTime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD');
    // endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
  }

  useEffect(() => {
    defaultTime();
    dispatch({
      type: 'eventstatistics/fetchorderrateList',
      payload: { sign, tabActiveKey, startTime, endTime }
    })
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
                    initialValue: [moment(startTime), moment(endTime)]
                  })(
                    <RangePicker
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