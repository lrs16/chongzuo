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
    Select,
    Row,
    Col,
    DatePicker,
    message,
    Icon,
    Popover,
    Checkbox
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import TaskObjectModel from './components/TaskObjectModel';
import TaskScriptModel from './components/TaskScriptModel';

const { Option } = Select;

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

function JobCheck(props) {
    const pagetitle = props.route.name;
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

    const [expand, setExpand] = useState(false);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
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

    // 列表数据
    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.taskStatus = '2';
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'autotask/findautotaskList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
    };

    // 去审核
    const tonewcheck = () => {
        const len = selectedRowKeys.length;
        if (len === 1) { // 单条数据
            router.push({
                pathname: '/automation/automatedjob/jobmanagement/jobcheck/tocheck',
                query: {
                    Id: selectedRows[0].id,
                    addtab: true,
                    menuDesc: '作业任务审批',
                },
                state: {
                    selectedRows,
                }
            })
        } else if (len > 1) {
            message.info('只能选择一条数据');
        } else {
            message.info('请选择一条数据');
        }
        setSelectedRowKeys([]);
        setSelectedRows([]);
        return null;
    };

    const onShowSizeChange = (page, size) => {
        searchdata(1, size);
        setPageinations({
            ...paginations,
            current: 1,
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
    )

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const tsskstatusmap = getTypebyId(1067); // 作业状态
    const taskmodesmap = getTypebyId(1068); // 作业方式
    const examinestatusmap = getTypebyId(1070); // 审批状态

    // 列表
    const initialColumns = [
        {
            title: '作业名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 200,
        },
        {
            title: '作业状态',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            width: 150,
        },
        {
            title: '审核结果',
            dataIndex: 'examineStatus',
            key: 'examineStatus',
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
            title: '执行方式',
            dataIndex: 'taskModes',
            key: 'taskModes',
            width: 150,
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
            title: '审核说明',
            dataIndex: 'examineRemarks',
            key: 'examineRemarks',
            width: 250,
        },
        {
            title: '审核人',
            dataIndex: 'examineBy',
            key: 'examineBy',
            width: 120,
        },
        {
            title: '审核单位',
            dataIndex: 'examineDept',
            key: 'examineDept',
            width: 180,
        }
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
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid={1066}
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="作业名称">
                                {getFieldDecorator('taskName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="状态">
                                {getFieldDecorator('taskStatus', {
                                    initialValue: '',
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {tsskstatusmap.map(obj => (
                                            <Option key={obj.key} value={obj.title}>
                                                {obj.title}
                                            </Option>
                                        ))}
                                    </Select>)}
                            </Form.Item>
                        </Col>
                        {expand && (
                            <>
                                <Col span={8}>
                                    <Form.Item label="审核结果">
                                        {getFieldDecorator('examineResults', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {examinestatusmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="创建人">
                                        {getFieldDecorator('createByNameExt', {
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
                                <Col span={8}>
                                    <Form.Item label="更新人">
                                        {getFieldDecorator('updateBy', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="更新时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('startUpdateTime', {})(
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
                                                {getFieldDecorator('endUpdateTime', {})(
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
                                <Col span={8}>
                                    <Form.Item label="审核人">
                                        {getFieldDecorator('examineBy', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="审核时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('startexamineTime', {})(
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
                                                {getFieldDecorator('endexamineTime', {})(
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
                                <Col span={8}>
                                    <Form.Item label="作业方式">
                                        {getFieldDecorator('taskModes', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {taskmodesmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {expand ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '8.666667%' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }}
                        onClick={() => tonewcheck()}
                    >审核</Button>
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
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={autotasklist.rows}
                    rowKey={record => record.id}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        autotasklist: autotask.autotasklist,
        loading: loading.models.autotask,
    }))(JobCheck),
);