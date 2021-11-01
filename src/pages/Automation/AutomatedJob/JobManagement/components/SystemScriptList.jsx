import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, DatePicker, Alert, message } from 'antd';
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

function SystemScriptList(props) {
    const {
        GetData,
        location,
        dispatch,
        loading,
        taskscriptlist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        } } = props;

    const [expand, setExpand] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const { taskId, buttype } = useContext(EditContext);

    const onSelectChange = (RowKeys, Rows) => {
        GetData(RowKeys)
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
        searchdata(1, 15);
        dispatch({
            type: 'autotask/togetUseTaskObjectandAgent',
            payload: { taskId },
        }).then()
    }, [location]);

    useEffect(() => { // 获得用户已选择的对象数据 在表格打勾用户已选数据
        dispatch({
            type: 'autotask/togetUseTaskObjectandAgent',
            payload: { taskId },
        }).then(res => {
            if (res.code === 200) {
                GetData(res.useTaskScript);
                setSelectedRowKeys(res.useTaskScript);
            } else {
                message.error(res.msg);
            }
        })
    }, [taskId]);

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
        <>
            <Row style={{ marginLeft: 70 }}>
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
                <Col span={24}><Alert message={buttype === 'add' ? `已选择【${selectedRows.length}】个agent` : `已选择【${selectedRows.length}】个agent`} type="info" style={{ marginBottom: 5, marginLeft: 48, width: '96.6%' }} /></Col>
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
        </>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        taskscriptlist: autotask.taskscriptlist,
        loading: loading.models.autotask,
    }))(SystemScriptList),
);