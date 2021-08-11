import React, { useEffect, createContext } from 'react';
import { connect } from 'dva';
import {
    Button,
    Collapse,
    Form,
} from 'antd';
import router from 'umi/router';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TaskworkEditfillins from './components/TaskworkEditfillins'; // 工作任务
import ExecuteworkEditfillins from './components/ExecuteworkEditfillins'; // 工作执行
import CheckdelayworkEditfillins from './components/CheckdelayworkEditfillins'; // 工作延期审核
import styles from './index.less';

const { Panel } = Collapse;

let headTitle;

export const FatherContext = createContext();
function Work(props) {
    const {
        location: { query: { mainId, } },
        openViewlist,
        dispatch,
        loading,
        location
    } = props;

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

    return (
        <PageHeaderWrapper
            title={headTitle}
            extra={
                <>
                    <Button onClick={handleClose}>返回</Button>
                </>
            }
        >
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
                                    key={index}>
                                    {Paneldesmap.get(Object.keys(obj)[0])}
                                </Panel>
                            );
                        })}
                    </Collapse>
                )}
            </div>
        </PageHeaderWrapper >
    )
}

export default Form.create({})(
    connect(({ supervisemodel, itsmuser, loading }) => ({
        userinfo: itsmuser.userinfo,
        openViewlist: supervisemodel.openViewlist,
        loading: loading.models.supervisemodel,
    }))(Work)
)