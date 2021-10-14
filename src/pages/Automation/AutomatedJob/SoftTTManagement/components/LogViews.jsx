import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import DictLower from '@/components/SysDict/DictLower';
import { Table, Button, Form, Select, Row, Col, Badge, Tooltip } from 'antd';

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
    ['执行失败', 'error'],
    ['执行成功', 'success'],
]);

function LogViews(props) {
    const {
        loading,
        dispatch,
        recordvalues,
        autosoftworkloglist,
        ChangeshowlistValue,
        GetrelationId, // 获取工单id
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false });
    // const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (RowKeys) => {
        setSelectedRowKeys(RowKeys);
        // setSelectedRows(Rows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.workId = recordvalues.id;
        dispatch({
            type: 'autosoftwork/findautosoftworklogsList',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        if (recordvalues && recordvalues.id) {
            searchdata(1, 15);
        }
    }, [recordvalues.id]);

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
        total: autosoftworkloglist.total,
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

    // const keyallrelation = () => {
    //     const len = selectedRowKeys.length;
    //     if(len === 0) {
    //         message.error("您还没有选择数据！");
    //     } else {
    //         const ids = selectedRows.map(i => {return i.id;});
    //         GetrelationId(ids);
    //         ChangeshowlistValue(false);
    //     }
    // };

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    );

    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZone',
            key: 'hostZone',
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
            dataIndex: 'hostAddress',
            key: 'hostAddress',
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
            title: '执行结果',
            dataIndex: 'executeStatus',
            key: 'executeStatus',
            width: 150,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.executeStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '执行返回',
            dataIndex: 'executeResult',
            key: 'executeResult',
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
                  <Tooltip placement='topLeft' title={text} overlayStyle={{ maxWidth: '250px' }}>
                    {text}
                  </Tooltip>)
              }
        },
        {
            title: '执行类型',
            dataIndex: 'workType',
            key: 'workType',
            width: 200,
        },
        {
            title: '执行时长',
            dataIndex: 'executeLength',
            key: 'executeLength',
            width: 200,
        },
        {
            title: '执行人',
            dataIndex: 'executeBy',
            key: 'executeBy',
            width: 120,
        },
        {
            title: '执行时间',
            dataIndex: 'executeIssueTime',
            key: 'executeIssueTime',
            width: 250,
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (_, record) => {
                return (
                    <a onClick={() => { ChangeshowlistValue(false); GetrelationId(record.id)}}>关联工单</a>
                )
            },
        },
    ];

    // 数据字典取下拉值
    const getTypebyId = key => {
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const executestatusmap = getTypebyId('200000000000001004');       // 执行状态
    const worktypemap = getTypebyId('200000000000001007');         // 执行类型

    return (
        <>
            <DictLower
                typeid="200000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Row gutter={8} >
                <Form {...formItemLayout} onSubmit={handleSearch}>
                    <Col span={8}>
                        <Form.Item label="执行结果">
                            {getFieldDecorator('executeStatus', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择" allowClear>
                                    {executestatusmap.map(obj => (
                                        <Option key={obj.key} value={obj.dict_code}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="执行类型">
                            {getFieldDecorator('workType', {
                                initialValue: '',
                            })(
                                <Select placeholder="请选择" allowClear>
                                    {worktypemap.map(obj => (
                                        <Option key={obj.key} value={obj.dict_code}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
                </Form>
            </Row>
            {/* <div style={{ marginBottom: 8 }}>
                <Button type="primary" style={{ marginRight: 8 }}
                onClick={() => {keyallrelation(); }}
                >一键关联故障单</Button >
            </div> */}
            <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={autosoftworkloglist.rows}
                pagination={pagination}
                rowSelection={rowSelection}
                loading={loading}
                footer={null}
                scroll={{ x: 1300 }}
            />
        </>
    );
}

export default Form.create({})(
    connect(({ autosoftwork, loading }) => ({
        autosoftworkloglist: autosoftwork.autosoftworkloglist,
        loading: loading.models.autosoftwork,
    }))(LogViews),
);