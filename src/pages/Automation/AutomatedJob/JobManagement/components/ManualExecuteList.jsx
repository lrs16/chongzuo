import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Row, Col, DatePicker, Divider } from 'antd';

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

function ManualExecuteList(props) {
    const {
        loading,
        dispatch,
        location,
        autotasklist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    // const [visible, setVisible] = useState(false); // 抽屉是否显示
    // const [title, setTitle] = useState('');
    // const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    // const [data, setData] = useState('');
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.taskStatus = '3';
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        dispatch({
            type: 'autotask/findautotaskList',
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

    //   const handleShowDrawer = (drwertitle, type, record) => {
    //       setVisible(!visible);
    //       setTitle(drwertitle);
    //       setSaveType(type);
    //       setData(record);
    //   };

    // 提交
    //   const handleSubmit = values => {
    //       if (savetype === '' || savetype === 'add') {
    //           dispatch({
    //               type: 'JobConfig/toaddSoft',
    //               payload: {
    //                   ...values,
    //               },
    //           }).then(res => {
    //               if (res.code === 200) {
    //                   message.success(res.msg);
    //                   searchdata(1, 15);
    //               } else {
    //                   message.error(res.msg);
    //               }
    //           });
    //       }
    //       if (savetype === 'update') {
    //           dispatch({
    //               type: 'JobConfig/toeditSoft',
    //               payload: {
    //                   ...values,
    //               },
    //           }).then(res => {
    //               if (res.code === 200) {
    //                   message.success(res.msg);
    //                   searchdata(1, 15);
    //               } else {
    //                   message.error(res.msg);
    //               }
    //           });
    //       }
    //   };

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
    };

    const newpagetolog = (id) => {
        router.push({
            pathname: '/automation/automatedjob/jobmanagement/jobexecute/manualexecutionlog',
            query: {
                Id: id,
                addtab: true,
                menuDes: '手动执行日志',
            },
        })
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
        total: autotasklist.total,
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

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    )

    const columns = [
        {
            title: '作业名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 200,
        },
        {
            title: '作业状态',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
            width: 150,
        },
        {
            title: '作业对象',
            dataIndex: 'taskObjectNum',
            key: 'taskObjectNum',
            width: 150,
        },
        {
            title: '作业脚本',
            dataIndex: 'taskScriptNum',
            key: 'taskScriptNum',
            width: 150,
        },
        {
            title: '作业备注',
            dataIndex: 'taskRemarks',
            key: 'taskRemarks',
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
            render: () => {
                return (
                    <div>
                        <a type="link"
                        >
                            执行
                        </a>
                        <Divider type="vertical" />
                        <a type="link" onClick={record => newpagetolog(record.id)}>
                            执行日志
                        </a>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Card>
                <Row>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={5}>
                            <Form.Item label="作业名称">
                                {getFieldDecorator('taskName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
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
                        <Col span={6} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
                    </Form>
                </Row>
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={autotasklist.rows}
                    pagination={pagination}
                    loading={loading}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        autotasklist: autotask.autotasklist,
        loading: loading.models.autotask,
    }))(ManualExecuteList),
);