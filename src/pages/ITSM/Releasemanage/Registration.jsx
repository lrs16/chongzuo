import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import Registrat from './components/Registrat';
import { saveRegister } from './services/api';


const Attaches = [
  { docName: '功能出厂测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '平台验证测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '业务功能测试报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '功能清单终稿', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '发布实施方案', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '计划发布申请审批表', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '临时发布申请审批表', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '功能发布报告', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
  { docName: '其它附件', attachFile: '[]', dutyUnit: '', docTemplate: '', remarks: '' },
];


function Registration(props) {
  const { dispatch, userinfo, loading, tabnew, tabdata, location } = props;
  const pagetitle = props.route.name;
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员   
  const [taskId, setTaskId] = useState('');
  const [indexvalue, setIndexValue] = useState({ releaseMain: {}, releaseRegister: {}, releaseEnvs: [], releaseLists: [], releaseAttaches: Attaches });
  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
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
        testPlace, testUnit, testOperator, influenceScope, testResult, registerTime, registerUnit, registerUnitId, registerUser, registerUserId,
      },
      releaseAttaches,
      releaseEnvs,
      releaseLists,
    };
    setIndexValue(register);
    return register
  };

  const handleSubmit = () => {
    setUserChoice(false);
    sessionStorage.removeItem('NextflowUserId');
    const register = getformvalues();
    RegistratRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        saveRegister(register).then(res => {
          if (res.code === 200) {
            sessionStorage.setItem('flowtype', '1');
            setTaskId(res.data.saveRegister.releaseRegister.taskId);
            setUserVisible(true);
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  const tosubmit = () => {
    dispatch({
      type: 'releaseregistra/fetchsubmit',
      payload: {
        taskId,
        type: 1,
        userIds: sessionStorage.getItem('NextflowUserId'),
      }
    });
  }

  // 保存获取表单数据
  const handleSave = () => {
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
        message.error(response.msg)
      }
    })
  };

  // 选人完成走提交接口
  useEffect(() => {
    if (userchoice) {
      tosubmit()
    }
  }, [userchoice])

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
    }
  }, [tabnew]);

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        RegistratRef.current.resetVal();
      };
    }
  }, [location.state]);

  useEffect(() => {
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
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave('save')}>
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSubmit()}>
        流转
      </Button>
      <Button type="default" onClick={() => handleclose()}>关闭</Button>
    </>
  );

  return (
    <Spin tip="正在提交数据..." spinning={!!loading}>
      <PageHeaderWrapper title={pagetitle} extra={operations}>
        <DictLower
          typeid="1379323239808897026"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Card>
          <SubmitTypeContext.Provider value={{
            ChangeButtype: (() => { }),
            taskId: '',
            addAttaches: false,
            ChangeaddAttaches: (() => { })
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
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ itsmuser, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
  loading: loading.effects['releasetodo/releaseflow'],
}))(Registration);
