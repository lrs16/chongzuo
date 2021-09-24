import React, { useState, useEffect } from 'react';
// import { connect } from 'dva';
// import router from 'umi/router';
import Link from 'umi/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Table, Card, Button, Form, Input, Tooltip, Row, Col, DatePicker, Badge } from 'antd';
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

const colormap = new Map([
    ['异常', 'error'],
    ['正常', 'success'],
]);

function HostDetailView(props) {
    const pagetitle = props.route.name;
    const {
        loading,
        // dispatch,
        location,
        // location: {
        //     query: {
        //         Id,
        //     }
        // },
        // list,
        form: {
            getFieldDecorator,
            // getFieldsValue,
            resetFields,
        },
    } = props;

    // const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = () => {
        // const values = getFieldsValue();
        // values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
        // values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
        // values.taskId = (Id !== '' || Id !== undefined) ? Id : '';
        // dispatch({
        //     type: '',
        //     payload: {
        //         values,
        //         pageNum: page,
        //         pageSize: size,
        //     },
        // });
    };

    // const tosearchlog = (Id) => {
    //     dispatch({
    //         type: 'autotask/findlistPageAutoTaskLogs',
    //         payload: {
    //             taskId: Id,
    //         },
    //     });
    // };

    useEffect(() => {
        // if(Id && (Id !== '' || Id !== undefined)) {
        //     tosearchlog(Id);
        // } else {
        searchdata(1, 15);
        // }
    }, [location]);

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
        total: 15,
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

    // const download = () => { // 下载
    //     dispatch({
    //       type: '',
    //       payload: {  }
    //     }).then(res => {
    //       const filename = '下载.xls';
    //       const blob = new Blob([res]);
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       a.download = filename;
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     })
    //   }

    const operations = (
        <>
            <Button type="primary" style={{ marginRight: 8 }}>
              发起事件单
            </Button>
            <Button type="primary" style={{ marginRight: 8 }}>
              {/* onClick={download} */}
              下载
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
    // const getTypebyId = key => {
    //     if (selectdata.ischange) {
    //         return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    //     }
    //     return [];
    // };

    // const tsskstatusmap = getTypebyId('200000000000001002'); // 执行结果

    const columns = [
        // {
        //     title: '序号',
        //     dataIndex: 'key',
        //     key: 'key',
        //     width: 60,
        //     render: (text, record, index) => {
        //         return <>{`${index + 1}`}</>;
        //     },
        // },
        {
            title: '区域',
            dataIndex: 'agentZone',
            key: 'agentZone',
            width: 150,
            render: (text, record) => {
                const obj = {
                  children: text,
                  props: {},
                };
                obj.props.rowSpan = record.rowSpan;
                return obj;
            },
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
            title: 'CPU使用情况',
            dataIndex: 'f1',
            key: 'f1',
            width: 200,
        },
        {
            title: '内存使用情况',
            dataIndex: 'f2',
            key: 'f2',
            width: 200,
        },
        {
            title: '网络流量',
            dataIndex: 'f3',
            key: 'f3',
            width: 150,
        },
        {
            title: '磁盘IO',
            dataIndex: 'f4',
            key: 'f4',
            width: 150,
        },
        {
            title: '磁盘使用情况',
            dataIndex: 'f5',
            key: 'f5',
            width: 250,
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
            title: '巡检结果',
            dataIndex: 'f6',
            key: 'f6',
            width: 150,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.executeStatus)} text={text} />
                </span>
            ),
        },
    ];

    return (
        <PageHeaderWrapper title={pagetitle} extra={operations}>
            {/* <DictLower
                typeid="200000000000001001"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            /> */}
            <Card>
                <h3>一、主机巡检明细：</h3>
                <Row gutter={16}>
                    <Form {...formItemLayout} onSubmit={handleSearch}>
                        <Col span={8}>
                            <Form.Item label="区域">
                                {getFieldDecorator('agentZone', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
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
                                {getFieldDecorator('agentHost', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="巡检结果">
                                {getFieldDecorator('executeResult', {
                                    initialValue: '',
                                })(<Input placeholder="请输入" allowClear />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ marginTop: 4, marginLeft: '8.1%' }}>{extra}</Col>
                    </Form></Row>
                <Table
                    columns={columns}
                    loading={loading}
                    // dataSource={list.rows}
                    rowKey={record => record.id}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </PageHeaderWrapper>
    );
}

export default Form.create({})(HostDetailView);
// (
//     connect(({ autotask, loading }) => ({
//         autotasklogslist: autotask.autotasklogslist,
//         loading: loading.models.autotask,
//     }))(HostDetailView),
// );
