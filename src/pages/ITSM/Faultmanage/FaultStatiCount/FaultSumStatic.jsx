import React, { useEffect  } from 'react';
// import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  DatePicker,
  Table,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

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

const columns = [
  {
    title: '故障分类',
    dataIndex: 'faultClass',
    key: 'faultTitle',
  },
  {
    title: '工单数 ',
    dataIndex: 'numWorkOrder',
    key: 'numWorkOrder',
  },
];

function Faultsumstatic(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
  }, []);

  const handleSearch = () => {
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="起始时间">
                {getFieldDecorator('startEndTime')(<RangePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary">导出数据</Button>
        </div>
        <Table
          // loading={loading}
          columns={columns}
          // dataSource={dataSource}
          table-layout="fixed"
        // rowKey={record => record.id}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  // connect(({ fault, loading }) => ({
  //   getfaultBreakdownList: fault.getfaultBreakdownList,
  //   html: fault.html,
  //   loading: loading.models.fault,
  // }))
  (Faultsumstatic),
);
