import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Button,
    Collapse,
    Card,
    Spin,
    Steps
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// eslint-disable-next-line import/no-unresolved
import creatHistory from 'history/createHashHistory'; // 返回上一页
import styles from './index.less';
// 各个子组件
import RegisterQuery from './components/RegisterQuery';
import ExamineQuery from './components/ExamineQuery';
import HandleQuery from './components/HandleQuery';
import SummaryQuery from './components/SummaryQuery';
import CloseQuery from './components/CloseQuery';

const { Panel } = Collapse;
const { Step } = Steps;
let image;
const history = creatHistory(); // 返回上一页

const tabList = [
    {
        key: 'faultForm',
        tab: '故障工单',
    },
    {
        key: 'faultPro',
        tab: '故障流程',
    },
];

const Collapsekeymap = new Map([ // 展开详情页
    ['5', 'RegisterQuery'], // 登记（已登记、已提交待审核）
    ['9', 'RegisterQuery'],

    ['25', 'ExamineQuery'], // 审核（审核中、已审核待处理）
    ['29', 'ExamineQuery'],

    ['45', 'HandleQuery'], // 处理（处理中、已处理待总结）
    ['49', 'HandleQuery'],

    ['65', 'SummaryQuery'], // 总结（总结中、已总结待关闭）
    ['69', 'SummaryQuery'],

    ['85', 'CloseQuery'], // 关闭（关闭中、已关闭）
    ['89', 'CloseQuery'],
]);

