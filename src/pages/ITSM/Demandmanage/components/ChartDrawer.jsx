import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
    Drawer,
    Button,
    Table
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
    },
    {
        title: '需求类型',
        dataIndex: 'demandType',
        key: 'demandType',
        with: 150,
    },
];

function ChartDrawer(props) {
    const {
        visible,
        ChangeVisible,
        drawerdata,
        dispatch,
        list,
        // loading
    } = props;

    // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

    const searchdata = (value, page, size) => {
        switch (value.staticName) {
            case '功能模块情况':
                dispatch({
                    type: 'demandquery/querylist',
                    payload: {
                        module: value.type,
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
                        demandType: value.type,
                        limit: size,
                        page
                    }
                })
                break;
            default:
                break;
        }
    }

    // 获取数据
    useEffect(() => {
        if (drawerdata)
            searchdata(drawerdata, 1, 15);
    }, [drawerdata]);

    // const onShowSizeChange = (page, size) => {
    //     searchdata(drawerdata, page - 1, size);
    //     setPageinations({
    //         ...paginations,
    //         pageSize: size,
    //     });
    // };

    // const changePage = page => {
    //     searchdata(drawerdata, page - 1, paginations.pageSize);
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
    //     total: a.total,
    //     showTotal: total => `总共  ${total}  条记录`,
    //     onChange: page => changePage(page),
    // };

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
                    // loading={loading}
                    dataSource={list.rows || []}
                    rowKey={record => record.id}
                    // pagination={pagination}
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