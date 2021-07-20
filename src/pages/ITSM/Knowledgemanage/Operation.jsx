import React, { useState, useRef, useContext, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Collapse, Button, Breadcrumb, Spin } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import NewUser from '@/components/SelectUser/NewUser';
import { knowledgeCheckUserList } from '@/services/user';
import Content from './components/Content';
import Examine from './components/Examine';


const { Panel } = Collapse;

function Operation(props) {
  const { dispatch, location, loading, info } = props;
  const { Id } = location.query;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const [choicelist, setChoiceList] = useState([]);
  const [userlist, setUserList] = useState([]);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
  const { currenttab } = useContext(EditContext);
  const { state: { menuDesc, title, runpath, status } } = currenttab;

  const callback = key => {
    setActiveKey(key);
  };
  const handleClick = (buttype) => {
    const values = ContentRef.current.getVal();
    dispatch({
      type: 'knowledg/saveorsubmit',
      payload: {
        values: { ...values },
        buttype,
        mainId: Id,
        userId: sessionStorage.getItem('userauthorityid'),
        runpath
      },
    })
  }
  const handleclose = () => {
    if (runpath) {
      router.push({
        pathname: runpath,
        query: { pathpush: true },
        state: { cache: false }
      });
    }
  };

  const handleSubmit = () => {
    knowledgeCheckUserList().then(res => {
      if (res.code === 200) {
        setUserList(res.data)
      }
    })
  }
  useEffect(() => {
    if (menuDesc && menuDesc === '知识审核') {
      setActiveKey(['formpanel', '1'])
    };
    if (menuDesc && menuDesc === '知识详情') {
      setActiveKey(['1', '2'])
    };
  }, [title])

  useEffect(() => {
    if (Id) {
      dispatch({
        type: 'knowledg/knowledgopen',
        payload: {
          mainId: Id,
        },
      });
    }
  }, [location])

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleClick('save')}
      >
        保存
      </Button>
      {title === '我的知识' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSubmit() }}
      >
        提交
      </Button>
      )}
      {title === '知识维护' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSubmit() }}
      >
        发布
      </Button>
      )}
      {menuDesc === '审核知识' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleClick('submit') }}
      >
        审核
      </Button>
      )}
      <Button onClick={handleclose}>返回</Button>
    </>
  )
  return (
    <div style={{ marginTop: '-24px' }}>
      <Breadcrumb style={{ padding: '12px 24px 16px 24px', background: '#fff', margin: '0 -24px' }}>
        <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
        <Breadcrumb.Item>知识管理</Breadcrumb.Item>
        <Breadcrumb.Item>{title}</Breadcrumb.Item>
        <Breadcrumb.Item>{menuDesc}</Breadcrumb.Item>
      </Breadcrumb>
      <PageHeaderWrapper title={menuDesc} extra={operations} breadcrumb={false} >
        <Spin spinning={loading} />
        {loading === false && info && (
          <div className={styles.ordercollapse}>
            <Collapse
              expandIconPosition="right"
              activeKey={activeKey}
              bordered={false}
              onChange={callback}
            >

              {(title === '我的知识' || title === '知识维护') && status === '已登记' && (
                <Panel header='知识收录' key="formpanel">
                  <EditContext.Provider value={{ editable: true }}>
                    <Content
                      wrappedComponentRef={ContentRef}
                      formrecord={info.edit.main}
                      isedit
                    />
                  </EditContext.Provider>
                </Panel>
              )}
              {title === '知识审核' && (
                <Panel header='知识审核' key="formpanel">
                  <Examine
                    wrappedComponentRef={ExmaineRef}
                    formrecord={info.edit.check === '' ? undefined : info.edit.check}
                  />
                </Panel>
              )}
              {menuDesc === '知识详情' && (
                <Panel header='知识收录' key="1">
                  <EditContext.Provider value={{ editable: false }}>
                    <Content
                      wrappedComponentRef={ContentRef}
                      formrecord={info.data[0].main}
                      isedit
                      Noediting
                    />
                  </EditContext.Provider>
                </Panel>
              )}
              {title === '知识查询' && (
                <Panel header='知识审核' key="2">
                  <Examine
                    wrappedComponentRef={ExmaineRef}
                    formrecord={{}}
                    Noediting
                  />
                </Panel>
              )}
            </Collapse>
          </div >
        )}
        <EditContext.Provider value={{ setChoiceList }}>
          <NewUser userlist='' />
        </EditContext.Provider>
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ knowledg, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  info: knowledg.info,
  loading: loading.models.knowledg,
}))(Operation);