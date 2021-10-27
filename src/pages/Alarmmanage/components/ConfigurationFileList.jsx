import React, { useState, useEffect, useContext } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Card, Button, Table, Badge, Tabs, Row, Col, Form, Input, Select, DatePicker, Tooltip } from 'antd';
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
function ConfigurationFileList(props) {
  const { loading, dispatch, list, searchtab, ChangeActiveTabKey, activeTabKey } = props;
  const { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue } = props.form;
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [classifykey, setCompany] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [searchdata, setSearchData] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const [assets, setAssets] = useState([]);
  const [expand, setExpand] = useState(false);
  const { tabActivekey, selectdata, tabdate, warnModule, pagetitle, reset } = useContext(TypeContext);

  const { pathname } = window.location;

  const getvalues = () => {
    const val = getFieldsValue();
    const values = {
      ...val,
      beginWarnTime: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
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
    ChangeActiveTabKey('全部');
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

  useEffect(() => {
    if (tabActivekey) {
      handleReset();
    }
  }, [tabActivekey])

  useEffect(() => {
    if (activeTabKey && tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
      const key = activeTabKey === '全部' ? '' : activeTabKey;
      // setClassifykey(key);
      setFieldsValue({ firstClassify: key });
      handleSearch(1, 10);
    }
  }, [activeTabKey]);

  useEffect(() => {
    if (tabActivekey === 'all' && tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
      resetFields();
      handleSearch(1, 10);
    }
  }, [tabdate]);

  useEffect(() => {
    if (reset && tabActivekey === 'today') {
      resetFields();
      handleSearch(1, 10);
    };
  }, [reset]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

  const onShowSizeChange = (page, size) => {
    handleSearch(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    handleSearch(page, paginations.pageSize);
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

  useEffect(() => {
    if (pagetitle === '配置文件变更告警') {
      querkeyVal('assets', 'assets_host_zone_id').then(res => {
        if (res.code === 200) {
          setAssets(res.data.assets_host_zone_id)
        }
      });
    };
    // if (pagetitle === '上下行报文页面告警') {
    //   querkeyVal('system', 'company').then(res => {
    //     if (res.code === 200) {
    //       setCompany(res.data.company)
    //     }
    //   });
    // }
  }, []);

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
        return (<a onClick={handleClick}>{text}</a>)
      }
    },
    {
      title: '区域',
      dataIndex: 'firstClassify',
      key: 'firstClassify',
      width: 120,
    },
    {
      title: '监测内容',
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
    },
    {
      title: '配置文件路径',
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
    },
    {
      title: '配置文件名称',
      dataIndex: 'seventhClassify',
      key: 'seventhClassify',
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
    // {
    //   title: '配置文件大小',
    //   dataIndex: 'key1',
    //   key: 'key1',
    //   width: 180,
    // },
    // {
    //   title: '配置文件内容',
    //   dataIndex: 'warnContent1',
    //   key: 'warnContent1',
    //   width: 180,
    //   onCell: () => {
    //     return {
    //       style: {
    //         maxWidth: 300,
    //         overflow: 'hidden',
    //         whiteSpace: 'nowrap',
    //         textOverflow: 'ellipsis',
    //         cursor: 'pointer'
    //       }
    //     }
    //   },
    //   render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    // },
    // {
    //   title: '配置文件版本号',
    //   dataIndex: 'key3',
    //   key: 'key3',
    //   width: 180,
    // },
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

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const alarmmap = getTypebykey(973);             // 配置文件巡检内容

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch(1, 10)}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    {pagetitle !== '时钟巡检告警' && (<Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button>
    )}</>
  )

  return (
    <>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('firstClassify')(
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
              <Form.Item label="监测内容">
                {getFieldDecorator('secondClassify')(
                  <Select placeholder="请选择" allowClear>
                    {alarmmap && alarmmap.map(({ key, title }) => [
                      <Option key={key} value={title}>
                        {title}
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
            {expand && (
              <>
                {pagetitle === '配置文件变更告警' && (
                  <>
                    <Col span={8}>
                      <Form.Item label="设备IP">
                        {getFieldDecorator('fourthClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="软件名称">
                        {getFieldDecorator('fifthClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="配置文件名称">
                        {getFieldDecorator('seventhClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="配置文件路径">
                        {getFieldDecorator('sixthClassify')(
                          <Input allowClear />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="告警内容">{getFieldDecorator('warnContent ')(<Input allowClear />)}</Form.Item>
                    </Col>
                  </>
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
              </>
            )}
            {(expand || pagetitle === '时钟巡检告警') ? (<Col span={8} style={{ padding: '4px 0 0 48px' }} >{extra}</Col>) : (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>)}
          </Row>
        </Form>
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
          columns={columns}
          dataSource={list.records || []}
          loading={loading}
          rowKey={record => record.id}
          scroll={{ x: 2250 }}
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
  }))(ConfigurationFileList)
);
