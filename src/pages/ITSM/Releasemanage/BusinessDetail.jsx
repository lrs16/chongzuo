import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, message, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import BusinessEditTable from './components/BusinessEditTable';
import { completeVerify } from './services/api';

function BusinessDetail(props) {
  const { dispatch, info } = props;
  const { Id, releaseNo } = props.location.query;
  const pagetitle = props.route.name;
  const [runpath, setRunpath] = useState('');
  const { currenttab } = useContext(EditContext);

  useEffect(() => {
    if (currenttab && currenttab.state) {
      setRunpath(currenttab.state.runpath);
    }
  }, [currenttab])

  const handleclose = () => {
    router.push({
      pathname: runpath,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  const handlecompleteverify = () => {
    const newArr = info.map((item) => {
      return item.id
    });
    completeVerify({ listIds: newArr.toString() }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/releasemanage/verificationtodo`,
          query: { pathpush: true },
          state: { cache: false, closetabid: Id }
        });
      } else {
        message.error(res.msg)
      };
    })
  }

  useEffect(() => {
    if (Id) {
      dispatch({
        type: 'releaseverificat/openflow',
        payload: {
          todoCode: Id,
        },
      });
    }
  }, [Id])

  const operations = (
    <>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlecompleteverify()}>
        验证完成
      </Button>
      <Button onClick={handleclose} >返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card title={`所属发布工单:${releaseNo}`} >
        <BusinessEditTable
          title='发布清单'
          type={pagetitle}
          dataSource={info}
          ChangeValue={() => { }}
          scroll={{ x: 1740 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ releaseverificat, loading }) => ({
  info: releaseverificat.info,
  loading: loading.models.releaseverificat,
}))(BusinessDetail);