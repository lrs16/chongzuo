import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
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
  Popover,
  Checkbox,
  Icon,
  message
} from 'antd';
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

const allstatusmap6 = [
  { key: '未交接', title: '未交接' },
  { key: '待接班', title: '待接班' },
  { key: '已接班', title: '已接班' },
  { key: '已退回', title: '已退回' },
];

let shift;
let acceptshift;
let fromparams;
let expand = false;

function MydutyHandover(props) {
  const pagetitle = props.route.name;
  const [selectdata, setSelectData] = useState('');
  const {
    form: {
      getFieldDecorator,
      resetFields,
      setFieldsValue,
      getFieldsValue
    },
    logbookSearcharr,
    shiftGrouparr,
    shiftSearcharr,
    dispatch,
    location,
    loading,
  } = props;
  let formThead;

  const [columns, setColumns] = useState([]);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [newtitle, setNewtitle] = useState('')

  const todetail = (record, type) => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...fromparams,
          paginations,
          expand,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    router.push({
      pathname: `${pagetitle === '我的值班交接' ? '/ITSM/dutymanage/dutyhandovermanage/edithandoverdetail' : '/ITSM/dutymanage/dutyhandovermanage/handoverdetail'}`,
      query: {
        Id: record.id,
        id: record.id,
        type,
      },
      state: {
        runpath: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandoversearch',
        dynamicpath: true,
        menuDesc: '值班交接',
        cacheinfo: {
          ...fromparams,
          paginations,
          expand,
        },
      }
    })
  }

  const searchdata = (values, current, size) => {
    if (pagetitle === '我的值班交接') {
      dispatch({
        type: 'shifthandover/fetchlogbookSearch',
      });
    } else {
      const obj = {
        ...values,
        current,
        size,
        registerBeginTime: (values && values.registerTime?.length)
          ? moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        registerEndTime: (values && values.registerTime?.length)
          ? moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 发生时间
        handoverBeginTime: (values && values.handoverTime?.length)
          ? moment(values.handoverTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        handoverEndTime: (values && values.handoverTime?.length)
          ? moment(values.handoverTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 发生时间
        receiveBeginTime: (values && values.receiveTime?.length)
          ? moment(values.receiveTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        receiveEndTime: (values && values.receiveTime?.length)
          ? moment(values.receiveTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 发生时间
        handoverItems: (values && values.handoverItems) ? values.handoverItems.toString() : ''
      };
      delete obj.registerTime;
      delete obj.dutyTime;
      delete obj.handoverTime;
      delete obj.receiveTime;
      fromparams = obj;
      dispatch({
        type: 'shifthandover/fetchlogbookSearchall',
        payload: {
          ...obj
        }
      });
    }
  };

  const getclassSettinglist = () => {
    dispatch({
      type: 'shiftsandholidays/fetchshiftSearch',
    })
  }

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    const values = getFieldsValue();
    searchdata(values, 1, 15);
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    })
    resetFields();
    searchdata({}, 1, 15);
    shift = [];
    acceptshift = [];
    setNewtitle('')
    getclassSettinglist();
    setPaginations({ current: 1, pageSize: 15 });
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        expand = !expand
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  );

  const defaultAllkey = columns.map(item => {
    return item.title
  });

  if (shiftSearcharr && (shiftSearcharr.records) && shiftSearcharr.records.length > 0) {
    shift = (shiftSearcharr.records).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })

    acceptshift = (shiftSearcharr.records).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })
  }

  if (loading === false && newtitle === 'heirGroupName' && shiftGrouparr && (shiftGrouparr.length) > 0) {
    acceptshift = (shiftGrouparr).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })
  }

  if (loading === false && newtitle === 'groupName' && shiftGrouparr && (shiftGrouparr.length) > 0) {
    shift = (shiftGrouparr).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })
  }

  const onShowSizeChange = (page, pageSize) => {
    const values = getFieldsValue();
    searchdata(values, page, pageSize);
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page, paginations.pageSize);
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: (logbookSearcharr && logbookSearcharr.total) ? logbookSearcharr.total : '',
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const download = () => { // 导出
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title
      }
    });
    const values = getFieldsValue();
    const obj = values;
    delete obj.registerTime;
    delete obj.dutyTime;
    delete obj.handoverTime;
    delete obj.receiveTime;
    dispatch({
      type: 'shifthandover/fetchlogbookDownload',
      payload: {
        columns: JSON.stringify(exportColumns),
        ...obj,
        id: pagetitle === '我的值班交接' ? (logbookSearcharr && logbookSearcharr.records && logbookSearcharr.records[0].id) : selectedKeys.toString(),

      }
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })

  };

  const newhandover = () => { // 新增值班交接
    router.push({
      pathname: '/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/newhandover',
      query: {
        addtab: true,
      }
    })
  }

  const shiftGroup = (values) => {
    dispatch({
      type: 'shifthandover/fetchshiftGroup',
      payload: { groupId: values }
    })
  }

  const handleChange = (key, option, params) => {
    const { values } = option.props
    switch (params) {
      case 'groupName':
        dispatch({
          type: 'shiftsandholidays/cleardata'
        })
        setFieldsValue({ shiftName: '' })
        shiftGroup(values);
        setNewtitle('groupName')
        shift = []
        break;
      case 'heirGroupName':
        dispatch({
          type: 'shiftsandholidays/cleardata'
        })
        setNewtitle('heirGroupName')
        setFieldsValue({ heirShiftName: '' })
        shiftGroup(values);
        acceptshift = []
        break;
      case 'heirShiftName':
      default:
        break;
    }
  };

  const handleFocus = params => {
    switch (params) {
      case 'shiftName':
        if (loading !== true && shift && shift.length === 0) {
          message.error('请选择有效的值班班组');
        }
        break;
      case 'heirShiftName':
        if (loading !== true && acceptshift && acceptshift.length === 0) {
          message.error('请选择有效的接班班组');
        }
        break;

      default:
        break;
    }
  };

  const handleSuccession = () => {
    todetail(logbookSearcharr.records[0], 'listButton')
  }

  const rowSelection = {
    onChange: (index) => {
      setSelectedKeys([...index])
    }
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  const handoveritems = getTypebyTitle('交接物品');

  //  传给多标签的数据
  const record = {
    shiftNo: '',
    dutyStaffName: '',
    groupName: '',
    shiftName: '',
    monitorNotes: '',
    alarmNotes: '',
    devopsNotes: '',
    otherNotes: '',
    handoverName: '',
    heirName: '',
    heirGroupName: '',
    heirShiftName: '',
    attention: '',
    handoverItems: '',
    handoverStatus: '',
    paginations: {
      current: 1,
      pageSize: 15
    }
  }

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  const initialColumns = [
    {
      title: '值班交接编号',
      dataIndex: 'logbookNo',
      key: 'logbookNo',
      width: 250,
      render: (text, record) => {
        if (pagetitle === '我的值班交接') {
          return <a onClick={() => todetail(record, record.handoverStatus === '待接班')}>{text}</a>
        }

        if (pagetitle === '值班交接查询') {
          return <a onClick={() => todetail(record, 'search')}>{text}</a>
        }
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
      dataIndex: 'heirName',
      key: 'heirName',
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
      dataIndex: 'handoverTime',
      key: 'handoverTime',
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
      title: '交接班说明',
      dataIndex: 'receiveRemark',
      key: 'receiveRemark',
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
      width: 350,
      render: (text, record) => {
        return (
          <>
            <span>{record.dutyBeginTime}</span> - <span>{record.dutyEndTime}</span>
          </>
        )
      }
    },
  ];

  const creataColumns = () => { // 创建列表
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: val.width
      };
      if (key === 0 || val.title === '值班交接编号') {
        obj.render = (text, record) => {
          return (
            <a onClick={() => todetail(record, 'search')}>{text}</a>
          )
        }
        obj.fixed = 'left';
        obj.width = 350;
      }
      if (val.title === '值班时间') {
        obj.render = (text, record) => {
          obj.width = 350;
          return (
            <>
              <span>{record.dutyBeginTime}</span> - <span>{record.dutyEndTime}</span>
            </>
          )
        }
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
    if (location.state) {
      if (location.state.cache) {
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...fromparams,
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid')
          }
        })
      };

      if (location.state.reset) {
        handleReset();
        expand = false;
      }
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        expand = location.state.cacheinfo.expand;
        setPaginations({ ...paginations, current, pageSize });
      };
    }
  }, [location.state])

  // 获取数据
  useEffect(() => {
    const value = getFieldsValue();
    if (cacheinfo !== undefined) {
      searchdata(value, cacheinfo.paginations.current, cacheinfo.paginations.pageSize)
    }
    setColumns(initialColumns);
    getclassSettinglist()
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid='1021'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        {
          pagetitle === '值班交接查询' && (
            <div className='noexplain'>
              <Row gutter={16}>
                <Form {...formItemLayout} onSubmit={handleSearch}>
                  <Col span={8}>
                    <Form.Item label="登记时间">
                      {getFieldDecorator('registerTime', {
                        initialValue: cacheinfo.registerBeginTime
                          ? [moment(cacheinfo.registerBeginTime), moment(cacheinfo.registerEndTime)]
                          : '',
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
                      {getFieldDecorator('dutyStaffName', {
                        initialValue: cacheinfo.dutyStaffName,
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>

                  <span style={{ display: expand ? 'block' : 'none' }}>
                    <Col span={8}>
                      <Form.Item label="值班班组">
                        {getFieldDecorator('groupName', {
                          initialValue: cacheinfo.groupName,
                        })(
                          <Select
                            allowClear={false}
                            placeholder="请选择"
                            getPopupContainer={e => e.parentNode}
                            onChange={(value, option) => handleChange(value, option, 'groupName')}
                          >
                            {teamname.map(obj => [
                              <Option
                                key={obj.title}
                                values={obj.key}
                              >
                                {obj.title}
                              </Option>
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="值班班次">
                        {getFieldDecorator('shiftName', {
                          initialValue: cacheinfo.shiftName,
                        })(
                          <Select
                            placeholder="请选择"
                            allowClear
                            getPopupContainer={e => e.parentNode}
                            onFocus={() => handleFocus('shiftName')}
                          >
                            {(shift || []).map((obj) => [
                              <Option
                                key={obj.shiftName}
                                value={obj.shiftName}
                              >
                                {obj.shiftName}
                              </Option>
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="巡检及监控记录">
                        {getFieldDecorator('monitorNotes', {
                          initialValue: cacheinfo.monitorNotes,
                        })(<Input placeholder="请输入" allowClear />,)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="异常情况记录">
                        {getFieldDecorator('alarmNotes', {
                          initialValue: cacheinfo.alarmNotes,
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="重大运维事件">
                        {getFieldDecorator('devopsNotes', {
                          initialValue: cacheinfo.devopsNotes,
                        })(<Input placeholder="请输入" allowClear />,)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="其他情况记录">
                        {getFieldDecorator('otherNotes', {
                          initialValue: cacheinfo.otherNotes,
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="交班人">
                        {getFieldDecorator('handoverName', {
                          initialValue: cacheinfo.handoverName,
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="接班人">
                        {getFieldDecorator('heirName', {
                          initialValue: cacheinfo.heirName,
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="接班班组">
                        {getFieldDecorator('heirGroupName', {
                          initialValue: cacheinfo.heirGroupName,
                        })(
                          <Select
                            placeholder="请选择"
                            allowClear={false}
                            getPopupContainer={e => e.parentNode}
                            onChange={(value, option) => handleChange(value, option, 'heirGroupName')}
                          >
                            {teamname.map(obj => [
                              <Option
                                key={obj.title}
                                values={obj.key}
                              >
                                {obj.title}
                              </Option>
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="接班班次">
                        {getFieldDecorator('heirShiftName', {
                          initialValue: cacheinfo.heirShiftName,
                        })(
                          <Select
                            placeholder="请选择"
                            allowClear
                            getPopupContainer={e => e.parentNode}
                            onFocus={() => handleFocus('heirShiftName')}
                          >
                            {(acceptshift || []).map((obj) => [
                              <Option
                                key={obj.shiftName}
                                value={obj.shiftName}
                              >
                                {obj.shiftName}
                              </Option>
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="交班时间">
                        {getFieldDecorator('handoverTime', {
                          initialValue: cacheinfo.handoverBeginTime ?
                            [moment(cacheinfo.handoverBeginTime), moment(cacheinfo.handoverEndTime)] : ''
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
                        {getFieldDecorator('attention', {
                          initialValue: cacheinfo.attention,
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="交接物品">
                        {getFieldDecorator('handoverItems', {
                          initialValue: cacheinfo.handoverItems && (cacheinfo.handoverItems).split(',') || undefined,
                        })(
                          <Select
                            placeholder="请选择"
                            mode="multiple"
                            allowClear
                          >
                            {(handoveritems || []).map(obj => [
                              <Option key={obj.key} value={obj.title}>
                                {obj.title}
                              </Option>,
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="交接状态">
                        {getFieldDecorator('handoverStatus', {
                          initialValue: cacheinfo.handoverStatus,
                        })(
                          <Select
                            placeholder="请选择"
                            allowClear
                            getPopupContainer={e => e.parentNode}
                          >
                            {allstatusmap6.map(obj => (
                              <Option key={obj.title} value={obj.title}>
                                {obj.title}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="接班时间">
                        {getFieldDecorator('receiveTime', {
                          initialValue: cacheinfo.receiveBeginTime
                            ? [moment(cacheinfo.receiveBeginTime), moment(cacheinfo.receiveEndTime)]
                            : '',
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
                  </span>
                  {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
                </Form>
              </Row>
            </div>

          )
        }

        <div>
          {
            pagetitle === '我的值班交接' && logbookSearcharr && logbookSearcharr.records && logbookSearcharr.records.length === 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newhandover()}>新增</Button>
            )
          }

          {
            logbookSearcharr && logbookSearcharr.records && logbookSearcharr.records.length > 0 && (
              <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button>
            )
          }

          {
            pagetitle === '我的值班交接' && logbookSearcharr && logbookSearcharr.records && logbookSearcharr.records.length > 0 && logbookSearcharr.records[0].handoverStatus === '待接班' && (
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

        <Table
          loading={loading}
          columns={columns && columns.length === (initialColumns && initialColumns.length) ? initialColumns : columns}
          dataSource={logbookSearcharr.records}
          rowSelection={rowSelection}
          pagination={pagetitle === '我的值班交接' ? false : pagination}
          rowKey={r => r.id}
          scroll={{ x: 800, y: 700 }}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ shifthandover, shiftsandholidays, loading }) => ({
    logbookSearcharr: shifthandover.logbookSearcharr,
    shiftSearcharr: shiftsandholidays.shiftSearcharr,
    shiftGrouparr: shifthandover.shiftGrouparr,
    loading: loading.models.shifthandover
  }))(MydutyHandover)
);