import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, message, Card, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import BusinessEditTable from './components/BusinessEditTable';
import { completeVerify } from './services/api';

function BusinessDetail(props) {
  const { dispatch, info, loading, taskName, location } = props;
  const { titletype } = location.query;
  const { Id, releaseNo } = props.location.query;
  const pagetitle = props.route.name;
  const [runpath, setRunpath] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const { currenttab } = useContext(EditContext);
  const user = sessionStorage.getItem('userName');

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

  const submitVerify = () => {
    const newArr = selectedRecords.map((item) => {
      return item.id
    });
    completeVerify({ listIds: newArr.toString() }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: runpath,
          query: { pathpush: true },
          state: { cache: false, closetabid: Id }
        });
      } else {
        message.error(res.msg)
      };
    })
  }

  const handlecompleteverify = () => {
    if (selectedRecords && selectedRecords.length > 0) {
      const Arr = selectedRecords.filter(obj => obj.responsible !== user);
      if (Arr) {
        setVisible(true);
      } else {
        submitVerify();
      }
    } else {
      message.error('请选择数据...')
    }
  };

  const handlemycompleteverify = () => {
    console.log(user);
    const Arr = info.filter(obj => obj.responsible === user);
    console.log(Arr);
    if (Arr && Arr.length > 0) {
      const newArr = Arr.map((item) => {
        return item.id
      });
      completeVerify({ listIds: newArr.toString() }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          router.push({
            pathname: runpath,
            query: { pathpush: true },
            state: { cache: false, closetabid: Id }
          });
        } else {
          message.error(res.msg)
        };
      })
    } else {
      message.info('清单中没有您负责的业务...')
    }
  };

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
      {titletype === taskName && (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlemycompleteverify()}>
            验证我负责的业务
          </Button>
          <Popconfirm
            title="所选的清单有不属于您负责的业务的功能，确定验证吗?"
            onConfirm={() => submitVerify()}
            visible={visible}
            onCancel={() => setVisible(false)}
            placement="leftTop"
          >
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlecompleteverify()}>
              验证
            </Button>
          </Popconfirm>
        </>
      )}
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
          loading={loading}
          isEdit={titletype === taskName}
          getSelectedRecords={(v) => setSelectedRecords(v)}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ releaseverificat, loading }) => ({
  info: releaseverificat.info,
  taskName: releaseverificat.taskName,
  loading: loading.models.releaseverificat,
}))(BusinessDetail);