import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';

function TemporaryDetail(props) {
  const { dispatch, userinfo } = props;
  const pagetitle = props.route.name;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'temprelease');
    return () => {
      sessionStorage.removeItem('Processtype');
    }
  }, []);

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/plan/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };
  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} >
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} >
        流转至开发商项目经理审核
      </Button>
      <Button type="default" onClick={() => handleclose()} >关闭</Button>
    </>
  );
  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <TemporaryRegistrat
          selectdata={selectdata}
          info={{ releaseMain: {}, tempRegister: {} }}
          userinfo={userinfo || {}}
        />
      </Card>
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  loading: loading.models.releasetodo,
}))(TemporaryDetail);
