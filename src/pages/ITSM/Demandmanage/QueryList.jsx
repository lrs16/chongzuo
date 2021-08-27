import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Cascader, message, Popover } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import KeyVal from '@/components/SysDict/KeyVal';
import TableColumns from '@/components/TableColumns';
import AdminAuth from '@/components/AdminAuth';
import { DemandDlete } from './services/api';

const { Option } = Select;
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

const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function QueryList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    location: { query: { module, taskName, startTime, endTime, completeStatus } },
    loading,
    list,
    dispatch,
    location,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [tabrecord, setTabRecord] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [username, setUserName] = useState('');
  const [tabColumns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);

  const searchdata = (values, page, size) => {
    const newvalues = {
      createTime: '',
      startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD 00:00:00') : '',
      endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD 23:59:59') : '',
      completeStatus: values.completeStatus === undefined ? '' : values.completeStatus,
    }
    dispatch({
      type: 'demandquery/querylist',
      payload: {
        ...values,
        module: values.module === [] ? '' : values.module.join('/'),
        ...newvalues,
        limit: size,
        page,
      },
    });
    setTabRecord({ ...values, ...newvalues });
  };

  const columns = [
    {
      title: '需求编号',
      dataIndex: 'demandId',
      key: 'demandId',
      with: 100,
      fixed: 'left',
      render: (text, record) => {
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
            pathname: `/ITSM/demandmanage/query/details`,
            query: {
              taskId: record.taskId,
              mainId: record.processInstanceId,
              taskName: record.taskName,
              No: text,
            },
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
      title: '申请人',
      dataIndex: 'proposer',
      key: 'proposer',
      with: 100,
    },
    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      with: 200,
    },

    {
      title: '登记人',
      dataIndex: 'sender',
      key: 'sender',
      with: 100,
    },
    {
      title: '建单时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      render: text => {
        return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      with: 80,
    },
  ];

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
      searchdata(values, paginations.page, paginations.pageSize);
    });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, 15)
      }
    });
    setPageinations({ current: 1, pageSize: 15 });
  };

  const download = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'demandquery/download',
        payload: {
          ...values,
          module: values.module === [] ? '' : values.module.join('/'),
          startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD 00:00:00') : '',
          endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD 23:59:59') : '',
          createTime: ''
        }
      }).then(res => {
        const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    })
  };


  const time = startTime ? [moment(startTime), moment(endTime)] : '';
  const modulestatus = module === undefined ? [] : module.split('/');
  const record = {
    demandId: '',
    taskName,
    module: modulestatus,
    demandTitle: '',
    demandType: '',
    sender: '',
    completeStatus,
    createTime: time,
    paginations,
  };
  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  // 设置时间
  useEffect(() => {
    if (location.state.cacheinfo) {
      const cachestartTime = location.state.cacheinfo.startTime;
      const cacheendTime = location.state.cacheinfo.endTime;
      setFieldsValue({
        createTime: cachestartTime ? [moment(cachestartTime), moment(cacheendTime)] : '',
      })
    } else {
      setFieldsValue({
        createTime: time,
      })
    }
  }, [location.state]);

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
        handleReset()
      };
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize })
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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const overtimemap = getTypebyId('1398105281983942657');       // 超时状态
  const demandtype = getTypebyId('1352069854860939266');
  const statemap = getTypebyId('1398105664881954817');
  const modulemap = getTypebyId('1352070663392727041');
  // const columnsmap = getTypebyId('1431057154650308609');
  console.log(tabColumns)
  console.log(selectdata)

  // 管理员账号删除工单
  // 行选择
  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 列表中删除工单
  const deleteorder = () => {
    const len = selectedRowKeys.length;
    if (len === 1) {
      DemandDlete(selectedRowKeys[0]).then(res => {
        if (res.code === 200) {
          message.success('删除成功！');
        };
        if (res.code === -1) {
          message.error(res.msg);
        };
        validateFields((err, values) => {
          if (!err) {
            searchdata(values, paginations.current, paginations.pageSize);
          }
        });
      })
    } else if (len > 1) {
      message.info('仅能选择一条数据进行删除操作');
    } else {
      message.info('您还没有选择数据');
    };
    setSelectedRowKeys([]);
  }

  const content = (
    <div style={{ width: 750, height: 400, overflow: 'scroll' }}>
      <TableColumns records={tabColumns.columns} />
    </div>
  );

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1354274450639425537"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <KeyVal
        style={{ display: 'none' }}
        dictModule="demand"
        dictType="columns"
        ChangeSelectdata={v => setColumns(v)}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="需求编号">
                {getFieldDecorator('demandId', {
                  initialValue: cacheinfo.demandId,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', { initialValue: cacheinfo.taskName })(
                  <Select placeholder="请选择" allowClear>
                    {statemap.map((obj) => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="功能模块" >
                {getFieldDecorator('module', {
                  initialValue: cacheinfo.module,
                })(
                  <Cascader
                    fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                    options={modulemap}
                  />,
                )}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="需求标题">
                  {getFieldDecorator('demandTitle', {
                    initialValue: cacheinfo.demandTitle,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="需求类型">
                  {getFieldDecorator('demandType', { initialValue: cacheinfo.demandType })(
                    <Select placeholder="请选择" allowClear>
                      {demandtype.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="登记人">
                  {getFieldDecorator('sender', {
                    initialValue: cacheinfo.sender,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            </span>
            <Col span={8}>
              <Form.Item label="超时状态">
                {getFieldDecorator('completeStatus', {
                  initialValue: cacheinfo.completeStatus
                })(
                  <Select placeholder="请选择" allowClear>
                    {overtimemap.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="建单时间" {...form10ladeLayout}>
                {getFieldDecorator('createTime', {
                  initialValue: '',
                })(<RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  format='YYYY-MM-DD'
                  allowClear
                />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
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
                {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
              </Button>
            </Col>
          </Form>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>
              导出数据
            </Button>
            <AdminAuth getAuth={v => setUserName(v)} />
            {username === 'admin' && (
              <Button type="danger" ghost onClick={() => deleteorder()}>删 除</Button>
            )}
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Popover
              content={content}
              trigger="click"
              visible={visible}
              onVisibleChange={v => setVisible(v)}
            >
              <Button icon="setting" />
            </Popover>
          </Col>
        </Row>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={r => r.processInstanceId}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1500 }}
        />
        <TableColumns records={tabColumns.columns} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
  }))(QueryList),
);
