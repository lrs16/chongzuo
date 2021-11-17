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
    // const [downVal, setDownVal] = useState({ blame: '', status: '', registerModel: '', timeoutStatus: '', registerUser: '', handler: '', registerUnit: '', handleUnit: '', })

    const rowSelection = {
        onChange: index => {
            setSelectedKeys([...index])
        }
    };

    const searchdata = (value, page, size) => {
        const pointdate = value.date && Array.from(value.date).length === 2;
        switch (value.staticName) {
            // 故障责任单位情况 饼+线
            case '故障责任单位情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        blame: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
                    }
                })
                break;
            // 故障责任单位情况（card）
            case '故障总数':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
                    }
                })
                break;
            // 故障责任单位情况（card）
            case '功能开发':
            case '软件运维':
            case '硬件运维':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        blame: value.staticName,
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
                    }
                })
                break;
            // 故障工单情况（card）
            case '已处理':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        status: '255',
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
                    }
                })
                break;
            // 故障类型统计分析
            case '故障类型总情况':
            case '硬件故障情况':
            case '软件故障情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        type: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
                    }
                })
                break;
            // 故障系统模块情况（饼+线）
            case '故障系统模块情况':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        registerModel: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
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
                        registerUser: `${value.type}?`,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
                    }
                })
                break;
            case '故障处理人':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        handler: `${value.type}?`,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
                    }
                })
                break;
            case '故障登记单位':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        registerUnit: `${value.type}?`,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
                    }
                })
                break;
            case '故障处理单位':
                dispatch({
                    type: 'fault/getfaultQueryList',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        handleUnit: `${value.type}?`,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
                    }
                })
                break;
            default:
                break;
        };
    };

    // 获取数据
    useEffect(() => {
        if (drawerdata) {
            searchdata(drawerdata, paginations.current, paginations.pageSize);
        }
    }, [drawerdata]);

    const onShowSizeChange = (page, size) => {
        searchdata(drawerdata, 1, size);
        setPageinations({
            ...paginations,
            current: 1,
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
        setPageinations({
            ...paginations,
            current: 1,
        });
    };

    //  下载 /导出功能
    const download = value => {
        const exportColumns = columns.map(item => {
            return {
                column: item.dataIndex,
                field: item.title,
            }
        })
        const pointdate = value.date && Array.from(value.date).length === 2;
        switch (value.staticName) {
            // 故障责任单位情况 饼+线
            case '故障责任单位情况':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        blame: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
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
                break;
            // 故障责任单位情况（card）
            case '故障总数':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
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
                break;
            // 故障责任单位情况（card）
            case '功能开发':
            case '软件运维':
            case '硬件运维':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        blame: value.staticName,
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
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
                // setDownVal({ ...downVal, blame: value.staticName });
                break;
            // 故障工单情况（card）
            case '已处理':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        status: '255',
                        addTimeBegin: value.time1,
                        addTimeEnd: value.time2,
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
                // setDownVal({ ...downVal, status: '255' });
                break;
            // 故障类型统计分析
            case '故障类型总情况':
            case '硬件故障情况':
            case '软件故障情况':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        type: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
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
                // setDownVal({ ...downVal, type: value.type || value.name });
                break;
            // 故障系统模块情况（饼+线）
            case '故障系统模块情况':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        registerModel: value.type || value.name,
                        addTimeBegin: pointdate === true ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`) : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
                        addTimeEnd: pointdate === true ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`) : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
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
                // setDownVal({ ...downVal, registerModel: value.type || value.name });
                break;
            case '故障工单超时情况':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        timeoutStatus: value.type,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
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
                // setDownVal({ ...downVal, timeoutStatus: value.type });
                break;
            case '故障登记人':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        registerUser: value.type,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
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
                // setDownVal({ ...downVal, registerUser: value.type });
                break;
            case '故障处理人':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        handler: value.type,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
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
                // setDownVal({ ...downVal, handler: value.type });
                break;
            case '故障登记单位':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        registerUnit: value.type,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
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
                // setDownVal({ ...downVal, registerUnit: value.type });
                break;
            case '故障处理单位':
                dispatch({
                    type: 'fault/faultQuerydownload',
                    payload: {
                        columns: JSON.stringify(exportColumns),
                        ids: selectedKeys.toString(),
                        handleUnit: value.type,
                        addTimeBegin: value.startdate,
                        addTimeEnd: value.enddate,
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
                // setDownVal({ ...downVal, handleUnit: value.type });
                break;
            default:
                break;
        };
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
                    <Popconfirm title="确定导出数据？" onConfirm={() => download(drawerdata)}>
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