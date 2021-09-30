import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Drawer, Button, Form, Row, Col, Input } from 'antd';
import RelationDrawer from './RelationDrawer';
import LogViews from "./LogViews";

function SoftWorkLogsDrawer(props) {
    const {
        visibledrawer,
        ChangeVisibledrawer,
        titledrawer,
        recordvalues,
        list,
        statuscode,
        dispatch,
        // location,
        // loading,
    } = props;

    const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
    const [visiblelog, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [showlist, setshowList] = useState(true);
    const [searchkey, setSearchKey] = useState('');
    const [searchrow, setSearchRow] = useState(undefined);
    const [getIdkey, setIdkey] = useState();

    const hanldleCancel = () => {
        ChangeVisibledrawer(false);
    };

    const getlist = (pageIndex, pageSize) => {
        dispatch({
            type: 'relationorder/fetcht',
            payload: {
                orderId: getIdkey,
                orderType: 'workSoft',
                pageIndex,
                pageSize,
                relationType: 'trouble',
            },
        })
    }

    const onShowSizeChange = (page, size) => {
        getlist(page - 1, size);
        setPageinations({
            ...paginations,
            pageSize: size,
        });
    };

    const changePage = page => {
        getlist(page - 1, paginations.pageSize);
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

    const handleSearch = () => {
        const { rows } = list;
        const newArr = rows.filter(item => {
            return item.orderNo.includes(searchkey);
        });
        if (newArr.length > 0) {
            setSearchRow(newArr);
        } else {
            setSearchRow([]);
        }
    }

    useEffect(() => {
        if (statuscode === 200) {
            getlist(paginations.current - 1, paginations.pageSize)
        }
    }, [statuscode])


    const columns = [
        {
            title: '故障单编码',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (text, record) => {
                const handleClick = () => {
                    router.push({
                        pathname: `/ITSM/faultmanage/querylist/record`,
                        query: {
                            id: record.mainId,
                            No: text,
                        },
                    });

                };
                return <a onClick={handleClick}>{text}</a>;
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '关联类型',
            dataIndex: 'relationType',
            key: 'relationType',
        },
    ];

    return (
        <Drawer
            title={titledrawer}
            width="65%"
            onClose={hanldleCancel}
            visible={visibledrawer}
            bodyStyle={{ paddingBottom: 60 }}
            destroyOnClose
        >
            {
                showlist === false ? (
                    <>
                        <p onClick={() => { setshowList(true); }} style={{ textAlign: 'right', cursor: 'pointer' }}>返回执行结果&gt;</p>
                        <Row>
                            <Col span={8}>
                                <Input onChange={e => setSearchKey(e.target.value)} placeholder="请输入故障单号" allowClear />
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
                                <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>
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
                            dataSource={searchrow === undefined ? list.rows : searchrow}
                            rowKey={r => r.id}
                            pagination={pagination}
                        />
                        {visiblelog && (
                            <RelationDrawer
                                title={title}
                                visible={visiblelog}
                                orderIdPre={getIdkey}
                                orderTypePre='workSoft'
                                orderTypeSuf='trouble'
                                ChangeVisible={(v) => setVisible(v)}
                            />
                        )}
                    </>
                ) : (<LogViews
                    recordvalues={recordvalues}
                    ChangeshowlistValue={newvalue => setshowList(newvalue)} 
                    GetrelationId={newvalue => setIdkey(newvalue)}
                />)
            }
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ relationorder, loading }) => ({
        list: relationorder.list,
        statuscode: relationorder.statuscode,
        loading: loading.models.relationorder,
    }))(SoftWorkLogsDrawer),
);