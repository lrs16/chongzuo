import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

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



function ToDolist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    loading,
    list,
    dispatch,
    location,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ source: [] });
  const [tabrecord, setTabRecord] = useState({});

  const searchdata = (values, page, size) => {
    const newvalue = {
      creationStartTime: '',
      creationEndTime: '',
      taskName: values.taskName || '',
      creationTime: values.creationTime ? moment(values.creationTime).format('YYYY-MM-DD') : '',
      userId: sessionStorage.getItem('userauthorityid'),
    }
    dispatch({
      type: 'demandtodo/fetchlist',
      payload: {
        ...values,
        ...newvalue,
        limit: size,
        page,
      },
    });
    setTabRecord({ ...values, ...newvalue, });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, size);
      }
    });
    setPageinations({
      ...paginations,
      current: 1,
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
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

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

  // 设置初始值
  const record = {
    demandId: '',
    taskName: '',
    title: '',
    demandType: '',
    registerPerson: '',
    creationTime: '',
    paginations,
    expand,
  };

  const cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : record;

  const columns = [
    {
      title: '需求编号',
      dataIndex: 'demandId',
      key: 'demandId',
      with: 100,
      fixed: 'left',
      render: (text, r) => {
        const handleClick = () => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/demandmanage/to-do/record/workorder`,
            query: {
              taskName: r.taskName,
              taskId: r.taskId,
              mainId: r.processInstanceId,
              result: '1',
              orderNo: text,
            },
            state: {
              runpath: '/ITSM/demandmanage/to-do',
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
              },
            }
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '需求标题',
      dataIndex: 'demandTitle',
      key: 'demandTitle',
      with: 250,
    },
    {
      title: '需求类型',
      dataIndex: 'demandType',
      key: 'demandType',
      with: 150,
    },
    {
      title: '功能模块',
      dataIndex: 'module',
      key: 'module',
      with: 150,
    },

    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      with: 200,
    },
    {
      title: '提出人',
      dataIndex: 'proposer',
      key: 'proposer',
      with: 100,
    },
    {
      title: '登记人',
      dataIndex: 'sender',
      key: 'sender',
      with: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      with: 150,
      render: text => {
        return <>{moment(text).format('YYYY-MM-DD HH:mm')}</>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      with: 80,
    },
  ];

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    searchdata(record, 1, 15);
    setPageinations({ current: 1, pageSize: 15 });
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
        setExpand(false);
      };
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { creationTime } = location.state.cacheinfo;
        setPageinations({ ...paginations, current, pageSize });
        setExpand(location.state.cacheinfo.expand);
        setFieldsValue({
          creationTime: creationTime ? moment(creationTime) : '',
        })
      };
    }
  }, [location.state]);


  // 获取数据
  useEffect(() => {
    if (cacheinfo !== undefined) {
      validateFields((err, values) => {
        if (!err) {
          searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize)
        }
      });
    }
  }, []);

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button>
  </>)

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const statemap = getTypebyId(546);   // 当前处理环节
  const souremap = getTypebyId(195);   // 需求类型

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="332"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={() => handleSearch()}>
            <Col span={8}>
              <Form.Item label="需求编号">
                {getFieldDecorator('demandId', {
                  initialValue: cacheinfo.demandId,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', {
                  initialValue: cacheinfo.taskName
                })(
                  <Select placeholder="请选择" allowClear>
                    {statemap && statemap.map((obj) => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="需求标题">
                  {getFieldDecorator('title', {
                    initialValue: cacheinfo.title,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="需求类型">
                  {getFieldDecorator('demandType', {
                    initialValue: cacheinfo.demandType
                  })(
                    <Select placeholder="请选择" allowClear>
                      {souremap && souremap.map(obj => (
                        <Option key={obj.dict_code} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="登记人">
                  {getFieldDecorator('registerPerson', {
                    initialValue: cacheinfo.registerPerson,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="创建时间">
                  {getFieldDecorator('creationTime', {
                    initialValue: '',
                  })(<DatePicker allowClear style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </span>
            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8}><Form.Item wrapperCol={24}>{extra}</Form.Item></Col>)}
          </Form>
        </Row>
        {/* <div style={{ marginBottom: 24 }}>
          <Button type="primary">导出数据</Button>
        </div> */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1500 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ demandtodo, loading }) => ({
    list: demandtodo.list,
    loading: loading.models.demandtodo,
  }))(ToDolist),
);
