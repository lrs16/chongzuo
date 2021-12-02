import React, { useRef, useEffect, useState } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Collapse, Button, Spin } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';

const { Panel } = Collapse;

function SoftregisterView(props) {
  const { location, dispatch, loading, userinfo, Info } = props;
  const { workId, Id, buttype } = location.query;
  const [activeKey, setActiveKey] = useState(['formpanel', 'formpanel2']);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);

  const callback = key => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (Id && (Id !== '' || Id !== undefined)) {
      dispatch({
        type: 'autosoftwork/togetAutoSoftWorkDtoById',
        payload: {
          workId: Id,
        },
      });
    }
  }, [Id]);

  // 加载用户信息
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  const handleclose = () => {
    router.push({
      pathname: '/automation/automatedjob/softstartandstop/softregister',
      query: { pathpush: true },
      state: { cache: false, closetabid: Id }
    });
  };

  const operations = (<Button onClick={handleclose}>返回</Button>)

  return (
    <div style={{ marginTop: '-24px' }}>
      <PageHeaderWrapper
        title='启停登记详情'
        extra={operations}
      >
        <Spin spinning={loading} >
          {Info && (
            <div className={styles.ordercollapse}>
              <Collapse
                expandIconPosition="right"
                activeKey={activeKey}
                bordered={false}
                onChange={callback}
              >
                <Panel header='启停登记' key="formpanel">
                  <EditContext.Provider value={{ editable: false, workId, buttype }}>
                    <Content
                      wrappedComponentRef={ContentRef}
                      userinfo={userinfo}
                      registrat={Info.autoSoftWork}
                      Noediting
                    />
                  </EditContext.Provider>
                </Panel>
                {Info.autoSoftWorkExamine && (
                  <Panel header='启停审核' key="formpanel2">
                    <Examine
                      wrappedComponentRef={ExmaineRef}
                      files={[]}
                      check={Info.autoSoftWorkExamine}
                      Noediting
                    />
                  </Panel>
                )}
              </Collapse>
            </div >
          )}
        </Spin>
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ itsmuser, autosoftwork, loading }) => ({
  userinfo: itsmuser.userinfo,
  Info: autosoftwork.geteditinfo,
  loading: loading.models.autosoftwork,
}))(SoftregisterView);