import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Drawer,
    Button,
    Table,
    Tooltip,
    Popconfirm
} from 'antd';

const columns = [
    {
        title: '故障编号',
        dataIndex: 'no',
        key: 'no',
        width: 150,
    },
    {
        title: '故障发生时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
];

function ChartDrawer(props) {
    const {
        visible,
        ChangeVisible,
        drawerdata,
        dispatch,
        faultQueryList,
        loading
    } = props;

    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [selectedKeys, setSelectedKeys] = useState([]);

    const rowSelection = {
        onChange: index => {
            setSelectedKeys([...index])
        }
    };

    const searchdata = (value, page, size) => {
        switch (value.staticName) {
            case '故障责任单位情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        blame: value.type || value.name
                    }
                })
                break;
            case '功能开发':
            case '软件运维':
            case '硬件运维':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        blame: value.staticName
                    }
                })
                break;
            case '已处理':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        status: '255'
                    }
                })
                break;
            case '故障类型总情况':
            case '硬件故障情况':
            case '软件故障情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        type: value.type || value.name
                    }
                })
                break;
            case '故障系统模块情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        registerModel: value.type || value.name
                    }
                })
                break;
            case '故障工单超时情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
                        timeoutStatus: value.type
                    }
                })
                break;
            case '故障登记人':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        registerUser: value.type
                    }
                })
                break;
            case '故障处理人':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        handler: value.type
                    }
                })
                break;
            case '故障登记单位':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        registerUnit: value.type
                    }
                })
                break;
            case '故障处理单位':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        handleUnit: value.type
                    }
                })
                break;
            default:
                break;
        }
    };

    // 获取数据
    useEffect(() => {
        if (drawerdata) {
            searchdata(drawerdata, 1, 15);
        }
    }, [drawerdata]);

    const onShowSizeChange = (page, size) => {
        searchdata(drawerdata, page, size);
        setPageinations({
            ...paginations,
            pageSize: size,
        });
    };

    const changePage = page => {
        searchdata(drawerdata, page, paginations.pageSize);
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
        total: faultQueryList.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    // 取消
    const hanldleCancel = () => {
        ChangeVisible(false);
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
        dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
                columns: JSON.stringify(exportColumns),
                ids: selectedKeys.toString(),
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
    };

    return (
        <>
            <Drawer
                visible={visible}
                width={1120}
                onClose={hanldleCancel}
                bodyStyle={{ paddingBottom: 60 }}
                destroyOnClose
            >
                <div style={{ marginBottom: 24 }}>
                    <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
                        <Button type="primary">导出数据</Button>
                    </Popconfirm>
                </div>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={faultQueryList.rows || []}
                    rowKey={record => record.id}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    scroll={{ x: 1300 }}
                />
            </Drawer>
        </>
    )
}

export default connect(({ fault, loading }) => ({
    faultQueryList: fault.faultQueryList,
    loading: loading.models.fault,
}))(ChartDrawer);