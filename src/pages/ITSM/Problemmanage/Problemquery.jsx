import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  DatePicker,
  Popover,
  Checkbox,
  Icon,
  Cascader,
  Tooltip,
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
const { Option } = Select;
const { RangePicker } = DatePicker;
let params;
let expand = false;

function Besolved(props) {
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue, getFieldsValue },
    location: {
      query: {
        progressStatus,
        type,
        handleDeptId,
        timeStatus,
        handlerId,
        checkUserId,
        checkDeptId,
        addTimeBegin,
        addTimeEnd,
        status,
        currentNode,
        problem,
        handleProcessGroupType,
      },
    },
    dispatch,
    queryArr,
    location,
    loading,
  } = props;
  let differentTitle;
  const [initial,setInitial] = useState(false)
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  let formThead;

  if (problem) {
    differentTitle = '问题统计查询';
  } else {
    differentTitle = '问题查询';
  }

  const searchdata = (values, page) => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        ...values,
        registerOccurTimeBegin: values.registerOccurTime?.length
          ? moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        registerOccurTimeEnd: values.registerOccurTime?.length
          ? moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        registerOccurTime: values.registerOccurTime?.length
          ? [
            moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss'),
          ]
          : '',
        addTimeBegin: values.addTime?.length
          ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        addTimeEnd: values.addTime?.length
          ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        addTime: values.addTime?.length
          ? [
            moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss'),
          ]
          : '',
        pageNum: page,
        type:
          values && values.type && values.type.length > 0
            ? values.type[values.type.length - 1].toString()
            : '',
        pageSize: paginations.pageSize,
      },
    });
    const newvalues = {
      ...values,
      registerOccurTimeBegin: values.registerOccurTime?.length
        ? moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      registerOccurTimeEnd: values.registerOccurTime?.length
        ? moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      registerOccurTime: values.registerOccurTime?.length
        ? [
          moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        ]
        : '',
      addTimeBegin: values.addTime?.length
        ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      addTimeEnd: values.addTime?.length
        ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      addTime: values.addTime?.length
        ? [
          moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        ]
        : '',
      pageNum: paginations.current,
      pageSize: paginations.pageSize,
    };
    // setTabRecord({ ...newvalues });
    params = newvalues
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
    setPageinations({ current: 1, pageSize: 15 });
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
    total: queryArr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
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
      const obj = values;
      if (values.createTimeBegin) {
        obj.createTimeBegin = values.createTimeBegin.format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, 1, paginations.pageSize, search);
    });
  };

  const download = () => {
    const exportColumns = (initial ? controlTable: columns).map(item => {
      return {
        column: item.dataIndex,
        field: item.title,
      };
    });
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/eventdownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            ...values,
            type: values.type && values.type.length ? values.type[1] : '',
            createTimeBegin: values.createTime?.length
              ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
              : addTimeBegin,
            createTimeEnd: values.createTime?.length
              ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
              : addTimeEnd,
            createTime: '',
          },
        }).then(res => {
          const filename = `问题查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
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

  const getTypebyTitle = titles => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === titles)[0].children;
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
      const { registerOccurTime, addTime } = location.state.cacheinfo;
      setFieldsValue({
        registerOccurTime: registerOccurTime?.length
          ? [moment(registerOccurTime[0]), moment(registerOccurTime[1])]
          : '',
        addTime: addTime?.length ? [moment(addTime[0]), moment(addTime[1])] : '',
      });
    } else {
      setFieldsValue({
        addTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
      });
    }
  }, [location.state]);

  const problemTypes = type === undefined ? [] : [type.substr(0, 3), type];

  // 设置初始值
  const record = {
    no: '',
    currentNode,
    taskUser: '',
    title: '',
    confirmUser: '',
    source: '',
    type: problemTypes,
    registerScope: '',
    handler: '',
    handleUnit: '',
    registerUser: '',
    importance: '',
    handlerId,
    handleDeptId,
    progressStatus,
    timeStatus,
    handleProcessGroupType,
    checkUserId,
    checkDeptId,
    status,
    createTime: '',
    addTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
    paginations,
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  const gotoDetail = (text, record) => {
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
      pathname: `/ITSM/problemmanage/problemquery/detail`,
      query: {
        id: record.id,
        taskName: record.statuscn,
        No: record.no,
      },
      state: {
        runpath: '/ITSM/problemmanage/problemquery',
        cacheinfo: {
          ...params,
          paginations,
          expand,
        },
      }
    });

  };

  const controlTable = [
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      align: 'center',
      render: (text, record) => {
        return <a onClick={() => gotoDetail(text, record)}>{text}</a>;
      },
    },
    {
      title: '问题分类',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      align: 'center',
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
      title: '问题描述',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      align: 'center',
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
      title: '问题申报人',
      dataIndex: 'complainUser',
      key: 'complainUser',
      width: 200,
      align: 'center',
    },
    {
      title: '开发负责人',
      dataIndex: 'developmentLead',
      key: 'developmentLead',
      align: 'center',
      width: 120,
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
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
      align: 'center',
      width: 200,
    },
    {
      title: '系统运维商确认结果',
      dataIndex: 'confirmOneResult',
      key: 'confirmOneResult',
      width: 200,
      align: 'center',
    },
    {
      title: '处理完成时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
      width: 200,
      align: 'center',
    },
    {
      title: '系统开发商处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 150,
      align: 'center',
    },
    {
      title: '计划完成时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 200,
      align: 'center',
    },
    {
      title: '处理解决方案',
      dataIndex: 'handleContent',
      key: 'handleContent',
      width: 150,
      align: 'center',
    },
    {
      title: '系统开发商处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认结果',
      dataIndex: 'confirmThreeResult',
      key: 'confirmThreeResult',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认人',
      dataIndex: 'confirmThreeUser',
      key: 'confirmThreeUser',
      width: 200,
      align: 'center',
    },
  ];

  const initialColumns = [
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      align: 'center',
      render: (text, record) => {
        return <a onClick={() => gotoDetail(text, record)}>{text}</a>;
      },
    },
    {
      title: '问题分类',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      align: 'center',
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
      title: '问题描述',
      dataIndex: 'content',
      key: 'content',
      width: 150,
      align: 'center',
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
      title: '问题申报人',
      dataIndex: 'complainUser',
      key: 'complainUser',
      width: 200,
      align: 'center',
    },
    {
      title: '开发负责人',
      dataIndex: 'developmentLead',
      key: 'developmentLead',
      width: 120,
      align: 'center',
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认结果',
      dataIndex: 'confirmOneResult',
      key: 'confirmOneResult',
      width: 200,
      align: 'center',
    },
    {
      title: '处理完成时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
      width: 200,
      align: 'center',
    },
    {
      title: '系统开发商处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 150,
      align: 'center',
    },
    {
      title: '计划完成时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 200,
      align: 'center',
    },
    {
      title: '处理解决方案',
      dataIndex: 'handleContent',
      key: 'handleContent',
      width: 150,
      align: 'center',
    },
    {
      title: '系统开发商处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认结果',
      dataIndex: 'confirmThreeResult',
      key: 'confirmThreeResult',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认人',
      dataIndex: 'confirmThreeUser',
      key: 'confirmThreeUser',
      width: 200,
      align: 'center',
    },
    {
      title: '当前环节处理人',
      dataIndex: 'taskUser',
      key: 'taskUser',
      width: 150,
    },
    {
      title: '问题名称',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      align: 'center',
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
      title: '问题来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      align: 'center',
    },
    {
      title: '重要程度',
      dataIndex: 'importance',
      key: 'importance',
      width: 150,
      align: 'center',
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 150,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
    },
    {
      title: '预计工单超时时间',
      dataIndex: 'timeoutTime',
      key: 'timeoutTime',
      width: 200,
      align: 'center',
    },
    {
      title: '预计工单超时提醒时间',
      dataIndex: 'remindTime',
      key: 'remindTime',
      width: 200,
      align: 'center',
    },
    {
      title: '登记ID',
      dataIndex: 'registerId',
      key: 'registerId',
      width: 150,
      align: 'center',
    },
    {
      title: '发生时间',
      dataIndex: 'registerOccurTime',
      key: 'registerOccurTime',
      width: 200,
      align: 'center',
    },
    {
      title: '期望完成时间',
      dataIndex: 'registerExpectTime',
      key: 'registerExpectTime',
      width: 200,
      align: 'center',
    },
    {
      title: '所属项目',
      dataIndex: 'registerProject',
      key: 'registerProject',
      width: 150,
      align: 'center',
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
      title: '影响范围',
      dataIndex: 'registerScope',
      key: 'registerScope',
      width: 150,
      align: 'center',
    },
    {
      title: '登记人单位名称',
      dataIndex: 'registerUnit',
      key: 'registerUnit',
      width: 150,
      align: 'center',
    },
    {
      title: '登记人部门名称',
      dataIndex: 'registerDept',
      key: 'registerDept',
      width: 150,
      align: 'center',
    },
    {
      title: '发送人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 150,
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'registerUserPhone',
      key: 'registerUserPhone',
      width: 150,
      align: 'center',
    },
    // {
    //   title: '登记时间',
    //   dataIndex: 'registerTime',
    //   key: 'registerTime',
    //   width: 150,
    // },
    {
      title: '登记状态',
      dataIndex: 'registerStatus',
      key: 'registerStatus',
      width: 150,
      align: 'center',
    },
    {
      title: '登记流程节点实例ids',
      dataIndex: 'registerFlowNodeInstanceIds',
      key: 'registerFlowNodeInstanceIds',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核ID',
      dataIndex: 'checkOneId',
      key: 'checkOneId',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核结果',
      dataIndex: 'checkOneResult',
      key: 'checkOneResult',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核意见',
      dataIndex: 'checkOneOpinion',
      key: 'checkOneOpinion',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核人单位',
      dataIndex: 'checkOneUnit',
      key: 'checkOneUnit',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核人部门',
      dataIndex: 'checkOneDept',
      key: 'checkOneDept',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核人',
      dataIndex: 'checkOneUser',
      key: 'checkOneUser',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核时间',
      dataIndex: 'checkOneTime',
      key: 'checkOneTime',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商审核状态',
      dataIndex: 'checkOneStatus',
      key: 'checkOneStatus',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商流程节点实例ids',
      dataIndex: 'checkOneFlowNodeInstanceIds',
      key: 'checkOneFlowNodeInstanceIds',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核ID',
      dataIndex: 'checkTwoId',
      key: 'checkTwoId',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核结果',
      dataIndex: 'checkTwoResult',
      key: 'checkTwoResult',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核意见',
      dataIndex: 'checkTwoOpinion',
      key: 'checkTwoOpinion',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核人单位',
      dataIndex: 'checkTwoUnit',
      key: 'checkTwoUnit',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核人部门',
      dataIndex: 'checkTwoDept',
      key: 'checkTwoDept',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核人',
      dataIndex: 'checkTwoUser',
      key: 'checkTwoUser',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核时间',
      dataIndex: 'checkTwoTime',
      key: 'checkTwoTime',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人审核状态',
      dataIndex: 'checkTwoStatus',
      key: 'checkTwoStatus',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人流程节点实例ids',
      dataIndex: 'checkTwoFlowNodeInstanceIds',
      key: 'checkTwoFlowNodeInstanceIds',
      width: 300,
      align: 'center',
    },
    {
      title: '处理ID',
      dataIndex: 'handleId',
      key: 'handleId',
      width: 150,
      align: 'center',
    },
    {
      title: '处理人单位',
      dataIndex: 'handleUnit',
      key: 'handleUnit',
      width: 150,
      align: 'center',
    },
    {
      title: '处理人部门',
      dataIndex: 'handleDept',
      key: 'handleDept',
      width: 150,
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'handleStatus',
      key: 'handleStatus',
      width: 150,
      align: 'center',
    },
    {
      title: '接单时间',
      dataIndex: 'handleAddTime',
      key: 'handleAddTime',
      width: 200,
      align: 'center',
    },
    {
      title: '处理流程节点实例ids',
      dataIndex: 'handleFlowNodeInstanceIds',
      key: 'handleFlowNodeInstanceIds',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认ID',
      dataIndex: 'confirmOneId',
      key: 'confirmOneId',
      width: 150,
      align: 'center',
    },
    {
      title: '系统运维商确认说明',
      dataIndex: 'confirmOneContent',
      key: 'confirmOneContent',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认人单位',
      dataIndex: 'confirmOneUnit;',
      key: 'confirmOneUnit;',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认人部门',
      dataIndex: 'confirmOneDept',
      key: 'confirmOneDept',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认人',
      dataIndex: 'confirmOneUser',
      key: 'confirmOneUser',
      width: 150,
      align: 'center',
    },
    {
      title: '系统运维商确认时间',
      dataIndex: 'confirmOneTime',
      key: 'confirmOneTime',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认状态',
      dataIndex: 'confirmOneStatus',
      key: 'confirmOneStatus',
      width: 200,
      align: 'center',
    },
    {
      title: '系统运维商确认流程节点实例ids',
      dataIndex: 'confirmOneFlowNodeInstanceIds',
      key: 'confirmOneFlowNodeInstanceIds',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认ID',
      dataIndex: 'confirmTwoId',
      key: 'confirmTwoId',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认结果',
      dataIndex: 'confirmTwoResult',
      key: 'confirmTwoResult',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认说明',
      dataIndex: 'confirmTwoContent',
      key: 'confirmTwoContent',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认人单位',
      dataIndex: 'confirmTwoUnit',
      key: 'confirmTwoUnit',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认人部门',
      dataIndex: 'confirmTwoDept',
      key: 'confirmTwoDept',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认人',
      dataIndex: 'confirmTwoUser',
      key: 'confirmTwoUser',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认时间',
      dataIndex: 'confirmTwoTime',
      key: 'confirmTwoTime',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认状态',
      dataIndex: 'confirmTwoStatus',
      key: 'confirmTwoStatus',
      width: 250,
      align: 'center',
    },
    {
      title: '自动化科业务负责人确认流程节点实例ids',
      dataIndex: 'confirmTwoFlowNodeInstanceIds',
      key: 'confirmTwoFlowNodeInstanceIds',
      width: 300,
      align: 'center',
    },
    {
      title: '问题登记人员确认ID',
      dataIndex: 'confirmThreeId',
      key: 'confirmThreeId',
      width: 200,
      align: 'center',
    },
    {
      title: '问题登记人员确认说明',
      dataIndex: 'confirmThreeContent',
      key: 'confirmThreeContent',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认人单位',
      dataIndex: 'confirmThreeUnit',
      key: 'confirmThreeUnit',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认人部门',
      dataIndex: 'confirmThreeDept',
      key: 'confirmThreeDept',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认时间',
      dataIndex: 'confirmThreeTime',
      key: 'confirmThreeTime',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认状态',
      dataIndex: 'confirmThreeStatus',
      key: 'confirmThreeStatus',
      width: 250,
      align: 'center',
    },
    {
      title: '问题登记人员确认流程节点实例ids',
      dataIndex: 'confirmThreeFlowNodeInstanceIds',
      key: 'confirmThreeFlowNodeInstanceIds',
      width: 300,
      align: 'center',
    },
    {
      title: '待办ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 150,
      align: 'center',
    },
    {
      title: '待办用户ID',
      dataIndex: 'taskUserId',
      key: 'taskUserId',
      width: 150,
      align: 'center',
    },
    {
      title: '当前流程环境',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
      width: 150,
      align: 'center',
    },
    {
      title: '流程代办创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      align: 'center',
    },
    {
      title: '数据来源',
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 150,
      align: 'center',
    },
  ];

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
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        expand = location.state.cacheinfo.expand;
        setPageinations({ ...paginations, current, pageSize });
      }
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    if (cacheinfo !== undefined) {
      const values = getFieldsValue();
      searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
    }
    setInitial(true)
  }, []);

  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 150,
      };
      if (key === 0) {
        obj.render = (text, records) => {
          return <a onClick={() => gotoDetail(text, records)}>{text}</a>;
        };
        obj.fixed = 'left';
        obj.width = 200;
      }
      if (
        val.title === '问题分类' ||
        val.title === '问题描述' ||
        val.title === '开发负责人' ||
        val.title === '所属项目' ||
        val.title === '问题名称'
      ) {
        obj.ellipsis = true;
        obj.render = (text, records) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              {key === 0 ? (
                <a onClick={() => gotoDetail(text, records)}>{text}</a>
              ) : (
                <span>{text}</span>
              )}
            </Tooltip>
          );
        };
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      setInitial(false)
      return null;
    });
  };

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : []);  setInitial(false)
  };

  const onCheck = checkedValues => {
    formThead = initialColumns.filter(i => checkedValues.indexOf(i.title) >= 0);

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
  };

  const defaultAllkey = (initial ? controlTable: columns).map(item => {
    return item.title;
  });

  const rowSelection = {
    onChange: index => {
      setSelectedKeys([...index]);
    },
  };

  return (
    <PageHeaderWrapper title={differentTitle}>
      <SysDict
        typeid="334"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <>
              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('handleDeptId', {
                    initialValue: cacheinfo.handleDeptId,
                  })(<Input placeholder="请输入" allowClear />)}
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
                  })(<Input placeholder="请输入" allowClear />)}
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
                  })(<Input placeholder="请输入" allowClear />)}
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
                  })(<Input placeholder="请输入" allowClear />)}
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
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('handleProcessGroupType', {
                    initialValue: cacheinfo.handleProcessGroupType,
                    rules: [
                      {
                        message: '请输入问题编号',
                      },
                    ],
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="问题编号">
                  {getFieldDecorator('no', {
                    initialValue: cacheinfo.no,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="问题分类">
                  {getFieldDecorator('type', {
                    initialValue: cacheinfo.type,
                  })(
                    <Cascader
                      fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                      options={problemType}
                      placeholder="请选择"
                    />,
                    <Input />,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="建单时间">
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

              <Col span={8}>
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('currentNode', {
                    initialValue: cacheinfo.currentNode,
                  })(
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
                <Form.Item label='当前环节处理人'>
                  {
                    getFieldDecorator('taskUser', {
                      initialValue: cacheinfo.taskUser
                    })(<Input />)
                  }

                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="处理状态">
                  {getFieldDecorator('timeStatus', {
                    initialValue: cacheinfo.timeStatus,
                  })(
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
            </>

            <>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="问题标题">
                  {getFieldDecorator('title', {
                    initialValue: cacheinfo.title,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="发生时间">
                  {getFieldDecorator('registerOccurTime', {
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
                      placeholder="请选择"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
            </>

            <>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="问题来源">
                  {getFieldDecorator('source', {
                    initialValue: cacheinfo.source,
                  })(
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
                <Form.Item label="影响范围">
                  {getFieldDecorator('registerScope', {
                    initialValue: cacheinfo.registerScope,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {scopeList.map(obj => [
                        <Option key={obj.key} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: cacheinfo.handler,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="处理单位">
                  {getFieldDecorator('handleUnit', {
                    initialValue: cacheinfo.handleUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="发送人">
                  {getFieldDecorator('registerUser', {
                    initialValue: cacheinfo.registerUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="重要程度">
                  {getFieldDecorator('importance', {
                    initialValue: cacheinfo.importance,
                  })(
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
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
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

                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={columns}
                  style={{ overflowY: 'auto', height: 800 }}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: '8px' }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      >
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

        <Table
          loading={loading}
          columns={initial ? controlTable : columns}
          dataSource={queryArr.rows}
          rowKey={records => records.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 800, y: 700 }}
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
