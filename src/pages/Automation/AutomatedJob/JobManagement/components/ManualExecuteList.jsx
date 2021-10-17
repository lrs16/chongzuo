import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
    Table,
    Card,
    Button,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Divider,
    message,
    Icon,
    Popover,
    Checkbox
} from 'antd';
import TaskObjectModel from './TaskObjectModel';
import TaskScriptModel from './TaskScriptModel';
import { logicDelTask, deleteTask, submitTask } from '../services/api';

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

function ManualExecuteList(props) {
    const {
        loading,
        dispatch,
        location,
        autotasklist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    let formThead;

    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [columns, setColumns] = useState([]); // 动态表格

    const onSelectChange = (RowKeys, Rows) => {
        setSelectedRowKeys(RowKeys);
        setSelectedRows(Rows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.taskModes = '1';
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'autotask/findautotaskList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    // 执行
    const handlerunTask = id => {
        dispatch({
            type: 'autotask/toqueryrunTask',
            payload: {
                taskId: id
            },
        }).then(res => {
            if (res.code === 200) {
                message.success('方法已执行, 稍后查看结果');
                searchdata(1, 15);
            } else {
                message.error(res.msg);
            }
        });
    };

    // 删除
    const handleDelete = () => {
        if (selectedRows.length > 0) {
            const ids = selectedRows.map(item => {
                return item.id;
            });
            deleteTask(ids).then(res => {
                if (res.code === 200) {
                    message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    message.error(res.msg);
                };
                setSelectedRowKeys([]);
                setSelectedRows([]);
                setPageinations({ current: 1, pageSize: 15 })
            })
        };
        if (selectedRows.length === 0) {
            message.error('您还没有选择数据')
        };
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    // 撤销发布
    const handleClickRevoke = () => {
        if (selectedRows.length > 0) {
            const ids = selectedRows.map(item => {
                return item.id;
            });
            const newvalue = {
                taskId: ids,
                taskStatus: '1'
            };
            submitTask(newvalue).then(res => {
                if (res.code === 200) {
                    message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    message.error(res.msg);
                };
                setSelectedRowKeys([]);
                setSelectedRows([]);
                setPageinations({ current: 1, pageSize: 15 })
            })
        };
        if (selectedRows.length === 0) {
            message.error('您还没有选择数据')
        };
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    // 废止
    const handleClickAbolish = () => {
        if (selectedRows.length > 0) {
            const ids = selectedRows.map(item => {
                return item.id;
            });
            logicDelTask(ids).then(res => {
                if (res.code === 200) {
                    message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    message.error(res.msg);
                };
                setSelectedRowKeys([]);
                setSelectedRows([]);
                setPageinations({ current: 1, pageSize: 15 })
            })
        };
        if (selectedRows.length === 0) {
            message.error('您还没有选择数据')
        };
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
    };

    // 执行日志
    const newpagetolog = id => {
        router.push({
            pathname: '/automation/automatedjob/jobmanagement/jobexecute/manualexecutionlog',
            query: {
                Id: id,
                addtab: true,
                menuDesc: '手动执行日志',
            },
        })
    }

    const onShowSizeChange = (page, size) => {
        searchdata(page, size);
        setPageinations({
            ...paginations,
            pageSize: size,
        });
    };

    const changePage = page => {
        searchdata(page, paginations.pageSize);
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
        total: autotasklist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const handleSearch = () => {
        setPageinations({
            ...paginations,
            current: 1,
        });
        searchdata(1, paginations.pageSize);
    };

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    )

    // 列表
    const initialColumns = [
        {
            title: '作业名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 250,
            ellipsis: true,
        },
        {
            title: '作业状态',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            width: 150,
        },
        {
            title: '作业对象',
            dataIndex: 'taskObjectNum',
            key: 'taskObjectNum',
            width: 150,
            render: (text, record) => {
                return (
                    <TaskObjectModel record={record} dispatch={dispatch}>
                        <a type="link">{text}</a>
                    </TaskObjectModel>
                );
            },
        },
        {
            title: '作业脚本',
            dataIndex: 'taskScriptNum',
            key: 'taskScriptNum',
            width: 150,
            render: (text, record) => {
                return (
                    <TaskScriptModel record={record} dispatch={dispatch}>
                        <a type="link">{text}</a>
                    </TaskScriptModel>
                );
            },
        },
        {
            title: '作业备注',
            dataIndex: 'taskRemarks',
            key: 'taskRemarks',
            width: 250,
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            key: 'createBy',
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 250,
        },
        {
            title: '更新人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            width: 120,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 250,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                return (
                    <div spinning={loading} delay={1000}>
                        <a type="link"
                            onClick={() => handlerunTask(record.id)}
                        >
                            执行
                        </a>
                        <Divider type="vertical" />
                        <a type="link" onClick={() => newpagetolog(record.id)}>
                            执行日志
                        </a>
                    </div>
                );
            },
        },
    ];

    // 动态列表名称
    const defaultAllkey = columns.map(item => {
        return item.title;
    });

    // 创建列表
    const creataColumns = () => {
        // columns
        initialColumns.length = 0;
        formThead.map(val => {
            const obj = {
                key: val.key,
                title: val.title,
                dataIndex: val.key,
                width: 250,
                ellipsis: true,
            };
            if (val.title === '作业对象') {
                obj.render = (text, record) => {
                    return (
                        <TaskObjectModel record={record} dispatch={dispatch}>
                            <a type="link">{text}</a>
                        </TaskObjectModel>
                    )
                }
            }
            if (val.title === '作业脚本') {
                obj.render = (text, record) => {
                    return (
                        <TaskScriptModel record={record} dispatch={dispatch}>
                            <a type="link">{text}</a>
                        </TaskScriptModel>
                    )
                }
            }
            if (val.title === '操作') {
                obj.render = (_, record) => {
                    return (
                        <div spinning={loading.toString()} delay={1000}>
                            <a type="link"
                                onClick={() => handlerunTask(record.id)}
                            >
                                执行
                            </a>
                            <Divider type="vertical" />
                            <a type="link" onClick={() => newpagetolog(record.id)}>
                                执行日志
                            </a>
                        </div>
                    );
                }
                obj.fixed = 'right'
            }
            initialColumns.push(obj);
            setColumns(initialColumns);
            return null;
        }
        )
    };

    // 列表设置
    const onCheckAllChange = e => {
        setColumns(e.target.checked ? initialColumns : [])
    };

    // 列名点击
    const onCheck = (checkedValues) => {
        formThead = initialColumns.filter(i =>
            checkedValues.indexOf(i.title) >= 0
        );

        if (formThead.length === 0) {
            setColumns([]);
        }
        creataColumns();
    };

    useEffect(() => {
        searchdata(1, 15);
        setColumns(initialColumns);
    }, [location]);

    return (
        <>
            <Card>
                <Row>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={5}>
                            <Form.Item label="作业名称">
                                {getFieldDecorator('taskName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="创建人">
                                {getFieldDecorator('createBy', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="创建时间">
                                <Row>
                                    <Col span={11}>
                                        {getFieldDecorator('startTime', {})(
                                            <DatePicker
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: moment('00:00:00', 'HH:mm:ss'),
                                                }}
                                                placeholder="开始时间"
                                                format='YYYY-MM-DD HH:mm:ss'
                                                style={{ minWidth: 120, width: '100%' }}
                                            />
                                        )}
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                                    <Col span={11}>
                                        {getFieldDecorator('endTime', {})(
                                            <DatePicker
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: moment('23:59:59', 'HH:mm:ss'),
                                                }}
                                                placeholder="结束时间"
                                                format='YYYY-MM-DD HH:mm:ss'
                                                style={{ minWidth: 120, width: '100%' }}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="danger" style={{ marginRight: 8 }}
                        onClick={() => handleClickRevoke()}
                    >撤销作业</Button >
                    <Button type="danger" ghost style={{ marginRight: 8 }}
                        onClick={() => handleClickAbolish()}
                    >废止</Button >
                    <Button type="danger" ghost style={{ marginRight: 8 }}
                        onClick={() => handleDelete()}
                    >删除</Button>
                </div>
                {/* 列表设置 */}
                <div style={{ textAlign: 'right', marginBottom: 8 }}>
                    <Popover
                        placement="bottomRight"
                        trigger="click"
                        content={
                            <>
                                <p style={{ borderBottom: '1px solid #E9E9E9' }}>
                                    <Checkbox
                                        onChange={onCheckAllChange}
                                        checked={columns.length === initialColumns.length === true}
                                    >
                                        列表展示
                                    </Checkbox>
                                </p>
                                <Checkbox.Group
                                    onChange={onCheck}
                                    value={defaultAllkey}
                                    defaultValue={columns}
                                >
                                    {initialColumns.map(item => (
                                        <Col key={`item_${item.key}`} style={{ marginBottom: 8 }}>
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
                            <Icon type="setting" theme="filled" style={{ fontSize: 14 }} />
                        </Button>
                    </Popover>
                </div>
                {autotasklist.rows && (<Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={autotasklist.rows.filter(item => item.taskStatus !== ('已登记' || '待审核'))}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    loading={loading}
                    scroll={{ x: 1300 }}
                />)}
            </Card>
        </>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        autotasklist: autotask.autotasklist,
        loading: loading.models.autotask,
    }))(ManualExecuteList),
);