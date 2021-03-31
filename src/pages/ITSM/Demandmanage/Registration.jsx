import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
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
    sessionStorage.setItem('Processtype', 'demand');
  }, []);

  // 更新流转类型
  // useEffect(() => {
  //   sessionStorage.setItem('flowtype', flowtype);
  // }, [flowtype]);

  // 保存，保存提交
  const RegistratRef = useRef();
  const handlesubmit = values => {
    dispatch({
      type: 'demandregister/start',
      payload: {
        ...values,
        creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
        registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
        completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
        attachment: JSON.stringify(files.arr),
        functionalModule: values.functionalModule.join('/'),
        nextUserIds: [
          {
            nodeName: '',
            userIds: [],
          },
        ],
        // nextUser: sessionStorage.getItem('userName'),
      },
    });
  };
  const handlenext = values => {
    dispatch({
      type: 'demandregister/startandnext',
      payload: {
        ...values,
        creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
        registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
        completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
        proposingDepartment:
          values.proposingDepartment !== '' ? values.proposingDepartment : values.proposingUnit,
        attachment: JSON.stringify(files),
        functionalModule: values.functionalModule.join('/'),
        nextUserIds: [{ nodeName: '', userIds: [] }],
        // nextUser: sessionStorage.getItem('userName'),
      },
    });
  };

  // 保存,流转获取表单数据
  const getregistrat = type => {
    if (type === 'save') {
      RegistratRef.current.validateFields((err, values) => {
        handlesubmit(values);
      });
    }
    if (type === 'next') {
      RegistratRef.current.validateFields((err, values) => {
        if (!err) {
          handlenext(values);
        }
      });
    }
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      RegistratRef.current.validateFields((err, values) => {
        dispatch({
          type: 'demandregister/uploadchange',
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
      {/* <SelectUser handleSubmit={() => getregistrat('next')}>
        <Button type="primary" style={{ marginRight: 8 }}>
          流转
        </Button>
      </SelectUser> */}
      <Button type="default">关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <SysDict
        typeid="1354274450639425537"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin tip="正在提交数据..." spinning={!!loading}>
        <Card>
          <Registrat
            ref={RegistratRef}
            userinfo={userinfo}
            files={files.arr}
            ChangeFiles={newvalue => {
              setFiles(newvalue);
            }}
            selectdata={selectdata}
          />
        </Card>
      </Spin>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, demandregister, loading }) => ({
  userinfo: itsmuser.userinfo,
  demandregister,
  loading: loading.models.demandregister,
}))(Registration);
