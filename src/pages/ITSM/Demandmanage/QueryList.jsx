import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Cascader, message, Popover, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined, AlertTwoTone } from '@ant-design/icons';
import { ThShort } from '@/utils/utils';
import RangeTime from '@/components/SelectTime/RangeTime';
import DictLower from '@/components/SysDict/DictLower';
import TableColumns from '@/components/TableColumns';
import AdminAuth from '@/components/AdminAuth';
import { querkeyVal } from '@/services/api';
import { DemandDlete } from './services/api';

const { Option } = Select;
// const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 6,
  },
  wrapperCol: {
    xs: 24,
    sm: 18,
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
  const [selectedRowRecord, setSelectedRowRecord] = useState([]);
  const [username, setUserName] = useState('');
  const [tabColumns, setColumns] = useState({});
  const [defaultColumns, setDefaultColumns] = useState([])
  const [visible, setVisible] = useState(false);
  const [clearregisterTime, setClearregisterTime] = useState(false);
  const [clearcreateTime, setClearcreateTime] = useState(false);

  const modulestatus = !module ? [] : module.split('/');
  const records = {
    demandId: '',
    taskName,
    module: modulestatus,
    demandTitle: '',
    demandType: '',
    sender: '',
    completeStatus,
    startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
    endTime: endTime ? moment(endTime).format('YYYY-MM-DD 23:59:59') : '',
    registerTime1: '',
    registerTime2: '',
    paginations,
  };
  const cacheinfo = location.state?.cacheinfo ? location.state.cacheinfo : records;

  const searchdata = (values, page, size) => {
    const newvalues = {
      createTime: '',
      startTime: values.createTime?.startTime ? moment(values.createTime.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: values.createTime?.endTime ? moment(values.createTime.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      registerTime1: values.registerTime?.startTime ? moment(values.registerTime.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      registerTime2: values.registerTime?.endTime ? moment(values.registerTime.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      completeStatus: !values.completeStatus ? '' : values.completeStatus,
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
      title: '????????????',
      dataIndex: 'demandId',
      key: 'demandId',
      with: 100,
      fixed: 'left',
      sorter: (a, b) => ThShort(a, b, 'demandId'),
      render: (text, record) => {
        const handleClick = () => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
                key: 'demand',
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/demandmanage/query/details`,
            query: {
              taskId: record.taskId,
              mainId: record.processId,
              taskName: record.taskName,
              No: text,
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '????????????',
      dataIndex: 'demandTitle',
      key: 'demandTitle',
      with: 250,
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
      title: '????????????',
      dataIndex: 'demandType',
      key: 'demandType',
      with: 150,
    },
    {
      title: '?????????',
      dataIndex: 'proposer',
      key: 'proposer',
      with: 100,
    },
    {
      title: '??????????????????',
      dataIndex: 'taskName',
      key: 'taskName',
      with: 200,
    },

    {
      title: '?????????',
      dataIndex: 'sender',
      key: 'sender',
      with: 100,
    },
    {
      title: '????????????',
      dataIndex: 'sendTime',
      key: 'sendTime',
      render: text => {
        return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },
    {
      title: '?????????',
      dataIndex: 'priority',
      key: 'priority',
      with: 80,
    },
  ];

  // ???????????????
  const tableColumns = (tablecolumns) => {
    const newArr = [];
    if (!Array.isArray(tablecolumns)) {
      return newArr;
    }
    for (let i = 0; i < tablecolumns.length; i += 1) {
      const vote = {};
      vote.title = tablecolumns[i].val;
      vote.dataIndex = tablecolumns[i].key;
      vote.key = tablecolumns[i].key;
      vote.width = 200;
      vote.sorter = (a, b) => ThShort(a, b, tablecolumns[i].key);
      if (tablecolumns[i].key === 'demandId') {
        vote.fixed = 'left';
        vote.render = (text, record) => {
          const handleClick = () => {
            dispatch({
              type: 'viewcache/gettabstate',
              payload: {
                cacheinfo: {
                  ...tabrecord,
                  paginations,
                  expand,
                  key: 'demand',
                },
                tabid: sessionStorage.getItem('tabid')
              },
            });
            router.push({
              pathname: `/ITSM/demandmanage/query/details`,
              query: {
                taskId: record.taskId,
                mainId: record.processId,
                taskName: record.taskName,
                No: text,
              },
              state: {
                cacheinfo: {
                  ...tabrecord,
                  paginations,
                  expand,
                }
              },
            });
          };
          return <a onClick={handleClick}>{text}</a>;
        }
      } else if (tablecolumns[i].key === 'timeoutStatus') {
        vote.render = (text) => {
          const blubnap = new Map([
            ['?????????', <AlertTwoTone twoToneColor="#52C41A" />],
            ['????????????', <AlertTwoTone twoToneColor="orange" />],
            ['?????????', <AlertTwoTone twoToneColor="red" />]
          ]);
          const colormap = new Map([
            ['?????????', '#52C41A'],
            ['????????????', 'orange'],
            ['?????????', 'red']
          ]);
          return (
            <><span style={{ fontSize: '1.4em', marginRight: 8 }}>{blubnap.get(text)}</span>
              <span style={{ color: colormap.get(text) }}>{text}</span>
            </>
          )
        }
      } else {
        vote.onCell = () => {
          return {
            style: {
              maxWidth: 180,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }
          }
        };
        vote.render = (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>;
      }
      newArr.push(vote);
    };
    return newArr;
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
    showTotal: total => `??????  ${total}  ?????????`,
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

  // const time = startTime ? [moment(startTime), moment(endTime)] : '';

  const handleReset = () => {
    setClearcreateTime(true);
    setClearregisterTime(true);
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    setClearcreateTime(true);
    setClearregisterTime(true);
    searchdata(records, 1, 15)
    setPageinations({ current: 1, pageSize: 15 });
    setTimeout(() => { setClearcreateTime(false); setClearregisterTime(false) }, 50)
  };

  const downloadColumns = (data) => {
    const newArr = [];
    if (!Array.isArray(data)) {
      return newArr;
    }
    for (let i = 0; i < data.length; i += 1) {
      const vote = {};
      vote.field = data[i].val;
      vote.column = data[i].key;
      newArr.push(vote)
    }
    return newArr
  }

  const download = () => {
    validateFields((_, values) => {
      const tablecol = downloadColumns(defaultColumns);
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        const ids = selectedRowRecord.map(item => {
          return item.id
        });
        dispatch({
          type: 'demandquery/download',
          payload: {
            columns: JSON.stringify(tablecol),
            ids: ids.toString()
          }
        }).then(res => {
          const filename = `????????????_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        dispatch({
          type: 'demandquery/download',
          payload: {
            ...values,
            columns: JSON.stringify(tablecol),
            module: values.module === [] ? '' : values.module.join('/'),
            startTime: values.createTime?.startTime ? moment(values.createTime.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: values.createTime?.endTime ? moment(values.createTime.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            registerTime1: values.registerTime?.startTime ? moment(values.registerTime.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            registerTime2: values.registerTime?.endTime ? moment(values.registerTime.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            createTime: ''
          }
        }).then(res => {
          if (res) {
            const filename = `????????????_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
            message.error('?????????????????????????????????...')
          }
        });
      }
    })
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // ????????????????????????
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              paginations,
              expand,
              key: 'demand',
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // ??????????????????
      if (location.state.reset) {
        handleReset()
      };
      // ???????????????????????????
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { registerTime1, registerTime2, } = location.state.cacheinfo;
        const cachestartTime = location.state.cacheinfo.startTime;
        const cacheendTime = location.state.cacheinfo.endTime;
        setFieldsValue({
          createTime: { startTime: cachestartTime, endTime: cacheendTime },
          registerTime: { startTime: registerTime1, endTime: registerTime2 },
        });
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize })
      };
    }
  }, [location.state]);

  // ????????????
  useEffect(() => {
    if (cacheinfo) {
      validateFields((_, values) => {
        searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize)
      });
    }
    querkeyVal('demand', 'columns').then(res => {
      if (res.code === 200) {
        setColumns(res.data.columns)
      }
    });
    querkeyVal('demand', 'defaultcolumns').then(res => {
      if (res.code === 200) {
        setDefaultColumns(res.data.defaultcolumns)
      }
    })
  }, []);

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const overtimemap = getTypebyId(545);       // ????????????
  const demandtype = getTypebyId(195);        // ????????????
  const statemap = getTypebyId(546);          // ??????????????????,????????????
  const modulemap = getTypebyId(198);         // ????????????

  // ???????????????????????????
  // ?????????
  const onSelectChange = (RowKeys, RowRecord) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRowRecord(RowRecord);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // ?????????????????????
  const deleteorder = () => {
    const len = selectedRowKeys.length;
    if (len === 1) {
      DemandDlete(selectedRowKeys[0]).then(res => {
        if (res.code === 200) {
          message.success('???????????????');
        };
        if (res.code === -1) {
          message.error(res.msg);
        };
        validateFields((_, values) => {
          searchdata(values, paginations.current, paginations.pageSize);
        });
      })
    } else if (len > 1) {
      message.info('??????????????????????????????????????????');
    } else {
      message.info('????????????????????????');
    };
    setSelectedRowKeys([]);
  }

  const content = (
    <div style={{ width: 750, height: 400, overflow: 'scroll' }}>
      <TableColumns defaultVal={defaultColumns} records={tabColumns} ChangeSelectVal={v => setDefaultColumns(v)} />
    </div>
  );

  const setTableHeight = () => {
    let height = 500;
    // ????????????1600??????????????????
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 564
      } else {
        height = clientHeight - 520
      }
    }
    return height
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="332"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <Card bodyStyle={{ paddingBottom: 0 }}>
          <Row gutter={24}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={8}>
                <Form.Item label="????????????">
                  {getFieldDecorator('demandId', {
                    initialValue: cacheinfo.demandId,
                  })(<Input placeholder="?????????" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="??????????????????">
                  {getFieldDecorator('taskName', { initialValue: cacheinfo.taskName })(
                    <Select placeholder="?????????" allowClear>
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
                <Form.Item label="????????????" >
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
              {(expand || (location && location.state && location.state.expand)) && (
                <>
                  <Col span={8}>
                    <Form.Item label="????????????">
                      {getFieldDecorator('demandTitle', {
                        initialValue: cacheinfo.demandTitle,
                      })(<Input placeholder="?????????" allowClear />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="????????????">
                      {getFieldDecorator('demandType', { initialValue: cacheinfo.demandType })(
                        <Select placeholder="?????????" allowClear>
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
                    <Form.Item label="?????????">
                      {getFieldDecorator('sender', {
                        initialValue: cacheinfo.sender,
                      })(<Input placeholder="?????????" allowClear />)}
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={8}>
                <Form.Item label="?????????????????????">
                  {getFieldDecorator('taskUser', {
                    initialValue: cacheinfo.taskUser,
                  })(<Input placeholder="?????????" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="????????????">
                  {getFieldDecorator('completeStatus', {
                    initialValue: cacheinfo.completeStatus
                  })(
                    <Select placeholder="?????????" allowClear>
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
                <Form.Item label="????????????" >
                  {getFieldDecorator('createTime', {
                    initialValue: { startTime: cacheinfo.startTime, endTime: cacheinfo.endTime },
                  })(
                    // <RangePicker
                    // // showTime={{
                    // //   hideDisabledOptions: true,
                    // //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    // // }}
                    // format='YYYY-MM-DD'
                    // allowClear
                    // style={{ width: '100%' }}
                    // />
                    <RangeTime
                      startVal={cacheinfo.startTime}
                      endVal={cacheinfo.endTime}
                      clear={clearcreateTime}
                      getTimes={(v) => { setFieldsValue({ createTime: v }) }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="????????????">
                  {getFieldDecorator('registerTime', {
                    initialValue: { startTime: cacheinfo.registerTime1, endTime: cacheinfo.registerTime2 },
                  })(<></>)}
                  <RangeTime
                    startVal={cacheinfo.registerTime1}
                    endVal={cacheinfo.registerTime2}
                    clear={clearregisterTime}
                    getTimes={(v) => { setFieldsValue({ registerTime: v }) }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  ??? ???
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>
                  ??? ???
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (<>??? ??? <UpOutlined /></>) : (<>??? ??? <DownOutlined /></>)}
                </Button>
              </Col>
            </Form>
          </Row>
          <Row>
            <Col span={12}>
              <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>
                ????????????
              </Button>
              <AdminAuth getAuth={v => setUserName(v)} code='admin' />
              {username === 'admin' && (
                <Button type="danger" ghost onClick={() => deleteorder()}>??? ???</Button>
              )}
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Popover
                content={content}
                trigger="click"
                visible={visible}
                onVisibleChange={v => setVisible(v)}
                placement="left"
              >
                <Tooltip title="???????????????">
                  <Button icon="setting" style={{ background: '#e1e1e1' }} />
                </Tooltip>
              </Popover>
            </Col>
          </Row>
          <Table
            loading={loading}
            columns={defaultColumns && defaultColumns.length > 0 ? tableColumns(defaultColumns) : columns}
            dataSource={list.rows}
            rowKey={r => r.processId}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1500, y: setTableHeight() }}
          />
        </Card>
      </div>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
  }))(QueryList),
);
