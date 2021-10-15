import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Button, Form, Select, Row, Col, Input, Badge, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import EditContext from '@/layouts/MenuContext';

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

function AddagentObjDrawer(props) {
    const {
        visible,
        ChangeVisible,
        title,
        GetRowsData,
        GetRowskeysData,
        location,
        dispatch,
        loading,
        taskobjectlist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
        rows,
    } = props;

    const [expand, setExpand] = useState(false);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
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
        if (rows) {
            const rowkeys = rows.map(item => item.id);
            setSelectedRows(rows);
            setSelectedRowKeys(rowkeys);
        }
    }, [rows])

    useEffect(() => {
        if (taskId !== undefined && (buttype === 'edit' || buttype === 'detailsview') && buttype !== 'add') {
            const values = getFieldsValue();
            dispatch({
                type: 'autotask/findtaskObjectList2',
                payload: {
                    values,
                    pageNum: 1,
                    pageSize: 15,
                    taskId
                },
            }).then(res => {
                if (res.code === 200) {
                    const getrowkey = res.data.rows.map(item => { return item.id; });
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
            title: '设备IP',
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

    const typemap = getTypebyId(105);         // 类型
    const statusmap = getTypebyId(106);       // 状态
    const zonemap = getTypebyId(107);         // 区域

    return (
        <Drawer
            title={title}
            width="65%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
            destroyOnClose
        >
            <DictLower
                typeid={104}
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <>
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
                                        <Option key={obj.key} value={obj.dict_code}>
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
                                        <Option key={obj.key} value={obj.dict_code}>
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
                                        <Option key={obj.key} value={obj.dict_code}>
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
                    <Col span={8} style={{ paddingLeft: expand ? '8.36%' : '24px' }}>{extra}</Col>
                </Form>
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
        taskobjectlist: autotask.taskobjectlist,
        loading: loading.models.autotask,
    }))(AddagentObjDrawer),
);