import React, { useRef } from 'react';
import router from 'umi/router';
import { Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function ToDoregist(props) {
  const { match, children, location } = props;
  const { pangekey, id, mainId } = location.query;
  const pagetitle = props.route.name;
  const cRef = useRef();

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
      pathname: `/ITSM/demandmanage/to-do`,
    });
  };
  const operations = (
    <>
      <Button type="danger" ghost style={{ marginRight: 8 }}>
        删除
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('save')}>
        保存
      </Button>
      <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleHold('flow')}>
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
            mainId,
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
      tab: '需求工单',
    },
    {
      key: 'process',
      tab: '需求流程',
    },
  ];
  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={operations}
      tabList={tabList}
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
      ref={cRef}
    >
      {children}
    </PageHeaderWrapper>
  );
}

export default ToDoregist;
