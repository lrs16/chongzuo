import React, { useEffect, useState } from 'react';
// import { connect } from 'dva';
// import Link from 'umi/link';
import {
  Card,
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Icon,
  Table,
  // Tooltip,
  Modal,
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

const { Option } = Select;
const { RangePicker } = DatePicker;
// const { Search } = Input;

const faultSource = [ // 故障来源
  { key: 1, value: '用户电话申告' },
  { key: 2, value: '用户自助申告' },
  { key: 3, value: '巡检发现' },
  { key: 4, value: '系统监控发现' },
  { key: 5, value: '企信' },
  { key: 6, value: '值班' },
  { key: 7, value: '其它' },
  { key: 8, value: '春风行动' },
];

const currLinks = [ // 当前环节
  { key: 1, value: '缺陷登记' },
  { key: 2, value: '缺陷审核' },
  { key: 3, value: '缺陷处理' },
  { key: 4, value: '缺陷关闭' },
];

const priority = [ // 优先级
  { key: 1, value: '低' },
  { key: 2, value: '中' },
  { key: 3, value: '高' },
  { key: 4, value: '紧急' },
];

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 100,
    render: (text, record, index) => `${index + 1}`,
  },
  {
    title: '故障编号',
    dataIndex: 'faultID',
    key: 'faultID',
    width: 150,
    // render: (text, record) => {
    //   return (
    //     <Link
    //       to={{
    //         pathname: `/ITSM/faultmanage/faultmanagepro`,
    //         state: {
    //           todolistdata: record,
    //         }
    //       }}
    //     >
    //       {text}
    //     </Link>
    //   );
    // },
  },
  {
    title: '故障标题',
    dataIndex: 'faultTitle',
    key: 'faultTitle',
    width: 200,
  },
  {
    title: '故障来源',
    dataIndex: 'faultSource',
    key: 'faultSource',
    width: 120,
  },
  {
    title: '故障分类',
    dataIndex: 'faultClass',
    key: 'faultClass',
    width: 120,
  },
  {
    title: '申报人',
    dataIndex: 'declarant',
    key: 'declarant',
    width: 120,
  },
  {
    title: '当前处理环节',
    dataIndex: 'currProceLink',
    key: 'currProceLink',
    width: 150,
  },
  {
    title: '故障状态',
    dataIndex: 'faultStatus',
    key: 'faultStatus',
    width: 120,
  },
  {
    title: '超时时间',
    dataIndex: 'overTime',
    key: 'overTime',
    width: 200,
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    width: 200,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
];

function ToDOlist(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields },
  } = props;

  const [expand, setExpand] = useState(false);

  useEffect(() => {
  }, []);

  const handleReset = () => {
    resetFields();
  }

  // const handleSearch = () => {
  // };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="故障编号">
                {getFieldDecorator('faultID', {})(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="故障标题">
                {getFieldDecorator('faultTitle', {})(<Input />)}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="故障来源">
                    {getFieldDecorator('faultSource', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {faultSource.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="故障分类">
                    {getFieldDecorator('faultClass', {
                      initialValue: '',
                    })(<Select />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="当前环节">
                    {getFieldDecorator('currLinks', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {currLinks.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator('sender', {
                      initialValue: '',
                    })(
                      <Input
                        suffix={
                          <div>
                            <Icon type="ellipsis" style={{ color: '#000000', cursor: 'pointer' }} />
                            <Modal
                              title="人员选择"
                              centered
                              width={1200}
                              footer={null}
                            >
                              aa
                            </Modal>
                          </div>
                        }
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('sendTime')(<RangePicker style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('priority', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {priority.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary">
                    查 询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重 置
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="link"
                    onClick={() => {
                      setExpand(!expand);
                    }}
                  >
                    {expand ? (
                      <>
                        收起 <Icon type='up' />
                      </>
                    ) : (
                        <>
                          展开 <Icon type='down' />
                        </>
                      )}
                  </Button>
                </Form.Item>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary">
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      收起 <Icon type='up' />
                    </>
                  ) : (
                      <>
                        展开 <Icon type='down' />
                      </>
                    )}
                </Button>
              </Col>
            )}
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
          rowKey={record => record.faultID}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(ToDOlist);
