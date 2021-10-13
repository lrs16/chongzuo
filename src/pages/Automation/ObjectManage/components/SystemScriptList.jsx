/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Card, Button, Form, Tooltip, Input, Select, Row, Col, DatePicker, Divider, message, Popconfirm } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { togetSearchUsers } from '../services/api';
import SystemScriptDrawer from './SystemScriptDrawer';
import SysViewDrawer from './SysViewDrawer';

const { Option } = Select;

function SystemScriptList(props) {
    const {
        loading,
        scriptsourcemap,
        scriptstatusmap,
        scripttypemap,
        formItemLayout,
        location,
        dispatch,
        systemscriptlist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        } } = props;

    const [expand, setExpand] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [visible, setVisible] = useState(false); // 抽屉是否显示
    const [title, setTitle] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    const [data, setData] = useState('');
    const [allUserData, setallUserData] = useState([]);
    const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

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
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'scriptconfig/findSystemScriptList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        searchdata(1, 15);
    }, [location]);

    useEffect(() => {
        togetSearchUsers().then(res => {
            if (res.code === 200) {
                setallUserData(res.data.userList)
            } else {
                message.error('获取负责人失败')
            }
        });
    }, []);

    // 上传删除附件触发保存
    useEffect(() => {
        if (files.ischange) {
            searchdata(1, 15);
        }
    }, [files]);

    const handleShowDrawer = (drwertitle, type, record) => {
        setVisible(!visible);
        setTitle(drwertitle);
        setSaveType(type);
        if (type === 'update') {
            setData(record);
        } else {
            setData({});
            setFiles({ arr: [], ischange: false });
        }
    };

    const Handlerecall = () => { // 撤回
        const len = selectedRowKeys.length;
        if (len === 0) {
            message.info('至少选择一条数据');
        } else {
            const ids = selectedRows.map(item => { return item.id; });
            dispatch({
                type: 'scriptconfig/torecellScript',
                payload: { Ids: ids.toString() },
            }).then(res => {
                if (res.code === 200) {
                    message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    message.error(res.msg);
                }
            });
        }
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    // 提交
    const handleSubmit = values => {
        dispatch({
            type: 'scriptconfig/toupdatesystemScript',
            payload: {
                ...values,
            },
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
                searchdata(1, 15);
            } else {
                message.error(res.msg);
            }
        });
    };

    const handleDelete = id => { // 删除
        dispatch({
            type: 'scriptconfig/toDeletesystemScript',
            payload: { Ids: id },
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg || '删除脚本成功');
                searchdata(1, 15);
            } else {
                message.error(res.msg);
            }
        });
    };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
    };

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
        total: systemscriptlist.total,
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

    const columns = [
        {
            title: '脚本编号',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            render: (text, record) => {
                return (
                    <SysViewDrawer record={record}>
                        <a type="link">{text}</a>
                    </SysViewDrawer>
                );
            },
        },
        {
            title: '脚本名称',
            dataIndex: 'scriptName',
            key: 'scriptName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '脚本类型',
            dataIndex: 'scriptType',
            key: 'scriptType',
            width: 120,
        },
        {
            title: '脚本内容',
            dataIndex: 'scriptCont',
            key: 'scriptCont',
            width: 300,
            // ellipsis: true,
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
            title: '脚本参数',
            dataIndex: 'scriptArgs',
            key: 'scriptArgs',
            width: 180,
        },
        {
            title: '状态',
            dataIndex: 'scriptStatus',
            key: 'scriptStatus',
            width: 120,
        },
        {
            title: '脚本来源',
            dataIndex: 'scriptSource',
            key: 'scriptSource',
            width: 150,
        },
        {
            title: '脚本排序',
            dataIndex: 'scriptSorts',
            key: 'scriptSorts',
            width: 120,
        },
        {
            title: '脚本备注',
            dataIndex: 'scriptRemarks',
            key: 'scriptRemarks',
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
            width: 180,
            render: (text, record) => {
                return (
                    <div>
                        <a type="link"
                            onClick={() => handleShowDrawer('编辑系统脚本', 'update', record)}
                        >
                            编辑脚本</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定删除此脚本吗？" onConfirm={() => handleDelete(record.id)}>
                            <a type="link" style={{ color: 'red' }}>删除脚本</a>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

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

    return (
        <>
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="脚本名称">
                                {getFieldDecorator('scriptName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="脚本状态">
                                {getFieldDecorator('scriptStatus', {
                                    initialValue: '',
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {scriptstatusmap.map(obj => (
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
                                    <Form.Item label="脚本来源">
                                        {getFieldDecorator('scriptSource', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {scriptsourcemap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="脚本内容">
                                        {getFieldDecorator('scriptCont', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="负责人">
                                        {getFieldDecorator('director', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {allUserData.map(obj => (
                                                <Option key={obj.userId} value={obj.userName}>
                                                    {obj.userName}
                                                </Option>
                                            ))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                            </>
                        )}
                        {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }}
                        onClick={() => handleShowDrawer('新增系统脚本', 'add')}
                    >新增</Button>
                    <Button type="danger" ghost style={{ marginRight: 8 }}
                        onClick={() => Handlerecall()}
                    >撤回</Button>
                </div>
                <Table
                    dataSource={systemscriptlist.rows}
                    columns={columns}
                    loading={loading}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    dispatch={dispatch}
                />
            </Card>
            {/* 抽屉 */}
            <SystemScriptDrawer
                visible={visible}
                dispatch={dispatch}
                ChangeVisible={newvalue => setVisible(newvalue)}
                title={title}
                handleSubmit={newvalue => handleSubmit(newvalue)}
                record={data}
                savetype={savetype}
                scriptsourcemap={scriptsourcemap}
                scripttypemap={scripttypemap}
                files={files.arr}
                ChangeFiles={newvalue => { setFiles(newvalue) }}
                onChangeList={() => searchdata(1, 15)}
                directormap={allUserData}
            />
        </>
    );
}

export default Form.create({})(
    connect(({ scriptconfig, loading }) => ({
        systemscriptlist: scriptconfig.systemscriptlist,
        loading: loading.models.scriptconfig,
    }))(SystemScriptList),
);