import React, { useState, useRef, useEffect } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Collapse, Steps, Spin, message } from 'antd';
import styles from './index.less';
import Registrat from './components/Registrat';
import Examine from './components/Examine';
import Track from './components/Track';
import Registratdes from './components/Registratdes';
import Examinedes from './components/Examinedes';
import Tracklist from './components/Tracklist';

const { Panel } = Collapse;
const { Step } = Steps;

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

function WorkOrder(props) {
  const {
    dispatch,
    location,
    records,
    info,
    userinfo,
    loading,
    type,
    ChangeType,
    changRegisterId,
    ChangeHistroyTaskId,
    ChangeISClose,
    userchoice,
    ChangeChoice,
    ChangeUserVisible,
  } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const { taskName, taskId, mainId } = location.query;
  //  const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [tracklength, setTrackLength] = useState(0);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'demand');
  }, [mainId]);
  // 回调用户ID
  useEffect(() => {
    if (info) {
      changRegisterId(info.demandForm.id); //  
      if ((taskName === '业务科室领导审核' ||
        taskName === '系统开发商审核' ||
        taskName === '自动化科业务人员确认' ||
        taskName === '需求登记人员确认') && info.historys.length > 0) {
        ChangeHistroyTaskId(info.historys?.slice(-1)[0].taskId);
      }
      ChangeISClose(info.is_close);
    }
  }, [info]);

  // 初始化历史附件
  useEffect(() => {
    if (info !== '' && info !== undefined) {
      if (taskName === '需求登记' && info.demandForm.attachment !== '[]') {
        setFiles({ ...files, arr: JSON.parse(info.demandForm.attachment) });
      }
      if (
        taskName !== '需求登记' &&
        info.historys.length > 0 &&
        info.historys?.slice(-1)[0].taskName === info.taskName
      ) {
        setFiles({ ...files, arr: JSON.parse(info.historys?.slice(-1)[0].attachment) });
      }
    }
  }, [info, taskName]);

  // 加载流程记录，加载编辑历史
  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'demandtodo/demandrecords',
        payload: {
          processId: mainId,
        },
      });
      dispatch({
        type: 'demandtodo/demandopenflow',
        payload: {
          processInstanceId: mainId,
          taskId,
        },
      });
    }
    return () => {
      dispatch({
        type: 'demandtodo/clearinfo',
      });
    }
  }, [mainId]);

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: 'demandtodo/demandrecords',
        payload: {
          processId: mainId,
        },
      });
      dispatch({
        type: 'demandtodo/demandopenflow',
        payload: {
          processInstanceId: mainId,
          taskId,
        },
      });
    }
  }, [location.state])

  // 监听info是否已更新
  useEffect(() => {
    return () => {
      ChangeChoice(false);
      ChangeUserVisible(false);
    };
  }, [info]);

  const formerr = () => {
    message.error('请将信息填写完整...');
  };

  // 刷新路由
  // 登记表单
  const RegistratRef = useRef();
  const getregistrats = () => {
    const values = RegistratRef.current.getVal();
    const formvalue = {
      ...values,
      creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
      registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
      completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
      registerId: info.demandForm.id,
      proposingDepartment:
        values.proposingDepartment !== '' ? values.proposingDepartment : values.proposingUnit,
      proposingDepartmentId:
        values.proposingDepartmentId !== '' ? values.proposingDepartmentId : values.proposingUnitID,
      attachment: JSON.stringify(files.arr),
      functionalModule: values.functionalModule.join('/'),
    };
    switch (type) {
      case 'save':
        dispatch({
          type: 'demandtodo/demandregisterupdate',
          payload: {
            paloadvalues: { ...formvalue },
            processInstanceId: mainId,
            taskId,
          },
        });
        break;
      case 'flow':
        RegistratRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else if (!userchoice) {
            ChangeUserVisible(true);
            ChangeType('');
          } else {
            dispatch({
              type: 'demandregister/startandnext',
              payload: {
                ...formvalue,
                nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
                taskId,
                mainId,
              },
            });
          }
        })
        break;
      default:
        break;
    }
  };
  // 需求审核，运维审核,需求复核表单
  const setid = () => {
    const { historys } = info;
    if (historys.length > 0 && historys?.slice(-1)[0].taskId === null) {
      return info.historys?.slice(-1)[0].id;
    }
    if (historys.length === 0 || historys?.slice(-1)[0].taskId !== null) {
      return '';
    }
    return null;
  };
  const ExamineRef = useRef();
  const getdemandexamine = () => {
    const id = setid();
    const values = ExamineRef.current.getVal();
    const formvalue = {
      ...values,
      reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
      opinion: values.result === 0 ? values.opinion2 : values.opinion1,
      business: Number(values.business),
      releases: Number(values.releases),
      attachment: JSON.stringify(files.arr),
      developmentLead: values.developmentLead && values.developmentLead.length > 0 ? values.developmentLead.toString() : '',
      registerId: info.demandForm.id,
      id,
      taskName: info.taskName,
    };
    switch (type) {
      case 'save':
        dispatch({
          type: 'demandtodo/demandsave',
          payload: {
            paloadvalues: { ...formvalue },
            processInstanceId: mainId,
            taskId,
          },
        });
        break;
      case 'flow':
        ExamineRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else if (!userchoice) {
            ChangeUserVisible(true);
            ChangeType('');
          } else {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
                taskId,
                mainId,
              },
            });
          }
        })
        break;
      case 'toflow':
        ExamineRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '', userIds: [] }],
                taskId,
                mainId,
              },
            });
          }
        })
        break;
      case 'regist':
        ExamineRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '需求登记', userIds: info.demandForm.registerPersonId.split() }],
                taskId,
                mainId,
              },
            });
          }
        })
        break;
      case 'confirm':
        ExamineRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '需求登记人员确认', userIds: [info.demandForm.registerPersonId] }],
                taskId,
                id,
                mainId,
              },
            });
          }
        })
        break;
      case 'over':
        ExamineRef.current.Forms((err) => {
          if (err) {
            formerr();
            ChangeType('');
          } else {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '', userIds: [] }],
                taskId,
                id,
                mainId,
              },
            });
          }
        })
        break;
      default:
        break;
    }
  };

  // 自动化科业务人员审核
  const nonextusrs = () => {
    const id = setid();
    const values = ExamineRef.current.getVal();
    const formvalue = {
      ...values,
      reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
      opinion: values.result === 0 ? values.opinion2 : values.opinion1,
      business: Number(values.business),
      releases: Number(values.releases),
      attachment: JSON.stringify(files.arr),
      registerId: info.demandForm.id,
      id,
      taskName: info.taskName,
    };
    switch (type) {
      case 'save':
        dispatch({
          type: 'demandtodo/demandsave',
          payload: {
            paloadvalues: { ...formvalue },
            processInstanceId: mainId,
            taskId,
          },
        });
        break;
      case 'flow':
        ExamineRef.current.Forms((err) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '', userIds: [] }],
                taskId,
                mainId,
              },
            });
          } else {
            formerr();
          }
        })
        break;
      case 'regist':
        ExamineRef.current.Forms((err) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...formvalue,
                nextUserIds: [{ nodeName: '需求登记', userIds: info.demandForm.registerPersonId.split() }],
                taskId,
                mainId,
              },
            });
          } else {
            formerr();
          }
        })
        break;
      default:
        break;
    }
  };

  // 需求跟踪
  const getdemantrack = () => {
    if (type === 'flow') {
      if (tracklength === 0) {
        message.error('请填写完整的跟踪信息。');
      } else if (!userchoice) {
        ChangeUserVisible(true);
        ChangeType('');
      } else {
        dispatch({
          type: 'demandtodo/demandnextstep',
          payload: {
            nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
            userId: sessionStorage.getItem('userauthorityid'),
            taskId,
            registerId: info.demandForm.id,
            id: info.historys[info.historys.length - 1].id,
            taskName: info.taskName,
            mainId,
          },
        });
      }

    }
  };
  const handleflow = () => {
    switch (taskName) {
      case '需求登记': {
        getregistrats();
        break;
      }
      case '业务科室领导审核':
      case '系统开发商审核':
      case '自动化科专责审核':
      case '市场部领导审核':
      case '科室领导审核':
      case '中心领导审核':
      case '自动化科业务人员确认':
      case '需求登记人员确认':
        getdemandexamine();
        break;
      case '自动化科业务人员审核':
        nonextusrs();
        break;
      case '系统开发商处理':
        getdemantrack();
        break;
      default:
        break;
    }
    ChangeType('');
  };
  useEffect(() => {
    if (type !== '') {
      handleflow();
    }
  }, [type]);

  // 请求下拉值
  useEffect(() => {
    let doCancel = false;
    if (!doCancel && taskName === '需求登记') {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: '1354274450639425537' },
      }).then(res => {
        if (res.code === 200) {
          selectdata.arr.push(...res.data);
          if (!doCancel) {
            dispatch({
              type: 'dicttree/childdictLower',
              payload: { id: '1354288354950123522' },
            }).then(ress => {
              if (ress.code === 200) {
                selectdata.arr.push(...ress.data);
                setSelectData({ ...selectdata, ischange: true });
              }
            });
          }
        }
      });
    }
    if (!doCancel && taskName !== '需求登记') {
      setSelectData({ ...selectdata, ischange: true });
    }
    return () => {
      setSelectData({ arr: [], ischange: false });
      doCancel = true;
    };
  }, [mainId]);


  // 保存删除附件驱动表单保存
  useEffect(() => {
    if (taskName === '需求登记' && files.ischange === true) {
      const values = RegistratRef.current.getVal();
      dispatch({
        type: 'demandtodo/demandregisterupdate',
        payload: {
          paloadvalues: {
            ...values,
            creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
            registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
            completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
            proposingDepartment:
              values.proposingDepartment !== ''
                ? values.proposingDepartment
                : values.proposingUnit,
            attachment: JSON.stringify(files.arr),
            functionalModule: values.functionalModule.join('/'),
            nextUserIds: [{ nodeName: '', userIds: [] }],
            id: info.demandForm.id,
          },
          processInstanceId: mainId,
          taskId,
        },
      });
      setFiles({ ...files, ischange: false });
    }
    if (taskName !== '需求登记' && taskName !== '需求跟踪' && files.ischange === true) {
      const id = setid();
      const values = ExamineRef.current.getVal();
      // ExamineRef.current.validateFields((err, values) => {
      dispatch({
        type: 'demandtodo/demandsave',
        payload: {
          paloadvalues: {
            ...values,
            reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
            opinion: values.result === 0 ? values.opinion2 : values.opinion1,
            business: Number(values.business),
            releases: Number(values.releases),
            attachment: JSON.stringify(files.arr),
            registerId: info.demandForm.id,
            id,
            taskName: info.taskName,
          },
          processInstanceId: mainId,
          taskId,
        },
      });
      // });
      setFiles({ ...files, ischange: false });
    }
  }, [files]);

  const callback = key => {
    setActiveKey(key);
  };

  return (
    <div className={styles.collapse}>
      {records !== '' && (
        <Steps
          current={records.length - 1}
          progressDot
          style={{
            background: '#fff',
            padding: 24,
            border: '1px solid #e8e8e8',
            overflowX: 'auto',
          }}
        >
          {records.map((obj, index) => {
            const desc = (
              <div>
                <div>处理人：{obj.userName}</div>
                <div>开始时间：{obj.startTime}</div>
                <div>结束时间：{obj.endTime}</div>
              </div>
            );
            return <Step title={obj.taskName} description={desc} key={index.toString()} />;
          })}
        </Steps>
      )}
      <Spin spinning={loading}>
        {loading === false && info && (
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            <Panel header={info.taskName} key="form">
              {info.taskName === '需求登记' && (
                <Registrat
                  files={info.demandForm.attachment !== '' ? JSON.parse(info.demandForm.attachment) : []}
                  ChangeFiles={newvalue => { setFiles(newvalue) }}
                  wrappedComponentRef={RegistratRef}
                  register={info.demandForm}
                  userinfo={userinfo}
                  location={location}
                  selectdata={selectdata}
                />
              )}
              {info.taskName === '业务科室领导审核' && info.historys.length === 0 && (
                <Examine
                  wrappedComponentRef={ExamineRef}
                  location={location}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="审核"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={undefined}
                  files={[]}
                  ChangeFiles={newvalue => { setFiles(newvalue) }}
                />
              )}
              {info.taskName === '业务科室领导审核' && info.historys.length > 0 && (
                <Examine
                  wrappedComponentRef={ExamineRef}
                  location={location}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="审核"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskId === null
                      ? info.historys.slice(-1)
                      : undefined
                  }
                  files={
                    info.historys?.slice(-1)[0].taskId === null
                      ? JSON.parse(info.historys?.slice(-1)[0].attachment)
                      : []
                  }
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                />
              )}
              {(info.taskName === '系统开发商审核' ||
                info.taskName === '自动化科专责审核' ||
                info.taskName === '自动化科业务人员审核' ||
                info.taskName === '科室领导审核' ||
                info.taskName === '中心领导审核' ||
                info.taskName === '市场部领导审核') && (
                  <Examine
                    wrappedComponentRef={ExamineRef}
                    location={location}
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    text="审核"
                    userinfo={userinfo}
                    taskName={info.taskName}
                    info={
                      info.historys?.slice(-1)[0].taskName === info.taskName
                        ? info.historys.slice(-1)
                        : undefined
                    }
                    files={
                      info.historys?.slice(-1)[0].taskName === info.taskName
                        ? JSON.parse(info.historys?.slice(-1)[0].attachment)
                        : []
                    }
                    ChangeFiles={newvalue => {
                      setFiles(newvalue);
                    }}
                  />
                )}
              {taskName === '系统开发商处理' && info.taskName === '系统开发商处理' && (
                <Track
                  userinfo={userinfo}
                  taskName={info.taskName}
                  taskId={info.taskId}
                  mainId={info.taskId}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                  demandId={info.demandForm.demandId}
                  ChangeTrackLength={newvalue => setTrackLength(newvalue)}
                />
              )}
              {(info.taskName === '自动化科业务人员确认' || info.taskName === '需求登记人员确认') && info.historys && info.historys.length > 0 && (
                <Examine
                  wrappedComponentRef={ExamineRef}
                  location={location}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="确认"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                  files={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? JSON.parse(info.historys?.slice(-1)[0].attachment)
                      : []
                  }
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                />
              )}
            </Panel>

            <Panel header="需求登记" key="registdes">
              <Registratdes info={info.demandForm} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />
            </Panel>

            {info && info.historys.length > 0 && info.historys.map((obj, index) => {
              // panel详情组件
              if (obj.taskName !== '系统开发商处理')
                return (
                  <Panel header={obj.taskName} key={index.toString()}>
                    <Examinedes info={obj} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />
                  </Panel>
                );
              if (obj.taskName === '系统开发商处理')
                return (
                  <Panel header={obj.taskName} key={index.toString()}>
                    <Tracklist demandId={info.demandForm.demandId} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />
                  </Panel>
                );
            })}
          </Collapse>
        )}
      </Spin>
    </div>
  );
}

export default connect(({ demandtodo, itsmuser, demandregister, loading }) => ({
  userinfo: itsmuser.userinfo,
  records: demandtodo.records,
  info: demandtodo.info,
  demandregister,
  loading: loading.models.demandtodo,
}))(WorkOrder);
