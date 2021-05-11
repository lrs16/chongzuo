import React from 'react';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BusinessEditTable from './components/BusinessEditTable';

function BusinessDetail(props) {
  const { mainId, titletype } = props.location.query;
  const pagetitle = props.route.name;

  const operations = (
    <>
      <Button type="danger" ghost style={{ marginRight: 8 }} >
        回退
        </Button>
      <Button type="primary" style={{ marginRight: 8 }} >
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} >
        验证完成
      </Button>
      <Button >返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <BusinessEditTable
        title='发布清单'
        type={pagetitle}
        mainId={mainId}
        titletype={titletype}
      />
    </PageHeaderWrapper>
  );
}

export default BusinessDetail;