import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Divider, Button, Message, Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import HostDrawer from './components/HostDrawer';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

function HostManege(props) {
    const pagetitle = props.route.name;
    const {
        dispatch, list, loading, location,
        form: {
            getFieldDecorator,
            // validateFields, 
            getFieldsValue,
            resetFields
        },
    } = props;
    const [expand, setExpand] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [visible, setVisible] = useState(false); // 抽屉是否显示
    const [title, setTitle] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    const [data, setData] = useState('');
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : ''
        values.endTime = values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : ''
        dispatch({
            type: 'agentmanage/query',
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

    const handleShowDrawer = (drwertitle, type, record) => {
        setVisible(!visible);
        setTitle(drwertitle);
        setSaveType(type);
        setData(record);
    };

    // 提交
    const handleSubmit = values => {
        dispatch({
            type: 'agentmanage/update',
            payload: {
                ...values,
            },
        }).then(res => {
            if (res.code === 200) {
                Message.success(res.msg);
                searchdata(1, 15);
            }
        });
    };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
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
        total: list.total,
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
            title: '区域',
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 120,
        },
        {
            title: '主机名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 180,
        },
        {
            title: '主机IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
        },
        {
            title: '操作系统',
            dataIndex: 'hostOsId',
            key: 'hostOsId',
            width: 200,
        },
        {
            title: '主机状态',
            dataIndex: 'hostStatus',
            key: 'hostStatus',
            width: 180,
        },
        {
            title: '主机排序',
            dataIndex: 'hostSorts',
            key: 'hostSorts',
            width: 120,
        },
        {
            title: '是否物理机',
            dataIndex: 'hostPhysicId',
            key: 'hostPhysicId',
            width: 120,
        },
        {
            title: '主机机柜',
            dataIndex: 'hostCabinetId',
            key: 'hostCabinetId',
            width: 200,
        },
        // {
        //     title: '所在U位',
        //     dataIndex: 'agentStatus',
        //     key: 'agentStatus',
        //     width: 180,
        // },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 80,
        },
        {
            title: '主机备注',
            dataIndex: 'hostRemarks',
            key: 'hostRemarks',
            width: 120,
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
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                return (
                    <div>
                        <a type="link" onClick={() => handleShowDrawer('编辑主机', 'update', record)}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a type="link" style={{ color: 'red' }}>
                            删除
                        </a>
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
    )

    const zonemap = [
        { key: '0', title: '一区' },
        { key: '1', title: '二区' },
        { key: '2', title: '三区' },
        { key: '3', title: '安全接入区' },
    ];

    const hostosmap = [
        { key: '0', title: 'linux' },
        { key: '1', title: 'windows' },
        { key: '2', title: 'mac' },
        { key: '3', title: '其他' },
    ];

    const statusmap = [
        { key: '0', title: '停用' },
        { key: '1', title: '在用' },
    ];

    const typemap = [
        { key: '0', title: '否' },
        { key: '1', title: '是' },
    ];

    // 数据字典取下拉值
    // const getTypebyId = key => {
    //     if (selectdata.ischange) {
    //         return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    //     }
    //     return [];
    // };

    // const zonemap = getTypebyId('');         // 区域
    // const statusmap = getTypebyId('');       // 状态
    // const typemap = getTypebyId('');         // 是否物理机

    return (
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid="100000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={8}>
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
                            <Form.Item label="主机名称">
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
                                    <Form.Item label="操作系统">
                                        {getFieldDecorator('hostOsId', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {hostosmap.map(obj => (
                                                <Option key={obj.key} value={obj.title}>
                                                    {obj.title}
                                                </Option>
                                            ))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="主机状态">
                                        {getFieldDecorator('hostStatus', {
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
                                <Col span={8}>
                                    <Form.Item label="是否物理机">
                                        {getFieldDecorator('hostPhysicId', {
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
                                <Col span={8}>
                                    <Form.Item label="负责人">
                                        {getFieldDecorator('director', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
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
                                                {getFieldDecorator('time1', {
                                                    // initialValue: '',
                                                })(
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
                                                {getFieldDecorator('time2', {
                                                    // initialValue: '',
                                                })(
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
                                        {getFieldDecorator('updateByNameExt', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="更新时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('time3', {
                                                    // initialValue: '',
                                                })(
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
                                                {getFieldDecorator('time4', {
                                                    // initialValue: '',
                                                })(
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
                        {expand ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '5.666667%' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleShowDrawer('新增主机', 'update',)}>新增</Button>
                    <Button type="primary" style={{ marginRight: 8 }}>导入</Button>
                    <Button type="primary" style={{ marginRight: 8 }}>导出</Button>
                    <Button type="primary" style={{ marginRight: 8 }}>下载导入模板</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={list.rows}
                    loading={loading}
                    rowKey={(_, index) => index.toString()}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
            {/* 抽屉 */}
            <HostDrawer
                visible={visible}
                ChangeVisible={newvalue => setVisible(newvalue)}
                title={title}
                handleSubmit={newvalue => handleSubmit(newvalue)}
                record={data}
                destroyOnClose
            />
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ agentmanage, loading }) => ({
        list: agentmanage.list,
        loading: loading.models.agentmanage,
    }))(HostManege),
);