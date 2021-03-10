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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { RangePicker } = DatePicker;
let statTimeBegin;
let statTimeEnd;

const columns = [
  {
    title: '工单状态',
    dataIndex: 'statName',
    key: 'statName',
  },
  {
    title: '工单数',
    dataIndex: 'statCount',
    key: 'statCount',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { 
            problem: 'status',
            status: record.statCode
           }
        }}
      >
        {text}
      </Link>
    )
  },
]
function Statusstatistics(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator,resetFields },
    dispatch,
    statusArr
  } = props;

  const statusList = (params) => {
    dispatch({
      type: 'problemstatistics/fetchstatusList',
      payload: params? { statTimeBegin, statTimeEnd } : { statTimeBegin:'', statTimeEnd:'' }
    });
  }

  useEffect(() => {
    statusList();
  }, [])

  const download = () => {
    dispatch({
      type:'problemstatistics/download'
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

  const rowSelection = {
    onChange: (selectedRowkeys, select) => {
    }
  }

  const pagination = {
    pageSize: 20
  }

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleReset = () => {
    resetFields();
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time2', {})
                    (<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button type='primary' onClick={() => statusList('search')}>
                查询
              </Button>

              <Button
                style={{ marginLeft: 8 }}
                onClick={handleReset}
              >
                重置
              </Button>
            </Col>
          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24 }}
            onClick={() => download()}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={statusArr}
          pagination={pagination}
          rowKey={record => record.statCode}
          rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    statusArr: problemstatistics.statusArr
  }))(Statusstatistics),
);