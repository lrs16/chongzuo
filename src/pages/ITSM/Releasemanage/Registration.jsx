import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import Registrat from './components/Registrat';

function Registration(props) {
  const { dispatch, userinfo, loading } = props;
  const pagetitle = props.route.name;
  // const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  // 保存，保存提交
  const RegistratRef = useRef();
  const handlesubmit = values => {
    dispatch({
      //  type: 'demandregister/start',
      payload: {
        ...values,
      },
    });
  };

  // 保存,流转获取表单数据
  const getregistrat = type => {
    console.log(RegistratRef.current)
    // RegistratRef.current.Forms.validateFieldsAndScroll((err, values) => {
    //   if (err) return;
    //   console.log(values)
    // })
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
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => getregistrat('save')}>
        保存
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
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(Registration);
