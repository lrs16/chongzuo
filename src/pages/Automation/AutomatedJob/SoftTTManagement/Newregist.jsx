import React, {
  useState, useRef,
  // useContext, 
  useEffect
} from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext'; // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';
// import SoftwareInfoList from './components/SoftwareInfoList';
import styles from './index.less';
import { addAutoSoftWork, editAutoSoftWork } from './services/api';

const { Panel } = Collapse;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function Newregist(props) {
  const pagetitle = props.route.name;
  const { dispatch,
    userinfo,
    // location, 
    // loading, 
    location: {
      query: {
        Id,
        buttype
      }
    },
    Info, // 获得作业方案数据
  } = props;

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

  const handleSaveClick = (buttonype) => { // 保存添加
    if (activeKey.length === 2) {
      ContentRef.current.Forms((err) => {
        const values = ContentRef.current?.getVal();
        if (!err) {
          ExmaineRef.current.Forms((error) => {
            if (!error) {
              const val = ExmaineRef.current?.getVal();
              if (buttonype === 'add') { // 添加
                dispatch({
                  type: 'autosoftwork/toaddAutoSoftWork',
                  payload: {
                    autoSoftWork: {
                      ...values,
                      createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
                      workStatus: '1',
                    },
                    autoSoftWorkExamine: {
                      ...val,
                      examineTime: moment(val.examineTime).format('YYYY-MM-DD HH:mm:ss'),
                    }
                  },
                }).then(res => {
                  if (res.code === 200) {
                    message.success(res.msg);
                    router.push({
                      pathname: `/automation/automatedjob/softstartandstop/softregister`,
                      query: { pathpush: true },
                      state: { cache: false }
                    });
                  } else {
                    message.error(res.msg);
                  }
                });
              }
              if (buttonype === 'edit') { // 编辑
                dispatch({
                  type: 'autosoftwork/toeditAutoSoftWork',
                  payload: {
                    autoSoftWork: {
                      ...values,
                      createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
                      workStatus: '1',
                    },
                    autoSoftWorkExamine: {
                      ...val,
                      examineTime: moment(val.examineTime).format('YYYY-MM-DD HH:mm:ss'),
                      workId: Id,
                    }
                  },
                }).then(res => {
                  if (res.code === 200) {
                    message.success(res.msg);
                    router.push({
                      pathname: `/automation/automatedjob/softstartandstop/softregister`,
                      query: { pathpush: true },
                      state: { cache: false }
                    });
                  } else {
                    message.error(res.msg);
                  }
                });
              }
            } else {
              message.error('请将审核信息填写完整');
            }
          });
        } else {
          message.error('请将登记信息填写完整');
        }
      });
    } else {
      message.error('请将折叠面板打开');
    }
  };

  const handleclose = () => {
    router.push({
      pathname: `/automation/automatedjob/softstartandstop/softregister`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  const handleSubmit = (buttonype) => { // 提交 
    if (activeKey.length === 2) {
      ContentRef.current.Forms((err) => {
        const values = ContentRef.current?.getVal();
        if (!err) {
          ExmaineRef.current.Forms((error) => {
            if (!error) {
              const val = ExmaineRef.current?.getVal();
              if (buttonype === 'add') { // 登记提交(3：已审核)
                const autoSoftWork = {
                  ...values,
                  createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
                  workStatus: '1',
                };
                const autoSoftWorkExamine = {
                  ...val,
                  examineTime: moment(val.examineTime).format('YYYY-MM-DD HH:mm:ss'),
                };
                if (val.examineStatus === '0') { // 添加审核不通过，保存不提交
                  addAutoSoftWork(autoSoftWork, autoSoftWorkExamine).then(res => {
                    if (res.code === 200) {
                      message.success(res.msg);
                      router.push({
                        pathname: `/automation/automatedjob/softstartandstop/softregister`,
                        query: { pathpush: true },
                        state: { cache: false }
                      });
                    } else {
                      message.error(res.msg);
                    }
                  })
                }
                if (val.examineStatus === '1') { // 添加审核通过，保存提交
                  addAutoSoftWork(autoSoftWork, autoSoftWorkExamine).then(res => {
                    if (res.code === 200) {
                      dispatch({
                        type: 'autosoftwork/tosubmitAutoSoftWork',
                        payload: {
                          autoSoftWork,
                          autoSoftWorkExamine,
                          workId: res.data.autoSoftWork.id,
                          workStatus: '3',
                        },
                      }).then(respose => {
                        if (respose.code === 200) {
                          message.success(respose.msg);
                          router.push({
                            pathname: `/automation/automatedjob/softstartandstop/softregister`,
                            query: { pathpush: true },
                            state: { cache: false }
                          });
                        } else {
                          message.error(respose.msg);
                        }
                      });
                    } else {
                      message.error(res.msg);
                    }
                  });
                }
              }
              if (buttonype === 'edit') { // 编辑提交(3：已审核)
                const autoSoftWork = {
                  ...values,
                  createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
                  workStatus: '1',
                };
                const autoSoftWorkExamine = {
                  ...val,
                  examineTime: moment(val.examineTime).format('YYYY-MM-DD HH:mm:ss'),
                  workId: Id,
                };
                if (val.examineStatus === '0') { // 编辑审核不通过，保存不提交
                  editAutoSoftWork({ autoSoftWork, autoSoftWorkExamine }).then(res => {
                    if (res.code === 200) {
                      message.success(res.msg);
                      router.push({
                        pathname: `/automation/automatedjob/softstartandstop/softregister`,
                        query: { pathpush: true },
                        state: { cache: false }
                      });
                    } else {
                      message.error(res.msg);
                    }
                  })
                }
                if (val.examineStatus === '1') { // 编辑审核通过，保存提交
                  editAutoSoftWork({ autoSoftWork, autoSoftWorkExamine }).then(res => {
                    if (res.code === 200) {
                      dispatch({
                        type: 'autosoftwork/tosubmitAutoSoftWork',
                        payload: {
                          autoSoftWork,
                          autoSoftWorkExamine,
                          workId: Id,
                          workStatus: '3',
                        },
                      }).then(respose => {
                        if (respose.code === 200) {
                          message.success(respose.msg);
                          router.push({
                            pathname: `/automation/automatedjob/softstartandstop/softregister`,
                            query: { pathpush: true },
                            state: { cache: false }
                          });
                        } else {
                          message.error(respose.msg);
                        }
                      });
                    } else {
                      message.error(res.msg);
                    }
                  });
                }
              }
            } else {
              message.error('请将审核信息填写完整');
            }
          });
        } else {
          message.error('请将登记信息填写完整');
        }
      });
    } else {
      message.error('请将折叠面板打开');
    }
  };


  // 加载用户信息
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSaveClick(buttype)}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSubmit(buttype)}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  );
  return (
    <div style={{ marginTop: '-24px' }}>
      <PageHeaderWrapper
        title={pagetitle}
        extra={operations}
      >
        {/* <Spin spinning={loading} > */}
        <div className={styles.collapse}>
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            <Panel header='启停登记' key="formpanel">
              <EditContext.Provider value={{
                editable: true,
                workId: Id,
                buttype
              }}>
                <Content
                  wrappedComponentRef={ContentRef}
                  userinfo={userinfo}
                  registrat={Info.autoSoftWork}
                />
              </EditContext.Provider>
            </Panel>
            <Panel header='启停审核' key="formpanel2">
              {
                (Id && (Id !== '' || Id !== undefined)) ? (Info.autoSoftWorkExamine && (<Examine
                  wrappedComponentRef={ExmaineRef}
                  check={Info.autoSoftWorkExamine}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />)) : (<Examine
                  wrappedComponentRef={ExmaineRef}
                  check={Info.autoSoftWorkExamine}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />)
              }

            </Panel>
            {/* <Panel header="软件信息" key="formpane3">
              <SoftwareInfoList />
            </Panel> */}
          </Collapse>
        </div >
        {/* </Spin> */}
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ itsmuser, autosoftwork }) => ({
  userinfo: itsmuser.userinfo,
  Info: autosoftwork.geteditinfo,
}))(Newregist);