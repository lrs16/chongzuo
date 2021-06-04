import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Icon,
  Table,
  Popconfirm,
  // message,
  Cascader,
  // Badge
} from 'antd';
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

const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

const { Option } = Select;
const { RangePicker } = DatePicker;


function QueryList(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue, getFieldsValue },
    location: { query:
      {
        dictCode,
        type,
        status,
        addTimeBegin,
        addTimeEnd,
        currentNode,
        statName,
      },
    },
    loading,
    location,
    faultQueryList, // 查询列表数据
    dispatch,
  } = props;
  let titleParams;

  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 }); // 分页state
  // const [selectedRow, setSelectedRow] = useState([]);
  const [selectdata, setSelectData] = useState([]);
  const [tabrecord, setTabRecord] = useState({});

  const handledownFileToZip = (id, no) => {
    dispatch({
      type: 'fault/downloadzip',
      payload: {
        id,
      },
    }).then(res => {
      const filename = `${no}_附件.zip`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '故障编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: `/ITSM/faultmanage/querylist/record`,
            query: {
              id: record.id,
              No: text,
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '工单状态',
      dataIndex: 'statuscn',
      key: 'statuscn',
      width: 120,
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
      width: 120,
    },
    {
      title: '故障来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
    },
    {
      title: '系统模块',
      dataIndex: 'registerModel',
      key: 'registerModel',
      width: 150,
    },
    {
      title: '故障类型',
      dataIndex: 'typecn',
      key: 'typecn',
      width: 200,
    },
    {
      title: '故障名称',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: '故障责任方',
      dataIndex: 'blame',
      key: 'blame',
      width: 120,
    },
    {
      title: '严重程度',
      dataIndex: 'registerLevel',
      key: 'registerLevel',
      width: 120,
    },
    {
      title: '发送时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
    },
    // {
    //   title: '登记时间',
    //   dataIndex: 'registerTime',
    //   key: 'registerTime',
    //   width: 200,
    // },
    // {
    //   title: '处理时间',
    //   dataIndex: 'handleStartTime',
    //   key: 'handleStartTime',
    //   width: 200,
    // },
    // {
    //   title: '处理结束时间',
    //   dataIndex: 'handleEndTime',
    //   key: 'handleEndTime',
    //   width: 200,
    // },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <a type="link" onClick={() => handledownFileToZip(record.id, record.no)}>
            附件下载
          </a>)
      },
    },
  ];

  if (status || type) {
    titleParams = '故障统计查询'
  } else {
    titleParams = '故障查询'
  }

  const getinitiaQuerylists = (values, page) => {
    // 列表 列表接口
    dispatch({
      type: 'fault/getfaultQueryList',
      payload: {
        ...values,
        registerTimeBegin: values.registerTime?.length ? moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerTimeEnd: values.registerTime?.length ? moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerTime: '',
        handleStartTimeBegin: values.handleTime?.length ? moment(values.handleTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleStartTimeEnd: values.handleTime?.length ? moment(values.handleTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleTime: '',
        registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
        type: values.type ? (values.type).slice(-1)[0] : '',
        addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        createTime: '',
        pageNum: page,
        pageSize: paginations.pageSize,
      },
    });
    setTabRecord({
      ...values,
      sendTime: '',
      registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      registerTimeBegin: values.registerTimeBegin ? values.registerTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      handleStartTimeBegin: values.handleStartTimeBegin ? values.handleStartTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      handleStartTimeEnd: values.handleStartTimeEnd ? values.handleStartTimeEnd.format('YYYY-MM-DD HH:mm:ss') : '',
      createTime: values.createTime?.length ? [moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
      registerTime: values.registerTime?.length ? [moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
    })
  };

  const getFaultlist = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'fault/getfaultQueryList',
        payload: {
          ...values,
          type: values.type ? (values.type).slice(-1)[0] : '',
          pageNum: 1,
          pageSize: paginations.pageSize,
          addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        },
      });
    });
  }

  useEffect(() => {
    if (type) {
      setFieldsValue({
        type: [type.substr(0, 3), type]
      })
    }

    if (status || currentNode) {
      setFieldsValue({
        status,
        currentNode
      })
    }


    if (addTimeBegin) {
      setFieldsValue({
        createTime: [moment(addTimeBegin), moment(addTimeEnd)] || '',
      })
    }
    //  getFaultlist();
  }, []);

  const searchdata = (values, page, pageSize) => {
    console.log('values: ', values);
    dispatch({
      type: 'fault/getfaultQueryList',
      payload: {
        ...values,
        registerTimeBegin: values.registerTime?.length ? moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerTimeEnd: values.registerTime?.length ? moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerTime: '',
        handleStartTimeBegin: values.handleTime?.length ? moment(values.handleTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleStartTimeEnd: values.handleTime?.length ? moment(values.handleTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleTime: '',
        registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
        type: values.type ? (values.type).slice(-1)[0] : '',
        addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        createTime: values.createTime?.length ? [moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
        pageNum: page,
        pageSize: paginations.pageSize,
      },
    });
    setTabRecord({
      ...values,
      sendTime: '',
      registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      // registerTimeBegin: values.registerTimeBegin ? values.registerTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      handleStartTimeBegin: values.handleStartTimeBegin ? values.handleStartTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      handleStartTimeEnd: values.handleStartTimeEnd ? values.handleStartTimeEnd.format('YYYY-MM-DD HH:mm:ss') : '',
      createTime: values.createTime?.length ? [moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
      registerTime: values.registerTime?.length ? [moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
      handleTime: values.handleTime?.length ? [moment(values.handleTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.handleTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
    })
  };


  const handleSearch = search => {
    setPageinations({
      ...paginations,
      current: 1,
    });

    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, 1, paginations.pageSize, search);
    });
  };

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

  const changePage = page => {
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
    total: faultQueryList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };


  //  下载 /导出功能
  const download = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            ...values,
            // createTimeBegin: values.sendTime?.length ? moment(values.sendTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            // createTimeEnd: values.sendTime?.length ? moment(values.sendTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            sendTime: '',
            registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            registerTimeBegin: values.registerTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            handleStartTimeBegin: values.handleStartTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            handleStartTimeEnd: values.handleStartTimeEnd ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            type: values.type ? (values.type).slice(-1)[0] : '',
            addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            createTime: '',
            pageSize,
            current: page,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
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

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const faultSource = getTypebyTitle('故障来源');
  const priority = getTypebyTitle('严重程度');
  const handleResult = getTypebyTitle('故障处理结果');
  const sysmodular = getTypebyTitle('故障系统模块');
  const faultType = getTypebyTitle('故障分类');
  const currentNodeselect = getTypebyTitle('当前处理环节');
  const effect = getTypebyTitle('影响范围');
  const workStatues = getTypebyTitle('工单状态');

  const faultTypes = type === undefined ? [] : [type.substr(0, 3), type];
  // 设置初始值
  const record = {
    checkUnit: '',
    checkUser: '',
    confirmUnit: '',
    createTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
    confirmUser: '',
    currentNode,
    finishUnit: '',
    finishUser: '',
    handleResult: '',
    handleStartTimeBegin: '',
    handleStartTimeEnd: '',
    handleUnit: '',
    handler: '',
    no: '',
    registerAddress: '',
    registerLevel: '',
    registerModel: '',
    registerOccurTimeBegin: '',
    registerScope: '',
    registerTimeBegin: '',
    registerTime: '',
    handleResult:'',
    registerUnit: '',
    registerUser: '',
    source: '',
    status,
    title: '',
    type: faultTypes,
    paginations,
  };


  let cacheinfo = {};
  if (location && location.state) {
    console.log(location.state.cacheinfo)
    cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;
  }


  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    validateFields((err, values) => {
      searchdata(values, 1, 15)
    });
    setPageinations({ current: 1, pageSize: 15 });
  };


  // 设置时间
  useEffect(() => {
    if (location.state.cacheinfo) {
      console.log(location.state.cacheinfo, 'location.state.cacheinfo')
      const cachestartTime = location.state.cacheinfo.addTimeBegin;
      const cacheendTime = location.state.cacheinfo.addTimeEnd;
      const { createTime } = location.state.cacheinfo;
      const { registerTime } = location.state.cacheinfo;
      const { handleTime } = location.state.cacheinfo;
      // const registerStarttime = location.state.cacheinfo.registerTime[0];
      // const registerEndtime = location.state.cacheinfo.registerTime[1];
      setFieldsValue({
        createTime: createTime?.length ? [moment(createTime[0]), moment(createTime[1])] : '',
        registerTime: registerTime?.length ? [moment(registerTime[0]), moment(registerTime[1])] : '',
        handleTime: handleTime?.length ? [moment(handleTime[0]), moment(handleTime[1])] : '',
      })
    } else {
      setFieldsValue({
        createTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
      })
    }
  }, [location.state]);


  // 获取数据
  useEffect(() => {
    validateFields((err, values) => searchdata(values, paginations.current, paginations.pageSize),)
  }, [location.state])

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        console.log(expand)
        console.log(tabrecord, 'tabrecord')
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
        const { createTime } = location.state.cacheinfo;
        const { registerTime } = location.state.cacheinfo;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
        setFieldsValue({
          createTime: createTime ? [moment(createTime[0]), moment(createTime[1])] : '',
          registerTime: registerTime?.length ? [moment(registerTime[0]), moment(registerTime[1])] : '',
        })
      };
    }
  }, [location.state]);




  return (
    <PageHeaderWrapper title={titleParams}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <>
              {/* {(status || type || currentNode) && ( */}
              <>
                <Col span={8}>
                  <Form.Item label="故障编号">
                    {getFieldDecorator('no', {
                      initialValue: cacheinfo.no,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="当前处理环节">
                    {getFieldDecorator('currentNode', {
                      initialValue: cacheinfo.currentNode,
                    },
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
                  <Form.Item label="工单状态">
                    {getFieldDecorator('status', {
                      initialValue: cacheinfo.status,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {workStatues.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type,
                    })(
                      <Cascader
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                        allowClear
                      />,
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
              </>
              {/* // )} */}
            </>

            <>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="登记时间">
                  {getFieldDecorator('registerTime', {
                    initialValue: '',
                  },
                  )(
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                      allowClear
                    />)}
                </Form.Item>
              </Col>

              {/* <Col xl={8} xs={12}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator(
                      'registerOccurTimeBegin', {
                      initialValue: cacheinfo.registerOccurTimeBegin,
                    },
                    )(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} allowClear />)}
                  </Form.Item>
                </Col> */}

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="故障来源">
                  {getFieldDecorator('source', {
                    initialValue: cacheinfo.source,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {faultSource.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              {/* <Col xl={8} xs={12}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type,
                    })(
                      <Cascader
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col> */}

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('currentNode', {
                    initialValue: cacheinfo.currentNode,
                  },
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
                <Form.Item label="工单状态" style={{ display: expand ? 'block' : 'none' }}>
                  {getFieldDecorator('status', {
                    initialValue: cacheinfo.status,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {workStatues.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="系统模块">
                  {getFieldDecorator('registerModel', {
                    initialValue: cacheinfo.registerModel,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {sysmodular.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="故障名称">
                  {getFieldDecorator('title', {
                    initialValue: cacheinfo.title,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="故障地点">
                  {getFieldDecorator('registerAddress', {
                    initialValue: cacheinfo.registerAddress,
                  })(
                    <Input placeholder="请输入" allowClear />,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="严重程度">
                  {getFieldDecorator('registerLevel', {
                    initialValue: cacheinfo.registerLevel,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {priority.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="影响范围">
                  {getFieldDecorator('registerScope', {
                    initialValue: cacheinfo.registerScope,
                  },
                  )(
                    <Select placeholder="请选择" allowClear>
                      {effect.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                  <Form.Item label="处理时间">
                    {getFieldDecorator('handleTime', {
                      initialValue: '',
                    },
                    )(<RangePicker format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} allowClear />)}
                  </Form.Item>
                </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理结果">
                  {getFieldDecorator('handleResult', {
                    initialValue: cacheinfo.handleResult,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {handleResult.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="登记人">
                  {getFieldDecorator('registerUser', {
                    initialValue: cacheinfo.registerUser,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="登记人单位">
                  {getFieldDecorator('registerUnit', {
                    initialValue: cacheinfo.registerUnit,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="审核人">
                  {getFieldDecorator('checkUser', {
                    initialValue: cacheinfo.checkUser,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="审核人单位">
                  {getFieldDecorator('checkUnit', {
                    initialValue: cacheinfo.checkUnit,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: cacheinfo.handler,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理人单位">
                  {getFieldDecorator('handleUnit', {
                    initialValue: cacheinfo.handleUnit,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="总结人">
                  {getFieldDecorator('finishUser', {
                    initialValue: cacheinfo.finishUser,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="总结人单位">
                  {getFieldDecorator('finishUnit', {
                    initialValue: cacheinfo.finishUnit,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="确认人">
                  {getFieldDecorator('confirmUser', {
                    initialValue: cacheinfo.confirmUser,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="确认人单位" style={{ display: expand ? 'block' : 'none' }}>
                  {getFieldDecorator('confirmUnit', {
                    initialValue: cacheinfo.confirmUnit,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>


              {/* {
                  (status || type) && (
                 
                  )
                } */}
            </>

            {expand === false && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
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
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
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
                      收起 <Icon type="up" />
                    </>
                  ) : (
                    <>
                      展开 <Icon type="down" />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>

          {/* <Popconfirm title="确定删除吗？" onConfirm={handleDeleteAll} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
            <Button type="danger" style={{ marginLeft: 10 }}>批量删除</Button>
          </Popconfirm> */}
        </div>

        <Table
          loading={loading}
          columns={columns.filter(item => item.title !== 'id' || item.key !== 'id')}
          dataSource={faultQueryList.rows}
          rowKey={record => record.id}
          pagination={pagination}
          scroll={{ x: 1400 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ fault, faultstatics, loading }) => ({
    faultQueryList: fault.faultQueryList,
    html: fault.html,
    relatedictArr: faultstatics.relatedictArr,
    loading: loading.models.fault,
  }))(QueryList),
);
