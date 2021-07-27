import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import Registrat from './components/Registrat';
import { startFlow } from './services/api';

function Registration(props) {
  const { dispatch, userinfo, loading } = props;
  const pagetitle = props.route.name;
  // const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员  
  const [buttontype, setButtonType] = useState('');             // 按钮类型   
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
    startFlow().then(res => {
      if (res.code === 200) {
        // console.log(RegistratRef.current)
        setTaskId(res.data.taskId);
        setUserVisible(true);

      } else {
        message.error(res.msg)
      }
    })
  };

  // 保存,流转获取表单数据
  const handleSave = () => {
    startFlow().then(res => {
      if (res.code === 200) {
        console.log(RegistratRef.current)
      } else {
        message.error(res.msg)
      }
    })
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      RegistratRef.current.Forms((err, values) => {
        dispatch({
          //  type: 'demandregister/uploadchange',
          payload: {
            ...values,
            creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
            registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
            completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
            attachment: JSON.stringify(files.arr),
            functionalModule: values.functionalModule.join('/'),
            nextUserIds: [{ nodeName: '', userIds: [] }],
          },
        });
      });
    }
  }, [files]);

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
            files={files.arr}
            ChangeFiles={newvalue => {
              setFiles(newvalue);
            }}
            selectdata={selectdata}
            isEdit
            taskName='发布登记'
          />
        </Card>
      </Spin>
      <User
        taskId={taskId}
        visible={uservisible}                       // 传参显示选人modle
        ChangeUserVisible={v => setUserVisible(v)}  // 选人完成关闭选人modle
        changorder='平台验证'                        //  下一环节名
        ChangeChoice={v => setUserChoice(v)}         //  选人完成返回状态true，通过true判读，进行
        ChangeType={v => setButtonType(v)}           // 点击取消按钮，重置按钮类型         
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(Registration);
