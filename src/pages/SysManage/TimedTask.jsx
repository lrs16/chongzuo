import React, {
  useState,
  // useEffect 
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, Table, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const taskStatus = [
  { key: '0', title: '正常' },
  { key: '1', title: '暂停' },
];

function TimedTask(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue 
    },
    dispatch,
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  
  const searchdata = (page, size) => {
    const values = getFieldsValue();
    dispatch({
      type: '',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // useEffect(() => {
  //   searchdata(1, 15);
  // }, [location]);


  const handleSearch = () => {
    // setPageinations({
    //   ...paginations,
    //   current: 1,
    // });
    // searchdata(1, paginations.pageSize);
  };

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    // setPageinations({ current: 1, pageSize: 15 });
  };

  // const onShowSizeChange = (page, size) => {
  //   searchdata(page, size);
  //   setPageinations({
  //     ...paginations,
  //     pageSize: size,
  //   });
  // };

  // const changePage = page => {
  //   searchdata(page, paginations.pageSize);
  //   setPageinations({
  //     ...paginations,
  //     current: page,
  //   });
  // };

  // const pagination = {
  //   showSizeChanger: true,
  //   onShowSizeChange: (page, size) => onShowSizeChange(page, size),
  //   current: paginations.current,
  //   pageSize: paginations.pageSize,
  //   total: list.total,
  //   showTotal: total => `总共  ${total}  条记录`,
  //   onChange: page => changePage(page),
  // };

  const onSelectChange = (RowKeys) => {
    setSelectedRowKeys(RowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  // useEffect(() => {
  //   // const values = getFieldsValue();
  //   dispatch({
  //     // type: '/fetchlist',
  //     // payload: {
  //     //   ...values,
  //     //   pageIndex: paginations.current - 1,
  //     //   pageSize: paginations.pageSize,
  //     // },
  //   });
  // }, []);

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  )

  const columns = [
    {
      title: '任务编号',
      dataIndex: 'No',
      key: 'No',
      fixed: 'left',
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: ``,
            query: {
              record
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '任务名称',
      dataIndex: 't1',
      key: 't1',
      width: 200,
    },
    {
      title: '任务组名',
      dataIndex: 't2',
      key: 't2',
    },
    {
      title: '是否并发执行',
      dataIndex: 't3',
      key: 't3',
    },
    {
      title: '调用目标字符串',
      dataIndex: 't4',
      key: 't4',
    },
    {
      title: '任务备注',
      dataIndex: 't5',
      key: 't5',
    },
    {
      title: '任务状态',
      dataIndex: 't6',
      key: 't6',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: () => {
        return (
          <div>
            <a type="link">
              编辑
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="任务名称">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务组名">
                {getFieldDecorator('form2', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务状态">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {taskStatus.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col>
          </Form>
        </Row>

        <div style={{ marginBottom: 24 }}>
          {/* <ToApply
            title='新增人员进出申请'
            dispatch={dispatch}
            userinfo={userinfo}
            onSumit={values => handleAdd(values)}
            onChangeList={()=>getfindRegistList()}
          > */}
          <Button type="primary" style={{ marginRight: 8 }}>
            申请
          </Button>
          {/* </ToApply> */}
          {/* <ToEditApply
            title='编辑人员进出申请'
            dispatch={dispatch}
            selectedRows={selectedRows}
            onSumit={values => handleEdite(values)}
            onChangeList={()=>getfindRegistList()}
          > */}
          <Button type="primary" style={{ marginRight: 8 }}>
            编辑
          </Button>
          {/* </ToEditApply> */}
          <Button type="danger" ghost style={{ marginRight: 8 }}>删 除</Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            导出数据
          </Button>
        </div>
        < Table
          // loading={loading}
          columns={columns}
          // dataSource={list.rows}
          //  pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.No}
          scroll={{ x: 1300 }}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect()(TimedTask),
);