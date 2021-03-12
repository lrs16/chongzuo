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
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};

const columns = [
  {
    title: '序号',
    dataIndex: 'name',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 6;
      }
      // These two are merged into above cell
      if (index === 6) {
        obj.props.rowSpan = 4;
      }
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: '月份',
    dataIndex: 'month',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 6;
      }
      // These two are merged into above cell
      if (index === 6) {
        obj.props.rowSpan = 3;
      }
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: '需求总数',
    dataIndex: 'age',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 6;
      }
      // These two are merged into above cell
      if (index === 6) {
        obj.props.rowSpan = 3;
      }
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: '所属功能',
    dataIndex: 'tel',
  },
  {
    title: '所属功能数',
    dataIndex: 'phone',
  },
  {
    title: '已开发',
    dataIndex: 'address',
  },
  {
    title: '已实现',
    dataIndex: 'params1',
  },
  {
    title: '需求实现率',
    dataIndex: 'params2',
  },
];

const data = [
  {
    key: '1',
    name: '序号',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '2',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '3',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '4',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '5',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '6',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '7',
    name: '序所属功能数号',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '8',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '9',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
  {
    key: '10',
    name: '所属功能数',
    month:'月份',
    age: '需求总数',
    tel: '所属功能',
    phone: '所属功能数',
    address: '已开发',
    params1: '已实现',
    params2: '需求实现率',
  },
];

function DemandSchedule(props) {
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
                  {getFieldDecorator('time1', {
                    initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
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
          dataSource={data}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    soluteArr: eventstatistics.soluteArr
  }))(DemandSchedule),
);