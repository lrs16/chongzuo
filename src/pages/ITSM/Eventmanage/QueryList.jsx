import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  // Badge,
  // Tag,
  Cascader,
  message,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SysDict from '@/components/SysDict';
import AdminAuth from '@/components/AdminAuth';
import { EventDelete } from './services/api';    // 删除工单

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

function QueryList(props) {
  // const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      validateFields,
      setFieldsValue,
      getFieldsValue,
    },
    location: { query: {
      time1,
      time2,
      eventObject,
      selfhandle,
      registerUser,
      eventStatus,
      applicationUnit
    } },
    loading,
    list,
    location,
    dispatch,
  } = props;
  let title;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [username, setUserName] = useState('');
  const [tabrecord, setTabRecord] = useState({});

  if (time1) {
    title = '事件统计查询'
  } else {
    title = '事件查询'
  }

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'eventquery/fetchlist',
      payload: {
        ...values,
        eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : '',
        pageSize: size,
        pageIndex: page,
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    });
    setTabRecord({
      ...values,
      time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
    });
  };

  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 140,
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
                key: 'event',
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
            state: {
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
      fixed: 'left',
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
      title: '事件来源',
      dataIndex: 'eventSource',
      key: 'eventSource',
      fixed: 'left',
      width: 160,
    },
    {
      title: '事件分类',
      dataIndex: 'eventType',
      key: 'eventType',
      fixed: 'left',
      width: 100,
    },
    {
      title: '申报人单位',
      dataIndex: 'applicationUnit',
      key: 'applicationUnit',
      width: 180,
      onCell: () => {
        return {
          style: {
            maxWidth: 180,
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
      title: '申报人',
      dataIndex: 'applicationUser',
      key: 'applicationUser',
      width: 80,
    },
    {
      title: '工单状态',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      width: 90,
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'register_user',
      width: 80,
    },
    {
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'eventPrior',
      key: 'eventPrior',
      width: 80,
    },
    {
      title: '申报人部门',
      dataIndex: 'applicationDept',
      key: 'applicationDept',
      width: 270,
      onCell: () => {
        return {
          style: {
            maxWidth: 270,
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
      title: '事件对象',
      dataIndex: 'eventObject',
      key: 'eventObject',
      width: 120,
    },
    // {
    //   title: '标签',
    //   dataIndex: 'eventobject',
    //   key: 'eventobject',
    //   width: 150,
    //   render: (text, record) => {
    //     const tags = ['标签1', '标签2', '标签3'];
    //     return (
    //       <>
    //         {tags.map(obj => (
    //           <Tag color="#108ee9" style={{ margin: 2 }}>
    //             {obj}
    //           </Tag>
    //         ))}
    //       </>
    //     );
    //   },
    // },
    {
      title: '回访方式',
      dataIndex: 'revisitWay',
      key: 'revisitWay',
      width: 120,
    },

    {
      title: '影响度',
      dataIndex: 'eventEffect',
      key: 'eventEffect',
      width: 80,
    },
    {
      title: '紧急度',
      dataIndex: 'eventEmergent',
      key: 'eventEmergent',
      width: 80,
    },


  ];

  //  下载
  const download = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'eventquery/eventdownload',
      payload: {
        values: {
          ...values,
          time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
          eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : '',
        },
        ids: selectedRowKeys.toString(),
      },
    }).then(res => {
      const filename = `事件查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    searchdata(values, 0, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page - 1, paginations.pageSize);
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
    setSelectedRowKeys(RowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (params) => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    const values = getFieldsValue();
    searchdata(values, 0, paginations.pageSize, params);
  };

  const displayRender = label => {
    return label[label.length - 1];
  };

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const sourcemap = getTypebykey(1107); // 事件来源
  const statusmap = getTypebykey(366); // 工单状态
  const typemap = getTypebykey(1106); // 事件分类
  const objectmap = getTypebykey(1087); // 事件对象
  const returnvisit = getTypebykey(1116); // 回访方式
  const effectmap = getTypebykey(1096); // 影响度
  const emergentmap = getTypebykey(1095); // 紧急度
  const priormap = getTypebykey(1094); // 优先级
  const checkresultmap = getTypebykey(622); // 审核结果
  const yesornomap = getTypebykey(379); // 是否
  const handleresultmap = getTypebykey(1113); // 处理结果
  const satisfactionmap = getTypebykey(1120); // 满意度

  const record = {
    eventObject: eventObject || '',
    revisitWay: '',
    eventSource: '',
    eventEffect: '',
    eventEmergent: '',
    eventPrior: '',
    selfhandle: selfhandle || '',
    applicationUnit: applicationUnit || '',
    applicationDept: '',
    registerUser: registerUser || '',
    eventNo: '',
    eventStatus: eventStatus || '',
    eventType: '',
    time1: time1 ? moment(time1).format('YYYY-MM-DD 00:00:00') : '',
    time2: time2 ? moment(time2).format('YYYY-MM-DD 23:59:59') : '',
    paginations
  }
  const cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : record;

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: { cach: false, }
    });
    resetFields();
    if (time1 || time2 || eventObject || selfhandle || registerUser || eventStatus || applicationUnit) {
      setFieldsValue({
        time1: '',
        time2: '',
        eventObject: '',
        selfhandle: '',
        registerUser: '',
        eventStatus: '',
        applicationUnit: ''
      })
    }
    searchdata(record, 0, 15);
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
              key: 'event',
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset()
      };
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
      };
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    if (cacheinfo !== undefined) {
      validateFields((err, values) => {
        if (!err) {
          searchdata(values, cacheinfo.paginations.current - 1, cacheinfo.paginations.pageSize)
        }
      });
    }
  }, []);

  const deleteorder = () => {
    const len = selectedRowKeys.length;
    if (len === 1) {
      EventDelete({ mainId: selectedRowKeys[0] }).then(res => {
        if (res.code === 200) {
          message.success('删除成功！');
        };
        if (res.code === -1) {
          message.error(res.msg);
        };
        validateFields((err, values) => {
          if (!err) {
            searchdata(values, paginations.current - 1, paginations.pageSize);
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

  return (
    <PageHeaderWrapper title={title}>
      <SysDict
        typeid="331"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <>
              <Col span={8}>
                <Form.Item label="事件编号">
                  {getFieldDecorator('eventNo', {
                    initialValue: cacheinfo.eventNo,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="处理环节">
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
              <Col span={8}>
                <Form.Item label="事件对象">
                  {getFieldDecorator('eventObject', {
                    initialValue: cacheinfo.eventObject,
                  })(
                    <Cascader
                      fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                      options={objectmap}
                      placeholder="请选择"
                      expandTrigger="hover"
                      displayRender={displayRender}
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件分类">
                  {getFieldDecorator('eventType', {
                    initialValue: cacheinfo.eventType,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {typemap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="回访方式">
                  {getFieldDecorator('revisitWay', {
                    initialValue: cacheinfo.revisitWay,
                  })(
                    <Select placeholder="请选择"
                      allowClear
                    >
                      {returnvisit.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件来源">
                  {getFieldDecorator('eventSource', {
                    initialValue: cacheinfo.eventSource,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {sourcemap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="影响度">
                  {getFieldDecorator('eventEffect', {
                    initialValue: cacheinfo.eventEffect,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {effectmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="紧急度">
                  {getFieldDecorator('eventEmergent', {
                    initialValue: cacheinfo.eventEmergent,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {emergentmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="优先级">
                  {getFieldDecorator('eventPrior', {
                    initialValue: cacheinfo.eventPrior,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {priormap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="自行处理">
                  {getFieldDecorator('selfhandle', {
                    initialValue: cacheinfo.selfhandle,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {yesornomap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否补单">
                  {getFieldDecorator('supplement', {
                    initialValue: cacheinfo.supplement,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {yesornomap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核结果">
                  {getFieldDecorator('checkResult', {
                    initialValue: cacheinfo.checkResult,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {checkresultmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="处理结果">
                  {getFieldDecorator('handleResult', {
                    initialValue: cacheinfo.handleResult,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {handleresultmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="满意度">
                  {getFieldDecorator('satisfaction', {
                    initialValue: cacheinfo.satisfaction,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {satisfactionmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </span>
            <Col span={8}>
              <Form.Item label="事件标题">
                {getFieldDecorator('eventTitle', {
                  initialValue: cacheinfo.eventTitle,
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
              <Form.Item label="申报人单位">
                {getFieldDecorator('applicationUnit', {
                  initialValue: cacheinfo.applicationUnit,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="申报人部门">
                {getFieldDecorator('applicationDept', {
                  initialValue: cacheinfo.applicationDept,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="登记人">
                {getFieldDecorator('registerUser', {
                  initialValue: cacheinfo.registerUser,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="登记人单位">
                  {getFieldDecorator('registerUnit', {
                    initialValue: cacheinfo.registerUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="登记人部门">
                  {getFieldDecorator('registerDept', {
                    iinitialValue: cacheinfo.registerDept,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('checkUser', {
                    initialValue: cacheinfo.checkUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人单位">
                  {getFieldDecorator('checkUnit', {
                    iinitialValue: cacheinfo.checkUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人部门">
                  {getFieldDecorator('checkDept', {
                    initialValue: cacheinfo.checkDept,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: cacheinfo.handler,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="处理人单位">
                  {getFieldDecorator('handleUnit', {
                    initialValue: cacheinfo.handleUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="处理人部门">
                  {getFieldDecorator('handleDept', {
                    iinitialValue: cacheinfo.handleDept,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="回访人">
                  {getFieldDecorator('revisitor', {
                    initialValue: cacheinfo.revisitor,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="回访人单位">
                  {getFieldDecorator('revisitUnit', {
                    initialValue: cacheinfo.revisitUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="回访人部门">
                  {getFieldDecorator('revisitDept', {
                    initialValue: cacheinfo.revisitDept,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            </span>
            <Col span={8}>
              <Form.Item label="建单时间">
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('time1', {
                    initialValue: cacheinfo.time1 ? moment(cacheinfo.time1) : undefined,
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
                  {getFieldDecorator('time2', {
                    initialValue: cacheinfo.time2 ? moment(cacheinfo.time2) : undefined,
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
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={() => handleSearch('search')}>
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
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>
            导出数据
          </Button>
          <AdminAuth getAuth={v => setUserName(v)} code='admin' />
          {username === 'admin' && (
            <Button type="danger" ghost onClick={() => deleteorder()}>删 除</Button>
          )}
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          scroll={{ x: 1600 }}
          rowKey={r => r.id}
          // rowKey={(_, index) => index.toString()}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create()(
  connect(({ eventquery, loading }) => ({
    list: eventquery.list,
    loading: loading.models.eventquery,
  }))(QueryList),
);
