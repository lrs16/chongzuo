import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Spin, message, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SubmitTypeContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import { querkeyVal } from '@/services/api';
import { expPracticePre, deleteFlow, saveGobackMsg, getTimeoutInfo, } from './services/api';
import TimeoutModal from '../components/TimeoutModal';
import WorkOrder from './WorkOrder';
import Process from './Process';
import Backoff from './components/Backoff';
import RelationOrder from './RelationOrder';
import { saveTimeoutMsg } from '../services/api';

function ToDodetails(props) {
  const { location, dispatch, loading, loadingopen, allloading, currentTaskStatus, relationCount, submitTimes, info, uploadstatus, loadinguserloading } = props;
  const { taskName, taskId, releaseType, Id, } = location.query;
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [buttype, setButtype] = useState('');                    // 点击的按钮类型
  const [submittype, setSubmitType] = useState(1);               // 流转类型
  const [addAttaches, setAddAttaches] = useState('');
  const [saved, setSaved] = useState(false);                    // 工单保存状态
  const [Popvisible, setVisible] = useState(false);
  const [modalvisible, setModalVisible] = useState(false);
  const [butandorder, setButandOrder] = useState('');
  const [flowNode, setFlowNode] = useState([]);
  const [indexUser, setIndexUser] = useState([]);

  const dowloadPre = () => {
    expPracticePre(taskId).then(res => {
      if (res) {
        const filename = `发布实施准备${moment().format('YYYY-MM-DD HH:mm')}.docx`;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.err('下载失败');
      }
    })
  };

  const deleteflow = () => {
    const tabid = sessionStorage.getItem('tabid');
    deleteFlow({ releaseNo: Id }).then(res => {
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      };
      router.push({
        pathname: `/ITSM/releasemanage/plan/to-do`,
        query: { pathpush: true },
        state: { cach: false, closetabid: tabid }
      });
    })
  }
  const handleClose = () => {
    const tabid = sessionStorage.getItem('tabid');
    router.push({
      pathname: location.pathname,
      query: { tabid, closecurrent: true }
    });
  }

  useEffect(() => {
    querkeyVal('release', 'statu').then(res => {
      if (res.code === 200) {
        setFlowNode(res.data.statu);
        const nextnode = res.data.statu[res.data.statu.findIndex(obj => obj.val === taskName) + 1]?.val || '不对';
        querkeyVal('release', 'indexuser').then(ress => {
          if (res.code === 200) {
            const arr = ress.data.indexuser[0]?.val?.split('-')[1]?.split(',') || [];
            const name = arr.filter(obj => obj.indexOf(nextnode) > -1)
            setIndexUser(name[0]?.split(':')[1]?.split('||') || []);
          }
        });
      }
    });
  }, [taskName]);

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        settabActivekey('workorder');
        setButtype('');
        setSubmitType(1)
      };
    }
  }, [location.state]);

  useEffect(() => {
    setButtype('');
  }, [allloading])

  useEffect(() => {
    if (currentTaskStatus) {
      setSaved(currentTaskStatus.saved);
      // 获取流程图
      dispatch({
        type: 'releaseview/flowimg',
        payload: {
          processInstanceId: currentTaskStatus.processInstanceId,
        },
      });
    }
  }, [currentTaskStatus]);

  // 点击流转，出厂测试，版本管理员审核，结束
  const handleClick = (type) => {
    getTimeoutInfo({ taskId }).then(res => {
      if (res.code === 200 && res.data.todoTask) {
        if (res.data.timeout && !res.data.reason) {
          message.info(res.data.msg);
          setModalVisible(true);
          setButandOrder(type);
        };
        if ((res.data.timeout && res.data.reason) || !res.data.timeout) {
          setButtype(type);
        };
      } else {
        message.error('操作失败');
        const tabid = sessionStorage.getItem('tabid');
        router.push({
          pathname: `/ITSM/releasemanage/plan/to-do`,
          query: { pathpush: true },
          state: { cach: false, closetabid: tabid }
        });
      };
    })
  };


  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    if (currentTaskStatus && currentTaskStatus.processInstanceId) {
      saveTimeoutMsg({
        taskId,
        msgType: 'timeout',
        orderId: currentTaskStatus.processInstanceId,
        orderType: 'release',
        ...v
      }).then(res => {
        switch (butandorder) {
          case 'save':
            break;
          case 'goback':
            setVisible(true);
            break;
          default:
            if (res.code === 200) {
              setButtype(butandorder)
            }
            break;
        }
      });
    }
  }

  // 点击回退按钮
  const handleGoback = () => {
    if ((taskName === '版本管理员审核' || taskName === '科室负责人审核' || taskName === '中心领导审核') && info && info.releaseMains && info.releaseMains.length > 1) {
      const orderkeyAndTimeout = info && info.releaseMains && info.releaseMains.filter(item => item.timeoutResult && item.timeoutResult.timeout && !item.timeoutResult.reason);
      if (orderkeyAndTimeout.length > 0) {
        message.error('有工单已超时且没有填写超时原因')
      } else {
        setVisible(true);
      }
    } else {
      getTimeoutInfo({ taskId }).then(res => {
        if (res.code === 200 && res.data.todoTask) {
          if (res.data.timeout && !res.data.reason) {
            message.info(res.data.msg);
            setModalVisible(true);
            setButandOrder('goback');
          };
          if ((res.data.timeout && res.data.reason) || !res.data.timeout) {
            setVisible(true);
          }
        } else {
          message.error('操作失败！');
          const tabid = sessionStorage.getItem('tabid');
          router.push({
            pathname: `/ITSM/releasemanage/plan/to-do`,
            query: { pathpush: true },
            state: { cach: false, closetabid: tabid }
          });
        }
      })
    }
  };

  // 向接口保存回退原因
  const postRollBackmsg = (values) => {
    saveGobackMsg({
      ...values,
      taskId,
      msgType: 'fallback',
      orderId: currentTaskStatus.processInstanceId,
      orderType: 'release',
    }).then(res => {
      if (res.code === 200) {
        dispatch({
          type: 'releasetodo/releaseflow',
          payload: {
            taskId,
            type: 2,
            userIds: '',
          },
        });
      } else {
        message.error(res.msg || '操作失败！');
        const tabid = sessionStorage.getItem('tabid');
        router.push({
          pathname: `/ITSM/releasemanage/plan/to-do`,
          query: { pathpush: true },
          state: { cach: false, closetabid: tabid }
        });
      }
    })
  };

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: 'workorder',
      tab: '发布工单',
    },
    {
      key: 'process',
      tab: '发布流程',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];
  const editiontabList = [
    {
      key: 'workorder',
      tab: '发布工单',
    },
  ];

  const operations = (
    <>
      {tabActivekey === 'workorder' && (
        <>
          {taskName === '出厂测试' && relationCount === 0 && submitTimes === 0 && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => deleteflow()} disabled={uploadstatus || allloading}>
              删除
            </Button>
          )}
          {!saved && taskName !== '出厂测试' && taskName !== '开发商项目经理审核' && taskName !== '发布验证' && taskName !== '业务复核' && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => { handleGoback() }} disabled={uploadstatus || allloading}>
              回退
            </Button>
          )}
          {taskName === '发布实施准备' && (
            <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => dowloadPre()} disabled={uploadstatus || allloading}>
              导出
            </Button>
          )}
          <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => setButtype('save')} disabled={uploadstatus || allloading}>
            保存
          </Button>
          {submittype === 1 && (
            <>{(taskName === '开发商项目经理审核' || taskName === '版本管理员审核' || taskName === '科室负责人审核' || taskName === '中心领导审核') && info && info.releaseMains && info.releaseMains.length > 1 ? (
              <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => { setButtype('') }} onClick={() => setButtype('flow')} disabled={uploadstatus || allloading}>
                流转至{flowNode[flowNode.findIndex(obj => obj.val === taskName) + 1]?.val || ''}
              </Button>
            ) : (
              <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => handleClick('flow')} disabled={uploadstatus || allloading}>
                {taskName === '业务复核' ? '' : '流转至'}{taskName === '业务复核' ? '结束' : (flowNode[flowNode.findIndex(obj => obj.val === taskName) + 1]?.val || '')}
              </Button>
            )}
            </>
          )}
          {taskName === '出厂测试' && submitTimes !== undefined && submitTimes !== 0 && (
            <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => handleClick('over')} disabled={uploadstatus || allloading}>
              结束
            </Button>
          )}
          {((submittype === 0 && (taskName === '平台验证' || taskName === '开发商项目经理审核')) || (submittype === 3 && (taskName === '发布实施准备' || taskName === '系统运维商经理审核'))) && (
            <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => handleClick('noPass')} disabled={uploadstatus || allloading}>
              出厂测试
            </Button>
          )}
          {submittype === 0 && (taskName === '科室负责人审核' || taskName === '中心领导审核') && (
            <Button type="primary" style={{ marginRight: 8 }} onMouseDown={() => setButtype('')} onClick={() => handleClick('noPass')} disabled={uploadstatus || allloading}>
              版本管理员审核
            </Button>
          )}
        </>)}
      <Button onClick={() => handleClose()} disabled={uploadstatus || allloading}>关闭</Button>
    </>
  )

  return (
    <Spin tip="正在加载数据..." spinning={(!!loading || !!loadingopen || !!loadinguserloading)}>
      <PageHeaderWrapper
        title={taskName}
        extra={operations}
        tabList={taskName === '版本管理员审核' && info && info.releaseMains && info.releaseMains.length > 1 ? editiontabList : tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        <div className='noexplain'>
          {tabActivekey === 'workorder' && (
            <SubmitTypeContext.Provider value={{
              submittype,
              taskId,
              ChangeSubmitType: (v => setSubmitType(v)),
              ChangeButtype: (v => setButtype(v)),
              addAttaches,                                   // 清单临时添加，fasle文档列表不需要加列，true文档列表需要加列
              ChangeaddAttaches: (v => setAddAttaches(v)),
              saved,
              releaseType,
              location,
            }}>
              <WorkOrder location={location} buttype={buttype} indexUser={indexUser} />
            </SubmitTypeContext.Provider>
          )}
          {tabActivekey === 'process' && (<Process />)}
          {tabActivekey === 'relevancy' && currentTaskStatus && currentTaskStatus.processInstanceId && <RelationOrder relation mainId={currentTaskStatus.processInstanceId} />}
        </div>
      </PageHeaderWrapper>
      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
      <Backoff
        title="填写回退意见"
        visible={Popvisible}
        ChangeVisible={v => setVisible(v)}
        rollbackSubmit={v => postRollBackmsg(v)}
        lastNode={flowNode[flowNode.findIndex(obj => obj.val === taskName) - 1]?.val || ''}
      />
    </Spin>
  );
}

export default connect(({ releasetodo, releaseview, viewcache, itsmuser, loading }) => ({
  info: releasetodo.info,
  relationCount: releasetodo.relationCount,
  submitTimes: releasetodo.submitTimes,
  currentTaskStatus: releasetodo.currentTaskStatus,
  uploadstatus: viewcache.uploadstatus,
  userlist: itsmuser.userlist,
  loading: loading.effects['releasetodo/releaseflow'],
  loadingopen: loading.effects['releasetodo/openflow'],
  loadinguserloading: loading.effects['itsmuser/releaseuserlist'],
  allloading: loading.models.releasetodo,
}))(ToDodetails);