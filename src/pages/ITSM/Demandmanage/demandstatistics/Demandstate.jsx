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
const columns = [
  {
    title: '工单状态',
    dataIndex: 'statusName',
    key: 'statusName',
  },

  {
    title: '工单数',
    dataIndex: 'number',
    key: 'number',
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
    demandstateArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }


  const handleListdata = () => {
    dispatch({
      type: 'demandstatistic/fetchdemandstateList',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'demandstatistic/downloaddemandstate',
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
          dataSource={demandstateArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ demandstatistic }) => ({
    demandstateArr: demandstatistic.demandstateArr
  }))(Demandstate),
);