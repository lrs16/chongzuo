import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, message, Card, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import BusinessEditTable from './components/BusinessEditTable';
import { completeVerify, releaseToQuality } from './services/api';

function BusinessDetail(props) {
  const { dispatch, info, loading, taskName, location } = props;
  const { titletype } = location.query;
  const { Id, releaseNo } = props.location.query;
  const pagetitle = props.route.name;
  const [runpath, setRunpath] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleQuality, setVisibleQuality] = useState(false);
  const [toVerify, setToVerify] = useState(false);
  const [myList, setMyList] = useState(undefined);
  const { currenttab } = useContext(EditContext);
  const user = sessionStorage.getItem('userName');

  useEffect(() => {
    if (currenttab && currenttab.state) {
      setRunpath(currenttab.state.runpath);
    }
  }, [currenttab])

  const handleclose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
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
        message.error(res.msg || '验证失败')
      };
    })
  }

  const handlecompleteverify = () => {
    // if (selectedRecords && selectedRecords.length > 0) {
    //   const Arr = selectedRecords.filter(obj => obj.responsible !== user);
    //   if (Arr && Arr.length && Arr.length > 0) {
    //     setVisible(true);
    //   } else {
    //     submitVerify();
    //   }
    // } else {
    //   message.error('请选择数据...')
    // }
    setMyList(undefined)
  };

  const handlemycompleteverify = () => {
    const Arr = info.filter(obj => obj.responsible === user);
    if (Arr && Arr.length > 0) {
      // const newArr = Arr.map((item) => {
      //   return item.id
      // });
      setMyList(Arr);
      // completeVerify({ listIds: newArr.toString() }).then(res => {
      //   if (res.code === 200) {
      //     message.success(res.msg);
      //     router.push({
      //       pathname: runpath,
      //       query: { pathpush: true },
      //       state: { cache: false, closetabid: Id }
      //     });
      //   } else {
      //     message.error(res.msg || '验证失败！')
      //   };
      // })
    } else {
      message.info('清单中没有您负责的业务...');
      setMyList([]);
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
      setMyList(undefined);
    }
  }, [Id]);


  const ToQuality = () => {
    if (selectedRecords[0].id) {
      setVisibleQuality(false);
      releaseToQuality({ id: selectedRecords[0].id }).then(res => {
        if (res.code === 200) {
          message.success('操作成功！');
          dispatch({
            type: 'releaseverificat/openflow',
            payload: {
              todoCode: Id,
            },
          });
        } else {
          message.error('操作失败！')
        };
        setSelectedRecords([])
      })
    }
  }

  const openToQuality = () => {
    if (selectedRecords[0].assessNo) {
      setVisibleQuality(true)
    } else {
      ToQuality()
    }
  }

  const operations = (
    <>
      {titletype === taskName && (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlemycompleteverify()}>
            我负责的清单
          </Button>
          <Popconfirm
            title="该清单不属于您的功能业务复核，是否确定复核？"
            onConfirm={() => submitVerify()}
            visible={visible}
            onCancel={() => setVisible(false)}
            placement="leftTop"
          >
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlecompleteverify()}>
              全部清单
            </Button>
          </Popconfirm>
        </>
      )}
      {titletype === '业务复核' && (
        <Popconfirm
          title="该功能曾发起服务绩效，确定再次发起服务绩效吗?"
          onConfirm={() => ToQuality()}
          visible={visibleQuality}
          onCancel={() => setVisibleQuality(false)}
          placement="leftTop"
        >
          <Button type='primary' onClick={() => openToQuality()} disabled={selectedRecords.length !== 1}>发起服务绩效</Button>
        </Popconfirm>
      )}
      <Button onClick={handleclose} >关闭</Button>

    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card title={releaseNo ? `所属发布工单:${releaseNo}` : ''} >
        <BusinessEditTable
          title='发布清单'
          type={pagetitle}
          dataSource={myList || info}
          ChangeValue={(v) => {
            if (v.status) {
              completeVerify({ listIds: v.target.id }).then(res => {
                if (res.code === 200) {
                  message.success(res.msg);
                } else {
                  message.error(res.msg || '验证失败')
                };
              })
            }
          }}
          scroll={{ x: 1740 }}
          loading={loading}
          isEdit={titletype === taskName}
          getSelectedRecords={(v) => setSelectedRecords(v)}

        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default connect(({ releaseverificat, loading }) => ({
  info: releaseverificat.info,
  taskName: releaseverificat.taskName,
  loading: loading.models.releaseverificat,
}))(BusinessDetail);