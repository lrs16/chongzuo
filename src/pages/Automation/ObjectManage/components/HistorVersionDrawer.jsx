import React, { useState, useEffect } from 'react';
// import { connect } from 'dva';
import { Table, Drawer, Button, Form, Select, Row, Col, Input } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

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

function HistorVersionDrawer(props) {
    const {
        visible,
        ChangeVisible,
        title,
        location,
        // dispatch,
        // loading,
        form: {
            getFieldDecorator,
            // getFieldsValue,
            resetFields,
        } } = props;

    const [expand, setExpand] = useState(false);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const hanldleCancel = () => {
        ChangeVisible(false);
    };

    const searchdata = () => {
        // const values = getFieldsValue();
        // dispatch({
        //     type: '',
        //     payload: {
        //         values,
        //         pageNum: page,
        //         pageSize: size,
        //         taskId: undefined
        //     },
        // });
    };

    useEffect(() => {
        searchdata(1, 15);
    }, [location]);

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
        total: 15,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 120,
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 180,
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
            width: 180,
        },
        {
            title: '配置文件路径',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 250,
        },
        {
            title: '配置文件名称',
            dataIndex: 'softPath',
            key: 'softPath',
            width: 250,
        },
        {
            title: '配置文件大小',
            dataIndex: 'softVersion',
            key: 'softVersion',
            width: 250,
        },
        {
            title: '下载配置文件',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 300,
        },
        {
            title: '配置文件版本号',
            dataIndex: 'director',
            key: 'director',
            width: 150,
            editable: true
        },
        {
            title: '备份时间',
            dataIndex: 'gettime',
            key: 'gettime',
            width: 150,
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

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const zonemap = getTypebyId('100000000000001004');         // 区域

    return (
        <Drawer
            title={title}
            width="65%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
            footer={null}
            destroyOnClose
        >
            <DictLower
                typeid="100000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="区域">
                                {getFieldDecorator('hostZoneId', {
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
                        {expand && (
                            <>
                                <Col span={8}>
                                    <Form.Item label="主机IP">
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
                                    <Form.Item label="配置文件名称">
                                        {getFieldDecorator('softPort', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="配置文件路径">
                                        {getFieldDecorator('softPath', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <Table
                    // dataSource={.rows}
                    columns={columns}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    paginations={pagination}
                    // loading={loading}
                />
            </>
        </Drawer>
    );
}

export default Form.create({})(HistorVersionDrawer);