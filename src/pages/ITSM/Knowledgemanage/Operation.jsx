import React, { useState, useRef, useContext, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Button, Breadcrumb, Spin } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { knowledgeCheckUserList } from '@/services/user';
import Content from './components/Content';
import Examine from './components/Examine';

const { Panel } = Collapse;

function Operation(props) {
  const { dispatch, location, loading, info, userinfo } = props;
  const { mainId } = location.state;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [userlist, setUserList] = useState([]);
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
  const { currenttab } = useContext(EditContext);
  const { state: { menuDesc, title, runpath, status } } = currenttab;

  console.log(status)

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
        mainId,
        userId: buttype === 'submit' ? choiceUser.users : sessionStorage.getItem('userauthorityid'),
        runpath
      },
    })
  }
  const handleCheck = (buttype) => {
    const values = ExmaineRef.current.getVal();
    dispatch({
      type: 'knowledg/saveorcheck',
      payload: {
        values: {
          ...values,
          checkTime: moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss')
        },
        buttype,
        mainId,
        runpath,
        editState: info.edit.check === '' ? 'add' : 'edit'
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
        setUserList(res.data);
        setUserVisible(true)
      }
    })
  }

  // 默认展开的panel
  useEffect(() => {
    if (menuDesc && menuDesc === '编辑知识') {
      setActiveKey(['formpanel'])
    };
    if (menuDesc && menuDesc === '知识审核') {
      setActiveKey(['formpanel', '1'])
    };
    if (menuDesc && menuDesc === '知识详情') {
      setActiveKey(['1', '2'])
    };
  }, [menuDesc])

  // 打开待办
  useEffect(() => {
    if (mainId) {
      dispatch({
        type: 'knowledg/knowledgopen',
        payload: {
          mainId,
        },
      });
    }
  }, [location])

  // 选人完成提交
  useEffect(() => {
    if (choiceUser.ischange) {
      handleClick('submit');
      setChoiceUser({ users: '', ischange: false });
    }
  }, [choiceUser.ischange])

  // 加载用户信息
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  const operations = (
    <>
      {(menuDesc === '编辑知识') && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleClick('save')}
      >
        保存
      </Button>
      )}
      {(menuDesc === '知识审核') && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleCheck('save')}
      >
        保存
      </Button>
      )}
      {title === '我的知识' && (status === '已登记' || status === '待审核') && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSubmit() }}
      >
        提交
      </Button>
      )}
      {title === '知识维护' && menuDesc === '编辑知识' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleClick('release') }}
      >
        发布
      </Button>
      )}
      {menuDesc === '知识审核' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleClick('release') }}
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
        <Spin spinning={loading} >
          {info && (
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
                      check={info.edit.check === '' ? undefined : info.edit.check}
                      userinfo={userinfo}
                    />
                  </Panel>
                )}
                {(menuDesc === '知识详情' || title === '知识审核') && (
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
                {menuDesc === '知识详情' && info.data[1] && (
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
        </Spin>
        <EditContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
          <CheckOneUser userlist={userlist} />
        </EditContext.Provider>
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ knowledg, itsmuser, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
  info: knowledg.info,
  loading: loading.models.knowledg,
}))(Operation);