import React, { useState, useRef, useEffect, useContext } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Collapse, Steps, Spin, message, Table } from 'antd';
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
    ChangeHistroyLength,
  } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const { taskName, taskId, mainId } = location.query;
  //  const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [tracklength, setTrackLength] = useState(0);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [isnew, setIsNew] = useState(false);

  // 监听info是否已更新
  useEffect(() => {
    if (info !== '') {
      setIsNew(true);
    }
    return () => {
      setIsNew(false);
    };
  }, [info]);

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'demand');
  }, []);
  // 回调用户ID
  useEffect(() => {
    if (info !== '') {
      changRegisterId(info.demandForm.id);
      ChangeHistroyLength(info.historys.length);
    }
  }, [info]);

  // 初始化历史附件
  useEffect(() => {
    if (info !== '') {
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
  }, [info]);

  // 加载流程记录，加载编辑历史
  useEffect(() => {
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
  }, [mainId]);

  const formerr = () => {
    message.error('请将信息填写完整...');
  };

  // 刷新路由
  // 登记表单
  const RegistratRef = useRef(null);
  const getregistrats = () => {
    if (type === 'save') {
      const values = RegistratRef.current.getFieldsValue();
      dispatch({
        type: 'demandtodo/demandregisterupdate',
        payload: {
          paloadvalues: {
            ...values,
            creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
            registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
            completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
            attachment: JSON.stringify(files.arr),
            functionalModule: values.functionalModule.join('/'),
            nextUserIds: [{ nodeName: '', userIds: [] }],
            id: info.demandForm.id,
          },
          processInstanceId: mainId,
          taskId,
        },
      });
    }
    if (type === 'flow') {
      RegistratRef.current.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'demandregister/startandnext',
            payload: {
              ...values,
              creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
              registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
              completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
              attachment: JSON.stringify(files.arr),
              functionalModule: values.functionalModule.join('/'),
              nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
              // nextUser: sessionStorage.getItem('userName'),
              taskId,
            },
          });
        } else {
          formerr();
        }
      });
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
    switch (type) {
      case 'save':
        ExamineRef.current.validateFields((err, values) => {
          dispatch({
            type: 'demandtodo/demandsave',
            payload: {
              paloadvalues: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
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
        });
        break;
      case 'flow':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                business: Number(values.business),
                releases: Number(values.releases),
                attachment: JSON.stringify(files.arr),
                nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
                registerId: info.demandForm.id,
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
        break;
      case 'regist':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                business: Number(values.business),
                releases: Number(values.releases),
                attachment: JSON.stringify(files.arr),
                nextUserIds: [
                  { nodeName: '需求登记', userIds: info.demandForm.registerPersonId.split() },
                ],
                registerId: info.demandForm.id,
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
        break;
      case 'confirm':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                business: Number(values.business),
                releases: Number(values.releases),
                attachment: JSON.stringify(files.arr),
                nextUserIds: [
                  { nodeName: '需求登记人员确认', userIds: [info.demandForm.registerPersonId] },
                ],
                registerId: info.demandForm.id,
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
        break;
      case 'over':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                attachment: JSON.stringify(files.arr),
                registerId: info.demandForm.id,
                nextUserIds: [{ nodeName: '', userIds: [] }],
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
        break;
      default:
        break;
    }
  };

  // 自动化科业务人员审核
  const nonextusrs = () => {
    const id = setid();
    switch (type) {
      case 'save':
        ExamineRef.current.validateFields((err, values) => {
          dispatch({
            type: 'demandtodo/demandsave',
            payload: {
              paloadvalues: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
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
        });
        break;
      case 'flow':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                business: Number(values.business),
                releases: Number(values.releases),
                attachment: JSON.stringify(files.arr),
                nextUserIds: [{ nodeName: '', userIds: [] }],
                registerId: info.demandForm.id,
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
        break;
      case 'regist':
        ExamineRef.current.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'demandtodo/demandnextstep',
              payload: {
                ...values,
                reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
                business: Number(values.business),
                releases: Number(values.releases),
                attachment: JSON.stringify(files.arr),
                nextUserIds: [
                  { nodeName: '需求登记', userIds: info.demandForm.registerPersonId.split() },
                ],
                registerId: info.demandForm.id,
                id,
                taskName: info.taskName,
                taskId,
              },
            });
          } else {
            formerr();
          }
        });
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
        return;
      }
      dispatch({
        type: 'demandtodo/demandnextstep',
        payload: {
          nextUserIds: JSON.parse(sessionStorage.getItem('NextflowUserId')),
          userId: sessionStorage.getItem('userauthorityid'),
          taskId,
          registerId: info.demandForm.id,
          id: info.historys[info.historys.length - 1].id,
          taskName: info.taskName,
        },
      });
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
      case '自动化科负责人确认':
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

  // 保存删除附件驱动表单保存
  useEffect(() => {
    if (taskName === '需求登记' && files.ischange === true) {
      RegistratRef.current.validateFields((err, values) => {
        dispatch({
          type: 'demandtodo/demandregisterupdate',
          payload: {
            paloadvalues: {
              ...values,
              creationTime: values.creationTime.format('YYYY-MM-DD HH:mm:ss'),
              registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
              completeTime: values.completeTime.format('YYYY-MM-DD HH:mm:ss'),
              attachment: JSON.stringify(files.arr),
              functionalModule: values.functionalModule.join('/'),
              nextUserIds: [{ nodeName: '', userIds: [] }],
              id: info.demandForm.id,
            },
            processInstanceId: mainId,
            taskId,
          },
        });
      });
      setFiles({ ...files, ischange: false });
    }
    if (taskName !== '需求登记' && taskName !== '需求跟踪' && files.ischange === true) {
      const id = setid();
      ExamineRef.current.validateFields((err, values) => {
        dispatch({
          type: 'demandtodo/demandsave',
          payload: {
            paloadvalues: {
              ...values,
              reviewTime: values.reviewTime.format('YYYY-MM-DD HH:mm:ss'),
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
      });
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
        {loading === false && info !== '' && isnew && (
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            <Panel header={info.taskName} key="form">
              {info.taskName === '需求登记' && (
                <Registrat
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  files={
                    info.demandForm.attachment !== '' ? JSON.parse(info.demandForm.attachment) : []
                  }
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                  ref={RegistratRef}
                  register={info.demandForm}
                  userinfo={userinfo}
                  location={location}
                />
              )}
              {info.taskName === '业务科室领导审核' && info.historys.length === 0 && (
                <Examine
                  ref={ExamineRef}
                  location={location}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="审核"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={undefined}
                  files={[]}
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                />
              )}
              {info.taskName === '业务科室领导审核' && info.historys.length > 0 && (
                <Examine
                  ref={ExamineRef}
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
                info.taskName === '市场部领导审核') && (
                <Examine
                  ref={ExamineRef}
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
              {taskName === '系统开发商处理' && info.taskName !== undefined && (
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
              {(info.taskName === '自动化科负责人确认' || info.taskName === '需求登记人员确认') && (
                <Examine
                  ref={ExamineRef}
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
              <Registratdes info={info.demandForm} />
            </Panel>

            {info.historys.map((obj, index) => {
              // panel详情组件
              if (obj.taskName !== '系统开发商处理')
                return (
                  <Panel header={obj.taskName} key={index.toString()}>
                    <Examinedes info={obj} />
                  </Panel>
                );
              if (obj.taskName === '系统开发商处理')
                return (
                  <Panel header={obj.taskName} key={index.toString()}>
                    <Tracklist demandId={info.demandForm.demandId} />
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
