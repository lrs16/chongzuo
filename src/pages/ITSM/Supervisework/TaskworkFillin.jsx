import React, { useEffect, useState, useRef } from 'react';
import TaskworkContext from '@/layouts/MenuContext';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Card,
  Button,
  message,
} from 'antd';
import router from 'umi/router';
import { openNotification } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TaskworkEditfillin from './components/TaskworkEditfillin';

function TaskworkFillin(props) {
  const pagetitle = props.route.name;
  const {
    location,
    dispatch,
    userinfo,
    superviseworkPersonArr,
    // loading,
    tabdata,
    tabnew
  } = props;

  let superviseworkPersonSelect;

  const TaskworkfillinRef = useRef();
  //   const [richtext, setRichtext] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [copyData, setCopyData] = useState(''); // 复制的数据
  const [taskworkUploadStatus, setTaskworkUploadStatus] = useState(false);
  const [timeVisivle, setTimeVisible] = useState(true);

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

  // 表单校验提示信息
  const formerr = (err) => {
    openNotification(Object.values(err));
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
  };

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
  }, []);

  //  点击保存触发事件
  const handlesubmitSave = () => {
    TaskworkfillinRef.current.validateFields((_, values) => {
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
    });
  };

  const handlesubmit = () => { // 提交传mainId
    const tabid = sessionStorage.getItem('tabid');
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
              pathname: `/ITSM/supervisework/mycreatework`,
              query: { pathpush: true },
              state: { cache: false, closetabid: tabid }
            });
          } else {
            message.error(res.msg);
          }
        })
      }
      const allerr = Object.values(err);
      return formerr(allerr);
    });
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handlesubmitSave();
    }
  }, [files]);

  const handleclose = () => {
    router.push({
      // pathname: `/ITSM/supervisework/mycreatework`,
      pathname: location.pathname,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, },
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

  const handlePaste = () => { // 粘贴
    setTimeVisible(true);
    const strObj = sessionStorage.getItem('copyrecord');
    const result = JSON.parse(strObj);
    const mainId = sessionStorage.getItem('nocopyrecord');
    if (!mainId) {
      message.info('请在列表页复制');
    } else {
      const deleteno = delete result.no;
      if (strObj !== '' && strObj !== undefined && deleteno === true) {
        setCopyData(result);
      } else {
        message.info('请在列表页复制');
        return false;
      }
    }
    return null;
  };

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      TaskworkfillinRef.current.resetFields();
    }
  }, [tabnew]);

  // 获取页签信息
  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        TaskworkfillinRef.current.validateFields((_, values) => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                workUser: values.main_workUser.toString(), // 工作负责人
                workUserId: values.main_workUserId,
                addTime: moment(values.main_addTime).format('YYYY-MM-DD HH:mm:ss'),
                plannedStartTime: moment(values.main_plannedStartTime).format('YYYY-MM-DD HH:mm:ss'),
                plannedEndTime: moment(values.main_plannedEndTime).format('YYYY-MM-DD HH:mm:ss'),
                status: values.main_status, // 工作状态
                content: values.main_content, // 工作内容
                addUser: values.main_addUser, // 填报人
                addUserId: userinfo.userId,
                addUnit: values.main_addUnit, // 填报单位
                addUnitId: userinfo.unitId,
              },
              tabid: sessionStorage.getItem('tabid'),
            },
          });
        });
        TaskworkfillinRef.current.resetFields();
      }
    }
  }, [location]);

  useEffect(() => {
    if (tabdata !== undefined) {
      setCopyData(tabdata);
    }
  }, [tabdata]);

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
        onMouseDown={() => setTimeVisible(false)}
        onClick={() => handlePaste()}
        disabled={taskworkUploadStatus}
      >
        粘贴
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handlesubmitSave()}
        disabled={taskworkUploadStatus}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handlesubmit()}
        disabled={taskworkUploadStatus}
      >
        提交
      </Button>
      <Button onClick={() => handleclose()} disabled={taskworkUploadStatus}>关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={extrabuttons}
    >
      <div className='noexplain'>
        <Card>
          <TaskworkContext.Provider value={{
            getUploadStatus: (v) => { setTaskworkUploadStatus(v) },
          }}>
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
              location={location}
              timeVisivle={timeVisivle}
            /></TaskworkContext.Provider>
        </Card>
      </div>
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