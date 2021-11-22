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
  message,
  Cascader,
  Popover,
  Checkbox,
  Tooltip
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


function QueryList(props) {
  // const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    location: { query:
      {
        // dictCode,
        type,
        status,
        addTimeBegin,
        addTimeEnd,
        currentNode,
        // statName,
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
  const [columns, setColumns] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  let formThead;

  const handledownFileToZip = (id, no) => {
    dispatch({
      type: 'fault/downloadzip',
      payload: {
        id,
      },
    }).then(res => {
      if (res.size === 0 || res.type === 'text/html') {
        message.error('该工单没有上传附件，下载失败');
      } else {
        const filename = `${no}_附件.zip`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  }

  const gotoDetail = (text, record) => {
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
    router.push({
      pathname: `/ITSM/faultmanage/querylist/record`,
      query: {
        id: record.id,
        No: text,
      },
    });
  }

  const initialColumns = [
    {
      title: '故障编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      render: (text, record) => {
        return <a onClick={() => gotoDetail(text, record)}>{text}</a>;
      },
    },
    {
      title: '故障发生时间',
      dataIndex: 'registerOccurTime',
      key: 'registerOccurTime',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
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
      title: '故障概要',
      dataIndex: 'content',
      key: 'content',
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
      title: '故障详细描述',
      dataIndex: 'handleContent',
      key: 'handleContent',
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
      title: '影响范围',
      dataIndex: 'registerScope',
      key: 'registerScope',
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
      title: '处理过程',
      dataIndex: 'handleProcess',
      key: 'handleProcess',
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
      title: '故障类型',
      dataIndex: 'type',
      key: 'type',
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
      title: '故障措施或建议',
      dataIndex: 'handleAdvise',
      key: 'handleAdvise',
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
      title: '是否需要提供故障报告',
      dataIndex: 'checkOneReportSign',
      key: 'checkOneReportSign',
      width: 200,
    },
    {
      title: '系统运维商确认总结人',
      dataIndex: 'finishUser',
      key: 'finishUser',
      width: 200,
    },
    {
      title: '是否已提交故障处理记录表',
      dataIndex: 'handleReport',
      key: 'handleReport',
      width: 250,
    },
    {
      title: '系统运维商处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 150,
    },
    {
      title: '责任单位',
      dataIndex: 'confirmBlame',
      key: 'confirmBlame',
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
      title: '系统运维商处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
      width: 180,
    },
    {
      title: '故障报告要求上传时间',
      dataIndex: 'finishRequiredTime',
      key: 'finishRequiredTime',
      width: 200,
    },
    {
      title: '当前环节处理人',
      dataIndex: 'taskUser',
      key: 'taskUser',
      width: 150,
    },
    {
      title: '故障名称',
      dataIndex: 'title',
      key: 'title',
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
      title: '故障来源',
      dataIndex: 'source',
      key: 'source',
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
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: '故障责任方',
      dataIndex: 'blame',
      key: 'blame',
      width: 120,
    },
    {
      title: '登记ID',
      dataIndex: 'registerId',
      key: 'registerId',
      width: 200,
    },
    {
      title: '严重程度',
      dataIndex: 'registerLevel',
      key: 'registerLevel',
      width: 120,
    },
    {
      title: '故障地点',
      dataIndex: 'registerAddress',
      key: 'registerAddress',
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
      title: '系统模块',
      dataIndex: 'registerModel',
      key: 'registerModel',
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
      title: '是否影响业务',
      dataIndex: 'registerEffect',
      key: 'registerEffect',
      width: 120,
    },
    {
      title: '登记人单位名称',
      dataIndex: 'registerUnit',
      key: 'registerUnit',
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
      title: '登记人部门名称',
      dataIndex: 'registerDept',
      key: 'registerDept',
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
      title: '登记人名称',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 120,
    },
    {
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
    },
    {
      title: '登记状态',
      dataIndex: 'registerStatus',
      key: 'registerStatus',
      width: 120,
    },
    {
      title: '登记流程节点实例ids',
      dataIndex: 'registerFlowNodeInstanceIds',
      key: 'registerFlowNodeInstanceIds',
      width: 200,
    },
    {
      title: '系统运维商审核ID',
      dataIndex: 'checkOneId',
      key: 'checkOneId',
      width: 150,
    },
    {
      title: '系统运维商审核结果',
      dataIndex: 'checkOneResult',
      key: 'checkOneResult',
      width: 170,
    },
    {
      title: '系统运维商审核意见',
      dataIndex: 'checkOneOpinion',
      key: 'checkOneOpinion',
      width: 170,
      onCell: () => {
        return {
          style: {
            maxWidth: 170,
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
      title: '系统运维商审核人单位',
      dataIndex: 'checkOneUnit',
      key: 'checkOneUnit',
      width: 190,
      onCell: () => {
        return {
          style: {
            maxWidth: 190,
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
      title: '系统运维商审核人部门',
      dataIndex: 'checkOneDept',
      key: 'checkOneDept',
      width: 190,
      onCell: () => {
        return {
          style: {
            maxWidth: 190,
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
      title: '系统运维商审核人',
      dataIndex: 'checkOneUser',
      key: 'checkOneUser',
      width: 170,
    },
    {
      title: '系统运维商审核时间',
      dataIndex: 'checkOneTime',
      key: 'checkOneTime',
      width: 190,
    },
    {
      title: '系统运维商审核状态',
      dataIndex: 'checkOneStatus',
      key: 'checkOneStatus',
      width: 190,
    },
    {
      title: '系统运维商流程节点实例ids',
      dataIndex: 'checkOneFlowNodeInstanceIds',
      key: 'checkOneFlowNodeInstanceIds',
      width: 220,
    },
    {
      title: '系统运维商故障责任方',
      dataIndex: 'checkOneBlame',
      key: 'checkOneBlame',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
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
      title: '处理ID',
      dataIndex: 'handleId',
      key: 'handleId',
      width: 150,
    },
    // {
    //   title: '处理结果',
    //   dataIndex: 'handleResult',
    //   key: 'handleResult',
    //   width: 150,
    //   onCell: () => {
    //     return {
    //       style: {
    //         maxWidth: 150,
    //         overflow: 'hidden',
    //         whiteSpace: 'nowrap',
    //         textOverflow: 'ellipsis',
    //         cursor: 'pointer'
    //       }
    //     }
    //   },
    //   render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    // },
    {
      title: '故障分析及原因',
      dataIndex: 'handleReason',
      key: 'handleReason',
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
      title: '处理开始时间',
      dataIndex: 'handleStartTime',
      key: 'handleStartTime',
      width: 150,
    },
    {
      title: '处理完成时间',
      dataIndex: 'handleEndTime',
      key: 'handleEndTime',
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
      title: '处理人单位',
      dataIndex: 'handleUnit',
      key: 'handleUnit',
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
      title: '处理人部门',
      dataIndex: 'handleDept',
      key: 'handleDept',
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
      title: '处理时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
      width: 150,
    },
    {
      title: '处理状态',
      dataIndex: 'handleStatus',
      key: 'handleStatus',
      width: 150,
    },
    {
      title: '接单时间',
      dataIndex: 'handleAddTime',
      key: 'handleAddTime',
      width: 150,
    },
    {
      title: '处理流程节点实例ids',
      dataIndex: 'handleFlowNodeInstanceIds',
      key: 'handleFlowNodeInstanceIds',
      width: 200,
    },
    {
      title: '确认ID',
      dataIndex: 'confirmId',
      key: 'confirmId',
      width: 150,
    },
    {
      title: '确认结果',
      dataIndex: 'confirmResult',
      key: 'confirmResult',
      width: 150,
    },
    {
      title: '确认说明',
      dataIndex: 'confirmContent',
      key: 'confirmContent',
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
    // {
    //   title: '确认结果',
    //   dataIndex: 'confirmResult',
    //   key: 'confirmResult',
    //   width: 150,
    // },
    {
      title: '确认人单位',
      dataIndex: 'confirmUnit',
      key: 'confirmUnit',
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
      title: '确认人部门',
      dataIndex: 'confirmDept',
      key: 'confirmDept',
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
      title: '确认人',
      dataIndex: 'confirmUser',
      key: 'confirmUser',
      width: 150,
    },
    {
      title: '确认时间',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      width: 150,
    },
    {
      title: '确认状态',
      dataIndex: 'confirmStatus',
      key: 'confirmStatus',
      width: 150,
    },
    {
      title: '确认流程节点实例ids',
      dataIndex: 'confirmFlowNodeInstanceIds',
      key: 'confirmFlowNodeInstanceIds',
      width: 200,
    },
    // {
    //   title: '故障责任方',
    //   dataIndex: 'confirmBlame',
    //   key: 'confirmBlame',
    //   width: 120,
    //   onCell: () => {
    //     return {
    //       style: {
    //         maxWidth: 120,
    //         overflow: 'hidden',
    //         whiteSpace: 'nowrap',
    //         textOverflow: 'ellipsis',
    //         cursor: 'pointer'
    //       }
    //     }
    //   },
    //   render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    // },
    {
      title: '自动化科业务负责人审核ID',
      dataIndex: 'checkTwoId',
      key: 'checkTwoId',
      width: 220,
    },
    {
      title: '自动化科业务负责人审核结果',
      dataIndex: 'checkTwoResult',
      key: 'checkTwoResult',
      width: 230,
    },
    {
      title: '自动化科业务负责人审核意见',
      dataIndex: 'checkTwoOpinion',
      key: 'checkTwoOpinion',
      width: 230,
      onCell: () => {
        return {
          style: {
            maxWidth: 230,
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
      title: '自动化科业务负责人是否上传故障报告',
      dataIndex: 'checkTwoReportSign',
      key: 'checkTwoReportSign',
      width: 270,
    },
    {
      title: '自动化科业务负责人审核人单位',
      dataIndex: 'checkTwoUnit',
      key: 'checkTwoUnit',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
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
      title: '自动化科业务负责人审核人部门',
      dataIndex: 'checkTwoDept',
      key: 'checkTwoDept',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
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
      title: '自动化科业务负责人审核人',
      dataIndex: 'checkTwoUser',
      key: 'checkTwoUser',
      width: 200,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
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
      title: '自动化科业务负责人审核时间',
      dataIndex: 'checkTwoTime',
      key: 'checkTwoTime',
      width: 220,
    },
    {
      title: '自动化科业务负责人审核状态',
      dataIndex: 'checkTwoStatus',
      key: 'checkTwoStatus',
      width: 220,
    },
    {
      title: '自动化科业务负责人流程节点实例ids',
      dataIndex: 'checkTwoFlowNodeInstanceIds',
      key: 'checkTwoFlowNodeInstanceIds',
      width: 300,
    },
    {
      title: '自动化科业务负责人故障责任方',
      dataIndex: 'checkTwoBlame',
      key: 'checkTwoBlame',
      width: 270,
      onCell: () => {
        return {
          style: {
            maxWidth: 270,
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
      title: '总结ID',
      dataIndex: 'finishId',
      key: 'finishId',
      width: 150,
    },
    {
      title: '总结说明',
      dataIndex: 'finishContent',
      key: 'finishContent',
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
    // {
    //   title: '要求上传时间',
    //   dataIndex: 'finishRequiredTime',
    //   key: 'finishRequiredTime',
    //   width: 150,
    //   onCell: () => {
    //     return {
    //       style: {
    //         maxWidth: 150,
    //         overflow: 'hidden',
    //         whiteSpace: 'nowrap',
    //         textOverflow: 'ellipsis',
    //         cursor: 'pointer'
    //       }
    //     }
    //   },
    //   render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    // },
    {
      title: '实际上传时间',
      dataIndex: 'finishPracticeTime',
      key: 'finishPracticeTime',
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
      title: '总结人单位',
      dataIndex: 'finishUnit',
      key: 'finishUnit',
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
      title: '总结人部门',
      dataIndex: 'finishDept',
      key: 'finishDept',
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
      title: '总结时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
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
      title: '总结状态',
      dataIndex: 'finishStatus',
      key: 'finishStatus',
      width: 150,
    },
    {
      title: '总结流程节点实例ids',
      dataIndex: 'finishFlowNodeInstanceIds',
      key: 'finishFlowNodeInstanceIds',
      width: 200,
    },
    {
      title: '待办ID',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 150,
    },
    {
      title: '待办用户',
      dataIndex: 'taskUser',
      key: 'taskUser',
      width: 150,
    },
    {
      title: '待办用户ID',
      dataIndex: 'taskUserId',
      key: 'taskUserId',
      width: 150,
    },
    {
      title: '当前流程环境',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
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
        addTime: [moment(addTimeBegin), moment(addTimeEnd)] || '',
      })
    }
    //  getFaultlist();
  }, []);

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'fault/getfaultQueryList',
      payload: {
        ...values,
        // registerTimeBegin: values.registerTime?.length ? moment(values.registerTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        // registerTimeEnd: values.registerTime?.length ? moment(values.registerTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTimeBegin: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTimeEnd: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        addTime: values.addTime?.length ? [moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
        registerTime: '',
        handleStartTimeBegin: values.handleTime?.length ? moment(values.handleTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleStartTimeEnd: values.handleTime?.length ? moment(values.handleTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        handleTime: values.handleTime?.length ? [moment(values.handleTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.handleTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
        type: values.type ? (values.type).slice(-1)[0] : '',
        registerOccurTimeBegin: values.registerOccurTime?.length ? moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerOccurTimeEnd: values.registerOccurTime?.length ? moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        registerOccurTime: values.registerOccurTime?.length ? [moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
        pageNum: page,
        pageSize: paginations.pageSize,
      },
    });
    setTabRecord({
      ...values,
      sendTime: '',
      addTimeBegin: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      addTimeEnd: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      addTime: values.addTime?.length ? [moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
      handleStartTimeBegin: values.handleStartTimeBegin ? values.handleStartTimeBegin.format('YYYY-MM-DD HH:mm:ss') : '',
      handleStartTimeEnd: values.handleStartTimeEnd ? values.handleStartTimeEnd.format('YYYY-MM-DD HH:mm:ss') : '',
      registerOccurTimeBegin: values.registerOccurTime?.length ? moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      registerOccurTimeEnd: values.registerOccurTime?.length ? moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      registerOccurTime: values.registerOccurTime?.length ? [moment(values.registerOccurTime[0]).format('YYYY-MM-DD HH:mm:ss'), moment(values.registerOccurTime[1]).format('YYYY-MM-DD HH:mm:ss')] : '',
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
    const filterColumns = columns.filter((currentValue) => {
      return currentValue.title !== '操作'
    })

    const exportColumns = filterColumns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title
      }
    })
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            ...values,
            sendTime: '',
            registerOccurTimeBegin: values.registerOccurTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            addTimeBegin: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            addTimeEnd: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            handleStartTimeBegin: values.handleStartTimeBegin ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            handleStartTimeEnd: values.handleStartTimeEnd ? values.registerOccurTimeBegin.format('YYYY-MM-DD') : '',
            type: values.type ? (values.type).slice(-1)[0] : '',
            createTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            createTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
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
    taskUser:'',
    checkUser: '',
    confirmUnit: '',
    createTime: '',
    confirmUser: '',
    currentNode,
    finishUnit: '',
    finishUser: '',
    handleResult: '',
    handleStartTimeBegin: '',
    handleStartTimeEnd: '',
    handleUnit: '',
    handler: '',
    operationNo: '',
    registerAddress: '',
    registerLevel: '',
    registerModel: '',
    registerOccurTimeBegin: '',
    registerScope: '',
    registerTimeBegin: '',
    addTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
    registerUnit: '',
    registerUser: '',
    registerOccurTime:'',
    source: '',
    status,
    title: '',
    type: faultTypes,
    paginations,
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    searchdata({}, 1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };


  // 设置时间
  useEffect(() => {
    if (location && location.state && location.state.cacheinfo) {
      const { addTime, handleTime,registerOccurTime } = location.state.cacheinfo;
      // const { checkTime } = location.state.cacheinfo;
      setFieldsValue({
        addTime: addTime?.length ? [moment(addTime[0]), moment(addTime[1])] : '',
        handleTime: handleTime?.length ? [moment(handleTime[0]), moment(handleTime[1])] : '',
        registerOccurTime: registerOccurTime?.length ? [moment(registerOccurTime[0]), moment(registerOccurTime[1])] : ''
      })
    } else {
      setFieldsValue({
        addTime: addTimeBegin ? [moment(addTimeBegin), moment(addTimeEnd)] : '',
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
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset()
      };
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        // const { createTime } = location.state.cacheinfo;
        const {
          // registerTime,
          handleTime,
          // createTime, addTime, registerOccurTime
        } = location.state.cacheinfo;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
        setFieldsValue({
          // addTime: (addTime && addTime.length) ? [moment(addTime[0]), moment(addTime[1])] : '',
          // registerOccurTime: registerOccurTime?.length ? [moment(registerOccurTime[0], registerOccurTime[1])] : '',
          handleTime: handleTime?.length ? [moment(handleTime[0]), moment(handleTime[1])] : '',
        })
      };
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    validateFields((err, values) => searchdata(values, paginations.current, paginations.pageSize),)
    const controlTable = [
      {
        title: '故障编号',
        dataIndex: 'no',
        key: 'no',
        width: 150,
        render: (text, record) => {
          const handleClick = () => {
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
        title: '故障发生时间',
        dataIndex: 'registerOccurTime',
        key: 'registerOccurTime',
        width: 200,
      },
      {
        title: '故障概要',
        dataIndex: 'content',
        key: 'content',
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
        title: '故障详细描述',
        dataIndex: 'handleContent',
        key: 'handleContent',
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
        title: '影响范围',
        dataIndex: 'registerScope',
        key: 'registerScope',
        width: 150,
      },
      {
        title: '处理过程',
        dataIndex: 'handleProcess',
        key: 'handleProcess',
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
        title: '故障类型',
        dataIndex: 'type',
        key: 'type',
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
        title: '故障措施或建议',
        dataIndex: 'handleAdvise',
        key: 'handleAdvise',
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
        title: '是否需要提供故障报告',
        dataIndex: 'checkOneReportSign',
        key: 'checkOneReportSign',
        width: 200,
      },
      {
        title: '系统运维商确认总结人',
        dataIndex: 'finishUser',
        key: 'finishUser',
        width: 200,
      },
      {
        title: '是否已提交故障处理记录表',
        dataIndex: 'handleReport',
        key: 'handleReport',
        width: 250,
      },
      {
        title: '系统运维商处理人',
        dataIndex: 'handler',
        key: 'handler',
        width: 150,
      },
      {
        title: '责任单位',
        dataIndex: 'confirmBlame',
        key: 'confirmBlame',
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
        title: '系统运维商处理结果',
        dataIndex: 'handleResult',
        key: 'handleResult',
        width: 200,
      },
      {
        title: '故障报告要求上传时间',
        dataIndex: 'finishRequiredTime',
        key: 'finishRequiredTime',
        width: 250,
      },
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
    ]
    setColumns(controlTable)
  }, [])

  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 150
      };
      if (key === 0 && val.title !== '操作') {
        obj.render = (text, records) => {
          return (
            <a onClick={() => gotoDetail(text, records)}>{text}</a>
          )
        }
        obj.fixed = 'left';
        obj.width = 200;
      }
      if (val.title === '操作') {
        obj.render = (text, records) => {
          return (
            <a type="link" onClick={() => handledownFileToZip(records.id, records.no)}>
              附件下载
            </a>)
        }
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    })
  }

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([])
    }
    creataColumns();
  };

  const defaultAllkey = columns.map(item => {
    return item.title
  });

  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedKeys([...index])
      setSelectedRows([...handleSelect])
    }
  }

  return (
    <PageHeaderWrapper title={titleParams}>
      <SysDict
        typeid="333"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
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
                <Form.Item label='当前环节处理人'>
                  {
                    getFieldDecorator('taskUser',{
                      initialValue:cacheinfo.taskUser
                    })(<Input />)
                  }

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

            <Col span={8} >
              <Form.Item label="建单时间">
                {getFieldDecorator('addTime', {
                  initialValue: '',
                },
                )(
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    allowClear
                  />)}
              </Form.Item>
            </Col>

            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="发生时间">
                {getFieldDecorator('registerOccurTime', {
                  initialValue: ''
                })(
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    allowClear
                  />,
                )}
              </Form.Item>
            </Col>


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
                )(<RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }} allowClear />)}
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

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    // indeterminate={this.state.indeterminate}
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
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
                      // disabled={item.disabled}
                      // className={styles.checkboxStyle}
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
        <div />

        <Table
          loading={loading}
          columns={columns}
          dataSource={faultQueryList.rows}
          rowKey={r => r.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 800 }}
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
