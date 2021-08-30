/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import moment from 'moment';
// import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import SystemScriptDrawer from './SystemScriptDrawer';
// import SysViewDrawer from './SysViewDrawer';

// const { Option } = Select;
// const directormap = [
//     { key: '1', title: '张三' },
//     { key: '2', title: '李四' },
//     { key: '3', title: '王五' },
//     { key: '3', title: '赵六' },
// ];

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

function SystemScriptList(props) {
    const {
        // loading,
        // scriptsourcemap,
        // scriptstatusmap,
        // scripttypemap,
        // formItemLayout,
        // location,
        // dispatch,
        // systemscriptlist,
        form: {
            getFieldDecorator,
            // getFieldsValue,
            // resetFields,
        } } = props;

    const [expand, setExpand] = useState(false);
    // const [selectedRows, setSelectedRows] = useState([]);
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    // const [visible, setVisible] = useState(false); // 抽屉是否显示
    // const [title, setTitle] = useState('');
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
    // const [data, setData] = useState('');

    // const onSelectChange = (RowKeys, Rows) => {
    //     setSelectedRowKeys(RowKeys);
    //     setSelectedRows(Rows);
    // };

    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    // };

    // const searchdata = (page, size) => {
    //     const values = getFieldsValue();
    //     values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //     dispatch({
    //         type: 'scriptconfig/findSystemScriptList',
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

    // const handleShowDrawer = (drwertitle, type, record) => {
    //     setVisible(!visible);
    //     setTitle(drwertitle);
    //     setSaveType(type);
    //     setData(record);
    // };

    // const Handlerecall = () => { // 撤回
    //     const len = selectedRowKeys.length;
    //     if (len === 0) {
    //         message.info('至少选择一条数据');
    //     } else {
    //         const ids = selectedRows.map(item => { return item.id; });
    //         dispatch({
    //             type: 'scriptconfig/torecellScript',
    //             payload: { Ids: ids.toString() },
    //         }).then(res => {
    //             if (res.code === 200) {
    //                 message.success(res.msg);
    //                 searchdata(1, 15);
    //             } else {
    //                 message.error(res.msg);
    //             }
    //         });
    //     }
    //     setSelectedRowKeys([]);
    //     setSelectedRows([]);
    // };

    // // 提交
    // const handleSubmit = values => {
    //     dispatch({
    //         type: 'scriptconfig/toupdatesystemScript',
    //         payload: {
    //             ...values,
    //         },
    //     }).then(res => {
    //         if (res.code === 200) {
    //             message.success(res.msg);
    //             searchdata(1, 15);
    //         } else {
    //             message.error(res.msg);
    //         }
    //     });
    // };

    // const handleDelete = id => { // 删除
    //     dispatch({
    //         type: 'scriptconfig/toDeletesystemScript',
    //         payload: { Ids: id },
    //     }).then(res => {
    //         if (res.code === 200) {
    //             message.success('删除成功');
    //             searchdata(1, 15);
    //         } else {
    //             message.error(res.msg);
    //         }
    //     });
    // };

    // const handleSearch = () => {
    //     setPageinations({
    //         ...paginations,
    //         current: 1,
    //     });
    //     searchdata(1, paginations.pageSize);
    // };

    // const handleReset = () => {
    //     resetFields();
    //     searchdata(1, 15)
    //     setPageinations({ current: 1, pageSize: 15 });
    // };

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
    //     total: systemscriptlist.total,
    //     showTotal: total => `总共  ${total}  条记录`,
    //     onChange: page => changePage(page),
    // };

    const columns = [
        {
            title: '脚本编号',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: '脚本名称',
            dataIndex: 'scriptName',
            key: 'scriptName',
            width: 200,
        },
        {
            title: '脚本类型',
            dataIndex: 'scriptType',
            key: 'scriptType',
            width: 120,
        },
        {
            title: '脚本内容',
            dataIndex: 'scriptCont',
            key: 'scriptCont',
            width: 300,
            ellipsis: true,
        },
        {
            title: '脚本参数',
            dataIndex: 'scriptArgs',
            key: 'scriptArgs',
            width: 180,
        },
        {
            title: '状态',
            dataIndex: 'scriptStatus',
            key: 'scriptStatus',
            width: 120,
        },
        {
            title: '脚本来源',
            dataIndex: 'scriptSource',
            key: 'scriptSource',
            width: 150,
        },
        {
            title: '脚本排序',
            dataIndex: 'scriptSorts',
            key: 'scriptSorts',
            width: 120,
        },
        {
            title: '脚本备注',
            dataIndex: 'scriptRemarks',
            key: 'scriptRemarks',
            width: 250,
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
        }
    ];

    // 查询
    const extra = (<>
        <Button type="primary">查 询</Button>
        <Button style={{ marginLeft: 8 }}>重 置</Button>
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
        <>
            <Row style={{ marginLeft: 70 }}>
                <Form {...formItemLayout}>
                    <Col span={8}>
                        <Form.Item label="脚本名称">
                            {getFieldDecorator('scriptName', {
                                initialValue: '',
                            })(<Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="脚本状态">
                            {getFieldDecorator('scriptStatus', {
                                initialValue: '',
                            })(
                                <Input placeholder="请输入" allowClear />)}
                        </Form.Item>
                    </Col>
                    {expand && (
                        <>
                            <Col span={8}>
                                <Form.Item label="脚本来源">
                                    {getFieldDecorator('scriptSource', {
                                        initialValue: '',
                                    })(
                                        <Input placeholder="请输入" allowClear />)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="脚本内容">
                                    {getFieldDecorator('scriptCont', {
                                        initialValue: '',
                                    })(<Input placeholder="请输入" allowClear />)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="负责人">
                                    {getFieldDecorator('director', {
                                        initialValue: '',
                                    })(<Input placeholder="请输入" allowClear />)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="创建人">
                                    {getFieldDecorator('createBy', {
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
                                    {getFieldDecorator('updateBy', {
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
                        </>
                    )}
                    {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
                </Form>
            </Row>
            <Table
                style={{ marginLeft: 118 }}
                columns={columns}
                rowKey={record => record.id}
                scroll={{ x: 1300 }}
            />
        </>
    );
}

export default Form.create({})(SystemScriptList);