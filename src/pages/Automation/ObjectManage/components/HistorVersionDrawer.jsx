import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Button, Form, Select, Row, Col, Input, DatePicker, Tooltip } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import { downloadConfHiCont } from '../services/api';

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
        zonemap,
        softconfhistorylist,
        dispatch,
        lastcomparestatusmap,
        loading,
        id,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        }
    } = props;

    const [expand, setExpand] = useState(false);
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const hanldleCancel = () => {
        ChangeVisible(false);
    };

    // 列表请求
    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.confInstance = id;
        dispatch({
            type: 'softconf/findsoftConfHistoryList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        if (id && id !== '' && id !== undefined)
            searchdata(1, 15);
    }, [id]);

    // 查询
    const handleSearch = () => {
        setPageinations({
            ...paginations,
            current: 1,
        });
        searchdata(1, paginations.pageSize);
    };

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
        total: softconfhistorylist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    // 配置文件内容下载（格式未知，先text）
    const handledownFile = (v) => {
        downloadConfHiCont({ Id: v }).then(res => {
            //   const filename = `${v}_配置文件内容.yml`;
            const filename = `_`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const columns = [
        {
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
            width: 300,
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
            width: 300,
            ellipsis: true,
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
            width: 250,
        },
        {
            title: '下载配置文件',
            dataIndex: 'confCont',
            key: 'confCont',
            width: 300,
            ellipsis: true, // 省略号
            render: (text, record) => {
                return (
                    <a type="link"
                        onClick={() => handledownFile(record.id)}
                    >{text}</a>
                );
            },
        },
        {
            title: '配置文件版本号',
            dataIndex: 'confVersion',
            key: 'confVersion',
            width: 200,
            editable: true
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
            title: '获取时间',
            dataIndex: 'pullTime',
            key: 'pullTime',
            width: 250,
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

    return (
        <Drawer
            title={title}
            width="80%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
            footer={null}
            destroyOnClose
        >
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
                <Table
                    dataSource={softconfhistorylist.rows}
                    columns={columns}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    pagination={pagination}
                    loading={loading}
                />
            </>
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ softconf, loading }) => ({
        softconfhistorylist: softconf.softconfhistorylist,
        loading: loading.models.softconf,
    }))(HistorVersionDrawer),
);