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

const { RangePicker } = DatePicker;
let statTimeBegin = '';
let statTimeEnd = '';
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    month: '月份',
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
    form: { getFieldDecorator,resetFields },
    soluteArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleListdata = (params) => {
    console.log(statTimeBegin, 'statTimeBegin');
    console.log(statTimeEnd, 'statTimeEnd');
    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/downloadHandlegrate',
      payload: { statTimeBegin, statTimeEnd }
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

  useEffect(() => {
    handleListdata();
  }, [])

  const handleReset = () => {
    resetFields();
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
                  {
                    getFieldDecorator('time1', {})
                      (<RangePicker onChange={onChange} />)
                  }
                </Form.Item>

                <Button
                  type='primary'
                  style={{ marginTop: 6 }}
                  onClick={() => handleListdata('search')}
                >
                  查询
                </Button>

                <Button
                  style={{ marginLeft: 8 }}
                  onClick={handleReset}
                >
                  重置
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