import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Row, Col, Input, Select, DatePicker, Button, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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

const statumap = [];

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    with: 100,
  },
  {
    title: '发布来源',
    dataIndex: 'source',
    key: 'source',
    with: 150,
    sorter: (a, b) => a.source.localeCompare(b.source),
  },
  {
    title: '发布状态',
    dataIndex: 'status',
    key: 'status',
    with: 120,
    sorter: (a, b) => a.status.localeCompare(b.status),
  },
  {
    title: '问题类型',
    dataIndex: 'problemType',
    key: 'problemType',
  },
  {
    title: '功能菜单',
    dataIndex: 'testMenu',
    key: 'testMenu',
    with: 150,
  },
  {
    title: '预期效果',
    dataIndex: 'testResult',
    key: 'testResult',
    with: 150,
  },
  {
    title: '发布编号',
    dataIndex: 'releaseNo',
    key: 'releaseNo',
    with: 150,
  },
  {
    title: '出厂测试登记人',
    dataIndex: 'register',
    key: 'register',
    with: 150,
  },
  {
    title: '出厂测试登记时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    with: 150,
  },
  {
    title: '关联工单',
    dataIndex: 'sourceNo',
    key: 'sourceNo',
    with: 150,
  },
]

function ReleaseRepo(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch, location, loading, list,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [tabrecord, setTabRecord] = useState({});

  const searchrecord = { releaseNo: '', releaseStatus: '' };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;


  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'repolist/fetchlist',
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
      searchdata(values, paginations.current, paginations.pageSize);
    }
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, []);

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

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="发布来源">
                {getFieldDecorator('releaseNo', {
                  initialValue: cacheinfo.releaseNo,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布状态">
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
            <Col span={8}>
              <Form.Item label="发布类型">
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
            <Col span={8}>
              <Form.Item label="出厂测试登记人">
                {getFieldDecorator('releaseNo', {
                  initialValue: cacheinfo.releaseNo,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发送时间">
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
            <Col span={8}>
              <Form.Item label="关联工单编号">
                {getFieldDecorator('releaseNo', {
                  initialValue: cacheinfo.releaseNo,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" style={{ marginRight: 8 }}>出厂测试</Button >
          <Button type="danger" ghost style={{ marginRight: 8 }}>删 除</Button >
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={list.records}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.id}
          scroll={{ x: 1500 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ repolist, loading }) => ({
    list: repolist.list,
    loading: loading.models.repolist,
  }))(ReleaseRepo),
);