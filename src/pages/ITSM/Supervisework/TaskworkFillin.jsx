import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import {
    Form,
    Card,
    Button,
    message,
} from 'antd';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TaskworkEditfillin from './components/TaskworkEditfillin';

function TaskworkFillin(props) {
    const pagetitle = props.route.name;
    const {
        // location,
        dispatch,
        userinfo,
        // openFlowList,
        superviseworkPersonArr,
        // loading,
        // tabdata,
        // tabnew
    } = props;

    let superviseworkPersonSelect;

    const TaskworkfillinRef = useRef();
    //   const [richtext, setRichtext] = useState('');
    const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
    const [copyData, setCopyData] = useState('')

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

    // 处理工作负责人数据
    if (superviseworkPersonArr.length) {
        superviseworkPersonSelect = superviseworkPersonArr.map(item => {
            return {
                key: item.userId,
                value: item.userName
            }
        })
    }

    useEffect(() => {
        queryDept();
        getsuperviseworkPerson();
    }, [])

    //  点击保存触发事件
    const handlesubmitSave = (params) => {
        TaskworkfillinRef.current.validateFields((err, values) => {
            if (params ? true : !err) {
                dispatch({
                    type: 'supervisemodel/saveallForm',
                    payload: {
                        ...values,
                        main_workUser: JSON.stringify(values.main_workUser),
                        main_workUserId: JSON.stringify(values.main_workUserId),
                        main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_plannedStartTime: values.main_plannedStartTime ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_fileIds: files.ischange ? JSON.stringify(files.arr) : null,
                        flowNodeName: '工作登记',
                        editState: 'add',
                        main_status: '1',
                        main_addUserId: userinfo.userId,
                        main_addUnitId: userinfo.unitId,
                    }
                })
            }
        });
    };

    const handlesubmit = () => { // 提交传mainId
        TaskworkfillinRef.current.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'supervisemodel/tosubmitForm',
                    payload: {
                        ...values,
                        main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_plannedStartTime: values.main_plannedStartTime ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
                        main_fileIds: files.ischange ? JSON.stringify(files.arr) : null,
                        flowNodeName: '工作登记',
                        editState: 'add',
                        main_status: '1',
                        main_addUserId: userinfo.userId,
                        main_addUnitId: userinfo.unitId,
                        main_workUser: JSON.stringify(values.main_workUser),
                        main_workUserId: JSON.stringify(values.main_workUserId),
                    }
                }).then(res => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        router.push({
                            pathname: `/ITSM/supervisework/myresponwork`,
                            query: { pathpush: true },
                            state: { cache: false }
                        });
                    } else {
                        message.error(res.msg);
                    }
                })
            }
        });
    }

    // 上传删除附件触发保存
    useEffect(() => {
        if (files.ischange) {
            handlesubmitSave(true);
        }
    }, [files]);

    const handleclose = () => {
        router.push({
            pathname: `/ITSM/supervisework/mycreatework`,
            query: { pathpush: true },
            state: { cach: false }
        });
    }

    //  删除
    // const handleDelete = () => {
    //     return dispatch({
    //         type: 'supervisemodel/taskDelete',
    //         payload: {
    //             mainIds: mainId
    //         }
    //     }).then(res => {
    //         router.push({
    //             pathname: `/ITSM/supervisework/mycreatework`,
    //             query: { pathpush: true },
    //             state: { cache: false, closetabid: mainId }
    //         });
    //         if (res.code === 200) {
    //             message.success(res.msg);
    //         } else {
    //             message.error(res.msg);
    //         }
    //     })
    // }

    const handlePaste = () => {
        const mainId = sessionStorage.getItem('copyrecord');
        if (!mainId) {
            message.info('请在列表页复制');
            return false
        }
        return dispatch({
            type: 'supervisemodel/pasteFlow',
            payload: mainId
        }).then(res => {
            if (res.code === 200) {
                const resData = res.main;
                delete resData.no;
                setCopyData(resData)
            } else {
                message.info('您无法复制该条记录，请返回列表重新选择')
            }
        })
    }

    // 获取页签信息
    // useEffect(() => {
    //     if (location.state) {
    //         if (location.state.cache) {
    //             const values = TaskworkfillinRef.current.getVal();
    //             dispatch({
    //                 type: 'viewcache/gettabstate',
    //                 payload: {
    //                     cacheinfo: {
    //                         ...values,
    //                         addUser: values.main_addUser,
    //                         status: values.main_status,
    //                         workUser: values.main_workUser,
    //                         fileIds: values.main_fileIds,
    //                         addUnit: values.main_addUnit,
    //                         content: values.main_content,
    //                         plannedStartTime: values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss'),
    //                         plannedEndTime: values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss'),
    //                         addTime: values.main_addTime.format('YYYY-MM-DD HH:mm:ss'),
    //                     },
    //                     tabid: sessionStorage.getItem('tabid')
    //                 },
    //             });
    //             TaskworkfillinRef.current.resetVal();
    //         };
    //     }
    // }, [location]);

    // // 重置表单信息
    // useEffect(() => {
    //     if (tabnew) {
    //         TaskworkfillinRef.current.resetVal();
    //     }
    // }, [tabnew]);

    // useEffect(() => {
    //     if (tabdata !== undefined) {
    //         setCopyData(tabdata)
    //     }
    // }, [tabdata])

    const extrabuttons = (
        <>
            {/* <Button
                type="danger"
                ghost
                style={{ marginRight: 8 }}
                // onClick={() => handleDelete()}
            >
                删除
            </Button> */}
            <Button
                type="primary"
                ghost
                style={{ marginRight: 8 }}
                onClick={() => handlePaste()}
            >
                粘贴
            </Button>
            <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handlesubmitSave(false)}
            >
                保存
            </Button>
            <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handlesubmit()}
            >
                提交
            </Button>
            <Button onClick={() => handleclose()}>关闭</Button>
        </>
    )

    return (
        <PageHeaderWrapper
            title={pagetitle}
            extra={extrabuttons}
        >

            <Card>
                <TaskworkEditfillin
                    ref={TaskworkfillinRef}
                    useInfo={userinfo}
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    //   getRichtext={(richText => setRichtext(richText))}
                    ChangeFiles={newvalue => {
                        setFiles(newvalue);
                    }}
                    files={[]}
                    superviseworkPersonSelect={superviseworkPersonSelect}
                    main={copyData}
                />
            </Card>
            
        </PageHeaderWrapper>
    );
}

export default Form.create({})(
    connect(({ supervisemodel, itsmuser, viewcache, loading }) => ({
        userinfo: itsmuser.userinfo,
        superviseworkPersonArr: supervisemodel.superviseworkPersonArr,
        loading: loading.models.supervisemodel,
        tabnew: viewcache.tabnew,
        tabdata: viewcache.tabdata,
    }))(TaskworkFillin),
);