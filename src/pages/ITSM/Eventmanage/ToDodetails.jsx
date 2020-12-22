import React from 'react';
import router from 'umi/router';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function ToDoregist(props) {
  const { match, children, location } = props;
  const { pangekey, id } = location.query;
  const pagetitle = props.route.name;

  const handleHold = () => {
    router.push({
      pathname: `${props.match.url}/workorder`,
      query: {
        pangekey,
        id,
        validate: true,
      },
    });
  };
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/to-do`,
    });
  };
  const operations = (
    <>
      {pangekey === 1 && (
        <Button type="danger" ghost style={{ marginRight: 8 }}>
          删除
        </Button>
      )}
      {pangekey !== 1 && (
        <Button type="primary" style={{ marginRight: 8 }}>
          转单
        </Button>
      )}
      <Button type="primary" style={{ marginRight: 8 }} onClick={handleHold}>
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }}>
        流转
      </Button>
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
          },
        });
        break;
      case 'process':
        router.push({
          pathname: `${match.url}/process`,
          query: {
            pangekey,
            id,
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

export default ToDoregist;
