import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
    DatePicker,
    Select,
    Badge
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { querkeyVal } from '@/services/api';

const { Option } = Select;

const operations = <Button type="primary">
    <Link to="/automation/automatedjob/jobmanagement/jobexecute">返回列表</Link>
</Button>;

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

function ManualLog(props) {
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
        autotasklogslist,
        form: {
            getFieldDecorator,
            getFieldsValue,
            resetFields,
        },
    } = props;

    const [agentzonemap, setAgentzonemap] = useState({ arr: [], ischange: false }); // 下拉值
    const [executestatusmap, setExecutestatusmap] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (page, size) => {
        const values = getFieldsValue();
        values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.taskId = (Id !== '' || Id !== undefined) ? Id : '';
        dispatch({
            type: 'autotask/findlistPageAutoTaskLogs',
            payload: {
                values,
                pageNum: page,
                pageSize: size,
            },
        });
    };

    useEffect(() => {
        searchdata(1, 15);
        // 数据字典获取
        querkeyVal('agent', 'host_zone_id').then(res => { // 区域
            if (res.code === 200) {
                const value = Object.values(res.data)[0];
                const newData = value.map(item => {
                    return { key: item.key, title: item.val }
                });
                setAgentzonemap(newData);
            }
        });

        querkeyVal('auto', 'execute_status_id').then(res => { // 执行状态
            if (res.code === 200) {
                const value = Object.values(res.data)[0];
                const newData = value.map(item => {
                    return { key: item.key, title: item.val }
                });
                setExecutestatusmap(newData);
            }
        });
    }, [location]);

    const handleReset = () => {
        resetFields();
        searchdata(1, 15)
        setPageinations({ current: 1, pageSize: 15 });
    };

    const onShowSizeChange = (page, size) => {
        searchdata(1, size);
        setPageinations({
            ...paginations,
            current: 1,
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
        total: autotasklogslist.total,
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
    );

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: 60,
            render: (text, record, index) => {
                return <>{`${index + 1}`}</>;
            },
        },
        {
            title: '作业批次',
            dataIndex: 'batchNum',
            key: 'batchNum',
            width: 200,
        },
        {
            title: '区域',
            dataIndex: 'agentZone',
            key: 'agentZone',
            width: 150,
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 250,
        },
        {
            title: '设备IP',
            dataIndex: 'agentHost',
            key: 'agentHost',
            width: 200,
        },
        {
            title: '执行脚本',
            dataIndex: 'scriptCont',
            key: 'scriptCont',
            width: 350,
            ellipsis: true,
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: '执行返回',
            dataIndex: 'executeResult',
            key: 'executeResult',
            width: 350,
            ellipsis: true,
            render: (text) => {
                return (
                    <Tooltip placement="topLeft" title={text}>
                        <span>{text}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: '执行结果',
            dataIndex: 'executeStatus',
            key: 'executeStatus',
            width: 150,
            ellipsis: true,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.executeStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '数据返回时间',
            dataIndex: 'executeResultTime',
            key: 'executeResultTime',
            width: 250,
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
        }
    ];

    return (
        <PageHeaderWrapper title={pagetitle} extra={operations}>
            <Card>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="作业批次">
                                {getFieldDecorator('batchNum', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="区域">
                                {getFieldDecorator('agentZone', {
                                    initialValue: '',
                                })(<Select placeholder="请选择" allowClear>
                                    {agentzonemap && agentzonemap.length > 0 && agentzonemap.map(obj => (
                                        <Option key={obj.key} value={obj.key}>
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
                            <Form.Item label="主机IP">
                                {getFieldDecorator('agentHost', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="执行结果">
                                {getFieldDecorator('executeStatus', {
                                    initialValue: '',
                                })(<Select placeholder="请选择" allowClear>
                                    {executestatusmap && executestatusmap.length > 0 && executestatusmap.map(obj => (
                                        <Option key={obj.key} value={obj.key}>
                                            {obj.title}
                                        </Option>
                                    ))}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="执行人">
                                {getFieldDecorator('executeBy', {
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
                        <Col span={8} style={{ marginTop: 4, marginLeft: '8.1%' }}>{extra}</Col>
                    </Form></Row>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={autotasklogslist.rows}
                    rowKey={record => record.id}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        autotasklogslist: autotask.autotasklogslist,
        loading: loading.models.autotask,
    }))(ManualLog),
);
