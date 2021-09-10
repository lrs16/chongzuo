/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useContext } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, Select, Alert, Tag, message, Badge, } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import EditContext from '@/layouts/MenuContext';
// import SystemScriptDrawer from './SystemScriptDrawer';
// import SysViewDrawer from './SysViewDrawer';

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

const colormap = new Map([
    ['离线', 'default'],
    ['在线', 'success'],
]);

function TaskObjectList(props) {
    const {
        location,
        dispatch,
        taskobjectlist,
        GetData,
        loading,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        } } = props;

    const [expand, setExpand] = useState(false);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        dispatch({
            type: 'autotask/findtaskObjectList',
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
    }, [location]);

    useEffect(() => {
        dispatch({
            type: 'autotask/togetUseTaskObjectandAgent',
            payload: { taskId },
        }).then(res => {
            if (res.code === 200) {
                GetData(res.useTaskObject);
                setSelectedRowKeys(res.useTaskObject);
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
        total: taskobjectlist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const logcalcel = (e) => {
        console.log(e)
    };

    const columns = [
        {
            title: '区域',
            dataIndex: 'agentZone',
            key: 'agentZone',
            width: 120,
        },
        {
            title: '名称',
            dataIndex: 'agentName',
            key: 'agentName',
            width: 250,
            ellipsis: true,
        },
        {
            title: 'IP地址',
            dataIndex: 'agentHost',
            key: 'agentHost',
            width: 200,
        },
        {
            title: '协议',
            dataIndex: 'agentHyper',
            key: 'agentHyper',
            width: 80,
        },
        {
            title: '端口',
            dataIndex: 'agentPort',
            key: 'agentPort',
            width: 80,
        },
        {
            title: '类型',
            dataIndex: 'agentType',
            key: 'agentType',
            width: 80,
        },
        {
            title: 'token',
            dataIndex: 'agentToken',
            key: 'agentToken',
            width: 120,
        },
        {
            title: '目录',
            dataIndex: 'agentDeploy',
            key: 'agentDeploy',
            width: 200,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'agentStatus',
            key: 'agentStatus',
            width: 80,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.agentStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '节点地址',
            dataIndex: 'nodeHost',
            key: 'nodeHost',
            width: 120,
        },
        {
            title: '节点端口',
            dataIndex: 'nodePort',
            key: 'nodePort',
            width: 120,
        },
        {
            title: '备注',
            dataIndex: 'agentRemarks',
            key: 'agentRemarks',
            width: 120,
        },
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

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };
    const typemap = getTypebyId('100000000000001002');         // 类型
    const statusmap = getTypebyId('100000000000001003');       // 状态
    const zonemap = getTypebyId('100000000000001004');         // 区域

    return (
        <>
            <DictLower
                typeid="100000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Row gutter={8} style={{ marginLeft: 70 }}>
                <Form {...formItemLayout} onSubmit={handleSearch}>
                    <Col span={8}>
                        <Form.Item label="agent名称">
                            {getFieldDecorator('agentName', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="agent区域">
                            {getFieldDecorator('agentZone', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择" allowClear>
                                    {zonemap.map(obj => (
                                        <Option key={obj.key} value={obj.title}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                        <Form.Item label="agent类型">
                            {getFieldDecorator('agentType', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择" allowClear>
                                    {typemap.map(obj => (
                                        <Option key={obj.key} value={obj.title}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                        <Form.Item label="agent状态">
                            {getFieldDecorator('agentStatus', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择" allowClear>
                                    {statusmap.map(obj => (
                                        <Option key={obj.key} value={obj.title}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                        <Form.Item label="agent地址">
                            {getFieldDecorator('agentHost', {
                                initialValue: '',
                            })(
                                <Input placeholder="请输入" allowClear />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="节点地址" style={{ display: expand ? 'block' : 'none' }}>
                            {getFieldDecorator('nodeHost', {
                                initialValue: '',
                            })(
                                <Input placeholder="请输入" allowClear />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="agent备注" style={{ display: expand ? 'block' : 'none' }}>
                            {getFieldDecorator('agentRemarks', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ paddingLeft: expand ? '5.666667%' : '24px' }}>{extra}</Col>
                </Form>
                <Col span={24} style={{ marginLeft: 48, padding: 8 }}>{selectedRows.map(item => (
                    <Tag key={item.id} color="red" closable onClose={() => logcalcel()}>{item.agentHost}</Tag>
                ))}</Col>
                <Col span={24}><Alert message={buttype === 'add' ? (`已选择【${selectedRows.length}】个agent` || `已选择【0】个agent`) : `已选择【${selectedRowKeys.length}】个agent`} type="info" style={{ marginBottom: 5, marginLeft: 48, width: '96.6%' }} /></Col>
            </Row>
            <Table
                dataSource={taskobjectlist.rows}
                style={{ marginLeft: 118 }}
                columns={columns}
                rowKey={record => record.id}
                scroll={{ x: 1300 }}
                rowSelection={rowSelection}
                paginations={pagination}
                loading={loading}
            />
        </>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        taskobjectlist: autotask.taskobjectlist,
        loading: loading.models.autotask,
    }))(TaskObjectList),
);