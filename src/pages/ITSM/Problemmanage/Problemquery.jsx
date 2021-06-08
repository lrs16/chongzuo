import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Form, Card, Input, Button, Row, Col, Table, Select, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = [
  {
    title: '问题编号',
    dataIndex: 'no',
    key: 'no',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/problemmanage/problemquery/detail`,
          query: {
            id: record.id,
            taskName: record.statuscn,
            No: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '问题来源',
    dataIndex: 'sourcecn',
    key: 'sourcecn',
  },
  {
    title: '问题分类',
    dataIndex: 'typecn',
    key: 'typecn',
  },
  {
    title: '当前处理环节',
    dataIndex: 'currentNode',
    key: 'currentNode',
  },
  {
    title: '工单状态',
    dataIndex: 'statuscn',
    key: 'statuscn',
  },
  {
    title: '影响范围',
    dataIndex: 'registerScopecn',
    key: 'registerScopecn',
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
  },
  {
    title: '处理单位',
    dataIndex: 'handleUnit',
    key: 'handleUnit',
  },
  {
    title: '发送时间',
    dataIndex: 'addTime',
    key: 'addTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
    }
  },
  {
    title: '重要程度',
    dataIndex: 'importancecn',
    key: 'importancecn',
  },
];


const queryParams = true;
function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    location: { query:
      {
        progressStatus,
        type,
        handleDeptId,
        timeStatus,
        // timeStatuscontent,
        handlerId,
        checkUserId,
        checkDeptId,
        addTimeBegin,
        addTimeEnd,
        status,
        currentNode,
        problem
      } },
    dispatch,
    queryArr,
    operationPersonArr,
    location,
    loading,
  } = props;
  let differentTitle;
  const [expand, setExpand] = useState(false);
  const [tabrecord, setTabRecord] = useState({});
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectdata, setSelectData] = useState('');
  let operationPersonSelect;

  if (problem) {
    differentTitle = '问题统计查询'
  } else {
    differentTitle = '问题查询'
  }

  const getinitiaQuery = () => {
    // console.log(1)
    validateFields((err, values) => {
      const newvalues = {
        ...values,
        addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        createTime: values.createTime?.length ? [moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      }
      dispatch({
        type: 'problemmanage/queryList',
        payload: {
          ...newvalues
        },
      });
      setTabRecord({ ...newvalues });
    })
  }



  // const aaa = 002;
  // 设置初始值
  const record = {
    no: '',
    currentNode,
    title: '',
    confirmUser: '',
    source: '',
    type,
    registerScope: '',
    handler: '',
    handleUnit: '',
    registerUser: '',
    importance: '',
    handlerId,
    handleDeptId,
    progressStatus,
    timeStatus,
    // timeStatuscontent,
    checkUserId,
    checkDeptId,
    status,
    createTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
    paginations,
  };

  let cacheinfo = {};
  if (location && location.state) {
    cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;
  }



  const handleReset = () => {
    resetFields();
    // queryParams = false;
  };



  const searchdata = (values, page, pageSize, search) => {
    // if (queryParams) {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        ...values,
        addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : addTimeBegin,
        addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : addTimeEnd,
        createTime: '',
        pageNum: page,
        pageSize: paginations.pageSize
      },
    });
    const newvalues = {
      ...values,
      addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : addTimeBegin,
      addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : addTimeEnd,
      createTime: values.createTime?.length ? [moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
      pageNum: paginations.current,
      pageSize: paginations.pageSize,
    }
    setTabRecord({ ...newvalues });
  };



  // useEffect(() => {
  //   // console.log(5)
  //   getinitiaQuery();
  // }, [location])


  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPageinations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = (page) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPageinations({
      ...paginations,
      current: page,
    });
  };


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryArr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };


  const handleSearch = (search) => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = values;
      if (values.createTimeBegin) {
        obj.createTimeBegin = (values.createTimeBegin).format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, 1, paginations.pageSize, search);
    });

  };

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/eventdownload',
          payload: {
            ...values,
            addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : addTimeBegin,
            addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : addTimeEnd,
            createTime: '',
          }
        }).then(res => {
          const filename = `问题查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const problemSource = getTypebyTitle('问题来源');
  const priority = getTypebyTitle('严重程度');
  const currentNodeselect = getTypebyTitle('当前处理环节');
  const problemType = getTypebyTitle('问题分类');
  const scopeList = getTypebyTitle('影响范围');
  const timeoutList = getTypebyTitle('超时状态');


  // 设置时间
  useEffect(() => {
    if (location && location.state && location.state.cacheinfo) {
      const cachestartTime = location.state.cacheinfo.addTimeBegin;
      const cacheendTime = location.state.cacheinfo.addTimeEnd;
      setFieldsValue({
        createTime: cachestartTime ? [moment(cachestartTime), moment(cacheendTime)] : '',
      })
    } else {
      setFieldsValue({
        createTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
      })
    }
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
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset()
      };
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { createTime } = location.state.cacheinfo;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
        setFieldsValue({
          createTime: createTime ? [moment(createTime[0]), moment(createTime[1])] : '',
        })
      };
    }
  }, [location.state]);


  useEffect(() => {
    if (cacheinfo !== undefined) {
      validateFields((err, values) => searchdata(values, paginations.current, paginations.pageSize))
    }
  }, []);

  return (
    <PageHeaderWrapper title={differentTitle}>
      <SysDict
        typeid="1354287742015508481"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>

            <>
              <Col span={8}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('no', {
                    initialValue: cacheinfo.no,
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="问题分类">
                  {getFieldDecorator('type', {
                    initialValue: cacheinfo.type,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {problemType.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="发送时间">
                  {getFieldDecorator('createTime', {
                    initialValue: ''
                  })(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('currentNode',
                    {
                      initialValue: cacheinfo.currentNode,
                    }
                  )(
                    <Select placeholder="请选择" allowClear>
                      {currentNodeselect.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="超时处理">
                  {getFieldDecorator('timeStatus',
                    {
                      initialValue: cacheinfo.timeStatus,
                    }
                  )(
                    <Select placeholder="请选择" allowClear>
                      {timeoutList.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>


              <Col span={8}>
                <Form.Item label="问题编号" style={{ display: 'none' }}>
                  {getFieldDecorator('handleDeptId', {
                    initialValue: cacheinfo.handleDeptId,
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('handlerId', {
                    initialValue: cacheinfo.handlerId,
                    rules: [
                      {
                        message: '请输入问题编号',
                      },
                    ],
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('progressStatus', {
                    initialValue: cacheinfo.progressStatus,
                    rules: [
                      {
                        message: '请输入问题编号',
                      },
                    ],
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('checkUserId', {
                    initialValue: cacheinfo.checkUserId,
                    rules: [
                      {
                        message: '请输入问题编号',
                      },
                    ],
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('checkDeptId', {
                    initialValue: cacheinfo.checkDeptId,
                    rules: [
                      {
                        message: '请输入问题编号',
                      },
                    ],
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>

            </>

            <>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="问题标题">
                  {getFieldDecorator('title', {
                    initialValue: cacheinfo.title,
                  })(<Input placeholder='请输入' allowClear />)}
                </Form.Item>
              </Col>
            </>

            <>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="问题来源">
                  {getFieldDecorator(
                    'source',
                    {
                      initialValue: cacheinfo.source,
                    },
                  )(
                    <Select placeholder="请选择" allowClear>
                      {problemSource.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="影响范围">{getFieldDecorator('registerScope', {
                  initialValue: cacheinfo.registerScope,
                })
                  (
                    <Select placeholder="请选择" allowClear>
                      {scopeList.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}</Form.Item>
              </Col>


              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="超时处理">
                  {getFieldDecorator('timeStatus',
                    {
                      initialValue: cacheinfo.timeStatus,
                    }
                  )(
                    <Select placeholder="请选择" allowClear>
                      {timeoutList.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理人" >
                  {getFieldDecorator(
                    'handler',
                    {
                      initialValue: cacheinfo.handler,
                    },
                  )(
                    <Input placeholder='请输入' allowClear />
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理单位">
                  {getFieldDecorator(
                    'handleUnit',
                    {
                      initialValue: cacheinfo.handleUnit,
                    },
                  )(
                    <Input placeholder='请输入' allowClear />
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="发送人">
                  {getFieldDecorator(
                    'registerUser',
                    {
                      initialValue: cacheinfo.registerUser,
                    },
                  )(
                    <Input placeholder='请输入' allowClear />
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label='重要程度'>
                  {getFieldDecorator(
                    'importance',
                    {
                      initialValue: cacheinfo.importance
                    },
                  )(
                    <Select placeholder="请选择" allowClear>
                      {priority.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            {expand === false && (
              <Col span={8}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查询
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
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
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
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
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => download()}
          >导出数据</Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={queryArr.rows}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, problemstatistics, processmodel, loading }) => ({
    queryArr: problemmanage.queryArr,
    operationPersonArr: processmodel.operationPersonArr,
    statusdetailList: problemstatistics.statusdetailList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
