import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Button, Form, Select, Row, Col, Input, Badge, message } from 'antd';
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
    ['停用', 'default'],
    ['在用', 'success'],
]);

function AddagentObjDrawer(props) {
    const {
        visible,
        ChangeVisible,
        title,
        // handleSubmit,
        GetRowsData,
        GetRowskeysData,
        location,
        dispatch,
        loading,
        softobjectlist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
            // validateFields
        } } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const { workId, buttype } = useContext(EditContext);

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
            type: 'autosoftwork/findautoSoftObjectList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
                workId: undefined
            },
        })
    };

    useEffect(() => {
        searchdata(1, 15);
    }, [location]);

    useEffect(() => {
        const values = getFieldsValue();
        dispatch({
            type: 'autosoftwork/findautoSoftObjectList1',
            payload: {
                values,
                pageNum: 1,
                pageSize: 15,
                workId
            },
        }).then(res => {
            if (res.code === 200) {
                const getrowkey = res.data.rows.map(item => {return item.id;})
                GetRowsData(res.data.rows);
                GetRowskeysData(getrowkey);
            } else {
                message.error(res.msg);
            }
        });
    }, [workId && buttype === 'edit']);

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
        total: softobjectlist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 200,
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '设备IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
        },
        {
            title: '软件名称',
            dataIndex: 'softName',
            key: 'softName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '软件端口',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 120,
        },
        {
            title: '软件路径',
            dataIndex: 'softPath',
            key: 'softPath',
            width: 250,
            ellipsis: true,
        },
        {
            title: '软件版本号',
            dataIndex: 'softVersion',
            key: 'softVersion',
            width: 120,
        },
        {
            title: '软件状态',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 120,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.agentStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 120,
        },
        {
            title: '启动脚本路径',
            dataIndex: 'startupScriptPath',
            key: 'startupScriptPath',
            width: 250,
            ellipsis: true
        },
        {
            title: '停止脚本路径',
            dataIndex: 'stopScriptPath',
            key: 'stopScriptPath',
            width: 250,
            ellipsis: true
        },
        {
            title: '启动参数',
            dataIndex: 'startupScriptArgs',
            key: 'startupScriptArgs',
            width: 150,
        },
        {
            title: '停止参数',
            dataIndex: 'stopScriptArgs',
            key: 'stopScriptArgs',
            width: 150,
        },
        {
            title: '软件备注',
            dataIndex: 'softRemarks',
            key: 'softRemarks',
            width: 200,
        },
    ];

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    );

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    // const typemap = getTypebyId('100000000000001002');         // 类型
    const statusmap = getTypebyId('100000000000001003');       // 状态
    const zonemap = getTypebyId('100000000000001004');         // 区域

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
                typeid="100000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Row gutter={8} >
                <Form {...formItemLayout} onSubmit={handleSearch}>
                    <Col span={8}>
                        <Form.Item label="区域">
                            {getFieldDecorator('hostZoneId ', {
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
                    <Col span={8}>
                        <Form.Item label="设备名称">
                            {getFieldDecorator('hostName', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="设备IP">
                            {getFieldDecorator('hostIp', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="软件名称">
                            {getFieldDecorator('softName', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="软件端口">
                            {getFieldDecorator('softPort', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="软件路径">
                            {getFieldDecorator('softPath', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="软件版本号">
                            {getFieldDecorator('softVersion', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="软件状态">
                            {getFieldDecorator('softStatus', {
                                initialValue: '1',
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
                    <Col span={8}>
                        <Form.Item label="负责人">
                            {getFieldDecorator('director', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{ marginBottom: 14, textAlign: 'right' }}>{extra}</Col>
                </Form>
            </Row>
            <Table
                dataSource={softobjectlist.rows}
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
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ autosoftwork, loading }) => ({
        softobjectlist: autosoftwork.softobjectlist,
        loading: loading.models.autosoftwork,
    }))(AddagentObjDrawer),
);