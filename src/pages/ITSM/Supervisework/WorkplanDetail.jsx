import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
    Button,
    Collapse,
    Form,
    message
} from 'antd';
// import User from '@/components/SelectUser/User';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
// 编辑页， 详情页组件
// import TaskCheck from './components/TaskCheck';
import TaskworkEditfillin from './components/TaskworkEditfillin';
import ExecuteworkEditfillin from './components/ExecuteworkEditfillin';
// import TaskExecute from './components/TaskExecute';
// import OperationPlanfillindes from './components/OperationPlanfillindes';
// import TaskCheckdes from './components/TaskCheckdes';
// import TaskExecutedes from './components/TaskExecutedes';
// import Back from './components/Back';
import styles from './index.less';
// import { query } from '@/services/user';
// import TimeoutModal from './components/TimeoutModel';
// import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api';

const { Panel } = Collapse;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
    },
};

const forminladeLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
    },
};

export const FatherContext = createContext();
function WorkplanDetail(props) {
    // const pagetitle = props.route.name;
    // const [flowtype, setFlowtype] = useState('001');
    const [selectdata, setSelectData] = useState('');
    const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
    const SaveRef = useRef();
    const [activeKey, setActiveKey] = useState([]);

    const {
        location: {
            query: {
                mainId,
                flowNodeName,
                status,
                // checkStatus,
                // auditLink,
                type,
                // taskName,
            }
        },
        userinfo,
        openFlowList,
        superviseworkPersonArr,
        dispatch,
        loading,
        location
    } = props;

    let superviseworkPersonSelect;
    // let headTitle = '工作任务填写';

    const { data, edit } = openFlowList;


    if (loading === false) {
        if (openFlowList.code === -1) {
            message.error(openFlowList.msg);
            router.push({
                pathname: `/ITSM/supervisework/mycreatework`,
                query: { pathpush: true },
                state: { cache: false, closetabid: mainId }
            });
        }
    }

    // if (loading === false && openFlowList.code !== -1) {
    //     const resgister = data && data.length && edit.main !== undefined;
    //     if (resgister) {
    //         headTitle = status || taskName;
    //     }

    //     const checkParams = data && data.length && (edit.check || taskName === '计划审核')
    //     if (checkParams) {
    //         headTitle = '作业计划审核';
    //     }
    // }

    // panel详情
    // const Panelheadermap = new Map([
    //     ['main', '工作任务'],
    //     ['check', '工作延期审核'],
    //     ['execute', '工作执行'],
    // ]);

    const callback = key => {
        setActiveKey(key);
    };

    const queryDept = () => {
        dispatch({
            type: 'itsmuser/fetchuser',
        });
    };

    //  获取作业负责人
    const getsuperviseworkPerson = () => {
        dispatch({
            type: 'supervisemodel/getWorkUserList',
        });
    }

    const getInformation = () => {
        dispatch({
            type: 'supervisemodel/openFlow',
            payload: mainId
        })
    }

    // const getTypebyTitle = title => {
    //     if (selectdata.ischange) {
    //         return selectdata.arr.filter(item => item.title === title)[0].children;
    //     }
    //     return [];
    // };
    // const taskResult = getTypebyTitle('作业结果');

    useEffect(() => {
        queryDept();
        getsuperviseworkPerson()
        sessionStorage.setItem('Processtype', 'task');
        // headTitle = '';
    }, [])

    useEffect(() => {
        if (mainId !== undefined) {
            dispatch({
                type: 'supervisemodel/openFlow',
                payload: mainId
            })
        }
    }, [mainId])

    // 点击页签右键刷新
    useEffect(() => {
        if (location.state && location.state.reset && mainId) {
            dispatch({
                type: 'supervisemodel/openFlow',
                payload: mainId
            })
        }
    }, [location.state]);

    // 处理工作负责人数据
    if (superviseworkPersonArr.length) {
        superviseworkPersonSelect = superviseworkPersonArr.map(item => {
            return {
                key: item.id,
                value: item.userName
            }
        })
    }


    const formerr = () => {
        message.error('请将信息填写完整');
    };

    //  保存统一接口
    const saveApi = (params, tobatch) => {
        dispatch({
            type: 'supervisemodel/formSave',
            payload: params
        }).then(res => {
            if (res.code === 200) {
                // if (tobatch) {
                //     getInformation();
                // } else {
                message.success(res.msg);
                getInformation();
                // }
            } else {
                message.error(res.msg);
            }
        });
    }

    //  执行保存
    const executeSave = () => {
        SaveRef.current.validateFields((err, value) => {
            console.log(value, openFlowList, 'value')
            // if (!err) {
            //     const newvalues = {
            //         ...value,
            //         mainId,
            //         execute_id: edit.execute.id,
            //         flowNodeName: '工作执行',
            //         execute_fileIds: files.ischange ? JSON.stringify(files.arr) : value.execute_fileIds,
            //         editState: openFlowList.editState,
            //         execute_startTime: value.execute_startTime.format('YYYY-MM-DD HH:mm:ss'),
            //         execute_endTime: value.execute_endTime.format('YYYY-MM-DD HH:mm:ss'),
            //         execute_operationTime: value.execute_operationTime.format('YYYY-MM-DD HH:mm:ss'),
            //     }
            //     delete newvalues.execute_operationUnit;
            //     saveApi(newvalues);
            // }
        })
    }

    //  登记保存
    const fillinSave = (params, tobatch) => {
        SaveRef.current.validateFields((err, values) => {
            if (params ? !err : true) {
                const newvalues = {
                    ...values,
                    main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    main_plannedStartTime: values.main_plannedStartTime ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    main_fileIds: files.ischange ? JSON.stringify(files.arr) : values.main_fileIds,
                    flowNodeName: '工作登记',
                    editState: openFlowList.editState,
                    main_status: '1',
                    main_addUserId: userinfo.userId,
                    main_addUser: userinfo.userName,
                    main_id: edit.main.id,
                    mainId,
                }
                saveApi(newvalues, tobatch);
                // if (params) {
                //     setUserVisible(true);
                // }
            }
            if (params && err) {
                formerr();
            }
        })
    }

    // //  审核保存
    // const checkSave = () => {
    //     SaveRef.current.validateFields((err, value) => {
    //         const result = {
    //             ...value,
    //             check_checkTime: (value.check_checkTime).format('YYYY-MM-DD HH:mm:ss'),
    //             flowNodeName: '计划审核',
    //             editState: openFlowList.editState,
    //             mainId,
    //             check_id: edit.check.id,
    //             check_checkUserId: userinfo.userId,
    //         }
    //         saveApi(result)
    //     })
    // }

    //  判断是属于那个保存状态下
    const handleSave = (params, tobatch) => {
        switch (flowNodeName) {
            case '工作登记':
                fillinSave(params, tobatch);
                break;
            case '工作执行':
                executeSave(params);
                break;
            default:
                break;
        }
    }

    // 上传附件触发保存
    useEffect(() => {
        if (files.ischange) {
            handleSave(false);
        }
    }, [files]);

    const handleclose = () => {
        if (type === 'worktask') {
            router.push({
                pathname: `/ITSM/supervisework/mycreatework`,
                query: { pathpush: true },
                state: { cache: false, closetabid: mainId }
            })
        } else if (type === 'execute') {
            router.push({
                pathname: `/ITSM/supervisework/myresponwork`,
                query: { pathpush: true },
                state: { cache: false, closetabid: mainId }
            })
        } else {
            router.push({
                pathname: `/ITSM/supervisework/todelayexamine`,
                query: { pathpush: true },
                state: { cache: false, closetabid: mainId }
            })
        }
    }

    //  删除
    const handleDelete = () => {
        return dispatch({
            type: 'supervisemodel/taskDelete',
            payload: {
                mainIds: mainId
            }
        }).then(res => {
            router.push({
                pathname: `/ITSM/supervisework/mycreatework`,
                query: { pathpush: true },
                state: { cache: false, closetabid: mainId }
            });
            if (res.code === 200) {
                message.success(res.msg);
            } else {
                message.error(res.msg);
            }
        })
    }

    const getTypebyTitle = title => {
        if (selectdata.ischange) {
            return selectdata.arr.filter(item => item.title === title)[0].children;
        }
        return [];
    };
    const executeResult = getTypebyTitle('执行结果');

    return (
        <PageHeaderWrapper
            title={flowNodeName}
            extra={
                <>
                    {
                        type && type === 'worktask' && (
                            <Button
                                type="danger"
                                ghost
                                style={{ marginRight: 8 }}
                                onClick={() => handleDelete()}
                            >
                                删除
                            </Button>
                        )
                    }

                    {
                        loading === false && (
                            <Button
                                type="primary"
                                style={{ marginRight: 8 }}
                                onClick={() => handleSave(false)}
                            >
                                保存
                            </Button>
                        )
                    }
                    {type && type === 'worktask' && flowNodeName === '工作登记' && (<Button
                        type="primary"
                        style={{ marginRight: 8 }}
                    // onClick={() => handlesubmit()}
                    >
                        提交
                    </Button>)}
                    {type && type === 'execute' && flowNodeName === '工作执行' && (<Button
                        type="primary"
                        style={{ marginRight: 8 }}
                    // onClick={() => handlesubmit()}
                    >
                        确认
                    </Button>)}
                    <Button onClick={() => handleclose()}>返回</Button>
                </>
            }
        >
            <SysDict
                typeid="1418501809457528833"
                commonid="1354288354950123522"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'none' }}
            />
            <div className={styles.collapse}>
                <Collapse
                    expandIconPosition="right"
                    defaultActiveKey={['1']}
                    onChange={callback}
                    bordered='true'
                >
                    <>
                        {/* {!delay && (edit.check || flowNodeName === '计划审核') && (
                                    <Panel
                                        header='作业计划审核'
                                        key='1'
                                        style={{ backgroundColor: 'white' }}
                                    >
                                        <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                                            <TaskCheck
                                                formItemLayout={formItemLayout}
                                                forminladeLayout={forminladeLayout}
                                                check={edit.check}
                                                userinfo={userinfo}
                                                checkStatus={checkStatus}
                                                ref={SaveRef}
                                            />
                                        </FatherContext.Provider>
                                    </Panel>
                                )} */}

                        {/* {
                            loading === false && (edit && edit.main !== undefined && type === 'execute') && (
                                <Panel
                                    header='工作执行'
                                    key='1'
                                    style={{ backgroundColor: 'white' }}
                                    bordered
                                >
                                    <ExecuteworkEditfillin
                                        formItemLayout={formItemLayout}
                                        forminladeLayout={forminladeLayout}
                                        // type=''
                                        // userinfo={userinfo}
                                        // taskResult={taskResult}
                                        // ref={SaveRef}
                                        // execute={edit.execute}
                                        // files={
                                        //     (edit.execute.fileIds) && (edit.execute.fileIds) ? JSON.parse(edit.execute.fileIds) : []
                                        // }
                                        // ChangeFiles={newvalue => {
                                        //     setFiles(newvalue);
                                        // }}
                                    />
                                </Panel>
                            )
                        } */}

                        {
                            loading === false && (edit && edit.execute !== undefined) && type === 'execute' && flowNodeName === '工作执行' && (
                                <Panel
                                    header='工作执行'
                                    key='1'
                                    style={{ backgroundColor: 'white' }}
                                    bordered
                                >
                                    <ExecuteworkEditfillin
                                        formItemLayout={formItemLayout}
                                        forminladeLayout={forminladeLayout}
                                        // type=''
                                        userinfo={userinfo}
                                        executeResult={executeResult}
                                        ref={SaveRef}
                                    // execute={edit.execute}
                                    // files={
                                    //     (edit.execute.fileIds) && (edit.execute.fileIds) ? JSON.parse(edit.execute.fileIds) : []
                                    // }
                                    // ChangeFiles={newvalue => {
                                    //     setFiles(newvalue);
                                    // }}
                                    />
                                </Panel>
                            )
                        }
                        {
                            loading === false && (edit && edit.main !== undefined && type === 'worktask') && (
                                <Panel
                                    header={status || flowNodeName}
                                    key='1'
                                    bordered
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <TaskworkEditfillin
                                        formItemLayout={formItemLayout}
                                        forminladeLayout={forminladeLayout}
                                        main={type ? openFlowList.main : edit.main}
                                        // type={delay}
                                        status={status}
                                        useInfo={userinfo}
                                        ref={SaveRef}
                                        superviseworkPersonSelect={superviseworkPersonSelect}
                                        files={
                                            openFlowList !== [] && (openFlowList.main.fileIds) !== '' && (openFlowList.main.fileIds) ? JSON.parse(openFlowList.main.fileIds) : []
                                        }
                                        ChangeFiles={newvalue => {
                                            setFiles(newvalue);
                                        }}
                                    />
                                </Panel>
                            )
                        }
                    </>
                </Collapse>
            </div>
        </PageHeaderWrapper >
    )
}

export default Form.create({})(
    connect(({ supervisemodel, itsmuser, loading }) => ({
        userinfo: itsmuser.userinfo,
        openFlowList: supervisemodel.openFlowList,
        superviseworkPersonArr: supervisemodel.superviseworkPersonArr,
        loading: loading.models.supervisemodel,
    }))(WorkplanDetail)
)