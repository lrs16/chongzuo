import { message } from 'antd';
import router from 'umi/router';
import {
  queryTodoList,
  openFlow,
  saveRegister,
  flowSubmit,
  saveDevmanageCheck,
  saveplatformValid,
  saveDevopsCheck,
  savereleaseBizValid,
  releaseListAssign,
  savePracticePre,
  splitOrders,
  releaseListEdit,
  releaseListDel,
  saveCheckVersion,
  saveCheckDirector,
  saveCheckLeader,
  savePracticeDone,
  saveBizCheck,
  attachBatchEdit,
  getTimeoutInfo,
} from '../services/api';

const closeTab = () => {
  const tabid = sessionStorage.getItem('tabid');
  router.push({
    pathname: `/ITSM/releasemanage/plan/to-do`,
    query: { pathpush: true },
    state: { cach: false, closetabid: tabid }
  });
}

const toSubmit = (subres) => {
  if (subres.code === 200) {
    message.success('操作成功');
  } else {
    message.error(subres.res);
  };
  closeTab();
};



export default {
  namespace: 'releasetodo',

  state: {
    list: {},
    info: undefined,
    currentTaskStatus: undefined,
    tasklinks: undefined,
    statuse: -1,
    relationCount: undefined,
    submitTimes: undefined,
    timeoutinfo: undefined,
    processLinks: undefined,
  },

  effects: {
    // 清除state
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
    // 列表
    *fetchlist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(queryTodoList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 打开待办
    *openflow({ payload: { releaseNo, taskName } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openFlow, releaseNo);
      if (response.code === 200) {
        const infomap = new Map([
          ['出厂测试', response.data.register],
          ['开发商项目经理审核', response.data.devmanageCheck],
          ['平台验证', response.data.platformValidate],
          ['系统运维商经理审核', response.data.devopsCheck],
          ['业务验证', response.data.bizValidateParam],
          ['发布实施准备', response.data.practicePreParam],
          ['版本管理员审核', response.data.checkVersionParam],
          ['科室负责人审核', response.data.checkDirectorParam],
          ['中心领导审核', response.data.checkLeaderParam],
          ['发布验证', response.data.practiceDoneParam],
          ['业务复核', response.data.bizCheckParam],
        ]);
        yield put({
          type: 'saveinfo',
          payload: {
            info: infomap.get(taskName),
            currentTaskStatus: response.data.currentTaskStatus,
            tasklinks: response.data.tasklinks,
            relationCount: response.data.relationCount,
            submitTimes: response.data.submitTimes,
            processLinks: response.data.processLinks,
          },
        });
      } else {
        message.error(response.msg || '操作失败！')
      };
    },

    // 通用流转,回退
    *releaseflow({ payload }, { call }) {
      const subres = yield call(flowSubmit, payload);
      if (subres.code === 200) {
        message.success('操作成功');
      } else {
        message.error(subres.msg);
      };
      closeTab();
    },

    // 出厂测试保存,结束,流转
    * factorytest({ payload: { register, buttype, submitval } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(saveRegister, register);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        yield put({
          type: 'updateinfo',
          payload: { info: response.data.saveRegister, currentTaskStatus: response.data.currentTaskStatus, },
        });
        if (buttype === 'save') {
          message.success('保存成功');
        };
        if (buttype === 'over') {
          const overpayload = {
            taskId: response.data.currentTaskStatus.taskId,
            type: 4,
          };
          const subres = yield call(flowSubmit, overpayload);
          toSubmit(subres)
        };
      } else {
        message.error(response.msg || '操作失败！');
      }
    },

    // 开发商项目经理审核,系统运维商经理审核
    * check({ payload: { examineform, buttype, submitval, taskName } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      let response = {};
      if (taskName === '开发商项目经理审核') {
        response = yield call(saveDevmanageCheck, examineform);
      } else {
        response = yield call(saveDevopsCheck, examineform);
      }
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        const infomap = new Map([
          ['开发商项目经理审核', response.data.saveDevmanageCheck],
          ['系统运维商经理审核', response.data.saveDevopsCheck],
        ])
        yield put({
          type: 'updateinfo',
          payload: { info: infomap.get(taskName), currentTaskStatus: response.data.currentTaskStatus, },
        });
        if (buttype === 'noPass') {
          const subres = yield call(flowSubmit, submitval);
          toSubmit(subres);
        };
        // if (buttype === 'flow') {
        //   const subres = yield call(flowSubmit, submitval);
        //   toSubmit(subres);
        // }
      } else {
        message.error(response.msg || '操作失败');
        closeTab();
      }
    },

    // 平台验证保存
    * platformvalid({ payload: { platform, buttype, submitval } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(saveplatformValid, platform);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        yield put({
          type: 'updateinfo',
          payload: { info: response.data.savePlatformValid, currentTaskStatus: response.data.currentTaskStatus, },
        });
        if (buttype === 'save') {
          message.success('保存成功');
        };
        if (buttype === 'noPass') {
          const subres = yield call(flowSubmit, submitval);
          toSubmit(subres);
        };
      } else {
        message.error(response.msg || '操作失败！');
        closeTab();
      }
    },

    // 业务验证保存流转
    * bizvalid({ payload: { bizValidate, buttype, userIds, taskId } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(savereleaseBizValid, bizValidate);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'updateinfo',
          payload: { info: response.data.saveBizValid, currentTaskStatus: response.data.currentTaskStatus },
        });
        // if (buttype === 'flow') {
        //   // const nopasspayload = {
        //   //   taskId: response.data.currentTaskStatus.taskId,
        //   //   type: 3,
        //   // };
        //   const flowpayload = {
        //     taskId,
        //     type: 1,
        //     userIds,
        //   };
        //   const subres = yield call(flowSubmit, flowpayload);
        //   toSubmit(subres);
        // };
      } else {
        message.error(response.msg || '操作失败！');
        closeTab();
      }
    },

    // 发布实施准备保存
    * implementationpre({ payload: { formValue, buttype, submitval } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(savePracticePre, formValue);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        yield put({
          type: 'updateinfo',
          payload: { info: response.data.practicePreParam, currentTaskStatus: response.data.currentTaskStatus, },
        });
        if (buttype === 'save') {
          message.success('保存成功');
        };
        if (buttype === 'noPass') {
          const flowpayload = {
            ...submitval,
            userIds: '',
          }
          const subres = yield call(flowSubmit, flowpayload);
          toSubmit(subres)
        }
      } else {
        message.error(response.msg || '操作失败！');
        closeTab();
      };
      return response.code
    },

    // 分派，重分派
    * listassign({ payload: { values, releaseNo } }, { call, put }) {
      const response = yield call(releaseListAssign, values);
      if (response.code === 200 && response.data && response.data.todo && response.data.todo.todoCode) {
        message.success('分派成功')
        const openres = yield call(openFlow, releaseNo);
        if (openres.code === 200) {
          yield put({
            type: 'updateinfo',
            payload: { info: openres.data.bizValidateParam, currentTaskStatus: openres.data.currentTaskStatus, },
          });
        } else {
          message.error(openres.msg)
        }
      } else {
        message.error('操作失败');
      }
    },
    // 取消工单合并
    * cancelmerge({ payload: { values, flowId } }, { call, put }) {
      const response = yield call(splitOrders, values);
      if (response.code === 200) {
        message.success('操作成功')
        const openres = yield call(openFlow, flowId);
        if (openres.code === 200) {
          yield put({
            type: 'updateinfo',
            payload: { info: openres.data.checkVersionParam, currentTaskStatus: openres.data.currentTaskStatus, },
          });
        } else {
          message.error(openres.msg)
        }
      } else {
        message.error(response.res);
      }
    },

    // 版本管理员审核临时增加发布清单，会影响附件列表
    // * checkaddlist({ payload: { values, releaseNo } }, { call, put }) {
    //   const response = yield call(releaseListEdit, values);
    //   if (response.code === 200) {
    //     message.success('操作成功')
    //     const openres = yield call(openFlow, releaseNo);
    //     if (openres.code === 200) {
    //       yield put({
    //         type: 'saveinfo',
    //         payload: { info: openres.data.checkVersionParam, currentTaskStatus: openres.data.currentTaskStatus },
    //       });
    //     } else {
    //       message.error(openres.msg)
    //     }
    //   } else {
    //     message.error('操作失败');
    //   }
    // },

    // 版本管理员审核时删除发布清单，会影响附件列表
    // * checkdeletlist({ payload: { values, releaseNo } }, { call, put }) {
    //   const response = yield call(releaseListDel, values);
    //   if (response.code === 200) {
    //     message.success('操作成功')
    //     const openres = yield call(openFlow, releaseNo);
    //     if (openres.code === 200) {
    //       yield put({
    //         type: 'saveinfo',
    //         payload: { info: openres.data.checkVersionParam, currentTaskStatus: openres.data.currentTaskStatus },
    //       });
    //     } else {
    //       message.error(openres.msg)
    //     }
    //   } else {
    //     message.error('操作失败');
    //   }
    // },

    // 版本管理员审核，科室负责人审核,中心领导审核
    * checkversion({ payload: { values, releaseAttaches, buttype, releaseNo, taskName, taskId } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      let response = {};
      const attres = yield call(attachBatchEdit, releaseAttaches);    // 先保存附件
      if (attres) {
        if (taskName === '版本管理员审核') {
          response = yield call(saveCheckVersion, values);        // 再保存表单
        };
        if (taskName === '科室负责人审核') {
          response = yield call(saveCheckDirector, values);        // 再保存表单
        };
        if (taskName === '中心领导审核') {
          response = yield call(saveCheckLeader, values);        // 再保存表单
        };
        yield put({
          type: 'savestatuse',
          payload: { statuse: response.code },
        });
        if (response.code === 200) {
          if (buttype === 'save') {
            message.success('操作成功');
            const openres = yield call(openFlow, releaseNo);           // 最后打开待办
            if (openres.code === 200) {
              const infomap = new Map([
                ['版本管理员审核', openres.data.checkVersionParam],
                ['科室负责人审核', openres.data.checkDirectorParam],
                ['中心领导审核', openres.data.checkLeaderParam],
              ]);
              yield put({
                type: 'updateinfo',
                payload: { info: infomap.get(openres.data.currentTaskStatus.taskName), currentTaskStatus: openres.data.currentTaskStatus, },
              });
            } else {
              message.error(openres.msg)
            }
          };
          if (buttype === 'noPass') {
            const nopasspayload = {
              taskId,
              type: taskName === '中心领导审核' ? 3 : 0,
            };
            const subres = yield call(flowSubmit, nopasspayload);
            toSubmit(subres)
          };
          // if (buttype === 'flow' && taskName === '中心领导审核') {
          //   const nopasspayload = {
          //     taskId,
          //     type: 1,
          //   };
          //   const subres = yield call(flowSubmit, nopasspayload);
          //   toSubmit(subres)
          // };
          // if (buttype === 'flow' && (taskName === '版本管理员审核' || taskName === '科室负责人审核')) {
          //   const flowpayload = {
          //     taskId,
          //     type: 1,
          //     userIds,
          //   };
          //   const subres = yield call(flowSubmit, flowpayload);
          //   toSubmit(subres)
          // };
        } else {
          message.error(response.msg || '操作失败！');
          closeTab();
        }
      }
    },

    // 发布验证
    * racticedone({ payload: { practicedoneparam, buttype, userIds, taskId } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(savePracticeDone, practicedoneparam);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
          yield put({
            type: 'updateinfo',
            payload: { info: response.data.saveRegister, currentTaskStatus: response.data.currentTaskStatus, },
          });
        };
        // if (buttype === 'flow') {
        //   const flowpayload = {
        //     taskId,
        //     type: 1,
        //     userIds,
        //   };
        //   const subres = yield call(flowSubmit, flowpayload);
        //   toSubmit(subres)
        // }
      } else {
        message.error(response.msg || '操作失败！');
        closeTab();
      };
    },

    // 业务复核
    * bizcheck({ payload: { bizcheckparam, buttype, taskId } }, { call, put }) {
      yield put({
        type: 'savestatuse',
        payload: { statuse: -1 },
      });
      const response = yield call(saveBizCheck, bizcheckparam);
      yield put({
        type: 'savestatuse',
        payload: { statuse: response.code },
      });
      if (response.code === 200) {
        yield put({
          type: 'updateinfo',
          payload: { info: response.data.bizCheckParam, currentTaskStatus: response.data.currentTaskStatus, },
        });
        if (buttype === 'save') {
          message.success('保存成功');
        };
        if (buttype === 'flow') {
          const nopasspayload = {
            taskId,
            type: 1,
          };
          const subres = yield call(flowSubmit, nopasspayload);
          toSubmit(subres)
        }
      } else {
        message.error(response.msg || '操作失败！')
        closeTab();
      }
    },
    // 获取超时信息
    * gettimeoutinfo({ payload }, { call, put }) {
      const response = yield call(getTimeoutInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'savetimeoutinfo',
          payload: response.data.msg,
        });
      } else {
        message.error(response.msg || '操作失败！')
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        info: undefined,
        currentTaskStatus: undefined,
        tasklinks: undefined,
        statuse: -1,
        relationCount: undefined,
        submitTimes: undefined,
        timeoutinfo: undefined,
        processLinks: undefined,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload.info || {},
        currentTaskStatus: action.payload.currentTaskStatus || {},
        tasklinks: action.payload.tasklinks || [],
        relationCount: action.payload.relationCount,
        submitTimes: action.payload.submitTimes,
        processLinks: action.payload.processLinks || [],
      };
    },
    updateinfo(state, action) {
      return {
        ...state,
        info: action.payload.info || {},
        currentTaskStatus: action.payload.currentTaskStatus || {},
      };
    },
    savestatuse(state, action) {
      return {
        ...state,
        statuse: action.payload.statuse,
      };
    },
    savetimeoutinfo(state, action) {
      return {
        ...state,
        timeoutinfo: action.payload,
      };
    },

  },
};
