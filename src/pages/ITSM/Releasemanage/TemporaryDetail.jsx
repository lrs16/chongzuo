import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TemporaryRegistrat from './components/TemporaryRegistrat';

function TemporaryDetail(props) {
  const pagetitle = props.route.name;

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
        <TemporaryRegistrat />
      </Card>
    </PageHeaderWrapper>
  );
}

export default TemporaryDetail;