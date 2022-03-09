import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  message,
  Popover,
  Checkbox,
  Icon,
  Badge,
  Tooltip,
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import CheckModel from './components/CheckModel';
import Back from './components/Back';

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

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusMap = ['green', 'gold', 'red'];
const statusContent = ['未超时', '即将超时', '已超时'];
let params;
let expand = false;

function OperationplanCheck(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    myTaskplanlist,
    userinfo,
    operationPersonArr,
    loading,
    location,
  } = props;
  let operationPersonSelect = [];

  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  let formThead;

  const gotoDetail = record => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...params,
          paginations,
          expand,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    router.push({
      pathname: `/ITSM/operationplan/operationplanform`,
      query: {
        auditLink: true,
        flowNodeName: record.flowNodeName,
        checkStatus: record.checkStatus,
        mainId: record.mainId,
        orderNo: record.operationNo,
      },
      state: {
        runpath: '/ITSM/operationplan/operationplancheck',
        cacheinfo: {
          ...params,
          paginations,
          expand,
        },
      }
    });
  };

  const initialColumns = [
    {
      title: '作业计划编号',
      dataIndex: 'operationNo',
      key: 'operationNo',
      width: 180,
      fixed: 'left',
      render: (text, record) => {
        return <a onClick={() => gotoDetail(record)}>{text}</a>;
      },
    },
    {
      title: '填报时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
    },
    {
      title: '作业系统名称',
      dataIndex: 'systemName',
      key: 'systemName',
      width: 150,
    },
    {
      title: '作业类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '当前处理环节',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
      width: 150,
    },
    {
      title: '作业性质',
      dataIndex: 'nature',
      key: 'nature',
      width: 150,
    },
    {
      title: '作业单位',
      dataIndex: 'operationUnit',
      key: 'operationUnit',
      width: 150,
    },
    {
      title: '作业负责人',
      dataIndex: 'operationUser',
      key: 'operationUser',
      width: 150,
    },
    {
      title: '作业对象',
      dataIndex: 'object',
      key: 'object',
      width: 150,
    },
    {
      title: '作业内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '风险分析',
      dataIndex: 'riskAnalysis',
      key: 'riskAnalysis',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '风险应对措施',
      dataIndex: 'riskMeasures',
      key: 'riskMeasures',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '超时状态',
      dataIndex: 'timeoutStatus',
      key: 'timeoutStatus',
      width: 150,
      render: text => (
        <span>
          <Badge status={statusMap[statusContent.indexOf(text)]} text={text} />
        </span>
      ),
    },
    {
      title: '计划开始时间',
      dataIndex: 'plannedStartTime',
      key: 'plannedStartTime',
      width: 200,
    },
    {
      title: '计划结束时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      width: 200,
    },
    {
      title: '作业状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 150,
    },
    {
      title: '是否开票',
      dataIndex: 'billing',
      key: 'billing',
      width: 150,
    },
    {
      title: '作业结果',
      dataIndex: 'executeResult',
      key: 'executeResult',
      width: 150,
    },
    {
      title: '实际开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 200,
    },
    {
      title: '实际结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 200,
    },
    {
      title: '作业执行情况说明',
      dataIndex: 'executeContent',
      key: 'executeContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '执行操作时间',
      dataIndex: 'executeOperationTime',
      key: 'executeOperationTime',
      width: 200,
    },
    {
      title: '填报人',
      dataIndex: 'addUser',
      key: 'addUser',
      width: 150,
    },
    {
      title: '填报单位',
      dataIndex: 'addUnit',
      key: 'addUnit',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      key: 'checkUser',
      width: 150,
    },
    {
      title: '审核结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      width: 150,
    },
    {
      title: '审核时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 200,
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '超时信息',
      dataIndex: 'timeoutMsg',
      key: 'timeoutMsg',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '回退信息',
      dataIndex: 'fallbackMsg',
      key: 'fallbackMsg',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
  ];

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName,
      };
    });
  }

  //  获取当前登录人信息
  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        flowNodeName: '计划审核',
        pageIndex: 0,
        pageSize: paginations.pageSize,
      },
    });
    setPaginations({ current: 1, pageSize: 15 });
  };

  const searchdata = (values, page, pageSize) => {
    const newvalues = {
      ...values,
      time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      checkTime1: values.checkTime?.length
        ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      checkTime2: values.checkTime?.length
        ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      checkTime: '',
      executeOperationTime1: values.executeOperationTime?.length
        ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      executeOperationTime2: values.executeOperationTime?.length
        ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      executeOperationTime: '',
      plannedStartTime1: values.plannedStartTime?.length
        ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedStartTime2: values.plannedStartTime?.length
        ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedStartTime: '',
      startTime1: values.startTime?.length
        ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      startTime2: values.startTime?.length
        ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      startTime: '',
      plannedEndTime1: values.plannedendTime?.length
        ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedEndTime2: values.plannedendTime?.length
        ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedendTime: '',
      endTime1: values.endTime?.length
        ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime2: values.endTime?.length
        ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime: '',
      addTime: '',
    };
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        flowNodeName: '计划审核',
        ...newvalues,
        pageIndex: page - 1,
        pageSize,
      },
    });
    params = newvalues;
  };

  //  每页显示多少条
  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  //  分页
  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  //  搜索
  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const searchParams = {
        ...values,
        flowNodeName: '计划审核',
      };
      searchdata(searchParams, 1, 15);
      setPaginations({ current: 1, pageSize: 15 });
    });
  };

  //  导出
  const exportDownload = () => {
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title,
      };
    });
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadMyOperationExcel',
        payload: {
          flowNodeName: '计划审核',
          columns: JSON.stringify(exportColumns),
          ids: selectedKeys.toString(),
          ...values,
          time1: values.addTime?.length
            ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          time2: values.addTime?.length
            ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime1: values.checkTime?.length
            ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime2: values.checkTime?.length
            ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime: '',
          executeOperationTime1: values.executeOperationTime?.length
            ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          executeOperationTime2: values.executeOperationTime?.length
            ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          executeOperationTime: '',
          plannedStartTime1: values.plannedStartTime?.length
            ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedStartTime2: values.plannedStartTime?.length
            ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedStartTime: '',
          startTime1: values.startTime?.length
            ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          startTime2: values.startTime?.length
            ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          startTime: '',
          plannedEndTime1: values.plannedendTime?.length
            ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedEndTime2: values.plannedendTime?.length
            ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedendTime: '',
          endTime1: values.endTime?.length
            ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endTime2: values.endTime?.length
            ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endTime: '',
          addTime: '',
        },
      }).then(res => {
        const filename = '下载作业计划审核.xls';
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  //  勾选复选框
  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedKeys([...index]);
      setSelectedRows([...handleSelect]);
    },
  };

  //  自定义列表表格头部
  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: val.width,
      };
      if (key === 0) {
        obj.width = 180;
        obj.render = (text, record) => {
          return <a onClick={() => gotoDetail(record)}>{text}</a>;
        };
        obj.fixed = 'left';
      }
      if (val.title === '超时状态') {
        obj.render = text => {
          return (
            <span>
              <Badge status={statusMap[statusContent.indexOf(text)]} text={text} />
            </span>
          );
        };
      }

      if (
        val.title === '填报单位' ||
        val.title === '超时信息' ||
        val.title === '回退信息' ||
        val.title === '审核说明' ||
        val.title === '作业执行情况说明' ||
        val.title === '作业内容' ||
        val.title === '风险分析' ||
        val.title === '风险应对措施'
      ) {
        obj.ellipsis = true;
        obj.render = (text, records) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              {key === 0 ? <a onClick={() => gotoDetail(records)}>{text}</a> : <span>{text}</span>}
            </Tooltip>
          );
        };
      }

      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    });
  };

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : []);
  };

  const onCheck = checkedValues => {
    formThead = initialColumns.filter(i => checkedValues.indexOf(i.title) >= 0);

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const executeStatus = getTypebyTitle('作业状态');
  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskBilling = getTypebyTitle('是否开票');
  const checkStatus = getTypebyTitle('审核状态');
  const timeoutStatus = getTypebyTitle('超时状态');
  const taskResult = getTypebyTitle('作业结果');
  const checkResult = getTypebyTitle('审核结果');
  const taskCompany = getTypebyTitle('作业单位');

  //  获取作业负责人
  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  };

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName,
      };
    });
  }

  //  审核提交
  const checkSubmit = value => {
    const allmainId = selectedRows.map(obj => {
      return obj.mainId;
    });

    const allcheckId = selectedRows.map(obj => {
      return obj.id;
    });
    dispatch({
      type: 'processmodel/batchCheck',
      payload: {
        ...value,
        mainIds: allmainId.toString(),
        flowNodeName: '计划审核',
        check_id: allcheckId.toString(),
        editState: 'edit',
        check_checkUserId: userinfo.userId,
        check_checkTime: value.check_checkTime.format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata({}, 1, paginations.pageSize);
        setSelectedRows([])
      } else {
        searchdata({}, 1, paginations.pageSize);
        message.error(res.msg);
      }
    });
  };

  const reasonSubmit = values => {
    const ids = selectedRows.map(item => {
      return item.id;
    });
    dispatch({
      type: 'processmodel/fallback',
      payload: {
        mainIds: ids.toString(),
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata({}, 1, paginations.pageSize);
        setSelectedRows([])
      } else {
        message.error(res.msg);
        searchdata({}, 1, paginations.pageSize);
      }
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: myTaskplanlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 设置初始值
  const record = {
    operationNo: '',
    systemName: '',
    paginations,
    expand,
  };
  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...params,
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
        expand = false;
      }
      if (location.state.cacheinfo) {
        if (location.state.cacheinfo) {
          const { current, pageSize } = location.state.cacheinfo.paginations;
          expand = location.state.cacheinfo.expand;
          setPaginations({ ...paginations, current, pageSize });
        }
      }
    }
  }, [location.state]);

  // 设置时间
  useEffect(() => {
    if (location.state.cacheinfo) {
      const {
        checkTime1,
        checkTime2,
        endTime1,
        endTime2,
        executeOperationTime1,
        executeOperationTime2,
        plannedEndTime1,
        plannedEndTime2,
        plannedStartTime1,
        plannedStartTime2,
        startTime1,
        startTime2,
        time1,
        time2,
      } = location.state.cacheinfo;
      setFieldsValue({
        addTime: time1 ? [moment(time1), moment(time2)] : '',
        checkTime: checkTime1 ? [moment(checkTime1), moment(checkTime2)] : '',
        endTime: endTime1 ? [moment(endTime1), moment(endTime2)] : '',
        executeOperationTime: executeOperationTime1
          ? [moment(executeOperationTime1), moment(executeOperationTime2)]
          : '',
        plannedendTime: plannedEndTime1 ? [moment(plannedEndTime1), moment(plannedEndTime2)] : '',
        startTime: startTime1 ? [moment(startTime1), moment(startTime2)] : '',
        plannedStartTime: plannedStartTime1
          ? [moment(plannedStartTime1), moment(plannedStartTime2)]
          : '',
      });
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    queryDept();
    getoperationPerson();
    setColumns(initialColumns);
    if (cacheinfo !== undefined) {
      validateFields((err, values) => {
        searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
      });
    }
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="481"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <div className='noexplain'>
          <Row gutter={24}>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label="作业计划编号">
                  {getFieldDecorator('operationNo', {
                    initialValue: cacheinfo.operationNo,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="作业系统名称">
                  {getFieldDecorator('systemName', {
                    initialValue: cacheinfo.systemName,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <span style={{ display: expand ? 'block' : 'none' }}>
                <Col span={8}>
                  <Form.Item label="作业类型">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskType.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="作业性质">
                    {getFieldDecorator('nature', {
                      initialValue: cacheinfo.nature,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskNature.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业单位">
                    {getFieldDecorator('operationUnit', {
                      initialValue: cacheinfo.operationUnit,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskCompany.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业负责人">
                    {getFieldDecorator('operationUser', {
                      initialValue: cacheinfo.operationUser,
                    })(
                      <Select allowClear>
                        {operationPersonSelect.map(obj => [
                          <Option key={obj.key} value={obj.value}>
                            {obj.value}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否开票">
                    {getFieldDecorator('billing', {
                      initialValue: cacheinfo.billing,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskBilling.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业对象">
                    {getFieldDecorator('object', {
                      initialValue: cacheinfo.object,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业内容">
                    {getFieldDecorator('content', {
                      initialValue: cacheinfo.content,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="计划开始时间">
                    {getFieldDecorator('plannedStartTime', {
                      initialValue: cacheinfo.plannedStartTime,
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="计划结束时间">
                    {getFieldDecorator('plannedendTime', {
                      initialValue: cacheinfo.plannedendTime,
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业状态">
                    {getFieldDecorator('status', {
                      initialValue: cacheinfo.status,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {executeStatus.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核状态">
                    {getFieldDecorator('checkStatus', {
                      initialValue: cacheinfo.checkStatus,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {checkStatus.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="超时状态">
                    {getFieldDecorator('timeoutStatus', {
                      initialValue: cacheinfo.timeoutStatus,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {timeoutStatus.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业结果">
                    {getFieldDecorator('executeResult', {
                      initialValue: cacheinfo.executeResult,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskResult.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业执行情况说明">
                    {getFieldDecorator('executeContent', {
                      initialValue: cacheinfo.executeContent,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('checkResult', {
                      initialValue: cacheinfo.checkResult,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {checkResult.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="实际开始时间">
                    {getFieldDecorator('startTime', {
                      initialValue: '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="实际结束时间">
                    {getFieldDecorator('endTime', {
                      initialValue: '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="执行操作时间">
                    {getFieldDecorator('executeOperationTime', {
                      initialValue: '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人">
                    {getFieldDecorator('addUser', {
                      initialValue: cacheinfo.addUser,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报单位">
                    {getFieldDecorator('addUnit', {
                      initialValue: cacheinfo.addUnit,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                      initialValue: cacheinfo.checkUser,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核时间">
                    {getFieldDecorator('checkTime', {
                      initialValue: cacheinfo.checkTime,
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核说明">
                    {getFieldDecorator('checkContent', {
                      initialValue: cacheinfo.checkContent,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报时间">
                    {getFieldDecorator('addTime', {
                      initialValue: '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
              </span>
              {expand === false && (
                <Col span={8}>
                  <Button type="primary" onClick={handleSearch}>
                    查询
                  </Button>

                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重置
                  </Button>

                  <Button
                    style={{ marginLeft: 8 }}
                    type="link"
                    onClick={() => {
                      expand = !expand
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
                  <Button type="primary" onClick={handleSearch}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重置
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="link"
                    onClick={() => {
                      expand = !expand
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
        </div>


        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <CheckModel
            userinfo={userinfo}
            selectedRows={selectedRows}
            checkSubmit={values => checkSubmit(values)}
          >
            <Button
              type="primary"
              style={{ marginRight: 8 }}
            //  onClick={handleClick}
            >
              审核
            </Button>
          </CheckModel>

          <Back
            selectedRows={selectedRows}
            reasonSubmit={values => reasonSubmit(values)}
            backProcessname='作业计划填报'
          >
            <Button type="primary" style={{ marginRight: 8 }}>
              回退
            </Button>
          </Back>

          <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
            导出数据
          </Button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            // className={styles.dropdown}
            content={
              <>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={(columns.length === initialColumns.length) === true}
                  >
                    列表展示
                  </Checkbox>
                  <br />
                </div>

                <Checkbox.Group onChange={onCheck} value={defaultAllkey} defaultValue={columns}>
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: '8px' }}>
                      <Checkbox value={item.title} key={item.key} checked={columns}>
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: '14px' }} />
            </Button>
          </Popover>
        </div>

        <div />
        <Table
          loading={loading}
          columns={columns && columns.length === (initialColumns && initialColumns.length) ? initialColumns : columns}
          dataSource={myTaskplanlist.rows}
          scroll={{ x: 1500, y: 700 }}
          rowKey={records => records.id}
          rowSelection={rowSelection}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    myTaskplanlist: processmodel.myTaskplanlist,
    operationPersonArr: processmodel.operationPersonArr,
    userinfo: itsmuser.userinfo,
    loading: loading.models.processmodel,
  }))(OperationplanCheck),
);
