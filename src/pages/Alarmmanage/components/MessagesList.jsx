import React, { useState, useEffect, useContext } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Card, Button, Table, Tabs, Row, Col, Form, Input, Select, Badge, Tooltip } from 'antd';
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

function MessagesList(props) {
  const { loading, dispatch, list, searchtab } = props;
  const { getFieldDecorator, resetFields, getFieldsValue } = props.form;
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);
  const [company, setCompany] = useState([]);
  const [searchdata, setSearchData] = useState({});
  const [activeKey, setActiveKey] = useState('');
  const { tabActivekey, selectdata, tabdate, warnModule, reset } = useContext(TypeContext);

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
    setActiveKey('全部');
    const values = getvalues();
    setSearchData({ ...values, pageIndex: paginations.current, pageSize: paginations.pageSize })
    dispatch({
      type: 'measuralarm/fetchsearchtab',
      payload: {
        ...values,
      },
    });
    dispatch({
      type: 'measuralarm/fetchlist',
      payload: {
        ...values,
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  const handleSelects = (v) => {
    setSelectionRow(v);
    setSelectdata(v);
  };

  const handleReset = () => {
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

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

  useEffect(() => {
    querkeyVal('system', 'company').then(res => {
      if (res.code === 200) {
        setCompany(res.data.company)
      }
    });
  }, []);

  useEffect(() => {
    if (tabActivekey) {
      handleReset();
    }
  }, [tabActivekey])

  useEffect(() => {
    if (tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
      handleReset();
    }
  }, [tabdate]);

  // useEffect(() => {
  //   if (reset && tabActivekey === 'today' && tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime)) {
  //     resetFields();
  //     handleSearch(1, 10);
  //   };
  // }, [reset]);

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
      title: '监测类型',
      dataIndex: 'secondClassify',
      key: 'secondClassify',
      width: 120,
    },
    {
      title: '单位',
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
      title: '终端资产编号',
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
      title: '终端地址',
      dataIndex: 'fourthClassify',
      key: 'fourthClassify',
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


  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const monitormap = getTypebykey(950);       // 上下行报文监测

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
    </Button>
  </>
  )

  return (
    <Card style={{ marginTop: 24 }}>
      <Form {...formItemLayout} onSubmit={handleSearch}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="监测类型">
              {getFieldDecorator('secondClassify')(
                <Select placeholder="请选择">
                  {monitormap.map(({ dict_code, title }) => [
                    <Option key={dict_code} value={title}>
                      {title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单位">
              {getFieldDecorator('firstClassify')(
                <Select placeholder="请选择">
                  {company.map(({ key, val }) => [
                    <Option key={key} value={val}>
                      {val}
                    </Option>,
                  ])}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="终端资产编号">
              {getFieldDecorator('thirdClassify')(
                <Input allowClear />
              )}
            </Form.Item>
          </Col>
          {expand && (
            <>
              <Col span={8}>
                <Form.Item label="终端地址">
                  {getFieldDecorator('fourthClassify')(
                    <Input allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="告警内容">{getFieldDecorator('warnContent')(<Input allowClear />)}</Form.Item>
              </Col>
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

          <Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>
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
        scroll={{ x: 2000 }}
        pagination={pagination}
      />
    </Card>
  );
}

export default Form.create({})(
  connect(({ measuralarm, loading }) => ({
    list: measuralarm.list,
    searchtab: measuralarm.searchtab,
    loading: loading.models.measuralarm,
    updataloading: loading.effects['measuralarm/alarmsconfig'],
  }))(MessagesList)
);
