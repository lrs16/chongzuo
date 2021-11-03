import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Drawer,
    Button,
    Table,
    Tooltip
} from 'antd';

const columns = [
    {
        title: '需求编号',
        dataIndex: 'demandId',
        key: 'demandId',
        with: 100,
        fixed: 'left',
    },
    {
        title: '需求标题',
        dataIndex: 'demandTitle',
        key: 'demandTitle',
        with: 250,
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
        render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
    },
    {
        title: '需求类型',
        dataIndex: 'demandType',
        key: 'demandType',
        with: 150,
    },
    {
        title: '申请人',
        dataIndex: 'proposer',
        key: 'proposer',
        with: 100,
    },
    {
        title: '当前处理环节',
        dataIndex: 'taskName',
        key: 'taskName',
        with: 200,
    },

    {
        title: '登记人',
        dataIndex: 'sender',
        key: 'sender',
        with: 100,
    },
    {
        title: '建单时间',
        dataIndex: 'sendTime',
        key: 'sendTime',
        render: text => {
            return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
        },
    },
    {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        with: 80,
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
        switch (value.staticName) {
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

    return (
        <>
            <Drawer
                visible={visible}
                width={1120}
                onClose={hanldleCancel}
                bodyStyle={{ paddingBottom: 60 }}
                destroyOnClose
            >
                <Button
                    type="primary">
                    导出数据
                </Button>

                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={list.rows || []}
                    rowKey={record => record.id}
                    pagination={pagination}
                    scroll={{ x: 1300 }}
                />
            </Drawer>
        </>
    )
}

export default connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
}))(ChartDrawer);