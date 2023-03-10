import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Button, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import Registrat from './components/Registrat';

function Registration(props) {
  const { dispatch, userinfo, loading, tabnew, location, tabdata, olduploadstatus } = props;
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
  const handlesubmit = () => {
    const values = RegistratRef.current.getVal();
    dispatch({
      type: 'demandregister/start',
      payload: {
        ...values,
        creationTime: values.creationTime ? moment(values.creationTime).format('YYYY-MM-DD HH:mm:ss') : '',
        registerTime: values.registerTime ? moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss') : '',
        completeTime: values.completeTime ? moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss') : '',
        proposingDepartment:
          values.proposingDepartment !== '' ? values.proposingDepartment : values.proposingUnit,
        proposingDepartmentId:
          values.proposingDepartmentId !== '' ? values.proposingDepartmentId : values.proposingUnitID,
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
  // const handlenext = () => {
  //   const values = RegistratRef.current.getVal();
  //   dispatch({
  //     type: 'demandregister/startandnext',
  //     payload: {
  //       ...values,
  //       creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
  //       registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
  //       completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
  //       proposingDepartment:
  //         values.proposingDepartment !== '' ? values.proposingDepartment : values.proposingUnit,
  //       proposingDepartmentId:
  //         values.proposingDepartmentId !== '' ? values.proposingDepartmentId : values.proposingUnitID,
  //       attachment: JSON.stringify(files),
  //       functionalModule: values.functionalModule.join('/'),
  //       nextUserIds: [{ nodeName: '', userIds: [] }],
  //       // nextUser: sessionStorage.getItem('userName'),
  //     },
  //   });
  // };

  // 保存,流转获取表单数据
  const getregistrat = type => {
    if (type === 'save') {
      handlesubmit();
    };
    // if (type === 'next') {
    //   handlenext()
    // }
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handlesubmit()
    }
  }, [files]);

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
    }
  }, [tabnew]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state) {
      if (location.state.reset) {
        RegistratRef.current.resetVal();
      }
    }
  }, [location.state]);

  // 获取页签信息
  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        const values = RegistratRef.current.getVal();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...values,
              creationTime: values.creationTime ? moment(values.creationTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
              registerTime: values.registerTime ? moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
              completeTime: values.completeTime ? moment(values.completeTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
              functionalModule: values.functionalModule.join('/'),
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
        RegistratRef.current.resetVal();
      }
    }
  }, [location]);

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/demandmanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => getregistrat('save')} disabled={loading || olduploadstatus}>
        保存
      </Button>
      {/* <SelectUser handleSubmit={() => getregistrat('next')}>
        <Button type="primary" style={{ marginRight: 8 }}>
          流转
        </Button>
      </SelectUser> */}
      <Button type="default" onClick={() => handleclose()} disabled={loading}>关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <SysDict
        typeid={332}
        commonid={335}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <div className='noexplain'>
        <Spin tip="正在提交数据..." spinning={!!loading}>
          <Card>
            <Registrat
              wrappedComponentRef={RegistratRef}
              userinfo={userinfo}
              files={files.arr}
              ChangeFiles={newvalue => { setFiles(newvalue) }}
              selectdata={selectdata}
              register={tabdata}
              location={location}
            />
          </Card>
        </Spin>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, viewcache, demandregister, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  olduploadstatus: viewcache.olduploadstatus,
  userinfo: itsmuser.userinfo,
  demandregister,
  loading: loading.models.demandregister,
}))(Registration);
