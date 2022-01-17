import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Select,
  message
} from 'antd';
import Link from 'umi/link';

import MergeTable from '@/components/MergeTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let endTime;
let value = 20;
const mergeCell = 'first_object';
const { Option } = Select;
const { RangePicker } = DatePicker;
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
  },
  {
    title: '同比',
    dataIndex: 'yearPoints',
    key: 'yearPoints',
    align: 'center',
  },
  {
    title: '环比',
    dataIndex: 'ringPoints',
    key: 'ringPoints',
    align: 'center',
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
              time1: moment(record.start_time).format('YYYY-MM-DD'),
              time2: moment(record.end_time).format('YYYY-MM-DD'),
              eventObject: [record.first_object, record.object_name],
              pathpush: true
            },
            state: { cache: false },
          }}
        >
          {text}
        </Link>
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
  },
];

function Workordertopn(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    ordertopnArr,
    dispatch,
    loading
  } = props;

  const handleListdata = () => {
    validateFields((err, values) => {
      startTime = moment(values.time1).format('YYYY-MM-DD');
      endTime = moment(values.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'eventstatistics/fetchordertopnList',
          payload: { value, startTime, endTime }
        })
      }
    })
  }

  const download = () => {
    validateFields((err, values) => {
      startTime = moment(values.time1).format('YYYY-MM-DD');
      endTime = moment(values.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'eventstatistics/downloadEventtopn',
          payload: {
            time1: startTime,
            time2: endTime,
            num: value,
          }
        }).then(res => {
          const filename = `工单TOPN${moment().format('MM-DD')}.xls`;
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

  const selectOnchange = (selectvalue) => {
    value = selectvalue;
    handleListdata(value);
  }


  useEffect(() => {
    defaultTime();
    dispatch({
      type: 'eventstatistics/fetchordertopnList',
      payload: { value, startTime, endTime }
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

                <Form.Item label='N'>
                  <Select
                    placeholder="请选择"
                    style={{ width: 150 }}
                    defaultValue={value}
                    onChange={selectOnchange}
                  >
                    <Option value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                  </Select>
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

        <MergeTable
          loading={loading}
          column={columns}
          tableSource={ordertopnArr}
          mergecell={mergeCell}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    ordertopnArr: eventstatistics.ordertopnArr,
    loading: loading.models.eventstatistics
  }))(Workordertopn),
);