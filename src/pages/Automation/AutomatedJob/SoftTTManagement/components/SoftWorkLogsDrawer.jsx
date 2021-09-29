import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Button, Form, Select, Row, Col, Badge, Input } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
import RelationDrawer from './RelationDrawer';

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

function SoftWorkLogsDrawer(props) {
    const {
        visibledrawer,
        ChangeVisibledrawer,
        titledrawer,
        recordvalues,
        dispatch,
        loading,
        autosoftworkloglist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
            // validateFields
        } } = props;

    const [selectdata, setSelectData] = useState({ arr: [], ischange: false });
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [visiblelog, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [showlist, setshowList] = useState(true);

    const hanldleCancel = () => {
        ChangeVisibledrawer(false);
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
        })
    };

    useEffect(() => {
        if (recordvalues && recordvalues.id) {
            searchdata(1, 15);
        }
    }, [recordvalues.id]);

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
        total: autosoftworkloglist.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

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
            // onCell: () => {
            //     return {
            //         style: {
            //             maxWidth: 250,
            //             overflow: 'hidden',
            //             whiteSpace: 'nowrap',
            //             textOverflow: 'ellipsis',
            //             cursor: 'pointer'
            //         }
            //     }
            // },
            // render: (text) => {
            //     return (
            //       <Tooltip placement='topLeft' title={text} overlayStyle={{ maxWidth: '250px' }}>
            //         {text}
            //       </Tooltip>)
            //   }
            // render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
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
            render: () => {
                return (
                    <a onClick={() => { setshowList(false); }}>关联工单</a>
                )
            },
        },
    ];

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

    const executestatusmap = getTypebyId('200000000000001004');       // 执行状态
    const worktypemap = getTypebyId('200000000000001007');         // 执行类型

    return (
        <Drawer
            title={titledrawer}
            width="65%"
            onClose={hanldleCancel}
            visible={visibledrawer}
            bodyStyle={{ paddingBottom: 60 }}
            destroyOnClose
        >
            <DictLower
                typeid="200000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            {
                showlist === false ? (
                    <>
                    <p onClick={() => { setshowList(true); }} style={{textAlign: 'right', cursor: 'pointer'}}>返回执行结果&gt;</p>
                    <Row>
                        <Col span={8}>
                            <Input placeholder="请输入故障单号" allowClear />
                        </Col>
                        <Col span={8}>
                            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
                            <Button style={{ marginLeft: 16 }} >重 置</Button>
                            <Button
                                type="primary"
                                style={{ marginLeft: 8 }}
                                onClick={() => { setVisible(true); setTitle('故障'); }}
                            >
                                关联工单
                            </Button>
                        </Col>
                    </Row>
                        <Table
                            style={{ marginTop: 16 }}
                            columns={columns}
                            // dataSource={searchrow === undefined ? list.rows : searchrow}
                            rowKey={r => r.id}
                            pagination={pagination}
                        />
                        {visiblelog && (
                            <RelationDrawer
                                title={title}
                                visible={visiblelog}
                                orderIdPre={recordvalues.id}
                                orderTypePre='trouble'
                                orderTypeSuf='trouble'
                                ChangeVisible={(v) => setVisible(v)}
                            />
                        )}
                    </>
                ) : (
                    <>
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
                        <div style={{ marginBottom: 8 }}>
                            <Button
                                type="primary"
                                style={{ marginLeft: 8 }}
                                onClick={() => { setshowList(false); }}
                            >
                                一键关联故障单
                            </Button>
                        </div>
                        <Table
                            dataSource={autosoftworkloglist.rows}
                            columns={columns}
                            rowKey={record => record.id}
                            scroll={{ x: 1300 }}
                            paginations={pagination}
                            loading={loading}
                            footer={null}
                        />
                    </>
                )
            }
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ autosoftwork, loading }) => ({
        autosoftworkloglist: autosoftwork.autosoftworkloglist,
        loading: loading.models.autosoftwork,
    }))(SoftWorkLogsDrawer),
);