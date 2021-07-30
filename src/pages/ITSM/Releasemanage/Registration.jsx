import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import Registrat from './components/Registrat';
import { startFlow } from './services/api';


const Attaches = [
  { docName: '功能出厂测试报告', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '平台验证测试报告', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '业务功能测试报告', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '功能清单终稿', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '发布实施方案', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '计划发布申请审批表', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '临时发布申请审批表', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '功能发布报告', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
  { docName: '其它附件', attachFile: '[]', dutyUint: '', docTemplate: '', remarks: '' },
];

function Registration(props) {
  const { dispatch, userinfo, loading } = props;
  const pagetitle = props.route.name;
  // const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员   
  const [taskId, setTaskId] = useState('');

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
  const handleSubmit = () => {
    RegistratRef.current.Forms((err, val) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        startFlow().then(res => {
          if (res.code === 200) {
            sessionStorage.setItem('flowtype', '1');
            setTaskId(res.data.taskId);
            setUserVisible(true);
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  };

  // 保存获取表单数据
  const handleSave = (type) => {
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
    startFlow().then(res => {
      if (res.code === 200) {
        dispatch({
          type: 'releaseregistra/fetchsave',
          payload: {
            register: {
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
            },
            buttontype: type,
            taskId,
            type: '1',
            userIds: sessionStorage.getItem('NextflowUserId'),
          }
        });
      } else {
        message.error(res.msg)
      }
    })
  };


  // 选人完成走提交接口
  useEffect(() => {
    if (userchoice) {
      handleSave('submit')
    }
  }, [userchoice])

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave()}>
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSubmit()}>
        提交
      </Button>
      <Button type="default">关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin tip="正在提交数据..." spinning={!!loading}>
        <Card>
          <Registrat
            wrappedComponentRef={RegistratRef}
            userinfo={userinfo}
            selectdata={selectdata}
            isEdit
            taskName='发布登记'
            info={{ releaseMain: {}, releaseRegister: {}, releaseEnvs: [], releaseLists: [], releaseAttaches: Attaches }}
          />
        </Card>
      </Spin>
      <User
        taskId={taskId}
        visible={uservisible}                       // 传参显示选人modle
        ChangeUserVisible={v => setUserVisible(v)}  // 选人完成关闭选人modle
        changorder='平台验证'                        //  下一环节名
        ChangeChoice={v => setUserChoice(v)}         //  选人完成返回状态true，通过true判读，进行
        ChangeType={v => (v)}           // 点击取消按钮，重置按钮类型         
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(Registration);
