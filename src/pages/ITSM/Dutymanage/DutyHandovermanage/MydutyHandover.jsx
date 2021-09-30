import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Popover, Checkbox, Icon,
  // message 
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import SysDict from '@/components/SysDict';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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

const allstatusmap = [
  { key: '0', title: '班组1' },
  { key: '1', title: '班组2' },
  { key: '2', title: '班组3' },
];
const allstatusmap1 = [
  { key: '0', title: '班次1' },
  { key: '1', title: '班次2' },
  { key: '2', title: '班次3' },
];
const allstatusmap2 = [
  { key: '0', title: '物品1' },
  { key: '1', title: '物品2' },
  { key: '2', title: '物品3' },
];
const allstatusmap3 = [
  { key: '0', title: '接班班组1' },
  { key: '1', title: '接班2' },
  { key: '2', title: '接班3' },
];
const allstatusmap4 = [
  { key: '0', title: '接班班次1' },
  { key: '1', title: '接班班次12' },
  { key: '2', title: '接班班次13' },
];
const allstatusmap6 = [
  { key: '0', title: '交接状态1' },
  { key: '1', title: '交接状态12' },
  { key: '2', title: '交接状态13' },
];

function MydutyHandover(props) {
  const pagetitle = props.route.name;
  const {
    // loading,
    form: { getFieldDecorator, resetFields,
      // validateFields 
    },
    logbookSearcharr,
    dispatch,
    loading,
  } = props;

  let formThead;

  const [expand, setExpand] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedRows([...handleSelect])
    }
  };

  // const getList = () => {
  //   dispatch({
  //     type: 'supervisemodel/getWorkQueryLists',
  //     payload: {
  //       tab: '4',
  //       pageIndex: paginations.current,
  //       pageSize: paginations.pageSize,
  //     },
  //   });
  // };

  const searchdata = () => {
    if (pagetitle === '我的值班交接') {
      dispatch({
        type: 'shifthandover/fetchlogbookSearch',
      });
    }
  };

  const handleSearch = () => {
    // setPaginations({
    //   ...paginations,
    //   current: 1,
    // });
    // validateFields((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   searchdata(values, 1, paginations.pageSize);
    // });
  };

  const handleReset = () => {
    resetFields();
    // dispatch({
    //   type: 'supervisemodel/getWorkQueryLists',
    //   payload: {
    //     tab: '4',
    //     pageIndex: 1,
    //     pageSize: paginations.pageSize,
    //   },
    // })
  };

  // 查询
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
    </Button></>
  );

  const todetail = (record,type) => {
    router.push({
      pathname: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/newhandover',
      query: {
        Id: record.id,
        id: record.id,
        type
      },
      state:{
        dynamicpath: true,
        menuDesc: '我的交接班详情',
      }
    })
  }

  const initialColumns = [
    {
      title: '值班交接编号',
      dataIndex: 'logbookNo',
      key: 'logbookNo',
      width: 250,
      render: (text, record) => {
        return <a onClick={()=>todetail(record)}>{text}</a>
      },
    },
    {
      title: '交班人',
      dataIndex: 'handoverName',
      key: 'handoverName',
      width: 100,
    },
    {
      title: '接班人',
      dataIndex: 't2',
      key: 't2',
      width: 100,
    },

    {
      title: '接班班组',
      dataIndex: 'heirGroupName',
      key: 'heirGroupName',
      width: 200,
    },
    {
      title: '接班班次',
      dataIndex: 'heirShiftName',
      key: 'heirShiftName',
      width: 200,
    },
    {
      title: '交班时间',
      dataIndex: 't5',
      key: 't5',
      width: 250,
    },
    {
      title: '需注意事项',
      dataIndex: 'attention',
      key: 'attention',
      width: 250,
    },
    {
      title: '交接物品',
      dataIndex: 'handoverItems',
      key: 'handoverItems',
      width: 250,
    },
    {
      title: '接班时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      width: 250,
    },
    {
      title: '交接班状态',
      dataIndex: 'handoverStatus',
      key: 'handoverStatus',
      width: 150,
    },
    {
      title: '日志登记时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 250,
    },
    {
      title: '值班人',
      dataIndex: 'dutyStaffName',
      key: 'dutyStaffName',
      width: 150,
    },
    {
      title: '巡检及监控记录',
      dataIndex: 'monitorNotes',
      key: 'monitorNotes',
      width: 250,
    },
    {
      title: '异常情况记录',
      dataIndex: 'alarmNotes',
      key: 'alarmNotes',
      width: 250,
    },
    {
      title: '重大运维事件',
      dataIndex: 'devopsNotes',
      key: 'devopsNotes',
      width: 250,
    },
    {
      title: '其他情况记录',
      dataIndex: 'otherNotes',
      key: 'otherNotes',
      width: 250,
    },
    {
      title: '值班班组',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 200,
    },
    {
      title: '值班班次',
      dataIndex: 'shiftName',
      key: 'shiftName',
      width: 200,
    },
    {
      title: '值班时间',
      dataIndex: 'dutyBeginTime',
      key: 'dutyBeginTime',
      width: 250,
    },
  ];

  const defaultAllkey = columns.map(item => {
    return item.title
  });

  const columns11 = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  // const onShowSizeChange = (page, pageSize) => {
  //   validateFields((err, values) => {
  //     if (!err) {
  //       searchdata(values, page, pageSize);
  //     }
  //   });
  //   setPaginations({
  //     ...paginations,
  //     pageSize,
  //   });
  // };

  // const changePage = page => {
  //   validateFields((err, values) => {
  //     if (!err) {
  //       searchdata(values, page, paginations.pageSize);
  //     }
  //   });
  //   setPaginations({
  //     ...paginations,
  //     current: page,
  //   });
  // };

  // const pagination = {
  //   showSizeChanger: true,
  //   onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
  //   current: paginations.current,
  //   pageSize: paginations.pageSize,
  //   total: getWorkQueryLists.total,
  //   showTotal: total => `总共  ${total}  条记录`,
  //   onChange: (page) => changePage(page),
  // };

  // 获取数据
  useEffect(() => {
    searchdata()
  }, []);

  const download = () => { // 导出
    // const exportColumns = columns.map(item => {
    //   return {
    //     column: item.dataIndex,
    //     field: item.title
    //   }
    // })
    // validateFields((err, values) => {
    //   dispatch({
    //     type: 'supervisemodel/downloadWorkQueryExcels',
    //     payload: {
    //       tab: '4',
    //       columns: JSON.stringify(exportColumns),
    //       ...values,
    //       addTime: '',
    //       time1: values.addTime ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       time2: values.addTime ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       plannedStartTime: '',
    //       plannedStartTime1: values.plannedStartTime ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       plannedStartTime2: values.plannedStartTime ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       plannedEndTime: '',
    //       plannedEndTime1: values.plannedEndTime ? moment(values.plannedEndTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       plannedEndTime2: values.plannedEndTime ? moment(values.plannedEndTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       checkTime: '',
    //       checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       startTime: '',
    //       startTime1: values.startTime ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       startTime2: values.startTime ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       endTime: '',
    //       endTime1: values.endTime ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       endTime2: values.endTime ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       executeTime: '',
    //       executeTime1: values.executeOperationTime ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //       executeTime2: values.executeOperationTime ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    //     }
    //   }).then(res => {
    //     const filename = '下载.xls';
    //     const blob = new Blob([res]);
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //   })
    // })
  };

  const newhandover = () => { // 新增值班交接
    router.push({
      pathname: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/newhandover',
      query: {
        addtab: true,
      }
    })
  }

  const handleDelete = () => { // 删除
    // const len = selectedRows.length;
    // const deleteIds = selectedRows.map(res => {
    //   return res.mainId
    // })
    // if (len === 0) {
    //   message.info('至少选择一条数据');
    //   return false;
    // }
    // return dispatch({
    //   type: 'supervisemodel/taskDelete',
    //   payload: {
    //     mainIds: deleteIds.toString()
    //   }
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.success(res.msg);
    //     getList();
    //   } else {
    //     message.info(res.msg);
    //     getList();
    //   }
    // })
  };

  const creataColumns = () => { // 创建列表
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 150
      };
      if (key === 0) {
        obj.render = (text) => {
          return (
            <a >{text}</a>
          )
        }
        obj.fixed = 'left'
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    }
    )
  };

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([])
    }
    creataColumns();
  };

  useEffect(() => {
    // getList();
    setColumns(initialColumns);
  }, []);

  // 数据字典匹配
  // const getTypebyTitle = title => {
  //     if (selectdata.ischange) {
  //         return selectdata.arr.filter(item => item.title === title)[0].children;
  //     }
  //     return [];
  // };

  // const aa = getTypebyTitle('aaaa');
  const handleSuccession = () => {
    todetail(logbookSearcharr[0],'listButton')
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      {/* <SysDict
                typeid=""
                commonid=""
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            /> */}
      <Card>

        {
          pagetitle === '值班交接查询' && (
            <Row gutter={16}>
              <Form {...formItemLayout} onSubmit={handleSearch}>
                <Col span={8}>
                  <Form.Item label="登记时间">
                    {getFieldDecorator('addTime', {
                      initialValue: '',
                    })
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                        />
                      )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="值班人">
                    {getFieldDecorator('form1', {
                      initialValue: '',
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
                {expand && (
                  <>
                    <Col span={8}>
                      <Form.Item label="值班班组">
                        {getFieldDecorator('form2', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="值班班次">
                        {getFieldDecorator('form3', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap1.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="值班时间">
                        {getFieldDecorator('form4', {
                          initialValue: '',
                        })
                          (
                            <RangePicker
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }}
                              format="YYYY-MM-DD HH:mm:ss"
                              style={{ width: '100%' }}
                            />
                          )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="巡检及监控记录">
                        {getFieldDecorator('form5', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />,)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="异常情况记录">
                        {getFieldDecorator('form6', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="重大运维事件">
                        {getFieldDecorator('form7', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />,)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="其他情况记录">
                        {getFieldDecorator('form8', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="交班人">
                        {getFieldDecorator('form9', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="接班人">
                        {getFieldDecorator('form10', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="接班班组">
                        {getFieldDecorator('form11', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap3.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="接班班次">
                        {getFieldDecorator('form12', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap4.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="交班时间">
                        {getFieldDecorator('form13', {
                          initialValue: '',
                        })
                          (
                            <RangePicker
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }}
                              format="YYYY-MM-DD HH:mm:ss"
                              style={{ width: '100%' }}
                            />
                          )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="需注意事项">
                        {getFieldDecorator('form14', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="交接物品">
                        {getFieldDecorator('form15', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap2.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="交接状态">
                        {getFieldDecorator('form16', {
                          initialValue: '',
                        })(
                          <Select placeholder="请选择" allowClear>
                            {allstatusmap6.map(obj => (
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="接班时间">
                        {getFieldDecorator('form17', {
                          initialValue: '',
                        })
                          (
                            <RangePicker
                              showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }}
                              format="YYYY-MM-DD HH:mm:ss"
                              style={{ width: '100%' }}
                            />
                          )}
                      </Form.Item>
                    </Col>
                  </>
                )}
                {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
              </Form>
            </Row>
          )
        }

        <div>
          {
            pagetitle === '我的值班交接' && logbookSearcharr && logbookSearcharr.length === 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newhandover()}>新增</Button>
            )
          }

          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button>
          {
            pagetitle === '我的值班交接' && logbookSearcharr && logbookSearcharr.length >0 && logbookSearcharr[0].handoverStatus === '待接班' && (
              <Button type="primary" onClick={handleSuccession}>接班</Button>
            )
          }
        </div>

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
                  >
                    列表展示
                  </Checkbox>
                  <br />
                </div>

                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={columns}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: '8px' }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: '14px' }} />
            </Button>
          </Popover>
        </div>

        < Table
          loading={loading}
          columns={initialColumns}
          scroll={{ x: 1600 }}
          dataSource={logbookSearcharr}
          // rowSelection={rowSelection}
          rowKey={r => r.id}
        />


      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ shifthandover, loading }) => ({
    logbookSearcharr: shifthandover.logbookSearcharr,
    loading: loading.models.shifthandover
  }))(MydutyHandover),
);