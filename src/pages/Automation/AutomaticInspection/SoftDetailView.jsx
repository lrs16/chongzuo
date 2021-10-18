import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { 
    Table, 
    Card, 
    Button, 
    Form, 
    Input, 
    Tooltip, 
    Row, 
    Col, 
    message, 
    Badge, 
    Select 
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import { downloadsoftInfoExcel, createsoftEvent } from './services/api';

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

function SoftDetailView(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        dispatch,
        location,
        location: {
            query: {
                Id,
            }
        },
        softinfolistdetails,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 }); // 分页

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        dispatch({
            type: 'automation/querysoftinfoList',
            payload: {
                ...values,
                id: Id,
                pageIndex: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        if (Id && Id !== '' && Id !== undefined) {
            searchdata(1, 15);
        }
    }, [location && Id]);

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
        total: softinfolistdetails.total || 15,
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

    // 巡检明细下载
    const download = () => { 
        if (Id) {
            downloadsoftInfoExcel(Id).then(resp => {
                const filename = `软件巡检明细下载_${Id}.xlsx`;
                const blob = new Blob([resp]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            })
        }
    }

    const operations = (
        <>
            <Button type="primary" style={{ marginRight: 8 }}
                onClick={() => createsoftEvent(Id).then(res => {
                    if (res.code === 200) {
                        router.push({
                            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
                            query: {
                                taskName: '已登记',
                                taskId: res.taskId,
                                mainId: res.mainId,
                                check: '',
                                orderNo: res.no,
                            },
                        });
                    } else {
                        message.error(res.msg);
                    }
                })}
            >
                发起事件单
            </Button>
            <Button type="primary" style={{ marginRight: 8 }}
                onClick={() => download()}
            >
                下载巡检明细
            </Button>
            <Button type="primary">
                <Link to="/automation/automaticinspection/softwarepatrol">返回列表</Link>
            </Button>
        </>
    );

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

    const resultmap = [{
        key: '0',
        title: '正常'
    }, {
        key: '1',
        title: '异常'
    }];

    const zonemap = getTypebyId(107); // 主机区域

    const colorrendermap = new Map([
        ['异常', 'error'],
        ['正常', 'success'],
    ]);

    // 表格合并
    // const temp = {};
    // const mergeCells = (text, array, columns, unit) => {
    //     let i = 0;
    //     if (text !== temp[columns]) {
    //         temp[columns] = text;
    //         if (unit) {
    //             array.forEach((item) => {
    //                 if (item[columns] === temp[columns] && item[unit] === temp[unit]) {
    //                     i += 1;
    //                 }
    //             });
    //         } else {
    //             array.forEach((item) => {
    //                 if (item[columns] === temp[columns]) {
    //                     i += 1;
    //                 }
    //             });
    //         }
    //     }
    //     return i;
    // };

    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZone',
            key: 'hostZone',
            width: 250,
            align: 'center',
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.hostZone, softinfolistdetails.rows, 'hostZone');
            //     return obj;
            // },
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 250,
            ellipsis: true,
            align: 'center',
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.hostName, softinfolistdetails.rows, 'hostName', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '设备IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
            ellipsis: true,
            align: 'center',
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.hostIp, softinfolistdetails.rows, 'hostIp', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: 'top',
            dataIndex: 'top',
            key: 'top',
            width: 250,
            ellipsis: true,
            align: 'center',
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
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
            // render: (text, record) => {
            //     const obj = {
            //         children: <Tooltip placement="topLeft" title={text}>
            //             <span>{text}</span>
            //         </Tooltip>,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.top, softinfolistdetails.rows, 'top', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '内存使用情况',
            dataIndex: 'memory',
            key: 'memory',
            width: 250,
            ellipsis: true,
            align: 'center',
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
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
            // render: (text, record) => {
            //     const obj = {
            //         children: <Tooltip placement="topLeft" title={text}>
            //             <span>{text}</span>
            //         </Tooltip>,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.memory, softinfolistdetails.rows, 'memory', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '磁盘使用情况',
            dataIndex: 'disk',
            key: 'disk',
            width: 250,
            ellipsis: true,
            align: 'center',
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
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
            // render: (text, record) => {
            //     const obj = {
            //         children: <Tooltip placement="topLeft" title={text}>
            //             <span>{text}</span>
            //         </Tooltip>,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.disk, softinfolistdetails.rows, 'disk', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '网络连接情况(TIME_WAIT)',
            dataIndex: 'networkTimeWait',
            key: 'networkTimeWait',
            width: 300,
            ellipsis: true,
            align: 'center',
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.networkTimeWait, softinfolistdetails.rows, 'networkTimeWait', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '网络连接情况(CLOSE-WAIT)',
            dataIndex: 'networkCloseWait',
            key: 'networkCloseWait',
            width: 300,
            ellipsis: true,
            align: 'center',
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.networkCloseWait, softinfolistdetails.rows, 'networkCloseWait', 'hostZone')
            //     return obj;
            // },
        },
        {
            title: '软件名称',
            dataIndex: 'softName',
            key: 'softName',
            width: 250,
            ellipsis: true,
            align: 'center',
        },
        {
            title: '进程名称',
            dataIndex: 'processName',
            key: 'processName',
            width: 200,
            ellipsis: true,
            align: 'center',
        },
        {
            title: '进程id',
            dataIndex: 'processId',
            key: 'processId',
            width: 250,
            ellipsis: true,
            align: 'center',
        },
        {
            title: '进程gc情况',
            dataIndex: 'processGc',
            key: 'processGc',
            width: 250,
            ellipsis: true,
            align: 'center',
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
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: '软件日志',
            dataIndex: 'softLog',
            key: 'softLog',
            width: 200,
            align: 'center',
            ellipsis: true,
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
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 250,
            align: 'center',
        },
        {
            title: '巡检结果',
            dataIndex: 'result',
            key: 'result',
            width: 150,
            align: 'center',
            render: (text, record) => {
                return (
                    <Badge status={colorrendermap.get(record.result)} text={text} />
                )
            },
        },
        {
            title: '巡检时间',
            dataIndex: 'addTime',
            key: 'addTime',
            align: 'center',
            width: 250,
        },
    ];

    return (
        <PageHeaderWrapper title={pagetitle} extra={operations}>
            <DictLower
                typeid={104}
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <h3>一、软件巡检明细：</h3>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="区域">
                                {getFieldDecorator('hostZoneId', {
                                    initialValue: '',
                                })(<Select placeholder="请选择" allowClear>
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
                        <Col span={8}>
                            <Form.Item label="设备IP">
                                {getFieldDecorator('hostIp', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="巡检结果">
                                {getFieldDecorator('result', {
                                    initialValue: '',
                                })(<Select placeholder="请选择" allowClear>
                                    {resultmap.map(obj => (
                                        <Option key={obj.key} value={obj.title}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="进程名称">
                                {getFieldDecorator('processName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ marginTop: 4, textAlign: 'right' }}>{extra}</Col>
                    </Form></Row>
                <Table
                    // bordered
                    columns={columns}
                    loading={loading}
                    dataSource={softinfolistdetails.rows || []}
                    rowKey={record => record.id}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ automation, loading }) => ({
        softinfolistdetails: automation.softinfolistdetails,
        loading: loading.models.automation,
    }))(SoftDetailView),
);
