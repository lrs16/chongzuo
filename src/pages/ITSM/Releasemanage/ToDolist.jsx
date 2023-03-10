import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import RangeTime from '@/components/SelectTime/RangeTime';
import AdminAuth from '@/components/AdminAuth';
import DictLower from '@/components/SysDict/DictLower';
import { mergeOrders, exportReleaseOrder } from './services/api';

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

function ToDolist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue },
    loading,
    list,
    dispatch,
    location,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [username, setUserName] = useState('');
  const [rangeTimeReset, setRangeTimeReset] = useState(false);

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = { releaseNo: '', releaseStatus: '' };
  const cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'releasetodo/fetchlist',
      payload: {
        ...values,
        beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize: size,
        pageIndex: page,
      },
    });
    setTabRecord({
      ...values,
      beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
    });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    const values = getFieldsValue();
    searchdata(values, paginations.current, paginations.pageSize);
  };

  const handleReset = () => {
    setRangeTimeReset(true);
    router.push({
      pathname: `/ITSM/releasemanage/plan/to-do`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(searchrecord, 1, 15);
    setTimeout(() => { setRangeTimeReset(false) }, 50)
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
      const values = getFieldsValue();
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(values, current, pageSize);
    };
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, []);

  //  下载
  const download = () => {
    const val = getFieldsValue();
    const formval = {
      ...val,
      beginTime: val.beginTime ? moment(val.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: val.endTime ? moment(val.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
    };
    const userid = sessionStorage.getItem('userauthorityid');
    const releaseNos = selectedRecords.length > 0 && selectedRecords.map(item => {
      return item.releaseNo
    });
    const values = { ...formval, userid, releaseNos: releaseNos.length > 0 ? releaseNos.toString() : '' };
    exportReleaseOrder(values).then(res => {
      if (res) {
        const filename = `发布待办_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('下载失败')
      }
    });
  };

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    searchdata(values, 1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page, paginations.pageSize);
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

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  const handleApproval = () => {
    if (selectedRecords.length === 0 || selectedRecords.length === 1) {
      message.error('请选择多条数据')
    } else {
      const target = selectedRecords.filter(item => item.taskName === '版本管理员审核' && item.releaseType === '计划发布');
      if (target.length > 0) {
        const releaseNos = target.map((obj) => {
          return obj.releaseNo;
        });
        if (releaseNos.length > 1) {
          mergeOrders({ releaseNo: releaseNos.toString() }).then(res => {
            if (res.code === 200) {
              message.success('工单合并成功');
              // const values = getFieldsValue();
              // searchdata(values, paginations.current, paginations.pageSize);
              router.push({
                pathname: `/ITSM/releasemanage/plan/to-do/record`,
                query: {
                  taskName: '版本管理员审核',
                  Id: target[0].releaseNo,
                  taskId: target[0].taskId,
                  releaseType: target[0].releaseType,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '发布工单',
                }
              });
            }
          })
        } else {
          message.error('请选择多条当前处理环节为‘版本管理员审核’且发布类型为‘计划发布’的工单')
        }
      } else {
        message.error('请选择当前处理环节为‘版本管理员审核’且发布类型为‘计划发布’的工单')
      }
    };
    setSelectedRowKeys([]);
    setSelectedRecords([]);
  }

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const unitmap = getTypebyId(1052);       // 责任单位
  const statumap = getTypebyId(469);       // 处理环节

  const columns = [
    {
      title: '发布编号',
      dataIndex: 'releaseNo',
      key: 'releaseNo',
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
            pathname: `/ITSM/releasemanage/plan/to-do/record`,
            query: {
              taskName: record.taskName,
              Id: record.releaseNo,
              taskId: record.taskId,
              releaseType: record.releaseType,
            },
            state: {
              dynamicpath: true,
              menuDesc: '发布工单',
            }
          });
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
      sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
    },
    {
      title: '合并单号',
      dataIndex: 'mergeNo',
      key: 'mergeNo',
      render: (text, record) => {
        return (<>{(record.taskName === '版本管理员审核' || record.taskName === '科室负责人审核' || record.taskName === '中心领导审核') ? text : ''}</>)
      }
    },
    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      title: '发布类型',
      dataIndex: 'releaseType',
      key: 'releaseType',
      width: 200,
      sorter: (a, b) => a.releaseType.localeCompare(b.releaseType),
    },
    {
      title: '责任单位',
      dataIndex: 'dutyUnit',
      key: 'dutyUnit',
      sorter: (a, b) => a.dutyUnit.localeCompare(b.dutyUnit),
    },
    {
      title: '出厂测试登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      sorter: (a, b) => a.registerUser.localeCompare(b.registerUser),
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      key: 'sender',
      sorter: (a, b) => a.sender.localeCompare(b.sender),
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      sorter: (a, b) => a.sendTime.localeCompare(b.sendTime),
    },
  ];

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
  )

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 488
      } else {
        height = clientHeight - 406
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
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('releaseStatus', {
                    initialValue: cacheinfo.releaseStatus,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {statumap.map(obj => (
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
                  <Form.Item label="责任单位">
                    {getFieldDecorator('dutyUnit', {
                      initialValue: cacheinfo.dutyUnit,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {unitmap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布类型">
                    {getFieldDecorator('releaseType', {
                      initialValue: cacheinfo.releaseType,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {typemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="出厂测试登记人">
                    {getFieldDecorator('register', {
                      initialValue: cacheinfo.register,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator('sender', {
                      initialValue: cacheinfo.sender,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} onClick={e => e.stopPropagation()}>
                      {getFieldDecorator('beginTime', {
                        initialValue: cacheinfo.beginTime ? moment(cacheinfo.beginTime) : '',
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
                      {getFieldDecorator('endTime', {
                        initialValue: cacheinfo.endTime ? moment(cacheinfo.endTime) : '',
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
              <Col span={8} style={{ marginTop: 4, paddingLeft: 48 }}>{extra}</Col>
            </Form>
          </Row>
          <div>
            <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
            <AdminAuth getAuth={v => setUserName(v)} code='sixteen' />
            {username === 'sixteen' && (
              <Button type="primary" onClick={() => handleApproval()} >版本管理员合并审核</Button >
            )}
          </div>
          < Table
            loading={loading}
            columns={columns}
            dataSource={list.records}
            pagination={pagination}
            rowSelection={rowSelection}
            rowKey={(_, index) => index.toString()}
            scroll={{ y: setTableHeight() }}
          />
        </Card>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(ToDolist),
);
