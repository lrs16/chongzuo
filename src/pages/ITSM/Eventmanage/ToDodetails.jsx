import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Popover, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Backoff from './components/Backoff';
import SelectUser from '@/components/SelectUser';

const pagetitlemaps = new Map([
  ['1', '事件登记'],
  ['2', '事件审核'],
  ['3', '事件审核'],
  ['4', '事件处理'],
  ['5', '事件处理'],
  ['6', '事件确认'],
  ['7', '事件确认'],
  ['8', '事件处理'],
  ['9', '事件详情'],
]);

function ToDodetails(props) {
  const { match, children, location, dispatch } = props;
  const { pangekey, id, mainId, check, next } = location.query;
  const [backvalue, setBackvalue] = useState('');
  const [Popvisible, setVisible] = useState(false);
  const handleHold = type => {
    router.push({
      pathname: `${props.match.url}/workorder`,
      query: {
        pangekey,
        id,
        mainId,
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
    if (pangekey === '4') {
      message.info('请接单..', 1);
    }
  }, []);

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
        userIds: sessionStorage.getItem('userauthorityid'),
        type: '1',
      },
    });
  };

  // 结束流程
  const overflow = () => {
    dispatch({
      type: 'eventtodo/eventransfer',
      payload: {
        flow: {
          id,
          userIds: '1',
          type: '1',
        },
      },
    });
  };
  const deleteflow = () => {
    dispatch({
      type: 'eventtodo/eventback',
      payload: {
        id,
        userIds: '1',
        type: '2',
      },
    });
  };

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
      {pangekey !== '4' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
          保存
        </Button>
      )}
      {pangekey === '1' && sessionStorage.getItem('Nextflowtype') === '审核' && (
        <SelectUser handleSubmit={() => handleHold('other')}>
          <Button type="primary" style={{ marginRight: 8 }}>
            审核
          </Button>
        </SelectUser>
      )}
      {pangekey === '4' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={eventaccpt}>
          接单
        </Button>
      )}
      {(pangekey === '5' ||
        (pangekey === '1' && next === '处理') ||
        (next === '处理' && (pangekey === '2' || pangekey === '3'))) && (
        <SelectUser handleSubmit={() => handleHold('flow')} location={location}>
          <Button type="primary" style={{ marginRight: 8 }}>
            流转
          </Button>
        </SelectUser>
      )}
      {next === '确认' && (pangekey === '2' || pangekey === '3') && (
        <SelectUser handleSubmit={() => handleHold('other')}>
          <Button type="primary" style={{ marginRight: 8 }}>
            确认
          </Button>
        </SelectUser>
      )}
      {pangekey === '5' && (
        <SelectUser handleSubmit={() => handleHold('other')}>
          <Button ghost type="primary" style={{ marginRight: 8 }}>
            转单
          </Button>
        </SelectUser>
      )}
      {(pangekey === '6' || pangekey === '7') && next === '处理' && (
        <SelectUser handleSubmit={() => handleHold('other')}>
          <Button type="primary" style={{ marginRight: 8 }}>
            重分派
          </Button>
        </SelectUser>
      )}
      {(pangekey === '6' || pangekey === '7') && next === '结束' && (
        <Button type="primary" style={{ marginRight: 8 }} onClick={overflow}>
          结束
        </Button>
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
      title={pagetitlemaps.get(pangekey)}
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
  eventtodo,
  loading: loading.effects['eventtodo/eventback'],
}))(ToDodetails);
