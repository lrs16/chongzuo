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
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { operationPerson } from '@/services/common';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { providerList, scoreListpage, contractProvider, clauseListpage } from '../services/quality';

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

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const columns = [
  {
    title: '服务绩效编号',
    dataIndex: 'assessNo',
    key: 'assessNo',
    width: 200,
    render: (text, record) => {
      const todetail = () => {
        if (record.status === '完成') {
          router.push({
            pathname:
              '/ITSM/servicequalityassessment/serviceperformanceappraisal/performancequerydetail',
            query: {
              assessNo: record.assessNo,
              mainId: record.instanceId,
              taskId: record.currentTaskId,
              instanceId: record.instanceId,
              taskName: record.currentTaskName,
              orderNo: text,
              myOrder: true,
              search: true,
            },
          });
        } else {
          router.push({
            pathname: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
            query: {
              assessNo: record.assessNo,
              mainId: record.instanceId,
              taskId: record.currentTaskId,
              instanceId: record.instanceId,
              taskName: record.currentTaskName,
              orderNo: text,
              myOrder: true,
            },
          });
        }
      };
      return <a onClick={todetail}>{text}</a>;
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
    render: (text, record) => {
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
    render: (text, record) => {
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
    width: 150,
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
  {
    title: '关联合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: 150,
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
    width: 150,
  },
  {
    title: '业务负责人审核结果',
    dataIndex: 'directorVerifyValue',
    key: 'directorVerifyValue',
    width: 180,
    // render: (text, record) => {
    //   return <span>{text === '1' ? '通过' : text === '0' ? '不通过' : ''}</span>
    // }
  },
  {
    title: '业务负责人审核说明',
    dataIndex: 'directorVerifyContent',
    key: 'directorVerifyContent',
    width: 180,
  },
  {
    title: '业务负责人审核状态',
    dataIndex: 'directorVerifyStatus',
    key: 'directorVerifyStatus',
    width: 180,
  },
  {
    title: '业务负责人审核人',
    dataIndex: 'directorName',
    key: 'directorName',
    width: 180,
  },
  {
    title: '业务负责人审核时间',
    dataIndex: 'directorVerifyTime',
    key: 'directorVerifyTime',
    width: 180,
  },
  {
    title: '自动化科专责审核结果',
    dataIndex: 'expertVerifyValue',
    key: 'expertVerifyValue',
    width: 180,
    // render: (text, record) => {
    //   return <span>{text === '1' ? '通过' : text === '0' ? '不通过' : ''}</span>
    // }
  },
  {
    title: '自动化科专责审核说明',
    dataIndex: 'expertVerifyContent',
    key: 'expertVerifyContent',
    width: 180,
  },
  {
    title: '自动化科专责审核状态',
    dataIndex: 'expertVerifyStatus',
    key: 'expertVerifyStatus',
    width: 180,
  },
  {
    title: '自动化科专责审核人',
    dataIndex: 'expertVerifierName',
    key: 'expertVerifierName',
    width: 180,
  },
  {
    title: '自动化科专责审核时间',
    dataIndex: 'expertVerifyTime',
    key: 'expertVerifyTime',
    width: 180,
  },
  {
    title: '是否申诉',
    dataIndex: 'isAppeal',
    key: 'isAppeal',
    width: 150,
    // render: (text, record) => {
    //   return <span>{text === '1' ? '是' : text === '0' ? '否' : ''}</span>
    // }
  },
  {
    title: '申诉内容',
    dataIndex: 'appealContent',
    key: 'appealContent',
    width: 150,
    render: (text, record) => {
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
    width: 150,
  },
  {
    title: '业务负责人复核结果',
    dataIndex: 'directorReviewValue',
    key: 'directorReviewValue',
    width: 180,
    // render: (text, record) => {
    //   return <span>{text === '1' ? '通过' : text === '0' ? '不通过' : ''}</span>
    // }
  },
  {
    title: '业务负责人复核说明',
    dataIndex: 'directorReviewContent',
    key: 'directorReviewContent',
    width: 180,
    ellipsis: true,
    render: (text, record) => {
      return (
        <Tooltip title={text} placement="topLeft">
          <span>{text}</span>
        </Tooltip>
      );
    },
  },
  {
    title: '业务负责人复核人',
    dataIndex: 'directorReviewerName',
    key: 'directorReviewerName',
    width: 180,
  },
  {
    title: '业务负责审核人',
    dataIndex: 'directorVerifierName',
    key: 'directorVerifierName',
    width: 180,
  },
  {
    title: '业务负责人复核时间',
    dataIndex: 'directorReviewTime',
    key: 'directorReviewTime',
    width: 180,
  },
  {
    title: '服务绩效考核确认结果',
    dataIndex: 'finallyConfirmValue',
    key: 'finallyConfirmValue',
    width: 180,
    // render: (text, record) => {
    //   return <span>{text === '1' ? '确认考核' : text === '0' ? '取消考核' : ''}</span>
    // }
  },
  {
    title: '服务绩效考核确认说明',
    dataIndex: 'finallyConfirmContent',
    key: 'finallyConfirmContent',
    width: 180,
    ellipsis: true,
    render: (text, record) => {
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
    width: 180,
  },
];
function Assessment(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue, resetFields },
    tobeDealtarr,
    assessmyAssessarr,
    target1,
    target2,
    clauseList,
    userinfo,
    dispatch,
    location,
    loading,
  } = props;
  const [performanceLeader, setPerformanceLeader] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [contractArr, setContractArr] = useState([]);
  const [expand, setExpand] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [disablelist, setDisabledList] = useState([]); // 服务商
  const [contractlist, setContractlist] = useState([]); // 合同
  const [scorelist, setScorelist] = useState([]); // 评分细则
  const [clauselist, setClauselist] = useState([]); // 详细条款
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id
  const [target1Type, setTarget1Type] = useState('功能开发'); //  设置指标类型
  const [target2Type, setTarget2Type] = useState('');
  const [spinloading, setSpinLoading] = useState(true);
  const [tabrecord, setTabRecord] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

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
  const getclausedetail = (targetId, scoreId) => {
    console.log(11);
    dispatch({
      type: 'qualityassessment/clauseListpage',
      payload: {
        targetId,
        scoreId,
        pageNum: 1,
        pageSize: 1000,
      },
    });
  };

  //  获取合同名称
  const getContrractname = id => {
    contractProvider({ id }).then(res => {
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

  // 自动完成关联合同名称
  const contractNamedata = contractlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.contractNo}</span>
          <span>{opt.contractName}</span>
          <span>{opt.signTime}</span>
          <span>{opt.dueTime}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 自动完成评分细则
  const scorenameList = scorelist.map(opt => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.scoreNo}</span>
          <span>{opt.scoreName}</span>
        </div>
      </Spin>
    </Option>
  ));

  // 请求服务商
  const SearchDisableduser = (value, type) => {
    const requestData = {
      value,
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
    const {
      id,
      providerName,
      scoreName,
      contractName,
      assessType,
      clauseName,
    } = opt.props.disableuser;
    switch (type) {
      case 'provider':
        setFieldsValue({
          provider: providerName, // 服务商
          providerId: id, // 服务商id
          contract: '',
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

    dispatch({
      type: 'performanceappraisal/assessmyAssess',
      payload: {
        ...newvalues,
        pageNum: page,
        pageSize,
      },
    });
    setTabRecord({ ...newvalues });
  };

  const record = {
    assessNo: '',
    currentTaskName: '',
    provider: '',
    contractName: '',
    contractId: '',
    directorId: '',
    directorName: '',
    assessType: '',
    target1Name: '',
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
    directorVerifier: '',
    expertVerifyValue: '',
    expertVerifyContent: '',
    expertVerifyStatus: '',
    expertVerifier: '',
    isAppeal: '',
    appealContent: '',
    providerConfirmerName: '',
    providerConfirmer: '',
    directorReviewValue: '',
    directorReviewContent: '',
    directorReviewer: '',
    finallyConfirmContent: '',
    finallyConfirmValue: '',
    finallyConfirmerName: '',
    finallyConfirmer: '',
    finallyConfirmTime: '',
    providerId: '',
    paginations,
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
              ...tabrecord,
              // registerTime: '',
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
        setExpand(false);
      }
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const {
          applyBeginTime,
          applyEndTime,
          directorVerifyBeginTime,
          directorVerifyEndTime,
          assessBeginTime,
          assessEndTime,
          expertVerifyBeginTime,
          expertVerifyEndTime,
          providerConfirmBeginTime,
          providerConfirmEndTime,
          directorReviewBeginTime,
          directorReviewEndTime,
          finallyConfirmBeginTime,
          finallyConfirmEndTime,
        } = location.state.cacheinfo;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
        setFieldsValue({
          applyTime: applyBeginTime ? [moment(applyBeginTime), moment(applyEndTime)] : '',
          directorVerifyTime: applyBeginTime
            ? [moment(directorVerifyBeginTime), moment(directorVerifyEndTime)]
            : '',
          timeoccurrence: applyBeginTime ? [moment(assessBeginTime), moment(assessEndTime)] : '',
          expertVerifyTime: applyBeginTime
            ? [moment(expertVerifyBeginTime), moment(expertVerifyEndTime)]
            : '',
          providerConfirmTime: applyBeginTime
            ? [moment(providerConfirmBeginTime), moment(providerConfirmEndTime)]
            : '',
          directorReviewTime: applyBeginTime
            ? [moment(directorReviewBeginTime), moment(directorReviewEndTime)]
            : '',
          finallyConfirmTime: applyBeginTime
            ? [moment(finallyConfirmBeginTime), moment(finallyConfirmEndTime)]
            : '',
        });
      }
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    //  清除数据
    dispatch({
      type: 'qualityassessment/clearDrop',
    });
    if (cacheinfo !== undefined) {
      validateFields((err, values) => {
        console.log('values: ', values);
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
  }, []);

  useEffect(() => {
    getPerformanceleader();
    validateFields((err, value) => {
      searchdata(value, 1, 15);
    });
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
    total: assessmyAssessarr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize);
    });
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
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key,
          target2Name: '',
          target2Id: '',
        });
        getTarget2(key);
        setTarget2Type(key);
        break;
      case 'target2Name':
        setFieldsValue({
          target2Name: value,
          target2Id: key,
          clauseName: '',
        });
        getclausedetail(key, scoreId);
        break;
      case 'clause':
        setFieldsValue({
          clauseId: key,
        });
        break;
      case 'contractId':
        setFieldsValue({
          contractId: value,
          contractName: key,
        });
        break;

      default:
        break;
    }
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
  };

  const selectOnchange = (value, option, type) => {
    console.log('value: ', value);
    const {
      props: { children },
    } = option;
    switch (type) {
      case 'director':
        setFieldsValue({
          directorName: children,
          directorId: value,
        });
        break;
      case 'providerConfirmer':
        setFieldsValue({
          providerConfirmerName: children,
          providerConfirmer: value,
        });
        break;
      case 'finallyConfirmerName':
        setFieldsValue({
          finallyConfirmerName: children,
          finallyConfirmer: value,
        });
        break;

      default:
        break;
    }
  };

  const download = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'performanceappraisal/exportmyAssess',
        payload: {
          ...values,
          assessNo: selectedKeys.toString(),
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
        },
      }).then(res => {
        const filename = `服务绩效待办_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
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

  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedKeys([...index]);
    },
  };

  console.log(clauseList, 'clauseList');

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
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="考核编号">
                {getFieldDecorator('assessNo', {
                  initialValue: cacheinfo.assessNo,
                })(<Input />)}
              </Form.Item>
            </Col>

            {/* <Col span={8}>
              <Form.Item label='考核状态'>
                {
                  getFieldDecorator('assessStatus', {})
                    (<Input />)
                }
              </Form.Item>
            </Col> */}

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('currentTaskName', {
                  initialValue: cacheinfo.currentTaskName,
                })(
                  <Select>
                    <Option key="服务绩效考核登记" value="服务绩效考核登记">
                      服务绩效考核登记
                    </Option>
                    <Option key="业务负责人审核" value="业务负责人审核">
                      业务负责人审核
                    </Option>
                    <Option key="自动化科专责审核" value="自动化科专责审核">
                      自动化科专责审核
                    </Option>
                    <Option key="服务商确认" value="服务商确认">
                      服务商确认
                    </Option>
                    <Option key="服务绩效考核确认" value="服务绩效考核确认">
                      服务绩效考核确认
                    </Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <div style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="发生时间">
                  {getFieldDecorator('timeoccurrence', {
                    initialValue: cacheinfo.beginTime
                      ? [moment(cacheinfo.assessBeginTime), moment(cacheinfo.assessEndTime)]
                      : '',
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
                  {getFieldDecorator('provider', {
                    initialValue: cacheinfo.provider,
                  })(
                    <AutoComplete
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
                      placeholder="请选择"
                      allowClear
                      onChange={(value, option) => handleChange(value, option, 'contractId')}
                      onFocus={() => handleFocus('contract')}
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

              {performanceLeader && performanceLeader.length && (
                <Col span={8}>
                  <Form.Item label="责任人">
                    {getFieldDecorator('directorId', {
                      initialValue: cacheinfo.directorId,
                    })(
                      <Select
                        onSelect={(value, option) => selectOnchange(value, option, 'director')}
                      >
                        {performanceLeader.map(obj => [
                          <Option key={obj.key} value={obj.key}>
                            {obj.value}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              )}

              <Col span={8} style={{ display: 'none' }}>
                <Form.Item label="责任人id">
                  {getFieldDecorator('directorName', {
                    initialValue: cacheinfo.directorName,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="考核类型">
                  {getFieldDecorator('assessType', {
                    initialValue: cacheinfo.assessType,
                  })(
                    <Select onChange={(value, option) => handleChange(value, option, 'assessType')}>
                      <Option key="1" value="功能开发">
                        功能开发
                      </Option>
                      <Option key="2" value="系统运维">
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
                      onChange={(value, option) => handleChange(value, option, 'target1Name')}
                      onFocus={() => handleFocus('one')}
                      placeholder="请选择"
                      allowClear
                    >
                      {target1.map(obj => [
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
                      onChange={(value, option) => handleChange(value, option, 'target2Name')}
                      onFocus={() => handleFocus('two')}
                      placeholder="请选择"
                      allowClear
                    >
                      {target2.map(obj => [
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

              <Col span={16}>
                <Form.Item label="详细条款" {...forminladeLayout}>
                  {getFieldDecorator('clauseName', {
                    initialValue: cacheinfo.clauseName,
                  })(
                    <Select
                      onChange={(value, option) => handleChange(value, option, 'clause')}
                      onFocus={() => handleFocus('clause')}
                    >
                      {((clauseList && clauseList.records) || []).map(obj => [
                        <Option key={obj.id} value={obj.detailed}>
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

              <Col span={8}>
                <Form.Item label="得分">
                  {getFieldDecorator('assessValue', {
                    initialValue: cacheinfo.assessValue,
                  })(<Input />)}
                </Form.Item>
              </Col>

              {/* {performanceLeader && performanceLeader.length && (
          <Col span={8}>
            <Form.Item label='登记人'>
              {
                getFieldDecorator('register', {
                })
                  (
                    <Select onSelect={selectOnchange}>
                      {performanceLeader.map(obj => [
                        <Option key={obj.key} value={obj.key}>
                          {obj.value}
                        </Option>
                      ])}

                    </Select>
                  )
              }
            </Form.Item>
          </Col>
        )}


        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label='登记人id'>
            {
              getFieldDecorator('register', {
              })
                (<Input />)
            }
          </Form.Item>
        </Col> */}

              <Col span={8}>
                <Form.Item label="登记人">
                  {getFieldDecorator('register', {
                    initialValue: cacheinfo.register,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="登记时间">
                  {getFieldDecorator('applyTime', {
                    initialValue: cacheinfo.applyBeginTime
                      ? [moment(cacheinfo.applyBeginTime), moment(cacheinfo.applyEndTime)]
                      : '',
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
                    <Select>
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
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="业务负责审核人">
                  {getFieldDecorator('directorVerifier', {
                    initialValue: cacheinfo.directorVerifier,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="业务负责人审核时间">
                  {getFieldDecorator('directorVerifyTime', {
                    initialValue: cacheinfo.directorVerifyBeginTime
                      ? [
                          moment(cacheinfo.directorVerifyBeginTime),
                          moment(cacheinfo.directorVerifyEndTime),
                        ]
                      : '',
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
                <Form.Item label="自动化科专责审核结果">
                  {getFieldDecorator('expertVerifyValue', {
                    initialValue: cacheinfo.expertVerifyValue,
                  })(
                    <Select>
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
                <Form.Item label="自动化科专责审核说明">
                  {getFieldDecorator('expertVerifyContent', {
                    initialValue: cacheinfo.expertVerifyContent,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="自动化科专责审核状态">
                  {getFieldDecorator('expertVerifyStatus', {
                    initialValue: cacheinfo.expertVerifyStatus,
                  })(
                    <Select>
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
                <Form.Item label="自动化科专责审核人">
                  {getFieldDecorator('expertVerifier', {
                    initialValue: cacheinfo.expertVerifier,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="自动化科专责审核时间">
                  {getFieldDecorator('expertVerifyTime', {
                    initialValue: cacheinfo.expertVerifyBeginTime
                      ? [
                          moment(cacheinfo.expertVerifyBeginTime),
                          moment(cacheinfo.expertVerifyEndTime),
                        ]
                      : '',
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
                <Form.Item label="是否申诉">
                  {getFieldDecorator('isAppeal', {
                    initialValue: cacheinfo.isAppeal,
                  })(
                    <Select>
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
                <Form.Item label="申诉内容">
                  {getFieldDecorator('appealContent', {
                    initialValue: cacheinfo.appealContent,
                  })(<Input />)}
                </Form.Item>
              </Col>

              {performanceLeader && performanceLeader.length && (
                <Col span={8}>
                  <Form.Item label="服务商确认人">
                    {getFieldDecorator('providerConfirmer', {
                      initialValue: cacheinfo.providerConfirmer,
                    })(
                      <Select
                        onSelect={(value, option) =>
                          selectOnchange(value, option, 'providerConfirmer')
                        }
                      >
                        {performanceLeader.map(obj => [
                          <Option key={obj.key} value={obj.key}>
                            {obj.value}
                          </Option>,
                        ])}
                      </Select>,
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
                    initialValue: cacheinfo.providerConfirmBeginTime
                      ? [
                          moment(cacheinfo.providerConfirmBeginTime),
                          moment(cacheinfo.providerConfirmEndTime),
                        ]
                      : '',
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
                <Form.Item label="业务负责人复核结果">
                  {getFieldDecorator('directorReviewValue', {
                    initialValue: cacheinfo.directorReviewValue,
                  })(
                    <Select>
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
                <Form.Item label="业务负责人复核说明">
                  {getFieldDecorator('directorReviewContent', {
                    initialValue: cacheinfo.directorReviewContent,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="业务负责人复核人">
                  {getFieldDecorator('directorReviewer', {
                    initialValue: cacheinfo.directorReviewer,
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="业务负责人复核时间">
                  {getFieldDecorator('directorReviewTime', {
                    initialValue: cacheinfo.directorReviewBeginTime
                      ? [
                          moment(cacheinfo.directorReviewBeginTime),
                          moment(cacheinfo.directorReviewEndTime),
                        ]
                      : '',
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
                    <Select>
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
                      <Select
                        onSelect={(value, option) =>
                          selectOnchange(value, option, 'finallyConfirmerName')
                        }
                      >
                        {performanceLeader.map(obj => [
                          <Option key={obj.key} value={obj.key}>
                            {obj.value}
                          </Option>,
                        ])}
                      </Select>,
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

              {/* <Col span={8}>
                <Form.Item label='服务绩效考核确认人'>
                  {
                    getFieldDecorator('finallyConfirmer', {})
                      (<Input />)
                  }
                </Form.Item>
              </Col> */}

              <Col span={8}>
                <Form.Item label="服务绩效考核确认时间">
                  {getFieldDecorator('finallyConfirmTime', {
                    initialValue: cacheinfo.finallyConfirmBeginTime
                      ? [
                          moment(cacheinfo.finallyConfirmBeginTime),
                          moment(cacheinfo.finallyConfirmEndTime),
                        ]
                      : '',
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

        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={assessmyAssessarr.records}
          scroll={{ x: 1500, y: 700 }}
          rowKey={records => records.assessNo}
          rowSelection={rowSelection}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ performanceappraisal, qualityassessment, itsmuser, loading }) => ({
    tobeDealtarr: performanceappraisal.tobeDealtarr,
    clauseList: qualityassessment.clauseList,
    assessmyAssessarr: performanceappraisal.assessmyAssessarr,
    target2: qualityassessment.target2,
    target1: qualityassessment.target1,
    loading: loading.models.performanceappraisal,
  }))(Assessment),
);
