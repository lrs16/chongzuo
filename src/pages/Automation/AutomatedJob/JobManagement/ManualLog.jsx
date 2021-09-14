import React, { useState } from 'react';
// import { connect } from 'dva';
// import router from 'umi/router';
import moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import DictLower from '@/components/SysDict/DictLower';

// const { Option } = Select;

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

function ManualLog(props) {
    const pagetitle = props.route.name;
    const {
        // loading,
        // dispatch,
        location: {
            query: {
                Id,
            }
        },
        // autotasklist,
        form: {
            getFieldDecorator,
            // getFieldsValue,
            resetFields,
        },
    } = props;

    console.log(Id, 'Id')

    // const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    // const searchdata = (page, size) => {
    //     const values = getFieldsValue();
    //     values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     dispatch({
    //         type: 'autotask/findautotaskList',
    //         payload: {
    //             values,
    //             pageNum: page,
    //             pageSize: size,
    //         },
    //     });
    // };

    // useEffect(() => {
    //     searchdata(1, 15);
    // }, [location]);

    const handleReset = () => {
        resetFields();
        // searchdata(1, 15)
        // setPageinations({ current: 1, pageSize: 15 });
    };

    // const onShowSizeChange = (page, size) => {
    //     searchdata(page, size);
    //     setPageinations({
    //         ...paginations,
    //         pageSize: size,
    //     });
    // };

    // const changePage = page => {
    //     searchdata(page, paginations.pageSize);
    //     setPageinations({
    //         ...paginations,
    //         current: page,
    //     });
    // };

    // const pagination = {
    //     showSizeChanger: true,
    //     onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    //     current: paginations.current,
    //     pageSize: paginations.pageSize,
    //     total: autotasklist.total,
    //     showTotal: total => `总共  ${total}  条记录`,
    //     onChange: page => changePage(page),
    // };

    const handleSearch = () => {
        // setPageinations({
        //     ...paginations,
        //     current: 1,
        // });
        // searchdata(1, paginations.pageSize);
    };

    // 查询
    const extra = (<>
        <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    );

    // 数据字典取下拉值
    // const getTypebyId = key => {
    //     if (selectdata.ischange) {
    //         return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    //     }
    //     return [];
    // };

    // const tsskstatusmap = getTypebyId('200000000000001002'); // 执行结果

    const columns = [
        {
            title: '作业批次',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 150,
        },
        {
            title: '作业对象数',
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
            title: '执行结果',
            dataIndex: 'taskRemarks',
            key: 'taskRemarks',
            width: 150,
        },
        {
            title: '执行返回',
            dataIndex: 'taskModes',
            key: 'taskModes',
            width: 200,
        },
        {
            title: '执行时长',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 200,
        },
        {
            title: '执行人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            width: 120,
        },
        {
            title: '执行时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 250,
        }
    ];

    return (
        <PageHeaderWrapper title={pagetitle}>
            {/* <DictLower
                typeid="200000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            /> */}
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={5}>
                            <Form.Item label="执行结果">
                                {getFieldDecorator('taskName', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="执行人">
                                {getFieldDecorator('createByNameExt', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="执行时间">
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
                    </Form></Row>
                <Table
                    columns={columns}
                    // loading={loading}
                    // dataSource={autotasklist.rows}
                    rowKey={record => record.id}
                    // pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(ManualLog);
// (
//     connect(({ autotask, loading }) => ({
//         autotasklist: autotask.autotasklist,
//         loading: loading.models.autotask,
//     }))(ManualLog),
// );