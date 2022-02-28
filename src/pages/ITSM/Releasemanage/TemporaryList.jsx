import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, message, Tooltip, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { exportReleaseOrder } from './services/temp';

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

function Querylist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, setFieldsValue, getFieldsValue },
    loading,
    list,
    dispatch,
    location,
    viewlist,
    viewmsg,
    viewloading
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
  const searchrecord = { releaseNo: '', releaseStatus: '' };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'releasetemp/fetchlist',
      payload: {
        ...values,
        orderType: 'LS',
        beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize: size,
        pageIndex: page,
      },
    });
    setTabRecord({
      ...values,
      orderType: 'LS',
      beginTime: values.beginTime ? moment(values.beginTime).format('X') : '',
      endTime: values.endTime ? moment(values.endTime).format('X') : '',
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

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/ITSM/releasemanage/temporary/list`,
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
              key: 'release',
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
    if (cacheinfo) {
      const values = getFieldsValue();
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(values, current, pageSize);
    }
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
    const releaseNos = selectedRecords.length > 0 && selectedRecords.map(item => {
      return item.releaseNo
    })
    const values = { ...formval, userid: '', releaseNos: releaseNos.length > 0 ? releaseNos.toString() : '' };
    exportReleaseOrder(values).then(res => {
      if (res) {
        const filename = `临时发布查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const unitmap = getTypebyId(1052);       // 责任单位
  const statumap = getTypebyId(13266);       // 处理环节
  const grademap = getTypebyId(514);

  const columns = [
    {
      title: '临时发布编号',
      dataIndex: 'releaseNo',
      key: 'releaseNo',
      render: (text, record) => {
        const handleClick = () => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
                key: 'release',
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/releasemanage/temporary/details`,
            query: {
              Id: record.releaseNo,
              taskId: record.taskId,
              taskName: record.taskName,
            },
            state: {
              dynamicpath: true,
              menuDesc: '临时发布工单详情',
            }
          });
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
      sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
    },
    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      title: '当前处理人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 200,
      sorter: (a, b) => a.assigneeName.localeCompare(b.assigneeName),
    },
    {
      title: '程序版本号',
      dataIndex: 'versionNo',
      key: 'versionNo',
      sorter: (a, b) => a.versionNo.localeCompare(b.versionNo),
    },
    {
      title: '发布等级',
      dataIndex: 'releaseLevel',
      key: 'releaseLevel',
      sorter: (a, b) => a.releaseLevel.localeCompare(b.releaseLevel),
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      sorter: (a, b) => a.applicant.localeCompare(b.applicant),
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
      title: '责任单位',
      dataIndex: 'dutyUnit',
      key: 'dutyUnit',
      sorter: (a, b) => a.dutyUnit.localeCompare(b.dutyUnit),
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      sorter: (a, b) => a.releaseTime.localeCompare(b.releaseTime),
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
        cacheinfo.expand = !expand;
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  );


  // 查看清单
  const getViewList = (releaseNo) => {
    dispatch({
      type: 'releasetemp/viewlist',
      payload: {
        releaseNo
      },
    })
  }

  const changeRowsKey = (expanded, record) => {
    if (expanded) {
      const arr = [record.taskId];
      setExpandedRowKeys(arr);
      getViewList(record.releaseNo);
    } else {
      setExpandedRowKeys([]);
    }
  }

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
    ];
    // const key = Object.keys(viewlist)[0];
    const viewpagination = {
      showSizeChanger: true,
      onShowSizeChange: (page, size) => { setViewPages({ ...viewPages, current: 1, pageSize: size }) },
      current: viewPages.current,
      pageSize: viewPages.pageSize,
      pageSizeOptions: ['2', '5', '10', '20', '30', '40', '50'],
      total: viewlist?.length,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => setViewPages({ ...viewPages, current: page }),
    };

    return (
      <div style={{ margin: '0 48px 0 0', }}>
        {/* <div style={{ marginBottom: 12 }}>{viewmsg}</div> */}
        <Table
          columns={columnSun}
          dataSource={viewlist}
          size='small'
          pagination={viewpagination}
          loading={viewloading}
          bordered
          scroll={{ y: 350 }}
        />
      </div>
    );
  };

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 536
      } else {
        height = clientHeight - 420
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
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="临时发布编号">
                {getFieldDecorator('releaseNo', {
                  initialValue: cacheinfo.releaseNo,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', {
                  initialValue: cacheinfo.taskName,
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
            {(expand || cacheinfo.expand) && (
              <>
                <Col span={8}>
                  <Form.Item label="当前处理人">
                    {getFieldDecorator('assigneeName', {
                      initialValue: cacheinfo.assigneeName,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="程序版本号">
                    {getFieldDecorator('versionNo', {
                      initialValue: cacheinfo.versionNo,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布等级">
                    {getFieldDecorator('releaseLevel', {
                      initialValue: cacheinfo.releaseLevel,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {grademap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申请人">
                    {getFieldDecorator('applicant', {
                      initialValue: cacheinfo.applicant,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('beginTime', {
                        initialValue: cacheinfo.beginTime ? moment(cacheinfo.beginTime * 1000) : '',
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
                        initialValue: cacheinfo.endTime ? moment(cacheinfo.endTime * 1000) : '',
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
              </>
            )}
            <Col span={8} style={{ marginTop: 4, paddingLeft: 48 }}>{extra}</Col>
          </Form>
        </Row>
        <div>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
        </div>
        < Table
          loading={loading}
          columns={columns}
          expandedRowKeys={expandedRowKeys}            // 默认展开的行
          expandedRowRender={expandedRowRender}        // 展开的内容
          expandRowByClick
          onRow={record => {
            return {
              onClick: e => { e.preventDefault(); getViewList(record.releaseNo) },
            };
          }}
          onExpand={(expanded, record) => changeRowsKey(expanded, record)}
          dataSource={list.records}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={(r) => r.taskId}
          scroll={{ y: setTableHeight() }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetemp, loading }) => ({
    list: releasetemp.list,
    viewlist: releasetemp.viewlist,
    viewmsg: releasetemp.viewmsg,
    loading: loading.models.releasetemp,
    viewloading: loading.effects['releasetemp/viewlist'],
  }))(Querylist),
);
