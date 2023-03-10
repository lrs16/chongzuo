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
    const key = activeTabKey === '??????' ? '' : activeTabKey;
    setActiveKey('??????');
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
    ChangeActiveTabKey('??????')
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
        confirmStatus: (key === '?????????' || key === '?????????') ? key : '',
        clearStatus: (key === '?????????' || key === '????????????' || key === '????????????') ? key : '',
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setPageinations({ current: 1, pageSize: 10 })
  };

  const handleChange = (val) => {
    const key = val || '??????';
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
      const key = activeTabKey === '??????' ? '' : activeTabKey;
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
        confirmStatus: (activeKey === '?????????' || activeKey === '?????????') ? activeKey : '',
        clearStatus: (activeKey === '?????????' || activeKey === '????????????' || activeKey === '????????????') ? activeKey : '',
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
      title: '????????????',
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
              menuDesc: '??????????????????',
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
      title: '??????',
      dataIndex: 'firstClassify',
      key: 'firstClassify',
      width: 120,
    },
    {
      title: '??????IP',
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
      title: '????????????',
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
      title: `${pagetitle === '??????????????????????????????' ? '????????????' : '????????????'}`,
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
      title: '????????????',
      dataIndex: 'confirmStatus',
      key: 'confirmStatus',
      width: 90,
      render: (text) => (
        <>
          <Badge status={text === '?????????' ? 'success' : 'error'} text="" />
          <span style={{ color: text === '?????????' ? '#87d068' : '#f50' }} >{text}</span>
        </>
      ),
    },
    {
      title: '????????????',
      dataIndex: 'clearStatus',
      key: 'clearStatus',
      width: 120,
      render: (text) => (
        <>
          <Badge status={text === '?????????' ? 'error' : 'default'} text="" />
          <span style={{ color: text === '?????????' ? '#f50' : '' }} >{text}</span>
        </>
      ),
    },
    {
      title: '????????????',
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
      title: '????????????',
      dataIndex: 'warnTime',
      key: 'warnTime',
      width: 180,
    },
    {
      title: '??????????????????',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      width: 180,
    },
    {
      title: '??????????????????',
      dataIndex: 'clearTime',
      key: 'clearTime',
      width: 180,
    },
  ];

  const softName = {
    title: '????????????',
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
    title: '????????????',
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
    if (pagetitle !== '??????????????????') {
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

  const hostinspectionmmap = getTypebykey(932);       // ??????????????????
  const softinspectionmmap = getTypebykey(965);      //  ??????????????????
  const hostmonitormap = getTypebykey(938);          //  ????????????

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch(1, 10)}>??? ???</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>??? ???</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>??? ??? <UpOutlined /></>) : (<>??? ??? <DownOutlined /></>)}
    </Button></>
  )

  return (
    <>

      <Card>
        <div className='noexplain'>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="??????">
                  {getFieldDecorator('firstClassify', {
                    initialValue: '',
                  })(
                    <Select placeholder="?????????" onChange={handleChange} allowClear>
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
                <Form.Item label="????????????">
                  {getFieldDecorator('thirdClassify')(
                    <Input allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="??????IP">
                  {getFieldDecorator('fourthClassify')(
                    <Input allowClear />,
                  )}
                </Form.Item>
              </Col>

              {expand === true && (
                <>
                  {(pagetitle === '??????????????????' || pagetitle === '??????????????????????????????') && (
                    <>
                      <Col span={8}>
                        <Form.Item label="????????????">
                          {getFieldDecorator('fifthClassify')(
                            <Input allowClear />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="????????????">
                          {getFieldDecorator('sixthClassify')(
                            <Input allowClear />,
                          )}
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {pagetitle === '??????????????????' && (
                    <Col span={8}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="?????????" allowClear>
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
                  {pagetitle === '??????????????????' && (
                    <Col span={8}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="?????????" allowClear>
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
                  {pagetitle === '??????????????????????????????' && (
                    <Col span={8}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('secondClassify')(
                          <Select placeholder="?????????">
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
                  <Form.Item label="????????????">
                    <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('time1', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          placeholder="????????????"
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
                          placeholder="????????????"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </div>
                  </Form.Item>
                </Col> */}
                  <Col span={8}>
                    <Form.Item label="??????????????????">
                      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                        {getFieldDecorator('beginConfirmTime', {
                          initialValue: '',
                        })(
                          <DatePicker
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            placeholder="????????????"
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
                            placeholder="????????????"
                            format='YYYY-MM-DD HH:mm:ss'
                            style={{ minWidth: 120, width: '100%' }}
                          />
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="??????????????????">
                      <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                        {getFieldDecorator('beginClearTime', {
                          initialValue: '',
                        })(
                          <DatePicker
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: moment('00:00:00', 'HH:mm:ss'),
                            }}
                            placeholder="????????????"
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
                            placeholder="????????????"
                            format='YYYY-MM-DD HH:mm:ss'
                            style={{ minWidth: 120, width: '100%' }}
                          />
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                </>
              )}
              {(pagetitle === '??????????????????' || (pagetitle !== '??????????????????' && !expand)) ? <Col span={24} style={{ textAlign: 'right' }}>{extra}</Col> : <Col span={8}><Form.Item>{extra}</Form.Item></Col>}
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
                  <span style={{ color: `${(name === '?????????' || name === '?????????') ? '#ff0000' : ''}` }}>???{total}???</span>
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
          scroll={{ x: pagetitle === '??????????????????' ? 1850 : 2000 }}
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
