import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import { releaseUserList } from '@/services/user';
import TimeoutModal from '../components/TimeoutModal';
import Registrat from './components/Registrat';
import { saveRegister, getTimeoutInfo, getBlankAttachList } from './services/api';
import { saveTimeoutMsg, } from '../services/api';

function Registration(props) {
  const { dispatch, userinfo, loading, tabnew, tabdata, location, uploadstatus } = props;
  const pagetitle = props.route.name;
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员   
  const [taskId, setTaskId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [modalvisible, setModalVisible] = useState(false);
  const [saveloading, setSaveloading] = useState(false);
  const [userlist, setUserlist] = useState([]);
  const [indexvalue, setIndexValue] = useState({ releaseMain: {}, releaseRegister: {}, releaseEnvs: [], releaseLists: [], releaseAttaches: [] });
  // 初始化用户信息，流程类型,附件列表
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    getBlankAttachList().then(res => {
      if (res.code === 200) {
        setIndexValue({ ...indexvalue, releaseAttaches: res.data })
      }
    })
    sessionStorage.setItem('Processtype', 'release');
    return () => {
      sessionStorage.removeItem('Processtype');
    }
  }, []);

  // 保存，保存提交
  const RegistratRef = useRef();
  const getformvalues = () => {
    const val = RegistratRef.current.getVal();
    const {
      dutyUnit,
      influenceScope,
      registerTime,
      registerUnit,
      registerUnitId,
      registerUser,
      registerUserId,
      releaseAttaches,
      releaseEnvs,
      releaseLists,
      releaseType,
      testEnd,
      testOperator,
      testPlace,
      testResult,
      testStart,
      testUnit
    } = val;
    const register = {
      saveItems: 'releaseRegister,releaseEnvs,releaseLists,releaseAttaches',
      releaseMain: { releaseType, dutyUnit },
      releaseRegister: {
        testStart: moment(testStart).format('YYYY-MM-DD HH:mm:ss'),
        testEnd: moment(testEnd).format('YYYY-MM-DD HH:mm:ss'),
        testUnit: testUnit.toString(),
        testPlace, testOperator, influenceScope, testResult, registerTime, registerUnit, registerUnitId, registerUser, registerUserId,
      },
      releaseAttaches,
      releaseEnvs,
      releaseLists,
    };
    // setIndexValue(register);
    return register
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  const tosubmit = () => {
    if (userlist) {
      const userIds = userlist.map(obj => obj.userId);
      dispatch({
        type: 'releaseregistra/fetchsubmit',
        payload: {
          taskId,
          type: 1,
          userIds: userIds.join(','),
        }
      });
    }
  }

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    if (taskId) {
      saveTimeoutMsg({
        taskId,
        msgType: 'timeout',
        orderId,
        orderType: 'release',
        ...v
      }).then(res => {
        if (res.code === 200) {
          // setUserVisible(true);
          tosubmit()
        }
      });
    }
  }

  const handleSubmit = () => {
    setUserChoice(false);
    sessionStorage.removeItem('NextflowUserId');
    const register = getformvalues();
    RegistratRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        setSaveloading(true);
        saveRegister(register).then(res => {
          if (res.code === 200) {
            setSaveloading(false);
            sessionStorage.setItem('flowtype', '1');
            setTaskId(res.data.currentTaskStatus.taskId);
            setOrderId(res.data.currentTaskStatus.processInstanceId);
            releaseUserList(res.data.currentTaskStatus.taskId, '1').then(resuser => {
              if (resuser.code === 200) {
                setUserlist(resuser.data.userList);
                getTimeoutInfo({ taskId: res.data.currentTaskStatus.taskId }).then(timeoutres => {
                  if (timeoutres.code === 200) {
                    if (timeoutres.data.timeout && !timeoutres.data.reason) {
                      message.info(timeoutres.data.msg);
                      setModalVisible(true);
                    };
                    if ((timeoutres.data.timeout && res.data.reason) || !timeoutres.data.timeout) {
                      // setUserVisible(true);
                      tosubmit();
                    };
                  } else {
                    message.error(res.msg);
                    setSaveloading(false);
                  };
                })
              }
            })
            // dispatch({
            //   type: 'itsmuser/releaseuserlist',
            //   payload: {
            //     taskId: res.data.currentTaskStatus.taskId,
            //     type: '1',
            //   },
            // });

          } else {
            message.error(res.msg)
            setSaveloading(false);
          }
        })
      }
    })
  };


  // 保存获取表单数据
  const handleSave = () => {
    setSaveloading(true);
    const register = getformvalues();
    const tabid = sessionStorage.getItem('tabid');
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: register,
        tabid,
      },
    });
    saveRegister(register).then(response => {
      if (response.code === 200) {
        message.success('保存成功');
        setSaveloading(false);
        router.push({
          pathname: `/ITSM/releasemanage/registration`,
          query: { tabid, closecurrent: true }
        })
        router.push({
          pathname: `/ITSM/releasemanage/to-do/record`,
          query: {
            Id: response.data.currentTaskStatus.businessKey,
            taskId: response.data.currentTaskStatus.taskId,
            taskName: '出厂测试'
          },
          state: {
            runpath: `/ITSM/releasemanage/to-do`,
            dynamicpath: true,
            menuDesc: '发布工单',
          },
        });
      } else {
        message.error(response.msg);
        setSaveloading(false);
      }
    })
  };

  // 选人完成走提交接口
  // useEffect(() => {
  //   if (userchoice) {
  //     tosubmit()
  //   }
  // }, [userchoice])

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
    }
  }, [tabnew]);

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新,并获取数据
      RegistratRef.current.resetVal();
    }
  }, [location.state]);

  useEffect(() => {
    // 清除待办tasklinks值
    dispatch({
      type: 'releasetodo/cleardata',
    });
    // 获取页签信息
    if (location.state) {
      if (location.state.cache) {
        const register = getformvalues();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: register,
            tabid: sessionStorage.getItem('tabid')
          },
        });
        RegistratRef.current.resetVal();   // 页签数据获取完成清空表单
      };
    };
  }, [location])

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave('save')} disabled={saveloading || loading || uploadstatus}>
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSubmit()} disabled={loading || saveloading || uploadstatus}>
        流转
      </Button>
      <Button type="default" onClick={() => handleclose()} disabled={loading || saveloading || uploadstatus}>关闭</Button>
    </>
  );

  return (
    <Spin tip="正在提交数据..." spinning={!!loading || saveloading}>
      <PageHeaderWrapper title={pagetitle} extra={operations}>
        <DictLower
          typeid="443"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Card>
          <SubmitTypeContext.Provider value={{
            ChangeButtype: (() => { }),
            taskId: '',
            addAttaches: false,
            ChangeaddAttaches: (() => { }),
            location,
            taskName: '新建'
          }}>
            <Registrat
              wrappedComponentRef={RegistratRef}
              userinfo={userinfo}
              selectdata={selectdata}
              isEdit
              taskName='新建'
              info={tabdata || indexvalue}
            />
          </SubmitTypeContext.Provider>
        </Card>
        <User
          taskId={taskId}
          visible={uservisible}                         // 传参显示选人modle
          ChangeUserVisible={v => setUserVisible(v)}    // 选人完成关闭选人modle
          changorder='平台验证'                         //  下一环节名
          ChangeChoice={v => setUserChoice(v)}         //  选人完成返回状态true，通过true判读，进行
          ChangeType={v => (v)}                        //  取消，重置按钮类型         
        />
        <TimeoutModal
          modalvisible={modalvisible}
          ChangeModalVisible={v => setModalVisible(v)}
          ChangeTimeOutMsg={v => postTimeOutMsg(v)}
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ itsmuser, viewcache, releasetodo, loading }) => ({
  releasetodo,
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  uploadstatus: viewcache.uploadstatus,
  userinfo: itsmuser.userinfo,
  loading: loading.effects['releasetodo/releaseflow'],
}))(Registration);
