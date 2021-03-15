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
const columns = [
  {
    title: '工单状态',
    dataIndex: 'user',
    key: 'user',
  },

  {
    title: '工单数',
    dataIndex: 'not_selfhandle',
    key: 'not_selfhandle',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/eventmanage/query',
          query: {
            start_time: record.start_time,
            end_time: record.end_time,
          }
        }}
      >
        {text}
      </Link>
    )
  },
];

function Demandstate(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
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
  }))(Demandstate),
);