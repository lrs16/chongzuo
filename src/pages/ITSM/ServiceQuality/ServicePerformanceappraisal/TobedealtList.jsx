import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  AutoComplete,
  message,
  Spin,
  Tooltip,
  Popover,
  Checkbox,
  Icon,
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { operationPerson } from '@/services/common';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import { providerList, scoreListpage, contractProvider, clauseListpage } from '../services/quality';
import { ThShort } from '@/utils/utils';

import styles from './index.less';

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

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

let fromparams;
let expand = false;

function TobedealtList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue, resetFields },
    tobeDealtarr,
    target1,
    target2,
    clauseList,
    dispatch,
    location,
    loading,
  } = props;
  let formThead;
  const [performanceLeader, setPerformanceLeader] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [contractArr, setContractArr] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [target2Type, setTarget2Type] = useState('');
  const [spinloading, setSpinLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [columns, setColumns] = useState([]);

  const todetail = record => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...fromparams,
          paginations,
          expand,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    switch (pagetitle) {
      case '服务绩效考核待办':
        router.push({
          pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
          query: {
            assessNo: record.assessNo,
            mainId: record.instanceId,
            taskId: record.taskId,
            instanceId: record.instanceId,
            taskName: record.taskName,
            orderNo: record.assessNo,
            tobelist: true,
          },
          state: {
            runpath: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtlist',
            cacheinfo: {
              ...fromparams,
              paginations,
              expand,
            },
          }
        });
        break;
      case '服务绩效考核查询':
        router.push({
          pathname:
            '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
          query: {
            assessNo: record.assessNo,
            mainId: record.instanceId,
            taskId: record.taskId,
            instanceId: record.instanceId,
            taskName: record.taskName,
            orderNo: record.assessNo,
            search: true,
          },
          state: {
            runpath: '/ITSM/servicequalityassessment/serviceperformanceappraisal/search',
            cacheinfo: {
              ...fromparams,
              paginations,
              expand,
            },
          }
        });
        break;
      case '我的服务绩效考核':
        router.push({
          pathname:
            '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
          query: {
            assessNo: record.assessNo,
            mainId: record.instanceId,
            taskId: record.taskId,
            instanceId: record.instanceId,
            taskName: record.taskName,
            orderNo: record.assessNo,
            myOrder: true,
            search: true,
          },
          state: {
            runpath: '/ITSM/servicequalityassessment/serviceperformanceappraisal/assessment',
            cacheinfo: {
              ...fromparams,
              paginations,
              expand,
            },
          }
        });
        break;
      default:
        break;
    }
  };


  const initialColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) =>
        `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    },
    {
      title: '服务绩效编号',
      dataIndex: 'assessNo',
      key: 'assessNo',
      width: 200,
      sorter: (a, b) => a.assessNo.localeCompare(b.assessNo),
      render: (text, record) => {
        return <a onClick={() => todetail(record)}>{text}</a>;
      },
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 150,
    },
    {
      title: '责任人',
      dataIndex: 'directorName',
      key: 'directorName',
      width: 150,
    },
    {
      title: '考核内容说明',
      dataIndex: 'assessContent',
      key: 'assessContent',
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
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType',
      width: 150,
    },
    {
      title: '考核对象',
      dataIndex: 'assessObject',
      key: 'assessObject',
      width: 150,
    },
    {
      title: '一级指标',
      dataIndex: 'target1Name',
      key: 'target1Name',
      width: 150,
    },
    {
      title: '二级指标',
      dataIndex: 'target2Name',
      key: 'target2Name',
      width: 150,
    },
    {
      title: '详细条款',
      dataIndex: 'clauseName',
      key: 'clauseName',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '发生时间',
      dataIndex: 'assessTime',
      key: 'assessTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'assessTime'),
    },
    {
      title: '考核得分',
      dataIndex: 'assessValue',
      key: 'assessValue',
      width: 150,
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentTaskName',
      key: 'currentTaskName',
      width: 150,
    },
    // {
    //   title: '当前环节处理人',
    //   dataIndex: 'assignee',
    //   key: 'assignee',
    //   width: 150,
    // },
    {
      title: '关联合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '考核状态',
      dataIndex: 'assessStatus',
      key: 'assessStatus',
      width: 150,
    },
    {
      title: '登记人',
      dataIndex: 'register',
      key: 'register',
      width: 150,
    },
    {
      title: '登记时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'applyTime'),
    },
    {
      title: '业务负责人审核结果',
      dataIndex: 'directorVerifyValue',
      key: 'directorVerifyValue',
      width: 180,
    },
    {
      title: '业务负责人审核说明',
      dataIndex: 'directorVerifyContent',
      key: 'directorVerifyContent',
      width: 180,
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
      title: '业务负责人审核状态',
      dataIndex: 'directorVerifyStatus',
      key: 'directorVerifyStatus',
      width: 180,
    },
    {
      title: '业务负责人审核人',
      dataIndex: 'directorVerifierName',
      key: 'directorVerifierName',
      width: 180,
    },
    {
      title: '业务负责人审核时间',
      dataIndex: 'directorVerifyTime',
      key: 'directorVerifyTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'directorVerifyTime'),
    },
    {
      title: '是否申诉',
      dataIndex: 'isAppeal',
      key: 'isAppeal',
      width: 150,
    },
    {
      title: '申诉内容',
      dataIndex: 'appealContent',
      key: 'appealContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '服务商确认人',
      dataIndex: 'providerConfirmerName',
      key: 'providerConfirmerName',
      width: 150,
    },
    {
      title: '服务商确认时间',
      dataIndex: 'providerConfirmTime',
      key: 'providerConfirmTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'providerConfirmTime'),
    },
    {
      title: '自动化科复核结果',
      dataIndex: 'directorReviewValue',
      key: 'directorReviewValue',
      width: 180,
    },
    {
      title: '自动化科复核说明',
      dataIndex: 'directorReviewContent',
      key: 'directorReviewContent',
      width: 180,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '自动化科复核人',
      dataIndex: 'directorReviewerName',
      key: 'directorReviewerName',
      width: 180,
    },
    {
      title: '自动化科复核时间',
      dataIndex: 'directorReviewTime',
      key: 'directorReviewTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'directorReviewTime'),
    },
    {
      title: '服务绩效考核确认结果',
      dataIndex: 'finallyConfirmValue',
      key: 'finallyConfirmValue',
      width: 180,
    },
    {
      title: '服务绩效考核确认说明',
      dataIndex: 'finallyConfirmContent',
      key: 'finallyConfirmContent',
      width: 180,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '服务绩效考核确认人',
      dataIndex: 'finallyConfirmerName',
      key: 'finallyConfirmerName',
      width: 180,
    },
    {
      title: '服务绩效考核确认时间',
      dataIndex: 'finallyConfirmTime',
      key: 'finallyConfirmTime',
      width: 200,
      sorter: (a, b) => ThShort(a, b, 'finallyConfirmTime'),
    },
    {
      title: '考核来源',
      dataIndex: 'source',
      key: 'source',
      width: 200,
    },
  ];

  const obj = {
    title: '当前环节处理人',
    dataIndex: 'assignee',
    key: 'assignee',
    width: 150,
  }

  if (pagetitle === '服务绩效考核查询') {
    initialColumns.splice(13, 0, obj)
  }

  const getPerformanceleader = () => {
    operationPerson().then(res => {
      const result = res.data.map(item => {
        return {
          key: item.id,
          value: item.userName,
        };
      });
      setPerformanceLeader(result);
    });
  };

  //  根据考核类型查询一级指标
  const getTarget1 = type => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget1',
      payload: type || '',
    });
  };

  //  根据考核类型查询二级指标
  const getTarget2 = id => {
    dispatch({
      type: 'qualityassessment/scoreGetTarget2',
      payload: id,
    });
  };

  //  获取详细条款数据
  const getclausedetail = (targetId, scoreid) => {
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId: scoreid,
        pageNum: 1,
        pageSize: 1000,
      },
    });
  };

  //  获取合同名称
  const getContrractname = id => {
    contractProvider({ id, status: '1' }).then(res => {
      if (res) {
        const arr = [...res.data];
        setContractArr(arr);
      }
    });
  };

  // 自动完成服务商
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.providerNo}</span>
          <span>{opt.providerName}</span>
          <span>{opt.director}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      providerName: value,
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    switch (type) {
      case 'provider':
        providerList({ ...requestData }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setDisabledList(arr);
          }
        });
        break;
      case 'contract':
        if (!providerId) {
          message.error('请先选择服务商哦');
        } else {
          contractProvider({ id: providerId, status: '1' }).then(res => {
            if (res) {
              const arr = [...res.data];
              setSpinLoading(false);
              setContractlist(arr);
            }
          });
        }

        break;
      case 'score':
        scoreListpage({ ...requestData }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      case 'clause':
        clauseListpage({ ...requestData, scoreId, targetId: target2Type }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setSpinLoading(false);
            setScorelist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择服务商，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, providerName, scoreName, assessType } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          providerName, // 服务商
          providerId: id, // 服务商id
          contractName: '',
          contractId: '',
        });
        getContrractname(id);
        setProviderId(id);
        break;

      case 'score':
        setFieldsValue({
          score: scoreName, // 评分细则名称
          scoreId: id, // 评分细则id
          assessType,
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: '',
        });
        setScoreId(id);
        getTarget1(assessType === '功能开发' ? '1' : '2');
        break;

      default:
        break;
    }
  };

  const searchdata = (values, page, pageSize) => {
    const newvalues = {
      ...values,
      assessBeginTime: values.timeoccurrence?.length
        ? moment(values.timeoccurrence[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      assessEndTime: values.timeoccurrence?.length
        ? moment(values.timeoccurrence[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 发生时间
      timeoccurrence: '',
      applyBeginTime: values.applyTime?.length
        ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      applyEndTime: values.applyTime?.length
        ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 登记时间
      applyTime: '',
      directorVerifyBeginTime: values.directorVerifyTime?.length
        ? moment(values.directorVerifyTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      directorVerifyEndTime: values.directorVerifyTime?.length
        ? moment(values.directorVerifyTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 业务负责人审核时间
      directorVerifyTime: '',
      expertVerifyBeginTime: values.expertVerifyTime?.length
        ? moment(values.expertVerifyTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      expertVerifyEndTime: values.expertVerifyTime?.length
        ? moment(values.expertVerifyTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 自动化科专责审核时间
      expertVerifyTime: '',
      providerConfirmBeginTime: values.providerConfirmTime?.length
        ? moment(values.providerConfirmTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      providerConfirmEndTime: values.providerConfirmTime?.length
        ? moment(values.providerConfirmTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 服务商确认时间
      providerConfirmTime: '',
      directorReviewBeginTime: values.directorReviewTime?.length
        ? moment(values.directorReviewTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      directorReviewEndTime: values.directorReviewTime?.length
        ? moment(values.directorReviewTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 业务负责人复核时间
      directorReviewTime: '',
      finallyConfirmBeginTime: values.finallyConfirmTime?.length
        ? moment(values.finallyConfirmTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      finallyConfirmEndTime: values.finallyConfirmTime?.length
        ? moment(values.finallyConfirmTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 服务绩效考核确认时间
      finallyConfirmTime: '',
    };
    switch (pagetitle) {
      case '服务绩效考核待办':
        dispatch({
          type: 'performanceappraisal/tobeDealtdata',
          payload: {
            ...newvalues,
            pageNum: page,
            pageSize,
          },
        });
        break;
      case '服务绩效考核查询':
        dispatch({
          type: 'performanceappraisal/assessSearch',
          payload: {
            ...newvalues,
            pageNum: page,
            pageSize,
          },
        });
        break;
      case '我的服务绩效考核':
        dispatch({
          type: 'performanceappraisal/assessmyAssess',
          payload: {
            ...newvalues,
            pageNum: page,
            pageSize,
          },
        });
        break;
      default:
        break;
    }
    fromparams = newvalues;
  };

  const record = {
    assignee: '',
    registerName: '',
    expertVerifierName: '',
    providerConfirmerName: '',
    assessNo: '',
    providerId: '',
    providerName: '',
    currentTaskName: '',
    provider: '',
    contractName: '',
    contractId: '',
    directorId: '',
    directorName: '',
    assessType: '',
    target1Name: '',
    clauseId: '',
    assessContent: '',
    target1Id: '',
    target2Name: '',
    target2Id: '',
    detailed: '',
    assessValue: '',
    register: '',
    directorVerifyValue: '',
    directorVerifyContent: '',
    directorVerifyStatus: '',
    directorVerifierName: '',
    expertVerifyValue: '',
    expertVerifyContent: '',
    expertVerifyStatus: '',
    expertVerifier: '',
    isAppeal: '',
    appealContent: '',
    providerConfirmer: '',
    directorReviewValue: '',
    directorReviewContent: '',
    directorReviewer: '',
    finallyConfirmContent: '',
    finallyConfirmValue: '',
    finallyConfirmerName: '',
    finallyConfirmer: '',
    finallyConfirmTime: '',
    paginations,
    directorReviewerName: '',
    source: ''
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

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

  //  设置时间
  useEffect(() => {
    if (location && location.state && location.state.cacheinfo) {
      const {
        applyBeginTime,
        applyEndTime,
        directorVerifyBeginTime,
        directorVerifyEndTime,
        assessBeginTime,
        assessEndTime,
        providerConfirmBeginTime,
        providerConfirmEndTime,
        directorReviewBeginTime,
        directorReviewEndTime,
        finallyConfirmBeginTime,
        finallyConfirmEndTime,
      } = location.state.cacheinfo;
      setFieldsValue({
        applyTime: applyBeginTime ? [moment(applyBeginTime), moment(applyEndTime)] : '',
        directorVerifyTime: directorVerifyBeginTime
          ? [moment(directorVerifyBeginTime), moment(directorVerifyEndTime)]
          : '',
        timeoccurrence: assessBeginTime ? [moment(assessBeginTime), moment(assessEndTime)] : '',
        providerConfirmTime: providerConfirmBeginTime
          ? [moment(providerConfirmBeginTime), moment(providerConfirmEndTime)]
          : '',
        directorReviewTime: directorReviewBeginTime
          ? [moment(directorReviewBeginTime), moment(directorReviewEndTime)]
          : '',
        finallyConfirmTime: finallyConfirmBeginTime
          ? [moment(finallyConfirmBeginTime), moment(finallyConfirmEndTime)]
          : '',
      });
    }
  }, [location.state])

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...fromparams,
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新,并获取数据
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
      validateFields((err, values) => {
        if (!err) {
          if (values.providerId) {
            getContrractname(values.providerId);
          }

          if (values.assessType) {
            getTarget1(values.assessType);
          }

          if (values.target1Id) {
            getTarget2(values.target1Id);
          }
          searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
        }
      });
    }
    setColumns(initialColumns);
    getPerformanceleader();
    return () => {
      //  清除数据
      dispatch({
        type: 'qualityassessment/clearDrop',
      });
    }
  }, []);

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
    total: tobeDealtarr.total || '',
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15);
    });
    setPageinations({ current: 1, pageSize: 15 });
  };

  const handleFocus = params => {
    switch (params) {
      case 'one':
        if (loading !== true && target1 && target1.length === 0) {
          message.error('请选择考核类型');
        }
        break;
      case 'two':
        if (loading !== true && target2 && target2.length === 0) {
          message.error('请选择有效的一级指标');
        }
        break;
      case 'contract':
        if (loading !== true && contractArr && contractArr.length === 0) {
          message.error('请选择有效的服务商');
        }
        break;
      case 'clause':
        if (loading !== true && clauseList && clauseList.length === 0) {
          message.error('请选择有效的二级指标');
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (values, option, params) => {
    if (values && option) {
      const {
        key,
        props: { value },
      } = option;
      switch (params) {
        case 'assessType':
          setFieldsValue({
            target1Name: '',
            target1Id: '',
            target2Name: '',
            target2Id: '',
          });
          getTarget1(key);
          break;
        case 'contract':
          setFieldsValue({
            contractName: key,
            contractId: value,
          });
          break;
        case 'target1Name':
          setFieldsValue({
            target1Name: value,
            target1Id: key,
            target2Name: '',
            target2Id: '',
            clauseName: '',
          });
          getTarget2(key);
          setTarget2Type(key);
          break;
        case 'target2Name':
          getclausedetail(key, scoreId);
          setFieldsValue({
            target2Name: value,
            target2Id: key,
            clauseId: '',
            clauseName: '',
          });
          break;
        case 'clause': {
          const {
            props: {
              children: {
                props: { children },
              },
            },
          } = option;
          setFieldsValue({
            clauseId: value,
            clauseName: children[1].props.children,
            assessValue: children[3].props.children,
          });
          break;
        }
        default:
          break;
      }
    } else {
      switch (params) {
        case 'contract':
          setFieldsValue({
            contractName: '',
            contractId: '',
          });
          break;
        case 'target1Name':
          setFieldsValue({
            target1Name: '',
            target1Id: '',
            target2Name: '',
            target2Id: '',
            clauseName: '',
          });
          break;
        case 'target2Name':
          setFieldsValue({
            target2Name: '',
            target2Id: '',
            clauseId: '',
            clauseName: '',
          });
          break;
        case 'clause': {
          setFieldsValue({
            clauseId: '',
            clauseName: ''
          });
          break;
        }
        default:
          break;
      }
    }
  };

  const download = () => {
    validateFields((err, values) => {
      const selectRow = (selectedRows || []).map(objs => {
        return objs.assessNo
      })
      const newValue = {
        ...values,
        assessNo: selectRow.toString(),
        assessBeginTime: values.timeoccurrence?.length
          ? moment(values.timeoccurrence[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        assessEndTime: values.timeoccurrence?.length
          ? moment(values.timeoccurrence[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 发生时间
        timeoccurrence: '',
        applyBeginTime: values.applyTime?.length
          ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        applyEndTime: values.applyTime?.length
          ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 登记时间
        applyTime: '',
        directorVerifyBeginTime: values.directorVerifyTime?.length
          ? moment(values.directorVerifyTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        directorVerifyEndTime: values.directorVerifyTime?.length
          ? moment(values.directorVerifyTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 业务负责人审核时间
        directorVerifyTime: '',
        expertVerifyBeginTime: values.expertVerifyTime?.length
          ? moment(values.expertVerifyTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        expertVerifyEndTime: values.expertVerifyTime?.length
          ? moment(values.expertVerifyTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 自动化科专责审核时间
        expertVerifyTime: '',
        providerConfirmBeginTime: values.providerConfirmTime?.length
          ? moment(values.providerConfirmTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        providerConfirmEndTime: values.providerConfirmTime?.length
          ? moment(values.providerConfirmTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 服务商确认时间
        providerConfirmTime: '',
        directorReviewBeginTime: values.directorReviewTime?.length
          ? moment(values.directorReviewTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        directorReviewEndTime: values.directorReviewTime?.length
          ? moment(values.directorReviewTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 业务负责人复核时间
        directorReviewTime: '',
        finallyConfirmBeginTime: values.finallyConfirmTime?.length
          ? moment(values.finallyConfirmTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        finallyConfirmEndTime: values.finallyConfirmTime?.length
          ? moment(values.finallyConfirmTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 服务绩效考核确认时间
        finallyConfirmTime: '',
      };
      switch (pagetitle) {
        case '服务绩效考核待办':
          dispatch({
            type: 'performanceappraisal/exportTodolist',
            payload: {
              ...newValue,
            },
          }).then(res => {
            const filename = `${pagetitle}_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
          break;
        case '服务绩效考核查询':
          dispatch({
            type: 'performanceappraisal/exportSearch',
            payload: {
              ...newValue,
            },
          }).then(res => {
            const filename = `${pagetitle}_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
          break;
        case '我的服务绩效考核':
          dispatch({
            type: 'performanceappraisal/exportmyAssess',
            payload: {
              ...newValue,
            },
          }).then(res => {
            const filename = `${pagetitle}_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
          break;
        default:
          break;
      }
      setSelectedRows([])
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedrows) => {
      setSelectedRows([...selectedrows]);
      setSelectedKeys([...selectedRowKeys]);
    },
  };

  const handleDelete = () => {
    if (selectedRows.length === 1) {
      return dispatch({
        type: 'performanceappraisal/assessDelete',
        payload: selectedRows[0].assessNo
      }).then(res => {
        if (res.code === 200) {
          searchdata({}, 1, 15);
        } else {
          message.error(res.msg)
        }
        setSelectedRows([])
      })
    }

    if (selectedRows.length !== 1) {
      message.info('请选择一条数据删除')
    }

    return []
  }

  const extra = (
    <>
      <Button type="primary" style={{ marginLeft: 8 }} onClick={handleSearch}>
        查询
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={handleReset}>
        重置
      </Button>
      <Button
        type="link"
        style={{ marginLeft: 8 }}
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
    </>
  );

  const creataColumns = () => {
    // columns
    initialColumns.length = 0;

    for(let i=0;i<formThead.length;i+=1) {
      const objs = {
        key: formThead[i].key,
        title: formThead[i].title,
        dataIndex: formThead[i].key,
        width: formThead[i].width,
        sorter : (a,b) => ThShort(a, b,formThead[i].key)
      };
      if (i === 0) {
        objs.render = (text, records) => {
          return <a onClick={() => todetail(records)}>{text}</a>;
        };
        objs.fixed = 'left';
        objs.width = 200;
      }
      if (
        formThead[i].title === '考核内容说明' ||
        formThead[i].title === '申诉内容' ||
        formThead[i].title === '自动化科复核说明' ||
        formThead[i].title === '服务绩效考核确认说明' ||
        formThead[i].title === '业务负责人审核说明' ||
        formThead[i].title === '关联合同名称'
      ) {
        objs.render = (text, records) => {
          objs.ellipsis = true;
          objs.width = 200;
          return (
            <Tooltip placement="topLeft" title={text}>
              {i === 0 ? <a onClick={() => todetail(records)}>{text}</a> : <span>{text}</span>}
            </Tooltip>
          );
        };
      }

      if (formThead[i].title === '序号') {
        objs.render = (text, records, index) => {
          return <a onClick={() => todetail(records)}>{(paginations.current - 1) * paginations.pageSize + (index + 1)}</a>;
        }
      }
      initialColumns.push(objs);
      setColumns(initialColumns);
    }
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

  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };


  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 568;
      } else {
        height = clientHeight - 510;
      }
    }
    return height;
  };

  const assessmentObject = getTypebyTitle('考核对象');
  const currentProssing = getTypebyTitle('当前处理环节');
  const assessmentSource = getTypebyTitle('考核来源');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="576"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <div className='noexplain'>
          <Row gutter={16}>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label="考核编号">
                  {getFieldDecorator('assessNo', {
                    initialValue: cacheinfo.assessNo,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="当前处理环节">
                  {getFieldDecorator('currentTaskName', {
                    initialValue: cacheinfo.currentTaskName,
                  })(
                    <Select getPopupContainer={e => e.parentNode} allowClear>
                      {currentProssing.map(obj => [
                        <Option key={obj.dict_code} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>



              <div style={{ display: expand ? 'block' : 'none' }}>

                {
                  pagetitle === '服务绩效考核查询' && (
                    <Col span={8}>
                      <Form.Item label="当前环节处理人">
                        {getFieldDecorator('assignee', {
                          initialValue: cacheinfo.assignee,
                        })(
                          <Input />,
                        )}
                      </Form.Item>
                    </Col>
                  )
                }

                <Col span={8}>
                  <Form.Item label="发生时间">
                    {getFieldDecorator('timeoccurrence', {
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

                <Col span={8}>
                  <Form.Item label="服务商">
                    {getFieldDecorator('providerName', {
                      initialValue: cacheinfo.providerName,
                    })(
                      <AutoComplete
                        getPopupContainer={e => e.parentNode}
                        dataSource={disableduser}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 600 }}
                        onSelect={(v, opt) => handleDisableduser(v, opt, 'provider')}
                      >
                        <Search
                          placeholder="可输入姓名搜索"
                          onSearch={values => SearchDisableduser(values, 'provider')}
                          allowClear
                        />
                      </AutoComplete>,
                    )}
                  </Form.Item>
                </Col>

                <Col style={{ display: 'none' }}>
                  {getFieldDecorator('providerId', {
                    initialValue: cacheinfo.providerId,
                  })(<Input />)}
                </Col>

                <Col span={8}>
                  <Form.Item label="关联合同名称">
                    {getFieldDecorator('contractId', {
                      initialValue: cacheinfo.contractId,
                    })(
                      <Select
                        getPopupContainer={e => e.parentNode}
                        placeholder="请选择"
                        onChange={(value, option) => handleChange(value, option, 'contractId')}
                        onFocus={() => handleFocus('contract')}
                        allowClear
                      >
                        {contractArr.map(obj => [
                          <Option key={obj.contractName} value={obj.id}>
                            <div className={styles.disableuser}>
                              <span>{obj.contractNo}</span>
                              <span>{obj.contractName}</span>
                            </div>
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col style={{ display: 'none' }}>
                  {getFieldDecorator('contractName', {
                    initialValue: cacheinfo.contractName,
                  })(<Input />)}
                </Col>

                <Col span={8}>
                  <Form.Item label="责任人">
                    {getFieldDecorator('directorName', {
                      initialValue: cacheinfo.directorName,
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="考核类型">
                    {getFieldDecorator('assessType', {
                      initialValue: cacheinfo.assessType,
                    })(
                      <Select
                        getPopupContainer={e => e.parentNode}
                        onChange={(value, option) => handleChange(value, option, 'assessType')}
                        allowClear
                      >
                        <Option key="1" value="1">
                          功能开发
                        </Option>
                        <Option key="2" value="2">
                          系统运维
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="考核内容说明">
                    {getFieldDecorator('assessContent', {
                      initialValue: cacheinfo.assessContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="一级指标">
                    {getFieldDecorator('target1Name', {
                      initialValue: cacheinfo.target1Name,
                    })(
                      <Select
                        getPopupContainer={e => e.parentNode}
                        onChange={(value, option) => handleChange(value, option, 'target1Name')}
                        onFocus={() => handleFocus('one')}
                        placeholder="请选择"
                        allowClear
                      >
                        {(target1 || []).map(obj => [
                          <Option key={obj.id} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="一级指标id">
                    {getFieldDecorator('target1Id', {
                      initialValue: cacheinfo.target1Id,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="二级指标">
                    {getFieldDecorator('target2Name', {
                      initialValue: cacheinfo.target2Name,
                    })(
                      <Select
                        getPopupContainer={e => e.parentNode}
                        onChange={(value, option) => handleChange(value, option, 'target2Name')}
                        onFocus={() => handleFocus('two')}
                        placeholder="请选择"
                        allowClear
                      >
                        {(target2 || []).map(obj => [
                          <Option key={obj.id} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label=" 二级指标">
                    {getFieldDecorator('target2Id', {
                      initialValue: cacheinfo.target2Id,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="是否申诉">
                    {getFieldDecorator('isAppeal', {
                      initialValue: cacheinfo.isAppeal,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        <Option key="1" value="1">
                          是
                        </Option>
                        <Option key="0" value="0">
                          否
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="考核对象">
                    {getFieldDecorator('assessObject', {
                      initialValue: cacheinfo.assessObject,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        {(assessmentObject || []).map(obj => [
                          <Option key={obj.dict_code} value={obj.dict_code}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item label="详细条款" {...forminladeLayout}>
                    {getFieldDecorator('clauseId', {
                      initialValue: cacheinfo.clauseId,
                    })(
                      <Select
                        getPopupContainer={e => e.parentNode}
                        onChange={(value, option) => handleChange(value, option, 'clause')}
                        onFocus={() => handleFocus('clause')}
                        allowClear
                      >
                        {((clauseList && clauseList.records) || []).map(obj => [
                          <Option key={obj.detailed} value={obj.id}>
                            <div className={styles.disableuser}>
                              <span>{obj.orderNo}</span>
                              <span>{obj.detailed}</span>
                              <span>{obj.calc}</span>
                              <span>{obj.scoreValue}</span>
                              <span>{obj.sources}</span>
                            </div>
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="得分">
                    {getFieldDecorator('clauseName', {
                      initialValue: cacheinfo.clauseName,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="得分">
                    {getFieldDecorator('assessValue', {
                      initialValue: cacheinfo.assessValue,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="登记人id">
                    {getFieldDecorator('register', {})(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerName', {
                      initialValue: cacheinfo.registerName,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记时间">
                    {getFieldDecorator('applyTime', {
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

                <Col span={8}>
                  <Form.Item label="业务负责人审核结果">
                    {getFieldDecorator('directorVerifyValue', {
                      initialValue: cacheinfo.directorVerifyValue,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        <Option key="1" value="1">
                          通过
                        </Option>
                        <Option key="0" value="0">
                          不通过
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="业务负责人审核说明">
                    {getFieldDecorator('directorVerifyContent', {
                      initialValue: cacheinfo.directorVerifyContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="业务负责人审核状态">
                    {getFieldDecorator('directorVerifyStatus', {
                      initialValue: cacheinfo.directorVerifyStatus,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        <Option key="待审核" value="待审核">
                          待审核
                        </Option>
                        <Option key="已审核" value="已审核">
                          已审核
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="业务负责审核人">
                    {getFieldDecorator('directorVerifierName', {
                      initialValue: cacheinfo.directorVerifierName,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="业务负责人审核时间">
                    {getFieldDecorator('directorVerifyTime', {
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

                <Col span={8}>
                  <Form.Item label="申诉内容">
                    {getFieldDecorator('appealContent', {
                      initialValue: cacheinfo.appealContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="申诉内容">
                    {getFieldDecorator('appealContent', {
                      initialValue: cacheinfo.appealContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                {performanceLeader && performanceLeader.length && (
                  <Col span={8}>
                    <Form.Item label="服务商确认人">
                      {getFieldDecorator('providerConfirmerName', {
                        initialValue: cacheinfo.providerConfirmerName,
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                )}

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="服务商确认人id">
                    {getFieldDecorator('providerConfirmerName', {
                      initialValue: cacheinfo.providerConfirmerName,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="服务商确认时间">
                    {getFieldDecorator('providerConfirmTime', {
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

                <Col span={8}>
                  <Form.Item label="自动化科复核结果">
                    {getFieldDecorator('directorReviewValue', {
                      initialValue: cacheinfo.directorReviewValue,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        <Option key="1" value="1">
                          同意
                        </Option>
                        <Option key="0" value="0">
                          不同意
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="自动化科复核说明">
                    {getFieldDecorator('directorReviewContent', {
                      initialValue: cacheinfo.directorReviewContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="自动化科复核人">
                    {getFieldDecorator('directorReviewerName', {
                      initialValue: cacheinfo.directorReviewerName,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="自动化科复核时间">
                    {getFieldDecorator('directorReviewTime', {
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

                <Col span={8}>
                  <Form.Item label="服务绩效考核确认结果">
                    {getFieldDecorator('finallyConfirmValue', {
                      initialValue: cacheinfo.finallyConfirmValue,
                    })(
                      <Select getPopupContainer={e => e.parentNode} allowClear>
                        <Option key="完成" value="完成">
                          完成
                        </Option>
                        <Option key="取消" value="取消">
                          取消
                        </Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="服务绩效考核确认说明">
                    {getFieldDecorator('finallyConfirmContent', {
                      initialValue: cacheinfo.finallyConfirmContent,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                {performanceLeader && performanceLeader.length && (
                  <Col span={8}>
                    <Form.Item label="服务绩效考核确认人">
                      {getFieldDecorator('finallyConfirmerName', {
                        initialValue: cacheinfo.finallyConfirmerName,
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                  </Col>
                )}

                <Col span={8} style={{ display: 'none' }}>
                  <Form.Item label="服务商确认人id">
                    {getFieldDecorator('finallyConfirmer', {
                      initialValue: cacheinfo.finallyConfirmer,
                    })(<Input />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="服务绩效考核确认时间">
                    {getFieldDecorator('finallyConfirmTime', {
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

                {
                  pagetitle === '服务绩效考核查询' && (
                    <Col span={8}>
                      <Form.Item label="考核来源">
                        {getFieldDecorator('source', {
                          initialValue: cacheinfo.source,
                        })(
                          <Select getPopupContainer={e => e.parentNode} allowClear>
                            {(assessmentSource || []).map(obj => [
                              <Option key={obj.dict_code} value={obj.title}>
                                {obj.title}
                              </Option>,
                            ])}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  )
                }
              </div>

              {expand ? (
                <Col span={24} style={{ textAlign: 'right' }}>
                  {extra}
                </Col>
              ) : (
                <Col span={8} style={{ marginTop: 4 }}>
                  {extra}
                </Col>
              )}
            </Form>
          </Row>
        </div>


        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>

          {
            pagetitle === '服务绩效考核查询' && (
              <Button
                type='danger'
                ghost
                onClick={handleDelete}
                style={{ marginLeft: 8 }}
              >删除</Button>
            )
          }
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
          columns={columns && columns.length === (initialColumns && initialColumns.length) ? initialColumns : columns}
          dataSource={tobeDealtarr.records}
          scroll={{ x: 1500, y: setTableHeight() }}
          rowKey={(records,index) => {return index} }
          rowSelection={rowSelection}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ performanceappraisal, qualityassessment, loading }) => ({
    tobeDealtarr: performanceappraisal.tobeDealtarr,
    clauseList: qualityassessment.clauseList,
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    loading: loading.models.performanceappraisal,
  }))(TobedealtList),
);
