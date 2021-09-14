import React, {
    useEffect,
    useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Divider, Button, Message, Form, Input, Select, Row, Col, DatePicker, Badge } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined, DownloadOutlined } from '@ant-design/icons';
import { togetSearchUsers } from './services/api';
import EquipDrawer from './components/EquipDrawer';
import SysLeadin from './components/SysLeadin';

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

function EquipmentManege(props) {
    const pagetitle = props.route.name;
    const {
        dispatch, equipList, loading,
        location,
        form: {
            getFieldDecorator,
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
    const [allUserData, setallUserData] = useState([]);   
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.starMaintainTime = values.starMaintainTime ? moment(values.starMaintainTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endMaintainTime = values.endMaintainTime ? moment(values.endMaintainTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'equipmanage/findEquipList',
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
                setallUserData(res.data.userList);
              } else {
                Message.error('获取负责人失败');
              }
        });
    }, [location]);

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
        setData(record);
    };

    // 提交
    const handleSubmit = values => {
        if (savetype === '' || savetype === 'add') {
            dispatch({
                type: 'equipmanage/toupdateEquip',
                payload: {
                    ...values,
                    maintainEndTime: values.maintainEndTime ? moment(values.maintainEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
                },
            }).then(res => {
                if (res.code === 200) {
                    Message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    Message.error(res.msg);
                }
            });
        }
        if (savetype === 'update') {
            dispatch({
                type: 'equipmanage/toupdateEquip',
                payload: {
                    ...values,
                    id: data.id,
                    maintainEndTime: values.maintainEndTime ? moment(values.maintainEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
                },
            }).then(res => {
                if (res.code === 200) {
                    Message.success(res.msg);
                    searchdata(1, 15);
                } else {
                    Message.error(res.msg);
                }
            });
        }
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
        total: equipList.total,
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

    const handleDelete = id => { // 删除
        dispatch({
            type: 'equipmanage/toDeleteEquip',
            payload: { Ids: id },
        }).then(res => {
            if (res.code === 200) {
                Message.success('删除成功');
                searchdata(1, 15);
            } else {
                Message.error(res.msg);
            }
        });
    };

    const columns = [
        {
            title: '设备编号',
            dataIndex: 'hostAssets',
            key: 'hostAssets',
            width: 200,
        },
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
            title: '操作系统',
            dataIndex: 'hostOsId',
            key: 'hostOsId',
            width: 200,
        },
        {
            title: '设备状态',
            dataIndex: 'hostStatus',
            key: 'hostStatus',
            width: 180,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.hostStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '设备排序',
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
            title: '设备类型',
            dataIndex: 'hostType',
            key: 'hostType',
            width: 180,
        },
        {
            title: '供电类型',
            dataIndex: 'electricType',
            key: 'electricType',
            width: 180,
        },
        {
            title: '位置变更',
            dataIndex: 'positionChange',
            key: 'positionChange',
            width: 180,
        },
        {
            title: '配置变更',
            dataIndex: 'deployChange',
            key: 'deployChange',
            width: 180,
        },
        {
            title: '占用U位',
            dataIndex: 'enployU',
            key: 'enployU',
            width: 180,
        },
        {
            title: '设备机柜',
            dataIndex: 'hostCabinetId',
            key: 'hostCabinetId',
            width: 220,
        },
        {
            title: '所在U位',
            dataIndex: 'uposition',
            key: 'uposition',
            width: 180,
        },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 80,
        },
        {
            title: '设备备注',
            dataIndex: 'hostRemarks',
            key: 'hostRemarks',
            width: 120,
        },
        {
            title: '维保结束时间',
            dataIndex: 'maintainEndTime',
            key: 'maintainEndTime',
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
            width: 150,
            render: (text, record) => {
                return (
                    <div>
                        <a type="link" onClick={() => handleShowDrawer('编辑设备', 'update', record)}>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a type="link" style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>
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
    );

    // 导出
    const download = () => {
        const values = getFieldsValue();
        dispatch({
            type: 'equipmanage/download',
            payload: {
                ...values,
                startTime: values.startTime?.length ? moment(values.startTime).format('YYYY-MM-DD 00:00:00') : '',
                endTime: values.endTime?.length ? moment(values.endTime).format('YYYY-MM-DD 23:59:59') : '',
                startUpdateTime: values.startUpdateTime?.length ? moment(values.startUpdateTime).format('YYYY-MM-DD 23:59:59') : '',
                endUpdateTime: values.endUpdateTime?.length ? moment(values.endUpdateTime).format('YYYY-MM-DD 23:59:59') : '',
                starMaintainTime: values.starMaintainTime?.length ? moment(values.starMaintainTime).format('YYYY-MM-DD 23:59:59') : '',
                endMaintainTime: values.endMaintainTime?.length ? moment(values.endMaintainTime).format('YYYY-MM-DD 23:59:59') : '',
            }
        }).then(res => {
            const filename = `设备导出_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    // 下载导入模板
    const downloadTemplate = () => {
        dispatch({
            type: 'equipmanage/downloadTemplate',
        }).then(res => {
            const filename = `设备导入模板_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        })
    };

    const directormap = [
        { key: '1', title: '张三' },
        { key: '2', title: '李四' },
        { key: '3', title: '王五' },
        { key: '3', title: '赵六' },
    ];

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const zonemap = getTypebyId('1428182995477942274'); // 主机区域
    const hoststatusmap = getTypebyId('1428184619231432705'); // 设备状态
    const hostosmap = getTypebyId('1428185083276644354'); // 操作系统
    const electrictype = getTypebyId('1428185267658248193'); // 供电类型
    const hosttype = getTypebyId('1428185403339788289'); // 设备类型
    const hostphysicmap = getTypebyId('1428185541785374722'); // 物理机

    return (
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid="1428178684907835393"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="设备编号">
                                {getFieldDecorator('hostAssets', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="设备区域">
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
                        {expand && (
                            <>
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
                                    <Form.Item label="设备状态">
                                        {getFieldDecorator('hostStatus', {
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
                                    <Form.Item label="是否物理机">
                                        {getFieldDecorator('hostPhysicId', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {hostphysicmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="供电类型">
                                        {getFieldDecorator('electricType', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {electrictype.map(obj => (
                                                <Option key={obj.key} value={obj.title}>
                                                    {obj.title}
                                                </Option>
                                            ))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="设备类型">
                                        {getFieldDecorator('hostType', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {hosttype.map(obj => (
                                                <Option key={obj.key} value={obj.title}>
                                                    {obj.title}
                                                </Option>
                                            ))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="维保结束时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('starMaintainTime', {
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
                                                {getFieldDecorator('endMaintainTime', {
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
                                    <Form.Item label="负责人">
                                        {getFieldDecorator('director', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {directormap.map(obj => (
                                                <Option key={obj.key} value={obj.title}>
                                                    {obj.title}
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
                                                {getFieldDecorator('startTime', {
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
                                                {getFieldDecorator('endTime', {
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
                                                {getFieldDecorator('startUpdateTime', {
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
                                                {getFieldDecorator('endUpdateTime', {
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
                        {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8, display: 'flex' }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleShowDrawer('新增设备', 'add',)}>新增</Button>
                    <div>
                        <SysLeadin
                            fileslist={[]}
                            ChangeFileslist={newvalue => setFiles(newvalue)}
                        />
                    </div>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => download()}>导出</Button>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={() => downloadTemplate()}><DownloadOutlined />下载导入模板</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={equipList.rows}
                    loading={loading}
                    rowKey={(_, index) => index.toString()}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
            {/* 抽屉 */}
            <EquipDrawer
                visible={visible}
                dispatch={dispatch}
                ChangeVisible={newvalue => setVisible(newvalue)}
                title={title}
                handleSubmit={newvalue => handleSubmit(newvalue)}
                record={data}
                destroyOnClose
                savetype={savetype}
                directormap={allUserData}
            />
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ equipmanage, loading }) => ({
        equipList: equipmanage.equipList,
        loading: loading.models.equipmanage,
    }))(EquipmentManege),
);