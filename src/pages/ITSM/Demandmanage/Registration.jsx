import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Registrat from './components/Registrat';
import SelectUser from '@/components/SelectUser';

function Registration(props) {
  const { dispatch, loading } = props;
  const pagetitle = props.route.name;
  // 保存
  const RegistratRef = useRef();
  // 保存提交
  const handlesubmit = values => {
    dispatch({
      type: 'demandregister/start',
      payload: {
        ...values,
        creationTime: values.creationTime.format(),
        registerTime: values.registerTime.format(),
        functionalModule: values.functionalModule.join('/'),
        nextUser: sessionStorage.getItem('NextflowUserId'),
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

  useEffect(() => {
    dispatch({
      type: 'eventregist/fetchuser',
    });
  }, []);

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => getregistrat('save')}>
        保存
      </Button>
      <SelectUser handleSubmit={() => getregistrat('next')}>
        <Button type="primary" style={{ marginRight: 8 }}>
          流转
        </Button>
      </SelectUser>
      <Button type="default">关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <Registrat ref={RegistratRef} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ demandregister, loading }) => ({
  demandregister,
  loading: loading.models.demandregister,
}))(Registration);
