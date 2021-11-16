import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
    Drawer,
    Button,
    Table,
    Tooltip,
    Popconfirm
} from 'antd';

const columns = [
    {
        title: '需求编号',
        dataIndex: 'demandId',
        key: 'demandId',
        with: 180,
        fixed: 'left',
    },
    {
        title: '功能模块',
        dataIndex: 'functionalModule',
        key: 'functionalModule',
        with: 180,
        ellipsis: true,
    },
    {
        title: '需求标题',
        dataIndex: 'title',
        key: 'title',
        with: 180,
        onCell: () => {
            return {
                style: {
                    maxWidth: 180,
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
        title: '需求原因',
        dataIndex: 'reason',
        key: 'reason',
        with: 180,
        ellipsis: true,
    },
    {
        title: '需求描述',
        dataIndex: 'detail',
        key: 'detail',
        with: 180,
        ellipsis: true,
    },
    {
        title: '申请人单位',
        dataIndex: 'proposingUnit',
        key: 'proposingUnit',
        with: 180,
        ellipsis: true,
    },
    {
        title: '申请人',
        dataIndex: 'proposer',
        key: 'proposer',
        with: 180,
        ellipsis: true,
    },
    {
        title: '联系电话',
        dataIndex: 'proposerPhone',
        key: 'proposerPhone',
        with: 180,
        ellipsis: true,
    },
    {
        title: '申请时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        with: 250,
    },
    {
        title: '业务科室领导审核结果',
        dataIndex: 'checkOneResult',
        key: 'checkOneResult',
        with: 400,
        ellipsis: true,
    },
    {
        title: '业务科室领导审核人',
        dataIndex: 'checkOneUserName',
        key: 'checkOneUserName',
        with: 350,
        ellipsis: true,
    },
    {
        title: '业务科室领导审核时间',
        dataIndex: 'checkThreeReviewTime',
        key: 'checkThreeReviewTime',
        with: 430,
        ellipsis: true,
    },
    {
        title: '期望完成时间',
        dataIndex: 'completeTime',
        key: 'completeTime',
        with: 250,
        ellipsis: true,
    },
    {
        title: '开发负责人',
        dataIndex: 'checkTwoDevelopmentLead',
        key: 'checkTwoDevelopmentLead',
        with: 180,
        ellipsis: true,
    },
    {
        title: '开发进度',
        dataIndex: 'developSchedule',
        key: 'developSchedule',
        with: 180,
        ellipsis: true,
    },
    {
        title: '预计开发完成时间',
        dataIndex: 'devFinishTime',
        key: 'devFinishTime',
        with: 350,
        ellipsis: true,
    },
    {
        title: '预计发布时间',
        dataIndex: 'releaseTime',
        key: 'releaseTime',
        with: 250,
        ellipsis: true,
    },
    {
        title: '需求登记人员确认结果',
        dataIndex: 'confirmTwoResult',
        key: 'confirmTwoResult',
        with: 430,
        ellipsis: true,
    },
];

function ChartDrawer(props) {
    const {
        visible,
        ChangeVisible,
        drawerdata,
        dispatch,
        list,
        loading
    } = props;

    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (value, page, size) => {
        // console.log(value, 'value')
        // startTime endTime
        switch (value.staticName) {
            case '需求总数':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                    }
                })
                break;
            case '已开发':
            case '已发布':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        pageNum: page,
                        pageSize: size,
                        developSchedule: value.staticName
                    }
                })
                break;
            case '功能模块情况':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        module: value.type || value.name,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求工单超时情况':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        completeStatus: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求类型统计分析':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        demandType: value.type || value.name,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求申请人':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        proposer: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求处理人':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        proposer: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求申请单位':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        proposer: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            case '需求处理单位':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        proposer: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            default:
                break;
        }
    };

    // 获取数据
    useEffect(() => {
        if (drawerdata)
            searchdata(drawerdata, 1, 15);
    }, [drawerdata]);

    const onShowSizeChange = (page, size) => {
        searchdata(drawerdata, 1, size);
        setPageinations({
            ...paginations,
            current: 1,
            pageSize: size,
        });
    };

    const changePage = page => {
        searchdata(drawerdata, page, paginations.pageSize);
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
        total: list.total,
        showTotal: total => `总共  ${total}  条记录`,
        onChange: page => changePage(page),
    };

    // 取消
    const hanldleCancel = () => {
        ChangeVisible(false);
    };

    //  下载 /导出功能
    const download = () => { };

    return (
        <>
            <Drawer
                visible={visible}
                width={1500}
                onClose={hanldleCancel}
                bodyStyle={{ paddingBottom: 60 }}
                destroyOnClose
            >
                <div style={{ marginBottom: 24 }}>
                    <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
                        <Button
                            type="primary">
                            导出数据
                        </Button>
                    </Popconfirm>
                </div>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={list.rows || []}
                    rowKey={record => record.id}
                    pagination={pagination}
                    scroll={{ x: 3200 }}
                />
            </Drawer>
        </>
    )
}

export default connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
}))(ChartDrawer);