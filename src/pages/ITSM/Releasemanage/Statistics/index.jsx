import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, DatePicker, Select, Button, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import { querkeyVal } from '@/services/api';

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

function Statistics(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    form: { getFieldDecorator, resetFields, getFieldsValue }, loading,
    successratelist, tasksumlist,
  } = props;
  const [tabActivekey, settabActivekey] = useState('successrate'); // 打开标签
  const [selectdata, setSelectData] = useState('');
  const [tabColumns, setColumns] = useState('');

  const handleSearch = () => {
    const values = getFieldsValue();
    const val = {
      ...values,
      beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      pageIndex: 1,
      pageSize: 100,
    }
    if (tabActivekey === 'successrate') {
      dispatch({
        type: 'releasestatistics/fetchsuccessrate',
        payload: {
          ...val
        },
      });
    };
    if (tabActivekey === 'process') {
      dispatch({
        type: 'releasestatistics/fetchtasksum',
        payload: {
          ...val
        },
      });
    }
  };

  const handleReset = () => {
    resetFields();
    handleSearch();
  }

  useEffect(() => {
    querkeyVal('release', 'successrate').then(res => {
      if (res.code === 200) {
        setColumns(res.data.successrate)
      }
    });
  }, []);

  useEffect(() => {
    handleSearch()
  }, [tabActivekey]);

  const handleTabChange = key => {
    settabActivekey(key);
    resetFields();
  };
  const tabList = [
    {
      key: 'successrate',
      tab: '发布成功率统计',
    },
    {
      key: 'process',
      tab: '发布环节统计',
    },
  ];

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位


  // 发布成功率表头
  const tableColumns = (tablecolumns) => {
    const newArr = [];
    if (!Array.isArray(tablecolumns)) {
      return newArr;
    }
    for (let i = 0; i < tablecolumns.length; i += 1) {
      const vote = {};
      vote.title = tablecolumns[i].val;
      vote.dataIndex = tablecolumns[i].key;
      vote.key = tablecolumns[i].key;
      vote.width = 150;
      vote.align = 'center';
      newArr.push(vote);
    };
    return newArr;
  };

  // 发布环节统计表头
  const columns = [
    {
      title: '环节名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 300
    },
    {
      title: '工单数',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => {
        const handleClick = () => {
          const values = getFieldsValue();
          const val = {
            ...values,
            beginTime: values.beginTime ? moment(values.beginTime).format('X') : '',
            endTime: values.endTime ? moment(values.endTime).format('X') : '',
            releaseStatus: record.taskName === '合计' ? '' : record.taskName,
            paginations: { current: 1, pageSize: 15 },
            expand: true
          }
          router.push({
            pathname: `/ITSM/releasemanage/query`,
            query: { pathpush: true },
            state: { cach: false, cacheinfo: val }
          });
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
    },
  ]

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Form {...formItemLayout}>
          <Row>
            <Col span={8}>
              <Form.Item label="出厂测试登记时间">
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('beginTime', {
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
                  {getFieldDecorator('endTime', {
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
            {tabActivekey === 'process' && (
              <Col span={6}>
                <Form.Item label="发布类型">
                  {getFieldDecorator('releaseType', {
                    initialValue: '',
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
            )}
            <Col span={tabActivekey === 'process' ? 6 : 8}>
              <Form.Item label="责任单位">
                {getFieldDecorator('dutyUnit', {
                  initialValue: '',
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
            <Col span={tabActivekey === 'process' ? 4 : 8} style={{ padding: '4px 0 0 48px' }}>
              <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
            </Col>
          </Row>
        </Form>
        {tabActivekey === 'successrate' && (<Table
          loading={loading}
          columns={tabColumns && tabColumns.length > 0 ? tableColumns(tabColumns) : []}
          dataSource={successratelist || []}
          rowKey={(_, index) => index.toString()}
          pagination={false}
          scroll={{ x: 1500 }}
        />)}
        {tabActivekey === 'process' && (<Table
          loading={loading}
          columns={columns}
          dataSource={tasksumlist || []}
          rowKey={(_, index) => index.toString()}
          pagination={false}
          scroll={{ x: 1500 }}
        />)}
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasestatistics, loading }) => ({
    successratelist: releasestatistics.successrate,
    tasksumlist: releasestatistics.tasksum,
    loading: loading.models.releasestatistics,
  }))(Statistics),
);