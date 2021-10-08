/* eslint-disable react-hooks/rules-of-hooks */
import React, {
    useEffect,
    useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import HistorVersionDrawer from './components/HistorVersionDrawer';
import GetFileModal from './components/GetFileModal';

const { Option } = Select;
// const { confirm } = Modal;

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

function softwareConfig(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        dispatch,
        softconflist,
        location,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [expand, setExpand] = useState(false);
    const [confid, setconfId] = useState('');
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    // const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false); // 抽屉是否显示
    const [title, setTitle] = useState('');

    const handleShowHistoryDrawer = (drawtitle, gotid) => {
        setTitle(drawtitle);
        setconfId(gotid);
        setVisible(!visible);
    };

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'softconf/findsoftConfList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        })
        // .then(res => {
        //     console.log(res, "res")
        //     // if (res.code === 200) {
        //     //     const newarr = res.data.rows.map((item, index) => {
        //     //         return Object.assign(item, { key: index });
        //     //     });
        //     //     setData(newarr);
        //     // }
        // })
    };


    useEffect(() => {
        searchdata(1, 15);
    }, [location]);


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
        total: softconflist.total,
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

    // 提交保存数据
    // const savedata = (target, id) => {
    //     dispatch({
    //         type: 'softwaremanage/todynamicaddOrEdit',
    //         payload: {
    //             ...target,
    //             id,
    //         },
    //     }).then(res => {
    //         if (res.code === 200) {
    //             message.success(res.msg);
    //             searchdata(1, 15);
    //         }
    //     });
    // };

    // 获取行
    // const getRowByKey = (key, newData) => {
    //     return (newData || data).filter(item => item.key === key)[0];
    // };

    // 更新表单信息
    // const handleFieldChange = (e, fieldName, key) => {
    //     const newData = data.map(item => ({ ...item }));
    //     const target = getRowByKey(key, newData);
    //     if (target) {
    //         target[fieldName] = e;
    //         setData(newData);
    //     }
    // };

    // const showgetFileModel = () => {
    //     confirm({
    //         title: '获取文件提示',
    //         content: `获取最新文件，建议备份文件后再获取，若直接获取文件会覆盖当前列表数据！`,
    //         okText: '直接获取',
    //         okText1: '备份后获取',
    //         cancelText: '取消',
    //         onCancel() {

    //         },
    //         onOk() {

    //         },
    //         onOk1() {

    //         },
    //     });
    // };

    // const toggleEditable = (e, key) => {
    //     e.preventDefault();
    //     const newData = data.map(item => ({ ...item }));
    //     const target = getRowByKey(key, newData);
    //     if (target) {
    //         target.editable = !target.editable;
    //         setData(newData);
    //     }
    // }

    // const saveRow = (e, key) => {
    //     const target = getRowByKey(key) || {};
    //     delete target.key;
    //     target.editable = false;
    //     const id = target.id === '' ? '' : target.id;
    //     savedata(target, id);
    // };

    const columns = [{
        title: '批次号',
        dataIndex: 'pullNum',
        key: 'pullNum',
        width: 250,
    },
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
        width: 180,
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
        width: 200,
    },
    {
        title: '配置文件路径',
        dataIndex: 'confPath',
        key: 'confPath',
        width: 250,
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
        title: '配置文件名称',
        dataIndex: 'confName',
        key: 'confName',
        width: 250,
    },
    {
        title: '配置文件大小',
        dataIndex: 'confSize',
        key: 'confSize',
        width: 150,
    },
    {
        title: '配置文件内容',
        dataIndex: 'confCont',
        key: 'confCont',
        width: 300,
        onCell: () => {
            return {
                style: {
                    maxWidth: 300,
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
        title: '配置文件版本号',
        dataIndex: 'confVersion',
        key: 'confVersion',
        width: 200,
        // editable: true,
        // render: (text, record) => {
        //     if (record.editable) {
        //         return (
        //             <Input
        //                 type='text'
        //                 placeholder="请输入"
        //                 defaultValue={text}
        //                 onChange={e => handleFieldChange(e.target.value, 'director', record.key)}
        //             />
        //         );
        //     }
        //     return text;
        // },
    },
    {
        title: '文件md5',
        dataIndex: 'confMd5',
        key: 'confMd5',
        width: 300,
    },
    {
        title: '比对上次文件变化',
        dataIndex: 'lastCompareStatus',
        key: 'lastCompareStatus',
        width: 250,
        // render: (text, record) => {
        //     const statusMap = new Map([
        //         ['1', '无变化'],
        //         ['2', '新增'],
        //         ['3', '修改'],
        //         ['4', '删除'],
        //     ])
        //     return (
        //         <span>
        //             {statusMap.get(record.lastCompareStatus)}
        //         </span>
        //     );
        // },
    },
    {
        title: '文件修改时间',
        dataIndex: 'fileLateTime',
        key: 'fileLateTime',
        width: 200,
    },
    {
        title: '获取时间',
        dataIndex: 'pullTime',
        key: 'pullTime',
        width: 200,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
            return (
                <a type="link"
                    record={record}
                    text={text}
                    onClick={() => {
                        handleShowHistoryDrawer('查看历史版本', record.id);
                    }}
                >
                    历史版本
                </a>
            );
            // if (record.editable === '') {
            //     return null;
            // }
            // return record.editable ? (
            //     <span>
            //         <a
            //             onClick={e => saveRow(e, record.key)}
            //         >
            //             保存
            //         </a>
            //         <Divider type="vertical" />
            //         <a type="link"
            //             record={record}
            //             text={text}
            //             onClick={() => {
            //                 handleShowHistoryDrawer('查看历史版本');
            //             }}
            //         >
            //             历史版本
            //         </a>
            //     </span>
            // ) : (
            //     <span>
            //         <a onClick={e => toggleEditable(e, record.key)}>
            //             编辑版本号
            //         </a>
            //         <Divider type="vertical" />
            //         <a type="link"
            //             record={record}
            //             text={text}
            //             onClick={() => {
            //                 handleShowHistoryDrawer('查看历史版本');
            //             }}
            //         >
            //             历史版本
            //         </a>
            //     </span>
            // );
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

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const zonemap = getTypebyId('1428182995477942274'); // 区域
    const lastcomparestatusmap = getTypebyId('1444111752403349505'); // 软件配置变化状态

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
                            <Form.Item label="区域">
                                {getFieldDecorator('hostZoneId', {
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
                                        {getFieldDecorator('confName', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="配置文件路径">
                                        {getFieldDecorator('confPath', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="批次号">
                                        {getFieldDecorator('pullNum', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="比对上次文件变化">
                                        {getFieldDecorator('lastCompareStatus', {
                                            initialValue: '',
                                        })(<Select placeholder="请选择" allowClear>
                                            {lastcomparestatusmap.map(obj => (
                                                <Option key={obj.key} value={obj.dict_code}>
                                                    {obj.title}
                                                </Option>
                                            ))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="获取时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('startPullTime', {})(
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
                                                {getFieldDecorator('endPullTime', {})(
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
                    <GetFileModal>
                        <Button type="primary" style={{ marginRight: 8 }}
                        // onClick={() => showgetFileModel()}
                        >获取文件</Button>
                    </GetFileModal>
                </div>
                <Table
                    columns={columns}
                    dataSource={softconflist.rows}
                    loading={loading}
                    rowKey={(_, index) => index.toString()}
                    pagination={pagination}
                    scroll={{ x: 1600 }}
                />
                <HistorVersionDrawer
                    zonemap={zonemap}
                    lastcomparestatusmap={lastcomparestatusmap}
                    visible={visible}
                    ChangeVisible={newvalue => setVisible(newvalue)}
                    title={title}
                    id={confid}
                    destroyOnClose
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ softconf, loading }) => ({
        softconflist: softconf.softconflist,
        loading: loading.models.softconf,
    }))(softwareConfig),
);