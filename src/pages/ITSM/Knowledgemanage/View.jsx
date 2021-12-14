import React, { useState, useRef, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Collapse, Button, Breadcrumb, Spin } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';
import UpDataList from './components/UpDataList';

const { Panel } = Collapse;

function Operation(props) {
  const { dispatch, location, loading, viewinfo, updatas } = props;
  const { mainId, Id } = location.query;
  const [activeKey, setActiveKey] = useState(['1', '2']);
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);

  const callback = key => {
    setActiveKey(key);
  };

  const handleclose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
    });
  };

  const handleTabChange = key => {
    settabActivekey(key)
  };

  // 打开待办
  useEffect(() => {
    if (mainId) {
      dispatch({
        type: 'knowledg/openview',
        payload: {
          mainId,
        },
      });
      settabActivekey('workorder');
    }
  }, [Id]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'knowledg/openview',
        payload: {
          mainId,
        },
      });
      settabActivekey('workorder');
    }
  }, [location.state]);

  // 操作记录
  useEffect(() => {
    if (tabActivekey === 'List') {
      dispatch({
        type: 'knowledg/updatelist',
        payload: { mainId }
      });
    };
  }, [tabActivekey]);

  const tabList = [
    {
      key: 'workorder',
      tab: '知识收录',
    },
    {
      key: 'List',
      tab: '操作记录',
    },
  ];

  const operations = (<Button onClick={handleclose}>关闭</Button>)

  return (
    <div style={{ marginTop: '-24px' }}>
      <Breadcrumb style={{ padding: '12px 24px 16px 24px', background: '#fff', margin: '0 -24px' }}>
        <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
        <Breadcrumb.Item>知识管理</Breadcrumb.Item>
        <Breadcrumb.Item>知识查询</Breadcrumb.Item>
        <Breadcrumb.Item>知识详情</Breadcrumb.Item>
      </Breadcrumb>
      <PageHeaderWrapper
        title='知识详情'
        extra={operations}
        breadcrumb={false}
        tabList={tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        {tabActivekey === 'workorder' && (
          <Spin spinning={loading} >
            {viewinfo && (
              <div className={styles.ordercollapse}>
                <Collapse
                  expandIconPosition="right"
                  activeKey={activeKey}
                  bordered={false}
                  onChange={callback}
                >
                  <Panel header='知识收录' key="1">
                    <EditContext.Provider value={{ editable: false }}>
                      <Content
                        wrappedComponentRef={ContentRef}
                        formrecord={viewinfo[0].main}
                        isedit
                        Noediting
                      />
                    </EditContext.Provider>
                  </Panel>
                  {viewinfo[1] && (
                    <Panel header='知识审核' key="2">
                      <Examine
                        wrappedComponentRef={ExmaineRef}
                        check={viewinfo[1].check}
                        Noediting
                      />
                    </Panel>
                  )}
                </Collapse>
              </div >
            )}
          </Spin>
        )}
        {tabActivekey === 'List' && (
          <UpDataList data={updatas} loading={loading} />
        )}
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ knowledg, itsmuser, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
  viewinfo: knowledg.viewinfo,
  updatas: knowledg.updatas,
  loading: loading.models.knowledg,
}))(Operation);