import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SysDict from '@/components/SysDict';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
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
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tabrecord, setTabRecord] = useState({});

  // 查询
  const searchdata = (values, page, size) => {
    const newvalue = {
      ...values,
      time3: values.time3 ? moment(values.time3).format('YYYY-MM-DD HH:mm:ss') : '',
      time4: values.time4 ? moment(values.time4).format('YYYY-MM-DD HH:mm:ss') : '',
    }
    dispatch({
      type: 'eventtodo/fetchlist',
      payload: { ...newvalue, pageSize: size, pageIndex: page - 1, },
    });
    setTabRecord({ ...newvalue });
  };

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtodo/eventdownload',
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

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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



  // 设置表单初始值
  const record = {
    eventNo: '',
    eventTitle: '',
    eventSource: '',
    eventStatus: '',
    registerUser: '',
    applicationUser: '',
    time3: '',
    time4: '',
    eventPrior: '',
    paginations,
    expand,
  };
  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 180,
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
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              taskName: r.eventStatus,
              taskId: r.taskId,
              mainId: r.mainId,
              check: r.checkResult,
              orderNo: text,
            },
            state: {
              runpath: '/ITSM/eventmanage/to-do',
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
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      with: 250,
    },
    {
      title: '事件来源',
      dataIndex: 'eventSource',
      key: 'eventSource',
      width: 160,
    },
    {
      title: '事件分类',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 150,
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 100,
    },
    {
      title: '申报人',
      dataIndex: 'applicationUser',
      key: 'applicationUser',
      width: 100,
    },
    {
      title: '工单状态',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      width: 100,
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '优先级',
      dataIndex: 'eventPrior',
      key: 'eventPrior',
      width: 100,
    },
  ];

  const handleReset = () => {
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
        if (location.state.cacheinfo.paginations) {
          const { current, pageSize } = location.state.cacheinfo.paginations;
          setPageinations({ ...paginations, current, pageSize });
        }
        setExpand(location.state.cacheinfo.expand);
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

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const sourcemap = getTypebykey(1107); // 事件来源
  const statusmap = getTypebykey(366); // 工单状态
  const priormap = getTypebykey(1094); // 优先级

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
    </Button></>)

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="331"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={() => handleSearch()}>
            <Col span={8}>
              <Form.Item label="事件编号">
                {getFieldDecorator('eventNo', {
                  initialValue: cacheinfo.eventNo,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="事件标题">
                  {getFieldDecorator('eventTitle', {
                    initialValue: cacheinfo.eventTitle,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件来源">
                  {getFieldDecorator('eventSource', {
                    initialValue: cacheinfo.eventSource,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {sourcemap.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </span>
            <Col span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator('eventStatus', {
                  initialValue: cacheinfo.eventStatus,
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => (
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
                <Form.Item label="登记人">
                  {getFieldDecorator('registerUser', {
                    initialValue: cacheinfo.registerUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申报人">
                  {getFieldDecorator('applicationUser', {
                    initialValue: cacheinfo.applicationUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="优先级">
                  {getFieldDecorator('eventPrior', {
                    initialValue: cacheinfo.eventPrior,
                  })(
                    <Select placeholder="请选择">
                      {priormap.map(obj => (
                        <Option key={obj.key} value={obj.title} allowClear>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="发送时间">
                  <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                    {getFieldDecorator('time3', {
                      initialValue: cacheinfo.time3 ? moment(cacheinfo.time3) : undefined,
                    })(
                      <DatePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </div>
                  <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                  <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                    {getFieldDecorator('time4', {
                      initialValue: cacheinfo.time4 ? moment(cacheinfo.time4) : undefined,
                    })(
                      <DatePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('23:59:59', 'HH:mm:ss'),
                        }}
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </div>
                </Form.Item>
              </Col>
            </span>
            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={r => r.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ eventtodo, loading }) => ({
    list: eventtodo.list,
    loading: loading.models.eventtodo,
  }))(ToDolist),
);
