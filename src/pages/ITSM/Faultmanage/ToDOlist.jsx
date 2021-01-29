import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
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
  Popconfirm,
  Cascader
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

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

function ToDOlist(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    dispatch,
    faultTodoList, // 真实待办列表数据
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 }); // 分页state
  const [selectdata, setSelectData] = useState([]);
  // const [selectedRow, setSelectedRow] = useState([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) => `${(paginations.current - 1) * (paginations.pageSize) + (index + 1)}`,
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '故障编号',
      dataIndex: 'no',
      key: 'no',
      width: 200,
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: `/ITSM/faultmanage/todolist/record/${record.id}`,
              paneKey: record.currentNode
            }}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '故障名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '故障来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '故障类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
      width: 200,
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 150,
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
    },
    {
      title: '严重程度',
      dataIndex: 'registerLevel',
      key: 'registerLevel',
      width: 100,
    },
  ];

  const getTodolists = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/getfaultTodoList',
          payload: {
            ...values,
            current: paginations.current,
            pageSize: paginations.pageSize,
          },
        });
      }
    });
  }

  useEffect(() => {
    getTodolists();
  }, []);

  const handleReset = () => {
    resetFields();
  }

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'fault/getSearchfaultTodo',
      payload: {
        values,
        pageSize,
        current: page,
      },
    });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      const formValues = values;
      if (formValues.createTime) {
        formValues.createTime = values.createTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if(formValues.type) {
        formValues.type = values.type.join('/');
      }
      if (err) {
        return;
      }
      searchdata(formValues, paginations.current, paginations.pageSize);
    });
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPageinations({
      ...paginations,
      pageSize,
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
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: faultTodoList ? faultTodoList.total : '',
    onChange: page => changePage(page),
  };

  // const rowSelection = {
  //   onChange: (selectedRows) => {
  //     setSelectedRow(selectedRows);
  //   },
  // };

  //  下载 /导出功能
  const download = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/faultTododownload',
          payload: {
            values,
            pageSize,
            current: page,
          },
        }).then(res => {
          const filename = `下载.xlsx`;
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const getTypebyTitle = (title) => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const faultSource = getTypebyTitle('故障来源');
  const priority = getTypebyTitle('严重程度');
  const currentNode = getTypebyTitle('当前处理环节');
  const faultType = getTypebyTitle('故障分类');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'non' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="故障编号">
                {getFieldDecorator('no', {})(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="故障名称">
                    {getFieldDecorator('title', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="故障来源">
                    {getFieldDecorator('source', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {faultSource.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('currentNode', {})(
                  <Select placeholder="请选择">
                    {currentNode.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type', {
                      initialValue: '',
                    })(
                      <Cascader
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator('createTime', {
                      // initialValue: moment(Date.now()) || ''
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} placeholder="请选择" />)}
                  </Form.Item>
                </Col>

                <Col xl={8}>
                  <Form.Item label="严重程度">
                    {getFieldDecorator('registerLevel', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {priority.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
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
              <Col span={24} style={{ textAlign: 'right' }} onClick={handleSearch}>
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
          <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>
        </div>
        <Table
          loading={loading}
          columns={columns.filter(item => item.title !== 'id' || item.key !== 'id')}
          dataSource={faultTodoList.rows}
          rowKey={record => record.id}
          pagination={pagination}
        // rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ fault, loading }) => ({
    faultTodoList: fault.faultTodoList, // 真实故障待办列表
    html: fault.html,
    loading: loading.models.fault,
  }))(ToDOlist),
);