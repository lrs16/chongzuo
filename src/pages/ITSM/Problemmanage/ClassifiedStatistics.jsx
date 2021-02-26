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

const { RangePicker } = DatePicker;
let statTimeBegin;
let statTimeEnd;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const columns = [
  {
    title: '问题分类',
    dataIndex: 'statName',
    key: 'statName'
  },
  {
    title: '工单数',
    dataIndex: 'statCount',
    key: 'statCount',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { orderClass: record.statCode }
        }}
      >
        {text}
      </Link>
    )
  },
]
function ClassifiedStatistics(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    classArr
  } = props;

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }
  
  const handleList = (params) => {
    dispatch({
      type: 'problemstatistics/fetchClasslist',
      payload: params? { statTimeBegin, statTimeEnd,dictType: 'type' } : { statTimeBegin:'', statTimeEnd:'',dictType: 'type' }
    })
  }

  useEffect(() => {
    handleList();
  }, []);

  const handleReset = () => {
    resetFields();
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/downloadClass',
      payload: { dictType: 'type'}
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
      console.log('select: ', select);
    }
  }


  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time', {})
                    (<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button
                type='primary'
                onClick={() => handleList('search')}
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
          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24 }}
            onClick={download}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={classArr}
          rowKey={record => record.statCode}
          rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    classArr: problemstatistics.classArr
  }))(ClassifiedStatistics)
);