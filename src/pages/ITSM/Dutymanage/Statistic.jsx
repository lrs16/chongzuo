import React, { useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Divider,
  Popconfirm
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title: '值班人',
    dataIndex: 'aa',
    key: 'aa'
  },
  {
    title: '值班总次数',
    dataIndex: 'bb',
    key: 'bb'
  },
  {
    title: '工作日值班次数',
    dataIndex: 'cc',
    key: 'cc'
  },
  {
    title: '周末值班次数',
    dataIndex: 'dd',
    key: 'dd'
  },
  {
    title: '节假值班次数',
    dataIndex: 'ee',
    key: 'ee'
  },
];

const data = [{
  aa: 'aa',
  bb: 'aa',
  cc: 'aa',
  dd: 'aa',
  ee: 'aa',
}]

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const { RangePicker } = DatePicker;

function Statistic(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue
    },
    location,
    dispatch,
  } = props;

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    // searchdata({}, 1, 15)
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="值班单位">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="值班人">
                {getFieldDecorator('form2', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="起始时间">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(<RangePicker placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item label="值班时段" >
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time3', {
                      initialValue: undefined,
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledStartDate(value, 'duty')}
                        onChange={(value) => onStartChange(value, 'duty')}
                        onOpenChange={(value) => handleStartOpenChange(value, 'duty')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator('time4', {
                      initialValue: undefined,
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledEndDate(value, 'duty')}
                        onChange={(value) => onEndChange(value, 'duty')}
                        open={dutytime.endOpen}
                        onOpenChange={(value) => handleEndOpenChange(value, 'duty')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('23:59:59', 'HH:mm:ss'),
                        }}
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col> */}
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                // onClick={handlesearch}
              >
                查询
              </Button>

              <Button onClick={handleReset}>重置</Button>
            </Col>

            {/* <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col> */}
          </Form>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
        />
      </Card>

    </PageHeaderWrapper>

  )

}
export default Form.create({})(
  connect()(Statistic),
);