import React
, {
    // useEffect,
    useState
}
    from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Table, Card, Divider, Button, Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

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

function JobConfig(props) {
    const pagetitle = props.route.name;
    const {
        // loading,
        // dispatch,
        // location,
        form: {
            getFieldDecorator,
            // getFieldsValue,
            resetFields,
        },
    } = props;

    const [expand, setExpand] = useState(false);
    // const [visible, setVisible] = useState(false); // 抽屉是否显示
    // const [title, setTitle] = useState('');
    // const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    // const [data, setData] = useState('');
    const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    //   const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    // const searchdata = (page, size) => {
    //     const values = getFieldsValue();
    //     //   values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     //   values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     //   values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     //   values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     dispatch({
    //         type: '',
    //         payload: {
    //             values,
    //             pageNum: page,
    //             pageSize: size,
    //         },
    //     });
    // };

    //   useEffect(() => {
    //       searchdata(1, 15);
    //   }, [location]);

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
        //   searchdata(1, 15)
        //   setPageinations({ current: 1, pageSize: 15 });
    };

    const newjobconfig = (edittype) => {
        if (edittype === 'edit') {
            router.push({
                pathname: '/automation/automatedjob/jobmanagement/jobconfig/new',
                query: {
                    addtab: true,
                    menuDes: '编辑作业配置',
                },
            })
        } else {
            router.push({
                pathname: '/automation/automatedjob/jobmanagement/jobconfig/new',
                query: {
                    addtab: true,
                },
                state: {
                    dynamicpath: true,
                    menuDesc: '添加作业配置',
                }
            })
        }
    }

    //   const onShowSizeChange = (page, size) => {
    //       searchdata(page, size);
    //       setPageinations({
    //           ...paginations,
    //           pageSize: size,
    //       });
    //   };

    //   const changePage = page => {
    //       searchdata(page, paginations.pageSize);
    //       setPageinations({
    //           ...paginations,
    //           current: page,
    //       });
    //   };

    //   const pagination = {
    //       showSizeChanger: true,
    //       onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    //       current: paginations.current,
    //       pageSize: paginations.pageSize,
    //       total: softList.total,
    //       showTotal: total => `总共  ${total}  条记录`,
    //       onChange: page => changePage(page),
    //   };

    const handleSearch = () => {
        //   setPageinations({
        //       ...paginations,
        //       current: 1,
        //   });
        //   searchdata(1, paginations.pageSize);
    };

    const handleDelete = id => { // 删除
        console.log(id)
        //   dispatch({
        //       type: '',
        //       payload: { Ids: id },
        //   }).then(res => {
        //       if (res.code === 200) {
        //           message.success('删除成功');
        //           searchdata(1, 15);
        //       } else {
        //           message.error(res.msg);
        //       }
        //   });
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
        if (selectdata.ischange) {
            return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
        }
        return [];
    };

    const tsskstatusmap = getTypebyId('200000000000001002'); // 作业状态
    const taskmodesmap = getTypebyId('200000000000001003'); // 作业方式
    const examinestatusmap = getTypebyId('200000000000001005'); // 审批状态

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
            title: '审核结果',
            dataIndex: 'examineResults',
            key: 'examineResults',
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
            title: '执行方式',
            dataIndex: 'taskModes',
            key: 'taskModes',
            width: 150,
        },
        {
            title: '创建人',
            dataIndex: 'createByNameExt',
            key: 'createByNameExt',
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
            dataIndex: 'updateByNameExt',
            key: 'updateByNameExt',
            width: 120,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 250,
        },
        {
            title: '审核说明',
            dataIndex: 'examineRemarks',
            key: 'examineRemarks',
            width: 250,
        },
        {
            title: '审核人',
            dataIndex: 'examineBy',
            key: 'examineBy',
            width: 120,
        },
        {
            title: '审核单位',
            dataIndex: 'examineDept',
            key: 'examineDept',
            width: 180,
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
                        >
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

    return (
        <PageHeaderWrapper title={pagetitle}>
            <DictLower
                typeid="200000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="作业名称">
                                {getFieldDecorator('taskName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="状态">
                                {getFieldDecorator('taskStatus', {
                                    initialValue: '',
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {tsskstatusmap.map(obj => (
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
                                    <Form.Item label="审核结果">
                                        {getFieldDecorator('examineResults', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {examinestatusmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
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
                                <Col span={8}>
                                    <Form.Item label="审核人">
                                        {getFieldDecorator('examineBy', {
                                            initialValue: '',
                                        })(<Input placeholder="请输入" allowClear />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="审核时间">
                                        <Row>
                                            <Col span={11}>
                                                {getFieldDecorator('startexamineTime', {})(
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
                                                {getFieldDecorator('endexamineTime', {})(
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
                                    <Form.Item label="作业方式">
                                        {getFieldDecorator('taskModes', {
                                            initialValue: '',
                                        })(
                                            <Select placeholder="请选择" allowClear>
                                                {taskmodesmap.map(obj => (
                                                    <Option key={obj.key} value={obj.title}>
                                                        {obj.title}
                                                    </Option>
                                                ))}
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {expand ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '130px' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                    </Form>
                </Row>
                <div style={{ marginBottom: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }}
                        onClick={() => newjobconfig()}
                    >新增</Button>
                </div>
                <Table
                    columns={columns}
                    rowKey={(_, index) => index.toString()}
                    //   pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(JobConfig);