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
  Select
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let endTime;
let value = 20;
const { Option } = Select;
const columns = [
  {
    title: '一级对象',
    dataIndex: 'first_object',
    key: 'first_object',
    render: (text, record) => {
      if (record.first_object !== '合计') {
        return <span>{text}</span>
      }
      return <span style={{fontWeight:700}}>{text}</span>
    }
  },
  {
    title: '二级对象',
    dataIndex: 'second_object',
    key: 'second_object',
  },
  {
    title: '工单数',
    dataIndex: 'num',
    key: 'num',
    render: (text, record) => {
      if (record.first_object !== '合计') {
        return <Link
          to={{
            pathname: '/ITSM/eventmanage/query',
            query: {
              sign: 'top',
              time1: record.start_time,
              time2: record.end_time,
              eventObject: record.object_name
            }
          }}
        >
          {text}
        </Link>
      }
      return <span style={{fontWeight:700}}>{text}</span>
    }
  },
];

function Workordertopn(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator },
    ordertopnArr,
    dispatch
  } = props;

  if (ordertopnArr && ordertopnArr.length) {
    for (let i = 0; i < ordertopnArr.length - 1; i++) {
      for (let j = i + 1; j < ordertopnArr.length; j++) {
        if (ordertopnArr[i].first_object === ordertopnArr[j].first_object) {
          ordertopnArr[j].first_object = '';
        }
      }
    }
  }

  const onChange = (date,dateString) => {
    startTime = dateString;
    endTime =  moment(dateString).add(+6,'day').format('YYYY-MM-DD');
  }

  const handleListdata = () => {
    dispatch({
      type: 'eventstatistics/fetchordertopnList',
      payload: { value, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadEventtopn',
      payload:{
        time1:startTime,
        time2:endTime,
        num:value,
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
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
  }

  const selectOnchange = (selectvalue) => {
    value = selectvalue;
    handleListdata(value);
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
                      (<DatePicker 
                        allowClear={false}
                        disabled />)
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
                  onClick={() => handleListdata()}
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
          dataSource={ordertopnArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    ordertopnArr: eventstatistics.ordertopnArr
  }))(Workordertopn),
);