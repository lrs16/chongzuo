import { message } from 'antd';
import router from 'umi/router';
import {
  queryTodoList,
  openFlow,
  saveRegister,
  flowSubmit,
  saveplatformValid,
  savereleaseBizValid,
  releaseListAssign,
  savePracticePre,
  splitOrders,
  releaseListEdit
} from '../services/api';

export default {
  namespace: 'releasetodo',

  state: {
    list: {},
    info: undefined,
    currentTaskStatus: undefined,
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
      const infomap = new Map([
        ['出厂测试', response.data.register],
        ['平台验证', response.data.platformValidate],
        ['业务验证', response.data.bizValidateParam],
        ['发布实施准备', response.data.practicePreParam],
        ['版本管理员审核', response.data.checkVersionParam],
      ]);
      yield put({
        type: 'saveinfo',
        payload: { info: infomap.get(taskName), currentTaskStatus: response.data.currentTaskStatus },
      });
    },
    // 通用流转
    *releaseflow({ payload }, { call }) {
      const tabid = sessionStorage.getItem('tabid');
      const subres = yield call(flowSubmit, payload);
      if (subres.code === 200) {
        router.push({
          pathname: `/ITSM/releasemanage/registration`,
          query: { tabid, closecurrent: true }
        });
        router.push({
          pathname: `/ITSM/releasemanage/to-do`,
          query: { pathpush: true },
          state: { cach: false, }
        });
      } else {
        message.error('操作失败');
      }
    },

    // 出厂测试保存
    * factorytest({ payload: { register, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(saveRegister, register);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功')
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.saveRegister, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

    // 平台验证保存
    * platformvalid({ payload: { platform, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(saveplatformValid, platform);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.savePlatformValid, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

    // 业务验证保存
    * bizvalid({ payload: { bizValidate, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(savereleaseBizValid, bizValidate);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.saveBizValid, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error(response.msg)
      }
    },

    // 发布实施准备保存
    * implementationpre({ payload: { formValue, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(savePracticePre, formValue);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.practicePreParam, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

    // 分派，重分派
    * listassign({ payload: { values, releaseNo } }, { call, put }) {
      const response = yield call(releaseListAssign, values);
      if (response.code === 200) {
        message.success('分派成功')
        const openres = yield call(openFlow, releaseNo);
        if (openres.code === 200) {
          yield put({
            type: 'saveinfo',
            payload: { info: openres.data.bizValidateParam, currentTaskStatus: openres.data.currentTaskStatus },
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
            type: 'saveinfo',
            payload: { info: openres.data.checkVersionParam, currentTaskStatus: openres.data.currentTaskStatus },
          });
        } else {
          message.error(openres.msg)
        }
      } else {
        message.error('操作失败');
      }
    },

    // 版本管理员审核临时增加发布清单，会影响附件列表
    * checkaddlist({ payload: { values, releaseNo } }, { call, put }) {
      const response = yield call(releaseListEdit, values);
      if (response.code === 200) {
        message.success('操作成功')
        const openres = yield call(openFlow, releaseNo);
        if (openres.code === 200) {
          yield put({
            type: 'saveinfo',
            payload: { info: openres.data.checkVersionParam, currentTaskStatus: openres.data.currentTaskStatus },
          });
        } else {
          message.error(openres.msg)
        }
      } else {
        message.error('操作失败');
      }
    },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        info: undefined,
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
      };
    },
  },
};
