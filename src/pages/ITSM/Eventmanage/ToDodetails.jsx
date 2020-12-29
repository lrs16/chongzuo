import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popover, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Backoff from './components/Backoff';
import SelectUser from '@/components/SelectUser';

function ToDodetails(props) {
  const { match, children, location, dispatch } = props;
  const { pangekey, id, mainId, check } = location.query;
  const pagetitle = props.route.name;
  const [backvalue, setBackvalue] = useState('');
  const [Popvisible, setVisible] = useState(false);
  const [UserId, setUserId] = useState('');

  const handleHold = type => {
    router.push({
      pathname: `${props.match.url}/workorder`,
      query: {
        pangekey,
        id,
        validate: true,
        type,
      },
    });
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/to-do`,
    });
  };
  const content = (
    <Backoff
      ChangeBackvalue={value => setBackvalue(value)}
      ChangeVisible={visi => setVisible(visi)}
    />
  );

  const handleVisibleChange = visible => {
    setVisible(visible);
  };

  useEffect(() => {
    if (backvalue !== '') {
      dispatch({
        type: 'eventtodo/eventback',
        payload: {
          id,
          userIds: '1',
          type: '2',
          ...backvalue,
        },
      });
    }
  }, [backvalue]);

  // 接单
  const eventaccpt = () => {
    dispatch({
      type: 'eventtodo/eventaccept',
      payload: {
        id,
        userIds: '1',
        type: '1',
      },
    });
  };

  // 转单
  const eventtransfer = () => {
    dispatch({
      type: 'eventtodo/eventransfer',
      payload: {
        flow: {
          id,
          userIds: '1311225321495728129',
          type: '3',
        },
      },
    });
  };
  const deleteflow = () => {
    dispatch({
      type: 'eventtodo/deleteflow',
      payload: {
        mainId,
      },
    });
  };

  // 测试下载功能
  //   const test = () => {
  //   dispatch({
  //     type: 'eventtodo/eventdownload',
  //     payload: {
  //       mainId,
  //     },
  //   }).then(res => {
  //       // console.log(res);
  //       const filename = `下载.xls`;
  //       const blob = new Blob([res]);
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = filename;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     });
  // };

  const operations = (
    <>
      {/* 测试下载功能 */}
      {/* <Button onClick={()=>test()}>下载</Button> */}
      {pangekey === '1' && (
        <Popconfirm title="确定删除此事件单吗？" onConfirm={() => deleteflow()}>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            删除
          </Button>
        </Popconfirm>
      )}
      {(pangekey === '2' ||
        (pangekey === '4' && check === '') ||
        (pangekey === '6' && check === '')) && (
        // <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleHold('back')}>
        //   回退
        // </Button>
        <Popover content={content} visible={Popvisible} onVisibleChange={handleVisibleChange}>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            回退
          </Button>
        </Popover>
      )}
      {pangekey !== '2' && pangekey !== '3' && pangekey !== '4' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
          保存
        </Button>
      )}
      {pangekey === '4' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={eventaccpt}>
          接单
        </Button>
      )}
      {pangekey === '5' && (
        <SelectUser handleSubmit={() => eventtransfer()}>
          <Button type="primary" style={{ marginRight: 8 }}>
            转单
          </Button>
        </SelectUser>
      )}
      {pangekey !== '4' && (
        <SelectUser handleSubmit={() => handleHold('flow')}>
          <Button type="primary" style={{ marginRight: 8 }}>
            流转
          </Button>
        </SelectUser>
      )}

      <Button onClick={handleclose}>返回</Button>
    </>
  );
  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        router.push({
          pathname: `${match.url}/workorder`,
          query: {
            pangekey,
            id,
            mainId,
            validate: false,
          },
        });
        break;
      case 'process':
        router.push({
          pathname: `${match.url}/process`,
          query: {
            pangekey,
            id,
            mainId,
            validate: false,
          },
        });
        break;
      default:
        break;
    }
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '事件工单',
    },
    {
      key: 'process',
      tab: '事件流程',
    },
  ];
  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={operations}
      tabList={tabList}
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
    >
      {children}
    </PageHeaderWrapper>
  );
}

export default connect(({ eventtodo, loading }) => ({
  loading: loading.effects['eventtodo/eventback'],
}))(ToDodetails);
