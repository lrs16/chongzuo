import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, DatePicker, Button, Table, List, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import KeyVal from '@/components/SysDict/KeyVal';

// const { RangePicker } = DatePicker;
const { Option } = Select;

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
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const tabList = [
  {
    key: 'remind',
    tab: '即将超时',
  },
  {
    key: 'notHandle',
    tab: '已超时未处理',
  },
  {
    key: 'timeout',
    tab: '超时已处理',
  },
];

function Overtime(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, loading, location } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;

  const [tabActivekey, settabActivekey] = useState('notHandle'); // 打开标签
  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState({ status: [] });
  const [tabrecord, setTabRecord] = useState({});

  // 设置表单初始值
  const record = {
    eventNo: '',
    flowNodeName: '',
    time1: '',
    time2: '',
    paginations,
    expand,
  };
  const cacheinfo = location.state?.cacheinfo ? location.state.cacheinfo : record;

  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 150,
      fixed: 'left',
      render: (text, record) => {
        const handleClick = () => {
          console.log(tabrecord);
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
            pathname: `/ITSM/eventmanage/query/details`,
            query: {
              pangekey: record.eventStatus,
              id: record.taskId,
              mainId: record.id,
              orderNo: text,
              No: text,
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '申报人',
      dataIndex: 'applicationUser',
      key: 'applicationUser',
      width: 100,
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
      title: '当前环节',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
      width: 150,
    },
    {
      title: '当前处理人',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '超时时间',
      dataIndex: 'timeoutTime',
      key: 'timeoutTime',
      width: 180,
    },
  ];

  const timeoutcolumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 150,
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
            pathname: `/ITSM/eventmanage/query/details`,
            query: {
              pangekey: record.eventStatus,
              id: record.taskId,
              mainId: record.id,
              No: text,
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      ellipsis: true,
      width: 120,
      render: (text) => {
        if (text !== null && text.indexOf(';') !== -1) {
          const arr = text.substr(0, text.length - 1).split(';');
          return (
            <List
              size="small"
              style={{ margin: '-16px', }}
              dataSource={arr}
              renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
            />
          );
        }
        return text
      },
    },
    {
      title: '处理人单位',
      dataIndex: 'handleUnit',
      key: 'handleUnit',
      ellipsis: true,
      width: 350,
      render: (text) => {
        if (text !== null && text.indexOf(';') !== -1) {
          const arr = text.substr(0, text.length - 1).split(';');
          return (
            <List
              size="small"
              style={{ margin: '-16px', }}
              dataSource={arr}
              renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
            />
          );
        }
        return text
      },
    },
    {
      title: '处理人部门',
      dataIndex: 'handleDept',
      key: 'handleDept',
      ellipsis: true,
      width: 350,
      render: (text) => {
        if (text !== null && text.indexOf(';') !== -1) {
          const arr = text.substr(0, text.length - 1).split(';');
          return (
            <List
              size="small"
              style={{ margin: '-16px', }}
              dataSource={arr}
              renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
            />
          );
        }
        return text
      },
    },
    {
      title: '事件对象',
      dataIndex: 'eventObject',
      key: 'eventObject',
      with: 150,
    },
    {
      title: '超时原因',
      dataIndex: 'timeoutMsg',
      key: 'timeoutMsg',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },

  ];


  // 点击页签
  const getdatas = tabkey => {
    setTabRecord({})
    dispatch({
      type: 'eventtimeout/query',
      payload: {
        tabType: tabkey,
        pageIndex: 1,
        pageSize: 15,
      },
    });
  };

  const handleTabChange = key => {
    settabActivekey(key)
    resetFields();
    setPageinations({ ...paginations, current: 1, pageSize: 15 });
    getdatas(key);
  };

  // 查询按钮和翻页
  const searchdata = (values, page, size) => {
    console.log('searchdata', values);
    setTabRecord({
      ...values,
      tabType: tabActivekey,
      time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
    })
    dispatch({
      type: 'eventtimeout/query',
      payload: {
        ...values,
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        tabType: tabActivekey,
        pageIndex: page - 1,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, location.state?.paginations?.current || 1, location.state?.paginations?.pageSize || 15);
      }
    });
  }, []);

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
      searchdata(values, page, paginations.pageSize);
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
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const handleReset = () => {
    settabActivekey('notHandle');
    resetFields();
    getdatas('notHandle');
  }

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

  const download = () => {
    validateFields((_, values) => {
      dispatch({
        type: 'eventtimeout/download',
        payload: {
          tabType: tabActivekey,
          ...values,
          time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        },
      }).then(res => {
        const filename = `事件超时查询${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    })
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <KeyVal
        style={{ display: 'none' }}
        dictModule="event"
        dictType="status"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={6}>
              <Form.Item label="事件编号">
                {getFieldDecorator('eventNo', {
                  initialValue: cacheinfo.eventNo,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="当前环节">
                {getFieldDecorator('flowNodeName', {
                  initialValue: cacheinfo.flowNodeName,
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  >
                    {selectdata.status.map(obj => {
                      if (obj.val !== '已关闭') {
                        return (
                          <Option key={obj.key} value={obj.val}>
                            {obj.val}
                          </Option>
                        )
                      }
                      return null;
                    })}
                  </Select>
                  // <Select>
                  //   <Option value="事件登记">事件登记</Option>
                  //   <Option value="事件响应">事件响应</Option>
                  //   <Option value="事件审核">事件审核</Option>
                  //   <Option value="事件处理">事件处理</Option>
                  //   <Option value="事件确认">事件确认</Option>
                  // </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="建单时间" {...forminladeLayout}>
                {getFieldDecorator('time1', {
                  initialValue: cacheinfo.time1 ? moment(cacheinfo.time1) : undefined,
                })(
                  <DatePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss'),
                    }}
                    placeholder="开始时间"
                    format='YYYY-MM-DD HH:mm:ss' />
                )}
                <span style={{ padding: '0 10px' }}>-</span>
                {getFieldDecorator('time2', {
                  initialValue: cacheinfo.time2 ? moment(cacheinfo.time2) : undefined,
                })(
                  <DatePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment('23:59:59', 'HH:mm:ss'),
                    }}
                    placeholder="结束时间"
                    format='YYYY-MM-DD HH:mm:ss' />
                )}
              </Form.Item>
            </Col>
            {(expand || cacheinfo.expand) && (
              <>
                <Col span={6}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: cacheinfo.eventTitle,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="当前处理人">
                    {getFieldDecorator('userName', {
                      initialValue: cacheinfo.userName,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>

              </>
            )}
            <Col span={24} style={{ textAlign: 'right', marginBottom: 8 }}>
              <Button type="primary" onClick={handleSearch}>
                查 询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>
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
                    关 闭 <UpOutlined />
                  </>
                ) : (
                  <>
                    展 开 <DownOutlined />
                  </>
                )}
              </Button>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => download()}
          >
            导出数据
          </Button>
        </div>
        <Table
          columns={tabActivekey === 'timeout' ? timeoutcolumns : columns}
          dataSource={list.rows}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1400 }}
          bordered={tabActivekey === 'timeout'}
          size={tabActivekey === 'timeout' ? 'middle' : 'default'}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventtimeout, loading }) => ({
    list: eventtimeout.list,
    loading: loading.models.eventtimeout,
  }))(Overtime),
);
