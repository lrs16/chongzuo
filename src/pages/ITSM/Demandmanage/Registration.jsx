import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Registrat from './components/Registrat';
import SelectUser from '@/components/SelectUser';

function Registration(props) {
  const { dispatch, userinfo } = props;
  const pagetitle = props.route.name;
  const [flowtype, setFlowtype] = useState('1'); // 流转类型

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'eventregist/fetchuser',
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
        creationTime: values.creationTime.format(),
        registerTime: values.registerTime.format(),
        functionalModule: values.functionalModule.join('/'),
        nextUser: sessionStorage.getItem('userauthorityid'),
        // nextUser: sessionStorage.getItem('userName'),
      },
    });
  };
  const handlenext = values => {
    dispatch({
      type: 'demandregister/startandnext',
      payload: {
        ...values,
        creationTime: values.creationTime.format(),
        registerTime: values.registerTime.format(),
        functionalModule: values.functionalModule.join('/'),
        // nextUser: sessionStorage.getItem('NextflowUserId'),
        nextUser: sessionStorage.getItem('userName'),
      },
    });
  };
  // 保存校验
  const getregistrat = type => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        if (type === 'save') {
          handlesubmit(values);
        }
        if (type === 'next') {
          handlenext(values);
        }
      }
    });
  };

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
      <Card>
        <Registrat ref={RegistratRef} userinfo={userinfo} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  loading: loading.models.demandregister,
}))(Registration);
