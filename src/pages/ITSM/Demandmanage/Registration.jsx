import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Registrat from './components/Registrat';
import SelectUser from '@/components/SelectUser';

function Registration(props) {
  const { dispatch, location, userinfo, info, loading } = props;
  const { mainId } = location.query;
  const pagetitle = props.route.name;
  // const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [files, setFiles] = useState([]); // 下载列表

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'demand');
  }, []);

  // 附件更新后，刷新
  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'demandtodo/demandopenflow',
        payload: {
          processInstanceId: mainId,
        },
      });
    }
  }, [mainId]);

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
        nextUserIds: sessionStorage.getItem('userauthorityid').split(','),
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
        nextUserIds: sessionStorage.getItem('userauthorityid').split(','),
        // nextUser: sessionStorage.getItem('userName'),
      },
    });
  };
  // 保存,流转获取表单数据
  const getregistrat = type => {
    if (type === 'save') {
      handlesubmit(RegistratRef.current.getFieldsValue());
    }
    if (type === 'next') {
      RegistratRef.current.validateFields((err, values) => {
        if (!err) {
          handlenext(values);
        }
      });
    }
  };

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.length > 0) {
      const values = RegistratRef.current.getFieldsValue();
      dispatch({
        type: 'demandregister/uploadchange',
        payload: {
          ...values,
          creationTime: values.creationTime.format(),
          registerTime: values.registerTime.format(),
          attachment: JSON.stringify(files),
          functionalModule: values.functionalModule.join('/'),
          nextUserIds: sessionStorage.getItem('userauthorityid').split(','),
        },
      });
    }
  }, [files]);

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
        <Spin spinning={loading}>
          {loading === false && (
            <Registrat
              ref={RegistratRef}
              userinfo={userinfo}
              files={mainId !== undefined ? JSON.parse(info.demandForm.attachment) : files}
              ChangeFiles={newvalue => {
                setFiles(newvalue);
              }}
              register={mainId !== undefined ? info.demandForm : undefined}
            />
          )}
        </Spin>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, demandtodo, loading }) => ({
  userinfo: itsmuser.userinfo,
  info: demandtodo.info,
  loading: loading.models.demandtodo,
}))(Registration);
