import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { 
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
import MergeTable from './components/MergeTable';
import { downloadInfoExcel, createEvent } from './services/api';

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
    ['异常', 'error'],
    ['正常', 'success'],
]);

const mergeCell = 'hostZone';

function HostDetailView(props) {
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
        infolistdetails,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 }); // 分页

    // 列表请求
    const searchdata = (page, size) => {
        const values = getFieldsValue();
        dispatch({
            type: 'automation/queryhostinfoList',
            payload: {
                ...values,
                id: Id,
                pageIndex: page,
                pageSize: size,
            },
        });
    };

    // 获取初始列表数据
    useEffect(() => {
        if (Id && Id !== '' && Id !== undefined) {
            searchdata(1, 15);
        }
    }, [location && Id]);

    // 重置
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

    // 分页
    const pagination = {
        showSizeChanger: true,
        onShowSizeChange: (page, size) => onShowSizeChange(page, size),
        current: paginations.current,
        pageSize: paginations.pageSize,
        total: infolistdetails.total || 15,
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

    // 巡检明细下载xls
    const download = () => { 
        if (Id) {
            downloadInfoExcel(Id).then(resp => {
                const filename = `主机巡检明细下载_${Id}.xlsx`;
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
                onClick={() => createEvent(Id).then(res => {
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
                <Link to="/automation/automaticinspection/hostpatrol">返回列表</Link>
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

    const columns = [
        {
            title: '区域',
            dataIndex: mergeCell,
            key: mergeCell,
            width: 250,
            ellipsis: true,
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = record.rowSpan;
            //     return obj;
            // },
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 250,
            ellipsis: true,
        },
        {
            title: '设备IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'CPU使用情况',
            dataIndex: 'cpu',
            key: 'cpu',
            width: 200,
            ellipsis: true,
        },
        {
            title: '内存使用情况',
            dataIndex: 'memory',
            key: 'memory',
            width: 200,
            ellipsis: true,
        },
        {
            title: '网络流量',
            dataIndex: 'netCard',
            key: 'netCard',
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
            title: '磁盘IO',
            dataIndex: 'io',
            key: 'io',
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
            title: '磁盘使用情况',
            dataIndex: 'disk',
            key: 'disk',
            width: 250,
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
            title: '巡检结果',
            dataIndex: 'result',
            key: 'result',
            width: 150,
            ellipsis: true,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.result)} text={text} />
                </span>
            ),
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
                <h3>一、主机巡检明细：</h3>
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
                        <Col span={8} style={{ marginTop: 4, marginLeft: '8.1%' }}>{extra}</Col>
                    </Form></Row>
                <MergeTable
                    column={columns}
                    // bordered
                    loading={loading}
                    tableSource={infolistdetails.rows || []}
                    pagination={pagination}
                    mergecell={mergeCell}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ automation, loading }) => ({
        infolistdetails: automation.infolistdetails,
        loading: loading.models.automation,
    }))(HostDetailView),
);
