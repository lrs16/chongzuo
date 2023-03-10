import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import {
  Card,
  Button,
  Table,
  Badge,
  Tabs,
  Row, Col, Form, Input, Select, DatePicker, Tooltip
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { querkeyVal } from '@/services/api';
import TypeContext from '@/layouts/MenuContext';
import ButtonGroup from './ButtonGroup';

const { TabPane } = Tabs;
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

function HostList(props) {
  const { loading, dispatch, list, searchtab, ChangeActiveTabKey, activeTabKey } = props;
  const { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue } = props.form;
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  // const [classifykey, setClassifykey] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [searchdata, setSearchData] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const [assets, setAssets] = useState([]);
  const [expand, setExpand] = useState(false);
  const { tabActivekey, selectdata, tabdate, warnModule, pagetitle, reset } = useContext(TypeContext);

  const { pathname } = window.location;

  useEffect(() => {
    querkeyVal('assets', 'assets_host_zone_id').then(res => {
      if (res.code === 200) {
        setAssets(res.data.assets_host_zone_id)
      }
    });
  }, []);

  const getvalues = () => {
    const val = getFieldsValue();
    const values = {
      ...val,
      beginClearTime: val.beginClearTime ? moment(val.beginClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginConfirmTime: val.beginConfirmTime ? moment(val.beginConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginWarnTime: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endClearTime: val.endClearTime ? moment(val.endClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endConfirmTime: val.endConfirmTime ? moment(val.endConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endWarnTime: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      warnModule
    };
    return values
  }

  const handleSearch = (page, size) => {
    const key = activeTabKey === '全部' ? '' : activeTabKey;
    setActiveKey('全部');
    const values = getvalues();
    setSearchData({ ...values, firstClassify: key, pageIndex: paginations.current, pageSize: paginations.pageSize })
    dispatch({
      type: 'measuralarm/fetchsearchtab',
      payload: {
        ...values,
        firstClassify: key,
      },
    });
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        firstClassify: key,
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  const handleReset = () => {
    ChangeActiveTabKey('全部')
    resetFields();
    handleSearch(1, 10);
  };

  const handleTabs = key => {
    setActiveKey(key);
    const values = getvalues();
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        confirmStatus: (key === '已确认' || key === '待确认') ? key : '',
        clearStatus: (key === '待消除' || key === '人工消除' || key === '自动消除') ? key : '',
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setPageinations({ current: 1, pageSize: 10 })
  };

  const handleChange = (val) => {
    const key = val || '全部';
    ChangeActiveTabKey(key)
  };

  const handleSelects = (v) => {
    setSelectionRow(v);
    setSelectdata(v);
  };

  // useEffect(() => {
  //   if (tabActivekey) {
  //     handleReset();
  //   }
  // }, [tabActivekey])

  useEffect(() => {
    if (activeTabKey) {
      const key = activeTabKey === '全部' ? '' : activeTabKey;
      // setClassifykey(key);
      setFieldsValue({ firstClassify: key });
      handleSearch(1, 10);
    }
  }, [activeTabKey]);

  useEffect(() => {
    if (tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
      resetFields();
      handleSearch(1, 10);
    }
  }, [tabdate]);

  // useEffect(() => {
  //   if (reset && tabActivekey === 'today') {
  //     resetFields();
  //     handleSearch(1, 10);
  //   };
  // }, [reset]);

  const handlePage = (pageIndex, pageSize) => {
    const values = getvalues();
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        confirmStatus: (activeKey === '已确认' || activeKey === '待确认') ? activeKey : '',
        clearStatus: (activeKey === '待消除' || activeKey === '人工消除' || activeKey === '自动消除') ? activeKey : '',
        pageIndex,
        pageSize,
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

  const onShowSizeChange = (page, size) => {
    handlePage(1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    handlePage(page, paginations.pageSize);
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
    onChange: page => changePage(page),
  };

  const columns = [
    {
      title: '告警编号',
      dataIndex: 'sourceCode',
      key: 'sourceCode',
      width: 180,
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: `${pathname}/details`,
            query: {
              Id: record.id,
              code: record.monitorCode,
              sourceCode: record.sourceCode,
            },
            state: {
              dynamicpath: true,
              menuDesc: '告警详细信息',
              record,
              type: 'measuralarm',
            }
          });
        };
        return (
          <a onClick={handleClick}>{text}</a>
        )
      }
    },
    {
      title: '区域',
      dataIndex: 'firstClassify',
      key: 'firstClassify',
      width: 120,
    },
    {
      title: '设备IP',
      dataIndex: 'fourthClassify',
      key: 'fourthClassify',
      width: 120,
      onCell: () => {
        return {
          style: {
            maxWidth: 120,
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
      title: '设备名称',
      dataIndex: 'thirdClassify',
      key: 'thirdClassify',
      width: 150,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
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
      title: `${pagetitle === '应用程序运行状态告警' ? '监测内容' : '巡检内容'}`,
      dataIndex: 'secondClassify',
      key: 'secondClassify',
      width: 120,
      onCell: () => {
        return {
          style: {
            maxWidth: 120,
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
      title: '确认状态',
      dataIndex: 'confirmStatus',
      key: 'confirmStatus',
      width: 90,
      render: (text) => (
        <>
          <Badge status={text === '已确认' ? 'success' : 'error'} text="" />
          <span style={{ color: text === '已确认' ? '#87d068' : '#f50' }} >{text}</span>
        </>
      ),
    },
    {
      title: '消除状态',
      dataIndex: 'clearStatus',
      key: 'clearStatus',
      width: 120,
      render: (text) => (
        <>
          <Badge status={text === '待消除' ? 'error' : 'default'} text="" />
          <span style={{ color: text === '待消除' ? '#f50' : '' }} >{text}</span>
        </>
      ),
    },
    {
      title: '告警内容',
      dataIndex: 'warnContent',
      key: 'warnContent',
      with: 300,
      onCell: () => {
        return {
          style: {
            maxWidth: 300,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => {
        return (
          <Tooltip placement='topLeft' title={text}>
            {text}
          </Tooltip>)
      }
    },
    {
      title: '告警时间',
      dataIndex: 'warnTime',
      key: 'warnTime',
      width: 180,
    },
    {
      title: '确认告警时间',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      width: 180,
    },
    {
      title: '告警消除时间',
      dataIndex: 'clearTime',
      key: 'clearTime',
      width: 180,
    },
  ];

  const softName = {
    title: '软件名称',
    dataIndex: 'fifthClassify',
    key: 'fifthClassify',
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
  };

  const processName = {
    title: '进程名称',
    dataIndex: 'sixthClassify',
    key: 'sixthClassify',
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
  };

  const addcolumn = (arr) => {
    if (pagetitle !== '主机巡检告警') {
      const newarr = arr;
      newarr.splice(3, 0, processName);
      newarr.splice(3, 0, softName);
      return newarr
    }
    return arr
  };
  const column = addcolumn(columns);

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const hostinspectionmmap = getTypebykey(932);       // 主机巡检内容
  const softinspectionmmap = getTypebykey(965);      //  软件巡检内容
  const hostmonitormap = getTypebykey(938);          //  主机监测

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch(1, 10)}>查 询</Button>
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

  return (
    <>

      <Card>
        <div className='noexplain'>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="区域">
                  {getFieldDecorator('firstClassify', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" onChange={handleChange} allowClear>
                      {assets.map(({ key, val }) => [
                        <Option key={key} value={val}>
                          {val}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('thirdClassify')(
                    <Input allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="设备IP">
                  {getFieldDecorator('fourthClassify')(
                    <Input allowClear />,
                  )}
                </Form.Item>
              </Col>

              {expand === true && (
                <>
                  {(pagetitle === '软件巡检告警' || pagetitle === '应用程序运行状态告警') && (
                    <>
                      <Col span={8}>
                        <Form.Item label="软件名称">
                          {getFieldDecorator('fifthClassify')(
                            <Input allowClear />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="进程名称">
                          {getFieldDecorator('sixthClassify')(
                            <Input allowClear />,
                          )}
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {pagetitle === '主机巡检告警' && (
                    <Col span={8}>
                      <Form.Item label="巡检内容">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="请选择" allowClear>
                            {hostinspectionmmap.map(({ dict_code, title }) => [
                              <Option key={dict_code} value={title}>
                                {title}
                              </Option>,
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  )}
                  {pagetitle === '软件巡检告警' && (
                    <Col span={8}>
                      <Form.Item label="巡检内容">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="请选择" allowClear>
                            {softinspectionmmap.map(({ dict_code, title }) => [
                              <Option key={dict_code} value={title}>
                                {title}
                              </Option>,
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  )}
                  {pagetitle === '应用程序运行状态告警' && (
                    <Col span={8}>
                      <Form.Item label="监测内容">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="请选择">
                            {hostmonitormap.map(({ dict_code, title }) => [
                              <Option key={dict_code} value={title}>
                                {title}
                              </Option>,
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  )}
                  {/* <Col span={8}>
                  <Form.Item label="告警时间">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time1', {
                        initialValue: '',
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
                        initialValue: '',
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
                </Col> */}
                  <Col span={8}>
                    <Form.Item label="告警确认时间">
                      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                        {getFieldDecorator('beginConfirmTime', {
                          initialValue: '',
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
                        {getFieldDecorator('endConfirmTime', {
                          initialValue: '',
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
                  <Col span={8}>
                    <Form.Item label="告警消除时间">
                      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                        {getFieldDecorator('beginClearTime', {
                          initialValue: '',
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
                        {getFieldDecorator('endClearTime', {
                          initialValue: '',
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
              {(pagetitle === '主机巡检告警' || (pagetitle !== '主机巡检告警' && !expand)) ? <Col span={24} style={{ textAlign: 'right' }}>{extra}</Col> : <Col span={8}><Form.Item>{extra}</Form.Item></Col>}
            </Row>
          </Form>
        </div>
        <ButtonGroup
          selectedRowKeys={selectedRowKeys}
          selectRowdata={selectRowdata}
          values={searchdata}
          ChangeSelects={v => handleSelects(v)}
        />
        <Tabs activeKey={activeKey} onChange={handleTabs}>
          {searchtab && searchtab.map(({ name, total }) => [
            <TabPane
              tab={
                <>
                  <span>{name}</span>
                  <span style={{ color: `${(name === '待确认' || name === '待消除') ? '#ff0000' : ''}` }}>（{total}）</span>
                </>
              }
              key={name}
            />,
          ])}
        </Tabs>
        <Table
          rowSelection={rowSelection}
          columns={column}
          dataSource={list.records || []}
          loading={loading}
          rowKey={record => record.id}
          scroll={{ x: pagetitle === '主机巡检告警' ? 1850 : 2000 }}
          pagination={pagination}
        />
      </Card>
    </>
  );
}

export default Form.create({})(
  connect(({ measuralarm, loading }) => ({
    list: measuralarm.list,
    searchtab: measuralarm.searchtab,
    loading: loading.models.measuralarm,
    updataloading: loading.effects['measuralarm/alarmsconfig'],
  }))(HostList)
);
