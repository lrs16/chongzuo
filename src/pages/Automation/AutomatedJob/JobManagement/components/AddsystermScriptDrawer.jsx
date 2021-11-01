import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Drawer, Button, Form, Row, Col, Input, DatePicker, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import EditContext from '@/layouts/MenuContext';

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

function AddsystermScriptDrawer(props) {
    const {
        visible,
        ChangeVisible,
        title,
        GetRowsData,
        GetRowskeysData,
        location,
        dispatch,
        loading,
        taskscriptlist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
        rows,
    } = props;

    const [expand, setExpand] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const { taskId, buttype } = useContext(EditContext);

    const hanldleCancel = () => {
        ChangeVisible(false);
    };
    const handleOk = () => {
        GetRowsData(selectedRows); // 获取选中的行数据
        GetRowskeysData(selectedRowKeys); // 获取选中的行key数据
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        // handleSubmit(values);
        ChangeVisible(false);
    };

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
        // values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        // values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'autotask/findtaskScriptList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
                taskId: undefined
            },
        });
    };

    useEffect(() => {
        if (rows) {
            const rowkeys = rows.map(item => item.id);
            setSelectedRows(rows);
            setSelectedRowKeys(rowkeys);
        }
    }, [rows])

    useEffect(() => {
        searchdata(1, 15);
    }, [location]);

    useEffect(() => {
        if (taskId !== undefined && (buttype === 'edit' || buttype === 'detailsview') && buttype !== 'add') {
            const values = getFieldsValue();
            dispatch({
                type: 'autotask/findtaskScriptList2',
                payload: {
                    values,
                    pageNum: 1,
                    pageSize: 15,
                    taskId
                },
            }).then(res => {
                if (res.code === 200) {
                    const getrowkey = res.data.rows.map(item => { return item.id; })
                    GetRowsData(res.data.rows);
                    GetRowskeysData(getrowkey);
                } else {
                    message.error(res.msg);
                }
            });
        }
    }, [taskId !== undefined && (buttype === 'edit' || buttype === 'detailsview') && buttype !== 'add']);

    const handleSearch = () => {
        setPageinations({
            ...paginations,
            current: 1,
        });
        searchdata(1, paginations.pageSize);
    };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15);
        setPageinations({ current: 1, pageSize: 15 });
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
        total: taskscriptlist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const columns = [
        {
            title: '脚本编号',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: '脚本名称',
            dataIndex: 'scriptName',
            key: 'scriptName',
            width: 200,
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
            ellipsis: true,
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
            dataIndex: 'createByNameExt',
            key: 'createByNameExt',
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
            dataIndex: 'updateByNameExt',
            key: 'updateByNameExt',
            width: 120,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 250,
        }
    ];

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
        <Button
            style={{ marginLeft: 8, marginBottom: 20 }}
            type="link"
            onClick={() => {
                setExpand(!expand);
            }}
        >
            {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
        </Button></>
    );

    return (
        <Drawer
            title={title}
            width="65%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
            destroyOnClose
        >
            <>
                <Row gutter={8} style={{ marginLeft: 70 }}>
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
                                    initialValue: '已发布',
                                })(
                                    <Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="脚本来源" style={{ display: expand ? 'block' : 'none' }}>
                                {getFieldDecorator('scriptSource', {
                                    initialValue: '',
                                })(
                                    <Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                            <Form.Item label="脚本内容">
                                {getFieldDecorator('scriptCont', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                            <Form.Item label="负责人">
                                {getFieldDecorator('director', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                            <Form.Item label="创建人">
                                {getFieldDecorator('createBy', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
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
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                            <Form.Item label="更新人">
                                {getFieldDecorator('updateBy', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
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
                        {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <Table
                    style={{ marginLeft: 118 }}
                    columns={columns}
                    dataSource={taskscriptlist.rows}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    paginations={pagination}
                    rowSelection={rowSelection}
                    loading={loading}
                />
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={() => handleOk()} type="primary">
                        确认
                    </Button>
                </div>
            </>
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        taskscriptlist: autotask.taskscriptlist,
        loading: loading.models.autotask,
    }))(AddsystermScriptDrawer),
);