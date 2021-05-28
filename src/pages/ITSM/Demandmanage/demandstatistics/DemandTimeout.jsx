
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
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime = '';
let endTime = '';
const sign = 'solution';
let searchSign = '';
const { RangePicker } = DatePicker;


function DemandTimeout(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    demandtomeoutArr,
    dispatch
  } = props;

  const columns = [
    {
      title: '序号',
      dataIndex: 'user',
      key: 'user',
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      }

    },
    {
      title: '超时状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '工单数',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => {
        if (record.status !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/demandmanage/query',
              query: {
                completeStatus: record.status,
                startTime: searchSign ? startTime : '',
                endTime: searchSign ? endTime : '',
                pathpush: true,
              },
              state: { cache: false }
            }}
          >
            {text}
          </Link>
        }

        if (record.status === '合计') {
          return <span>{text}</span>
        }

      }
    },
  ];

  const onChange = (date, dateString) => {
    [startTime, endTime] = dateString;
  }


  const handleListdata = (params) => {
    if (params) {
      searchSign = 'searchSign';
    }
    dispatch({
      type: 'demandstatistic/fetchdemandTimeoutlist',
      payload: { sign, startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'demandstatistic/downloaddemandTimeout',
      payload: { sign, startTime, endTime }
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
    // defaultTime();
    searchSign = '';
    handleListdata();
  }, [])

  const handleReset = () => {
    startTime = '';
    endTime = '';
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
          dataSource={demandtomeoutArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ demandstatistic }) => ({
    demandtomeoutArr: demandstatistic.demandtomeoutArr
  }))(DemandTimeout),
);