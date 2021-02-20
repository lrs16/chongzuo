import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Button,
  Table
} from 'antd';
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

const columns = [
  {
    title: '工单数',
    dataIndex: 'params1',
    key: 'params1'
  },
  {
    title: '已处理',
    dataIndex: 'params2',
    key: 'params2'
  },
  {
    title: '未处理',
    dataIndex: 'params3',
    key: 'params3'
  },
  {
    title: '处理率',
    dataIndex: 'params4',
    key: 'params4'
  },
]
function Handlingrate(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator },
  } = props;

  const onChange = (date, dateString) => {
    console.log('date: ', date);
    console.log('dateString: ', dateString);
  }
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time1', {})(<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button type='primary'>
                查询
            </Button>

              <Button style={{ marginLeft: 8 }}>
                重置
            </Button>
            </Col>
          </Form>
        </Row>

        <div>
          <Button type='primary' style={{ marginBottom: 24 }}>
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
        />

      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    // handlingratedata: problemstatistics.handlingratedata
  }))(Handlingrate),
);