import React, { useState, useRef, useContext, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Button, Breadcrumb, Spin, message } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { knowledgeCheckUserList } from '@/services/user';
import Content from './components/Content';
import Examine from './components/Examine';
import UpDataList from './components/UpDataList';

const { Panel } = Collapse;

function Operation(props) {
  const { dispatch, location, loading, info, userinfo, updatas } = props;
  const { mainId } = location.query;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [userlist, setUserList] = useState([]);
  const [menuDesc, setMenuDesc] = useState('');
  const [title, setTitle] = useState('');
  const [runpath, setRunpath] = useState('');
  const [status, setStatus] = useState('');
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [uploadStatus, setUploadStatus] = useState(false);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
  const { currenttab } = useContext(EditContext);

  useEffect(() => {
    if (currenttab && currenttab.state) {
      setMenuDesc(currenttab.state.menuDesc);
      setTitle(currenttab.state.title);
      setRunpath(currenttab.state.runpath);
      setStatus(currenttab.state.status);
    }
  }, [currenttab])

  const callback = key => {
    setActiveKey(key);
  };
  const handleClick = (buttype) => {
    ContentRef.current.Forms((err, values) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        dispatch({
          type: 'knowledg/saveorsubmit',
          payload: {
            values: { ...values },
            buttype,
            mainId: mainId || values.id,
            userId: buttype === 'submit' ? choiceUser.users : sessionStorage.getItem('userauthorityid'),
            runpath,
          },
        })
      }
    })
  };

  const handleCheck = (buttype) => {
    ExmaineRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        const values = ExmaineRef.current.getVal();
        dispatch({
          type: 'knowledg/saveorcheck',
          payload: {
            values: {
              ...values,
              checkTime: moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss'),
              content: values.result === '通过' ? values.content : values.content1,
            },
            buttype,
            mainId: mainId || info.data[0].main.id,
            runpath,
            editState: info.edit.check === '' ? 'add' : 'edit',
            userId: sessionStorage.getItem('userauthorityid')
          },
        })
      }
    })
  };

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
    ContentRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        knowledgeCheckUserList().then(res => {
          if (res.code === 200) {
            setUserList(res.data);
            setUserVisible(true)
          }
        })
      }
    })
  };

  const ChangeFiles = (v) => {
    const values = ContentRef.current.getVal();
    dispatch({
      type: 'knowledg/saveorsubmit',
      payload: {
        values: { ...values, fileIds: v.length ? JSON.stringify(v) : '' },
        buttype: 'save',
        mainId: mainId || values.id,
        userId: sessionStorage.getItem('userauthorityid'),
        runpath
      },
    })
  }

  const handleTabChange = key => {
    settabActivekey(key)
  };

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
      settabActivekey('workorder');
    }
  }, [mainId])

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'knowledg/knowledgopen',
        payload: {
          mainId,
        },
      });
      settabActivekey('workorder');
    }
  }, [location.state])

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

  // // 操作记录
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

  const operations = (
    <>
      {tabActivekey === 'workorder' && menuDesc && (
        <>
          {(menuDesc === '编辑知识') && (<Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleClick('save')}
            disabled={uploadStatus}
          >
            保存
          </Button>
          )}
          {menuDesc === '知识审核' && status === '待审核' && (<Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleCheck('save')}
            disabled={uploadStatus}
          >
            保存
          </Button>
          )}
          {title === '我的知识' && status === '已登记' && (<Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleSubmit() }}
            disabled={uploadStatus}
          >
            提交
          </Button>
          )}
          {title === '知识维护' && menuDesc === '编辑知识' && (<Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleClick('release') }}
            disabled={uploadStatus}
          >
            发布
          </Button>
          )}
          {menuDesc === '知识审核' && status === '待审核' && (<Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => { handleCheck('check') }}
            disabled={uploadStatus}
          >
            审核
          </Button>
          )}
          <Button onClick={handleclose} disabled={uploadStatus}>返回</Button>
        </>
      )}
      {tabActivekey === 'List' && (<Button onClick={handleclose} disabled={uploadStatus}>返回</Button>)}
    </>
  )
  return (
    <div style={{ marginTop: '-24px' }}>
      {menuDesc && title && (
        <>
          <Breadcrumb style={{ padding: '12px 24px 16px 24px', background: '#fff', margin: '0 -24px' }}>
            <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
            <Breadcrumb.Item>知识管理</Breadcrumb.Item>
            <Breadcrumb.Item>{title}</Breadcrumb.Item>
            <Breadcrumb.Item>{menuDesc}</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeaderWrapper
            title={menuDesc}
            extra={operations}
            breadcrumb={false}
            tabList={tabList}
            tabActiveKey={tabActivekey}
            onTabChange={handleTabChange}
          >
            {tabActivekey === 'workorder' && (
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
                          <EditContext.Provider value={{
                            editable: true,
                            files: (info.edit.main && info.edit.main.fileIds) ? JSON.parse(info.edit.main.fileIds) : [],
                            ChangeFiles,
                            getUploadStatus: (v) => { setUploadStatus(v) },
                          }}>
                            <Content
                              wrappedComponentRef={ContentRef}
                              formrecord={info.edit.main}
                              isedit
                              location={location}
                            />
                          </EditContext.Provider>
                        </Panel>
                      )}
                      {title === '知识审核' && status === '待审核' && (
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
                      {(menuDesc === '知识详情' || (title === '我的知识' && info.data && info.data[1] && info.data[1].check)) && info.data[1] && (
                        <Panel header='知识审核' key="2">
                          <Examine
                            wrappedComponentRef={ExmaineRef}
                            check={info.data[1].check}
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
            <EditContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
              <CheckOneUser userlist={userlist} />
            </EditContext.Provider>
          </PageHeaderWrapper>
        </>
      )}
    </div>
  );
}

export default connect(({ knowledg, itsmuser, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
  info: knowledg.info,
  updatas: knowledg.updatas,
  loading: loading.models.knowledg,
}))(Operation);