function Querylistdetails(props) {
    const pagetitle = props.route.name;
    const [activeKey, setActiveKey] = useState();
    const [tabActiveKey, setTabActiveKey] = useState('faultForm'); // tab切换
    const RegisterRef = useRef(); // 故障登记
    const ExamineRef = useRef(); // 故障审核
    const HandleRef = useRef(); // 故障处理
    const SummaryRef = useRef(); // 故障总结
    const CloseRef = useRef(); // 故障关闭
    const {
        location: { paneKey, ids }, // ids 列表传过来的id
        dispatch,
        loading,
        querydetailslist,
        querydetailslist: { troubleFlowNodeRows, main, troubleFlowLogs },
        flowimageview,
        flowlog,
    } = props;

    // 二进制展示流程图
    const blob = new Blob([flowimageview]);
    image = (window.URL || window.webkitURL).createObjectURL(blob);

    const getFlowImage = () => { // 流程图片
        dispatch({
            type: 'fault/fetchGetFlowImage',
            payload: { id: querydetailslist.main.id }
        });
    }

    const getFlowlog = () => { // 流程日志
        dispatch({
            type: 'fault/fetchGetFlowLog',
            payload: { id: querydetailslist.main.id }
        })
    }

    const querydetailsList = () => { // 故障查询详情数据
        if (ids)
            dispatch({
                type: 'fault/getfaultQueryDetailData',
                payload: { id: ids },
            });
    }

    useEffect(() => {
        setActiveKey([`${Collapsekeymap.get(paneKey)}`]);
        querydetailsList();
    }, []);

    const handleClose = () => { // 返回上一页
        history.goBack();
    }

    const callback = key => { // tab激活
        setActiveKey(key);
    };

    const handleTabChange = (key) => { // tab切换
        setTabActiveKey(key);
        getFlowImage();
        getFlowlog();
    };

    return (
        <PageHeaderWrapper
            extra={
                <>
                    <Button type="default" onClick={handleClose}>返 回</Button>
                </>
            }
            title={pagetitle}
            tabList={tabList}
            onTabChange={handleTabChange}
            tabActiveKey={tabActiveKey}
        >
            {
                (tabActiveKey === 'faultForm' &&
                    <div className={styles.collapse}>
                        <Card
                            style={{
                                background: '#fff',
                                // padding: 10,
                                border: '1px solid #e8e8e8',
                                overflowX: 'auto',
                            }}
                        >
                            {troubleFlowLogs &&
                                (<Steps
                                    // current={stepcurrentmap.get(paneKey)}
                                    current={troubleFlowLogs.length - 1}
                                    size="small"
                                >
                                    {
                                        troubleFlowLogs && troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                                            name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                                                <div className={styles.stepDescription}>
                                                    处理人：{formHandler}
                                                    <div>开始时间：{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                                                </div>
                                            } />
                                        ])}
                                </Steps>)
                            }
                        </Card>
                        <Spin spinning={loading}>
                            {
                                loading === false && querydetailslist !== undefined && (
                                    <Collapse
                                        expandIconPosition="right"
                                        activeKey={activeKey}
                                        bordered={false}
                                        style={{ marginTop: '-25px' }}
                                        onChange={callback}
                                    >
                                        {
                                            (paneKey === '5' || paneKey === '9' || paneKey === '25' || paneKey === '29' || paneKey === '45' || paneKey === '49' || paneKey === '65' || paneKey === '69' || paneKey === '85' || paneKey === '89') && (
                                                <Panel header="故障登记" key="RegisterQuery">
                                                    <RegisterQuery
                                                        ref={RegisterRef}
                                                        detailsdata={troubleFlowNodeRows}
                                                        maindata={main}
                                                    />
                                                </Panel>
                                            )
                                        }

                                        {
                                            (paneKey === '25' || paneKey === '29' || paneKey === '45' || paneKey === '49' || paneKey === '65' || paneKey === '69' || paneKey === '85' || paneKey === '89') && (
                                                <Panel Panel header="故障审核" key="ExamineQuery">
                                                    <ExamineQuery
                                                        ref={ExamineRef}
                                                        detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[1]}
                                                    />
                                                </Panel>
                                            )
                                        }

                                        {
                                            (paneKey === '45' || paneKey === '49' || paneKey === '65' || paneKey === '69' || paneKey === '85' || paneKey === '89') && (
                                                <Panel header="故障处理" key="HandleQuery">
                                                    <HandleQuery
                                                        ref={HandleRef}
                                                        detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[2]}
                                                    />
                                                </Panel>
                                            )
                                        }

                                        {
                                            (paneKey === '65' || paneKey === '69' || paneKey === '85' || paneKey === '89') && (
                                                <Panel header="故障总结" key="SummaryQuery">
                                                    <SummaryQuery
                                                        ref={SummaryRef}
                                                        detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[4]}
                                                    />
                                                </Panel>
                                            )
                                        }

                                        {

                                            (paneKey === '85' || paneKey === '89') && (
                                                <Panel header="故障关闭" key="CloseQuery">
                                                    <CloseQuery
                                                        ref={CloseRef}
                                                        detailsdata={troubleFlowNodeRows !== undefined && troubleFlowNodeRows[5]}
                                                    />
                                                </Panel>
                                            )

                                        }
                                    </Collapse>
                                )
                            }
                        </Spin>
                    </div>
                )
            }
            {
                (tabActiveKey === 'faultPro' && (
                    <div className={styles.collapse}>
                        <Card title='故障管理流程'>
                            <div
                                style={{
                                    background: '#fff',
                                    padding: 20,
                                }}
                            >
                                <img src={image} alt='' />
                            </div>
                        </Card>
                        <Card title='流转日志' style={{ marginTop: '-1px' }}>
                            {
                                loading === false && flowlog &&
                                (
                                    <div className={styles.steps}>
                                        <Steps
                                            // current={stepcurrentmap.get(paneKey)}
                                            current={flowlog.troubleFlowLogs.length - 1}
                                            size="small"
                                            direction="vertical"
                                            progressDot
                                            style={{
                                                background: '#fff',
                                                padding: 24,
                                                border: '1px solid #e8e8e8',
                                            }}
                                        >
                                            {
                                                flowlog && flowlog.troubleFlowLogs.map(({ key, name, status, startTime, formHandler, backReason }) => [
                                                    name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})`} description={
                                                        <div className={styles.stepDescription}>
                                                            处理人：{formHandler}
                                                            <div>{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                                                            <div>{status === '退回' && `回退原因：${backReason}`}</div>
                                                        </div>
                                                    } />
                                                ])}
                                        </Steps>
                                    </div>
                                )
                            }
                        </Card>
                    </div>
                ))
            }
        </PageHeaderWrapper >
    );
}

export default Form.create({})(
    connect(({ fault, loading }) => ({
        html: fault.html,
        loading: loading.models.fault,
        querydetailslist: fault.querydetailslist,
        flowimageview: fault.flowimageview, // 流程图view
        flowlog: fault.flowlog, // 流转日志
    }))(Querylistdetails),
);
