import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Table, Card, Button, Form, Input, Row, Col, Badge, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import { downloadclockInfoExcel } from './services/api';

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

function ClockDetailView(props) {
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
        clockinfolistdetails,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        dispatch({
            type: 'automation/queryclockinfoList',
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
        total: clockinfolistdetails.total,
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
            downloadclockInfoExcel(Id).then(resp => {
                const filename = `时钟巡检明细下载_${Id}.xls`;
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
                onClick={() => download()}
            >
                下载巡检明细
            </Button>
            <Button type="primary">
                <Link to="/automation/automaticinspection/clockpatrol">返回列表</Link>
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

    const zonemap = getTypebyId('1428182995477942274'); // 主机区域

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
            width: 200,
            // render: (text, record) => {
            //     const obj = {
            //         children: text,
            //         props: {},
            //     };
            //     obj.props.rowSpan = mergeCells(record.hostZone, clockinfolistdetails.rows, 'hostZone');
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
            title: '服务器时间',
            dataIndex: 'hostTime',
            key: 'hostTime',
            width: 250,
            ellipsis: true,
        },
        {
            title: '标准时钟源',
            dataIndex: 'sourceTime',
            key: 'sourceTime',
            width: 250,
            ellipsis: true,
        },
        {
            title: '时间差',
            dataIndex: 'difference',
            key: 'difference',
            width: 200,
            ellipsis: true,
        },
        {
            title: '时延',
            dataIndex: 'delay',
            key: 'delay',
            width: 150,
            ellipsis: true,
        },
        {
            title: '巡检结果',
            dataIndex: 'result',
            key: 'result',
            width: 200,
            ellipsis: true,
            render: (text, record) => (
                <span>
                    <Badge status={colorrendermap.get(record.result)} text={text} />
                </span>
            ),
        },
    ];

    return (
        <PageHeaderWrapper title={pagetitle} extra={operations}>
            <DictLower
                typeid="1428178684907835393"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <h3>一、时钟巡检结果：</h3>
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
                <Table
                    // bordered
                    columns={columns}
                    loading={loading}
                    dataSource={clockinfolistdetails.rows || []}
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
        clockinfolistdetails: automation.clockinfolistdetails,
        loading: loading.models.automation,
    }))(ClockDetailView),
);
