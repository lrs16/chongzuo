import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Card, Button, Table, Badge, Tabs, Row, Col, Form, Input, Select, DatePicker, Cascader, Tooltip } from 'antd';
import { connect } from 'dva';
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

const columns = [
  {
    title: '告警编号',
    dataIndex: 'sourceCode',
    key: 'sourceCode',
    width: 180,
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/alarmmanage/measuralarm/measuralarm/details`,
          query: {
            Id: record.id,
            code: record.monitorCode,
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
    title: '监控项',
    dataIndex: 'firstClassify',
    key: 'firstClassify',
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
    title: '监控内容',
    dataIndex: 'secondClassify',
    key: 'secondClassify',
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
    title: '监控子类',
    dataIndex: 'thirdClassify',
    key: 'thirdClassify',
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
    title: '确认状态',
    dataIndex: 'confirmStatus',
    key: 'confirmStatus',
    width: 90,
    render: (text) => (
      <Badge status={text === '已确认' ? 'success' : 'error'} text={text} />
    ),
  },
  {
    title: '消除状态',
    dataIndex: 'clearStatus',
    key: 'clearStatus',
    width: 120,
    render: (text) => (
      <Badge status={text === '待消除' ? 'error' : 'default'} text={text} />
    ),
  },
  {
    title: '告警内容',
    dataIndex: 'warnContent',
    key: 'warnContent',
    width: 300,
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
        <Tooltip placement='topLeft' title={text}>{text}</Tooltip>)
    }
  },
  {
    title: '告警时间',
    dataIndex: 'warnTime',
    key: 'warnTime',
    width: 180,
  },
  {
    title: '告警确认时间',
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
function MeasurList(props) {
  const { loading, dispatch, list, searchtab, ChangeActiveTabKey, activeTabKey } = props;
  const { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue } = props.form;
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [searchdata, setSearchData] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const { tabActivekey, selectdata, tabdate, warnModule, reset } = useContext(TypeContext);

  const getvalues = () => {
    const val = getFieldsValue();
    const values = {
      firstClassify: val.Classify ? val.Classify[0] : '',
      secondClassify: val.Classify && val.Classify.length > 1 ? val.Classify[1] : '',
      thirdClassify: val.Classify && val.Classify.length > 2 ? val.Classify[2] : '',
      beginClearTime: val.beginClearTime ? moment(val.beginClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginConfirmTime: val.beginConfirmTime ? moment(val.beginConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      beginWarnTime: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endClearTime: val.endClearTime ? moment(val.endClearTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endConfirmTime: val.endConfirmTime ? moment(val.endConfirmTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endWarnTime: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
      warnContent: val.warnContent,
      warnModule
    };
    return values
  }

  const handleSearch = (page, size) => {
    const key = activeTabKey === '告警概览' ? '' : activeTabKey.slice(0, -2);
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
    ChangeActiveTabKey('告警概览');
    resetFields();
    //  handleSearch(1, 10);
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
    setPageinations({ current: 1, pageSize: 2 })
  };

  const handleChange = (val) => {
    const key = val && val.length > 0 ? `${val[0]}告警` : '告警概览';
    ChangeActiveTabKey(key);
  };

  const handleSelects = (v) => {
    setSelectionRow(v);
    setSelectdata(v);
  };

  // useEffect(() => {
  //   if (tabActivekey) {
  //     console.log('1')
  //     handleReset();
  //   }
  // }, [tabActivekey]);

  useEffect(() => {
    if (activeTabKey) {
      const key = activeTabKey === '告警概览' ? '' : activeTabKey.slice(0, -2);
      setFieldsValue({ Classify: key.split(',') });
      handleSearch(1, 10);
    }
  }, [activeTabKey]);

  useEffect(() => {
    if (tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
      handleReset()
    }
  }, [tabdate]);

  // useEffect(() => {
  //   if (reset && tabActivekey === 'today' && tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
  //     resetFields();
  //     handleSearch(1, 10);
  //   };
  // }, [reset]);

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

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  // const confirmmap = getTypebykey('1436602806952259586');       // 确认状态
  // const eliminatemap = getTypebykey('1436602917165985794');     // 消除状态
  const typemap = getTypebykey(899);          // 计量监控项

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch(1, 10)}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
  </>
  )

  return (
    <>
      <Card>
        <Form {...formItemLayout} onSubmit={handleSearch}>
          <Row gutter={24}>
            {/* <Col span={8}>
              <Form.Item label="确认状态">
                {getFieldDecorator('confirmStatus')(
                  <Select placeholder="请选择">
                    {confirmmap.map(({ dict_code, title }) => [
                      <Option key={dict_code} value={title}>
                        {title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="消除状态">
                {getFieldDecorator('clearStatus ')(
                  <Select placeholder="请选择">
                    {eliminatemap.map(({ dict_code, title }) => [
                      <Option key={dict_code} value={title}>
                        {title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item label="监控项/内容/子类" >
                {getFieldDecorator('Classify', {
                  initialValue: '',
                })(
                  <Cascader
                    fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                    options={typemap}
                    changeOnSelect
                    onChange={handleChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="告警内容">{
                getFieldDecorator('warnContent')(
                  <Input allowClear />
                )}</Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item label="告警时间">
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('beginWarnTime', {
                    initialValue: tabActivekey === 'today' ? moment().startOf('day') : '',
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      placeholder="开始时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                      disabled={tabActivekey === 'today'}
                    />
                  )}
                </div>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('endWarnTime', {
                    initialValue: tabActivekey === 'today' ? moment() : '',
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('23:59:59', 'HH:mm:ss'),
                      }}
                      placeholder="结束时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                      disabled={tabActivekey === 'today'}
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
            <Col span={8} style={{ paddingLeft: 48 }}><Form.Item>{extra}</Form.Item></Col>
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
          scroll={{ x: 1400 }}
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
  }))(MeasurList)
);
