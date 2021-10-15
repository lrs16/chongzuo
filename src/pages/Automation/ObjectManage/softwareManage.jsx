import React, {
    useEffect,
    useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Divider, Button, message, Form, Input, Select, Row, Col, DatePicker, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { togetSearchUsers } from './services/api';
import SoftwareDrawer from './components/SoftwareDrawer';
import DynamicModal from './components/DynamicModal';

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
    ['停用', 'error'],
    ['在用', 'success'],
]);

function SoftwareManage(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        dispatch,
        softList,
        location,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
            setFieldsValue
        },
    } = props;

    const [expand, setExpand] = useState(false);
    const [visible, setVisible] = useState(false); // 抽屉是否显示
    const [title, setTitle] = useState('');
    const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    const [data, setData] = useState('');
    const [allUserData, setallUserData] = useState([]);
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    // 列表请求
    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'softwaremanage/findSoftList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        searchdata(1, 15);
        togetSearchUsers().then(res => {
            if (res.code === 200) {
                setallUserData(res.data.userList)
            } else {
                message.error('获取负责人失败')
            }
        });
    }, [location]);

    // 打开弹窗
    const handleShowDrawer = (drwertitle, type, record) => {
        setVisible(!visible);
        setTitle(drwertitle);
        setSaveType(type);
        setData(record);
    };

    // 提交
    const handleSubmit = values => {
        if (savetype === '' || savetype === 'add') {
            dispatch({
                type: 'softwaremanage/toaddSoft',
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
        }
        if (savetype === 'update') {
            dispatch({
                type: 'softwaremanage/toeditSoft',
                payload: {
                    ...values,
                    id: data.id,
                },
            }).then(res => {
                if (res.code === 200) {
                    message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    message.error(res.msg);
                }
            });
        }
    };

    // 重置
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

    // 分页
    const pagination = {
        showSizeChanger: true,
        onShowSizeChange: (page, size) => onShowSizeChange(page, size),
        current: paginations.current,
        pageSize: paginations.pageSize,
        total: softList.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    // 查询
    const handleSearch = () => {
        setPageinations({
            ...paginations,
            current: 1,
        });
        searchdata(1, paginations.pageSize);
    };

    // 删除
    const handleDelete = id => {
        dispatch({
            type: 'softwaremanage/todeleteSoft',
            payload: { Ids: id },
        }).then(res => {
            if (res.code === 200) {
                message.success('删除成功');
                searchdata(1, 15);
            } else {
                message.error(res.msg);
            }
        });
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
        if (selectdata.ischange && selectdata && selectdata.arr.length > 0) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const zonemap = getTypebyId(717); // 区域
    const hoststatusmap = getTypebyId(1258); // 软件状态
    const dynamicnamemap = getTypebyId(740); // 软件属性名称

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
            ellipsis: true,
        },
        {
            title: '主机IP',
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
            title: '软件端口',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 180,
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
            width: 180,
        },
        {
            title: '软件状态',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 180,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.softStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 80,
        },
        {
            title: '软件排序',
            dataIndex: 'softSorts',
            key: 'softSorts',
            width: 120,
        },

        {
            title: '启动脚本路径',
            dataIndex: 'startupScriptPath',
            key: 'startupScriptPath',
            width: 250,
            ellipsis: true,
        },
        {
            title: '停止脚本路径',
            dataIndex: 'stopScriptPath',
            key: 'stopScriptPath',
            width: 250,
            ellipsis: true,
        },
        {
            title: '启动参数',
            dataIndex: 'startupScriptArgs',
            key: 'startupScriptArgs',
            width: 120,
        },
        {
            title: '停止参数',
            dataIndex: 'stopScriptArgs',
            key: 'stopScriptArgs',
            width: 180,
        },
        {
            title: '是否巡检',
            dataIndex: 'monitor',
            key: 'monitor',
            width: 120,
        },
        {
            title: '是否监控',
            dataIndex: 'patrolInspection',
            key: 'patrolInspection',
            width: 120,
        },
        {
            title: '软件备注',
            dataIndex: 'softRemarks',
            key: 'softRemarks',
            width: 250,
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            key: 'createBy',
            width: 250,
            ellipsis: true,
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
            width: 250,
            ellipsis: true,
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
            width: 200,
            render: (text, record) => {
                return (
                    <div>
                        <a type="link"
                            onClick={() => handleShowDrawer('编辑软件', 'update', record)}
                        >
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a type="link" style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>
                            删除
                        </a>
                        <Divider type="vertical" />
                        <DynamicModal
                            dispatch={dispatch}
                            // dataSource={dynamicList.rows}
                            dynamicnamemap={dynamicnamemap}
                            ChangeValue={v => setFieldsValue({ dynamicList: v })}
                            softId={record.id}

                        >
                            <a type="link">
                                其他属性
                            </a>
                        </DynamicModal>
                    </div>
                );
            },
        },
    ];

    return (
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid={710}
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
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
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {hoststatusmap.map(obj => (
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
                                        {getFieldDecorator('updateByNameExt', {
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
                        {expand ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '8.666667%' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }}
                        onClick={() => handleShowDrawer('新增软件', 'add',)}
                    >新增</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={softList.rows}
                    loading={loading}
                    rowKey={(_, index) => index.toString()}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
            {/* 抽屉 */}
            <SoftwareDrawer
                visible={visible}
                dispatch={dispatch}
                ChangeVisible={newvalue => setVisible(newvalue)}
                title={title}
                handleSubmit={newvalue => handleSubmit(newvalue)}
                record={data}
                savetype={savetype}
                destroyOnClose
                directormap={allUserData}
            />
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ softwaremanage, loading }) => ({
        softList: softwaremanage.softList,
        loading: loading.models.softwaremanage,
    }))(SoftwareManage),
);