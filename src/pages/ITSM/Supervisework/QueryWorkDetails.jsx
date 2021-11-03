import React, { useEffect, useState, createContext } from 'react';
import { connect } from 'dva';
import {
    Button,
    Collapse,
    Form,
    Spin
} from 'antd';
import router from 'umi/router';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TaskworkEditfillins from './components/TaskworkEditfillins'; // 工作任务
import ExecuteworkEditfillins from './components/ExecuteworkEditfillins'; // 工作执行
import CheckdelayworkEditfillins from './components/CheckdelayworkEditfillins'; // 工作延期审核
import SuperviseList from './components/SuperviseList';
import styles from './index.less';

const { Panel } = Collapse;

let headTitle;

export const FatherContext = createContext();
function Work(props) {
    const {
        location: { query: { mainId, } },
        openViewlist,
        getSuperviseLists,
        dispatch,
        loading,
        location
    } = props;

    const [tabActivekey, settabActivekey] = useState('taskwork'); // 打开标签

    // panel详情
    const Panelheadermap = new Map([
        ['main', '工作任务'],
        ['check', '工作延期审核'],
        ['execute', '工作执行'],
    ]);

    const getInformation = () => {
        dispatch({
            type: 'supervisemodel/openViews',
            payload: mainId
        })
    }

    // 初始化获取用户信息
    useEffect(() => {
        getInformation();
    }, [])

    // 点击页签右键刷新
    useEffect(() => {
        if (location.state && location.state.reset && mainId) {
            getInformation();
        }
    }, [location.state]);

    const handleClose = () => {
        router.push({
            pathname: `/ITSM/supervisework/querywork`,
            query: { pathpush: true }
        });
    }

    const handleTabChange = key => {
        settabActivekey(key)
    };

    // 督办内容
    useEffect(() => {
        if (tabActivekey === 'supervise') {
            dispatch({
                type: 'supervisemodel/togetSuperviseList',
                payload: mainId
            })
        };
    }, [tabActivekey]);

    const tabList = [
        {
            key: 'taskwork',
            tab: '工作任务',
        },
        {
            key: 'supervise',
            tab: '督办内容',
        },
    ];

    return (
        <PageHeaderWrapper
            title={headTitle}
            tabList={tabList}
            tabActiveKey={tabActivekey}
            onTabChange={handleTabChange}
            extra={
                <>
                    <Button onClick={handleClose}>返回</Button>
                </>
            }
        >
            {
                tabActivekey === 'taskwork' && (
                    <Spin spinning={loading} >
                        <div className={styles.collapse}>
                            {openViewlist && loading === false && (
                                <Collapse
                                    expandIconPosition="right"
                                    defaultActiveKey={['0']}
                                    bordered={false}
                                >
                                    {openViewlist.map((obj, index) => {
                                        // panel详情组件
                                        const Paneldesmap = new Map([
                                            ['main', <TaskworkEditfillins
                                                info={Object.values(obj)[0]}
                                                main={openViewlist[0].main}
                                            />],
                                            ['check', <CheckdelayworkEditfillins
                                                info={Object.values(obj)[0]}
                                                main={openViewlist[0].main}
                                            />],
                                            ['execute', <ExecuteworkEditfillins
                                                info={Object.values(obj)[0]}
                                                main={openViewlist[0].main}
                                            />],
                                        ]);
                                        return (
                                            <Panel
                                                header={Panelheadermap.get(Object.keys(obj)[0])}
                                                key={index.toString()}>
                                                {Paneldesmap.get(Object.keys(obj)[0])}
                                            </Panel>
                                        );
                                    })}
                                </Collapse>
                            )}
                        </div>
                    </Spin>
                )}
            {tabActivekey === 'supervise' && (
                <SuperviseList data={getSuperviseLists} loading={loading} />
            )}
        </PageHeaderWrapper >
    )
}

export default Form.create({})(
    connect(({ supervisemodel, itsmuser, loading }) => ({
        userinfo: itsmuser.userinfo,
        openViewlist: supervisemodel.openViewlist,
        getSuperviseLists: supervisemodel.getSuperviseLists,
        loading: loading.models.supervisemodel,
    }))(Work)
)