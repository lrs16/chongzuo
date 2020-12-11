import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
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

const faultworkStatus = [ // 工单状态
  { key: 1, value: '已处理待回顾' },
  { key: 2, value: '处理中' },
  { key: 3, value: '已关闭' },
  { key: 4, value: '已回顾' },
  { key: 5, value: '审核中' },
  { key: 6, value: '已登记' },
  { key: 7, value: '已派单审核' },
  { key: 8, value: '已审核待处理' },
];

const priority = [ // 优先级
  { key: 1, value: '低' },
  { key: 2, value: '中' },
  { key: 3, value: '高' },
  { key: 4, value: '紧急' },
];

function QueryList(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    faultquerydata,
    dispatch,
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 }); // 分页state

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) => `${(paginations.current - 1) * (paginations.pageSize) + (index + 1)}`,
    },
    {
      title: '故障编号',
      dataIndex: 'faultID',
      key: 'faultID',
      width: 150,
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: `/ITSM/faultmanage/registration/record/${record.faultID}`,
              state: {
                querylistdata: record,
              }
            }}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '故障标题',
      dataIndex: 'faultTitle',
      key: 'faultTitle',
      width: 150,
    },
    {
      title: '故障来源',
      dataIndex: 'faultSource',
      key: 'faultSource',
      width: 150,
    },
    {
      title: '故障分类',
      dataIndex: 'faultClass',
      key: 'faultClass',
      width: 150,
    },
    {
      title: '申报单位',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 200,
    },
    {
      title: '申报人',
      dataIndex: 'declarant',
      key: 'declarant',
      width: 120,
    },
    {
      title: '工单状态',
      dataIndex: 'faultworkStatus',
      key: 'faultworkStatus',
      width: 200,
    },
    {
      title: '登记人',
      dataIndex: 'regist',
      key: 'regist',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
      width: 200,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
    },
  ];

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/fetchfaultSearchList',
          payload: {
            ...values,
            current: paginations.current,
            pageSize: paginations.pageSize,
          },
        });
      }
    });
  }, []);

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'fault/fetchfaultSearchList',
      payload: {
        ...values,
        pageSize: size,
        current: page,
      },
    });
  };

  const handleReset = () => {
    resetFields();
  }

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: faultquerydata.total,
    onChange: page => changePage(page),
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
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
                  <Form.Item label="工单状态">
                    {getFieldDecorator('faultworkStatus', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {faultworkStatus.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="创建日期">
                    {getFieldDecorator('createtime')(<RangePicker style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障对象">
                    {getFieldDecorator('faultObj', {
                      // initialValue: '',
                    })(
                      <Select placeholder="请选择" />,
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

                <Col xl={8} xs={12}>
                  <Form.Item label="申报人单位">
                    {getFieldDecorator('declarantCompany', {
                      // initialValue: '',
                    })(
                      <Select />,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="申报人部门">
                    {getFieldDecorator('declarantDepart', {
                      // initialValue: '', 
                    })(
                      <Select />,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="申报人">
                    {getFieldDecorator('declarant', {
                      // initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="申报人电话">
                    {getFieldDecorator('declarantPhone', {
                      // initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registCompany', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人部门">
                    {getFieldDecorator('registDepart', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('regist', {
                      initialValue: '',
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人单位">
                    {getFieldDecorator('handlerCompany', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人部门">
                    {getFieldDecorator('handlerDepart', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator('handler', {
                      initialValue: '',
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="回顾人单位">
                    {getFieldDecorator('retrosCompany', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="回顾人部门">
                    {getFieldDecorator('retrosDepart', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="回顾人">
                    {getFieldDecorator('retros', {
                      initialValue: '',
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary" onClick={handleSearch}>
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
                <Button type="primary" onClick={handleSearch}>
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
          loading={loading}
          columns={columns}
          dataSource={faultquerydata.data}
          table-layout="fixed"
          rowKey={record => record.faultID}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ fault, loading }) => ({
    faultquerydata: fault.faultquerydata,
    html: fault.html,
    loading: loading.models.fault,
  }))(QueryList),
);