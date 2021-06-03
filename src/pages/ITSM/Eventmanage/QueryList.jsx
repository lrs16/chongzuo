import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
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
  // Badge,
  // Tag,
  Cascader,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SysDict from '@/components/SysDict';

const { Option } = Select;
const { RangePicker } = DatePicker;
const noStatistic = '';

const queryParams = true;

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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};
const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const columns = [
  {
    title: '事件编号',
    dataIndex: 'eventNo',
    key: 'eventNo',
    width: 150,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/query/details`,
          query: {
            pangekey: record.eventStatus,
            id: record.taskId,
            mainId: record.id,
            No: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
    width: 200,
  },
  {
    title: '建单时间',
    dataIndex: 'addTime',
    key: 'addTime',
    fixed: 'left',
    width: 200,
  },
  {
    title: '工单状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人单位',
    dataIndex: 'applicationUnit',
    key: 'applicationUnit',
    width: 300,
  },
  {
    title: '申报人部门',
    dataIndex: 'applicationDept',
    key: 'applicationDept',
    width: 300,
  },
  {
    title: '事件分类',
    dataIndex: 'eventType',
    key: 'eventType',
    width: 120,
  },
  {
    title: '事件对象',
    dataIndex: 'eventObject',
    key: 'eventObject',
    width: 120,
  },
  // {
  //   title: '标签',
  //   dataIndex: 'eventobject',
  //   key: 'eventobject',
  //   width: 150,
  //   render: (text, record) => {
  //     const tags = ['标签1', '标签2', '标签3'];
  //     return (
  //       <>
  //         {tags.map(obj => (
  //           <Tag color="#108ee9" style={{ margin: 2 }}>
  //             {obj}
  //           </Tag>
  //         ))}
  //       </>
  //     );
  //   },
  // },
  {
    title: '回访方式',
    dataIndex: 'revisitWay',
    key: 'revisitWay',
    width: 120,
  },
  {
    title: '事件来源',
    dataIndex: 'eventSource',
    key: 'eventSource',
    width: 150,
  },
  {
    title: '影响度',
    dataIndex: 'eventEffect',
    key: 'eventEffect',
    width: 80,
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
    width: 80,
  },
  {
    title: '紧急度',
    dataIndex: 'eventEmergent',
    key: 'eventEmergent',
    width: 80,
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'register_user',
    width: 80,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
    width: 200,
  },
];

function QueryList(props) {
  // const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      validateFields,
      setFieldsValue,
      getFieldsValue,
    },
    location: { query: {
      time1,
      time2,
      eventObject,
      selfhandle,
      registerUser,
      eventStatus,
      applicationUnit
    } },
    loading,
    list,
    location,
    dispatch,
  } = props;
  let title;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tabrecord, setTabRecord] = useState({});

  if (time1) {
    title = '事件统计查询'
  } else {
    title = '事件查询'
  }

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'eventquery/fetchlist',
      payload: {
        ...values,
        eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : '',
        pageSize: size,
        pageIndex: page,
        time1: values.createTime ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        time2: values.createTime ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
        createTime: '',
      },
    });
    setTabRecord({
      ...values,
      startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
      createTime: '',
    });
  };

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventquery/eventdownload',
          payload: {
            values: {
              ...values,
              time1: values.createTime ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
              time2: values.createTime ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
              createTime: '',
              eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : '',
            },
            ids: selectedRowKeys.toString(),
          },
        }).then(res => {
          const filename = `事件查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page - 1, paginations.pageSize);
      }
    });
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

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (params) => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, 0, paginations.pageSize, params);
    });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    validateFields((err, values) => {
      searchdata(values, 0, 15)
    });
    setPageinations({ current: 1, pageSize: 15 });
  };

  const displayRender = label => {
    return label[label.length - 1];
  };

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const sourcemap = getTypebykey('486844540120989696'); // 事件来源
  const statusmap = getTypebykey('1356421038388285441'); // 工单状态
  const typemap = getTypebykey('486844495669755904'); // 事件分类
  const objectmap = getTypebykey('482599461999083520'); // 事件对象
  const returnvisit = getTypebykey('486852783895478272'); // 回访方式
  const effectmap = getTypebykey('482610561507393536'); // 影响度
  const emergentmap = getTypebykey('482610561503199232'); // 紧急度
  const priormap = getTypebykey('482610561499004928'); // 优先级
  const checkresultmap = getTypebykey('1356439651098824706'); // 审核结果
  const yesornomap = getTypebykey('1356502855556534273'); // 是否
  const handleresultmap = getTypebykey('486846455059841024'); // 处理结果
  const satisfactionmap = getTypebykey('486855005945462784'); // 满意度

  const startTime = time1 ? moment(time1).format('YYYY-MM-DD 00:00:00') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const endTime = time2 ? moment(time2).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD HH:mm:ss');
  const record = {
    eventObject: eventObject || '',
    revisitWay: '',
    eventSource: '',
    eventEffect: '',
    eventEmergent: '',
    eventPrior: '',
    selfhandle: selfhandle || '',
    applicationUnit: applicationUnit || '',
    applicationDept: '',
    registerUser: registerUser || '',
    eventNo: '',
    eventStatus: eventStatus || '',
    eventType: '',
    createTime: [moment(startTime), moment(endTime)],
    paginations
  }
  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  // 设置时间
  useEffect(() => {
    if (location.state.cacheinfo) {
      const cachestartTime = location.state.cacheinfo.startTime;
      const cacheendTime = location.state.cacheinfo.endTime;
      setFieldsValue({
        createTime: cachestartTime ? [moment(cachestartTime), moment(cacheendTime)] : '',
      })
    } else {
      setFieldsValue({
        createTime: [moment(startTime), moment(endTime)],
      })
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, cacheinfo.paginations.current - 1, cacheinfo.paginations.pageSize)
      }
    });
  }, [location.state]);

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
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset()
      };
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
      };
    }
  }, [location.state]);

  return (
    <PageHeaderWrapper title={title}>
      <SysDict
        typeid="1354273739344187393"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <>
              <Col span={8}>
                <Form.Item label="事件编号">
                  {getFieldDecorator('eventNo', {
                    initialValue: cacheinfo.eventNo,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="工单状态">
                  {getFieldDecorator('eventStatus', {
                    initialValue: cacheinfo.eventStatus,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {statusmap.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件对象">
                  {getFieldDecorator('eventObject', {
                    initialValue: cacheinfo.eventObject,
                  })(
                    <Cascader
                      fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                      options={objectmap}
                      placeholder="请选择"
                      expandTrigger="hover"
                      displayRender={displayRender}
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件分类">
                  {getFieldDecorator('eventType', {
                    initialValue: cacheinfo.eventType,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {typemap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="回访方式">
                    {getFieldDecorator('revisitWay', {
                      initialValue: cacheinfo.revisitWay,
                    })(
                      <Select placeholder="请选择"
                        allowClear
                      >
                        {returnvisit.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件来源">
                    {getFieldDecorator('eventSource', {
                      initialValue: cacheinfo.eventSource,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {sourcemap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="影响度">
                    {getFieldDecorator('eventEffect', {
                      initialValue: cacheinfo.eventEffect,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {effectmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="紧急度">
                    {getFieldDecorator('eventEmergent', {
                      initialValue: cacheinfo.eventEmergent,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {emergentmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('eventPrior', {
                      initialValue: cacheinfo.eventPrior,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {priormap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="自行处理">
                    {getFieldDecorator('selfhandle', {
                      initialValue: cacheinfo.selfhandle,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {yesornomap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否补单">
                    {getFieldDecorator('supplement', {
                      initialValue: cacheinfo.supplement,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {yesornomap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('checkResult', {
                      initialValue: cacheinfo.checkResult,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {checkresultmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理结果">
                    {getFieldDecorator('eventResult', {
                      initialValue: cacheinfo.eventResult,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {handleresultmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="满意度">
                    {getFieldDecorator('satisfaction', {
                      initialValue: cacheinfo.satisfaction,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {satisfactionmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: cacheinfo.eventTitle,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ clear: 'both' }}>
                  <Form.Item label="申报人">
                    {getFieldDecorator('applicationUser', {
                      initialValue: cacheinfo.applicationUser,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}

            <Col span={8}>
              <Form.Item label="申报人单位">
                {getFieldDecorator('applicationUnit', {
                  initialValue: cacheinfo.applicationUnit,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {expand && (
              <Col span={8}>
                <Form.Item label="申报人部门">
                  {getFieldDecorator('applicationDept', {
                    initialValue: cacheinfo.applicationDept,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item label="登记人">
                {getFieldDecorator('registerUser', {
                  initialValue: cacheinfo.registerUser,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registerUnit', {
                      initialValue: cacheinfo.registerUnit,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人部门">
                    {getFieldDecorator('registerDept', {
                      iinitialValue: cacheinfo.registerDept,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                      initialValue: cacheinfo.checkUser,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人单位">
                    {getFieldDecorator('checkUnit', {
                      iinitialValue: cacheinfo.checkUnit,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人部门">
                    {getFieldDecorator('checkDept', {
                      initialValue: cacheinfo.checkDept,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator('handler', {
                      initialValue: cacheinfo.handler,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人单位">
                    {getFieldDecorator('handleUnit', {
                      initialValue: cacheinfo.handleUnit,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人部门">
                    {getFieldDecorator('handleDept', {
                      iinitialValue: cacheinfo.handleDept,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人">
                    {getFieldDecorator('revisitor', {
                      initialValue: cacheinfo.revisitor,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人单位">
                    {getFieldDecorator('revisitUnit', {
                      initialValue: cacheinfo.revisitUnit,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人部门">
                    {getFieldDecorator('revisitDept', {
                      initialValue: cacheinfo.revisitDept,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={24}>
              <Form.Item label="建单时间" {...forminladeLayout}>
                {getFieldDecorator('createTime', {
                  initialValue: '',
                })(<RangePicker
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
                  allowClear
                />)}
              </Form.Item>
            </Col>


            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={() => handleSearch('search')}>
                查 询
                </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>
                重 置
                </Button>
              <Button
                style={{ marginLeft: 8 }}
                type="link"
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? (
                  <>
                    关 闭 <UpOutlined />
                  </>
                ) : (
                  <>
                    展 开 <DownOutlined />
                  </>
                )}
              </Button>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          scroll={{ x: 1800 }}
          // rowKey={r => r.id}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ eventquery, loading }) => ({
    list: eventquery.list,
    loading: loading.models.eventquery,
  }))(QueryList),
);
