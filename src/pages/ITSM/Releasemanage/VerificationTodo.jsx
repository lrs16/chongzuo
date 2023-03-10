import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, Table, Cascader, Tooltip, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;
const InputGroup = Input.Group;

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

function VerificationTodo(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, getFieldsValue },
    loading,
    list,
    totals,
    dispatch,
    viewlist,
    viewmsg,
    viewloading,
    location
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [viewPages, setViewPages] = useState({ current: 1, pageSize: 5 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = { releaseNo: '', releaseStatus: '待验证' };
  const cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  // 查询
  const searchdata = (values, page, size) => {
    setExpandedRowKeys([]);
    dispatch({
      type: 'releaseverificat/fetchlist',
      payload: {
        ...values,
        abilityType: values.abilityType?.slice(-1)[0],
        verifyStatus: values.verifyStatus || '待验证',
        pageSize: size,
        pageIndex: page,
      },
    });
    setTabRecord({
      ...values,
      abilityType: values.abilityType?.slice(-1)[0],
      verifyStatus: values.verifyStatus || '待验证',
    });
  };

  const handleReset = () => {
    router.push({
      pathname: `/ITSM/releasemanage/plan/verificationtodo`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(searchrecord, 1, 15);
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

  useEffect(() => {
    if (cacheinfo) {
      setExpandedRowKeys([]);
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      const values = getFieldsValue();
      searchdata(values, current, pageSize);
    };
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, []);

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'releasetodo/eventdownload',
          payload: {
            values,
            ids: selectedRowKeys.toString(),
          },
        }).then(res => {
          const filename = `事件待办_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  // 查看清单
  const getViewList = (todoCode) => {
    dispatch({
      type: 'releaseverificat/viewlist',
      payload: {
        todoCode
      },
    })
  }

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
    total: totals,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const functionmap = getTypebyId(451);       // 功能类型
  const checkstatusmap = getTypebyId(534);       // 状态

  // 合并工单号相同的行
  const temp = {};
  const mergeCells = (text, array, columns) => {
    let i = 0;
    if (text !== temp[columns]) {
      temp[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };

  const columns = [
    {
      title: '验证工单',
      dataIndex: 'todoCode',
      key: 'todoCode',
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
            pathname: `/ITSM/releasemanage/plan/verificationtodo/record`,
            query: {
              Id: record.todoCode,
              releaseNo: record.releaseNo,
              titletype: '业务验证'
            },
            state: {
              runpath: location.pathname,
              dynamicpath: true,
              menuDesc: '业务验证',
            }
          });
        };
        const obj = {
          children: <a onClick={handleClick}>{text}</a>,
          props: {},
        };
        obj.props.rowSpan = mergeCells(record.todoCode, list, 'todoCode');
        return obj;
      },
    },
    {
      title: '状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
    },
    {
      title: '发布编号',
      dataIndex: 'releaseNo',
      key: 'releaseNo',
      render: (text) => {
        return <Tooltip title="点击行查看清单">{text}</Tooltip>;
      },
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
    },
  ];

  const expandedRowRender = () => {
    const columnSun = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
          return <>{`${(viewPages.current - 1) * viewPages.pageSize + index + 1}`}</>;
        },
      },
      {
        title: '功能类型',
        dataIndex: 'abilityType',
        key: 'abilityType',
        width: 150,
      },
      {
        title: '模块',
        dataIndex: 'module',
        key: 'module',
        width: 120,
      },
      {
        title: '功能名称',
        dataIndex: 'appName',
        key: 'appName',
        width: 150,
      },
      {
        title: '问题类型',
        dataIndex: 'problemType',
        key: 'problemType',
        width: 150,
      },
      {
        title: '测试内容及预期效果',
        dataIndex: 't5',
        key: 't5',
        width: 300,
        render: (text, record) => {
          return (
            <>
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
                <span style={{ width: 200 }}>{record.testMenu}</span>
              </InputGroup>
              <Divider type='horizontal' style={{ margin: '6px 0' }} />
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
                <span style={{ width: 200 }}>{record.testResult}</span>
              </InputGroup>
              <Divider type='horizontal' style={{ margin: '6px 0' }} />
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
                <span style={{ width: 200 }}>{record.testStep}</span>
              </InputGroup>
            </>
          );
        }
      },
      {
        title: '是否通过',
        dataIndex: 'passTest',
        key: 'passTest',
        align: 'center',
        width: 100,
      },
      {
        title: '开发人员',
        dataIndex: 'developer',
        key: 'developer',
        width: 100,
      },
      {
        title: '业务负责人',
        dataIndex: 'responsible',
        key: 'responsible',
        align: 'center',
        width: 100,
      },
    ];
    const key = Object.keys(viewlist)[0];

    const addcolumn = {
      title: '业务审核人',
      dataIndex: 'operator1',
      key: 'operator1',
      align: 'center',
      width: 100,
    };

    const viewpagination = {
      showSizeChanger: true,
      onShowSizeChange: (page, size) => { setViewPages({ ...viewPages, current: 1, pageSize: size }) },
      current: viewPages.current,
      pageSize: viewPages.pageSize,
      pageSizeOptions: ['2', '5', '10', '20', '30', '40', '50'],
      total: viewlist[key]?.length,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => setViewPages({ ...viewPages, current: page }),
    };

    return (
      <div style={{ margin: '0 48px 0 0', }}>
        <div style={{ marginBottom: 12 }}>{viewmsg[key]}</div>
        <Table
          columns={columnSun}
          dataSource={viewlist && viewlist[key] || []}
          size='small'
          pagination={viewpagination}
          loading={viewloading}
          rowKey={r => r.id}
          bordered
          scroll={{ y: 374 }}
        />
      </div>
    );
  };

  const changeRowsKey = (expanded, record) => {
    if (expanded) {
      const arr = [record.todoCode];
      setExpandedRowKeys(arr);
      getViewList(record.todoCode);
    } else {
      setExpandedRowKeys([]);
    }
  }

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 416
      } else {
        height = clientHeight - 374
      }
    }
    return height
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <Card bodyStyle={{ paddingBottom: 0 }}>
          <Row gutter={24}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={8}>
                <Form.Item label="发布编号">
                  {getFieldDecorator('releaseNo', {
                    initialValue: cacheinfo.releaseNo,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="状态">
                  {getFieldDecorator('verifyStatus', {
                    initialValue: cacheinfo.verifyStatus || '待验证',
                  })(
                    <Select placeholder="请选择">
                      {checkstatusmap.map(obj => (
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
                  <Form.Item label="功能类型">
                    {getFieldDecorator('abilityType', {
                      initialValue: cacheinfo.abilityType,
                    })(
                      <Cascader
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                        options={functionmap}
                        changeOnSelect
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="功能名称">
                    {getFieldDecorator('appName', {
                      initialValue: cacheinfo.appName,
                    })(
                      <Input placeholder="请输入" allowClear />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="问题类型">
                    {getFieldDecorator('problemType', {
                      initialValue: cacheinfo.problemType,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </span>
              <Col span={8}>
                <Form.Item style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={handleSearch}>
                    查 询
                  </Button>
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
                </Form.Item>
              </Col>
            </Form>
          </Row>
          {/* <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
        </div> */}

          <Table
            loading={loading}
            columns={columns}
            expandedRowKeys={expandedRowKeys}            // 默认展开的行
            expandedRowRender={expandedRowRender}        // 展开的内容
            expandRowByClick
            onRow={(record) => {
              return {
                onClick: () => { getViewList(record.todoCode) },
              };
            }}
            onExpand={(expanded, record) => changeRowsKey(expanded, record)}
            expandIconColumnIndex={3}
            dataSource={list}
            pagination={pagination}
            rowSelection={rowSelection}
            rowKey={(record) => record.todoCode}
            scroll={{ y: setTableHeight() }}
          />
        </Card>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releaseverificat, loading }) => ({
    list: releaseverificat.list,
    totals: releaseverificat.totals,
    viewlist: releaseverificat.viewlist,
    viewmsg: releaseverificat.viewmsg,
    loading: loading.effects['releaseverificat/fetchlist'],
    viewloading: loading.effects['releaseverificat/viewlist'],
  }))(VerificationTodo),
);