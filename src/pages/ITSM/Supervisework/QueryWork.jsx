import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Badge, Popover, Checkbox, Icon, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const overtimestatusmap = [
    { key: '0', title: '未超时' },
    { key: '1', title: '即将超时' },
    { key: '2', title: '已超时' },
];

const statusMap = ['green', 'gold', 'red'];
const statusContent = ['未超时', '即将超时', '已超时'];

function TodelayExamine(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        form: { getFieldDecorator, resetFields, validateFields },
        getWorkQueryLists,
        dispatch,
        // userinfo,
    } = props;

    let formThead;

    const [expand, setExpand] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectdata, setSelectData] = useState('');
    const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tabrecord, setTabRecord] = useState({});
    const [columns, setColumns] = useState([]);

    const rowSelection = {
        onChange: (index, handleSelect) => {
            setSelectedRows([...handleSelect])
        }
    };

    const queryDept = () => {
        dispatch({
            type: 'itsmuser/fetchuser',
        });
    };

    const getList = () => {
        dispatch({
            type: 'supervisemodel/getWorkQueryLists',
            payload: {
                tab: '4',
                pageIndex: paginations.current,
                pageSize: paginations.pageSize,
            },
        });
    };

    //  打开查询详情页
    const gotoDetail = (record) => {
        router.push({
            pathname: `/ITSM/supervisework/queryworkdetails`,
            query: {
                mainId: record.mainId,
                Id: record.no,
            },
            state: {
                dynamicpath: true,
                menuDesc: '工作查询',
            }
        })
    };

    const searchdata = (values, page, pageSize) => {
        const newvalues = {
            ...values,
            addTime: '',
            time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            plannedStartTime: '',
            plannedStartTime1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            plannedStartTime2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            plannedEndTime: '',
            plannedEndTime1: values.plannedEndTime?.length ? moment(values.plannedEndTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            plannedEndTime2: values.plannedEndTime?.length ? moment(values.plannedEndTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            checkTime: '',
            checkTime1: values.checkTime?.length ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            checkTime2: values.checkTime?.length ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            startTime: '',
            startTime1: values.startTime?.length ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            startTime2: values.startTime?.length ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: '',
            endTime1: values.endTime?.length ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime2: values.endTime?.length ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            executeTime: '',
            executeTime1: values.executeOperationTime?.length ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            executeTime2: values.executeOperationTime?.length ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        setTabRecord({ ...newvalues });
        dispatch({
            type: 'supervisemodel/getWorkQueryLists',
            payload: {
                ...newvalues,
                tab: '4',
                pageIndex: page,
                pageSize
            },
        });
    };

    const handleSearch = () => {
        setPaginations({
            ...paginations,
            current: 1,
        });
        validateFields((err, values) => {
            if (err) {
                return;
            }
            searchdata(values, 1, paginations.pageSize);
        });
    };

    const handleReset = () => {
        resetFields();
        dispatch({
            type: 'supervisemodel/getWorkQueryLists',
            payload: {
                tab: '4',
                pageIndex: 1,
                pageSize: paginations.pageSize,
            },
        })
    };

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
        <Button
            style={{ marginLeft: 8 }}
            type="link"
            onClick={() => {
                setExpand(!expand);
            }}
        >
            {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
        </Button></>
    );

    const initialColumns = [
        {
            title: '工作任务编号',
            dataIndex: 'no',
            key: 'no',
            width: 250,
            render: (text, record) => {
                return <a onClick={() => gotoDetail(record)}>{text}</a>
            },
        },
        {
            title: '填报时间',
            dataIndex: 'addTime',
            key: 'addTime',
            width: 250,
        },
        {
            title: '工作内容',
            dataIndex: 'content',
            key: 'content',
            width: 250,
        },
        {
            title: '工作负责人',
            dataIndex: 'workUser',
            key: 'workUser',
            width: 250,
        },
        {
            title: '督办内容',
            dataIndex: 'superviseContent',
            key: 'superviseContent',
            width: 250,
        },
        {
            title: '督办时间',
            dataIndex: 'superviseTime',
            key: 'superviseTime',
            width: 250,
        },
        {
            title: '督办人',
            dataIndex: 'superviseUser',
            key: 'superviseUser',
            width: 100,
        },
        {
            title: '超时状态',
            dataIndex: 'timeoutStatus',
            key: 'timeoutStatus',
            width: 100,
            render: (text) => (
                <span>
                    <Badge
                        status={statusMap[statusContent.indexOf(text)]}
                        text={text} />
                </span>
            ),
        },
        {
            title: '执行状态',
            dataIndex: 'executeStatus',
            key: 'executeStatus',
            width: 100,
        },
        {
            title: '延期审核状态',
            dataIndex: 'checkStatus',
            key: 'checkStatus',
            width: 200,
        },
        {
            title: '工作执行结果',
            dataIndex: 'executeResult',
            key: 'executeResult',
            width: 250,
        },
        {
            title: '计划开始时间',
            dataIndex: 'plannedStartTime',
            key: 'plannedStartTime',
            width: 250,
        },
        {
            title: '计划结束时间',
            dataIndex: 'plannedEndTime',
            key: 'plannedEndTime',
            width: 250,
        },
        {
            title: '实际开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 250,
        },
        {
            title: '实际结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 250,
        },
        {
            title: '工作执行情况说明',
            dataIndex: 'executeContent',
            key: 'executeContent',
            width: 250,
        },
        {
            title: '执行操作时间',
            dataIndex: 'executeTime',
            key: 'executeTime',
            width: 250,
        },
        {
            title: '执行人',
            dataIndex: 'executeUser',
            key: 'executeUser',
            width: 100,
        },
        {
            title: '填报人',
            dataIndex: 'addUser',
            key: 'addUser',
            width: 100,
        },
        {
            title: '填报单位',
            dataIndex: 'addUnit',
            key: 'addUnit',
            width: 250,
        },
        {
            title: '延期审核人',
            dataIndex: 'checkUser',
            key: 'checkUser',
            width: 150,
        },
        {
            title: '延期审核结果',
            dataIndex: 'checkResult',
            key: 'checkResult',
            width: 250,
        },
        {
            title: '延期审核时间',
            dataIndex: 'checkTime',
            key: 'checkTime',
            width: 250,
        },
        {
            title: '延期审核意见',
            dataIndex: 'checkContent',
            key: 'checkContent',
            width: 250,
        },
    ];

    const defaultAllkey = columns.map(item => {
        return item.title
    });

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

    const pagination = {
        showSizeChanger: true,
        onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
        current: paginations.current,
        pageSize: paginations.pageSize,
        total: getWorkQueryLists.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: (page) => changePage(page),
    };

    // 获取数据
    // useEffect(() => {
    //     if (cacheinfo !== undefined) {
    //     validateFields((err, values) => {
    //         searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
    //     })
    //     }
    // }, []);

    const download = () => { // 导出
        const exportColumns = columns.map(item => {
            return {
                column: item.dataIndex,
                field: item.title
            }
        })
        validateFields((err, values) => {
            dispatch({
                type: 'supervisemodel/downloadMyWorkExcel',
                payload: {
                    tab: '4',
                    columns: JSON.stringify(exportColumns),
                    ...values,
                    addTime: '',
                    time1: values.addTime ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    time2: values.addTime ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    plannedStartTime: '',
                    plannedStartTime1: values.plannedStartTime ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    plannedStartTime2: values.plannedStartTime ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    plannedEndTime: '',
                    plannedEndTime1: values.plannedEndTime ? moment(values.plannedEndTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    plannedEndTime2: values.plannedEndTime ? moment(values.plannedEndTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    checkTime: '',
                    checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    startTime: '',
                    startTime1: values.startTime ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    startTime2: values.startTime ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    endTime: '',
                    endTime1: values.endTime ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    endTime2: values.endTime ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    executeTime: '',
                    executeTime1: values.executeOperationTime ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    executeTime2: values.executeOperationTime ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                }
            }).then(res => {
                const filename = '下载.xls';
                const blob = new Blob([res]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            })
        })
    };

    // const handleDelete = () => { // 删除
    //     const len = selectedRows.length;
    //     const deleteIds = selectedRows.map(res => {
    //         return res.mainId
    //     })
    //     if (len === 0) {
    //         message.info('至少选择一条数据');
    //         return false;
    //     }
    //     return dispatch({
    //         type: 'supervisemodel/taskDelete',
    //         payload: {
    //             mainIds: deleteIds.toString()
    //         }
    //     }).then(res => {
    //         if (res.code === 200) {
    //             message.success(res.msg);
    //             getList();
    //         } else {
    //             message.info(res.msg);
    //             getList();
    //         }
    //     })
    // };

    const creataColumns = () => { // 创建列表
        // columns
        initialColumns.length = 0;
        formThead.map((val, key) => {
            const obj = {
                key: val.key,
                title: val.title,
                dataIndex: val.key,
                width: 150
            };
            if (key === 0) {
                obj.render = (text, record) => {
                    return (
                        <a onClick={() => gotoDetail(record)}>{text}</a>
                    )
                }
                obj.fixed = 'left'
            }
            initialColumns.push(obj);
            setColumns(initialColumns);
            return null;
        }
        )
    };

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

    useEffect(() => {
        getList();
        queryDept();
        setColumns(initialColumns);
    }, []);

    // 数据字典匹配
    const getTypebyTitle = title => {
        if (selectdata.ischange) {
            return selectdata.arr.filter(item => item.title === title)[0].children;
        }
        return [];
    };

    const status = getTypebyTitle('工作状态');
    const checkresult = getTypebyTitle('审核结果');
    const checkstatus = getTypebyTitle('审核状态');
    const result = getTypebyTitle('执行结果');
    const executestatus = getTypebyTitle('执行状态');

    return (
        <PageHeaderWrapper title={pagetitle}>
            <SysDict
                typeid="1418501809457528833"
                commonid="1354288354950123522"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="填报时间">
                                {getFieldDecorator('addTime', {
                                    initialValue: '',
                                })
                                    (
                                        <RangePicker
                                            showTime={{
                                                hideDisabledOptions: true,
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                            }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="工作状态">
                                {getFieldDecorator('status', {
                                    initialValue: '',
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {status.map(obj => (
                                            <Option key={obj.key} value={obj.title}>
                                                {obj.title}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                        {expand && (
                            <>
                                <Col span={8}>
                                    <Form.Item label="执行状态">
                                        {getFieldDecorator('executeStatus', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {executestatus.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="工作内容">
                                        {getFieldDecorator('content', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />,)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="工作负责人">
                                        {getFieldDecorator('workUser', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="计划开始时间">
                                        {getFieldDecorator('plannedStartTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="计划结束时间">
                                        {getFieldDecorator('plannedEndTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="延期审核状态">
                                        {getFieldDecorator('checkStatus', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {checkstatus.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="超时状态">
                                        {getFieldDecorator('timeoutStatus', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {overtimestatusmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="工作执行结果">
                                        {getFieldDecorator('executeResult', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {result.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="实际开始时间">
                                        {getFieldDecorator('startTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="实际结束时间">
                                        {getFieldDecorator('endTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="工作执行情况说明">
                                        {getFieldDecorator('executeContent', {
                                        })(<Input placeholder="请输入" allowClear />,)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="执行操作时间">
                                        {getFieldDecorator('executeTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="执行人">
                                        {getFieldDecorator('executeUser', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                {/* <Col span={8}>
                                    <Form.Item label="督办内容">
                                        {getFieldDecorator('form9', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col> */}
                                {/* <Col span={8}>
                                    <Form.Item label="督办人">
                                        {getFieldDecorator('form10', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col> */}
                                <Col span={8}>
                                    <Form.Item label="填报人">
                                        {getFieldDecorator('addUser', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="填报单位">
                                        {getFieldDecorator('addUnit', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="延期审核人">
                                        {getFieldDecorator('checkUser', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="延期审核结果">
                                        {getFieldDecorator('checkResult', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {checkresult.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="延期审核时间">
                                        {getFieldDecorator('checkTime', {
                                            initialValue: '',
                                        })
                                            (
                                                <RangePicker
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="延期审核意见">
                                        {getFieldDecorator('checkContent', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="工作任务编号">
                                        {getFieldDecorator('no', {
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
                    </Form>
                </Row>

                <div>
                    <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button>
                    {/* <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleDelete()}>删除</Button> */}
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
                < Table
                    loading={loading}
                    columns={columns}
                    scroll={{ x: 1600 }}
                    dataSource={getWorkQueryLists.rows}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    rowKey={r => r.id}
                />
            </Card>
        </PageHeaderWrapper >
    );
}

export default Form.create({})(
    connect(({ supervisemodel, itsmuser, loading }) => ({
        getWorkQueryLists: supervisemodel.getworkqueryList,
        userinfo: itsmuser.userinfo,
        loading: loading.models.supervisemodel,
    }))(TodelayExamine),
);