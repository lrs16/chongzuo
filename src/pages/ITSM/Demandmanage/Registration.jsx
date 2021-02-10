import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Registrat from './components/Registrat';
// import SelectUser from '@/components/SelectUser';

function Registration(props) {
  const { dispatch, userinfo, lacation } = props;
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

  // 请求下拉值
  useEffect(() => {
    let doCancel = false;
    if (!doCancel) {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: '1354274450639425537' },
      }).then(res => {
        if (res.code === 200) {
          selectdata.arr.push(...res.data[0]?.children);
          if (!doCancel) {
            dispatch({
              type: 'dicttree/childdictLower',
              payload: { id: '1354288354950123522' },
            }).then(ress => {
              if (ress.code === 200) {
                selectdata.arr.push(...ress.data[0]?.children);
                setSelectData({ ...selectdata, ischange: true });
              }
            });
          }
        }
      });
    }
    return () => {
      setSelectData({ arr: [], ischange: false });
      doCancel = true;
    };
  }, []);

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
        <Spin spinning={!selectdata.ischange}>
          {selectdata.ischange && (
            <Registrat
              ref={RegistratRef}
              userinfo={userinfo}
              files={files.arr}
              ChangeFiles={newvalue => {
                setFiles(newvalue);
              }}
              selectdata={selectdata.arr}
            />
          )}
        </Spin>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  loading: loading.models.itsmuser,
}))(Registration);
